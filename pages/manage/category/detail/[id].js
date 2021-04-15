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
import { CategoryDetailModel, CategoryParentModel, ListProperties } from '../../../../models/category.model';
import Moment from 'moment';
Moment.locale('en');

const CategoryDetail = (props) => {
    const router = useRouter();
    const { id } = props;
    const [category, setCategory] = useState(new CategoryDetailModel());
    const [parents, setParents] = useState([]);
    const [showError, setShowError] = useState(false);
    const [properties, setProperties] = useState([]);
    const refLoadingBar = useRef(null);
    const [isLoadingDelete, setIsLoadingDelete] = useState(false);
    const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

    const onChangeInput = (event) => {
        const { name, value } = event.target;
        setCategory({ category, [name]: value });
    }

    const updateCategory = () => {
        setShowError(true);
        
        if (validate.checkEmptyInput(category.name)
            || validate.checkEmptyInput(category.description)
            || validate.checkEmptyInput(properties)
        ) {
            return;
        }

        refLoadingBar.current.continuousStart();
        setIsLoadingUpdate(true);

        let objectProperty = {};

        properties.forEach(x => {
            objectProperty[x.key] = null;
        })

        category.information = objectProperty;

        try {
            const res = api.adminCategory.update(category);
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

    const deleteCategory = () => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn xóa danh mục này?')
            .then(async (result) => {
                if (result.isConfirmed) {
                    setIsLoadingDelete(true);
                    refLoadingBar.current.continuousStart();
                    try {
                        const res = await api.adminCategory.delete(id);

                        refLoadingBar.current.complete();
                        setIsLoadingDelete(false);

                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                let newListUser = categories.filter(x => x.id !== id);
                                setCategories(newListUser);
                                common.Toast('Xóa danh mục thành công.', 'success')
                                    .then(() => router.push('/manage/category') )
                            } else {
                                common.Toast('Xóa danh mục thất bại.', 'error');
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

    const back = () => {
        router.push('/manage/category');
    }

    useEffect(async () => {
        try {
            refLoadingBar.current.continuousStart();
            const res = await api.adminCategory.getDetail(id);
            if (res.status === 200) {
                if (res.data.code === 200) {
                    const data = res.data.result;
                    let categoryDetail = new CategoryDetailModel();
                    categoryDetail.id = id;
                    categoryDetail.information = data.information;
                    categoryDetail.name = data.name || "";
                    categoryDetail.description = data.description || "";
                    categoryDetail.histories = data.array_update || [];
                    setCategory(categoryDetail);

                    let listProperties = [];
                    ListProperties.forEach(x => {
                        if (x.key in categoryDetail.information) {
                            listProperties.push(x);
                        }
                    })
                    setProperties(listProperties);
                }
            }
            // const res1 = await api.adminCategory.getListParent();
            // if (res1.status === 200) {
            //     if (res1.data.code === 200) {
            //         let list = [];
            //         const data = res1.data.result;
            //         data.forEach(x => {
            //             let parent = new CategoryParentModel();
            //             parent.id = x._id || "";
            //             parent.name = x.name || "";
            //             list.push(parent);
            //         })
            //         setParents(list);
            //     }
            // }
            refLoadingBar.current.complete();
        } catch (error) {
            refLoadingBar.current.complete();
            common.Toast(error, 'error');
        }
    }, [])

    return (
        <>
            <Head>
                <title>
                    Chi tiết danh mục
                </title>
            </Head>
            <LoadingBar color="#00ac96" ref={refLoadingBar} />
            <div className="category-detail-container">
                <div className="category-detail-title">
                    <Link href="/manage/category">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Chi tiết danh mục</div>
                        </a>
                    </Link>
                </div>
                <div className="category-detail-content">
                    <div className="form-group row my-3">
                        <label htmlFor="name" className="col-md-3 col-form-label">Tên danh mục:</label>
                        <div className="col-md-9">
                            <input type="text" name="name" className={classNames('form-control', { 'is-invalid': validate.checkEmptyInput(category.name) && showError })} id="name" value={category.name} onChange={onChangeInput} placeholder="Nhập tên danh mục" />
                            {
                                validate.checkEmptyInput(category.name) && showError &&
                                <div className="invalid-feedback">
                                    Tên danh mục không được rỗng.
                                </div>
                            }
                        </div>
                    </div>
                    {/* <div className="form-group row my-4">
                        <label htmlFor="parentId" className="col-md-3 col-form-label">Danh mục cha:</label>
                        <div className="col-md-9">
                            <select className={classNames('form-control')} id="parentId" name="parentId" onChange={onChangeInput} placeholder="Chọn danh mục" value={category.parentId}>
                                {
                                    category.parentId &&
                                    <>
                                        {
                                            parents.length > 0 &&
                                            parents.map((element, idx) => {
                                                if (element.id === category.parentId)
                                                    return <option value={element.id} key={idx} defaultValue hidden>{element.name}</option>
                                                else {
                                                    return <option value={element.id} key={idx}>{element.name}</option>
                                                }
                                            })
                                        }
                                    </>
                                }
                                {
                                    !category.parentId &&
                                    <>
                                        <option value="" defaultValue hidden>Chọn danh mục cha</option>
                                        {
                                            parents.length > 0 &&
                                            parents.map((element, idx) => {
                                                return <option value={element.id} key={idx}>{element.name}</option>
                                            })
                                        }
                                    </>
                                }
                            </select>
                        </div>
                    </div> */}
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
                    <div className="form-group row my-3">
                        <label htmlFor="property" className="col-md-3 col-form-label">Thuộc tính danh mục:</label>
                        <div className="col-md-9">
                            <MultiSelect id="property" optionLabel="name" 
                                value={properties} options={ListProperties} 
                                onChange={(e) => setProperties(e.value)} 
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

                <div className="category-detail-footer">
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

export default CategoryDetail;