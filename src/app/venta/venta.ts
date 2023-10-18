 export class Venta {

    _id?: number;
    fecha: string;
    producto: string;
    marca: string;
    codigo: number;
    cantidad: number;
    precio: number;
    monto_total: number;
    vendedor: string;
    cliente: string;

    constructor(fecha: string, producto: string,marca: string, codigo: number, cantidad: number, 
        precio: number, monto_total: number, vendedor: string, cliente: string){
        
        this.fecha = fecha;
        this.producto = producto;
        this.marca = marca;
        this.codigo = codigo;
        this.cantidad = cantidad;
        this.precio = precio;
        this.monto_total = monto_total;
        this.vendedor = vendedor;
        this.cliente = cliente;
    }

 }


    