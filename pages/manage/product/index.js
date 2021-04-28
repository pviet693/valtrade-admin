import Head from 'next/head';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import * as common from './../../../utils/common';
import api from './../../../utils/backend-api.utils';
import { ProductModel } from './../../../models/product.model';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Moment from 'moment';
import LoadingBar from "react-top-loading-bar";
Moment.locale('en');

const Product = () => {
    const router = useRouter();
    const [products, setProducts] = useState([]);
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
                <button type="button" className="btn btn-danger mr-2" onClick={() => deleteProduct(rowData.id)}><i className="fa fa-trash-o" aria-hidden></i> Xóa</button>
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Chi tiết</button>
            </div>
        );
    }

    const deleteProduct = (id) => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn xóa sản phẩm này?')
            .then(async (result) => {
                if (result.isConfirmed){
                    try {
                        setIsLoading(true);
                        refLoadingBar.current.continuousStart();

                        const res = await api.adminProduct.delete(id);

                        refLoadingBar.current.complete();
                        setIsLoading(false);

                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                let newListProducts = products.filter(x => x.id !== id);
                                setProducts(newListProducts);
                                common.Toast('Xóa sản phẩm thành công.', 'success');
                            } else {
                                common.Toast('Xóa sản phẩm thất bại.', 'error');
                            }
                        }
                    } catch(error) {
                        refLoadingBar.current.complete();
                        setIsLoading(false);
                        common.Toast(error, 'error');
                    }
                }
            })
    }

    const actionAcceptTemplate = (rowData) =>{
        return (
            <div className="d-flex justify-content-center align-items-center w-100">
            { 
                rowData.accept ? ( 
                    <button className="btn accept" disabled>Đã phê duyệt</button>
                ) : (
                    <button className="btn waitAccept" disabled>Chờ phê duyệt</button>
                )
            }
        </div>
        )
    }

    const viewDetail = (id) => {
        router.push(`/manage/product/detail/${id}`);
    }

    useEffect(async () => {
        try {
            const res = await api.adminProduct.getList();
            if (res.status === 200){
                if (res.data.code === 200){
                    let listProducts = [];
                    res.data.result.map(x => {
                        let product = new ProductModel();
                        product.id = x._id || "";
                        product.name = x.name || "";
                        product.date_post = x.timePost ? Moment(x.timePost).format("DD/MM/yyyy") : "";
                        product.nameOwner = x.sellerInfor ? x.sellerInfor.nameOwner : "";
                        product.price = x.price || "";
                        product.accept = x.accept;
                        listProducts.push(product);
                    })
                    setProducts(listProducts);
                }
                else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
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
            const res = await api.adminProduct.getList();
            refLoadingBar.current.complete();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let listProducts = [];
                    res.data.result.map(x => {
                        let product = new ProductModel();
                        product.id = x._id || "";
                        product.name = x.name || "";
                        product.date_post = x.timePost ? Moment(x.timePost).format("DD/MM/yyyy") : "";
                        product.nameOwner = x.sellerInfor ? x.sellerInfor.nameOwner : "";
                        product.price = x.price || "";
                        product.accept = x.accept;
                        listProducts.push(product);
                    })
                    setProducts(listProducts);
                }
                else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
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
                <title>Quản lí sản phẩm</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="product-list-container">
                <div className="product-list-title">
                    Danh sách sản phẩm
                </div>
                <div className="product-list-content">
                    <div className="product-list-table">
                        <DataTable value={products} header={header}
                            ref={dt}
                            paginator rows={10} emptyMessage="Không có kết quả" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="name" header="Tên sản phẩm" sortable filter filterPlaceholder="Nhập tên sản phẩm"></Column>
                            {/* <Column field="nameOwner" header="Tên người đăng" sortable filter filterPlaceholder="Nhập tên người đăng" ></Column> */}
                            <Column field="date_post" header="Ngày đăng" sortable filter filterPlaceholder="dd/mm/yyyy" ></Column>
                            <Column field="price" header="Giá bán" sortable filter filterElement={actionFilterElement}  ></Column>
                            <Column field="accept" header="Trạng thái" body={actionAcceptTemplate} headerStyle={{ width: '11em', textAlign: 'center'}} bodyStyle={{ textAlign: 'center', overflow: 'visible', width:'11em'}} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} headerStyle={{ width: '12em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible', width: '12em' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Product;