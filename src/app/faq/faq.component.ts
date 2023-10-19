import { Component, OnInit } from '@angular/core';
import { FaqService } from './faq.service';
import { UserService } from '../users/users.service'; // Importa tu servicio de usuario

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css']
})
export class FaqComponent implements OnInit {
  faqs: any[] = [];
  mostrarForm: boolean = false;
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
}
