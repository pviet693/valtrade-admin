import Head from 'next/head';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import * as common from './../../../utils/common';
import api from './../../../utils/backend-api.utils';
import { SellerItem } from './../../../models/seller.model';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Moment from 'moment';
import Button from '@material-ui/core/Button';
import LoadingBar from "react-top-loading-bar";
Moment.locale('en');

const Seller = () => {
    const router = useRouter();
    const [sellers, setSellers] = useState([]);
    const [dateFilter, setDateFilter] = useState(null);
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const dt = useRef(null);

    const filterDate = (value, filter) => {
        if (filter === undefined || filter === null || (typeof filter === 'string' && filter.trim() === '')) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return value === Moment(filter).format('DD/MM/yyyy');
    }

    const renderDateFilter = () => {
        return (
            <Calendar value={dateFilter} onChange={onDateFilterChange} dateFormat="dd/mm/yy" placeholder="dd/mm/yyyy" id="pr_id_15" />
        );
    }

    const renderActionFilter = () => {
        return (
            <input type="text" className="p-inputtext p-component p-column-filter" disabled></input>
        );
    }

    const onDateFilterChange = (event) => {
        if (event.value !== null)
            dt.current.filter(Moment(event.value).format('DD/MM/yyyy'), 'date', 'equals');
        else
            dt.current.filter(null, 'date', 'equals');

        setDateFilter(event.value);
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <button type="button" className="btn btn-danger mr-2" onClick={() => deleteSeller(rowData.id)}><i className="fa fa-trash-o" aria-hidden></i> Xóa</button>
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Chi tiết</button>
            </div>
        );
    }

    const deleteSeller = (id) => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn xóa người bán này?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const res = await api.adminSeller.delete(id);
                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                let newListSellers = sellers.filter(x => x.id !== id);
                                setSellers(newListSellers);
                                common.Toast('Xóa người bán thành công.', 'success');
                            } else {
                                common.Toast('Xóa người bán thất bại.', 'error');
                            }
                        }
                    } catch(error) {
                        setIsLoading(false);
                        common.Toast(error, 'error');
                    }
                }
            });
    }

    const actionAcceptTemplate = (rowData) =>{
        return (
            <div className="d-flex justify-content-center align-items-center w-100">
            { 
                rowData.accept ? ( 
                    <Button
                        className="accept"
                        disabled
                    >
                        Đã phê duyệt
                    </Button>
                ) : (
                    <Button
                        className="waitAccept"
                        disabled
                    >
                        Chờ phê duyệt
                    </Button>
                )
            }
        </div>
        )
    }

    const viewDetail = (id) => {
        router.push(`/manage/seller/detail/${id}`);
    }

    useEffect(async () => {
        try {
            const res = await api.adminSeller.getList();
            // console.log(res);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let listSellers = [];
                    res.data.result.map(x => {
                        let seller = new SellerItem();
                        seller.id = x._id || "";
                        seller.name = x.nameOwner || "";
                        seller.phone = x.phone || "";
                        seller.email = x.email || "";
                        seller.address = x.address || "";
                        seller.shop_name = x.nameShop || "";
                        seller.accept = x.accept;
                        seller.birthday = x.birthday || "";

                        listSellers.push(seller);
                    })
                    setSellers(listSellers);
                } else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.Toast(res.data.message, 'error');
                }
            }
        } catch(error) {
            common.Toast(error, 'error');
        }
    }, []);

    const dateFilterElement = renderDateFilter();
    const actionFilterElement = renderActionFilter();

    return (
        <>
            <Head>
                <title>Quản lí người bán</title>
            </Head>
            <div className="seller-list-container">
                <div className="seller-list-title">
                    Danh sách người bán
                </div>
                <div className="seller-list-content">
                    <div className="seller-list-table">
                        <DataTable value={sellers}
                            ref={dt}
                            paginator rows={10} emptyMessage="Không có kết quả" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="name" header="Họ và tên" sortable filter filterPlaceholder="Nhập tên"></Column>
                            <Column field="address" header="Địa chỉ" sortable filter filterPlaceholder="Nhập địa chỉ" ></Column>
                            <Column field="phone" header="Số điện thoại" sortable filter filterPlaceholder="Nhập số điện thoại"></Column>
                            <Column field="email" header="Email" sortable filter filterPlaceholder="Nhập email" ></Column>
                            <Column field="accept" header="Trạng thái" body={actionAcceptTemplate} headerStyle={{ width: '11em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} headerStyle={{ width: '12em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Seller;