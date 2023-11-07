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
}
