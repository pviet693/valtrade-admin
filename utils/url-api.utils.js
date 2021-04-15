const baseUrl = "http://3.142.74.42:5000";

const url = {
    auth: {
        postSignin: () => `${baseUrl}/api/admin/login`,
        postValidate: () => `${baseUrl}/api/admin/validate`,
        postCreate: () => `${baseUrl}/api/admin/create`,
        postVerify: () => `${baseUrl}/api/admin/verify`
    },
    adminCategory: {
        getList: () => `${baseUrl}/api/category/list`,
        postCreateNew: () => `${baseUrl}/api/category/create`,
        postRemove: () => `${baseUrl}/api/category/remove`,
        postUpdate: () => `${baseUrl}/api/category/update`,
        getDetail: () => `${baseUrl}/api/category/detail/:id`,
        getListFarther: () => `${baseUrl}/api/category/grandfather`,
    }, 
    adminUser: {
        getList: () => `${baseUrl}/api/admin/listBuyer`,
        postCreateNew: () => `${baseUrl}/api/buyer/create`,
        postUpdate: () => `${baseUrl}/api/buyer/update`,
        getDetail: () => `${baseUrl}/api/admin/inforBuyer?buyerId=`,
    },
    adminSeller: {
        getList: () => `${baseUrl}/api/seller/listSeller`,
        postCreateNew: () => `${baseUrl}/api/seller/register`,
        postUpdate: () => `${baseUrl}/api/seller/update`,
        getDetail: () => `${baseUrl}/api/seller/get/`,
        postAccept: () => `${baseUrl}/api/seller/accept`,
        deleteSeller: () => `${baseUrl}/api/seller/delete/`,
    }
}

export default url;