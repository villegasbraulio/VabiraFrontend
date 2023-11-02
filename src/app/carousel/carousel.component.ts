
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'carousel-responsive-demo',
  templateUrl: './carousel.component.html',  // Ruta relativa desde la ubicación del archivo TypeScript
  styleUrls: ['./carousel.component.scss']   // Ruta relativa para los estilos si los tienes
})
export class CarouselResponsiveDemo implements OnInit {
  responsiveOptions: any[] | undefined;
  images: string[] = [];

  constructor() { }

  ngOnInit() {
    this.responsiveOptions = [
      {
        breakpoint: '1400px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '1220px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '1100px',
        numVisible: 1,
        numScroll: 1
      }
    ];

    // Rutas de las imágenes desde la carpeta "assets/carousel"
    this.images = [
      'assets/carousel/logo-23.png',
      'assets/carousel/esteticaCorporal.png',
      'assets/carousel/esteticaFacial.jpg',
      'assets/carousel/depiDefinitiva.png',
      // Agrega aquí más rutas de imágenes según sea necesario
    ];
  }
}