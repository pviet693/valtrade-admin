import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Calendar } from 'primereact/calendar';
import { useEffect, useState } from 'react';
import { UserDetailModel } from './../../../../models/user.model';
import api from './../../../../utils/backend-api.utils';
import * as common from './../../../../utils/common';
import Moment from 'moment';
Moment.locale('en');

const UserDetail = (props) => {
    const router = useRouter();
    const { id } = props;
    const [user, setUser] = useState(new UserDetailModel());

    useEffect(async () => {
        try {
            const res = await api.adminUser.getDetail(id);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    const data = res.data.result._doc;
                    let userDetail = new UserDetailModel();
                    userDetail.name = data.name || "";
                    userDetail.phone = data.phone || "";
                    userDetail.email = data.local.email || "";
                    userDetail.address = data.address || "";
                    userDetail.gender = data.gender || "";
                    userDetail.birthday = data.birthday || "";
                    userDetail.avatar = data.imageUrl.url || "";
                    setUser(userDetail);
                }
            }
        } catch(error) {
            common.Toast(error, 'error');
        }
    }, [])
    
    return (
        <>
            <Head>
                <title>
                    Chi tiết người dùng
                </title>
            </Head>
            <div className="user-detail-container">
                <div className="user-detail-title">
                    <Link href="/manage/user">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Quản lí người dùng</div>
                        </a>
                    </Link>
                </div>
                <div className="user-detail-content">
                    <div className="row d-flex">
                        <div className="col-md-8">
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name" className="col-md-3 col-form-label">Tên người dùng</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="name" placeholder="Tên người dùng" name="name" defaultValue={user.name} />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="phone" className="col-md-3 col-form-label">Số điện thoại</label>
                                <div className="col-md-9">
                                    <input type="phone" className="form-control" id="phone" placeholder="Số điện thoại" name="phone" defaultValue={user.phone} />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="email" className="col-md-3 col-form-label">Email</label>
                                <div className="col-md-9">
                                    <input type="email" className="form-control" id="email" placeholder="Email" name="email" defaultValue={user.email} />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="address" className="col-md-3 col-form-label">Địa chỉ</label>
                                <div className="col-md-9">
                                    <input type="text" className="form-control" id="address" placeholder="Địa chỉ" name="address" defaultValue={user.address} />
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="gender" className="col-md-3 col-form-label">Giới tính</label>
                                <div className="col-md-9 d-flex align-items-center">
                                    <label className="fancy-radio mr-4">
                                        <input name="gender" value="male" type="radio" checked={user.gender === 'Nam'} onChange={() => { }}/>
                                        <span><i></i>Nam</span>
									</label>
                                    <label className="fancy-radio">
                                        <input name="gender" value="female" type="radio" checked={user.gender === 'Nữ'} onChange={() => { }}/>
                                        <span><i></i>Nữ</span>
                                    </label>
                                </div>
                            </div>
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="birthday" className="col-md-3 col-form-label">Ngày sinh</label>
                                <div className="col-md-9">
                                    <Calendar dateFormat="dd/mm/yy" showIcon placeholder="dd/mm/yyyy" readOnlyInput id="birthday" value={new Date(user.birthday)} name="birthday" />
                                </div>
                            </div>
                        </div>
                        <div className="col-md-4 d-flex align-items-start justify-content-center">
                            <img src="/static/assets/img/user-medium.png" className="img-circle" alt="Avatar"></img>
                        </div>
                    </div>
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

export default UserDetail;