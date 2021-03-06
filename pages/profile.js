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
import { AdminModel } from '../models/admin.model';
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
    const [newInfor, setNewInfor] = useState([]);
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
                    common.Notification("Th??ng b??o", 'Thay ?????i m???t kh???u th??nh c??ng')
                    .then(() => {
                        setShowError(false);
                    });
                } else {
                    const message = res.data.message || "Thay ?????i m???t kh???u th???t b???i.";
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
                <button type="button" className="btn btn-danger mr-2" onClick={() => deleteAdmin(rowData.id)}><i className="fa fa-trash-o" aria-hidden></i> X??a</button>
                <button type="button" className="btn btn-primary" onClick={() => viewDetail(rowData.id)}><i className="fa fa-edit" aria-hidden></i> Chi ti???t</button>
            </div>
        );
    }

    const deleteAdmin = (id) => {
        common.ConfirmDialog('X??c nh???n', 'B???n mu???n x??a admin n??y?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        const res = await api.admin.delete(id);
                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                let newListAdmin = lstAdmin.filter(x => x.id !== id);
                                setLstAdmin(newListAdmin);
                                common.Toast('X??a admin th??nh c??ng.', 'success');
                            } else {
                                common.Toast('X??a admin th???t b???i.', 'error');
                            }
                        }
                    } catch(error) {
                        common.Toast(error, 'error');
                    }
                }
            });
    }

    const viewDetail = (id) => {
        
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
                    let message = res.data.message || "C?? l???i x???y ra vui l??ng th??? l???i sau.";
                    common.Toast(message, 'error');
                }
            }
        } catch(error) {
            common.Toast(error, 'error');
        }
    }

    const getList = async () => {
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
                    let message = res.data.message || "C?? l???i x???y ra vui l??ng th??? l???i sau.";
                    common.Toast(res.data.message, 'error');
                }
            }
        } catch(error) {
            common.Toast(error, 'error');
        }
    }

    useEffect(() => {
       getProfile();
       getList();
    }, []);

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
                    common.Notification("Th??ng b??o", 'C???p nh???t th??ng tin th??nh c??ng');
                    getProfile();
                } else {
                    const message = res.data.message || "C???p nh???t th??ng tin th???t b???i.";
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
                <title>T??i kho???n</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="profile-container">
                <div className="profile-title">
                    Th??ng tin t??i kho???n
                </div>
                <div className="d-flex row">
                    <div className="col-md-8 pr-1">
                        <div className="profile-content">
                            <div className="profile-content-row">
                                <h4 className="mt-0 mb-4">Th??ng tin c?? nh??n</h4>
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
                                                    <label htmlFor="name" className="col-md-3 col-form-label">H??? v?? t??n:</label>
                                                    <div className="col-md-9 d-flex align-items-center px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="name" className="form-control" value={admins.name} disabled={disabled} placeholder="H??? v?? t??n" />
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
                                                    <label htmlFor="role" className="col-md-3 col-form-label">Ph??n quy???n:</label>
                                                    <div className="col-md-9 px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="role" className="form-control" value={admins.role} disabled placeholder="Ph??n quy???n" />
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
                                                    <label htmlFor="phone" className="col-md-3 col-form-label">S??? ??i???n tho???i:</label>
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
                                                    <label htmlFor="name" className="col-md-3 col-form-label">H??? v?? t??n:</label>
                                                    <div className="col-md-9 d-flex align-items-center px-0">
                                                        <div className="col-md-10">
                                                            <input type="text" name="name" className="form-control" value={newInfor.name} disabled={disabled} placeholder="H??? v?? t??n" onChange={onChangeInput} />
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
                                                    <label htmlFor="phone" className="col-md-3 col-form-label">S??? ??i???n tho???i:</label>
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
                                <h4 className="mt-0 mb-4">B???o m???t</h4>
                                <div className="form-group row">
                                    <div className="d-flex align-items-center">
                                        <label htmlFor="password" className="col-md-3 col-form-label">M???t kh???u:</label>
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
                                                                    <label htmlFor="new-password" className="col-form-label">M???t kh???u hi???n t???i</label>
                                                                    <div>
                                                                        <input
                                                                            className={classNames("form-control", { 'is-invalid': invalid && showError })}
                                                                            placeholder="M???t kh???u hi???n t???i" type="password" name="current_password" id="current-password" {...handler()} />
                                                                        {
                                                                            hasError('required') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                M???t kh???u kh??ng ???????c tr???ng.
                                                                            </div>
                                                                        }
                                                                        {
                                                                            hasError('minLength') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                M???t kh???u ph???i ??t nh???t 8 k?? t???.
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
                                                                    <label htmlFor="new-password" className="col-form-label">M???t kh???u m???i (??t nh???t 8 k?? t???)</label>
                                                                    <div>
                                                                        <input
                                                                            className={classNames("form-control", { 'is-invalid': invalid && showError })}
                                                                            placeholder="M???t kh???u m???i" type="password" name="new_password" id="new-password" {...handler()} />
                                                                        {
                                                                            hasError('required') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                M???t kh???u kh??ng ???????c tr???ng.
                                                                            </div>
                                                                        }
                                                                        {
                                                                            hasError('minLength') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                M???t kh???u ph???i ??t nh???t 8 k?? t???.
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
                                                                    <label htmlFor="confirm-password" className="col-form-label">X??c nh???n m???t kh???u</label>
                                                                    <div>
                                                                        <input
                                                                            className={classNames("form-control", { 'is-invalid': invalid && showError })}
                                                                            placeholder="X??c nh???n m???t kh???u" type="password" name="confirm_password" id="confirm-password" {...handler()} />
                                                                        {
                                                                            hasError('required') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                M???t kh???u kh??ng ???????c tr???ng.
                                                                            </div>
                                                                        }
                                                                        {
                                                                            hasError('minLength') && showError &&
                                                                            <div className="invalid-feedback text-left">
                                                                                M???t kh???u ph???i ??t nh???t 8 k?? t???.
                                                                            </div>
                                                                        }
                                                                        {
                                                                            !hasError('required') && !hasError('minLength') && showError && hasError('passwordMatch') &&
                                                                            <div className="invalid-feedback text-left">
                                                                                M???t kh???u kh??ng tr??ng.
                                                                            </div>
                                                                        }
                                                                    </div>
                                                                </div>
                                                            )}
                                                        />
                                                    </>
                                                }
                                                <button type="submit" className="btn btn-primary mt-4">C???p nh???t</button>
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
                        <h4>Danh s??ch admin</h4>
                        <button onClick={createNewAdmin} className="btn btn-primary">Th??m m???i</button>
                    </div>
                    <div className="list-admin-table">
                        <DataTable value={lstAdmin}
                            ref={dt}
                            paginator rows={10} emptyMessage="Kh??ng c?? k???t qu???" currentPageReportTemplate="{first} ?????n {last} c???a {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="name" header="H??? v?? t??n" sortable filter filterPlaceholder="Nh???p t??n"></Column>
                            <Column field="role" header="Ph??n quy???n" sortable filter filterPlaceholder="Nh???p quy???n"></Column>
                            <Column field="email" header="Email" sortable filter filterPlaceholder="Nh???p email" ></Column>
                            <Column field="phone" header="S??? ??i???n tho???i" sortable filter filterPlaceholder="Nh???p s??? ??i???n tho???i"></Column>
                            <Column field="action" header="Thao t??c" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;