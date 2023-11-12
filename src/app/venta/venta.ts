 export class Venta {

    _id?: number;
    saleDatetime: string;
    quantity: number;
    saleAmount: number;
    supplier: string;
    client: string;

    constructor(saleDatetime: string, quantity: number, 
        saleAmount: number, supplier: string, client: string){
        
        this.saleDatetime = saleDatetime;
        this.quantity = quantity;
        this.saleAmount = saleAmount;
        this.supplier = supplier;
        this.client = client;
    }

 }


    