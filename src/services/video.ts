// Serviço de vídeos - migrado para Supabase
import { supabase } from "../lib/supabase";

export interface Video {
  id: string;
  title: string;
  description: string;
  category: string;
  duration: string;
  difficulty: "Iniciante" | "Intermediário" | "Avançado";
  instructor: string;
  thumbnailUrl: string;
  videoUrl?: string;
  tags: string[];
  isPremium: boolean;
  views: number;
  createdAt: Date;
  plan?: string;
}

// Mock data for development/demo
const mockVideos: Video[] = [
  {
    id: "1",
    title: "Treino de Força Básico",
    description: "Introdu��ão aos exercícios de força fundamentais",
    category: "Força",
    duration: "30:00",
    difficulty: "Iniciante",
    instructor: "João Silva",
    thumbnailUrl: "/api/placeholder/400/225",
    tags: ["força", "iniciante", "básico"],
    isPremium: false,
    views: 1250,
    createdAt: new Date(),
    plan: "B"
  },
  {
    id: "2", 
    title: "HIIT Avançado",
    description: "Treino intervalado de alta intensidade",
    category: "Cardio",
    duration: "25:00",
    difficulty: "Avançado",
    instructor: "Maria Santos",
    thumbnailUrl: "/api/placeholder/400/225",
    tags: ["hiit", "cardio", "avançado"],
    isPremium: true,
    views: 890,
    createdAt: new Date(),
    plan: "C"
  }
];

export async function getVideos(): Promise<Video[]> {
  try {
    // Demo mode - return mock data
    if (!import.meta.env.VITE_SUPABASE_URL) {
      console.log("🔧 Demo mode: retornando vídeos mock");
      return mockVideos;
    }

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(video => ({
      ...video,
      createdAt: new Date(video.created_at),
      tags: video.tags || [],
    }));

  } catch (error) {
    console.error("Erro ao buscar vídeos:", error);
    // Fallback to mock data
    return mockVideos;
  }
}

export async function getVideoById(id: string): Promise<Video | null> {
  try {
    // Demo mode
    if (!import.meta.env.VITE_SUPABASE_URL) {
      return mockVideos.find(v => v.id === id) || null;
    }

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    return {
      ...data,
      createdAt: new Date(data.created_at),
      tags: data.tags || [],
    };

  } catch (error) {
    console.error("Erro ao buscar vídeo:", error);
    return null;
  }
}

export async function getVideosByCategory(category: string): Promise<Video[]> {
  try {
    // Demo mode
    if (!import.meta.env.VITE_SUPABASE_URL) {
      return mockVideos.filter(v => v.category === category);
    }

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(video => ({
      ...video,
      createdAt: new Date(video.created_at),
      tags: video.tags || [],
    }));

  } catch (error) {
    console.error("Erro ao buscar vídeos por categoria:", error);
    return [];
  }
}

export async function searchVideos(searchTerm: string): Promise<Video[]> {
  try {
    // Demo mode
    if (!import.meta.env.VITE_SUPABASE_URL) {
      return mockVideos.filter(v => 
        v.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(video => ({
      ...video,
      createdAt: new Date(video.created_at),
      tags: video.tags || [],
    }));

  } catch (error) {
    console.error("Erro ao pesquisar vídeos:", error);
    return [];
  }
}

export async function incrementVideoViews(videoId: string): Promise<void> {
  try {
    // Demo mode - only log
    if (!import.meta.env.VITE_SUPABASE_URL) {
      console.log("🔧 Demo mode: incrementando views para", videoId);
      return;
    }

    const { error } = await supabase
      .rpc('increment_video_views', { video_id: videoId });

    if (error) throw error;

  } catch (error) {
    console.error("Erro ao incrementar views:", error);
  }
}

export async function getPopularVideos(limit: number = 10): Promise<Video[]> {
  try {
    // Demo mode
    if (!import.meta.env.VITE_SUPABASE_URL) {
      return mockVideos
        .sort((a, b) => b.views - a.views)
        .slice(0, limit);
    }

    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('views', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return data.map(video => ({
      ...video,
      createdAt: new Date(video.created_at),
      tags: video.tags || [],
    }));

  } catch (error) {
    console.error("Erro ao buscar vídeos populares:", error);
    return [];
  }
}
