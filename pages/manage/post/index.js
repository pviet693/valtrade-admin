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
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const dt = useRef(null);
    
    const addNew = () => {
        router.push('post/add-new-post');
    }

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

    const deletePost = (id) => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn xóa tin tức này?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    setIsLoadingDelete(true);
                    refLoadingBar.current.continuousStart();
                    try {
                        const res = await api.adminPost.deletePost(id);
                        refLoadingBar.current.complete();

                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                let newListPosts = posts.filter(x => x.id !== id);
                                setPosts(newListPosts);
                                common.Toast('Xóa tin tức thành công.', 'success')
                                    .then(() => router.push('/manage/post') )
                            } else {
                                common.Toast('Xóa tin tức thất bại.', 'error');
                            }
                        }
                    } catch (error) {
                        refLoadingBar.current.complete();
                        setIsLoadingDelete(false);
                        common.Toast(error, 'error');
                    }
                }
            });
    }

    const viewDetail = (id) => {
        router.push(`/manage/post/detail/${id}`);
    }

    useEffect(async () => {
        try {
            const res = await api.adminPost.getList();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let listPosts = [];
                    res.data.result.map(x => {
                        let post = new PostModel();
                        post.id = x._id || "";
                        post.title = x.title || "";
                        post.imageUrl = x.imageUrl.url || "";
                        post.content = x.content || "";
                        post.timeCreate = x.timeCreate ? Moment(x.timeCreate).format("DD/MM/yyyy") : "";
                        listPosts.push(post);
                    })
                    setPosts(listPosts);
                } else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.Toast(message, 'error');
                }
            }
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
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="post-list-container">
                <div className="post-list-title">
                    <div>Danh sách tin tức</div>
                    <button className="btn button-create-new" onClick={addNew}>Thêm mới</button>
                </div>
                <div className="post-list-content">
                    <div className="post-list-table">
                        <DataTable value={posts}
                            ref={dt}
                            paginator rows={10} emptyMessage="Không có kết quả" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="title" header="Tiêu đề bài đăng" sortable filter filterPlaceholder="Nhập tiêu đề" bodyStyle={{fontWeight: '500'}}></Column>
                            <Column field="timeCreate" header="Ngày đăng" sortable filter filterPlaceholder="dd/mm/yyyy" headerStyle={{ width: '12em', textAlign: 'center' }}></Column>
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Post;