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
import { CategoryDetailModel, CategoryParentModel, ListProperties } from '../../../models/category.model';
import Moment from 'moment';
Moment.locale('en');

const CreateCategory = () => {
    const router = useRouter();
    const [category, setCategory] = useState(new CategoryDetailModel());
    const [showError, setShowError] = useState(false);
    const [properties, setProperties] = useState([]);
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const image = useRef(null);
    const [newImg, setNewImg] = useState(null);
    const [img, setImg] = useState({
        image: null
    })
    const [urlImage, setUrlImage] = useState({
        image: ""
    });

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setCategory({ ...category, [name]: value });
    }

    const createCategory = async () => {
        setShowError(true);

        if (validate.checkEmptyInput(category.name)
            || validate.checkEmptyInput(category.description)
        ) {
            return;
        }

        refLoadingBar.current.continuousStart();
        setIsLoading(true);

        let objectProperty = {};
        console.log(properties);
        properties.forEach(x => {
            objectProperty[x.key] = null;
        });

        category.information = objectProperty;
        try {
            let formData = new FormData();

            formData.append("name", category.name);
            formData.append("description", category.description);
            formData.append("information", JSON.stringify(category.information));
            if (newImg)
                formData.append("image", newImg);
            const res = await api.adminCategory.createNew(formData);
            refLoadingBar.current.complete();
            setIsLoading(false);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Th??m m???i th??nh c??ng.", 'success');
                    router.push('/manage/category');
                } else {
                    const message = res.data.message || "Th??m m???i th???t b???i.";
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
        router.push('/manage/category');
    }
    
    const addImage = () => {
        image.current.click();
    }

    const selectImage = (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        if (!file) return;
        let tempImage = img;
        tempImage= file;
        setNewImg(tempImage);

        let tempUrl = urlImage;
        tempUrl.image = URL.createObjectURL(file);
        setUrlImage(tempUrl);
        URL.revokeObjectURL(file);
    }

    const deleteImage = () => {
        let tempImage = img;
        tempImage.image = null;
        setNewImg(tempImage);

        let tempUrl = urlImage;
        tempUrl.image = "";
        setUrlImage(tempUrl);
    }


    return (
        <>
            <Head>
                <title>
                    Chi ti???t danh m???c
                </title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="category-detail-container">
                <div className="category-detail-title">
                    <Link href="/manage/category">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Danh s??ch danh m???c</div>
                        </a>
                    </Link>
                </div>
                <div className="category-detail-content">
                    <div className="form-group row my-3">
                        <label htmlFor="name" className="col-md-3 col-form-label">T??n danh m???c:</label>
                        <div className="col-md-9">
                            <input type="text" name="name" className={classNames('form-control', { 'is-invalid': validate.checkEmptyInput(category.name) && showError })} id="name" value={category.name} onChange={onChangeInput} placeholder="Nh???p t??n danh m???c" />
                            {
                                validate.checkEmptyInput(category.name) && showError &&
                                <div className="invalid-feedback">
                                    T??n danh m???c kh??ng ???????c r???ng.
                                </div>
                            }
                        </div>
                    </div>
                    
                    <div className="form-group row my-4">
                        <label htmlFor="description" className="col-md-3 col-form-label">M?? t???:</label>
                        <div className="col-md-9">
                            <textarea className={classNames('form-control', { 'is-invalid': validate.checkEmptyInput(category.description) && showError })} name="description" id="description" rows="10" onChange={onChangeInput} placeholder="Nh???p m?? t???" value={category.description}></textarea>
                            {
                                validate.checkEmptyInput(category.description) && showError &&
                                <div className="invalid-feedback">
                                    M?? t??? kh??ng ???????c r???ng.
                                </div>
                            }
                        </div>
                    </div>

                    <div className="form-group row my-4">
                        <label htmlFor="image" className="col-md-3 col-form-label">H??nh ???nh: </label>
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

                    <div className="form-group row my-3">
                        <label htmlFor="property" className="col-md-3 col-form-label">Thu???c t??nh danh m???c:</label>
                        <div className="col-md-9">
                            <MultiSelect id="property" optionLabel="name"
                                value={properties} options={ListProperties}
                                onChange={(e) => setProperties(e.value)}
                                filter placeholder="Ch???n thu???c t??nh"
                                name="property"
                                className={classNames({ 'is-invalid': validate.checkEmptyInput(properties) && showError })} />
                            {
                                validate.checkEmptyInput(properties) && showError &&
                                <div className="invalid-feedback">
                                    Thu???c t??nh danh m???c kh??ng ???????c r???ng.
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="category-detail-footer">
                    <button className="btn button-back" onClick={back}>Tr??? v???</button>
                    <div>
                        {
                            isLoading &&
                            <button type="button" className="btn button-update mr-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>X??? l??...</button>
                        }
                        {
                            !isLoading &&
                            <button className="btn button-update" onClick={createCategory}>Th??m m???i</button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateCategory;