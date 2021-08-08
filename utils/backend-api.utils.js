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
            let newConfig = {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
            };
            return axios.post(url.adminCategory.postCreateNew(), bodyCreateNew, newConfig);
        },
        update: (bodyUpdate) => {
            let newConfig = {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
            };
            return axios.post(url.adminCategory.postUpdate(), bodyUpdate, newConfig);
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
        },
        lockSeller: (id) => {
            return axios.put(url.adminSeller.lockSeller(), {id:id}, config);
        },
        unlockSeller: (id) => {
            return axios.put(url.adminSeller.unlockSeller(), {id:id}, config);
        }
    },
    adminProduct: {
        getList: (params) => {
            let param = {};
            let queryDate = "";
            param.limit = params.rows;
            param.page = params.page + 1;

            if (params.filters) {
                const filters = params.filters;

                if (filters.name) param.search = filters.name.value.trim();
                if (filters.status) param.status = filters.status.value;

                if (filters.dateFilter) {
                    if (filters.dateFilter.value[0] && filters.dateFilter.value[1]) {
                        let start = new Date(filters.dateFilter.value[0]);
                        let end = new Date(filters.dateFilter.value[1]);
                        start.setHours(0, 0, 0, 0);
                        start.setDate(start.getDate() + 1);
                        end.setHours(0, 0, 0, 0);
                        end.setDate(end.getDate() + 2);
                        queryDate = `&dateFilter=${start.toISOString()}&dateFilter=${end.toISOString()}`;
                    }
                }
            }
            const query = new URLSearchParams(param);
            
            return axios.get(url.adminProduct.getList() + `?${query}${queryDate}`, config);
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
        },
        putReject: (body) => {
            if (isEnable()) {
                return axios.put(url.adminProduct.putReject(), body, config);
            }
        }
    },
    adminAuction: {
        getList: (params) => {
            let param = {};
            let queryDate = "";
            param.limit = params.rows;
            param.page = params.page + 1;

            if (params.filters) {
                const filters = params.filters;

                if (filters.name) param.search = filters.name.value.trim();
                if (filters.status) param.status = filters.status.value;

                if (filters.dateFilter) {
                    if (filters.dateFilter.value[0] && filters.dateFilter.value[1]) {
                        let start = new Date(filters.dateFilter.value[0]);
                        let end = new Date(filters.dateFilter.value[1]);
                        start.setDate(start.getDate() + 1);
                        start.setHours(0, 0, 0, 0);
                        end.setDate(end.getDate() + 2);
                        end.setHours(0, 0, 0, 0);
                        queryDate = `&dateFilter=${start.toISOString()}&dateFilter=${end.toISOString()}`;
                    }
                }
            }
            const query = new URLSearchParams(param);

            return axios.get(url.adminAuction.getList() + `?${query}${queryDate}`, config);
        },
        delete: (id) => {
            if (isEnable()) {
                return axios.delete(url.adminAuction.deleteAuction().concat(id), config);
            }
        },
        getDetail: (id, tokenAdmin) => {
            if (isEnable(tokenAdmin)) {
                return axios.get(url.adminAuction.getDetail().concat(id), config);
            }
        },
        postApprove: (body) => {
            if (isEnable()) {
                return axios.post(url.adminAuction.postApprove(), body, config);
            }
        },
        putReject: (body) => {
            if (isEnable()) {
                return axios.put(url.adminAuction.putReject(), body, config);
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
            if (isEnable()) {
                return axios.get(url.admin.getProfile(), config);
            }
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
        },
    },
    adminBrand: {
        getList: (tokenAdmin = "") => {
            if (isEnable(tokenAdmin)) {
                return axios.get(url.adminBrand.getList(), config);
            }
        },
        createBrand: (body) => {
            return axios.post(url.adminBrand.createBrand(), body, config);
        },
        deleteBrand: (id) => {
            const urlDelete = url.adminBrand.deleteBrand().replace(':id', id);
            return axios.delete(urlDelete, config);
        },
        detailBrand: (id) => {
            return axios.get(url.adminBrand.getDetailBrand().concat(id), config);
        },
        updateBrand: (body) => {
            return axios.put(url.adminBrand.updateBrand(), body, config);
        }
    },
    adminPost: {
        getList: () => {
            return axios.get(url.adminPost.getList(), config); 
        },
        createPost: (body) =>{
            let newConfig = {
                headers: { 
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                    'Access-Control-Allow-Origin': '*'
                },
            };
            return axios.post(url.adminPost.createPost(), body, newConfig);
        },
        deletePost: (id) => {
            // return axios.delete(url.adminPost.deletePost(), {
            //     headers: {
            //         Authorization: `Bearer ${token}`,
            //         'Content-Type': 'application/json',
            //         'Access-Control-Allow-Origin': '*'
            //     },
            //     data: {
            //         id: id
            //     }
            // });
            if (isEnable())
                return axios.delete(url.adminPost.deletePost(), {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    data: {
                        id: id
                    }
                });
        },
        detailPost: (id) => {
            return axios.get(url.adminPost.detailPost().replace(":id",id), config);
        },
        updatePost: (body) => {
            return axios.put(url.adminPost.updatePost(), body, config);
        }
    },
    adminNotification: {
        createNotification: (body) => {
            return axios.post(url.adminNotification.createNotification(), body, config);
        },
        getListNotification: () => {
            return axios.get(url.adminNotification.getListNotification(), config);
        }
    },
    adminReport: {
        getList: () => {
            return axios.get(url.adminReport.getListReport(), config);
        },
        detailReport: (id) => {
            return axios.get(url.adminReport.detailReport().replace(":id",id), config);
        }
    }
};

export default api;