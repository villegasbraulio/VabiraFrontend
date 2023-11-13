import { Component, OnInit } from '@angular/core';
import { ReportesService } from './reportes.service';
import { UserService } from '../users/users.service';
import * as XLSX from 'xlsx';

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
  supplierChartOptions: any;
  selectedSchedule: any;
  schedules: any[] = [];

  constructor(private reportesService: ReportesService, private userService: UserService) { }

  ngOnInit(): void {
    // Obtener el nombre del usuario actual
    this.userService.obtenerPerfil().subscribe(profile => {
      this.username = profile.username;
      this.userid = profile.id
      this.userRoles = profile.roles
      console.log(this.username)
      console.log(this.userid)
      console.log(this.userRoles)
      // Cargar los datos después de obtener el nombre del usuario
      this.loadData();
      this.reportesService.getUsersCountByRole().subscribe(data => {
        this.rolesData = data;
        this.configureChartOptions();
        console.log(this.rolesData)
        this.reportesService.getSupplierSchedules(this.username).subscribe(schedules => {
          this.schedules = schedules;
          // Seleccionar la primera agenda por defecto
          if (this.schedules.length > 0) {
            this.selectedSchedule = this.schedules[0];
            this.loadSupplierData();
          }
        });
      });
    });
  }
  

  loadData(): void {
    this.reportesService.getReportes(this.username).subscribe(data => {
      console.log(data); // Verifica los datos en la consola
     
      
      this.agendas = data;

      // Configurar los datos para el gráfico de barras
      this.data = {
        labels: this.agendas.map(agenda => agenda.nombre ),
        datasets: [
          {
            label: 'Cantidad de Turnos',
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
      aspectRatio: 0.5, // Ajusta el aspect ratio según tus necesidades (ancho / alto)
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

  descargarExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.agendas);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Agendas');
    XLSX.writeFile(wb, 'agendas.xlsx');
  }

  descargarExceladmin(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.rolesData);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios');
    XLSX.writeFile(wb, 'usuarios.xlsx');
  }
  
    loadSupplierData(): void {
      if (this.selectedSchedule) {
        this.reportesService.getSupplierTurns(this.selectedSchedule.id).subscribe(data => {
          this.supplierChartData = {
            labels: ['Reservados', 'Disponibles', 'Presentes', 'Ausentes'],
            datasets: [
              {
                data: [data.reservedTurns, data.availableTurns, data.aproveTurns, data.desaproveTurns],
                backgroundColor: ['#FF00FF', '#00FFFF', '#FFA500', '#008000']
              }
            ]
          };
        });
      }
    }
  
    descargarExcelPorAgenda(): void {
      if (this.selectedSchedule) {
        this.reportesService.getExcelDataBySchedule(this.selectedSchedule.id).subscribe(excelData => {
          const formattedData = excelData.reservedTurns2.map((turn: any) => ({ // <-- Especifica el tipo 'any' aquí
            'ID Turno': turn.id,
            'Fecha inicio turno': turn.dateFrom,
            'Fecha fin turno': turn.dateTo,
            'Cliente': turn.client ? `${turn.client.user.firstName} ${turn.client.user.lastName}` : 'N/A',
            'Dia': turn.classDayType.name,
            'Estado del turno': turn.turnStatus[0].turnStatusType.name
          }));
  
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(formattedData, {
            header: ['ID Turno', 'Fecha inicio turno', 'Fecha fin turno', 'Cliente', 'Dia', 'Estado del turno'],
            skipHeader: true
          });
  
          // Agregar un logo
          ws['A1'] = { t: 's', v: 'ID Turno', s: { fill: { fgColor: { rgb: 'FFFF00' } } } };
          ws['B1'] = { t: 's', v: 'Fecha inicio turno', s: { fill: { fgColor: { rgb: 'FFFF00' } } } };
          ws['C1'] = { t: 's', v: 'Fecha fin turno', s: { fill: { fgColor: { rgb: 'FFFF00' } } } };
          ws['D1'] = { t: 's', v: 'Cliente', s: { fill: { fgColor: { rgb: 'FFFF00' } } } };
          ws['E1'] = { t: 's', v: 'Dia', s: { fill: { fgColor: { rgb: 'FFFF00' } } } };
          ws['G1'] = { t: 's', v: 'Estado del turno', s: { fill: { fgColor: { rgb: 'FFFF00' } } } };
          // ... (continuar para otras columnas)
  
          const wb: XLSX.WorkBook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(wb, ws, 'Datos');
          XLSX.writeFile(wb, `Datos de la Agenda_${this.selectedSchedule.id}.xlsx -- VABIRA`);
        });
      }
    }
  }
