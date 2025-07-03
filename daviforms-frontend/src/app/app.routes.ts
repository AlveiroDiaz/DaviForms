import { Routes } from '@angular/router';
import { Auth } from './features/auth/auth';
import { Menu } from './shared/components/menu/menu';
import { SurveyEditor } from './features/survey-management/survey-editor/survey-editor';
import { SurveyViewer } from './features/survey-management/survey-viewer/survey-viewer';

export const routes: Routes = [
    {
        path: 'auth',
        component: Auth,
    },
    {
        path: '', // Cuando la URL está vacía (ruta base)
        redirectTo: 'auth', // Redirige a la ruta 'auth'
        pathMatch: 'full', // Importante: asegura que la ruta completa coincida con la cadena vacía
    },
    {
        path: 'admin', // Ruta principal para el panel de administración
        component: Menu, // Carga el layout del admin
        // Aquí podrías añadir un canActivate para proteger esta ruta y asegurar que solo usuarios logueados accedan
        // canActivate: [AuthGuard], // <-- Necesitarías crear este guard
        children: [ // Rutas hijas que se cargarán dentro del <router-outlet> de AdminDashboardComponent
            {
                path: 'manage-surveys', //  /admin/manage-surveys
                loadComponent: () => import('./features/survey-management/manage-surveys/manage-surveys').then(m => m.ManageSurveys),
                // ^^^ Deberás crear este componente
            },
            {
                path: 'survey-editor/:id', // /admin/create-survey
                loadComponent: () => import('./features/survey-management/survey-editor/survey-editor').then(m => m.SurveyEditor),
                //loadComponent: () => import('./features/survey-management/survey-editor/survey-editor.component').then(m => m.SurveyEditorComponent),
                // ^^^ Este sería tu componente para crear/editar encuestas
            }
            // {
            //     path: 'analyze-results', // /admin/analyze-results
            //     //loadComponent: () => import('./features/results-dashboard/results-dashboard/results-dashboard.component').then(m => m.ResultsDashboardComponent),
            //     // ^^^ Este sería el componente para ver gráficas y resultados
            // },
            // {
            //     path: 'manage-users', // /admin/manage-users (opcional)
            //     // loadComponent: () => import('./features/user-management/user-management.component').then(m => m.UserManagementComponent),
            //     // ^^^ Deberás crear este componente si lo incluyes
            // },
            // {
            //     path: '', // Ruta por defecto para /admin (ej. redirigir a gestionar encuestas)
            //     redirectTo: 'manage-surveys',
            //     pathMatch: 'full'
            // }
        ]
    },
     {
    path: 'survey/:id', // La ruta que el usuario final abrirá, ej: /survey/survey123
    component: SurveyViewer
  },
];
