const baseUrl = "http://3.142.207.62:5000";

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
    },
    adminProduct: {
        getList: () => `${baseUrl}/api/product/get`,
        deleteProduct: () => `${baseUrl}/api/product/delete/`,
        getDetail: () => `${baseUrl}/api/product/detail/`,
        postApprove: () => `${baseUrl}/api/product/approve`,
        putReject: () => `${baseUrl}/api/product/reject`,
        getDetail: () => `${baseUrl}/api/product/detail/`
    },
    adminAuction: {
        getList: () => `${baseUrl}/api/bid/get`,
        deleteAuction: () => `${baseUrl}/api/bid/delete/`,
        getDetail: () => `${baseUrl}/api/bid/detail/`,
        postApprove: () => `${baseUrl}/api/bid/approve`,
        putReject: () => `${baseUrl}/api/bid/reject`,
        getDetail: () => `${baseUrl}/api/bid/detail/`
    },
    admin: {
        postCreate: () => `${baseUrl}/api/admin/create`,
        postVerify: () => `${baseUrl}/api/admin/verify`,
        getProfile: () => `${baseUrl}/api/admin/profile`,
        getList: () => `${baseUrl}/api/admin/getListAdmin`, 
        deleteAdmin: () => `${baseUrl}/api/admin/remove?id=`,
        updateInformation: () => `${baseUrl}/api/admin/updateInformation`,
        changePassword: () => `${baseUrl}/api/admin/changePassword`,
    },
    adminBrand: {
        getList: () => `${baseUrl}/api/brand/get`,
        createBrand: () => `${baseUrl}/api/brand/create`,
        deleteBrand: () => `${baseUrl}/api/brand/delete/:id`,
        getDetailBrand: () => `${baseUrl}/api/brand/detail?id=`,
        updateBrand: () => `${baseUrl}/api/brand/update`,
        changePassword: () => `${baseUrl}/api/admin/changePassword`
    },
    adminPost: {
        getList: () => `${baseUrl}/api/post/listPost`,
        createPost: () => `${baseUrl}/api/post/createPost`,
        deletePost: () => `${baseUrl}/api/post/deletePost`,
    }
}

export default url;