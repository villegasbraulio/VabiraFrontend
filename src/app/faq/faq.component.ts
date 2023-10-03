import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
})
export class FaqComponent implements OnInit {
  faqs = [
    {
      question: 'Pregunta 1',
      answer: 'Respuesta 1',
    },
    {
      question: 'Pregunta 2',
      answer: 'Respuesta 2',
    },
    {
      question: 'Pregunta 3',
      answer: 'Respuesta 3',
    },
    {
      question: 'Pregunta 4',
      answer: 'Respuesta 4',
    },
    {
      question: 'Pregunta 5',
      answer: 'Respuesta 5',
    }
  ];

  asunto: string = '';
  descripcion: string = '';
  preguntaSeleccionada: number | null = null;
  modoEdicion: boolean = false;

  borrarPregunta(index: number): void {
    this.faqs.splice(index, 1);
  }
  
  editarPregunta(index: number): void {
    const pregunta = this.faqs[index];
    this.asunto = pregunta.question;
    this.descripcion = pregunta.answer;
    this.preguntaSeleccionada = index;
  }
  
  guardarPregunta(): void {
    if (this.preguntaSeleccionada !== null) {
      const pregunta = this.faqs[this.preguntaSeleccionada];
      pregunta.question = this.asunto;
      pregunta.answer = this.descripcion;
      this.preguntaSeleccionada = null;
    } else {
      this.faqs.push({
        question: this.asunto,
        answer: this.descripcion,
      });
    }
    this.asunto = '';
    this.descripcion = '';
  }
  
  limpiarFormulario(): void {
    this.asunto = '';
    this.descripcion = '';
    this.preguntaSeleccionada = null;
  }

  constructor() { }

  ngOnInit(): void {
  }

}