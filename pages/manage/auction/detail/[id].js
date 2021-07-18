import Head from 'next/head';
import { Dropdown } from 'primereact/dropdown';
import LoadingBar from "react-top-loading-bar";
import { useRef, useState, useEffect, useContext } from 'react';
import api from '../../../../utils/backend-api.utils';
import * as common from './../../../../utils/common';
import { ListProperties } from './../../../../models/category.model';
import cookie from "cookie";
import { useRouter } from 'next/router';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar } from 'primereact/calendar';
import Link from 'next/link';
import ReactImageZoom from 'react-image-zoom';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import { useFormik } from 'formik';
import { DataContext } from '../../../../store/GlobalState';

const AuctionDetail = (props) => {
    const router = useRouter();
    const { socket } = useContext(DataContext);
    const { categories, product, info, attributes, brands, brand } = props;
    const [category] = useState(product.category);
    const [loadingReject, setLoadingReject] = useState(false);
    const [loadingApprove, setLoadingApprove] = useState(false);
    const [propertyDefault, setPropertyDefault] = useState(product);
    const [information] = useState(info);
    const refLoadingBar = useRef(null);
    const [open, setOpen] = useState(false);
    const formik = useFormik({
        initialValues: {
            reason: ""
        },
        validate: (data) => {
            let errors = {};

            if (!data.reason) errors.reason = "Lý do không được rỗng.";

            return errors;
        },
        onSubmit: (data) => {
            setOpen(false);
            reject();
        }
    });

    const reject = () => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn từ chối sản phẩm này?', "Từ chối")
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        setLoadingReject(true);
                        refLoadingBar.current.continuousStart();

                        const res = await api.adminAuction.putReject({ id: product.id, reason: formik.values.reason });

                        setLoadingReject(false);
                        refLoadingBar.current.complete();

                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                common.Toast('Thành công.', 'success')
                                    .then(() => router.push('/manage/auction'));
                            } else {
                                const message = res.data.message || 'Thất bại.';
                                common.Toast(message, 'error');
                            }
                        }
                    } catch (error) {
                        setLoadingReject(false);
                        refLoadingBar.current.complete();
                        common.Toast(error, 'error');
                    }
                }
            })
    }

    const approve = () => {
        common.ConfirmDialog('Xác nhận', 'Bạn muốn chấp nhận sản phẩm này?', "Chấp nhận")
            .then(async (result) => {
                if (result.isConfirmed) {
                    try {
                        setLoadingApprove(true);
                        refLoadingBar.current.continuousStart();

                        const res = await api.adminAuction.postApprove({ id: product.id });

                        setLoadingApprove(false);
                        refLoadingBar.current.complete();

                        if (res.status === 200) {
                            if (res.data.code === 200) {
                                common.Toast('Thành công.', 'success')
                                    .then(() => {
                                        socket.emit("newBid", {
                                            id: product.id,
                                            countDown: product.countDown
                                        })
                                        router.push('/manage/auction')
                                    });
                            } else {
                                const message = res.data.message || 'Thất bại.';
                                common.Toast(message, 'error');
                            }
                        }
                    } catch (error) {
                        setLoadingApprove(false);
                        refLoadingBar.current.complete();
                        common.Toast(error, 'error');
                    }
                }
            })
    }

    const back = () => {
        router.push('/manage/auction');
    }

    useEffect(() => {
        let temp = propertyDefault;
        temp.restWarrantyTime = new Date(propertyDefault.restWarrantyTime);
        setPropertyDefault(temp);
    }, [])


    return (
        <>
            <div className="product-detail">
                <Head>
                    <title>Chi tiết sản phẩm</title>
                </Head>
                <LoadingBar color="#00ac96" ref={refLoadingBar} onLoaderFinished={() => { }} />
                <div className="product-detail__title">
                    <Link href="/manage/product">
                        <a className="d-flex align-items-center">
                            <i className="pi pi-angle-left mr-1"></i>
                            <div>Chi tiết sản phẩm</div>
                        </a>
                    </Link>
                </div>
                <div className="product-detail__container">
                    <div className="product-detail__content">
                        <div className="form-input">
                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="name" className="col-sm-3 col-form-label">Tên sản phẩm: </label>
                                <div className="col-sm-9">
                                    <div className="input-group">
                                        <input className="form-control" defaultValue={propertyDefault.name} disabled />
                                        <span className="input-group-addon">{`${propertyDefault.name.length}/200`}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="form-group row align-items-center d-flex">
                                <label htmlFor="category" className="col-sm-3 col-form-label">Danh mục sản phẩm: </label>
                                <div className="col-sm-9">
                                    <Dropdown value={category} options={categories}
                                        optionLabel="name"
                                        disabled
                                        filter showClear filterBy="name" placeholder="Chọn danh mục" id="category"
                                    />
                                </div>
                            </div>


                            <div>
                                <div className="form-group row">
                                    <label htmlFor="description" className="col-sm-3 col-form-label">Mô tả sản phẩm: </label>
                                    <div className="col-sm-9">
                                        <textarea className="form-control"
                                            placeholder="Mô tả sản phẩm" rows="8"
                                            name="description" id="description"
                                            defaultValue={propertyDefault.description} disabled></textarea>
                                        <div className="text-right mt-1">
                                            {`${propertyDefault.description.length}/3000`}
                                        </div>
                                    </div>
                                </div>

                                <div className="form-group row align-items-center d-flex">
                                    <label htmlFor="price" className="col-sm-3 col-form-label">Giá bán: </label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <InputNumber name="price" id="price" placeholder="Nhập giá sản phẩm"
                                                value={propertyDefault.price}
                                                disabled
                                            />
                                            <span className="input-group-addon">vnđ</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row align-items-center d-flex">
                                    <label htmlFor="oldPrice" className="col-sm-3 col-form-label">Giá mua ban đầu: </label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <InputNumber name="oldPrice" id="oldPrice" placeholder="Nhập giá mua ban đầu"
                                                value={propertyDefault.oldPrice} disabled
                                            />
                                            <span className="input-group-addon">vnđ</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row align-items-center d-flex input-brand">
                                    <label htmlFor="brand" className="col-sm-3 col-form-label">Thương hiệu: </label>
                                    <div className="col-sm-9">
                                        <Dropdown value={brand} options={brands}
                                            optionLabel="name" filter showClear
                                            filterBy="name" placeholder="Chọn thương hiệu" id="brand"
                                            disabled
                                        />
                                    </div>
                                </div>
                                <div className="form-group row align-items-center d-flex">
                                    <label htmlFor="sku" className="col-sm-3 col-form-label">SKU: </label>
                                    <div className="col-sm-9">
                                        <input className="form-control"
                                            placeholder="Nhập sku" type="text" name="sku" id="=sku"
                                            disabled
                                            defaultValue={propertyDefault.sku}
                                        />
                                    </div>
                                </div>
                                <div className="form-group row align-items-center d-flex">
                                    <label htmlFor="restWarrantyTime" className="col-sm-3 col-form-label">Ngày hết hạn bảo hành: </label>
                                    <div className="col-sm-9">
                                        <Calendar id="date"
                                            value={new Date(propertyDefault.restWarrantyTime)}
                                            disabled
                                            dateFormat="dd/mm/yy" mask="99/99/9999"
                                            showIcon placeholder="Ngày hết hạn bảo hành" name="restWarrantyTime" id="restWarrantyTime"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row align-items-center d-flex">
                                    <label htmlFor="countProduct" className="col-sm-3 col-form-label">Số lượng: </label>
                                    <div className="col-sm-9">
                                        <input placeholder="Nhập số lượng sản phẩm" type="number" name="countProduct"
                                            id="countProduct" defaultValue={propertyDefault.countProduct}
                                            disabled
                                            className="form-control"
                                        />
                                    </div>
                                </div>
                                <div className="form-group row align-items-center d-flex">
                                    <label htmlFor="countProduct" className="col-sm-3 col-form-label">Cân nặng: </label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <InputNumber name="weight" id="weight" placeholder="Nhập cân nặng"
                                                value={propertyDefault.weight} disabled
                                                mode="decimal" minFractionDigits={1} maxFractionDigits={2}
                                            />
                                            <span className="input-group-addon">gram</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row align-items-center d-flex">
                                    <label htmlFor="countProduct" className="col-sm-3 col-form-label">Chiều dài: </label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <InputNumber name="length" id="length" placeholder="Nhập chiều dài"
                                                value={propertyDefault.length} disabled
                                                mode="decimal" minFractionDigits={1} maxFractionDigits={2}
                                            />
                                            <span className="input-group-addon">cm</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row align-items-center d-flex">
                                    <label htmlFor="countProduct" className="col-sm-3 col-form-label">Chiều rộng: </label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <InputNumber name="width" id="width" placeholder="Nhập chiều rộng"
                                                value={propertyDefault.width} disabled
                                                mode="decimal" minFractionDigits={1} maxFractionDigits={2}
                                            />
                                            <span className="input-group-addon">cm</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row align-items-center d-flex">
                                    <label htmlFor="countProduct" className="col-sm-3 col-form-label">Chiều cao: </label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <InputNumber name="height" id="height" placeholder="Nhập chiều cao"
                                                value={propertyDefault.height} disabled
                                                mode="decimal" minFractionDigits={1} maxFractionDigits={2}
                                            />
                                            <span className="input-group-addon">cm</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group row align-items-center d-flex">
                                    <label htmlFor="countDown" className="col-sm-3 col-form-label">Thời gian đấu giá: </label>
                                    <div className="col-sm-9">
                                        <div className="input-group">
                                            <InputNumber name="countDown" id="countDown" placeholder="Nhập chiều cao"
                                                value={propertyDefault.countDown} disabled
                                                mode="decimal" minFractionDigits={1} maxFractionDigits={2}
                                            />
                                            <span className="input-group-addon">giây</span>
                                        </div>
                                    </div>
                                </div>
                                {
                                    propertyDefault.note &&
                                    <div className="form-group row">
                                        <label htmlFor="note" className="col-sm-3 col-form-label">Lưu ý: </label>
                                        <div className="col-sm-9">
                                            <textarea className="form-control"
                                                placeholder="Nhập lưu ý" rows="8" name="note" id="note"
                                                rows="8"
                                                value={propertyDefault.note} disabled>
                                            </textarea>
                                            <div className="text-right mt-1">
                                                {`${propertyDefault.note.length}/3000`}
                                            </div>
                                        </div>
                                    </div>
                                }

                                <div className="form-group row">
                                    <label htmlFor="name-product" className="col-sm-3 col-form-label">Hình ảnh:</label>
                                    <div className="col-sm-9 row d-flex justify-content-between flex-wrap">
                                        {
                                            product.arrayImage.map((image) => (
                                                <div className="col-sm-4" key={image.id}>
                                                    <div className="image-box">
                                                        <ReactImageZoom
                                                            width={250}
                                                            height={250}
                                                            zoomWidth={500}
                                                            img={image.url}
                                                            zoomPosition="left"
                                                            offset={{ vertical: 0, horizontal: 10 }}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                                {/* <div className="form-group row">
                                <label htmlFor="name-product" className="col-sm-2 col-form-label">Video: </label>
                                <div className="d-flex flex-row flex-wrap align-items-center">
                                    
                                </div>
                            </div> */}
                                <div className="form-group row">
                                    <label htmlFor="delivery" className="col-sm-3 col-form-label">Cài đặt vận chuyển: </label>
                                    <div className="col-sm-9">
                                        <input
                                            id="delivery"
                                            className="form-control"
                                            defaultValue={product.delivery}
                                            disabled
                                            type="text"
                                        />
                                    </div>
                                </div>

                                {
                                    attributes.map(x => {
                                        return (

                                            <div className="form-group row align-items-center d-flex" key={x.key}>
                                                <label htmlFor={x.key} className="col-sm-3 col-form-label">{`${x.name}:`}</label>
                                                <div className="col-sm-9">
                                                    <input
                                                        className="form-control"
                                                        defaultValue={information[x.key] || ""}
                                                        disabled
                                                        placeholder={`${x.name}`} type="text" name={x.key} id={x.key}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    })
                                }

                                {
                                    product.reason &&
                                    <div className="form-group row">
                                        <label htmlFor="reason" className="col-sm-3 col-form-label">Lý do: </label>
                                        <div className="col-sm-9">
                                            <textarea
                                                name="reason"
                                                className="form-control"
                                                defaultValue={product.reason}
                                                disabled
                                                rows="8"
                                            />
                                        </div>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="product-detail-footer">
                <button className="btn btn--back" onClick={back}>Trở về</button>
                <div>
                    {
                        !product.reject && !product.accept &&
                        <>
                            {
                                loadingReject &&
                                <button type="button" className="btn btn--reject mr-4" disabled><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                            }
                            {
                                !loadingReject &&
                                <button className="btn btn--reject mr-4" onClick={() => setOpen(true)}>Từ chối</button>
                            }

                            {
                                loadingApprove &&
                                <button type="button" className="btn btn--approve" disabled><i className="fa fa-spinner fa-spin mr-2" aria-hidden></i>Xử lí...</button>
                            }
                            {
                                !loadingApprove &&
                                <button className="btn btn--approve" onClick={approve}>Chấp nhận</button>
                            }
                        </>
                    }
                </div>
            </div>

            <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Xác nhận từ chối</DialogTitle>
                <DialogContent>
                    <label className="mb-3" htmlFor="reason">Vui lòng nhập lí do</label>
                    <textarea
                        type="text" className="form-control reason-input"
                        name="reason"
                        placeholder="Lý do..."
                        rows="6"
                        value={formik.values.reason} onChange={formik.handleChange}
                    />
                    {
                        formik.touched.reason && formik.errors.reason &&
                        <small className="invalid-feedback">{formik.errors.reason}</small>
                    }
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} className="btn btn--cancel">
                        Hủy
                    </Button>
                    <Button className="btn btn--reject" onClick={formik.handleSubmit}>
                        Từ chối
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export async function getServerSideProps(ctx) {
    const id = ctx.query.id;
    const cookies = ctx.req.headers.cookie;
    if (cookies) {
        const token = cookie.parse(cookies).admin_token;
        if (token) {
            let brands = [];
            let brand = { id: "", name: "" };
            let categories = [];
            let listAttribute = [];
            let product = {
                id: "",
                name: "",
                description: "",
                category: "",
                price: 0,
                oldPrice: 0,
                sku: "",
                countProduct: 0,
                note: "",
                restWarrantyTime: "",
                weight: 0,
                length: 0,
                width: 0,
                height: 0,
                arrayImage: [],
                accept: false,
                reject: false,
                delivery: "",
                reason: "",
                countDown: 0
            }
            let information = {};
            try {
                const res = await api.adminCategory.getList(token);

                if (res.status === 200) {
                    res.data.list.forEach(x => {
                        let categoryItem = { id: "", name: "" };
                        categoryItem.id = x.childId || "";
                        categoryItem.name = x.childName || "";
                        categories.push(categoryItem);
                    })

                    const resProduct = await api.adminAuction.getDetail(id, token);
                    if (resProduct.status === 200) {
                        if (resProduct.data.code === 200) {
                            const result = resProduct.data.result;
                            brand.id = result.brand ? (result.brand._id || "") : "";
                            brand.name = result.brand ? (result.brand.name || "") : "";
                            product.id = result._id || "";
                            product.name = result.name || "";
                            product.description = result.description || "";
                            product.category = {
                                id: result.categoryInfor ? (result.categoryInfor._id || "") : "",
                                name: result.categoryInfor ? (result.categoryInfor.name || "") : ""
                            };
                            product.price = result.price;
                            product.oldPrice = result.oldPrice;
                            product.sku = result.sku;
                            product.countProduct = result.countProduct;
                            product.note = result.note || "";
                            product.restWarrantyTime = result.restWarrantyTime;
                            product.weight = result.weight || 0;
                            product.length = result.length || 0;
                            product.width = result.width || 0;
                            product.height = result.height || 0;
                            product.countDown = result.countDown || 0;
                            product.reject = result.reject || false;
                            product.accept = result.accept || false;
                            product.arrayImage = result.arrayImage || [];
                            product.reason = result.reason || "";
                            result.deliverArray.forEach(x => {
                                if (x.ghn) product.delivery += product.delivery ? `, Giao hàng nhanh` : "Giao hàng nhanh";
                                if (x.ghtk) product.delivery += product.delivery ? `, Giao tiết kiệm` : "Giao hàng tiết kiệm";
                                if (x.local) product.delivery += product.delivery ? `, Nhận hàng tại shop` : "Nhận hàng tại shop";
                            })

                            information = result.information;

                            const resAttr = await api.adminCategory.getDetail(product.category.id);
                            if (resAttr.status === 200) {
                                if (resAttr.data.code === 200) {
                                    let listKey = Object.keys(resAttr.data.result.information);
                                    ListProperties.forEach(x => {
                                        if (listKey.includes(x.key)) {
                                            listAttribute.push(x);
                                        }
                                    })
                                }
                            }
                        }
                    }
                }

                const resBrand = await api.adminBrand.getList(token);

                if (resBrand.status === 200) {
                    if (resBrand.data.code === 200) {
                        const result = resBrand.data.result;
                        result.forEach(x => {
                            let item = {
                                id: "",
                                name: ""
                            }
                            item.id = x._id || "";
                            item.name = x.name || "";
                            brands.push(item);
                        })
                    }
                }

                return {
                    props: {
                        categories: categories,
                        product: product,
                        info: information,
                        attributes: listAttribute,
                        brands: brands,
                        brand: brand,
                    }
                }
            } catch (err) {
                console.log(err.message);
            }
        }
        else {
            return {
                redirect: {
                    destination: '/signin',
                    permanent: false,
                },
            }
        }
    } else {
        return {
            redirect: {
                destination: '/signin',
                permanent: false,
            },
        }
    }
}

export default AuctionDetail;