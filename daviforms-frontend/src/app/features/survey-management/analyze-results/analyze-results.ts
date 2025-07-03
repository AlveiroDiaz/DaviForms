import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para directivas como *ngIf, *ngFor
import { ActivatedRoute } from '@angular/router'; // Para obtener el ID de la encuesta de la URL
import { BehaviorSubject, Subscription } from 'rxjs'; // Para manejar la suscripción a los parámetros de la ruta
import { ArcElement, BarController, BarElement, CategoryScale, Chart, ChartConfiguration, ChartData, ChartType, Legend, LinearScale, LineController, LineElement, PieController, PointElement, Tooltip } from 'chart.js'; // Tipos para Chart.js
import { BaseChartDirective } from 'ng2-charts'; // <<-- CAMBIO AQUÍ: Solo BaseChartDirective
import { SurveyResponsesService } from '../../../core/services/survey-responses.service';
import { AggregatedQuestionResult } from '../../../core/interfaces/survey-analysis.interface';

// Interfaz para la estructura de los resultados de cada pregunta


@Component({
  selector: 'app-analyze-results',
  standalone: true,
  imports: [CommonModule, BaseChartDirective, BaseChartDirective], // <<-- CAMBIO AQUÍ: Solo BaseChartDirective en imports
  templateUrl: './analyze-results.html',
  styleUrl: './analyze-results.scss'
})
export class AnalyzeResults implements OnInit, OnDestroy {
  public Object = Object; 

  surveyId: string | null = null; 
  private routeSub: Subscription | undefined;
  results: AggregatedQuestionResult[] = [];
  loading = true; 
  error: string | null = null; 


  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false, // Permite que el gráfico se ajuste al contenedor
    scales: {
      y: {
        beginAtZero: true, // Empieza el eje Y en cero
        title: {
          display: true,
          text: 'Número de Respuestas' // Título del eje Y
        },
        ticks: {
          stepSize: 1 // Asegura que los ticks sean números enteros
        }
      },
      x: {
        grid: {
          display: false // Oculta las líneas de la cuadrícula en el eje X
        }
      }
    },
    plugins: {
      legend: {
        display: false, // No mostrar leyenda si solo hay un dataset por gráfico
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.y !== null) {
              label += context.parsed.y;
            }
            return label;
          }
        }
      }
    }
  };
  public barChartType: ChartType = 'bar';
  public barChartLegend = false; // Controla la visibilidad de la leyenda

  // Configuración general para gráfico de pastel (ejemplo para opción única)
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right', // Posición de la leyenda
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            if (context.parsed !== null) {
              const total = context.dataset.data.reduce((sum, val) => (sum as number) + (val as number), 0);
              const percentage = ((context.parsed as number) / (total as number) * 100).toFixed(2) + '%';
              return `${label}: ${context.parsed} (${percentage})`;
            }
            return label;
          }
        }
      }
    }
  };
  public pieChartType: ChartType = 'pie';
  public pieChartLegend = true;

  constructor(private route: ActivatedRoute,
        private surveyResponsesService: SurveyResponsesService

  ) { 
      Chart.register(
      ArcElement,
      LineElement,
      BarElement,
      PointElement,
      BarController,
      LineController,
      PieController,
      CategoryScale,
      LinearScale,
      Legend,
      Tooltip
    );
  }

  ngOnInit(): void {
    this.routeSub = this.route.params.subscribe(params => {
      this.surveyId = params['id'];
      if (this.surveyId) {
        this.loadResults(this.surveyId); 
      } else {
        this.error = 'ID de encuesta no proporcionado, seleccionelo en la lista de encuestas.';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  // Simula la carga de resultados desde el backend
  // En una aplicación real, harías una solicitud HTTP a tu backend aquí
  async loadResults(surveyId: string): Promise<void> {
    this.loading = true;
    this.error = null;

    this.surveyResponsesService.getResponsesBySurvey(surveyId).subscribe({
      next: (data) => {
        console.log('Resultados cargados:', data);

        this.results = data.results;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error cargando resultados:', err);
        this.error = 'No se pudieron cargar los resultados de la encuesta.';
        this.loading = false;
      }
    });
  }

  // Función para preparar los datos de un gráfico de barras para una pregunta específica
  getBarChartData(result: AggregatedQuestionResult): ChartData<'bar'> {
    if (!result.summary) {
      return { labels: [], datasets: [{ data: [], label: '' }] };
    }
    return {
      labels: Object.keys(result.summary),
      datasets: [
        {
          data: Object.values(result.summary),
          label: result.questionLabel,
          backgroundColor: this.getChartColors(Object.keys(result.summary).length), // Genera colores dinámicamente
          borderColor: this.getChartColors(Object.keys(result.summary).length).map(color => color.replace('0.6', '1')), // Versión opaca para el borde
          borderWidth: 1
        }
      ]
    };
  }

  // Función para preparar los datos de un gráfico de pastel para una pregunta específica
  getPieChartData(result: AggregatedQuestionResult): ChartData<'pie'> {
    if (!result.summary) {
      return { labels: [], datasets: [{ data: [] }] };
    }
    return {
      labels: Object.keys(result.summary),
      datasets: [{
        data: Object.values(result.summary),
        backgroundColor: this.getChartColors(Object.keys(result.summary).length),
        hoverOffset: 4 // Pequeño desplazamiento al pasar el ratón
      }]
    };
  }

  // Función auxiliar para generar colores aleatorios (o predefinidos) para los gráficos
  getChartColors(count: number): string[] {
    const colors = [
      'rgba(228, 0, 43, 0.6)', // Rojo Davivienda
      'rgba(0, 123, 255, 0.6)', // Azul
      'rgba(40, 167, 69, 0.6)', // Verde
      'rgba(255, 193, 7, 0.6)', // Amarillo
      'rgba(108, 117, 125, 0.6)', // Gris
      'rgba(23, 162, 184, 0.6)', // Cian
      'rgba(102, 16, 242, 0.6)', // Púrpura
      'rgba(253, 126, 20, 0.6)', // Naranja
    ];
    // Si hay más opciones que colores predefinidos, genera colores aleatorios
    if (count > colors.length) {
      for (let i = colors.length; i < count; i++) {
        const r = Math.floor(Math.random() * 255);
        const g = Math.floor(Math.random() * 255);
        const b = Math.floor(Math.random() * 255);
        colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
      }
    }
    return colors.slice(0, count);
  }
}