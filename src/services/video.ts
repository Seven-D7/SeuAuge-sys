// Serviço de vídeos - usando Supabase
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

export async function getVideos(): Promise<Video[]> {
  try {
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
    return [];
  }
}

export async function getVideoById(id: string): Promise<Video | null> {
  try {
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
    const { error } = await supabase
      .rpc('increment_video_views', { video_id: videoId });

    if (error) throw error;

  } catch (error) {
    console.error("Erro ao incrementar views:", error);
  }
}

export async function getPopularVideos(limit: number = 10): Promise<Video[]> {
  try {
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
