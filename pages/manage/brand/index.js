import Head from 'next/head';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import LoadingBar from "react-top-loading-bar";
import * as common from './../../../utils/common';
import api from './../../../utils/backend-api.utils';
import { BrandModel } from './../../../models/brand.model';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Moment from 'moment';
Moment.locale('en');

const Brand = () => {
    const router = useRouter();
    const refLoadingBar = useRef(null);
    const [brands, setBrands] = useState([]);
    const dt = useRef(null);

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <button type="button" className="btn btn-danger mr-2" onClick={() => deleteBrand(rowData.id)}><i className="fa fa-trash-o" aria-hidden></i> Xóa</button>
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Chi tiết</button>
            </div>
        );
    }

    const renderActionFilter = () => {
        return (
            <input type="text" className="p-inputtext p-component p-column-filter" disabled></input>
        );
    }

    const viewDetail = (id) => {
        router.push(`/manage/brand/detail/${id}`);
    }

    const deleteBrand = (id) => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn xóa thương hiệu này?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        refLoadingBar.current.continuousStart();

                        const res = await api.admin.deleteBrand(id);

                        refLoadingBar.current.complete();

                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                let newListBrand = brands.filter(x => x.id !== id);
                                setBrands(newListBrand);
                                common.Toast('Xóa thành công.', 'success');
                            } else {
                                common.Toast('Xóa thất bại.', 'error');
                            }
                        }
                    } catch(error) {
                        refLoadingBar.current.complete();
                        common.Toast(error, 'error');
                    }
                }
            });
    }

    const addNew = () => {
        router.push('brand/add-new');
    }

    useEffect(async () => {
        try {
            const res = await api.admin.getListBrand();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let listBrands = [];
                    res.data.result.map(x => {
                        let brand = new BrandModel();
                        brand.id = x._id || "";
                        brand.name = x.name || "";
                        brand.description = x.description || "";
                        brand.image = x.imageUrl.url || "";
                        listBrands.push(brand);
                    })
                    setBrands(listBrands);
                } else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.Toast(message, 'error');
                }
            }
        } catch (error) {
            common.Toast(error, 'error');
        }
    }, []);

    const actionFilterElement = renderActionFilter();

    const renderImage = (data) =>{
        return <img
            style={{ height: 'auto', width: '100px', boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)', maxHeight: '60px' }}
            alt="image brand"
            src={data.image}
      />
    }

    return (
        <>
            <Head>
                <title>Quản lí thương hiệu</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="brand-list-container">
                <div className="brand-list-title">
                    <div>Danh sách thương hiệu</div>
                    <button className="btn button-create-new" onClick={addNew}>Thêm mới</button>
                </div>
                <div className="brand-list-content">
                    <div className="brand-list-table">
                        <DataTable value={brands}
                            ref={dt}
                            paginator rows={10} emptyMessage="Không có kết quả" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="name" header="Tên thương hiệu" sortable filter filterPlaceholder="Nhập tên thương hiệu"></Column>
                            <Column field="description" header="Mô tả" sortable filter filterPlaceholder="Nhập mô tả"></Column>
                            <Column field="image" header="Logo" sortable filterElement={actionFilterElement} filter filterMatchMode="custom" body={renderImage}></Column>
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Brand;