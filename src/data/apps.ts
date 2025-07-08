export interface AppInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  route: string;
}

export const apps: AppInfo[] = [
  {
    id: 'fitness-emagrecimento',
    name: '🔥 Emagrecimento Inteligente',
    description: 'Módulo avançado de perda de peso com IA',
    image: 'https://images.pexels.com/photos/414029/pexels-photo-414029.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/emagrecimento',
  },
  {
    id: 'fitness-ganho-massa',
    name: '💪 Ganho de Massa',
    description: 'Hipertrofia otimizada e personalizada',
    image: 'https://images.pexels.com/photos/1552249/pexels-photo-1552249.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/ganho-massa',
  },
  {
    id: 'fitness-recomposicao',
    name: '🔄 Recomposição Corporal',
    description: 'Perda de gordura e ganho muscular simultâneos',
    image: 'https://images.pexels.com/photos/135588/pexels-photo-135588.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/recomposicao',
  },
  {
    id: 'fitness-performance',
    name: '⚡ Performance Atlética',
    description: 'Potencialize seu desempenho esportivo',
    image: 'https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/fitness/performance',
  },
];
