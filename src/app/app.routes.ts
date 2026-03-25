import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './shared/default-layout/default-layout.component';
import { HomePage } from './features/home/pages/home-page/home-page';
import { LoginPage } from './features/home/pages/login-page/login-page';
import { SiginPage } from './features/home/pages/sigin-page/sigin-page';
import { ForgotPasswordPage } from './features/home/pages/forgot-password-page/forgot-password-page';
import { ResetPasswordPage } from './features/home/pages/reset-password-page/reset-password-page';
import { NotFoundPage } from './shared/not-found-page/not-found-page';
import { AdminPage } from './features/admin/pages/admin-page/admin-page';
import { AdminLayout } from './features/admin/components/admin-layout/admin-layout';
import { RotaPageComponent } from './features/admin/pages/rota-page/rota-page.component';
import { NovaRotaPageComponent } from './features/admin/pages/nova-rota-page/nova-rota-page.component';
import { PerfilPage } from './features/admin/pages/perfil-page/perfil-page';

export const routes: Routes = [
    {
        path: '',
        component: DefaultLayoutComponent,
        children: [
            {
                path: '',
                component: HomePage,
                pathMatch: 'full',
                title: 'Rotas Livres - Home'
            },
            {
                path: 'login',
                component: LoginPage,
                title: 'Rotas Livres - Entrar'
            },
            {
                path: 'sigin',
                component: SiginPage,
                title: 'Rotas Livres - Cadastrar'
            },
            {
                path: 'resetar-password',
                component: ForgotPasswordPage,
                title: 'Rotas Livres - Recuperar Senha'
            },
            {
                path: 'reset-password',
                component: ResetPasswordPage,
                title: 'Rotas Livres - Nova Senha'
            }
        ]
    },
    {
        path: 'admin',
        component: AdminLayout,
        children: [
            {
                path: '',
                component: AdminPage,
                title: 'Rotas Livres - Admin'
            },
            {
                path: 'roterizacao',
                loadComponent: () => import('./features/admin/pages/minhas-rotas-page/minhas-rotas-page.component').then(m => m.MinhasRotasPageComponent),
                title: 'Rotas Livres - Minhas Roteirizações'
            },
            {
                path: 'roterizacao/nova',
                component: NovaRotaPageComponent,
                title: 'Rotas Livres - Nova Roteirização'
            },
            {
                path: 'roterizacao/:id',
                component: RotaPageComponent,
                title: 'Rotas Livres - Visualizar Roteirização'
            },
            {
                path: 'perfil',
                component: PerfilPage,
                title: 'Rotas Livres - Meu Perfil'
            }
        ]
    },
    {
        path: '**',
        component: NotFoundPage
    }
];