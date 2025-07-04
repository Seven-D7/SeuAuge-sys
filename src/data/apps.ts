export interface AppInfo {
  id: string;
  name: string;
  description: string;
  image: string;
  route: string;
}

export const apps: AppInfo[] = [
  {
    id: 'emagrecimento',
    name: 'Emagrecendo bem',
    description: 'Questionário completo para criar seu plano de emagrecimento',
    image: 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    route: '/emagrecimento',
  },
];
