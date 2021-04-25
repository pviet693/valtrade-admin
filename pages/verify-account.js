import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import LoadingBar from "react-top-loading-bar";
import classNames from 'classnames';
import api from './../utils/backend-api.utils';
import * as validate from './../utils/validate.utils';
import * as common from './../utils/common';
import Cookie from 'js-cookie';

const VerifyAccount = ({id}) => {
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [formVerify, setFormVerify] = useState({ id: id, token: "" });
    const [showError, setShowError] = useState(false);
    const router = useRouter();

    const onChangeVerify = (event) => {
        const { name, value } = event.target;
        setFormVerify({ ...formVerify, [name]: value });
    }

    const handleVerify = async (event) => {
        event.preventDefault();
        setShowError(true);
        if (validate.checkEmptyInput(formVerify.token) || !formVerify.id) return;

        setIsLoading(true);
        refLoadingBar.current.continuousStart();

        try {
            const res = await api.admin.postVerify(formVerify);
            setIsLoading(false);
            refLoadingBar.current.complete();
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast('Xác thực thành công.', 'success')
                        .then(() => {
                            Cookie.remove('email_register');
                            router.push('/signin');
                        });
                } else {
                    const message = res.data.message || "Mã xác thực không đúng.";
                    common.Toast(message, 'error');
                }
            }
        } catch (error) {
            setIsLoading(false);
            refLoadingBar.current.complete();
            common.Toast(error, 'error');
        }
    }

    return (
        <>
            <Head>
                <title>Xác thực tài khoản</title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="verify-email">
                <div className="container">
                    <div className="row content d-flex align-items-center">
                        <div className="col-md-6">
                            <div className="img-verify">
                                <img src="/static/assets/img/instruction-manual-animate.svg" alt="Image verify" />
                            </div>
                        </div>
                        <div className="col-md-6">
                            <h3 className="verify-text">Xác thực tài khoản</h3>
                            <div className="instruction-step-verify">
                                <h5 className="step-verify-title">Các bước thực hiện: </h5>
                                <ol>
                                    <li className="step-verify-row">Cài đặt phần mềm Google Authenticator vào điện thoại Smartphone.</li>
                                    <li className="step-verify-row">Hãy nhập "Secret Key" mà chúng tôi đã gửi cho bạn vào phần mềm Google Authenticator ở mục "Nhập khóa thiết lập".</li>
                                    <li className="step-verify-row">Lấy mã nhận được nhập vào ô bên dưới để tiến hành xác thực tài khoản.</li>
                                </ol>
                            </div>
                            <div className="d-flex align-items-center justify-content-center">
                                <form onSubmit={handleVerify} style={{width: "100%"}}>
                                    <div className="form-group">
                                        <label className="mt-6" htmlFor="token">Mã xác thực</label>
                                        <input
                                            type="text"
                                            name="token"
                                            className="form-control"
                                            className={classNames("form-control", { "is-invalid": validate.checkEmptyInput(formVerify.token) && showError })}
                                            value={formVerify.token}
                                            onChange={onChangeVerify}
                                        >
                                        </input>
                                        {
                                            validate.checkEmptyInput(formVerify.token) && showError &&
                                            <div className="invalid-feedback">
                                                Mã xác thực không được rỗng.
                                            </div>
                                        }
                                    </div>

                                    {
                                        !isLoading &&
                                        <button type="submit" className="btn btn-class mt-2">Xác thực</button>
                                    }
                                    {
                                        isLoading &&
                                        <button type="button" className="btn btn-class mt-2" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                                    }
                                </form>
                            </div>
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

export default VerifyAccount;