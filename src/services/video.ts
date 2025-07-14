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
  private firebaseUnavailable: boolean = false;

  /**
   * Verifica se o Firebase está indisponível
   */
  private isFirebaseUnavailable(): boolean {
    // Verificar se estamos usando credenciais placeholder
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    return (
      !apiKey ||
      apiKey === "demo-api-key-placeholder" ||
      this.firebaseUnavailable
    );
  }

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

      // Modo desenvolvimento - usar dados fallback se Firebase não configurado
      if (
        import.meta.env.VITE_DEV_MODE === "true" ||
        this.isFirebaseUnavailable()
      ) {
        if (import.meta.env.DEV) {
          console.log(
            "Usando dados de fallback para vídeos (modo desenvolvimento)",
          );
        }
        const fallbackVideos = this.getFallbackVideos();
        fallbackVideos.forEach((video) =>
          this.videosCache.set(video.id, video),
        );
        this.lastFetch = now;
        return fallbackVideos;
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
      console.warn(
        "Erro ao buscar vídeos do Firebase, usando dados de fallback:",
        error,
      );
      this.firebaseUnavailable = true;
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

      // Modo desenvolvimento ou Firebase indisponível
      if (
        import.meta.env.VITE_DEV_MODE === "true" ||
        this.isFirebaseUnavailable()
      ) {
        const fallbackVideos = this.getFallbackVideos();
        const video = fallbackVideos.find((v) => v.id === id);
        if (video) {
          this.videosCache.set(id, video);
          return video;
        }
        return null;
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
      console.warn("Erro ao buscar vídeo do Firebase:", error);
      this.firebaseUnavailable = true;
      // Tentar buscar nos dados de fallback
      const fallbackVideos = this.getFallbackVideos();
      return fallbackVideos.find((v) => v.id === id) || null;
    }
  }

  /**
   * Busca vídeos por categoria
   */
  async getVideosByCategory(category: string): Promise<Video[]> {
    try {
      // Modo desenvolvimento ou Firebase indisponível
      if (
        import.meta.env.VITE_DEV_MODE === "true" ||
        this.isFirebaseUnavailable()
      ) {
        const fallbackVideos = this.getFallbackVideos();
        return fallbackVideos.filter((video) => video.category === category);
      }

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
      console.warn("Erro ao buscar vídeos por categoria do Firebase:", error);
      this.firebaseUnavailable = true;
      const fallbackVideos = this.getFallbackVideos();
      return fallbackVideos.filter((video) => video.category === category);
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

      // Modo desenvolvimento ou Firebase indisponível
      if (
        import.meta.env.VITE_DEV_MODE === "true" ||
        this.isFirebaseUnavailable()
      ) {
        const fallbackCategories = this.getFallbackCategories();
        this.categoriesCache = fallbackCategories;
        return fallbackCategories;
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
      console.warn("Erro ao buscar categorias do Firebase:", error);
      this.firebaseUnavailable = true;
      return this.getFallbackCategories();
    }
  }

  /**
   * Busca thumbnail do Firebase Storage
   */
  private async getThumbnailFromStorage(videoId: string): Promise<string> {
    try {
      // Pular se Firebase indisponível
      if (this.isFirebaseUnavailable()) {
        return await this.getDefaultThumbnail();
      }

      const thumbnailRef = ref(storage, `videos/thumbnails/${videoId}.jpg`);
      const thumbnailUrl = await getDownloadURL(thumbnailRef);
      return thumbnailUrl;
    } catch (error) {
      // Tentar outras extensões
      try {
        if (!this.isFirebaseUnavailable()) {
          const thumbnailRef = ref(storage, `videos/thumbnails/${videoId}.png`);
          const thumbnailUrl = await getDownloadURL(thumbnailRef);
          return thumbnailUrl;
        }
      } catch (error2) {
        // Ignorar erro
      }
      return await this.getDefaultThumbnail();
    }
  }

  /**
   * Busca vídeo do Firebase Storage
   */
  private async getVideoFromStorage(videoId: string): Promise<string> {
    try {
      // Pular se Firebase indisponível
      if (this.isFirebaseUnavailable()) {
        return "#";
      }

      const videoRef = ref(storage, `videos/content/${videoId}.mp4`);
      const videoUrl = await getDownloadURL(videoRef);
      return videoUrl;
    } catch (error) {
      // Tentar outras extensões
      try {
        if (!this.isFirebaseUnavailable()) {
          const videoRef = ref(storage, `videos/content/${videoId}.webm`);
          const videoUrl = await getDownloadURL(videoRef);
          return videoUrl;
        }
      } catch (error2) {
        // Ignorar erro
      }
      if (import.meta.env.DEV) {
        console.warn(`Vídeo ${videoId} não encontrado no storage`);
      }
      return "#";
    }
  }

  /**
   * Busca thumbnail padrão
   */
  private async getDefaultThumbnail(): Promise<string> {
    try {
      if (!this.isFirebaseUnavailable()) {
        const defaultRef = ref(storage, "videos/thumbnails/default.jpg");
        return await getDownloadURL(defaultRef);
      }
    } catch (error) {
      // Ignorar erro e usar fallback
    }
    // Retornar uma imagem padrão se não houver no storage
    return "https://images.pexels.com/photos/3822583/pexels-photo-3822583.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop";
  }

  /**
   * Lista todos os arquivos de vídeo no Storage
   */
  async listStorageVideos(): Promise<string[]> {
    try {
      if (this.isFirebaseUnavailable()) {
        return [];
      }

      const videosRef = ref(storage, "videos/content");
      const result = await listAll(videosRef);

      const videoNames: string[] = [];
      for (const itemRef of result.items) {
        const metadata = await getMetadata(itemRef);
        videoNames.push(itemRef.name);
      }

      return videoNames;
    } catch (error) {
      console.warn("Erro ao listar vídeos do storage:", error);
      this.firebaseUnavailable = true;
      return [];
    }
  }

  /**
   * Vídeos de fallback quando não há conexão com Firebase
   */
  private getFallbackVideos(): Video[] {
    return [
      {
        id: "yoga-matinal",
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
        videoUrl: "#",
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
        videoUrl: "#",
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
        videoUrl: "#",
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
        videoUrl: "#",
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
        videoUrl: "#",
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
        videoCount: 15,
      },
      {
        id: "cardio",
        name: "Cardio",
        description: "Treinos cardiovasculares para queimar calorias",
        thumbnail:
          "https://images.pexels.com/photos/416809/pexels-photo-416809.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        videoCount: 12,
      },
      {
        id: "nutricao",
        name: "Nutrição",
        description: "Dicas e conhecimentos sobre alimentação saudável",
        thumbnail:
          "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        videoCount: 8,
      },
      {
        id: "bem-estar",
        name: "Bem-estar",
        description: "Conteúdo para cuidar da mente e do corpo",
        thumbnail:
          "https://images.pexels.com/photos/3822622/pexels-photo-3822622.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        videoCount: 10,
      },
      {
        id: "pilates",
        name: "Pilates",
        description: "Exercícios de pilates para fortalecimento",
        thumbnail:
          "https://images.pexels.com/photos/3822864/pexels-photo-3822864.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
        videoCount: 7,
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
    this.firebaseUnavailable = false;
  }

  /**
   * Redefine status do Firebase para tentar reconectar
   */
  resetFirebaseStatus(): void {
    this.firebaseUnavailable = false;
  }
}

// Instância singleton
export const videoService = new VideoService();

// Função utilitária para buscar vídeos
export const getVideos = () => videoService.getAllVideos();
export const getVideo = (id: string) => videoService.getVideoById(id);
export const getVideosByCategory = (category: string) =>
  videoService.getVideosByCategory(category);
export const getVideoCategories = () => videoService.getVideoCategories();
