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
        path: 'admin',
        component: Menu,
        children: [
            {
                path: '',
                pathMatch: 'full',
                redirectTo: 'manage-surveys', // 🔁 Redirección al ingresar a /admin
            },
            {
                path: 'manage-surveys',
                loadComponent: () =>
                    import('./features/survey-management/manage-surveys/manage-surveys').then(
                        (m) => m.ManageSurveys
                    ),
            },
            {
                path: 'survey-editor',
                loadComponent: () =>
                    import('./features/survey-management/survey-editor/survey-editor').then(
                        (m) => m.SurveyEditor
                    ),
            },
            {
                path: 'survey-editor/:id',
                loadComponent: () =>
                    import('./features/survey-management/survey-editor/survey-editor').then(
                        (m) => m.SurveyEditor
                    ),
            },
             {
                path: 'analyze-results',
                loadComponent: () =>
                    import('./features/survey-management/analyze-results/analyze-results').then(
                        (m) => m.AnalyzeResults
                    ),
            },
            {
                path: 'analyze-results/:id',
                loadComponent: () =>
                    import('./features/survey-management/analyze-results/analyze-results').then(
                        (m) => m.AnalyzeResults
                    ),
            },

        ],
    },
    {
        path: 'survey/:id', // La ruta que el usuario final abrirá, ej: /survey/survey123
        component: SurveyViewer
    },
];
