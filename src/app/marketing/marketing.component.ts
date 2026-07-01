import { Component, OnInit } from '@angular/core';
import { UserService } from '../users/users.service';
import { MarketingService } from './marketing.service';

@Component({
  selector: 'app-marketing',
  templateUrl: './marketing.component.html',
  styleUrls: ['./marketing.component.css'],
})
export class MarketingComponent implements OnInit {
  customers: any[] = [];
  templates: any[] = [];
  messages: any[] = [];
  scheduled: any[] = [];
  loading = true;
  supplierId?: number;

  constructor(
    private readonly marketingService: MarketingService,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    this.userService.obtenerPerfilSupplier().subscribe((supplier) => {
      this.supplierId = supplier.id;
      this.loadData();
    });
  }

  loadData(): void {
    if (!this.supplierId) return;
    this.loading = true;

    this.marketingService.getCustomers(this.supplierId).subscribe((customers) => {
      this.customers = customers;
      this.loading = false;
    });
    this.marketingService.getTemplates(this.supplierId).subscribe((templates) => {
      this.templates = templates;
    });
    this.marketingService.getMessageLogs(this.supplierId).subscribe((messages) => {
      this.messages = messages;
    });
    this.marketingService.getScheduled(this.supplierId).subscribe((scheduled) => {
      this.scheduled = scheduled;
    });
  }

  formatStatus(status: string): string {
    return (status || '').replace(/_/g, ' ');
  }
}
