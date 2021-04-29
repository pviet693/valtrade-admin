import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoadingBar from "react-top-loading-bar";
import { useEffect, useRef, useState } from 'react';
import api from './../../../utils/backend-api.utils';
import * as common from './../../../utils/common';
import * as validate from './../../../utils/validate.utils';
import classNames from 'classnames';
import { BrandModel} from '../../../models/brand.model';
import Moment from 'moment';
Moment.locale('en');

const CreateCategory = () => {
    const router = useRouter();
    const [brand, setBrand] = useState(new BrandModel());
    const [showError, setShowError] = useState(false);
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const image = useRef(null);
    const [img, setImg] = useState({
        image: null
    })
    const [urlImage, setUrlImage] = useState({
        image: ""
    });

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setBrand({ ...brand, [name]: value });
    }

    const createBrand = async () => {
        setShowError(true);

        if (validate.checkEmptyInput(brand.name)
            || validate.checkEmptyInput(brand.description)
        ) {
            return;
        }

        refLoadingBar.current.continuousStart();
        setIsLoading(true);

        try {
            let formData = new FormData();
            formData.append("name", brand.name);
            formData.append("description", brand.description);
            if (img.image)
                formData.append("image", img.image);
            const res = await api.adminBrand.createBrand(formData);
            refLoadingBar.current.complete();
            setIsLoading(false);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Thêm mới thành công.", 'success')
                        .then(() => router.push('/manage/brand'));
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
        router.push('/manage/brand');
    }

    const addImage = () => {
        image.current.click();
    }

    const selectImage = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImage = img;
        tempImage.image = file;
        setImg(tempImage);

        let tempUrl = urlImage;
        tempUrl.image = URL.createObjectURL(file);
        setUrlImage({ ...tempUrl });
        URL.revokeObjectURL(file);
    }

    const deleteImage = () => {
        let tempImage = img;
        tempImage.image = null;
        setImg({ ...tempImage });

        let tempUrl = urlImage;
        tempUrl.image = "";
        setUrlImage({ ...tempUrl });
    }

    return (
        <>
            <Head>
                <title>
                    Thêm mới thương hiệu
                </title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="brand-detail-container">
                <div className="brand-detail-title">
                    <Link href="/manage/brand">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Chi tiết thương hiệu</div>
                        </a>
                    </Link>
                </div>
                <div className="brand-detail-content">
                    <div className="form-group row my-3">
                        <label htmlFor="name" className="col-md-3 col-form-label">Tên thương hiệu:</label>
                        <div className="col-md-9">
                            <input type="text" name="name" className={classNames('form-control', { 'is-invalid': validate.checkEmptyInput(brand.name) && showError })} id="name" value={brand.name} onChange={onChangeInput} placeholder="Nhập tên thương hiệu" />
                            {
                                validate.checkEmptyInput(brand.name) && showError &&
                                <div className="invalid-feedback">
                                    Tên thương hiệu không được rỗng.
                                </div>
                            }
                        </div>
                    </div>
                    
                    <div className="form-group row my-4">
                        <label htmlFor="description" className="col-md-3 col-form-label">Mô tả:</label>
                        <div className="col-md-9">
                            <textarea className={classNames('form-control', { 'is-invalid': validate.checkEmptyInput(brand.description) && showError })} name="description" id="description" rows="10" onChange={onChangeInput} placeholder="Nhập mô tả" value={brand.description}></textarea>
                            {
                                validate.checkEmptyInput(brand.description) && showError &&
                                <div className="invalid-feedback">
                                    Mô tả không được rỗng.
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group row my-4">
                        <label htmlFor="image" className="col-md-3 col-form-label">Hình ảnh: </label>
                        <div className="add-image-container mb-4 col-md-9">
                            <div className="add-image-box">
                                {
                                    urlImage.image === "" &&
                                    <>
                                        <div className={classNames("add-image-circle")}>
                                            <input type="file" accept="image/*" ref={image} onChange={selectImage} />
                                            <i className="fa fa-plus" aria-hidden onClick={addImage}></i>
                                        </div>
                                    </>
                                }
                                {
                                    urlImage.image !== "" &&
                                    <>
                                        <img 
                                            src={urlImage.image} 
                                            alt="Image" />
                                        <i className="fa fa-trash" aria-hidden onClick={() => deleteImage()}></i>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </div>

                <div className="brand-detail-footer">
                    <button className="btn button-back" onClick={back}>Trở về</button>
                    <div>
                        {
                            isLoading &&
                            <button type="button" className="btn button-update mr-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                        }
                        {
                            !isLoading &&
                            <button className="btn button-update" onClick={createBrand}>Thêm mới</button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateCategory;