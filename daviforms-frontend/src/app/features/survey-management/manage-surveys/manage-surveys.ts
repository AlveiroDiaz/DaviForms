import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, *ngIf
import { Router } from '@angular/router'; // Para la navegación

// Interfaz para definir la estructura de una encuesta
interface Survey {
  id: string;
  title: string;
  status: 'Activa' | 'Inactiva' | 'Borrador';
  responses: number;
  creationDate: Date;
  showActionsMenu?: boolean; // Propiedad para controlar la visibilidad del menú de acciones
  link?: string; // Para el enlace de la encuesta
}

@Component({
  selector: 'app-manage-surveys',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para directivas estructurales
  templateUrl: './manage-surveys.html',
  styleUrl: './manage-surveys.scss'
})
export class ManageSurveys implements OnInit {

  surveys: Survey[] = [];

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Simula la carga de encuestas (en un proyecto real, esto vendría de un servicio)
    this.loadSurveys();
  }

  loadSurveys(): void {
    // Datos de ejemplo
    this.surveys = [
      {
        id: '1',
        title: 'Encuesta de Satisfacción del Cliente Q2 2024',
        status: 'Activa',
        responses: 150,
        creationDate: new Date('2024-05-10'),
        link: 'https://daviforms.com/survey/q2-2024-satisfaction'
      },
      {
        id: '2',
        title: 'Feedback sobre Nuevas Características del Producto',
        status: 'Inactiva',
        responses: 80,
        creationDate: new Date('2024-04-01'),
        link: 'https://daviforms.com/survey/new-features-feedback'
      },
      {
        id: '3',
        title: 'Sugerencias para Mejorar el Servicio al Cliente',
        status: 'Activa',
        responses: 210,
        creationDate: new Date('2024-06-15'),
        link: 'https://daviforms.com/survey/customer-service-suggestions'
      },
      {
        id: '4',
        title: 'Encuesta de Preferencias de Marketing',
        status: 'Inactiva',
        responses: 45,
        creationDate: new Date('2024-03-20'),
        link: 'https://daviforms.com/survey/marketing-preferences'
      },
    ];
  }

  // Métodos para el botón y las acciones de la tabla

  goToCreateSurvey(): void {
    // Navega a la ruta para crear una nueva encuesta
    this.router.navigate(['/admin/survey-editor']);
  }

  toggleActionsMenu(survey: Survey): void {
    // Cierra todos los otros menús abiertos antes de abrir el actual
    this.surveys.forEach(s => {
      if (s.id !== survey.id) {
        s.showActionsMenu = false;
      }
    });
    survey.showActionsMenu = !survey.showActionsMenu;
  }

  editSurvey(survey: Survey): void {
    alert(`Editar encuesta: ${survey.title} (ID: ${survey.id})`);
    // Aquí navegarías a la página de edición de encuestas, pasando el ID
    this.router.navigate(['/admin/survey-editor/', survey.id]);
    this.closeAllActionMenus();
  }

  copySurveyLink(survey: Survey): void {
    if (survey.link) {
      navigator.clipboard.writeText(survey.link).then(() => {
        alert(`Enlace copiado: ${survey.link}`);
      }).catch(err => {
        console.error('No se pudo copiar el enlace:', err);
      });
    } else {
      alert('No hay enlace disponible para esta encuesta.');
    }
    this.closeAllActionMenus();
  }

  deleteSurvey(survey: Survey): void {
    if (confirm(`¿Estás seguro de que quieres eliminar la encuesta "${survey.title}"?`)) {
      // Simula la eliminación (en un proyecto real, llamarías a un servicio)
      this.surveys = this.surveys.filter(s => s.id !== survey.id);
      alert(`Encuesta "${survey.title}" eliminada.`);
    }
    this.closeAllActionMenus();
  }

  // Cierra todos los menús de acción si se hace clic fuera
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    const target = event.target as HTMLElement;
    if (!target.closest('.action-menu')) {
      this.closeAllActionMenus();
    }
  }

  closeAllActionMenus(): void {
    this.surveys.forEach(s => s.showActionsMenu = false);
  }
}