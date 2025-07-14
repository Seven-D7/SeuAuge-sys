import { ref, getDownloadURL, listAll, getMetadata } from "firebase/storage";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  query,
  orderBy,
  where,
} from "firebase/firestore";
import { storage, db } from "../firebase";

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

export interface VideoCategory {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  videoCount: number;
}

class VideoService {
  private videosCache: Map<string, Video> = new Map();
  private categoriesCache: VideoCategory[] = [];
  private lastFetch: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

  /**
   * Busca todos os vídeos do Firestore
   */
  async getAllVideos(): Promise<Video[]> {
    try {
      const now = Date.now();

      // Verificar cache
      if (
        this.videosCache.size > 0 &&
        now - this.lastFetch < this.CACHE_DURATION
      ) {
        return Array.from(this.videosCache.values());
      }

      const videosRef = collection(db, "videos");
      const q = query(videosRef, orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);

      const videos: Video[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const video: Video = {
          id: docSnap.id,
          title: data.title || "Vídeo sem título",
          description: data.description || "",
          category: data.category || "Geral",
          duration: data.duration || "0:00",
          difficulty: data.difficulty || "Iniciante",
          instructor: data.instructor || "Instrutor",
          videoUrl: data.videoUrl || "",
          thumbnail: data.thumbnail || (await this.getDefaultThumbnail()),
          tags: data.tags || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          premium: data.premium || false,
          views: data.views || 0,
          rating: data.rating || 0,
          equipment: data.equipment || [],
        };

        // Se não há thumbnail, tentar buscar do Storage
        if (!video.thumbnail || video.thumbnail === "default") {
          video.thumbnail = await this.getThumbnailFromStorage(video.id);
        }

        // Se não há videoUrl, tentar buscar do Storage
        if (!video.videoUrl) {
          video.videoUrl = await this.getVideoFromStorage(video.id);
        }

        videos.push(video);
        this.videosCache.set(video.id, video);
      }

      this.lastFetch = now;
      return videos;
    } catch (error) {
      console.error("Erro ao buscar vídeos:", error);
      return this.getFallbackVideos();
    }
  }

  /**
   * Busca um vídeo específico por ID
   */
  async getVideoById(id: string): Promise<Video | null> {
    try {
      // Verificar cache primeiro
      if (this.videosCache.has(id)) {
        return this.videosCache.get(id)!;
      }

      const videoRef = doc(db, "videos", id);
      const docSnap = await getDoc(videoRef);

      if (!docSnap.exists()) {
        return null;
      }

      const data = docSnap.data();
      const video: Video = {
        id: docSnap.id,
        title: data.title || "Vídeo sem título",
        description: data.description || "",
        category: data.category || "Geral",
        duration: data.duration || "0:00",
        difficulty: data.difficulty || "Iniciante",
        instructor: data.instructor || "Instrutor",
        videoUrl: data.videoUrl || (await this.getVideoFromStorage(id)),
        thumbnail: data.thumbnail || (await this.getThumbnailFromStorage(id)),
        tags: data.tags || [],
        createdAt: data.createdAt?.toDate() || new Date(),
        updatedAt: data.updatedAt?.toDate() || new Date(),
        premium: data.premium || false,
        views: data.views || 0,
        rating: data.rating || 0,
        equipment: data.equipment || [],
      };

      this.videosCache.set(id, video);
      return video;
    } catch (error) {
      console.error("Erro ao buscar vídeo:", error);
      return null;
    }
  }

  /**
   * Busca vídeos por categoria
   */
  async getVideosByCategory(category: string): Promise<Video[]> {
    try {
      const videosRef = collection(db, "videos");
      const q = query(
        videosRef,
        where("category", "==", category),
        orderBy("createdAt", "desc"),
      );
      const snapshot = await getDocs(q);

      const videos: Video[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const video: Video = {
          id: docSnap.id,
          title: data.title || "Vídeo sem título",
          description: data.description || "",
          category: data.category || "Geral",
          duration: data.duration || "0:00",
          difficulty: data.difficulty || "Iniciante",
          instructor: data.instructor || "Instrutor",
          videoUrl:
            data.videoUrl || (await this.getVideoFromStorage(docSnap.id)),
          thumbnail:
            data.thumbnail || (await this.getThumbnailFromStorage(docSnap.id)),
          tags: data.tags || [],
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          premium: data.premium || false,
          views: data.views || 0,
          rating: data.rating || 0,
          equipment: data.equipment || [],
        };

        videos.push(video);
      }

      return videos;
    } catch (error) {
      console.error("Erro ao buscar vídeos por categoria:", error);
      return [];
    }
  }

  /**
   * Busca categorias de vídeos
   */
  async getCategories(): Promise<VideoCategory[]> {
    try {
      if (this.categoriesCache.length > 0) {
        return this.categoriesCache;
      }

      const categoriesRef = collection(db, "video_categories");
      const snapshot = await getDocs(categoriesRef);

      const categories: VideoCategory[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const category: VideoCategory = {
          id: docSnap.id,
          name: data.name || "Categoria",
          description: data.description || "",
          thumbnail: data.thumbnail || (await this.getDefaultThumbnail()),
          videoCount: data.videoCount || 0,
        };

        categories.push(category);
      }

      this.categoriesCache = categories;
      return categories;
    } catch (error) {
      console.error("Erro ao buscar categorias:", error);
      return this.getFallbackCategories();
    }
  }

  /**
   * Busca thumbnail do Firebase Storage
   */
  private async getThumbnailFromStorage(videoId: string): Promise<string> {
    try {
      const thumbnailRef = ref(storage, `videos/thumbnails/${videoId}.jpg`);
      const thumbnailUrl = await getDownloadURL(thumbnailRef);
      return thumbnailUrl;
    } catch (error) {
      // Tentar outras extensões
      try {
        const thumbnailRef = ref(storage, `videos/thumbnails/${videoId}.png`);
        const thumbnailUrl = await getDownloadURL(thumbnailRef);
        return thumbnailUrl;
      } catch (error2) {
        return await this.getDefaultThumbnail();
      }
    }
  }

  /**
   * Busca vídeo do Firebase Storage
   */
  private async getVideoFromStorage(videoId: string): Promise<string> {
    try {
      const videoRef = ref(storage, `videos/content/${videoId}.mp4`);
      const videoUrl = await getDownloadURL(videoRef);
      return videoUrl;
    } catch (error) {
      // Tentar outras extensões
      try {
        const videoRef = ref(storage, `videos/content/${videoId}.webm`);
        const videoUrl = await getDownloadURL(videoRef);
        return videoUrl;
      } catch (error2) {
        console.warn(`Vídeo ${videoId} não encontrado no storage`);
        return "#";
      }
    }
  }

  /**
   * Busca thumbnail padrão
   */
  private async getDefaultThumbnail(): Promise<string> {
    try {
      const defaultRef = ref(storage, "videos/thumbnails/default.jpg");
      return await getDownloadURL(defaultRef);
    } catch (error) {
      // Retornar uma imagem padrão se não houver no storage
      return "https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";
    }
  }

  /**
   * Lista todos os arquivos de vídeo no Storage
   */
  async listStorageVideos(): Promise<string[]> {
    try {
      const videosRef = ref(storage, "videos/content");
      const result = await listAll(videosRef);

      const videoNames: string[] = [];
      for (const itemRef of result.items) {
        const metadata = await getMetadata(itemRef);
        videoNames.push(itemRef.name);
      }

      return videoNames;
    } catch (error) {
      console.error("Erro ao listar vídeos do storage:", error);
      return [];
    }
  }

  /**
   * Vídeos de fallback quando não há conexão com Firebase
   */
  private getFallbackVideos(): Video[] {
    return [
      {
        id: "fallback-1",
        title: "Yoga Matinal Energizante",
        description:
          "Comece seu dia com este fluxo energizante de yoga projetado para despertar seu corpo e mente.",
        category: "Yoga",
        duration: "15:30",
        difficulty: "Iniciante",
        instructor: "Maria Silva",
        videoUrl: "#",
        thumbnail:
          "https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        tags: ["yoga", "matinal", "energia"],
        createdAt: new Date(),
        updatedAt: new Date(),
        premium: false,
        views: 1250,
        rating: 4.8,
        equipment: ["tapete de yoga"],
      },
      {
        id: "fallback-2",
        title: "Fundamentos da Nutrição",
        description:
          "Aprenda os fundamentos da alimentação saudável e planejamento de refeições com nutricionistas certificados.",
        category: "Nutrição",
        duration: "22:45",
        difficulty: "Iniciante",
        instructor: "Dr. João Santos",
        videoUrl: "#",
        thumbnail:
          "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        tags: ["nutrição", "alimentação", "saúde"],
        createdAt: new Date(),
        updatedAt: new Date(),
        premium: true,
        views: 980,
        rating: 4.9,
        equipment: [],
      },
    ];
  }

  /**
   * Categorias de fallback
   */
  private getFallbackCategories(): VideoCategory[] {
    return [
      {
        id: "yoga",
        name: "Yoga",
        description: "Práticas de yoga para todos os níveis",
        thumbnail:
          "https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        videoCount: 45,
      },
      {
        id: "fitness",
        name: "Fitness",
        description: "Treinos e exercícios para manter a forma",
        thumbnail:
          "https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        videoCount: 67,
      },
      {
        id: "nutricao",
        name: "Nutrição",
        description: "Dicas e conhecimentos sobre alimentação saudável",
        thumbnail:
          "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        videoCount: 23,
      },
    ];
  }

  /**
   * Limpa o cache
   */
  clearCache(): void {
    this.videosCache.clear();
    this.categoriesCache = [];
    this.lastFetch = 0;
  }
}

// Instância singleton
export const videoService = new VideoService();

// Função utilitária para buscar vídeos
export const getVideos = () => videoService.getAllVideos();
export const getVideo = (id: string) => videoService.getVideoById(id);
export const getVideosByCategory = (category: string) =>
  videoService.getVideosByCategory(category);
export const getVideoCategories = () => videoService.getCategories();
