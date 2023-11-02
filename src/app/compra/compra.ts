export class Compra{
    _id?:number;
    fecha: string;
    proveedor: string;
    monto_total: number;
    administrativo: string;
    pdfId: number;
    pdfArchivo: string;

    constructor(fecha: string, proveedor: string, monto_total: number, administrativo: string, pdfId: number, pdfArchivo: string){
        this.fecha = fecha;
        this.proveedor = proveedor;
        this.monto_total = monto_total;
        this.administrativo = administrativo;
        this.pdfId = pdfId;    
        this.pdfArchivo = pdfArchivo;  
    }
}