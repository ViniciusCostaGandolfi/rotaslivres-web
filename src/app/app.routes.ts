import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './shared/default-layout/default-layout.component';
import { HomePage } from './features/home/pages/home-page/home-page';
import { LoginPage } from './features/home/pages/login-page/login-page';
import { SiginPage } from './features/home/pages/sigin-page/sigin-page';
import { NotFoundPage } from './shared/not-found-page/not-found-page';
import { AdminPage } from './features/admin/pages/admin-page/admin-page';
import { AdminLayout } from './features/admin/components/admin-layout/admin-layout';
import { RotaPageComponent } from './features/admin/pages/rota-page/rota-page.component';
import { NovaRotaPageComponent } from './features/admin/pages/nova-rota-page/nova-rota-page.component';

export const routes: Routes = [
    {
        path: '',
        component: DefaultLayoutComponent,
        children: [
            {
                path: '',
                component: HomePage,
                pathMatch: 'full',
                title: 'RotaSmart - Home'
            },
            {
                path: 'login',
                component: LoginPage,
                title: 'RotaSmart - Entrar'
            },
            {
                path: 'sigin',
                component: SiginPage,
                title: 'RotaSmart - Cadastrar'
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
                title: 'RotaSmart - Admin'
            },
            {
                path: 'rotas',
                component: NovaRotaPageComponent,
                title: 'RotaSmart - Rotas'
            },
            {
                path: 'rotas/:id',
                component: RotaPageComponent,
                title: 'RotaSmart - Visualizar Rota'
            }
        ]
    },
    {
        path: '**',
        component: NotFoundPage
    }
];