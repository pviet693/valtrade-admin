import Head from 'next/head';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import * as common from './../../../utils/common';
import api from './../../../utils/backend-api.utils';
import { PostModel } from './../../../models/post.model';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Moment from 'moment';
import Button from '@material-ui/core/Button';
import LoadingBar from "react-top-loading-bar";
Moment.locale('en');

const Post = () => {
    const router = useRouter();
    const [posts, setPosts] = useState([]);
    const [dateFilter, setDateFilter] = useState(null);
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const dt = useRef(null);
    

    const renderActionFilter = () => {
        return (
            <input type="text" className="p-inputtext p-component p-column-filter" disabled></input>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <button type="button" className="btn btn-danger mr-2" onClick={() => deletePost(rowData.id)}><i className="fa fa-trash-o" aria-hidden></i> Xóa</button>
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Chi tiết</button>
            </div>
        );
    }

    const viewDetail = (id) => {
        router.push(`/manage/user/detail/${id}`);
    }

    useEffect(async () => {
        try {
            
        } catch(error) {
            common.Toast(error, 'error');
        }
    }, []);

    const actionFilterElement = renderActionFilter();

    return (
        <>
            <Head>
                <title>Quản lí tin tức</title>
            </Head>
            <div className="post-list-container">
                <div className="post-list-title">
                    Danh sách tin tức
                </div>
                <div className="post-list-content">
                    <div className="post-list-table">
                        <DataTable value={posts}
                            ref={dt}
                            paginator rows={10} emptyMessage="Không có kết quả" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="title" header="Tiêu đề bài đăng" sortable filter filterPlaceholder="Nhập tiêu đề"></Column>
                            <Column field="content" header="Nội dung bài đăng" sortable filter filterPlaceholder="Nhập số điện thoại"></Column>
                            <Column field="date_post" header="Ngày đăng" sortable filter filterPlaceholder="Nhập ngày đăng"></Column>
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Post;