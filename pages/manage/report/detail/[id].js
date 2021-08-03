import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Calendar } from 'primereact/calendar';
import { useEffect, useState } from 'react';
// import { UserDetailModel } from './../../../../models/user.model';
import api from './../../../../utils/backend-api.utils';
import * as common from './../../../../utils/common';
import Moment from 'moment';
Moment.locale('en');

const ReportDetail = (props) => {
    const router = useRouter();
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const { id } = props;

    const [report, setReport] = useState({
        name: "",
        link: "",
        reporter: "",
        poster: "",
        content: "",
        dateReport: "",
        title: ""
    });
    useEffect(async () => {
        try {
            const res = await api.adminReport.detailReport(id);
            console.log(res);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    const data = res.data.result;
                    let reportDetail = {};
                    reportDetail.name = data.reportId.name || "";
                    reportDetail.link = `https://valtrade.me/product-detail?id=${data.reportId._id}`
                    reportDetail.reporter = data.reportId.sellerInfor.nameOwner || "";
                    reportDetail.poster = data.userReport.name || "";
                    reportDetail.content = data.content || "";
                    reportDetail.dateReport = data.timeReport ? Moment(data.timeReport).format("DD/MM/yyyy") : "";
                    reportDetail.title = data.title || "";
                    setReport(reportDetail);
                }
            }
        } catch(error) {
            common.Toast(error, 'error');
        }
    }, [])

    const back = () => {
        router.push('/manage/report');
    }

    const deleteReport = () =>{
        common.ConfirmDialog('Xác nhận', 'Bạn muốn xóa sản phẩm bị tố cáo này?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    setIsLoadingDelete(true);
                    refLoadingBar.current.continuousStart();
                    try {
                        // const res = await api.adminPost.deletePost(id);
                        // refLoadingBar.current.complete();

                        // if (res.status === 200) {
                        //     if (res.data.code === 200) {
                        //         common.Toast('Xóa tin tức thành công.', 'success')
                        //             .then(() => router.push('/manage/post') )
                        //     } else {
                        //         common.Toast('Xóa tin tức thất bại.', 'error');
                        //     }
                        // }
                    } catch (error) {
                        refLoadingBar.current.complete();
                        setIsLoadingDelete(false);
                        common.Toast(error, 'error');
                    }
                }
            });
    } 
    
    return (
        <>
            <Head>
                <title>
                    Chi tiết tố cáo
                </title>
            </Head>
            <div className="report-detail-container">
                <div className="report-detail-title">
                    <Link href="/manage/report">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Quản lí sản phẩm bị tố cáo</div>
                        </a>
                    </Link>
                </div>
                <div className="report-detail-content">
                    <div className="row d-flex">
                        <div className="col-md-12">
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name" className="col-md-3 col-form-label">Tên sản phẩm</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="name" placeholder="Tên sản phẩm" name="name" defaultValue={report.name} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="link" className="col-md-3 col-form-label">Link sản phẩm</label>
                                <div className="col-md-9">
                                    <div className="form-control">
                                        <a href={report.link} target="_blank">{report.link}</a>
                                    </div>
                                    {/* <input type="text" className="form-control" id="link" placeholder="Link sản phẩm" name="link" defaultValue={report.link} /> */}
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="reporter" className="col-md-3 col-form-label">Người báo cáo</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="reporter" placeholder="Người báo cáo" name="reporter" defaultValue={report.reporter} disabled />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="poster" className="col-md-3 col-form-label">Người đăng sản phẩm</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="poster" placeholder="Người đăng sản phẩm" name="poster" defaultValue={report.poster} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="title" className="col-md-3 col-form-label">Tiêu đề báo cáo</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="title" placeholder="Tiêu đề báo cáo" name="title" defaultValue={report.title} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="content" className="col-md-3 col-form-label">Nội dung báo cáo</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="content" placeholder="Nội dung báo cáo" name="content" defaultValue={report.content} disabled/>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="dateReport" className="col-md-3 col-form-label">Ngày báo cáo</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="dateReport" placeholder="Ngày báo cáo" name="dateReport" defaultValue={report.dateReport} disabled/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
            <div className="report-detail-footer">
                <button className="btn btn--back" onClick={back}>Trở về</button>

                <div>
                        {
                            isLoadingDelete &&
                            <button type="button" className="btn button-delete mr-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                        }
                </div>
            </div>
        </>
    )
}

export async function getServerSideProps(ctx) {
    const id = ctx.query.id;

    return {
        props: { id: id }
    }
}

export default ReportDetail;