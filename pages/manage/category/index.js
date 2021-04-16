import Head from 'next/head';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import LoadingBar from "react-top-loading-bar";
import * as common from './../../../utils/common';
import api from './../../../utils/backend-api.utils';
import { CategoryModel } from './../../../models/category.model';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Moment from 'moment';
Moment.locale('en');

const Category = () => {
    const router = useRouter();
    const refLoadingBar = useRef(null);
    const [categories, setCategories] = useState([]);
    const dt = useRef(null);

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <button type="button" className="btn btn-danger mr-2" onClick={() => deleteCategory(rowData.id)}><i className="fa fa-trash-o" aria-hidden></i> Xóa</button>
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Chi tiết</button>
            </div>
        );
    }

    const viewDetail = (id) => {
        router.push(`/manage/category/detail/${id}`);
    }

    const deleteCategory = (id) => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn xóa danh mục này?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        refLoadingBar.current.continuousStart();

                        const res = await api.adminCategory.delete(id);

                        refLoadingBar.current.complete();

                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                let newListCategories = categories.filter(x => x.id !== id);
                                setCategories(newListCategories);
                                common.Toast('Xóa danh mục thành công.', 'success');
                            } else {
                                common.Toast('Xóa danh mục thất bại.', 'error');
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
        router.push('category/add-new');
    }

    useEffect(async () => {
        try {
            const res = await api.adminCategory.getList();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let listCategories = [];
                    res.data.list.map(x => {
                        let category = new CategoryModel();
                        category.id = x.childId || "";
                        category.name = x.childName || "";
                        category.update_date = x.lastTime ? Moment(x.lastTime).format("DD/MM/yyyy") : "";
                        listCategories.push(category);
                    })
                    setCategories(listCategories);
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

    return (
        <>
            <Head>
                <title>Quản lí người dùng</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="category-list-container">
                <div className="category-list-title">
                    <div>Danh sách danh mục</div>
                    <button className="btn button-create-new" onClick={addNew}>Thêm mới</button>
                </div>
                <div className="category-list-content">
                    <div className="category-list-table">
                        <DataTable value={categories}
                            ref={dt}
                            paginator rows={10} emptyMessage="Không có kết quả" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="name" header="Tên danh mục" sortable filter filterPlaceholder="Nhập tên danh mục"></Column>
                            <Column field="update_date" header="Ngày cập nhật" sortable filter filterPlaceholder="dd/mm/yyyy" ></Column>
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Category;