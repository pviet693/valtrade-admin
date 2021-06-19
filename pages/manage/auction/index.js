import Head from 'next/head';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import NoneFilter from '../../../components/NoneFilter';
import HeaderTable from '../../../components/HeaderTable';
import * as common from './../../../utils/common';
import api from './../../../utils/backend-api.utils';
import { ProductModel } from './../../../models/product.model';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Moment from 'moment';
import StatusFilter from '../../../components/StatusFilter';
Moment.locale('en');

const Auction = () => {
    const router = useRouter();
    const [listStatus] = useState([
        { name: "Tất cả", value: "" },
        { name: "Đã phê duyệt", value: "APPROVED" },
        { name: "Đã từ chối", value: "REJECTED" },
        { name: "Chờ phê duyệt", value: "PENDING" },
    ])
    const [loading, setLoading] = useState(false);
    const [totalRecords, setTotalRecords] = useState(0);
    const [products, setProducts] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null);
    const [status, setStatus] = useState(null);
    const [lazyParams, setLazyParams] = useState({
        first: 0,
        rows: 10,
        page: 0,
    });

    const dt = useRef(null);

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Chi tiết</button>
            </div>
        );
    }

    const actionAcceptTemplate = (rowData) => {
        return (
            <div className="d-flex justify-content-center align-items-center">
                {
                    rowData.accept ?
                        <div className="badge status status--approved">Đã phê duyệt</div>
                        : (
                            rowData.reject ?
                                <div className="badge status status--rejected">Đã từ chối</div>
                                :
                                <div className="badge status status--pending">Chờ phê duyệt</div>
                        )
                }
            </div>
        )
    }

    const viewDetail = (id) => {
        router.push(`/manage/auction/detail/${id}`);
    }

    useEffect(async () => {
        getListProduct();
    }, [lazyParams]);

    const getListProduct = async () => {
        try {
            setLoading(true);
            const res = await api.adminAuction.getList(lazyParams);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let listProducts = [];
                    console.log(res.data);
                    res.data.result.map(x => {
                        let product = new ProductModel();
                        product.id = x._id || "";
                        product.name = x.name || "";
                        product.date_post = x.timePost ? Moment(x.timePost).format("DD/MM/yyyy") : "";
                        product.nameOwner = x.sellerInfor ? x.sellerInfor.nameOwner : "";
                        product.price = x.price ? `VNĐ ${common.numberWithCommas(x.price)}` : "";
                        product.accept = x.accept || false;
                        product.reject = x.reject || false;
                        listProducts.push(product);
                    })
                    setProducts(() => listProducts);

                    setTotalRecords(() => res.data.total);

                    setLoading(false);
                }
                else {
                    setLoading(false);
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.Toast(message, 'error');
                }
            }
        } catch (error) {
            setLoading(false);
            common.Toast(error, 'error');
        }
    }

    const onDateChange = (event) => {
        dt.current.filter(event.value, 'dateFilter', 'in');
        setSelectedDate(event.value);
    }

    const onStatusChange = (event) => {
        dt.current.filter(event.value, 'status', 'in');
        setStatus(event.value);
    }

    const onRefresh = () => {
        setSelectedDate(null);
        setStatus(null);
        setLazyParams(() => ({
            first: 0,
            rows: 10,
            page: 0
        }));
    }

    const onPage = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }

    const onSort = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        setLazyParams(_lazyParams);
    }

    const onFilter = (event) => {
        let _lazyParams = { ...lazyParams, ...event };
        _lazyParams['first'] = 0;
        setLazyParams(_lazyParams);
        console.log(_lazyParams);
    }

    const filterDate = <Calendar value={selectedDate} onChange={onDateChange} dateFormat="dd/mm/yy" className="p-column-filter" placeholder="Chọn ngày" selectionMode="range" readOnlyInput showButtonBar />;
    const filterStatus = <StatusFilter value={status} onChange={onStatusChange} options={listStatus} />
    const header = <HeaderTable onRefresh={onRefresh} />

    return (
        <>
            <Head>
                <title>Quản lí sản phẩm</title>
            </Head>
            <div className="product-list-container">
                <div className="product-list-title">
                    Danh sách sản phẩm
                </div>
                <div className="product-list-content">
                    <div className="product-list-table">
                        <DataTable
                            header={header} removableSort
                            scrollable scrollHeight="100%"
                            ref={dt} value={products} lazy
                            paginator first={lazyParams.first}
                            rows={10} totalRecords={totalRecords}
                            onPage={onPage} onSort={onSort}
                            sortField={lazyParams.sortField} sortOrder={lazyParams.sortOrder}
                            onFilter={onFilter} filters={lazyParams.filters} loading={loading}
                            emptyMessage="Không có kết quả"
                        >
                            <Column field="name" header="Tên sản phẩm" sortable filter filterPlaceholder="Nhập tên sản phẩm" style={{ width: '24%' }}></Column>
                            <Column field="date_post" header="Ngày tạo" sortable filter filterMatchMode="custom" filterElement={filterDate} style={{ width: '20%' }}></Column>
                            <Column field="price" header="Giá bán" sortable filter filterPlaceholder="Nhập giá bán" filterElement={NoneFilter()} filter style={{ width: '16%' }}></Column>
                            <Column field="accept" header="Trạng thái" body={actionAcceptTemplate} filterElement={filterStatus} filter filterMatchMode="custom" style={{ width: '20%' }} />
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} filterElement={NoneFilter()} filter style={{ width: '20%' }} />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Auction;