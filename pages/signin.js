
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import LoadingBar from "react-top-loading-bar";
import classNames from 'classnames';
import api from './../utils/backend-api.utils';
import * as validate from './../utils/validate.utils';
import * as common from './../utils/common';

const SignIn = () => {

    const router = useRouter();
    const refLoadingBar = useRef(null);
    const [formLogin, setFormLogin] = useState({ email: "", password: "" });
    const [isLoading, setIsLoading] = useState(false);
    const [showError, setShowError] = useState(false);

    const onChangeLogin = (event) => {
        const { name, value } = event.target;
        setFormLogin({ ...formLogin, [name]: value });
    }

    const handleLogin = async (event) => {
        event.preventDefault();
        setShowError(true);

        if (!validate.validateEmail(formLogin.email)
            ||validate.checkEmptyInput(formLogin.email)
            // || !validate.validatePassword(formLogin.password)
            || validate.checkEmptyInput(formLogin.password)) {
                return;
            }

        setIsLoading(true);
        refLoadingBar.current.continuousStart();

        try {
            const res = await api.auth.signin(formLogin);
            refLoadingBar.current.complete();
            setIsLoading(false);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast('Đăng nhập thành công.', 'success')
                        .then(() => router.push(`/verify?id=${res.data.id}`));
                } else {
                    common.Toast('Email hoặc mật khẩu không đúng.', 'error');
                }
            }
            return;
        } catch (error) {
            refLoadingBar.current.complete();
            setIsLoading(false);

            common.Toast(error, 'error');
        }

    }

    return (
        <>
            <Head>
                <title>
                    Đăng nhập
                </title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} onLoaderFinished={() => { }} />
            <div className="signin">
                <div className="container">
                    <div className="row content">
                        <div className="col-md-6 mb-3">
                            <img src="/static/login.svg" className="img-fluid" alt="image" />
                        </div>

                        <div className="col-md-6">
                            <h3 className="signin-text mb-3">Đăng nhập</h3>
                            <form onSubmit={handleLogin}>
                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className={classNames("form-control", { "is-invalid": (!validate.validateEmail(formLogin.email) || validate.checkEmptyInput(formLogin.email)) && showError })}
                                        value={formLogin.email}
                                        onChange={onChangeLogin}
                                    >
                                    </input>
                                    {
                                        !validate.validateEmail(formLogin.email) && !validate.checkEmptyInput(formLogin.email) && showError &&
                                        <div className="invalid-feedback">
                                            Email không hợp lệ.
                                        </div>
                                    }
                                    {
                                        validate.validateEmail(formLogin.email) && validate.checkEmptyInput(formLogin.email) && showError &&
                                        <div className="invalid-feedback">
                                            Email không được rỗng.
                                        </div>
                                    }
                                </div>
                                <div className="form-group">
                                    <label htmlFor="password">Mật khẩu</label>
                                    <input
                                        type="password"
                                        name="password"
                                        className={classNames("form-control", { "is-invalid": (!validate.validateEmail(formLogin.password) || validate.checkEmptyInput(formLogin.password)) && showError })}
                                        value={formLogin.password}
                                        onChange={onChangeLogin}
                                    >
                                    </input>
                                    {
                                        !validate.validatePassword(formLogin.password) && !validate.checkEmptyInput(formLogin.email) && showError &&
                                        <div className="invalid-feedback">
                                            Mật khẩu không hợp lệ (ít nhất 8 kí tự).
                                        </div>
                                    }
                                    {
                                        validate.validatePassword(formLogin.password) && validate.checkEmptyInput(formLogin.email) && showError &&
                                        <div className="invalid-feedback">
                                            Mật khẩu không được rỗng.
                                        </div>
                                    }
                                </div>
                                {
                                    !isLoading &&
                                    <button type="submit" className="btn btn-class mt-2">Đăng nhập</button>
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
        </>
    )
}

export default SignIn;