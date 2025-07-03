import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, *ngIf, ngSwitch
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { ActivatedRoute } from '@angular/router'; // Para leer el ID de la encuesta si estamos editando

interface SurveyQuestion {
  id: string; 
  type: 'short-text' | 'long-text' | 'multiple-choice' | 'single-choice' | 'rating' | 'date';
  label: string; 
  required: boolean;
  placeholder?: string; // Para inputs de texto
  options?: { value: string; id: string }[]; // Para preguntas de opción múltiple/única
  ratingMax?: number; // Para el tipo 'rating' (ej. 5 estrellas)
}

@Component({
  selector: 'app-survey-editor',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule  
  ],
  templateUrl: './survey-editor.html',
  styleUrl: './survey-editor.scss'
})
export class SurveyEditor implements OnInit {
  surveyId: string | null = null; // Guardará el ID de la encuesta si estamos en modo edición
  surveyTitle: string = 'Nueva Encuesta Sin Título'; // Título de la encuesta
  surveyQuestions: SurveyQuestion[] = []; // Array que contiene todas las preguntas de la encuesta
  nextQuestionId: number = 1; // Contador para generar IDs únicos para nuevas preguntas

  // Propiedades para la edición de una pregunta específica (modo inline)
  editingQuestionId: string | null = null; // ID de la pregunta que se está editando actualmente
  currentQuestionBeingEdited: SurveyQuestion | null = null; // Copia de la pregunta que se edita

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get('id');
    if (this.surveyId) {
      this.loadSurveyForEditing(this.surveyId);
    }
  }

  // Simula la carga de una encuesta existente para edición
  loadSurveyForEditing(id: string): void {
    console.log(`Cargando encuesta con ID: ${id} para edición...`);
    // En una aplicación real, harías una solicitud HTTP a tu backend aquí
    const loadedSurveyQuestions: SurveyQuestion[] = [
      {
        id: 'q1',
        type: 'short-text',
        label: '¿Cuál es tu nombre completo?',
        required: true,
        placeholder: 'Ej: Juan Pérez'
      },
      {
        id: 'q2',
        type: 'multiple-choice',
        label: '¿Qué tipo de servicios financieros te interesan?',
        required: false,
        options: [
          { value: 'Cuentas de Ahorro', id: 'q2-opt1' },
          { value: 'Créditos Personales', id: 'q2-opt2' },
          { value: 'Inversiones', id: 'q2-opt3' },
          { value: 'Seguros', id: 'q2-opt4' }
        ]
      },
      {
        id: 'q3',
        type: 'rating',
        label: '¿Qué tan satisfecho estás con nuestro proceso de atención al cliente?',
        required: true,
        ratingMax: 5
      },
      {
        id: 'q4',
        type: 'long-text',
        label: 'Por favor, comparte cualquier comentario adicional o sugerencia.',
        required: false,
        placeholder: 'Escribe tu respuesta aquí...'
      }
    ];
    this.surveyQuestions = loadedSurveyQuestions;
    this.surveyTitle = `Encuesta Existente (ID: ${id})`;
    // Asegura que los IDs de las nuevas preguntas no choquen con los cargados
    this.nextQuestionId = this.surveyQuestions.length > 0 ?
                          Math.max(...this.surveyQuestions.map(q => parseInt(q.id.replace('q', '')) || 0)) + 1
                          : 1;
  }

  // --- Funciones de Gestión de Preguntas ---

  // Añade una nueva pregunta al array surveyQuestions
  addQuestion(type: SurveyQuestion['type']): void {
    const newId = `q${this.nextQuestionId++}`;
    let newQuestion: SurveyQuestion;

    switch (type) {
      case 'short-text':
        newQuestion = { id: newId, type, label: 'Nueva pregunta de texto corto', required: false, placeholder: 'Escribe tu respuesta aquí...' };
        break;
      case 'long-text':
        newQuestion = { id: newId, type, label: 'Nueva pregunta de párrafo', required: false, placeholder: 'Escribe tu respuesta detallada aquí...' };
        break;
      case 'multiple-choice':
        newQuestion = {
          id: newId, type, label: 'Nueva pregunta de opción múltiple (selección múltiple)', required: false,
          options: [
            { value: 'Opción 1', id: `${newId}-opt1` },
            { value: 'Opción 2', id: `${newId}-opt2` }
          ]
        };
        break;
      case 'single-choice':
        newQuestion = {
          id: newId, type, label: 'Nueva pregunta de selección única', required: false,
          options: [
            { value: 'Opción A', id: `${newId}-optA` },
            { value: 'Opción B', id: `${newId}-optB` }
          ]
        };
        break;
      case 'rating':
        newQuestion = { id: newId, type, label: 'Nueva pregunta de valoración (estrellas)', required: false, ratingMax: 5 };
        break;
      case 'date':
        newQuestion = { id: newId, type, label: 'Nueva pregunta de fecha', required: false };
        break;
      default:
        console.error('Tipo de pregunta no reconocido:', type);
        return;
    }
    this.surveyQuestions.push(newQuestion);
    console.log(`Pregunta "${newQuestion.label}" (${newQuestion.type}) añadida.`);
  }

  // Inicia el modo de edición para una pregunta específica
  editQuestion(question: SurveyQuestion): void {
    console.log('Editando pregunta:', question.id);
    this.editingQuestionId = question.id;
    // Crea una copia profunda de la pregunta para editarla sin afectar el array original hasta que se guarde
    this.currentQuestionBeingEdited = JSON.parse(JSON.stringify(question));
  }

  // Guarda los cambios de la pregunta editada
  saveEditedQuestion(): void {
    if (this.currentQuestionBeingEdited) {
      const index = this.surveyQuestions.findIndex(q => q.id === this.editingQuestionId);
      if (index !== -1) {
        // Reemplaza la pregunta original con la editada
        this.surveyQuestions[index] = this.currentQuestionBeingEdited;
        console.log('Pregunta editada y guardada:', this.currentQuestionBeingEdited.id);
      }
    }
    this.cancelEditing(); // Sale del modo edición
  }

  // Cancela el modo de edición
  cancelEditing(): void {
    this.editingQuestionId = null;
    this.currentQuestionBeingEdited = null;
    console.log('Edición cancelada.');
  }

  // Elimina una pregunta del array
  deleteQuestion(questionId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      this.surveyQuestions = this.surveyQuestions.filter(q => q.id !== questionId);
      console.log(`Pregunta ${questionId} eliminada.`);
      // Si la pregunta eliminada era la que se estaba editando, cancelar la edición
      if (this.editingQuestionId === questionId) {
        this.cancelEditing();
      }
    }
  }

  // Añade una nueva opción a una pregunta de opción múltiple/única
  addOption(question: SurveyQuestion): void {
    if (question.options) {
      const newOptionId = `${question.id}-opt${question.options.length + 1}`;
      question.options.push({ value: `Nueva Opción ${question.options.length + 1}`, id: newOptionId });
    }
  }

  // Elimina una opción de una pregunta de opción múltiple/única
  removeOption(question: SurveyQuestion, optionId: string): void {
    if (question.options) {
      question.options = question.options.filter(opt => opt.id !== optionId);
    }
  }

  // --- Acciones de Encuesta Globales ---

  // Guarda toda la encuesta
  saveSurvey(): void {
    console.log('Datos de la encuesta a guardar:', {
      id: this.surveyId,
      title: this.surveyTitle,
      questions: this.surveyQuestions
    });
    alert('Encuesta guardada (simulado). Revisa la consola para ver los datos.');
    // Aquí es donde harías una llamada a tu servicio para enviar los datos al backend
  }

  // Publica la encuesta
  publishSurvey(): void {
    console.log('Publicando encuesta:', {
      id: this.surveyId,
      title: this.surveyTitle,
      questions: this.surveyQuestions
    });
    alert('Encuesta publicada (simulado).');
    // Aquí es donde harías una llamada a tu servicio para cambiar el estado a "publicado"
  }
}