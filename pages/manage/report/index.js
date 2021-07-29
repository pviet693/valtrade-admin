import Head from 'next/head';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import * as common from './../../../utils/common';
import api from './../../../utils/backend-api.utils';
import { ReportModel } from './../../../models/report.model';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import LoadingBar from "react-top-loading-bar";
import Moment from 'moment';
Moment.locale('en');

const Report = () => {
    const router = useRouter();
    const [reports, setReports] = useState([]);
    const [dateFilter, setDateFilter] = useState(null);
    const refLoadingBar = useRef(null);
    const dt = useRef(null);

    const reports1 = [
        {
            name: 'Laptop ASUS ZenBook UX425EA-KI429T (Core i5-1135G7/ 8GB LPDDR4X 3200MHz/ 512GB SSD M.2 PCIE G3X2/ 14 FHD IPS/ Win10)',
            reason: "Hình ảnh không hợp lệ",
            reporter: "Nguyễn Tấn Tín",
            poster: "Phạm Văn Việt"
        },
        {
            name: 'ipad pro 11 inch wifi cellular 128gb (2020)',
            reason: "Sản phẩm không đúng chất lượng",
            reporter: "Nguyễn Nhật Tân",
            poster: "Phạm Văn Việt"
        },
        {
            name: 'Điện Thoại iPhone 12 Mini 64GB',
            reason: "Hình ảnh không hợp lệ",
            reporter: "Nguyễn Nhật Tân",
            poster: "Phạm Văn Việt"
        },
        {
            name: 'Bộ Máy Ps4 Slim 1tb Model 2218B',
            reason: "Chất lượng sản phẩm kém",
            reporter: "Nguyễn Tấn Tín",
            poster: "Nguyễn Nhật Tân"
        }
    ];
    
    const renderActionFilter = () => {
        return (
            <input type="text" className="p-inputtext p-component p-column-filter" disabled></input>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Chi tiết</button>
            </div>
        );
    }

    const viewDetail = (id) => {
        router.push(`/manage/report/detail/${id}`);
    }

    useEffect(async () => {
        try {
            const res = await api.adminReport.getList();
            console.log(res);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    // let listReports = [];
                    // res.data.list.map(x => {
                    //     let report = new ReportModel();
                    //     user.id = x._id || "";
                    //     user.name = x.name || "";
                    //     user.phone = x.phone || "";
                    //     user.email = x.local ? (x.local.email || "") : "";
                    //     user.gender = x.gender || "";
                    //     user.birthday = x.birthday ? Moment(x.birthday).format("DD/MM/yyyy") : "";
                    //     listUsers.push(user);
                    // })
                    // setUsers(listUsers);
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

    const onRefresh = async () => {
        refLoadingBar.current.continuousStart();
        try {
            const res = await api.adminUser.getList();
            refLoadingBar.current.complete();
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
                <title>Quản lí sản phẩm bị báo cáo</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="report-list-container">
                <div className="report-list-title">
                    Danh sách sản phẩm bị báo cáo
                </div>
                <div className="report-list-content">
                    <div className="report-list-table">
                        <DataTable value={reports1} header={header}
                            ref={dt}
                            paginator rows={10} emptyMessage="Không có kết quả" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="name" header="Tên sản phẩm" sortable filter filterPlaceholder="Nhập tên sản phẩm"></Column>
                            <Column field="reason" header="Lí do" sortable filter filterPlaceholder="Nhập lí do"></Column>
                            <Column field="poster" header="Người đăng sản phẩm" sortable filter filterPlaceholder="Nhập người đăng" ></Column>
                            <Column field="reporter" header="Người báo cáo" sortable filter filterPlaceholder="Nhập người báo cáo"></Column>
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Report;