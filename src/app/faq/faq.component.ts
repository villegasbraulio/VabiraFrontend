import { Component, OnInit } from '@angular/core';
import { FaqService } from './faq.service';
import { UserService } from '../users/users.service'; // Importa tu servicio de usuario
import { PrimeIcons } from 'primeng/api';

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

  constructor(private faqService: FaqService, private userService: UserService) {}

  ngOnInit() {
    this.cargarFaqs();
  }

  cargarFaqs() {
    this.faqService.getFaqs().subscribe((data: any[]) => {
      this.faqs = data.map(faq => ({ ...faq, expanded: false }));
      console.log(this.faqs);
    });
  }

  mostrarFormulario() {
    this.mostrarForm = true;
  }
  MostarFormEditar() {
  this.mostrarFormEditar = true; // Asegúrate de establecer mostrarFormEditar a true
  }

  agregarFaq(event: Event) {
    event.preventDefault();
  
    // Obtén el userId del usuario activo
    this.userService.obtenerPerfilUsuario().subscribe((userProfileData: any) => {
      const userId = userProfileData.id;
  
      // Asigna el userId a la nueva FAQ antes de crearla
      this.nuevaFaq.userId = userId;
  
      // Llama al servicio para crear la nueva FAQ
      this.faqService.crearFaq(this.nuevaFaq).subscribe(() => {
        // Limpia el formulario y recarga las FAQs después de crear la nueva FAQ
        this.mostrarForm = false;
        this.nuevaFaq = {
          name: '',
          description: ''
        };
        this.cargarFaqs();
      });
    });
  }

  eliminarFaq(id: number) {
    this.faqService.eliminarFaq(id).subscribe(() => {
      this.cargarFaqs();
    });
  }
  editarFaq(faq: any) {
    this.faqEdit = { ...faq }; // Almacena la FAQ que se va a editar
    this.mostrarFormEditar = true; // Asegúrate de establecer mostrarFormEditar a true
  }

  // Método para cancelar la edición (se llama cuando haces clic en "Cancelar")
  cancelarEdicion() {
    this.faqEdit = null; // Limpia la FAQ que se estaba editando
    this.mostrarFormEditar = false; // Oculta el formulario
  }

  // Método para guardar la edición de la FAQ
  guardarEdicion() {
    // Llama al servicio para actualizar la FAQ
    this.faqService.editarFaq(this.faqEdit.id, this.faqEdit).subscribe(() => {
      // Limpia el formulario y recarga las FAQs después de actualizar la FAQ
      this.cancelarEdicion();
      this.cargarFaqs();
    });
  }
}
