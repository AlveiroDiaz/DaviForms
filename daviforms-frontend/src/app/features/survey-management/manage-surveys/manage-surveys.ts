import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, *ngIf
import { Router } from '@angular/router'; // Para la navegación
import { SurveyService } from '../../../core/services/survey.service';
import { SurveyResponse } from '../../../core/interfaces/survey.interface';


@Component({
  selector: 'app-manage-surveys',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para directivas estructurales
  templateUrl: './manage-surveys.html',
  styleUrl: './manage-surveys.scss'
})
export class ManageSurveys implements OnInit {

  surveys: SurveyResponse[] = [];
  loading = false;
  error: string | null = null;


  constructor(private router: Router,
      private surveyService: SurveyService // Asegúrate de importar y usar tu servicio de encuestas
  ) { }

  ngOnInit(): void {
    // Simula la carga de encuestas (en un proyecto real, esto vendría de un servicio)
    this.loadSurveys();
  }

  loadSurveys(): void {
    this.loading = true;
    this.error = null;

    this.surveyService.getSurveys().subscribe({
      next: (data) => {
        this.surveys = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando encuestas:', err);
        this.error = err.error?.message || 'No se pudieron cargar las encuestas';
        this.loading = false;
      }
    });
  }

  // Métodos para el botón y las acciones de la tabla

  goToCreateSurvey(): void {
    // Navega a la ruta para crear una nueva encuesta
    this.router.navigate(['/admin/survey-editor']);
  }

  toggleActionsMenu(survey: SurveyResponse): void {
    // Cierra todos los otros menús abiertos antes de abrir el actual
    this.surveys.forEach(s => {
      if (s._id !== survey._id) {
        s.showActionsMenu = false;
      }
    });
    survey.showActionsMenu = !survey.showActionsMenu;
  }

  editSurvey(survey: SurveyResponse): void {
    
    this.router.navigate(['/admin/survey-editor/', survey._id]);
    this.closeAllActionMenus();
  }

  analizeSurvey(survey: SurveyResponse): void {

    this.router.navigate(['/admin/analyze-results/', survey._id]);
    this.closeAllActionMenus();
  }

  copySurveyLink(survey: SurveyResponse): void {
    if (survey._id) {
      navigator.clipboard.writeText(`http://localhost:4200/survey/${survey._id}`).then(() => {
        alert(`Enlace copiado: http://localhost:4200/survey/${survey._id}`);
      }).catch(err => {
        console.error('No se pudo copiar el enlace:', err);
      });
    } else {
      alert('No hay enlace disponible para esta encuesta.');
    }
    this.closeAllActionMenus();
  }

  deleteSurvey(survey: SurveyResponse): void {

    if (confirm(`¿Estás seguro de que quieres eliminar la encuesta "${survey.title}"?`)) {
      
      this.surveyService.deleteSurvey(survey._id).subscribe({
        next: () => {
          alert(`Encuesta "${survey.title}" eliminada.`);
          this.surveys = this.surveys.filter(s => s._id !== survey._id);
        },
        error: (err) => {
          console.error('Error al eliminar la encuesta:', err);
          alert('No se pudo eliminar la encuesta. Inténtalo más tarde.');
        }
      });

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