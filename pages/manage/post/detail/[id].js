import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoadingBar from "react-top-loading-bar";
import { MultiSelect } from 'primereact/multiselect';
import { useEffect, useRef, useState } from 'react';
import api from './../../../../utils/backend-api.utils';
import * as common from './../../../../utils/common';
import * as validate from './../../../../utils/validate.utils';
import classNames from 'classnames';
import { PostDetailModel} from '../../../../models/category.model';
import Moment from 'moment';
Moment.locale('en');

const PostDetail = (props) => {
    
    const onChangeInput = () => {

    }

    const back = () => {
        router.push('/manage/post');
    }

    return (
        <>
            <Head>
                <title>
                    Chi tiết tin tức
                </title>
            </Head>
            {/* <LoadingBar color="#00ac96" ref={refLoadingBar} /> */}
            <div className="post-detail-container">
                <div className="post-detail-title">
                    <Link href="/manage/post">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Quản lí tin tức</div>
                        </a>
                    </Link>
                </div>
                <div className="category-detail-content">
                    <div className="form-group row my-3">
                        <label htmlFor="name" className="col-md-3 col-form-label">Tên tin tức:</label>
                        <div className="col-md-9">
                            <input type="text" name="name" className={classNames('form-control', { 'is-invalid': validate.checkEmptyInput(post.name) && showError })} id="name" value={post.name} onChange={onChangeInput} placeholder="Nhập tên tin tức:" />
                            {
                                validate.checkEmptyInput(category.name) && showError &&
                                <div className="invalid-feedback">
                                    Tên tin tức không được rỗng.
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group row my-4">
                        <label htmlFor="description" className="col-md-3 col-form-label">Mô tả:</label>
                        <div className="col-md-9">
                            <textarea className={classNames('form-control', { 'is-invalid': validate.checkEmptyInput(category.description) && showError })} name="description" id="description" rows="10" onChange={onChangeInput} placeholder="Nhập mô tả" value={category.description}></textarea>
                            {
                                validate.checkEmptyInput(category.description) && showError &&
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

                    <div className="form-group row my-3">
                        <label htmlFor="property" className="col-md-3 col-form-label">Thuộc tính danh mục:</label>
                        <div className="col-md-9">
                            <MultiSelect id="property" optionLabel="name" 
                                value={properties} options={ListProperties} 
                                onChange={(e) => setProperties([...e.value])}
                                filter placeholder="Chọn thuộc tính" 
                                name="property" 
                                className={classNames({ 'is-invalid': validate.checkEmptyInput(properties) && showError })} />
                            {
                                validate.checkEmptyInput(properties) && showError &&
                                <div className="invalid-feedback">
                                    Thuộc tính danh mục không được rỗng.
                                </div>
                            }
                        </div>
                    </div>
                </div>

                <div className="post-detail-footer">
                    <button className="btn button-back" onClick={back}>Trở về</button>
                    <div>
                        {
                            isLoadingDelete &&
                            <button type="button" className="btn button-delete mr-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                        }
                        {
                            !isLoadingDelete &&
                            <button className="btn button-delete mr-4" onClick={deleteCategory}>Xóa</button>
                        }

                        {
                            isLoadingUpdate &&
                            <button type="button" className="btn button-update mr-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                        }
                        {
                            !isLoadingUpdate &&
                            <button className="btn button-update" onClick={updateCategory}>Cập nhật</button>
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

export default PostDetail;