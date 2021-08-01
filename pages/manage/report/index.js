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
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let listReports = [];
                    res.data.result.map(x => {
                        let report = {};
                        report.id = x._id;
                        report.name = x.reportId.name || "";
                        report.reason = x.title || "";
                        report.reporter = x.userReport.name || "";
                        report.poster = x.reportId.sellerInfor.nameOwner|| "";
                        report.date_report = x.timeReport ? Moment(x.timeReport).format("DD/MM/yyyy") : "";
                        listReports.push(report);
                    })
                    setReports(listReports);
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
        try {
            const res = await api.adminReport.getList();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let listReports = [];
                    res.data.result.map(x => {
                        let report = {};
                        report.id = x._id;
                        report.name = x.reportId.name || "";
                        report.reason = x.title || "";
                        report.reporter = x.userReport.name || "";
                        report.poster = x.reportId.sellerInfor.nameOwner|| "";
                        report.date_report = x.timeReport ? Moment(x.timeReport).format("DD/MM/yyyy") : "";
                        listReports.push(report);
                    });
                    setReports(listReports);
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
                        <DataTable value={reports} header={header}
                            ref={dt}
                            paginator rows={10} emptyMessage="Không có kết quả" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="name" header="Tên sản phẩm" sortable filter filterPlaceholder="Nhập tên sản phẩm"></Column>
                            <Column field="reason" header="Lí do" sortable filter filterPlaceholder="Nhập lí do"></Column>
                            <Column field="poster" header="Người đăng sản phẩm" sortable filter filterPlaceholder="Nhập người đăng" ></Column>
                            <Column field="reporter" header="Người báo cáo" sortable filter filterPlaceholder="Nhập người báo cáo"></Column>
                            <Column field="date_report" header="Ngày tố cáo" sortable filter></Column>
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Report;