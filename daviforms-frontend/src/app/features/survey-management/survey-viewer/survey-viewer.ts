import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor, *ngIf, ngSwitch
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { ActivatedRoute, Router } from '@angular/router'; // Para obtener el ID de la URL y navegar
import { SurveyService } from '../../../core/services/survey.service';
import { SurveyResponsesService } from '../../../core/services/survey-responses.service';

// Reutilizamos la interfaz de pregunta del editor
interface SurveyQuestion {
  id: string;
  type: 'short-text' | 'long-text' | 'multiple-choice' | 'single-choice' | 'rating' | 'date';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: { value: string; id: string }[];
  ratingMax?: number;
}

@Component({
  selector: 'app-survey-viewer',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule // Importamos FormsModule para el two-way binding de los inputs
  ],
  templateUrl: './survey-viewer.html',
  styleUrl: './survey-viewer.scss'
})
export class SurveyViewer implements OnInit {
  surveyId: string | null = null;
  surveyTitle: string = 'Cargando Encuesta...';
  surveyQuestions: SurveyQuestion[] = [];
  userAnswers: { [questionId: string]: any } = {}; // Objeto para almacenar las respuestas del usuario

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private surveyService: SurveyService,
    private surveyResponsesService: SurveyResponsesService
  ) { }

  ngOnInit(): void {
    // Suscribirse a los cambios en los parámetros de la ruta para obtener el ID de la encuesta
    this.route.paramMap.subscribe(params => {
      this.surveyId = params.get('id');
      if (this.surveyId) {
        this.loadSurvey(this.surveyId);
      } else {
        // Manejar el caso donde no hay ID de encuesta, quizás redirigir o mostrar un error
        console.error('No se proporcionó un ID de encuesta.');
        this.surveyTitle = 'Encuesta no encontrada o ID inválido.';
        // Opcional: Redirigir a una página de error o a la lista de encuestas
        // this.router.navigate(['/surveys']);
      }
    });
  }


  loadSurvey(id: string): void {
    console.log(`Cargando datos para la encuesta ID: ${id}`);
    this.surveyService.getSurveysById(id).subscribe({
      next: (data) => {
        this.surveyTitle = data.title;
        this.surveyQuestions = data.questions;
      },
      error: (err) => {
        console.error('Error cargando la encuesta:', err);
        this.surveyTitle = 'Encuesta no encontrada.';
        this.surveyQuestions = [];
      }
    });
  }


  // Maneja el cambio para checkboxes de opción múltiple
  onCheckboxChange(questionId: string, optionValue: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (!this.userAnswers[questionId]) {
      this.userAnswers[questionId] = [];
    }
    if (isChecked) {
      this.userAnswers[questionId].push(optionValue);
    } else {
      this.userAnswers[questionId] = this.userAnswers[questionId].filter((val: string) => val !== optionValue);
    }
  }

  // Valida el formulario antes de enviar
  validateForm(): boolean {
    let isValid = true;
    this.surveyQuestions.forEach(q => {
      if (q.required) {
        if (q.type === 'multiple-choice') {
          // Para múltiples opciones, debe haber al menos una seleccionada
          if (!this.userAnswers[q.id] || this.userAnswers[q.id].length === 0) {
            isValid = false;
            // Podrías añadir lógica para marcar la pregunta como inválida en el UI
            console.warn(`Pregunta requerida no respondida: ${q.label}`);
          }
        } else if (this.userAnswers[q.id] === null || this.userAnswers[q.id] === undefined || this.userAnswers[q.id] === '') {
          isValid = false;
          console.warn(`Pregunta requerida no respondida: ${q.label}`);
        }
      }
    });
    return isValid;
  }

  // Envía las respuestas del usuario
  onSubmit(): void {
    if (this.validateForm()) {
      console.log('Encuesta Enviada:', {
        surveyId: this.surveyId,
        answers: this.userAnswers
      });

      this.surveyResponsesService.createResponse({
        surveyId: this.surveyId || '',
        submittedAt: new Date().toISOString(),
        answers: Object.keys(this.userAnswers).map(questionId => ({
          questionId,
          answer: this.userAnswers[questionId]
        }))
      }).subscribe({
        next: (response) => {
          console.log('Respuesta enviada con éxito:', response);
        },
        error: (error) => {
          console.error('Error al enviar la respuesta:', error);
          alert('Hubo un error al enviar su respuesta. Por favor, inténtelo de nuevo más tarde.');
        }
      });
      alert('¡Encuesta enviada con éxito! Gracias por su participación.');
      // En una aplicación real, enviarías `this.userAnswers` a tu backend.
      // Luego podrías redirigir al usuario o mostrar un mensaje de agradecimiento.
      // this.router.navigate(['/thank-you']);
    } else {
      alert('Por favor, complete todas las preguntas requeridas antes de enviar.');
    }
  }

  // Función auxiliar para generar un array para ngFor en el rating
  getStars(count: number): number[] {
    return Array(count).fill(0).map((x, i) => i + 1);
  }
}