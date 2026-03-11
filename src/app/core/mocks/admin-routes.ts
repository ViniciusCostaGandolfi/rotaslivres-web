import { AdminRoute } from "../interfaces/admin-route";
import { UserDto } from "../interfaces/user";



export const usuarioRoutes: AdminRoute[] = [
  {
    title: 'Início',
    icon: 'dashboard',
    href: '/admin'
  },
  {
    title: 'Rotas',
    icon: 'route',
    href: '/admin/rotas'
  },
  {
    title: 'Meu Perfil',
    icon: 'account_circle',
    href: '/admin/perfil'
  }
];

const adminRoutes: AdminRoute[] = [
  ...usuarioRoutes.slice(0, 2),
  {
    title: 'Usuários',
    icon: 'group',
    href: '/admin/usuarios'
  },
  ...usuarioRoutes.slice(2),
  {
    title: 'Configurações',
    icon: 'settings',
    href: '/admin/configuracoes'
  }
];

export function getRoutes(usuario: UserDto) {
  if (usuario.role === 'ROLE_ADMIN') {
    return adminRoutes;
  } else {
    return usuarioRoutes;
  }
}