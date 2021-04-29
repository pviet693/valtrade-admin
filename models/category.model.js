export class CategoryModel {
    constructor() {
        this.name = "";
        this.update_date = "";
        this.id = "";
    }
}

export class CategoryDetailModel {
    constructor() {
        this.name = "";
        this.id = "";
        this.description = "";
        // this.histories = [];
        this.information = {};
        this.image = "";
    }
}

export class CategoryParentModel {
    constructor() {
        this.name = "";
        this.id = "";
    }
}

export const ListProperties = [
    { name: "Model", key: "model" },
    { name: "Bộ nhớ", key: "storage" },
    { name: "Mạng", key: "network" },
    { name: "Khe cắm sim", key: "simSlot" },
    { name: "Thấm nước", key: "waterproof" },
    { name: "Kích thước màn hình", key: "sizeScreen" },
    { name: "Hệ điều hành", key: "operation" },
    { name: "Ram", key: "ram" },
    { name: "Camera trước", key: "frontCamera" },
    { name: "Camera sau", key: "rearCamera" },
    { name: "GPS", key: "gps" },
    { name: "Bluetooth", key: "bluetooth" },
    { name: "Pin", key: "pin" },
    { name: "NFC", key: "nfc" },
    { name: "Micro Usb", key: "microUsb" },
    { name: "Màu sắc", key: "colorList" },
    { name: "Chất liệu", key: "material" },
    { name: "Chức năng sản phẩm", key: "functionProduct" },
    { name: "Cổng kết nối", key: "listPort" },
    { name: "Xuất xứ", key: "origin" },
    { name: "Tay áo", key: "sleeve"},
    { name: "Kiểu dáng áo sơ mi", key: "shirtDesigns" },
    { name: "Cổ áo", key: "collar" },
    { name: "Túi áo", key: "pocket" },
    { name: "Ống quần", key: "legs" },
    { name: "Chiều dài ống", key: "pantsLength" },
    { name: "Loại quần", key: "pantsType" },
    { name: "Độ tuổi phù hợp", key: "pantsType" },
    { name: "Hạn sử dụng", key: "expireDay" },
    { name: "Kiểu dáng", key: "style" },
    { name: "Họa tiết", key: "vignette" },
    { name: "Giới tính", key: "sex" },
    { name: "Kiểu mặt đồng hồ", key: "dialType" },
    { name: "Kiểu khóa", key: "lockType" },
    { name: "Chất liệu viền ngoài", key: "outlineMaterial" },
    { name: "Công suất", key: "wattage" },
    { name: "Chứng chỉ pvc", key: "certificatePvc" },
    { name: "Chứng chỉ PB", key: "certificatePb" },
    { name: "Chứng chỉ Bpa", key: "certificateBpa" },
]

export class PropertyDefault {
    constructor() {
        this.name = "";
        this.description = "";
        this.categoryId = "";
        this.price = 0;
        this.oldPrice = 0;
        this.sku = "";
        this.countProduct = 0;
        this.note = "";
        this.restWarrantyTime = 0;
    }
}