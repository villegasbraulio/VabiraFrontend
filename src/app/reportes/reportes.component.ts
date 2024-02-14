import { Component, OnInit } from '@angular/core';
import { ReportesService } from './reportes.service';
import { UserService } from '../users/users.service';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  agendas: any[] = [];
  data: any;
  rolesData: any[] = [];
  username: string = '';  // Propiedad para almacenar el nombre del usuario actual
  userid: string = '';
  role: string = '';
  userRoles: string = ''
  chartData: any; // Declaración de la propiedad chartData
  chartOptions: any = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  chartOptions2: any;
  supplierChartData: any;
  presentsChartData: any;
  absentsChartData: any;
  supplierChartOptions: any;
  selectedSchedule: any;
  schedules: any[] = [];
  basicDatahard: any;
  basicOptionshard: any;
  salesByBrandData: any[] = [];
  totalSalesByBrand: any[] = [];
  totalSalesByBrandChartData: any;
  minDate: any; // Propiedad para almacenar la fecha mínima seleccionada
  maxDate: any; // Propiedad para almacenar la fecha máxima seleccionada
  
  constructor(private reportesService: ReportesService, private userService: UserService) { }

  ngOnInit(): void {
    // Obtener el nombre del usuario actual
    this.userService.obtenerPerfil().subscribe(profile => {
      this.username = profile.username;
      this.userid = profile.id
      this.userRoles = profile.roles
      // Cargar los datos después de obtener el nombre del usuario
      this.loadData();
      if (this.userRoles.includes('admin')) {
      this.reportesService.getUsersCountByRole().subscribe(data => {
        this.rolesData = data;
        this.configureChartOptions();
      })}
        console.log(this.rolesData)
        this.reportesService.getSupplierSchedules(this.userid).subscribe(schedules => {
          // Filtrar las agendas por supplier.id igual a this.userid
          this.schedules = schedules.filter(schedule => schedule.supplier.user.username === this.username);
          

          // Seleccionar la primera agenda por defecto si hay alguna después del filtrado
          if (this.schedules.length > 0) {
            this.selectedSchedule = this.schedules[0];
            this.loadSupplierData();
            this.loadpresents();
            this.loadabsents();

          }
        });
      // });
      this.reportesService.getVentas().subscribe((data) => {
        this.salesByBrandData = data;
        // Calcula el total de productos vendidos por marca y nombre
        this.calculateTotalProductsSoldByBrand();
        console.log(this.totalSalesByBrand)
      });
      
      
    });
    }
    
    filtrar(): void {
      // Formatear la fecha mínima al formato deseado
      // const fechaMinimaFormateada = this.formatoFecha(this.minDate);
      console.log('Fecha mínima:', this.minDate);
    
      // Formatear la fecha máxima al formato deseado
      // const fechaMaximaFormateada = this.formatoFecha(this.maxDate);
      console.log('Fecha máxima:', this.maxDate);
      this.ngOnInit();
    }
    
  loadData(): void {
    this.reportesService.getReportes(this.username, this.minDate, this.maxDate).subscribe(data => {
      console.log(data); // Verifica los datos en la consola
      this.agendas = data;
      // Configurar los datos para el gráfico de barras
      this.data = {
        labels: this.agendas.map(agenda => agenda.nombre ),
        datasets: [
          {
            label: 'Cantidad de Turnos reservados',
            data: this.agendas.map(agenda => agenda.cantidadTurnos), // Cantidad de turnos reservados por agenda
            backgroundColor: ['#FF00FF', '#00FFFF']
          }
        ]
      };
    });
  }
  
  configureChartOptions(): void {
    this.chartOptions2 = {
      responsive: true,
      legend: {
        position: 'bottom'
      },
      plugins: {
        datalabels: {
          formatter: (value: string, ctx: any) => {
            const label = ctx.chart.data.labels[ctx.dataIndex];
            return label + ': ' + value;
          },
          color: '#000000',
          anchor: 'end',
          align: 'end'
        }
      },
      maintainAspectRatio: false, // Desactiva el mantenimiento del aspect ratio
      aspectRatio: 0.6, // Ajusta el aspect ratio según tus necesidades (ancho / alto)
      width: 800, // Establece el ancho del gráfico
      height: 800 // Establece el alto del gráfico
    };
    // Preparar los datos para el gráfico de pie
    this.chartData = {
      labels: this.rolesData.map(item => item.role),
      datasets: [
        {
          data: this.rolesData.map(item => item.count),
          backgroundColor: ['#FF00FF', '#00FFFF', '#FFA500', '#008000'] // Colores para cada segmento del gráfico
        }
      ]
    };
  }

  loadSupplierData(): void {
    if (this.selectedSchedule) {
      this.reportesService.getSupplierTurns2(this.selectedSchedule.id).subscribe(data => {
       
        // Inicializamos contadores
        let reservedCount = 0;
        let availableCount = 0;
        let presentCount = 0;
        let absentCount = 0;
        
        // Recorremos los datos para contar los turnos
      data.forEach((turn: { turnStatus: any[]; dateFrom: string; }) => {
        // Si no se han ingresado fechas, contamos todos los turnos
        if (!this.minDate || !this.maxDate) {
          if (turn.turnStatus.some(status => status.turnStatusType.name === 'Reservado')) {
            reservedCount++;
          } else if (turn.turnStatus.some(status => status.turnStatusType.name === 'Disponible')) {
            availableCount++;
          } else if (turn.turnStatus.some(status => status.turnStatusType.name === 'Presente')) {
            presentCount++;
          } else if (turn.turnStatus.some(status => status.turnStatusType.name === 'Ausente')) {
            absentCount++;
          }
        } else {
          // Si se han ingresado fechas, verificamos si el turno está dentro del rango especificado
          const turnDate = new Date(turn.dateFrom);
          if (turnDate >= this.minDate && turnDate <= this.maxDate) {
            if (turn.turnStatus.some(status => status.turnStatusType.name === 'Reservado')) {
              reservedCount++;
            } else if (turn.turnStatus.some(status => status.turnStatusType.name === 'Disponible')) {
              availableCount++;
            } else if (turn.turnStatus.some(status => status.turnStatusType.name === 'Presente')) {
              presentCount++;
            } else if (turn.turnStatus.some(status => status.turnStatusType.name === 'Ausente')) {
              absentCount++;
            }
          }
        }
      });


  
        // Actualizamos el gráfico de datos
        this.supplierChartData = {
          labels: ['Reservados', 'Disponibles', 'Presentes', 'Ausentes'],
          datasets: [
            {
              label: 'Detalle de turnos por agenda',
              data: [reservedCount, availableCount, presentCount, absentCount],
              backgroundColor: ['#FF00FF', '#00FFFF', '#FFA500', '#008000']
            }
          ]
        };
      });
    }
  }
  
  generarYDescargarPDFestadisticasagenda(): void {
    console.log(this.selectedSchedule);
    if (!this.selectedSchedule) {
      return;
    }

    this.reportesService.getSupplierTurns2(this.selectedSchedule.id).subscribe(data => {
      const doc = new jsPDF();
      let y = 30; // Iniciar en la parte superior para los datos

      // Formatear las fechas
      const formattedMinDate = this.formatDate(this.minDate);
      const formattedMaxDate = this.formatDate(this.maxDate);

      // Agregar imagen de la empresa al principio del documento
      const logo = new Image();
      logo.src = 'assets/vabira.jpeg'; // Ruta de la imagen en la carpeta assets

      logo.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          canvas.width = logo.width;
          canvas.height = logo.height;
          ctx.drawImage(logo, 0, 0); // Coordenadas para la imagen
          const imageData = canvas.toDataURL('image/jpeg');

          doc.addImage(imageData, 'JPEG', 140, 10, 30, 30); // Coordenadas y dimensiones de la imagen

          // Ajustar tamaño de letra y espacio entre líneas para los datos
          doc.setFontSize(8);
          const interlineado = 4; // Espacio entre líneas

          // Agregar título con las fechas formateadas
          const titulo = `Detalles de turnos para la agenda ${this.selectedSchedule.name} entre las fechas ${formattedMinDate} y ${formattedMaxDate}`;
          doc.text(titulo, 10, 10); // Coordenadas para el título

          // Contadores para los estados de los turnos
          let reservados = 0;
          let disponibles = 0;
          let ausentes = 0;
          let presentes = 0;

          // Recorrer los turnos y contar los estados
          data.forEach((turn: any) => {
            const dateFrom = new Date(turn.dateFrom);

            if ((!this.minDate || dateFrom >= this.minDate) && (!this.maxDate || dateFrom <= this.maxDate)) {
              const status = turn.turnStatus.find((status: any) =>
                status.turnStatusType.name === 'Reservado' ||
                status.turnStatusType.name === 'Disponible' ||
                status.turnStatusType.name === 'Presente' ||
                status.turnStatusType.name === 'Ausente'
              );

              if (status) {
                const statusName = status.turnStatusType.name;
                const scheduleId = turn.schedule.id;
                const clientName = turn.client ? `${turn.client.user.firstName} ${turn.client.user.lastName}` : 'Sin cliente';
                const dayName = turn.classDayType.name;
                doc.text(`ID de Agenda: ${scheduleId}, Cliente: ${clientName}, Estado: ${statusName}, Fecha: ${dateFrom.toLocaleDateString('es-ES')}, Día: ${dayName}`, 10, y);
                y += interlineado;

                // Contar el estado del turno
                switch (status.turnStatusType.name) {
                  case 'Reservado':
                    reservados++;
                    break;
                  case 'Disponible':
                    disponibles++;
                    break;
                  case 'Ausente':
                    ausentes++;
                    break;
                  case 'Presente':
                    presentes++;
                    break;
                  default:
                    break;
                }
              }
            }
          });

          // Mostrar totales de estados debajo de los datos
          const totalText = `Total de Reservados: ${reservados}, Total de Disponibles: ${disponibles}, Total de Ausentes: ${ausentes}, Total de Presentes: ${presentes}`;
          doc.text(totalText, 10, y + 10); // Coordenadas para los totales

          // Guardar el PDF
          const fileName = `turnos_agenda_${this.selectedSchedule.name}.pdf`;
          doc.save(fileName);
        } else {
          console.error('No se pudo obtener el contexto de dibujo.');
        }
      };
    });
  }

  // Método para formatear la fecha como día/mes/año
  formatDate(date: any): string {
    return date.toLocaleDateString('es-ES');
  }
  

    calculateTotalProductsSoldByBrand(): void {
      // Inicializa un objeto para almacenar la cantidad total de productos vendidos por cada marca y nombre
      const totalSalesMap: Map<string, number> = new Map();
    
      // Recorre los datos de ventas por marca
      this.salesByBrandData.forEach((sale) => {
        sale.product.forEach((product: { brand: any; name: any; prize: any }) => {
          // Verifica si se han ingresado fechas de filtro
          if (!this.minDate || !this.maxDate) {
            // Si no se han ingresado fechas, considera todos los productos
            const productKey = `${product.brand}-${product.name}`;
            const total = parseFloat(product.prize) * 1;
    
            if (totalSalesMap.has(productKey)) {
              totalSalesMap.set(productKey, totalSalesMap.get(productKey)! + total);
            } else {
              totalSalesMap.set(productKey, total);
            }
          } else {
            // Si se han ingresado fechas, filtra los productos por fecha de venta
            const saleDate = new Date(sale.saleDateTime);
            if (saleDate >= this.minDate && saleDate <= this.maxDate) {
              const productKey = `${product.brand}-${product.name}`;
              const total = parseFloat(product.prize) * 1;
    
              if (totalSalesMap.has(productKey)) {
                totalSalesMap.set(productKey, totalSalesMap.get(productKey)! + total);
              } else {
                totalSalesMap.set(productKey, total);
              }
            }
          }
        });
      });
    
      // Convierte el mapa a un array de objetos para mostrar en la interfaz de usuario
      this.totalSalesByBrand = Array.from(totalSalesMap).map(([productKey, total]) => ({
        productKey,
        total,
      }));
    
      this.totalSalesByBrandChartData = {
        labels: this.totalSalesByBrand.map(item => item.productKey),
        datasets: [
          {
            label: 'Total Ventas por Producto',
            data: this.totalSalesByBrand.map(item => item.total),
            backgroundColor: ['#FF00FF', '#00FFFF', '#FFA500', '#008000']
          }
        ]
      };
    }
    generateAndDownloadPDFsales(): void {
      const doc = new jsPDF();
      let y = 30; // Comenzar en la parte superior para los datos
    
      // Formatear las fechas
      const formattedMinDate = this.formatDate(this.minDate);
      const formattedMaxDate = this.formatDate(this.maxDate);
    
       // Agregar imagen de la empresa al principio del documento
       const logo = new Image();
       logo.src = 'assets/vabira.jpeg'; // Ruta de la imagen en la carpeta assets
 
       logo.onload = () => {
         const canvas = document.createElement('canvas');
         const ctx = canvas.getContext('2d');
 
         if (ctx) {
           canvas.width = logo.width;
           canvas.height = logo.height;
           ctx.drawImage(logo, 0, 0); // Coordenadas para la imagen
           const imageData = canvas.toDataURL('image/jpeg');
 
           doc.addImage(imageData, 'JPEG', 140, 10, 30, 30); // Coordenadas y dimensiones de la imagen
          
      // Título del documento
      doc.setFontSize(16);
      doc.text('Informe de Ventas totales por Marca-Producto', 10, 10);
    
      // Rango de fechas
      doc.setFontSize(12);
      doc.text(`Fechas: ${formattedMinDate} - ${formattedMaxDate}`, 10, 20);
    
      // Contenido de ventas por marca
      doc.setFontSize(10);
      this.totalSalesByBrand.forEach((item, index) => {
        doc.text(`${index + 1}. ${item.productKey}: $${item.total.toFixed(2)}`, 10, y);
        y += 10;
      });
    
      // Guardar el PDF
      const fileName = `ventas_por_marca_${formattedMinDate}_${formattedMaxDate}.pdf`;
      doc.save(fileName);
    }
  }
}
    
  descargarExcelVentasPorProducto(): void {
    const formattedData = this.totalSalesByBrand.map(item => ({
      'Producto': item.productKey,
      'Total Ventas': item.total.toFixed(2)  // Ajusta la cantidad de decimales según tus necesidades
    }));
  
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData, {
      header: ['Producto', 'Precio de la venta'],
      // skipHeader: true
    });
  
    // Agregar un estilo al encabezado
    ws['A1'].s = { t: 's', v: 'Producto-Marca', s: {fill: { fgColor: { rgb: 'FFFF00' } } }};
    ws['B1'].s = { t: 's', v: 'Precio', s: {fill: { fgColor: { rgb: 'FFFF00' } } }};
  
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Ventas por Producto'+this.username);
    XLSX.writeFile(wb, 'VABIRA -- ventas_por_producto.xlsx');
  }

  loadpresents(): void {
    if (this.selectedSchedule) {
      this.reportesService.getSupplierTurns2(this.selectedSchedule.id).subscribe(data => {
        // Inicializamos contadores por día de la semana
        let lunescount = 0;
        let martescount = 0;
        let miercolescount = 0;
        let juevescount = 0;
        let viernescount = 0;
  
        // Recorremos los datos para contar los turnos presentes por día de la semana
        data.forEach((turn: { turnStatus: any[]; classDayType: any; dateFrom: string; }) => {
          // Verificamos si el turno está presente y dentro del rango de fechas
          const turnDate = new Date(turn.dateFrom);
          if ((turnDate >= this.minDate && turnDate <= this.maxDate) || (!this.minDate || !this.maxDate)) {
            if (turn.turnStatus.some(status => status.turnStatusType.name === 'Presente')) {
              if (turn.classDayType.name === 'Lunes') {
                lunescount++;
            } else if (turn.classDayType.name === 'Martes') {
                martescount++;
            } else if (turn.classDayType.name === 'Miercoles') {
                miercolescount++;
            } else if (turn.classDayType.name === 'Jueves') {
                juevescount++;
            } else if (turn.classDayType.name === 'Viernes') {
                viernescount++;
            }
            
            }
          }
          console.log('lunes ' +lunescount)

        });

        console.log('lunes ' +lunescount)
  
        // Actualizamos el gráfico de datos
        this.presentsChartData = {
          labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
          datasets: [
            {
              label: 'Turnos presentes segun día',
              data: [lunescount, martescount, miercolescount, juevescount, viernescount],
              backgroundColor: ['#FF00FF', '#00FFFF', '#FFA500', '#008000', '#FF0000']
            }
          ]
        };
      });
    }
  }

  loadabsents(): void {
    if (this.selectedSchedule) {
      this.reportesService.getSupplierTurns2(this.selectedSchedule.id).subscribe(data => {
        // Inicializamos contadores por día de la semana
        let lunescount = 0;
        let martescount = 0;
        let miercolescount = 0;
        let juevescount = 0;
        let viernescount = 0;
  
        // Recorremos los datos para contar los turnos presentes por día de la semana
        data.forEach((turn: { turnStatus: any[]; classDayType: any; dateFrom: string; }) => {
          // Verificamos si el turno está presente y dentro del rango de fechas
          const turnDate = new Date(turn.dateFrom);
          if ((turnDate >= this.minDate && turnDate <= this.maxDate) || (!this.minDate || !this.maxDate)) {
            if (turn.turnStatus.some(status => status.turnStatusType.name === 'Ausente')) {
              if (turn.classDayType.name === 'Lunes') {
                lunescount++;
            } else if (turn.classDayType.name === 'Martes') {
                martescount++;
            } else if (turn.classDayType.name === 'Miercoles') {
                miercolescount++;
            } else if (turn.classDayType.name === 'Jueves') {
                juevescount++;
            } else if (turn.classDayType.name === 'Viernes') {
                viernescount++;
            }
            
            }
          }

        });

  
        // Actualizamos el gráfico de datos
        this.absentsChartData = {
          labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'],
          datasets: [
            {
              label: 'Turnos ausentes segun día',
              data: [lunescount, martescount, miercolescount, juevescount, viernescount],
              backgroundColor: ['#FF00FF', '#00FFFF', '#FFA500', '#008000', '#FF0000']
            }
          ]
        };
      });
    }
  }

  generarYDescargarPDFpresentes(): void {
    console.log(this.selectedSchedule);
    if (!this.selectedSchedule) {
      return;
    }

    this.reportesService.getSupplierTurns2(this.selectedSchedule.id).subscribe(data => {
      const doc = new jsPDF();
      let y = 30; // Iniciar en la parte superior para los datos

      // Formatear las fechas
      const formattedMinDate = this.formatDate(this.minDate);
      const formattedMaxDate = this.formatDate(this.maxDate);

      // Agregar imagen de la empresa al principio del documento
      const logo = new Image();
      logo.src = 'assets/vabira.jpeg'; // Ruta de la imagen en la carpeta assets

      logo.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          canvas.width = logo.width;
          canvas.height = logo.height;
          ctx.drawImage(logo, 0, 0); // Coordenadas para la imagen
          const imageData = canvas.toDataURL('image/jpeg');

          doc.addImage(imageData, 'JPEG', 140, 10, 30, 30); // Coordenadas y dimensiones de la imagen

          // Ajustar tamaño de letra y espacio entre líneas para los datos
          doc.setFontSize(8);
          const interlineado = 4; // Espacio entre líneas

          // Agregar título con las fechas formateadas
          const titulo = `Detalles de turnos presentes para la agenda ${this.selectedSchedule.name} entre las fechas ${formattedMinDate} y ${formattedMaxDate}`;
          doc.text(titulo, 10, 10); // Coordenadas para el título

          // Contadores para los estados de los turnos
          let presentes = 0;

          // Recorrer los turnos y contar los estados
          data.forEach((turn: any) => {
            const dateFrom = new Date(turn.dateFrom);

            if ((!this.minDate || dateFrom >= this.minDate) && (!this.maxDate || dateFrom <= this.maxDate)) {
              const status = turn.turnStatus.find((status: any) =>
                status.turnStatusType.name === 'Presente'
              );

              if (status) {
                const statusName = status.turnStatusType.name;
                const scheduleId = turn.schedule.id;
                const clientName = turn.client ? `${turn.client.user.firstName} ${turn.client.user.lastName}` : 'Sin cliente';
                const dayName = turn.classDayType.name;
                doc.text(`ID de Agenda: ${scheduleId}, Cliente: ${clientName}, Estado: ${statusName}, Fecha: ${dateFrom.toLocaleDateString('es-ES')}, Día: ${dayName}`, 10, y);
                y += interlineado;

                // Contar el estado del turno
                switch (status.turnStatusType.name) {
                  case 'Presente':
                    presentes++;
                    break;
                  default:
                    break;
                }
              }
            }
          });

          // Mostrar totales de estados debajo de los datos
          const totalText = ` Total de Presentes: ${presentes}`;
          doc.text(totalText, 10, y + 10); // Coordenadas para los totales

          // Guardar el PDF
          const fileName = `presentes_agenda_${this.selectedSchedule.name}.pdf`;
          doc.save(fileName);
        } else {
          console.error('No se pudo obtener el contexto de dibujo.');
        }
      };
    });
  }
    
  generarYDescargarPDFausentes(): void {
    console.log(this.selectedSchedule);
    if (!this.selectedSchedule) {
      return;
    }

    this.reportesService.getSupplierTurns2(this.selectedSchedule.id).subscribe(data => {
      const doc = new jsPDF();
      let y = 30; // Iniciar en la parte superior para los datos

      // Formatear las fechas
      const formattedMinDate = this.formatDate(this.minDate);
      const formattedMaxDate = this.formatDate(this.maxDate);

      // Agregar imagen de la empresa al principio del documento
      const logo = new Image();
      logo.src = 'assets/vabira.jpeg'; // Ruta de la imagen en la carpeta assets

      logo.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (ctx) {
          canvas.width = logo.width;
          canvas.height = logo.height;
          ctx.drawImage(logo, 0, 0); // Coordenadas para la imagen
          const imageData = canvas.toDataURL('image/jpeg');

          doc.addImage(imageData, 'JPEG', 140, 10, 30, 30); // Coordenadas y dimensiones de la imagen

          // Ajustar tamaño de letra y espacio entre líneas para los datos
          doc.setFontSize(8);
          const interlineado = 4; // Espacio entre líneas

          // Agregar título con las fechas formateadas
          const titulo = `Detalles de turnos ausentes para la agenda ${this.selectedSchedule.name} entre las fechas ${formattedMinDate} y ${formattedMaxDate}`;
          doc.text(titulo, 10, 10); // Coordenadas para el título

          // Contadores para los estados de los turnos
          let ausentes = 0;

          // Recorrer los turnos y contar los estados
          data.forEach((turn: any) => {
            const dateFrom = new Date(turn.dateFrom);

            if ((!this.minDate || dateFrom >= this.minDate) && (!this.maxDate || dateFrom <= this.maxDate)) {
              const status = turn.turnStatus.find((status: any) =>
                status.turnStatusType.name === 'Ausente'
              );

              if (status) {
                const statusName = status.turnStatusType.name;
                const scheduleId = turn.schedule.id;
                const clientName = turn.client ? `${turn.client.user.firstName} ${turn.client.user.lastName}` : 'Sin cliente';
                const dayName = turn.classDayType.name;
                doc.text(`ID de Agenda: ${scheduleId}, Cliente: ${clientName}, Estado: ${statusName}, Fecha: ${dateFrom.toLocaleDateString('es-ES')}, Día: ${dayName}`, 10, y);
                y += interlineado;

                // Contar el estado del turno
                switch (status.turnStatusType.name) {
                  case 'Presente':
                    ausentes++;
                    break;
                  default:
                    break;
                }
              }
            }
          });

          // Mostrar totales de estados debajo de los datos
          const totalText = ` Total de ausentes: ${ausentes}`;
          doc.text(totalText, 10, y + 10); // Coordenadas para los totales

          // Guardar el PDF
          const fileName = `ausentes_agenda_${this.selectedSchedule.name}.pdf`;
          doc.save(fileName);
        } else {
          console.error('No se pudo obtener el contexto de dibujo.');
        }
      };
    });
  }
    
  }
