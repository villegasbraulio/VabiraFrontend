export class Producto{
    _id?:number;
    nombre: string;
    marca: string;
    descripcion: string;
    codigo: number;
    precio: number;
    cantidad: number;
    stock_minimo: number;
    fecha_caducidad: string;

    constructor(nombre: string, marca: string, descripcion: string, codigo: number, precio: number, cantidad: number, stock_minimo: number, fecha_caducidad: string){
        this.nombre = nombre;
        this.marca = marca;
        this.descripcion = descripcion;
        this.codigo = codigo;
        this.precio = precio;
        this.cantidad = cantidad;
        this.stock_minimo = stock_minimo;
        this.fecha_caducidad = fecha_caducidad;
        
    }
}