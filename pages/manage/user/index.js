import Head from 'next/head';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Calendar } from 'primereact/calendar';
import * as common from './../../../utils/common';
import api from './../../../utils/backend-api.utils';
import { UserItem } from './../../../models/user.model';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import Moment from 'moment';
Moment.locale('en');

const User = () => {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [dateFilter, setDateFilter] = useState(null);
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
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Chi tiết</button>
            </div>
        );
    }

    const viewDetail = (id) => {
        router.push(`/manage/user/detail/${id}`);
    }

    useEffect(async () => {
        try {
            const res = await api.adminUser.getList();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let listUsers = [];
                    res.data.list.map(x => {
                        let user = new UserItem();
                        user.id = x._id || "";
                        user.name = x.name || "";
                        user.phone = x.phone || "";
                        user.email = x.local ? (x.local.email || "") : "";
                        user.gender = x.gender || "";
                        user.birthday = x.birthday ? Moment(x.birthday).format("DD/MM/yyyy") : "";
                        listUsers.push(user);
                    })
                    setUsers(listUsers);
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
                <title>Quản lí người dùng</title>
            </Head>
            <div className="user-list-container">
                <div className="user-list-title">
                    Danh sách người dùng
                </div>
                <div className="user-list-content">
                    <div className="user-list-table">
                        <DataTable value={users}
                            ref={dt}
                            paginator rows={10} emptyMessage="Không có kết quả" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        >
                            <Column field="name" header="Họ và tên" sortable filter filterPlaceholder="Nhập tên"></Column>
                            <Column field="phone" header="Số điện thoại" sortable filter filterPlaceholder="Nhập số điện thoại"></Column>
                            <Column field="email" header="Email" sortable filter filterPlaceholder="Nhập email" ></Column>
                            <Column field="gender" header="Giới tính" sortable filter filterPlaceholder="Nhập giới tính"></Column>
                            {/* <Column field="birthday" header="Ngày sinh" sortable filter filterMatchMode="custom" filterFunction={filterDate} filterElement={dateFilterElement}></Column> */}
                            <Column field="birthday" header="Ngày sinh" sortable filter filterPlaceholder="Nhập ngày sinh"></Column>
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default User;