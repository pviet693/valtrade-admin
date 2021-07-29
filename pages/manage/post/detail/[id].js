import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LoadingBar from "react-top-loading-bar";
import { useEffect, useRef, useState } from 'react';
import api from './../../../../utils/backend-api.utils';
import * as common from './../../../../utils/common';
import * as validate from './../../../../utils/validate.utils';
import classNames from 'classnames';
import { PostDetailModel} from '../../../../models/post.model';
import Moment from 'moment';
import dynamic from "next/dynamic";
Moment.locale('en');

const Editor = dynamic(() => import("../../../../components/Editor"), {
    ssr: false,
});

const PostDetail = ({id}) => {
    const router = useRouter();
    const refLoadingBar = useRef(null);
    const [showError, setShowError] = useState(false);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
    const [newImg, setNewImg] = useState(null);
    const [url, setUrl] = useState("");
    const image = useRef(null);
    const [img, setImg] = useState({
        image: null
    })
    const [post, setPost] = useState(new PostDetailModel());
    const onChangeInput = () => {
        const { name, value } = event.target;
        setPost({ ...post, [name]: value });
    }
    const [dataContent, setDataContent] = useState("");


    const back = () => {
        router.push('/manage/post');
    }

    const deletePost = () =>{
        common.ConfirmDialog('Xác nhận', 'Bạn muốn xóa tin tức này?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    setIsLoadingDelete(true);
                    refLoadingBar.current.continuousStart();
                    try {
                        const res = await api.adminPost.deletePost(id);
                        refLoadingBar.current.complete();

                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                common.Toast('Xóa tin tức thành công.', 'success')
                                    .then(() => router.push('/manage/post') )
                            } else {
                                common.Toast('Xóa tin tức thất bại.', 'error');
                            }
                        }
                    } catch (error) {
                        refLoadingBar.current.complete();
                        setIsLoadingDelete(false);
                        common.Toast(error, 'error');
                    }
                }
            });
    }   

    const updatePost = async () =>{
        setShowError(true);
        refLoadingBar.current.continuousStart();
        setIsLoadingUpdate(true);
        try{
            let formData = new FormData();
            formData.append("id", id);
            formData.append("title", post.title);
            formData.append("content", dataContent);
            if (newImg)
                formData.append("image", newImg);
            
            const res = await api.adminPost.updatePost(formData);
            refLoadingBar.current.complete();
            setIsLoadingUpdate(false);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    common.Toast("Cập nhật thành công.", 'success');
                    router.push('/manage/post');
                } else {
                    common.Toast("Cập nhật thất bạn.", 'error');
                }
            }
        }catch(error){
            refLoadingBar.current.complete();
            setIsLoadingUpdate(false);
            common.Toast(error, 'error');
        }
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
            const res = await api.adminPost.detailPost(id);

            if (res.status === 200) {
                if (res.data.code === 200) {
                    const data = res.data.result;
                    let postDetail = new PostDetailModel();
                    postDetail.id = id;
                    postDetail.title = data.title || "";
                    toDataURL(data.imageUrl.url)
                    .then(dataUrl => {
                        const fileData = dataURLtoFile(dataUrl, `image.png`);
                        setNewImg(fileData);
                    });
                    setUrl(data.imageUrl.url);
                    postDetail.content = data.content || "";
                    setPost(postDetail);
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

    const onchangeEditor = (data) => {
        setDataContent(data);
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
                            <div>Quản lí tin tức</div>
                        </a>
                    </Link>
                </div>
                <div className="post-detail-content">
                    <div className="form-group row my-3">
                        <label htmlFor="title" className="col-md-3 col-form-label">Tiêu đề tin tức:</label>
                        <div className="col-md-9">
                            <input type="text" name="title" className={classNames('form-control', { 'is-invalid': validate.checkEmptyInput(post.title) && showError })} id="title" value={post.title} onChange={onChangeInput} placeholder="Nhập tên tin tức:" />
                            {
                                validate.checkEmptyInput(post.title) && showError &&
                                <div className="invalid-feedback">
                                    Tiêu đề tin tức không được rỗng.
                                </div>
                            }
                        </div>
                    </div>
                    <div className="form-group row my-4">
                        <label htmlFor="description" className="col-md-3 col-form-label">Mô tả:</label>
                        <div className="col-md-9">
                        <Editor value={post.content} onChange={onchangeEditor} />
                            {
                                validate.checkEmptyInput(post.content) && showError &&
                                <div className="invalid-feedback">
                                    Nội dung không được rỗng.
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
                            <button className="btn button-delete mr-4" onClick={deletePost}>Xóa</button>
                        }

                        {
                            isLoadingUpdate &&
                            <button type="button" className="btn button-update mr-4" disabled="disabled"><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                        }
                        {
                            !isLoadingUpdate &&
                            <button className="btn button-update" onClick={updatePost}>Cập nhật</button>
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