import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Calendar } from 'primereact/calendar';
import { useEffect, useState } from 'react';
import { ProductDetailModel } from './../../../../models/product.model';
import api from './../../../../utils/backend-api.utils';
import * as common from './../../../../utils/common';
import Moment from 'moment';
import { Button } from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';
Moment.locale('en');

const ProductDetail = ({id}) => {
    const router = useRouter();
    const [product, setProduct] = useState(new ProductDetailModel());

    useEffect(async () => {
        try {
            const res = await api.adminProduct.getDetail(id);
            
        } catch(error) {
            common.Toast(error, 'error');
        }
    }, [])

    return (
        <h1>hello</h1>
        
    )
}

export async function getServerSideProps(ctx) {
    const id = ctx.query.id;

    return {
        props: { id: id }
    }
}

export default ProductDetail;