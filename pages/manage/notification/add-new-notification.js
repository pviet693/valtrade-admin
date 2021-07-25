import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoadingBar from "react-top-loading-bar";
import { MultiSelect } from 'primereact/multiselect';
import { useEffect, useRef, useState } from 'react';
import api from './../../../utils/backend-api.utils';
import * as common from './../../../utils/common';
import * as validate from './../../../utils/validate.utils';
import classNames from 'classnames';
import { NotificationModel} from '../../../models/notification.model';
import Moment from 'moment';
Moment.locale('en');


const CreateNotification = () => {
    const router = useRouter();
    const [notification, setNotification] = useState(new NotificationModel());
    const [showError, setShowError] = useState(false);
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedReceivers, setSelectedReceivers] = useState(null);
    const [receivers, setReceivers] = useState([]);
    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setNotification({ ...notification, [name]: value });
    }

    const [listReceivers, setListReceivers] = useState([
        {
            label: 'Người mua', 
            code: 'LB',
            items: []
        },
        {
            label: 'Người bán', 
            code: 'LS',
            items: []
        }
    ]);


    const getReceivers = async () => {
        try {
            const res1 = await api.adminSeller.getList();
            if (res1.status === 200) {
                if (res1.data.code === 200) {
                    res1.data.result.map(x => {
                        let seller = { value: "", label: ""}
                        seller.value = x._id || "";
                        seller.label = x.nameOwner || "";
                        listReceivers[1].items.push(seller);
                    });
                }
            }
            const res2 = await api.adminUser.getList();
            if (res2.status === 200) {
                if (res2.data.code === 200) {
                    res2.data.list.map(x => {
                        let buyer = { value: "", label: ""}
                        buyer.value = x._id || "";
                        buyer.label = x.name || "";
                        listReceivers[0].items.push(buyer);
                    });
                }
            }
            setListReceivers(listReceivers);
        } catch(e) {
            common.Toast(e, 'error');
        }
    };

    useEffect(()=>{
        getReceivers();
    },[]);



    const createNotification = async () => {
        setShowError(true);

        refLoadingBar.current.continuousStart();
        setIsLoading(true);

        notification.receiverList = receivers;
        try{
            const res = await api.adminNotification.createNotification(notification);
            refLoadingBar.current.complete();
            setIsLoading(false);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Thêm mới thành công.", 'success');
                    router.push('/manage/notification');
                } else {
                    const message = res.data.message || "Thêm mới thất bại.";
                    common.Toast(message, 'error');
                }
            }
        } catch (error) {
            refLoadingBar.current.complete();
            setIsLoading(false);
            common.Toast(error, 'error');
        }
    }

    const back = () => {
        router.push('/manage/notification');
    }
    
    return (
        <>
            <Head>
                <title>
                    Chi tiết thông báo
                </title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="notification-detail-container">
                <div className="notification-detail-title">
                    <Link href="/manage/notification">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Danh sách thông báo</div>
                        </a>
                    </Link>
                </div>
                <div className="notification-detail-content">
                    <div className="form-group row my-4">
                        <label htmlFor="content" className="col-md-3 col-form-label">Nội dung:</label>
                        <div className="col-md-9">
                            <textarea className={classNames('form-control', { 'is-invalid': validate.checkEmptyInput(notification.content) && showError })} name="content" id="content" rows="10" onChange={onChangeInput} placeholder="Nhập nội dung" value={notification.content}></textarea>
                            {
                                validate.checkEmptyInput(notification.content) && showError &&
                                <div className="invalid-feedback">
                                    Nội dung không được rỗng.
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row my-3">
                        <label htmlFor="receiver" className="col-md-3 col-form-label">Người nhận:</label>
                        <div className="col-md-9">
                            <MultiSelect id="receiver"
                                value={receivers} options={listReceivers}
                                onChange={(e) => {
                                    setReceivers(e.value)}}
                                optionLabel="label" optionGroupLabel="label" optionGroupChildren="items" />
                            {
                                validate.checkEmptyInput(receivers) && showError &&
                                <div className="invalid-feedback">
                                    Người nhận không được rỗng.
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="notification-detail-footer">
                    <button className="btn button-back" onClick={back}>Trở về</button>
                    <div>
                        {
                            isLoading &&
                            <button type="button" className="btn button-update mr-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                        }
                        {
                            !isLoading &&
                            <button className="btn button-update" onClick={createNotification}>Thêm mới</button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateNotification;