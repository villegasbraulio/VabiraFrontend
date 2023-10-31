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
  username: string = '';  // Propiedad para almacenar el nombre del usuario actual
  chartOptions: any = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(private reportesService: ReportesService, private userService: UserService) { }

  ngOnInit(): void {
    // Obtener el nombre del usuario actual
    this.userService.obtenerPerfil().subscribe(profile => {
      this.username = profile.username;
      // Cargar los datos después de obtener el nombre del usuario
      this.loadData();
    });
  }

  loadData(): void {
    this.reportesService.getReportes(this.username).subscribe(data => {
      console.log(data); // Verifica los datos en la consola
      console.log(this.username)
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
  descargarExcel(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.agendas);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Agendas');
    XLSX.writeFile(wb, 'agendas.xlsx');
  }
}
