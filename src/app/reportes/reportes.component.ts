import { Component, OnInit } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { ChartData } from 'chart.js';
import { ReportesService } from './reportes.service';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent implements OnInit {
  basicData: any;
  basicOptions: any;
  turnosLibres: number = 0;
  turnosOcupados: number = 0;
  public chartData: ChartData | undefined; // Make the chartData property public

  constructor(private reportesService: ReportesService) { }

  ngOnInit(): void {
    this.loadData();
  }

  // const chartData = {
  //   labels: ['Turnos libres', 'Turnos ocupados'],
  //   datasets: [{
  //     data: [this.turnosLibres, this.turnosOcupados],
  //     backgroundColor: ['#00FF00', '#FF0000'],
  //     hoverBackgroundColor: ['#00FF00', '#FF0000'],
  //   }]
  // };

  loadData(): void {
    this.reportesService.getReportes().subscribe(data => {
      this.turnosLibres = data.filter((turno: { turnStatus: any[] }) => {
        return turno.turnStatus.some((status: any) => status.turnStatusType.id === 10);
      }).length;

      this.turnosOcupados = data.filter((turno: { turnStatus: any[] }) => {
        return turno.turnStatus.some((status: any) => status.turnStatusType.id === 11);
      }).length;

      // Update the chartData property with the new data
      this.chartData = {
        labels: ['Turnos libres', 'Turnos ocupados'],
        datasets: [{
          data: [this.turnosLibres, this.turnosOcupados],
          backgroundColor: ['#00FF00', '#FF0000'],
          hoverBackgroundColor: ['#00FF00', '#FF0000'],
        }]
      };
    });
  }
}