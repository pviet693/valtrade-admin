import Head from 'next/head';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import * as common from './../../../utils/common';
import api from './../../../utils/backend-api.utils';
import { SellerItem } from './../../../models/seller.model';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Moment from 'moment';
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
                <button type="button" className="btn btn-danger mr-2" onClick={() => deleteSeller(rowData.id)}><i className="fa fa-trash-o" aria-hidden></i> X??a</button>
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Chi ti???t</button>
            </div>
        );
    }

    const deleteSeller = (id) => {
        common.ConfirmDialog('X??c nh???n', 'B???n mu???n x??a ng?????i b??n n??y?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const res = await api.adminSeller.delete(id);
                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                let newListSellers = sellers.filter(x => x.id !== id);
                                setSellers(newListSellers);
                                common.Toast('X??a ng?????i b??n th??nh c??ng.', 'success');
                            } else {
                                common.Toast('X??a ng?????i b??n th???t b???i.', 'error');
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
                    <button className="accept" disabled>???? ph?? duy???t</button>
                ) : (
                    <button className="waitAccept" disabled>Ch??? ph?? duy???t</button>
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
                    let message = res.data.message || "C?? l???i x???y ra vui l??ng th??? l???i sau.";
                    common.Toast(message, 'error');
                }
            }
        } catch(error) {
            common.Toast(error, 'error');
        }
    }, []);

    const dateFilterElement = renderDateFilter();
    const actionFilterElement = renderActionFilter();

    const onRefresh = async () => {
        refLoadingBar.current.continuousStart();
        try {
            const res = await api.adminSeller.getList();
            refLoadingBar.current.complete();
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
                    let message = res.data.message || "C?? l???i x???y ra vui l??ng th??? l???i sau.";
                    common.Toast(message, 'error');
                }
            }
        } catch (error) {
            common.Toast(error, 'error');
        }
    }

    const header = (
        <Button icon="pi pi-refresh" onClick={onRefresh} />
    )


    return (
        <>
            <Head>
                <title>Qu???n l?? ng?????i b??n</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="seller-list-container">
                <div className="seller-list-title">
                    Danh s??ch ng?????i b??n
                </div>
                <div className="seller-list-content">
                    <div className="seller-list-table">
                        <DataTable value={sellers} header={header}
                            ref={dt}
                            paginator rows={10} emptyMessage="Kh??ng c?? k???t qu???" currentPageReportTemplate="{first} ?????n {last} c???a {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="name" header="H??? v?? t??n" sortable filter filterPlaceholder="Nh???p t??n"></Column>
                            <Column field="address" header="?????a ch???" sortable filter filterPlaceholder="Nh???p ?????a ch???" ></Column>
                            <Column field="phone" header="S??? ??i???n tho???i" sortable filter filterPlaceholder="Nh???p s??? ??i???n tho???i"></Column>
                            <Column field="email" header="Email" sortable filter filterPlaceholder="Nh???p email" ></Column>
                            <Column field="accept" header="Tr???ng th??i" body={actionAcceptTemplate} headerStyle={{ width: '11em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                            <Column field="action" header="Thao t??c" body={actionBodyTemplate} headerStyle={{ width: '12em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Seller;