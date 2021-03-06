import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoadingBar from "react-top-loading-bar";
import { useEffect, useRef, useState } from 'react';
import api from './../../../../utils/backend-api.utils';
import * as common from './../../../../utils/common';
import * as validate from './../../../../utils/validate.utils';
import classNames from 'classnames';
import { BrandDetailModel} from '../../../../models/brand.model';
import Moment from 'moment';
Moment.locale('en');

const BrandDetail = (props) => {
    const router = useRouter();
    const { id } = props;
    const [brand, setBrand] = useState(new BrandDetailModel());
    const [showError, setShowError] = useState(false);
    const refLoadingBar = useRef(null);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [newImg, setNewImg] = useState(null);
    const [url, setUrl] = useState("");
    const image = useRef(null);
    const [img, setImg] = useState({
        image: null
    })

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setBrand({ ...brand, [name]: value });
    }

    const updateBrand = async () => {
        setShowError(true);
        refLoadingBar.current.continuousStart();
        setIsLoadingUpdate(true);
        try {
            let formData = new FormData();
            formData.append("id", brand.id);
            formData.append("name", brand.name);
            formData.append("description", brand.description);
            if (newImg)
                formData.append("image", newImg);
            const res = await api.adminBrand.updateBrand(formData);
            refLoadingBar.current.complete();
            setIsLoadingUpdate(false);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Cập nhật thành công.", 'success');
                } else {
                    common.Toast("Cập nhật thất bạn.", 'error');
                }
            }
        } catch(error) {
            refLoadingBar.current.complete();
            setIsLoadingUpdate(false);
            common.Toast(error, 'error');
        }
    }

    const deleteBrand = () => {
        
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
        tempImage = file;
        setNewImg(tempImage);

        let tempUrl = "";
        tempUrl = URL.createObjectURL(file);
        setUrl(tempUrl);
        URL.revokeObjectURL(file);
    }

    const deleteImage = () => {
        let tempImage = img;
        tempImage = null;
        setNewImg(tempImage);

        let tempUrl = "";
        setUrl(tempUrl );
    }

    useEffect(async () => {
        try {
            const res = await api.adminBrand.detailBrand(id);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    const data = res.data.result;
                    let brandDetail = new BrandDetailModel();
                    brandDetail.id = id;
                    brandDetail.name = data.name;
                    brandDetail.description = data.description || "";
                    setBrand({...brandDetail});
                    toDataURL(data.imageUrl.url)
                    .then(dataUrl => {
                        const fileData = dataURLtoFile(dataUrl, `image.png`);
                        setNewImg(fileData);
                    });
                    setUrl(data.imageUrl.url);
                }
            }
        } catch (error) {
            common.Toast(error, 'error');
        }
    }, [])

    // convert url to base64
    const toDataURL = (url) => fetch(url)
        .then(response => response.blob())
        .then(blob => new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve(reader.result)
            reader.onerror = reject
            reader.readAsDataURL(blob)
        }))

    // covert base64 to file
    const dataURLtoFile = (dataUrl, filename) => {
        let arr = dataUrl.split(','), mime = arr[0].match(/:(.*?);/)[1],
            bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    }

    return (
        <>
            <Head>
                <title>
                    Chi tiết thương hiệu
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
                            <input type="text" name="name" className={classNames('form-control')} id="name" value={brand.name} onChange={onChangeInput} placeholder="Nhập tên thương hiệu" />
                            {/* {
                                validate.checkEmptyInput(brand.name) && showError &&
                                <div className="invalid-feedback">
                                    Tên thương hiệu không được rỗng.
                                </div>
                            } */}
                        </div>
                    </div>
                    <div className="form-group row my-4">
                        <label htmlFor="description" className="col-md-3 col-form-label">Mô tả:</label>
                        <div className="col-md-9">
                            <textarea className={classNames('form-control')} name="description" id="description" rows="10" onChange={onChangeInput} placeholder="Nhập mô tả" value={brand.description}></textarea>
                            {/* {
                                validate.checkEmptyInput(brand.description) && showError &&
                                <div className="invalid-feedback">
                                    Mô tả không được rỗng.
                                </div>
                            } */}
                        </div>
                    </div>

                    <div className="form-group row my-4">
                        <label htmlFor="image" className="col-md-3 col-form-label">Hình ảnh: </label>
                        <div className="add-image-container mb-4 col-md-9">
                            <div className="add-image-box">
                                {
                                    url === "" &&
                                    <>
                                        <div className={classNames("add-image-circle")}>
                                            <input type="file" accept="image/*" ref={image} onChange={selectImage} />
                                            <i className="fa fa-plus" aria-hidden onClick={addImage}></i>
                                        </div>
                                    </>
                                }
                                {
                                    url !== "" &&
                                    <>
                                        <img 
                                            src={url} 
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
                            isLoadingDelete &&
                            <button type="button" className="btn button-delete mr-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                        }
                        {
                            !isLoadingDelete &&
                            <button className="btn button-delete mr-4" onClick={deleteBrand}>Xóa</button>
                        }

                        {
                            isLoadingUpdate &&
                            <button type="button" className="btn button-update mr-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                        }
                        {
                            !isLoadingUpdate &&
                            <button className="btn button-update" onClick={updateBrand}>Cập nhật</button>
                        }
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

export default BrandDetail;