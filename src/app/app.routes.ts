import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './shared/default-layout/default-layout.component';
import { HomePage } from './features/home/pages/home-page/home-page';
import { LoginPage } from './features/home/pages/login-page/login-page';
import { SiginPage } from './features/home/pages/sigin-page/sigin-page';
import { NotFoundPage } from './shared/not-found-page/not-found-page';

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
                path: 'entrar',
                component: LoginPage,
                title: 'RotaSmart - Entrar'
            },
            {
                path: 'registrar',
                component: SiginPage,
                title: 'RotaSmart - Cadastrar'
            }
        ]
    },
    {
        path: '**',
        component: NotFoundPage
    }
];