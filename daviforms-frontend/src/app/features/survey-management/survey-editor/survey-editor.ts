import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor, *ngIf, ngSwitch
import { FormsModule } from '@angular/forms'; // Necesario para [(ngModel)]
import { ActivatedRoute, Router } from '@angular/router'; // Para leer el ID de la encuesta si estamos editando
import { SurveyService } from '../../../core/services/survey.service';
import { Survey, SurveyQuestion } from '../../../core/interfaces/survey.interface';


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
  published = false;


  // Propiedades para la edición de una pregunta específica (modo inline)
  editingQuestionId: string | null = null; // ID de la pregunta que se está editando actualmente
  currentQuestionBeingEdited: SurveyQuestion | null = null; // Copia de la pregunta que se edita

  constructor(private route: ActivatedRoute, 
    private surveyService: SurveyService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.surveyId = this.route.snapshot.paramMap.get('id');
    if (this.surveyId) {
      this.loadSurveyForEditing(this.surveyId);
    }
  }

  // Simula la carga de una encuesta existente para edición
  loadSurveyForEditing(id: string): void {
    this.surveyService.getSurveysById(id).subscribe({
      next: (survey) => {
        this.surveyTitle = survey.title;
        this.surveyQuestions = survey.questions;
        this.nextQuestionId = this.surveyQuestions.length + 1; // Ajusta el contador para nuevas preguntas
      },
      error: (err) => {
        console.error('Error al cargar la encuesta:', err);
        alert('No se pudo cargar la encuesta. Por favor, inténtalo de nuevo más tarde.');
      }
    });
  }


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
  }

  // Inicia el modo de edición para una pregunta específica
  editQuestion(question: SurveyQuestion): void {
    this.editingQuestionId = question.id;
    this.currentQuestionBeingEdited = JSON.parse(JSON.stringify(question));
  }

  saveEditedQuestion(): void {
    if (this.currentQuestionBeingEdited) {
      const index = this.surveyQuestions.findIndex(q => q.id === this.editingQuestionId);
      if (index !== -1) {
        this.surveyQuestions[index] = this.currentQuestionBeingEdited;
      }
    }
    this.cancelEditing(); // Sale del modo edición
  }

  cancelEditing(): void {
    this.editingQuestionId = null;
    this.currentQuestionBeingEdited = null;
  }

  deleteQuestion(questionId: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta pregunta?')) {
      this.surveyQuestions = this.surveyQuestions.filter(q => q.id !== questionId);

      if (this.editingQuestionId === questionId) {
        this.cancelEditing();
      }
    }
  }

  addOption(question: SurveyQuestion): void {
    if (question.options) {
      const newOptionId = `${question.id}-opt${question.options.length + 1}`;
      question.options.push({ value: `Nueva Opción ${question.options.length + 1}`, id: newOptionId });
    }
  }

  removeOption(question: SurveyQuestion, optionId: string): void {
    if (question.options) {
      question.options = question.options.filter(opt => opt.id !== optionId);
    }
  }


saveSurvey(): void {
    const dto = {
      title: this.surveyTitle,
      questions: this.surveyQuestions,
    };

    if (this.surveyId) {
      // EDITAR
      this.surveyService.updateSurvey(this.surveyId, dto).subscribe({
        next: () => {
          alert('Encuesta actualizada correctamente');
          this.router.navigate(['/admin/manage-surveys']);
        },
        error: () => alert('Error al actualizar la encuesta')
      });
    } else {
      // CREAR
      this.surveyService.createSurvey(dto).subscribe({
        next: () => {
          alert('Encuesta creada correctamente');
          this.router.navigate(['/admin/manage-surveys']);
        },
        error: () => alert('Error al crear la encuesta')
      });
    }
  }

}