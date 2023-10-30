import { Component, OnInit } from '@angular/core';
import { ReportesService } from './reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  agendas: any[] = [];
  data: any;
  chartOptions: any = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.reportesService.getReportes().subscribe(data => {
      console.log(data); // Verifica los datos en la consola
      this.agendas = data;

      // Configurar los datos para el gráfico de barras
      this.data = {
        labels: this.agendas.map(agenda => agenda.nombre),
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
}
