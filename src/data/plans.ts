export interface Plan {
  id: 'A' | 'B' | 'C';
  name: string;
  price: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: 'A',
    name: 'Plano A',
    price: 'Gratuito',
    features: [
      'Acesso limitado aos vídeos gratuitos',
      'Cadastro básico na plataforma',
    ],
  },
  {
    id: 'B',
    name: 'Plano B',
    price: 'R$ 29,90 / mês',
    features: [
      'Todos os vídeos de saúde',
      'Conteúdos exclusivos semanais',
      'Suporte prioritário',
    ],
  },
  {
    id: 'C',
    name: 'Plano C',
    price: 'R$ 49,90 / mês',
    features: [
      'Todos os benefícios do Plano B',
      'Descontos especiais na loja',
      'Acesso antecipado a lançamentos',
    ],
  },
];
