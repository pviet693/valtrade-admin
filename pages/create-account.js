import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoadingBar from "react-top-loading-bar";
import { MultiSelect } from 'primereact/multiselect';
import { useEffect, useRef, useState } from 'react';
import api from '../utils/backend-api.utils';
import * as common from '../utils/common';
import * as validate from '../utils/validate.utils';
import classNames from 'classnames';
import {AdminModel, AdminDetailModel, ListRoles} from '../models/admin.model';
import Moment from 'moment';
import { Dropdown } from 'primereact/dropdown'
Moment.locale('en');

const CreateAccount = () => {
    const router = useRouter();
    const [showError, setShowError] = useState(false);
    const [admin, setAdmin] = useState(new AdminModel());
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [role, setRole] = useState([]);
    const inputFileAvatar = useRef(null);

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setAdmin({ ...admin, [name]: value });
    }

    const onChangeRole = (e) => {
        e.preventDefault();
        setRole(e.target.value);
    }

    const createAdmin = async (e) => {
        e.preventDefault();
        setShowError(true);

        // if (validate.checkEmptyInput(admin.name)
        //     || validate.checkEmptyInput(admin.email)
        //     || validate.checkEmptyInput(admin.password)
        //     || validate.checkEmptyInput(roles)
        // ) {
        //     return;
        // }

        refLoadingBar.current.continuousStart();
        setIsLoading(true);

        admin.role = role.key;
        try {         
            const res = await api.admin.postCreate(admin);
            setIsLoading(false);
            refLoadingBar.current.complete();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Notification("Thông báo", 'Tạo mới admin thành công. Vui lòng kiểm tra email để xác thực');
                    router.push('/profile');
                } else {
                    const message = res.data.message || "Tạo mới admin thất bại.";
                    common.Toast(message, 'error');
                }
            }
        } catch (error) {
            refLoadingBar.current.complete();
            setIsLoading(false);
            common.Toast(error, 'error');
        }
    }

    const updateAvatar = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
    }

    return (
        <>
            <Head>
                <title>
                    Tạo mới admin
                </title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="create-account-container">
                <div className="create-account-title">
                    <Link href="/profile">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Quản lí admin</div>
                        </a>
                    </Link>
                </div>
                
                <form onSubmit={createAdmin}>
                        <div className="create-account-content">
                            <div className="row">
                                <div className="col-md-8">
                                    
                                    <div className="form-group row align-items-center d-flex">
                                        <label htmlFor="name" className="col-md-3 col-form-label">Họ và tên</label>
                                        <div className="col-md-9">
                                            <input type="text" className="form-control" id="name" placeholder="Tên admin" name="name" value={admin.name} onChange={onChangeInput} />
                                        </div>
                                    </div>
                                    <div className="form-group row align-items-center d-flex">
                                        <label htmlFor="email" className="col-md-3 col-form-label">Email</label>
                                        <div className="col-md-9">
                                            <input type="email" className="form-control" id="email" placeholder="Email" name="email" value={admin.email} onChange={onChangeInput}/>
                                        </div>
                                    </div>
                                    <div className="form-group row align-items-center d-flex">
                                        <label htmlFor="password" className="col-md-3 col-form-label">Password</label>
                                        <div className="col-md-9">
                                            <input type="password" className="form-control" id="password" placeholder="Mật khẩu" name="password" value={admin.password} onChange={onChangeInput}/>
                                        </div>
                                    </div>
                                    <div className="form-group row align-items-center d-flex">
                                        <label htmlFor="role" className="col-md-3 col-form-label">Phân quyền</label>
                                        <div className="col-md-9">
                                            <Dropdown value={role} options={ListRoles} onChange={onChangeRole} optionLabel="name" filter showClear filterBy="name" placeholder="Chọn quyền admin" id="role"
                                            className="dropdown-role" />   
                                        </div>
                                    </div>  
                                    <div className="form-group row align-items-center d-flex">
                                        <label htmlFor="phone" className="col-md-3 col-form-label">Số điện thoại</label>
                                        <div className="col-md-9">
                                            <input type="number" className="form-control" id="phone" placeholder="Số điện thoại" name="phone" value={admin.phone} onChange={onChangeInput} />
                                        </div>
                                    </div>    
                                </div>
                                <div className="col-md-4 d-flex align-items-start justify-content-center">
                                    <div className="img-box">
                                            <img src="/static/assets/img/user2.png" alt="Image avatar"/>
                                            <input type="file" ref={inputFileAvatar} accept="image/*" onChange={updateAvatar} />
                                            <div className="button-box">
                                                <button type="button" className="btn btn-primary" onClick={() => inputFileAvatar.current.click()}><i className="fa fa-edit" aria-hidden></i></button>
                                            </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    <div className="create-account-footer">
                        <div>
                            {
                                isLoading &&
                                <button type="button" className="btn button-update mr-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                            }
                            {
                                !isLoading &&
                                <button className="btn button-update" type="submit">Tạo mới</button>

                            }
                        </div>
                    </div>
                
                </form>
            </div>
        </>
    )
}

export default CreateAccount;