import { Video } from '../stores/favoritesStore';
import { Product } from '../stores/cartStore';

export const mockVideos: Video[] = [
  {
    id: '1',
    title: 'Yoga Matinal Energizante',
    duration: '32 min',
    category: 'Yoga',
    isFree: true,
    videoUrl: '#',
    thumbnail: 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Comece seu dia com este fluxo energizante de yoga projetado para despertar seu corpo e mente.',
    instructor: 'Maya Chen'
  },
  {
    id: '2',
    title: 'Masterclass de Nutrição',
    duration: '45 min',
    category: 'Nutrição',
    isFree: false,
    videoUrl: '#',
    thumbnail: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Aprenda os fundamentos da alimentação saudável e planejamento de refeições com nutricionistas certificados.',
    instructor: 'Dra. Sarah Johnson'
  },
  {
    id: '3',
    title: 'Meditação para Alívio do Estresse',
    duration: '15 min',
    category: 'Meditação',
    isFree: true,
    videoUrl: '#',
    thumbnail: 'https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Meditação guiada para ajudá-lo a liberar tensões e encontrar paz interior.',
    instructor: 'Michael Torres'
  },
  {
    id: '4',
    title: 'HIIT Cardio Explosivo',
    duration: '25 min',
    category: 'Fitness',
    isFree: false,
    videoUrl: '#',
    thumbnail: 'https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Treinamento intervalado de alta intensidade para acelerar seu metabolismo e queimar calorias.',
    instructor: 'Alex Rodriguez'
  },
  {
    id: '5',
    title: 'Fundamentos do Pilates',
    duration: '40 min',
    category: 'Pilates',
    isFree: true,
    videoUrl: '#',
    thumbnail: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Desenvolva força no core e melhore a flexibilidade com esta aula fundamental de Pilates.',
    instructor: 'Emma Wilson'
  },
  {
    id: '6',
    title: 'Otimização do Sono',
    duration: '20 min',
    category: 'Bem-estar',
    isFree: false,
    videoUrl: '#',
    thumbnail: 'https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    description: 'Descubra técnicas e hábitos para melhorar a qualidade do seu sono e acordar revigorado.',
    instructor: 'Dr. James Park'
  }
];

export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Whey Protein Premium',
    price: 149.90,
    image: 'https://images.pexels.com/photos/4162481/pexels-photo-4162481.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Suplementos',
    description: 'Blend de proteína whey de alta qualidade para recuperação muscular e crescimento.',
    rating: 5
  },
  {
    id: '2',
    name: 'Multivitamínico Orgânico',
    price: 89.90,
    image: 'https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Vitaminas',
    description: 'Complexo vitamínico diário completo feito de fontes orgânicas de alimentos integrais.',
    rating: 4
  },
  {
    id: '3',
    name: 'Kit Faixas de Resistência',
    price: 74.90,
    image: 'https://images.pexels.com/photos/4162449/pexels-photo-4162449.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Equipamentos',
    description: 'Kit completo de faixas de resistência para treinamento de força em casa.',
    rating: 5
  },
  {
    id: '4',
    name: 'Tapete de Yoga Premium',
    price: 119.90,
    image: 'https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Equipamentos',
    description: 'Tapete de yoga antiderrapante e ecológico, perfeito para todos os tipos de prática.',
    rating: 5
  },
  {
    id: '5',
    name: 'Chá Herbal para Dormir',
    price: 56.90,
    image: 'https://images.pexels.com/photos/1638280/pexels-photo-1638280.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Bem-estar',
    description: 'Mistura calmante de camomila, lavanda e passiflora para um sono melhor.',
    rating: 4
  },
  {
    id: '6',
    name: 'Bola de Massagem Terapêutica',
    price: 47.90,
    image: 'https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop',
    category: 'Recuperação',
    description: 'Ferramenta de automassagem para alívio de tensão muscular e terapia de pontos-gatilho.',
    rating: 4
  }
];