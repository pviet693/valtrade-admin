import Head from 'next/head';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import * as common from './../../../utils/common';
import api from './../../../utils/backend-api.utils';
import { NotificationModel } from './../../../models/notification.model';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Moment from 'moment';
import Button from '@material-ui/core/Button';
import LoadingBar from "react-top-loading-bar";
Moment.locale('en');

const Notification = () => {
    const router = useRouter();
    const [notifications, setNotifications] = useState([]);
    const [dateFilter, setDateFilter] = useState(null);
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const dt = useRef(null);
    
    const addNew = () => {
        router.push('notification/add-new-notification');
    }

    const renderActionFilter = () => {
        return (
            <input type="text" className="p-inputtext p-component p-column-filter" disabled></input>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i>Chi tiết</button>
            </div>
        );
    }

    const viewDetail = (id) => {
        
    }

    useEffect(async () => {
        try {
            // const res = await api.adminPost.getList();
            // if (res.status === 200) {
            //     if (res.data.code === 200) {
            //         let listPosts = [];
            //         res.data.result.map(x => {
            //             let post = new PostModel();
            //             post.id = x._id || "";
            //             post.title = x.title || "";
            //             post.imageUrl = x.imageUrl.url || "";
            //             post.content = x.content || "";
            //             post.timeCreate = x.timeCreate ? Moment(x.timeCreate).format("DD/MM/yyyy") : "";
            //             listPosts.push(post);
            //         })
            //         setPosts(listPosts);
            //     } else {
            //         let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
            //         common.Toast(message, 'error');
            //     }
            // }
        } catch(error) {
            common.Toast(error, 'error');
        }
    }, []);

    const actionFilterElement = renderActionFilter();

    return (
        <>
            <Head>
                <title>Quản lí thông báo</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="notification-list-container">
                <div className="notification-list-title">
                    <div>Danh sách thông báo</div>
                    <button className="btn button-create-new" onClick={addNew}>Thêm mới</button>
                </div>
                <div className="notification-list-content">
                    <div className="notification-list-table">
                        <DataTable value={notifications}
                            ref={dt}
                            paginator rows={10} emptyMessage="Không có kết quả" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="content" header="Tiêu đề bài đăng" sortable filter filterPlaceholder="Nhập tiêu đề" bodyStyle={{fontWeight: '500'}}></Column>
                            <Column field="timeCreate" header="Ngày đăng" sortable filter filterPlaceholder="dd/mm/yyyy" headerStyle={{ width: '12em', textAlign: 'center' }}></Column>
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Notification;