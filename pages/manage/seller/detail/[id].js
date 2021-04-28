import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Calendar } from 'primereact/calendar';
import { useEffect, useRef, useState } from 'react';
import { SellerDetailModel } from './../../../../models/seller.model';
import LoadingBar from "react-top-loading-bar";
import api from './../../../../utils/backend-api.utils';
import * as common from './../../../../utils/common';
import Moment from 'moment';
import { Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
Moment.locale('en');

const SellerDetail = (props) => {
    const router = useRouter();
    const { id } = props;
    const [seller, setSeller] = useState(new SellerDetailModel());
    const [isLoadingDecline, setIsLoadingDecline] = useState(false);
    const [isLoadingAccept, setIsLoadingAccept] = useState(false);
    const refLoadingBar = useRef(null);

    const back = () => {
        router.push('/manage/seller');
    }

    useEffect(async () => {
        try {
            const res = await api.adminSeller.getDetail(id);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    let sellerDetail = new SellerDetailModel();
                    sellerDetail.name = res.data.result.nameOwner || "";
                    sellerDetail.phone = res.data.result.phone || "";
                    sellerDetail.email = res.data.result.email || "";
                    sellerDetail.address = res.data.result.address || "";
                    sellerDetail.birthday = res.data.result.birthday || "";
                    sellerDetail.shop_name = res.data.result.nameShop || "";
                    sellerDetail.accept = res.data.result.accept || "";
                    sellerDetail.Identified = res.data.result.arrayImage.map(x => x.url);
                    setSeller(sellerDetail);
                }
            }
        } catch(error) {
            common.Toast(error, 'error');
        }
    }, [])

    const acceptSeller = () => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn phê duyệt người bán này?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    setIsLoadingAccept(true);
                    refLoadingBar.current.continuousStart();
                    try {
                        const res = await api.adminSeller.postAccept(id);
                        setIsLoadingAccept(false);
                        refLoadingBar.current.complete();
                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                common.Toast('Phê duyệt người bán thành công.', 'success');    
                            }
                            router.push(`/manage/seller/detail/${id}`);
                        }
                    } catch(error) {
                        setIsLoadingAccept(false);
                        refLoadingBar.current.complete();
                        common.Toast(error, 'error');
                    }
                }
            });
    }

    const rejectSeller = () => {
        
    }

    return (
        <>
            <Head>
                <title>
                    Chi tiết người bán
                </title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="seller-detail-container">
                <div className="seller-detail-title">
                    <Link href="/manage/seller">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Quản lí người bán</div>
                        </a>
                    </Link>
                </div>
                <div className="seller-detail-content">
                    <div className="row d-flex">
                        <div className="col-md-8">
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name" className="col-md-3 col-form-label">Tên người bán</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="name" placeholder="Tên người bán" name="name" defaultValue={seller.name} />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="phone" className="col-md-3 col-form-label">Số điện thoại</label>
                                <div className="col-md-9">
                                    <input type="phone" className="form-control" id="phone" placeholder="Số điện thoại" name="phone" defaultValue={seller.phone} />
                                </div>
                            </div>

                            {
                                seller.shop_name !== "" && (
                                    <div className="form-group row align-items-center d-flex">
                                        <label htmlFor="shop_name" className="col-md-3 col-form-label">Tên shop</label>
                                        <div className="col-md-9">
                                            <input type="text" className="form-control" id="shop_name" placeholder="Tên shop" name="shop_name" defaultValue={seller.shop_name} />
                                        </div>
                                    </div>
                                )
                            }

                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="email" className="col-md-3 col-form-label">Email</label>
                                <div className="col-md-9">
                                    <input type="email" className="form-control" id="email" placeholder="Email" name="email" defaultValue={seller.email} />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="address" className="col-md-3 col-form-label">Địa chỉ</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="address" placeholder="Địa chỉ" name="address" defaultValue={seller.address} />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="birthday" className="col-md-3 col-form-label">Ngày sinh</label>
                                <div className="col-md-9">
                                    <Calendar dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="birthday" value={new Date(seller.birthday)} name="birthday" />
                                </div>
                            </div>

                            <div className="img_Identified form-group row align-items-center d-flex">
                                <label htmlFor="Identified" className="col-md-3 col-form-label">CMND</label>
                                <div className="col-md-9 d-flex justify-content-center">
                                    <div className="identified_before col-md-6">
                                        <img src={seller.Identified[0]} />    
                                    </div>
                                    <div className="identified_after col-md-6">
                                        <img src={seller.Identified[1]} />    
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="seller-detail-footer">
                    <button className="btn btn-back" onClick={back}>Trở về</button>    
                    {
                        seller.accept ? (
                            <div>
                                <Button className="btn btn-accepted disabled">Đã phê duyệt</Button>
                            </div>
                        ) : (
                            <div>
                                {
                                    isLoadingDecline ?
                                    <button type="button" className="btn btn-decline" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                    :
                                            <Button className="btn btn-decline" startIcon={<ClearIcon />} onClick={rejectSeller}>Từ chối</Button>
                                }
                                {
                                    isLoadingAccept ?
                                    <button type="button" className="btn btn-accept" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                    :
                                    <Button className="btn btn-accept" startIcon={<CheckIcon />} onClick={acceptSeller}>Phê duyệt</Button>
                                }
                            </div>
                        )
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

export default SellerDetail;