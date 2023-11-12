 export class Venta {

    _id?: number;
    saleDateTime: string;
    quantity: number;
    saleAmount: number;
    supplier: string;
    product: string;
    client: string;

    constructor(saleDateTime: string, quantity: number, 
        saleAmount: number, supplier: string, client: string, product:string){
        
        this.saleDateTime = saleDateTime;
        this.quantity = quantity;
        this.saleAmount = saleAmount;
        this.supplier = supplier;
        this.client = client;
        this.product = product;
    }

 }


    