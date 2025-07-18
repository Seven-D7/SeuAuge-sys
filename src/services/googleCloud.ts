// Serviço para integração com Google Cloud Storage para vídeos
interface GoogleCloudConfig {
  bucketName: string;
  projectId: string;
  apiKey: string;
}

interface VideoMetadata {
  id: string;
  title: string;
  description: string;
  duration: number;
  thumbnail: string;
  videoUrl: string;
  category: string;
  instructor: string;
  isFree: boolean;
  tags: string[];
  uploadDate: string;
  resolution: string;
  size: number;
}

interface VideoQuality {
  resolution: string;
  url: string;
  bitrate: number;
}

interface VideoStreamData {
  videoId: string;
  qualities: VideoQuality[];
  thumbnails: string[];
  metadata: VideoMetadata;
}

class GoogleCloudVideoService {
  private config: GoogleCloudConfig;
  private baseUrl: string;

  constructor() {
    this.config = {
      bucketName: import.meta.env.VITE_GCS_BUCKET_NAME || "meu-auge-videos",
      projectId: import.meta.env.VITE_GCS_PROJECT_ID || "",
      apiKey: import.meta.env.VITE_GCS_API_KEY || "",
    };

    this.baseUrl = `https://storage.googleapis.com/${this.config.bucketName}`;

    console.log("🎥 Google Cloud Video Service initialized:", {
      bucket: this.config.bucketName,
      hasApiKey: !!this.config.apiKey,
      hasProjectId: !!this.config.projectId,
    });
  }

  /**
   * Gera URL assinada para streaming seguro de vídeo
   */
  async getSignedVideoUrl(
    videoPath: string,
    expirationMinutes: number = 60,
  ): Promise<string> {
    try {
      // Em produção, isso seria feito no backend por segurança
      if (import.meta.env.DEV || !this.config.apiKey) {
        // Modo desenvolvimento - usar URLs públicas ou mock
        return this.getPublicVideoUrl(videoPath);
      }

      // Implementação real seria no backend usando a biblioteca oficial do Google Cloud
      const response = await fetch("/api/videos/signed-url", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await this.getAuthToken()}`,
        },
        body: JSON.stringify({
          videoPath,
          expirationMinutes,
        }),
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar URL assinada");
      }

      const { signedUrl } = await response.json();
      return signedUrl;
    } catch (error) {
      console.warn("Erro ao gerar URL assinada, usando URL pública:", error);
      return this.getPublicVideoUrl(videoPath);
    }
  }

  /**
   * Gera URL pública para vídeos (desenvolvimento ou vídeos gratuitos)
   */
  getPublicVideoUrl(videoPath: string): string {
    return `${this.baseUrl}/${videoPath}`;
  }

  /**
   * Obtém metadados do vídeo
   */
  async getVideoMetadata(videoId: string): Promise<VideoMetadata | null> {
    try {
      const response = await fetch(`/api/videos/${videoId}/metadata`);
      if (!response.ok) {
        throw new Error("Erro ao buscar metadados");
      }
      return await response.json();
    } catch (error) {
      console.warn("Erro ao buscar metadados, usando dados mock:", error);
      return this.getMockVideoMetadata(videoId);
    }
  }

  /**
   * Obtém dados de streaming com múltiplas qualidades
   */
  async getVideoStreamData(videoId: string): Promise<VideoStreamData | null> {
    try {
      const metadata = await this.getVideoMetadata(videoId);
      if (!metadata) return null;

      // Gerar URLs para diferentes qualidades
      const qualities: VideoQuality[] = [
        {
          resolution: "1080p",
          url: await this.getSignedVideoUrl(`videos/${videoId}/1080p.mp4`),
          bitrate: 5000,
        },
        {
          resolution: "720p",
          url: await this.getSignedVideoUrl(`videos/${videoId}/720p.mp4`),
          bitrate: 3000,
        },
        {
          resolution: "480p",
          url: await this.getSignedVideoUrl(`videos/${videoId}/480p.mp4`),
          bitrate: 1500,
        },
      ];

      // Gerar URLs de thumbnails
      const thumbnails = [
        `${this.baseUrl}/thumbnails/${videoId}/thumb-1.jpg`,
        `${this.baseUrl}/thumbnails/${videoId}/thumb-2.jpg`,
        `${this.baseUrl}/thumbnails/${videoId}/thumb-3.jpg`,
      ];

      return {
        videoId,
        qualities,
        thumbnails,
        metadata,
      };
    } catch (error) {
      console.error("Erro ao obter dados de streaming:", error);
      return null;
    }
  }

  /**
   * Lista vídeos por categoria
   */
  async getVideosByCategory(
    category: string,
    page: number = 1,
    limit: number = 20,
  ): Promise<VideoMetadata[]> {
    try {
      const response = await fetch(
        `/api/videos?category=${category}&page=${page}&limit=${limit}`,
      );
      if (!response.ok) {
        throw new Error("Erro ao buscar vídeos");
      }
      return await response.json();
    } catch (error) {
      console.warn("Erro ao buscar vídeos, usando dados mock:", error);
      return this.getMockVideos(category);
    }
  }

  /**
   * Busca vídeos por termo
   */
  async searchVideos(
    query: string,
    filters?: {
      category?: string;
      instructor?: string;
      duration?: string;
      isFree?: boolean;
    },
  ): Promise<VideoMetadata[]> {
    try {
      const params = new URLSearchParams({
        q: query,
        ...filters,
      });

      const response = await fetch(`/api/videos/search?${params}`);
      if (!response.ok) {
        throw new Error("Erro na busca");
      }
      return await response.json();
    } catch (error) {
      console.warn("Erro na busca, usando dados mock:", error);
      return this.getMockVideos().filter(
        (video) =>
          video.title.toLowerCase().includes(query.toLowerCase()) ||
          video.description.toLowerCase().includes(query.toLowerCase()),
      );
    }
  }

  /**
   * Obtém token de autenticação (seria implementado no backend)
   */
  private async getAuthToken(): Promise<string> {
    // Em produção, isso seria feito no backend
    return "mock-token";
  }

  /**
   * Dados mock para desenvolvimento
   */
  private getMockVideoMetadata(videoId: string): VideoMetadata {
    return {
      id: videoId,
      title: `Treino ${videoId}`,
      description: "Descrição do treino de exemplo",
      duration: 1800, // 30 minutos
      thumbnail: `https://picsum.photos/400/225?random=${videoId}`,
      videoUrl: `${this.baseUrl}/videos/${videoId}/720p.mp4`,
      category: "Treino",
      instructor: "Instrutor Exemplo",
      isFree: videoId === "demo",
      tags: ["fitness", "treino"],
      uploadDate: new Date().toISOString(),
      resolution: "1080p",
      size: 512000000, // 512MB
    };
  }

  /**
   * Vídeos mock para desenvolvimento
   */
  private getMockVideos(category?: string): VideoMetadata[] {
    const categories = ["Treino", "Nutrição", "Mindfulness", "Yoga"];
    const videos: VideoMetadata[] = [];

    for (let i = 1; i <= 10; i++) {
      const videoCategory =
        category || categories[Math.floor(Math.random() * categories.length)];
      videos.push({
        id: `video-${i}`,
        title: `${videoCategory} Completo #${i}`,
        description: `Aula completa de ${videoCategory.toLowerCase()} para todos os níveis`,
        duration: Math.floor(Math.random() * 3600) + 900, // 15-75 minutos
        thumbnail: `https://picsum.photos/400/225?random=${i}`,
        videoUrl: `${this.baseUrl}/videos/video-${i}/720p.mp4`,
        category: videoCategory,
        instructor: ["João Silva", "Maria Santos", "Pedro Costa"][
          Math.floor(Math.random() * 3)
        ],
        isFree: i <= 2, // Primeiros 2 vídeos são gratuitos
        tags: [videoCategory.toLowerCase(), "fitness", "saude"],
        uploadDate: new Date(
          Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        resolution: ["1080p", "720p"][Math.floor(Math.random() * 2)],
        size: Math.floor(Math.random() * 1000000000) + 100000000, // 100MB - 1GB
      });
    }

    return videos;
  }

  /**
   * Upload de vídeo (seria implementado no backend)
   */
  async uploadVideo(
    file: File,
    metadata: Partial<VideoMetadata>,
  ): Promise<string> {
    // Esta função seria implementada no backend por segurança
    console.log("Upload seria feito no backend:", {
      file: file.name,
      metadata,
    });
    return Promise.resolve("video-id-" + Date.now());
  }

  /**
   * Processa vídeo para múltiplas qualidades (backend)
   */
  async processVideoQualities(videoId: string): Promise<boolean> {
    // Processamento seria feito no backend usando FFmpeg
    console.log("Processamento seria feito no backend:", videoId);
    return Promise.resolve(true);
  }

  /**
   * Gera thumbnails automáticos (backend)
   */
  async generateThumbnails(videoId: string): Promise<string[]> {
    // Geração seria feita no backend usando FFmpeg
    console.log("Geração de thumbnails seria feita no backend:", videoId);
    return Promise.resolve([
      `${this.baseUrl}/thumbnails/${videoId}/thumb-1.jpg`,
      `${this.baseUrl}/thumbnails/${videoId}/thumb-2.jpg`,
      `${this.baseUrl}/thumbnails/${videoId}/thumb-3.jpg`,
    ]);
  }
}

// Instância singleton
export const googleCloudVideoService = new GoogleCloudVideoService();

// Funções utilitárias
export const getVideoStreamData = (videoId: string) =>
  googleCloudVideoService.getVideoStreamData(videoId);

export const getVideosByCategory = (
  category: string,
  page?: number,
  limit?: number,
) => googleCloudVideoService.getVideosByCategory(category, page, limit);

export const searchVideos = (query: string, filters?: any) =>
  googleCloudVideoService.searchVideos(query, filters);

export type { VideoMetadata, VideoStreamData, VideoQuality };
