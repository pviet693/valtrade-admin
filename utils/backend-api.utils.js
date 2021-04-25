import axios from 'axios';
import Cookie from 'js-cookie';
import url from './url-api.utils';

const token = Cookie.get('admin_token');

const config = {
    headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
};

const api = {
    auth: {
        signin: (bodySignin) => {
            return axios.post(url.auth.postSignin(), bodySignin);
        },
        validate: (bodyValidate) => {
            return axios.post(url.auth.postValidate(), bodyValidate);
        },
        create: (bodyCreateNew) => {
            return axios.post(url.auth.postCreate(), bodyCreateNew);
        },
        verify: (bodyVerify) => {
            return axios.post(url.auth.postVerify(), bodyVerify);
        }
    },
    adminCategory: {
        getList: () => {
            return axios.get(url.adminCategory.getList(), config);
        },
        createNew: (bodyCreateNew) => {
            return axios.post(url.adminCategory.postCreateNew(), bodyCreateNew, config);
        },
        update: (bodyUpdate) => {
            return axios.post(url.adminCategory.postUpdate(), bodyUpdate, config);
        },
        delete: (id) => {
            return axios.post(url.adminCategory.postRemove(), { id: id }, config);
        },
        getListParent: () => {
            return axios.get(url.adminCategory.getListFarther(), config);
        },
        getDetail: (id) => {
            const url_api = url.adminCategory.getDetail().replace(':id', id);
            return axios.get(url_api, config);
        }
    },
    adminUser: {
        getList: () => {
            return axios.get(url.adminUser.getList(), config);
        },
        createNew : (bodyCreateNew) => {
            return axios.post(url.adminUser.postCreateNew(),bodyCreateNew, config);
        }, 
        update: (bodyUpdate) => {
            return axios.post(url.adminUser.postUpdate(), bodyUpdate, config);
        },
        delete: (id) => {
            return axios.post(url.adminUser.postRemove(), { id: id }, config);
        },
        getDetail: (id) => {
            const url_api = url.adminUser.getDetail().concat(id);
            return axios.get(url_api, config);
        }
    },
    adminSeller: {
        getList: () => {
            return axios.get(url.adminSeller.getList(), config);
        },
        createNew : (bodyCreateNew) => {
            return axios.post(url.adminSeller.postCreateNew(),bodyCreateNew, config);
        },
        update: (bodyUpdate) => {
            return axios.post(url.adminSeller.postUpdate(), bodyUpdate, config);
        },
        getDetail: (id) => {
            const url_api = url.adminSeller.getDetail().concat(id);
            return axios.get(url_api, config);
        },
        postAccept: (id) => {
            return axios.post(url.adminSeller.postAccept(), {id: id}, config);
        },
        delete: (id) => {
            return axios.delete(url.adminSeller.deleteSeller().concat(id), config);
        }
    },
    adminProduct: {
        getList: () => {
            return axios.get(url.adminProduct.getList());
        }, 
        delete: (id) => {
            return axios.delete(url.adminProduct.deleteProduct().concat(id));
        },
        getDetail: (id) => {
            return axios.get(url.adminProduct.getDetail().concat(id));
        }
    },
    admin: {
        postCreate: (body) => {
            return axios.post(url.admin.postCreate(), body, config);
        },
        postVerify: (body) => {
            return axios.post(url.admin.postVerify(), body);
        },
        getProfile: () => {
            return axios.get(url.admin.getProfile(),config );
        },
        getList: () => {
            return axios.get(url.admin.getList(), config);
        },
        delete: (id) => {
            return axios.delete(url.admin.deleteAdmin().concat(id),config);
        },
        updateInformation: (body) => {
            return axios.put(url.admin.updateInformation(), body, config);
        },
        changePassword: (password) => {
            return axios.post(url.admin.changePassword(), {password:password}, config)
        }
    }
};

export default api;