import axios from 'axios';
import Cookie from 'js-cookie';
import url from './url-api.utils';

let token = Cookie.get('admin_token');

let config = {
    headers: { 
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    },
};

const isEnable = (tokenAdmin = '') => {
    token = tokenAdmin || Cookie.get('admin_token');
    if (!token) {
        return false;
    } else {
        config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        }
        return true;
    }
}

const api = {
    auth: {
        signin: (bodySignin) => {
            return axios.post(url.auth.postSignin(), bodySignin);
        },
        validate: (bodyValidate) => {
            return axios.post(url.auth.postValidate(), bodyValidate);
        },
        create: (bodyCreateNew) => {
            return axios.post(url.auth.postCreate(), bodyCreateNew,config);
        },
        verify: (bodyVerify) => {
            return axios.post(url.auth.postVerify(), bodyVerify);
        }
    },
    adminCategory: {
        getList: (tokenAdmin) => {
            if (isEnable(tokenAdmin)) {
                return axios.get(url.adminCategory.getList(), config);
            }
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
            if (isEnable()) {
                return axios.delete(url.adminProduct.deleteProduct().concat(id), config);
            }
        },
        getDetail: (id, tokenAdmin) => {
            if (isEnable(tokenAdmin)) {
                return axios.get(url.adminProduct.getDetail().concat(id), config);
            }
        },
        postApprove: (body) => {
            if (isEnable()) {
                return axios.post(url.adminProduct.postApprove(), body, config);
            }
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
            return axios.get(url.admin.getProfile(),config);
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