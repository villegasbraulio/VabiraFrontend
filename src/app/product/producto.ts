export class Producto{
    _id?:number;
    name: string;
    brand: string;
    description: string;
    code: string;
    prize: number;
    quantity: number;
    caducityDatetime: string;
    supplierId: number;

    constructor(name: string, brand: string, description: string, code: string, prize: number, quantity: number, caducityDatetime: string, supplierId: number){
        this.name = name;
        this.brand = brand;
        this.description = description;
        this.code = code;
        this.prize = prize;
        this.quantity = quantity;
        this.caducityDatetime = caducityDatetime;
        this.supplierId = supplierId
        
    }
}