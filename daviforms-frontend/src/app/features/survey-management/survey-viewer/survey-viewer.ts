import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para *ngFor, *ngIf, ngSwitch
import { FormsModule } from '@angular/forms'; // Para [(ngModel)]
import { ActivatedRoute, Router } from '@angular/router'; // Para obtener el ID de la URL y navegar

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
    private router: Router // Inyectamos Router para posible navegación post-envío
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

  // Simula la carga de datos de la encuesta desde un backend
  // En una aplicación real, harías una llamada HTTP a tu servicio aquí
  loadSurvey(id: string): void {
    console.log(`Cargando datos para la encuesta ID: ${id}`);
    // Simulación de datos de encuesta
    const mockSurveyData: { [key: string]: { title: string; questions: SurveyQuestion[] } } = {
      'survey123': {
        title: 'Encuesta de Satisfacción del Cliente DaviForms',
        questions: [
          { id: 'q1', type: 'short-text', label: '¿Cuál es su nombre?', required: true, placeholder: 'Su nombre completo' },
          { id: 'q2', type: 'single-choice', label: '¿Con qué frecuencia utiliza nuestros servicios?', required: true,
            options: [
              { value: 'Diariamente', id: 'q2-opt1' },
              { value: 'Semanalmente', id: 'q2-opt2' },
              { value: 'Mensualmente', id: 'q2-opt3' },
              { value: 'Ocasionalmente', id: 'q2-opt4' }
            ]
          },
          { id: 'q3', type: 'multiple-choice', label: '¿Qué canales de comunicación prefiere para recibir información?', required: false,
            options: [
              { value: 'Correo Electrónico', id: 'q3-opt1' },
              { value: 'Mensajes de Texto (SMS)', id: 'q3-opt2' },
              { value: 'Notificaciones Push (App)', id: 'q3-opt3' },
              { value: 'Llamada Telefónica', id: 'q3-opt4' }
            ]
          },
          { id: 'q4', type: 'rating', label: 'En una escala del 1 al 5, ¿qué tan fácil fue usar nuestra plataforma?', required: true, ratingMax: 5 },
          { id: 'q5', type: 'long-text', label: '¿Tiene alguna sugerencia para mejorar nuestros servicios?', required: false, placeholder: 'Escriba sus comentarios aquí...' },
          { id: 'q6', type: 'date', label: '¿Cuál es la fecha de su nacimiento?', required: false }
        ]
      },
      'survey456': {
        title: 'Encuesta de Preferencias de Productos',
        questions: [
          { id: 'p1', type: 'short-text', label: '¿Qué producto Davivienda es su favorito?', required: true },
          { id: 'p2', type: 'single-choice', label: '¿Estaría interesado en un nuevo producto de inversión?', required: true,
            options: [
              { value: 'Sí, definitivamente', id: 'p2-optA' },
              { value: 'Tal vez, necesito más información', id: 'p2-optB' },
              { value: 'No, gracias', id: 'p2-optC' }
            ]
          }
        ]
      }
    };

    const data = mockSurveyData[id];
    if (data) {
      this.surveyTitle = data.title;
      this.surveyQuestions = data.questions;
      // Inicializar userAnswers para cada pregunta
      this.surveyQuestions.forEach(q => {
        if (q.type === 'multiple-choice') {
          this.userAnswers[q.id] = []; // Para checkboxes, la respuesta es un array
        } else {
          this.userAnswers[q.id] = null; // Valor inicial nulo para otros tipos
        }
      });
    } else {
      this.surveyTitle = 'Encuesta no encontrada.';
      this.surveyQuestions = [];
    }
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