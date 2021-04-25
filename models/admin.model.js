export class AdminModel{
    constructor(){
        this.name = "";
        this.role = [];
        this.email = "";
        this.password = "";
        this.phone = "";
        // this.avatar = "";
    }
}

export class AdminDetailModel{
    constructor(){
        this.name = "";
        this.role = [];
        this.email = "";
        this.password = "";
        this.phone = "";
        // this.avatar = "";
    }
}

// export class newInformationModel{
//     constructor(AdminModel){
//         this.name = "";
//         this.email = "";
//         this.phone = "";
//     }
// }

export const ListRoles = [
   {name: 'Super admin', key: "SUPER_ADMIN" },
   {name: 'Product admin', key: "PRODUCT_ADMIN" },
   {name: 'User admin', key: "USER_ADMIN" }
];