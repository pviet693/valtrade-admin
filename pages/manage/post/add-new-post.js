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
import { PostModel} from '../../../models/post.model';
import Moment from 'moment';
Moment.locale('en');
import dynamic from "next/dynamic";

const Editor = dynamic(() => import("../../../components/Editor"), {
  ssr: false,
});


const CreatePost = () => {
    const router = useRouter();
    const [post, setPost] = useState(new PostModel());
    const [showError, setShowError] = useState(false);
    const refLoadingBar = useRef(null);
    const [isLoading, setIsLoading] = useState(false);
    const image = useRef(null);
    const [img, setImg] = useState({
        image: null
    })
    const [newImg, setNewImg] = useState(null);
    const [urlImage, setUrlImage] = useState({
        image: ""
    });
    const [dataContent, setDataContent] = useState("");

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setPost({ ...post, [name]: value });
    }

    const createPost = async () => {
        setShowError(true);

        refLoadingBar.current.continuousStart();
        setIsLoading(true);
        post.content = dataContent;
        try{
            let formData = new FormData();
            formData.append("title", post.title);
            formData.append("content", post.content);
            if (newImg)
                formData.append("image", newImg);
            const res = await api.adminPost.createPost(formData);
            refLoadingBar.current.complete();
            setIsLoading(false);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Thêm mới thành công.", 'success');
                    router.push('/manage/post');
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
        router.push('/manage/post');
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
                    Chi tiết tin tức
                </title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="post-detail-container">
                <div className="post-detail-title">
                    <Link href="/manage/post">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Danh sách danh mục</div>
                        </a>
                    </Link>
                </div>
                <div className="post-detail-content">
                    <div className="form-group row my-3">
                        <label htmlFor="title" className="col-md-3 col-form-label">Tiêu đề:</label>
                        <div className="col-md-9">
                            <input type="text" name="title" className={classNames('form-control', { 'is-invalid': validate.checkEmptyInput(post.title) && showError })} id="title" value={post.title} onChange={onChangeInput} placeholder="Nhập tiêu đề" />
                            {
                                validate.checkEmptyInput(post.title) && showError &&
                                <div className="invalid-feedback">
                                    Tiêu đề không được rỗng.
                                </div>
                            }
                        </div>
                    </div>
                    
                    <div className="form-group row my-4">
                        <label htmlFor="content" className="col-md-3 col-form-label">Nội dung</label>
                        <div className="col-md-9">
                            <Editor value={dataContent} onChange={(data) => setDataContent(data)} />
                            {/* {
                                validate.checkEmptyInput(post.content) && showError &&
                                <div className="invalid-feedback">
                                    Nội dung không được rỗng.
                                </div>
                            } */}
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

                <div className="post-detail-footer">
                    <button className="btn button-back" onClick={back}>Trở về</button>
                    <div>
                        {
                            isLoading &&
                            <button type="button" className="btn button-update mr-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                        }
                        {
                            !isLoading &&
                            <button className="btn button-update" onClick={createPost}>Thêm mới</button>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreatePost;