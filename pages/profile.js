import Head from 'next/head';
import { useRef, useState } from 'react';
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

const Profile = () => {
    const router = useRouter();
    const inputFile = useRef(null);
    const [avatar, setAvatar] = useState(null);
    const [isEditPassword, setIsEditPassword] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showError, setShowError] = useState(false);
    const [admins, setAdmins] = useState([]);
    const dt = useRef(null);

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

    const updatePassword = (e) => {
        e.preventDefault();
        updatePasswordForm.markAsSubmitted();
        setShowError(true);
        if (updatePasswordForm.invalid || !updatePasswordForm.dirty) return;

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
                <button type="button" className="btn btn-danger mr-2" onClick={() => deleteAdmin()}><i className="fa fa-trash-o" aria-hidden></i> Xóa</button>
                <button type="button" className="btn btn-primary" onClick={() => viewDetail()}><i className="fa fa-edit" aria-hidden></i> Chi tiết</button>
            </div>
        );
    }

    const deleteAdmin = () => {

    }

    const viewDetail = () => {

    }

    const actionFilterElement = renderActionFilter();

    return (
        <>
            <Head>
                Tài khoản
            </Head>
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
                                        <div className="information-box">
                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="name" className="col-md-3 col-form-label">Họ và tên:</label>
                                                    <div className="col-md-9">
                                                        <input type="text" name="name" className="form-control" value={""} disabled placeholder="Họ và tên" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="role" className="col-md-3 col-form-label">Phân quyền:</label>
                                                    <div className="col-md-9">
                                                        <input type="text" name="role" className="form-control" value={""} disabled placeholder="Phân quyền" />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="form-group row my-0">
                                                <div className="d-flex align-items-center">
                                                    <label htmlFor="email" className="col-md-3 col-form-label">Email:</label>
                                                    <div className="col-md-9">
                                                        <input type="text" name="email" className="form-control" value={""} disabled placeholder="Email" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
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
                                            <input type={showPassword ? 'password' : 'text'} name="password" className="form-control" value={""} disabled placeholder="Mật khẩu" />
                                        </div>
                                        <div className="col-md-2">
                                            {
                                                !isEditPassword
                                                    ?
                                                    <button type="button" className="btn btn-primary btn-edit" onClick={() => setIsEditPassword(!isEditPassword)}><i className="fa fa-edit" aria-hidden></i></button>
                                                    :
                                                    <button type="button" className="btn btn-danger btn-close" aria-label="Close" onClick={() => setIsEditPassword(!isEditPassword)}></button>

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
                        <DataTable value={admins}
                            ref={dt}
                            paginator rows={10} emptyMessage="Không có kết quả" currentPageReportTemplate="{first} đến {last} của {totalRecords}"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            scrollable scrollHeight="100%"
                        >
                            <Column field="name" header="Họ và tên" sortable filter filterPlaceholder="Nhập tên"></Column>
                            <Column field="role" header="Phân quyền" sortable filter filterPlaceholder="Nhập quyền"></Column>
                            <Column field="email" header="Email" sortable filter filterPlaceholder="Nhập email" ></Column>
                            <Column field="avatar" header="Hình đại diện" filterElement={actionFilterElement} filter filterMatchMode="custom"></Column>
                            <Column field="action" header="Thao tác" body={actionBodyTemplate} headerStyle={{ width: '15em', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} filterElement={actionFilterElement} filter filterMatchMode="custom" />
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Profile;