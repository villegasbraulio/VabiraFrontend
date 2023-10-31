import { Component, OnInit } from '@angular/core';
import { FaqService } from './faq.service';
import { UserService } from '../users/users.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  faqs: any[] = [];
  mostrarForm: boolean = false;
  mostrarFormEditar: boolean = false;
  faqEdit: any = null; 
  nuevaFaq: any = {
    name: '',
    description: ''
  };

  constructor(private faqService: FaqService, private userService: UserService, private messageService: MessageService) {}

  ngOnInit() {
    this.cargarFaqs();
  }

  cargarFaqs() {
    this.faqService.getFaqs().subscribe((data: any[]) => {
      this.faqs = data.map(faq => ({ ...faq, expanded: false }));
    });
  }

  mostrarFormulario() {
    this.mostrarForm = true;
    this.mostrarFormEditar = false;
    this.nuevaFaq = { name: '', description: '' };
  }

  guardarFaq(event: Event) {
    event.preventDefault();
  
    if (this.mostrarFormEditar) {
      // Editar FAQ existente
      this.faqService.editarFaq(this.faqEdit.id, this.faqEdit).subscribe(() => {
        this.mostrarFormEditar = false;
        this.faqEdit = null;
        this.cargarFaqs();
        this.mostrarForm = false;
        this.mostrarMensaje('success', 'Éxito', 'FAQ editada exitosamente');
      });
    } else {
      // Crear nueva FAQ
      this.userService.obtenerPerfilUsuario().subscribe((userProfileData: any) => {
        const userId = userProfileData.id;
        this.nuevaFaq.userId = userId;
  
        this.faqService.crearFaq(this.nuevaFaq).subscribe(() => {
          this.mostrarForm = false;
          this.nuevaFaq = { name: '', description: '' };
          this.cargarFaqs();
          this.mostrarMensaje('success', 'Éxito', 'FAQ agregada exitosamente');
        });
      });
    }
  }

  eliminarFaq(id: number) {
    this.faqService.eliminarFaq(id).subscribe(() => {
      this.cargarFaqs();
      this.mostrarMensaje('success', 'Éxito', 'FAQ eliminada exitosamente');
    });
  }

  editarFaq(faq: any) {
    this.faqEdit = { ...faq };
    this.mostrarFormEditar = true;
    this.mostrarMensaje('info', 'Editando FAQ', 'Puedes realizar cambios y guardar');
  }

  cancelarEdicion() {
    this.faqEdit = null;
    this.mostrarFormEditar = false;
    this.mostrarForm = false;

  }

  mostrarMensaje(severidad: string, resumen: string, detalle: string) {
    this.messageService.add({ severity: severidad, summary: resumen, detail: detalle });
  }
}
