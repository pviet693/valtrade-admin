import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import {
    FormBuilder,
    AbstractControl,
    Validators,
    FormGroup,
    FormArray,
    FieldGroup,
    FieldControl,
    FieldArray
} from "react-reactive-form";
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import * as common from '../utils/common';
import api from '../utils/backend-api.utils';
import { AdminDetailModel, AdminModel, newInformationModel } from '../models/admin.model';
import { RotateLeftSharp } from '@material-ui/icons';
import LoadingBar from 'react-top-loading-bar';


const Profile = () => {
    const router = useRouter();
    const inputFile = useRef(null);
    const [avatar, setAvatar] = useState(null);
    const [isEditPassword, setIsEditPassword] = useState(false);
    const [isEditEmail, setIsEditEmail] = useState(false);
    const [isEditPhone, setIsEditPhone] = useState(false);
    const [isEditName, setIsEditName] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState(false);
    const [admins, setAdmins] = useState([]);
    const dt = useRef(null);
    const [lstAdmin, setLstAdmin] = useState([]);
    const [disabled, setDisabled] = useState(true);
    const [newInfor, setNewInfor] = useState("");
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);

    const passwordMatch = (formGroup) => {
        const confirmPasswordControl = formGroup.controls.confirm_password;
        const newPasswordControl = formGroup.controls.new_password;
        if (confirmPasswordControl.value !== newPasswordControl.value) {
            confirmPasswordControl.setErrors({ passwordMatch: true });
        } 
    }

    let updatePasswordForm = FormBuilder.group({
        current_password: ["", [Validators.required, Validators.minLength(8)]],
        new_password: ["", [Validators.required, Validators.minLength(8)]],
        confirm_password: ["", [Validators.required, Validators.minLength(8)]],

    }
    ,
        { validators: [Validators.required, Validators.minLength(8), passwordMatch] }
    );

    const updateAvatar = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
    }

    const updatePassword = async (e) => {
        e.preventDefault();
        updatePasswordForm.markAsSubmitted();
        setShowError(true);
        if (updatePasswordForm.invalid) return;
        
        
        try {         
            const res = await api.admin.changePassword(updatePasswordForm.value.new_password);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Notification("Thông báo", 'Thay đổi mật khẩu thành công')
                    .then(() => {
                        setShowError(false);
                    });
                } else {
                    const message = res.data.message || "Thay đổi mật khẩu thất bại.";
                    common.Toast(message, 'error');
                }
            }
        } catch (error) {
            refLoadingBar.current.complete();
            setIsLoading(false);
            common.Toast(error, 'error');
        }

    }

    const createNewAdmin = () => {
        router.push('/create-account');
    }

    const renderActionFilter = () => {
        return (
            <input type="text" className="p-inputtext p-component p-column-filter" disabled></input>
        );
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="d-flex align-items-center justify-content-center">
                <button type="button" className="btn btn-danger mr-2" onClick={() => deleteAdmin(rowData.id)}><i className="fa fa-trash-o" aria-hidden></i> Xóa</button>
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Chi tiết</button>
            </div>
        );
    }

    const deleteAdmin = (id) => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn xóa admin này?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const res = await api.admin.delete(id);
                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                let newListAdmin = lstAdmin.filter(x => x.id !== id);
                                setLstAdmin(newListAdmin);
                                common.Toast('Xóa admin thành công.', 'success');
                            } else {
                                common.Toast('Xóa admin thất bại.', 'error');
                            }
                        }
                    } catch(error) {
                        common.Toast(error, 'error');
                    }
                }
            });
    }

    const viewDetail = () => {
        
    }

    const getProfile = async () => {
        try {
            const res = await api.admin.getProfile();
            if (res.status === 200){
                if (res.data.code === 200){
                    let admin = new AdminModel();
                        admin.name = res.data.information.name || "";
                        admin.role = res.data.information.role || "";
                        admin.email = res.data.information.email || "";
                        admin.phone = res.data.information.phone || "";
                    setAdmins(admin);
                    setNewInfor(admin);
                }
                else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.Toast(message, 'error');
                }
            }
        } catch(error) {
            common.Toast(error, 'error');
        }
    }

    useEffect(async() => {
       getProfile();
    }, []);
    

    useEffect(async () => {
        try {
            const res = await api.admin.getList();
            console.log(res);
            if (res.status === 200){
                if (res.data.code === 200){
                    let listAdmin = [];
                    res.data.result.map(x=>{
                        let admin = new AdminModel();
                        admin.id = x._id || '';
                        admin.name = x.name || '';
                        admin.role = x.role || '';
                        admin.email = x.email || '';
                        admin.phone = x.phone || '';
                        listAdmin.push(admin);
                    });
                    setLstAdmin(listAdmin.filter(x => x.role !== 'SUPER_ADMIN'));
                } else {
                    let message = res.data.message || "Có lỗi xảy ra vui lòng thử lại sau.";
                    common.Toast(res.data.message, 'error');
                }
            }
        } catch(error) {
            common.Toast(error, 'error');
        }
    },[]);

    const actionFilterElement = renderActionFilter();

    const changeDisableInput = () =>{
        let disable = !disabled;
        setDisabled(disable);
    }

    const onChangeInput = (event) => {
        const { name, value } = event.target;

        setNewInfor({ ...newInfor, [name]: value });
    }

    const saveInformation = async (e) => {
        e.preventDefault();
        try {         
            let body = {
                name: newInfor.name,
                email: newInfor.email,
                phone: newInfor.phone
            }
            const res = await api.admin.updateInformation(body);
            setIsLoading(false);
            refLoadingBar.current.complete();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Notification("Thông báo", 'Cập nhật thông tin thành công');
                    getProfile();
                } else {
                    const message = res.data.message || "Cập nhật thông tin thất bại.";
                    common.Toast(message, 'error');
                }
                let disable = !disable;
                setDisabled(disable);
            }
        } catch (error) {
            refLoadingBar.current.complete();
            setIsLoading(false);
            common.Toast(error, 'error');
        }
        
    }

    return (
        <>
            <Head>
                <title>Tài khoản</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="profile-container">
                <div className="profile-title">
                    Thông tin tài khoản
                </div>
                <div className="d-flex row">
                    <div className="col-md-8 pr-1">
                        <div className="profile-content">
                            <div className="profile-content-row">
                                <h4 className="mt-0 mb-4">Thông tin cá nhân</h4>
                                <div className="d-flex row">
                                    <div className="col-md-2 d-flex align-items-center justify-content-center">
                                        <div className="img-box">
                                            <img src="/static/assets/img/user2.png" alt="Image avatar" />
                                            <input type="file" ref={inputFile} accept="image/*" onChange={updateAvatar} />
                                            <div className="button-box">
                                                <button type="button" className="btn btn-primary" onClick={() => inputFile.current.click()}><i className="fa fa-edit" aria-hidden></i></button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-10">
                                        {
                                            disabled ? (
                                                <div className="information-box">
                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="name" className="col-md-3 col-form-label">Họ và tên:</label>
                                                    <div className="col-md-9 d-flex align-items-center px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="name" className="form-control" value={admins.name} disabled={disabled} placeholder="Họ và tên" />
                                                        </div>
                                                        {
                                                            disabled ? (
                                                                <div className="col-md-2">
                                                                <button type="button" className="btn btn-primary btn-edit" onClick={changeDisableInput}><i className="fa fa-edit" aria-hidden></i></button>
                                                                </div>
                                                                ) : (
                                                                <div className="col-md-2">
                                                                <button type="button" className="btn btn-primary btn-edit" onClick={saveInformation}><i className="fa fa-save" aria-hidden></i></button>
                                                                </div>   
                                                            )
                                                        }
                                                        
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="role" className="col-md-3 col-form-label">Phân quyền:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="role" className="form-control" value={admins.role} disabled placeholder="Phân quyền" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="email" className="col-md-3 col-form-label">Email:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="email" className="form-control" value={admins.email} disabled={disabled} placeholder="Email"/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row my-0">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="phone" className="col-md-3 col-form-label">Số điện thoại:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="phone" className="form-control" value={admins.phone} disabled={disabled} placeholder="Email" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        ):(
                                        <div className="information-box">
                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="name" className="col-md-3 col-form-label">Họ và tên:</label>
                                                    <div className="col-md-9 d-flex align-items-center px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="name" className="form-control" value={newInfor.name} disabled={disabled} placeholder="Họ và tên" onChange={onChangeInput} />
                                                        </div>
                                                        {
                                                            disabled ? (
                                                                <div className="col-md-2">
                                                                <button type="button" className="btn btn-primary btn-edit" onClick={changeDisableInput}><i className="fa fa-edit" aria-hidden></i></button>
                                                                </div>
                                                                ) : (
                                                                <div className="col-md-2">
                                                                <button type="button" className="btn btn-primary btn-edit" onClick={saveInformation}><i className="fa fa-save" aria-hidden></i></button>
                                                                </div>   
                                                            )
                                                        }
                                                        
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="email" className="col-md-3 col-form-label">Email:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="email" className="form-control" value={newInfor.email} disabled={disabled} placeholder="Email" onChange={onChangeInput}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="phone" className="col-md-3 col-form-label">Số điện thoại:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="phone" className="form-control" value={newInfor.phone} disabled={disabled} placeholder="Email" onChange={onChangeInput}/>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 pl-1">
                        <div className="profile-content">
                            <div className="profile-content-row">
                                <h4 className="mt-0 mb-4">Bảo mật</h4>
                                <div className="form-group row">
                                    <div className="d-flex align-items-center">
                                        <label htmlFor="password" className="col-md-3 col-form-label">Mật khẩu:</label>
                                        <div className="col-md-7">
                                            <input type={showPassword ? 'password' : 'text'} name="password" className="form-control" value={admins.password} disabled placeholder="**********" />
                                        </div>
                                        <div className="col-md-2">
                                            {
                                                !isEditPassword
                                                    ?
                                                    <button type="button" className="btn btn-primary btn-edit" onClick={() => setIsEditPassword(!isEditPassword)}><i className="fa fa-edit" aria-hidden></i></button>
                                                    :
                                                    <button type="button" className="btn btn-danger btn-close" aria-label="Close" onClick={() => {setIsEditPassword(!isEditPassword); setShowError(false);}}></button>

                                            }
                                        </div>
                                    </div>
                                </div>
                                {
                                    isEditPassword &&
                                    <FieldGroup
                                        control={updatePasswordForm}
                                        render={({ get, invalid, dirty, reset, value }) => (
                                            <form className="form-edit-password" onSubmit={updatePassword}>
                                                {
                                                    <>
                                                        <FieldControl
                                                            name="current_password"
                                                            render={({ handler, touched, hasError, dirty, invalid }) => (
                                                                <div className="form-group">
                                                                    <label htmlFor="new-password" className="col-form-label">Mật khẩu hiện tại</label>
                                                                    <div>
                                                                        <input
                                                                            className={classNames("form-control", { 'is-invalid': invalid && showError })}
                                                                            placeholder="Mật khẩu hiện tại" type="password" name="current_password" id="current-password" {...handler()} />
                                                                        {
                                                                            hasError('required') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu không được trống.
                                                                            </div>
                                                                        }
                                                                        {
                                                                            hasError('minLength') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu phải ít nhất 8 kí tự.
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                        <FieldControl
                                                            name="new_password"
                                                            render={({ handler, touched, hasError, dirty, invalid }) => (
                                                                <div className="form-group">
                                                                    <label htmlFor="new-password" className="col-form-label">Mật khẩu mới (ít nhất 8 kí tự)</label>
                                                                    <div>
                                                                        <input
                                                                            className={classNames("form-control", { 'is-invalid': invalid && showError })}
                                                                            placeholder="Mật khẩu mới" type="password" name="new_password" id="new-password" {...handler()} />
                                                                        {
                                                                            hasError('required') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu không được trống.
                                                                            </div>
                                                                        }
                                                                        {
                                                                            hasError('minLength') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu phải ít nhất 8 kí tự.
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                        <FieldControl
                                                            name="confirm_password"
                                                            render={({ handler, touched, hasError, dirty, invalid }) => (
                                                                <div className="form-group mb-0">
                                                                    <label htmlFor="confirm-password" className="col-form-label">Xác nhận mật khẩu</label>
                                                                    <div>
                                                                        <input
                                                                            className={classNames("form-control", { 'is-invalid': invalid && showError })}
                                                                            placeholder="Xác nhận mật khẩu" type="password" name="confirm_password" id="confirm-password" {...handler()} />
                                                                        {
                                                                            hasError('required') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu không được trống.
                                                                            </div>
                                                                        }
                                                                        {
                                                                            hasError('minLength') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu phải ít nhất 8 kí tự.
                                                                            </div>
                                                                        }
                                                                        {
                                                                            !hasError('required') && !hasError('minLength') && showError && hasError('passwordMatch') &&
                                                                            <div className="invalid-feedback text-left">
                                                                                Mật khẩu không trùng.
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                    </>
                                                }
                                                <button type="submit" className="btn btn-primary mt-4">Cập nhật</button>
                                            </form>
                                        )}
                                    />
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className="profile-list-admin">
                    <div className="list-admin-header">
                        <h4>Danh sách admin</h4>
                        <button onClick={createNewAdmin} className="btn btn-primary">Thêm mới</button>
                    </div>
                    <div className="list-admin-table">
                        <DataTable value={lstAdmin}
                            ref={dt}
                            paginator rows={10} emptyMessage="Không có kết quả" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="name" header="Họ và tên" sortable filter filterPlaceholder="Nhập tên"></Column>
                            <Column field="role" header="Phân quyền" sortable filter filterPlaceholder="Nhập quyền"></Column>
                            <Column field="email" header="Email" sortable filter filterPlaceholder="Nhập email" ></Column>
                            <Column field="phone" header="Số điện thoại" sortable filter filterPlaceholder="Nhập số điện thoại"></Column>
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;