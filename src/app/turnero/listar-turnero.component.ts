// Componente TypeScript
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table';
import { MessageService } from 'primeng/api';
import { ProveedorService } from '../proveedor/proveedor.service';
import { Router } from '@angular/router';
import { TurneroService } from './turnero.service';

@Component({
  selector: 'app-listar-turnero',
  templateUrl: './listar-turnero.component.html',
  styleUrls: ['./listar-turnero.component.css'],
  providers: [MessageService]
})
export class ListarTurneroComponent implements OnInit {
  @ViewChild('dt1') dataTable: Table | null = null;
  schedules: any[];
  columnas: any[];

  constructor(
    private proveedorService: ProveedorService,
    private router: Router,
    private messageService: MessageService,
    private turneroService: TurneroService
  ) {
    this.schedules = [];
    this.columnas = [
      { field: 'id', header: 'ID' },
      { field: 'supplier.user.username', header: 'Username' },
      { field: 'supplier.user.firstName', header: 'Nombre' },
      { field: 'supplier.user.lastName', header: 'Apellido' },
      { field: 'name', header: 'Agenda' },
      { field: 'hasSign', header: '¿ Incluye seña ?' },
      { field: 'acciones', header: 'Acciones' },
    ];
  }

  ngOnInit() {
    this.cargarUsuarios();
  }

  navigateToDashboard(scheduleId: number) {
    this.router.navigate(['/agenda', scheduleId]);
  }

  cargarUsuarios() {
    this.proveedorService.obtenerProveedores2().subscribe((data: any) => {
      this.schedules = data.map((schedule: { signStatusText: string; hasSign: any; }) => {
        // Agregar una nueva propiedad 'signStatusText' que contendrá el texto a mostrar
        schedule.signStatusText = schedule.hasSign ? 'Incluye seña' : 'No incluye seña';
        return schedule;
      });
  
      if (this.dataTable) {
        this.dataTable.reset();
      }
    });
  }

  eliminarAgenda(id: number) {
    this.turneroService.eliminarAgenda(id).subscribe((data: any) => {
      // Puedes realizar acciones adicionales después de eliminar el usuario, si es necesario.
      this.reloadPage();
    });
  }


  clearGlobalFilter() {
    if (this.dataTable) {
      this.dataTable.filter('', 'globalFilter', 'contains');
    }
  }

  filterGlobal(event: any) {
    if (this.dataTable) {
      const filterValue = event.target.value;
      console.log('Valor del filtro:', filterValue);
      this.dataTable.filter(filterValue, 'globalFilter', 'contains');
    }
  }


  // Método para recargar la página
  reloadPage() {
    location.reload();
  }
}
