// Este arquivo agora usa o sistema de vídeos do Firebase Storage
// Os dados abaixo são mantidos como fallback e para desenvolvimento

export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  instructor: string;
  videoUrl: string;
  thumbnail: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  premium: boolean;
  views: number;
  rating: number;
  equipment?: string[];
}

// Dados de fallback - serão substituídos pelos dados do Firebase
export const mockVideos: Video[] = [
  {
    id: "yoga-matinal",
    title: "Yoga Matinal Energizante",
    description:
      "Comece seu dia com este fluxo energizante de yoga projetado para despertar seu corpo e mente.",
    category: "Yoga",
    duration: "15:30",
    difficulty: "Iniciante",
    instructor: "Maria Silva",
    videoUrl: "#", // Será preenchido pelo Firebase Storage
    thumbnail:
      "https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["yoga", "matinal", "energia"],
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
    premium: false,
    views: 1250,
    rating: 4.8,
    equipment: ["tapete de yoga"],
  },
  {
    id: "nutricao-fundamentos",
    title: "Fundamentos da Nutrição",
    description:
      "Aprenda os fundamentos da alimentação saudável e planejamento de refeições com nutricionistas certificados.",
    category: "Nutrição",
    duration: "22:45",
    difficulty: "Iniciante",
    instructor: "Dr. João Santos",
    videoUrl: "#", // Será preenchido pelo Firebase Storage
    thumbnail:
      "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["nutrição", "alimentação", "saúde"],
    createdAt: new Date("2024-01-14"),
    updatedAt: new Date("2024-01-14"),
    premium: true,
    views: 980,
    rating: 4.9,
    equipment: [],
  },
  {
    id: "meditacao-stress",
    title: "Meditação para Alívio do Estresse",
    description:
      "Meditação guiada para ajudá-lo a liberar tensões e encontrar paz interior.",
    category: "Bem-estar",
    duration: "12:20",
    difficulty: "Iniciante",
    instructor: "Ana Costa",
    videoUrl: "#", // Será preenchido pelo Firebase Storage
    thumbnail:
      "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["meditação", "estresse", "relaxamento"],
    createdAt: new Date("2024-01-13"),
    updatedAt: new Date("2024-01-13"),
    premium: false,
    views: 2100,
    rating: 4.7,
    equipment: [],
  },
  {
    id: "hiit-cardio",
    title: "HIIT Cardio Explosivo",
    description:
      "Treinamento intervalado de alta intensidade para acelerar seu metabolismo e queimar calorias.",
    category: "Cardio",
    duration: "18:15",
    difficulty: "Avançado",
    instructor: "Pedro Oliveira",
    videoUrl: "#", // Será preenchido pelo Firebase Storage
    thumbnail:
      "https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["hiit", "cardio", "queima de gordura"],
    createdAt: new Date("2024-01-12"),
    updatedAt: new Date("2024-01-12"),
    premium: true,
    views: 1850,
    rating: 4.6,
    equipment: ["tapete", "cronômetro"],
  },
  {
    id: "pilates-core",
    title: "Pilates para Core Forte",
    description:
      "Desenvolva força no core e melhore a flexibilidade com esta aula fundamental de Pilates.",
    category: "Pilates",
    duration: "25:30",
    difficulty: "Intermediário",
    instructor: "Carla Mendes",
    videoUrl: "#", // Será preenchido pelo Firebase Storage
    thumbnail:
      "https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["pilates", "core", "flexibilidade"],
    createdAt: new Date("2024-01-11"),
    updatedAt: new Date("2024-01-11"),
    premium: true,
    views: 1420,
    rating: 4.8,
    equipment: ["tapete", "bola de pilates"],
  },
  {
    id: "sono-qualidade",
    title: "Hábitos para Melhor Sono",
    description:
      "Descubra técnicas e hábitos para melhorar a qualidade do seu sono e acordar revigorado.",
    category: "Bem-estar",
    duration: "16:45",
    difficulty: "Iniciante",
    instructor: "Dr. Roberto Lima",
    videoUrl: "#", // Será preenchido pelo Firebase Storage
    thumbnail:
      "https://images.pexels.com/photos/3771115/pexels-photo-3771115.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    tags: ["sono", "descanso", "hábitos"],
    createdAt: new Date("2024-01-10"),
    updatedAt: new Date("2024-01-10"),
    premium: false,
    views: 3200,
    rating: 4.9,
    equipment: [],
  },
];

// Produtos mock (mantidos como estão)
export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  description: string;
  image: string;
  inStock: boolean;
  rating: number;
  reviewCount: number;
}

export const mockProducts: Product[] = [
  {
    id: "whey-protein-premium",
    name: "Whey Protein Premium",
    price: 149.9,
    originalPrice: 179.9,
    category: "Suplementos",
    description: "Proteína de alta qualidade para ganho de massa muscular",
    image:
      "https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true,
    rating: 4.8,
    reviewCount: 324,
  },
  {
    id: "tapete-yoga-antiderrapante",
    name: "Tapete de Yoga Antiderrapante",
    price: 89.9,
    category: "Equipamentos",
    description: "Tapete premium para práticas de yoga e pilates",
    image:
      "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true,
    rating: 4.6,
    reviewCount: 156,
  },
  {
    id: "creatina-monohidratada",
    name: "Creatina Monohidratada",
    price: 79.9,
    originalPrice: 99.9,
    category: "Suplementos",
    description: "Creatina pura para aumento de força e performance",
    image:
      "https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true,
    rating: 4.9,
    reviewCount: 892,
  },
  {
    id: "shaker-premium",
    name: "Coqueteleira Premium",
    price: 34.9,
    category: "Acessórios",
    description: "Coqueteleira com compartimentos para suplementos",
    image:
      "https://images.pexels.com/photos/4162490/pexels-photo-4162490.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: false,
    rating: 4.4,
    reviewCount: 67,
  },
  {
    id: "halter-ajustavel",
    name: "Halter Ajustável 10kg",
    price: 199.9,
    originalPrice: 249.9,
    category: "Equipamentos",
    description: "Halter com peso ajustável para treinos em casa",
    image:
      "https://images.pexels.com/photos/3757957/pexels-photo-3757957.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true,
    rating: 4.7,
    reviewCount: 234,
  },
  {
    id: "multivitaminico",
    name: "Multivitamínico Completo",
    price: 59.9,
    category: "Suplementos",
    description: "Complexo vitamínico para saúde geral",
    image:
      "https://images.pexels.com/photos/4033148/pexels-photo-4033148.jpeg?auto=compress&cs=tinysrgb&w=400",
    inStock: true,
    rating: 4.5,
    reviewCount: 445,
  },
];

/**
 * INSTRUÇÕES PARA INTEGRAÇÃO COM FIREBASE STORAGE:
 *
 * 1. Estrutura de Pastas no Storage:
 *    - videos/content/{videoId}.mp4 - Arquivos de vídeo
 *    - videos/thumbnails/{videoId}.jpg - Miniaturas dos vídeos
 *    - videos/thumbnails/default.jpg - Miniatura padrão
 *
 * 2. Estrutura no Firestore:
 *    - Coleção: 'videos'
 *    - Documentos com campos: title, description, category, duration, difficulty, instructor, tags, premium, etc.
 *    - Os campos videoUrl e thumbnail podem ser vazios se estiverem no Storage
 *
 * 3. Categorias no Firestore:
 *    - Coleção: 'video_categories'
 *    - Documentos com campos: name, description, thumbnail, videoCount
 *
 * 4. Para adicionar novos vídeos:
 *    - Faça upload do arquivo de vídeo para videos/content/
 *    - Faça upload da miniatura para videos/thumbnails/
 *    - Crie documento no Firestore com metadados
 *    - O sistema automaticamente vinculará os arquivos
 */
