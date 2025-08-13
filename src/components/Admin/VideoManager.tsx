import React, { useState, useRef } from "react";
import {
  Upload,
  Video,
  Image,
  Save,
  Trash2,
  Eye,
  Loader2,
  CheckCircle,
  AlertCircle,
  Plus,
} from "lucide-react";
import { VideoMetadata } from "../../services/googleCloud";
import { isSupabaseDemoMode } from "../../lib/supabase";

interface VideoUploadData {
  title: string;
  description: string;
  category: string;
  instructor: string;
  isFree: boolean;
  tags: string[];
}

const VideoManager: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [videos, setVideos] = useState<VideoMetadata[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<VideoMetadata | null>(
    null,
  );
  const [uploadData, setUploadData] = useState<VideoUploadData>({
    title: "",
    description: "",
    category: "Treino",
    instructor: "",
    isFree: false,
    tags: [],
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tagInput, setTagInput] = useState("");

  const categories = [
    "Treino",
    "Nutrição",
    "Mindfulness",
    "Yoga",
    "Performance",
  ];

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar arquivo
    if (!file.type.startsWith("video/")) {
      alert("Por favor, selecione um arquivo de vídeo válido.");
      return;
    }

    // Validar tamanho (limite de 2GB para exemplo)
    if (file.size > 2 * 1024 * 1024 * 1024) {
      alert("Arquivo muito grande. Limite máximo: 2GB");
      return;
    }

    simulateUpload(file);
  };

  const simulateUpload = async (file: File) => {
    if (!uploadData.title) {
      alert("Por favor, preencha o título do vídeo.");
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    // Simular upload com progresso
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 95) {
          clearInterval(interval);
          return 95;
        }
        return prev + Math.random() * 10;
      });
    }, 500);

    // Simular processamento após upload
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      // Adicionar vídeo simulado à lista
      const newVideo: VideoMetadata = {
        id: `video-${Date.now()}`,
        title: uploadData.title,
        description: uploadData.description,
        category: uploadData.category,
        instructor: uploadData.instructor,
        isFree: uploadData.isFree,
        tags: uploadData.tags,
        duration: Math.floor(Math.random() * 3600) + 300, // 5-65 minutos
        thumbnail: `https://picsum.photos/400/225?random=${Date.now()}`,
        videoUrl: `https://storage.googleapis.com/meu-auge-videos/videos/video-${Date.now()}/720p.mp4`,
        uploadDate: new Date().toISOString(),
        resolution: "1080p",
        size: file.size,
      };

      setVideos((prev) => [newVideo, ...prev]);

      // Reset form
      setUploadData({
        title: "",
        description: "",
        category: "Treino",
        instructor: "",
        isFree: false,
        tags: [],
      });

      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
    }, 3000);
  };

  const addTag = () => {
    if (tagInput.trim() && !uploadData.tags.includes(tagInput.trim())) {
      setUploadData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim().toLowerCase()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setUploadData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const deleteVideo = (videoId: string) => {
    if (confirm("Tem certeza que deseja excluir este vídeo?")) {
      setVideos((prev) => prev.filter((v) => v.id !== videoId));
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Gerenciar Vídeos</h2>
          <p className="text-slate-400 mt-1">
            {isDemoMode && (
              <span className="inline-flex items-center px-2 py-1 bg-blue-900/20 text-blue-300 rounded-full text-sm mr-3">
                🔧 Modo Demo - Upload simulado
              </span>
            )}
            Upload e gerenciamento de conteúdo de vídeo
          </p>
        </div>
        <div className="text-sm text-slate-400">
          Total: {videos.length} vídeos
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-slate-800 rounded-xl p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-6 flex items-center">
          <Upload className="w-5 h-5 mr-2" />
          Novo Vídeo
        </h3>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Título *
              </label>
              <input
                type="text"
                value={uploadData.title}
                onChange={(e) =>
                  setUploadData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Título do vídeo"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Descrição
              </label>
              <textarea
                value={uploadData.description}
                onChange={(e) =>
                  setUploadData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Descrição do conteúdo"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Categoria
                </label>
                <select
                  value={uploadData.category}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Instrutor
                </label>
                <input
                  type="text"
                  value={uploadData.instructor}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      instructor: e.target.value,
                    }))
                  }
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Nome do instrutor"
                />
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={uploadData.isFree}
                  onChange={(e) =>
                    setUploadData((prev) => ({
                      ...prev,
                      isFree: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 text-primary bg-slate-900 border-slate-600 rounded focus:ring-primary"
                />
                <span className="text-slate-300">Vídeo gratuito</span>
              </label>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tags
              </label>
              <div className="flex items-center space-x-2 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                  className="flex-1 px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Adicionar tag"
                />
                <button
                  onClick={addTag}
                  className="bg-primary hover:bg-primary-dark text-white px-3 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {uploadData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-slate-700 text-slate-300 px-2 py-1 rounded text-sm flex items-center"
                  >
                    #{tag}
                    <button
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-slate-400 hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Upload Area */}
          <div className="space-y-4">
            <div
              onClick={handleFileSelect}
              className="border-2 border-dashed border-slate-600 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
            >
              <Video className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-white font-medium mb-2">
                Clique para selecionar vídeo
              </p>
              <p className="text-slate-400 text-sm">MP4, MOV, AVI até 2GB</p>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload Progress */}
            {uploading && (
              <div className="bg-slate-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">Enviando...</span>
                  <span className="text-slate-400">
                    {Math.round(uploadProgress)}%
                  </span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                {uploadProgress === 100 && (
                  <div className="flex items-center text-green-500 mt-2">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Upload concluído!
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Videos List */}
      <div className="bg-slate-800 rounded-xl border border-slate-700">
        <div className="p-6 border-b border-slate-700">
          <h3 className="text-lg font-semibold text-white">
            Vídeos Cadastrados
          </h3>
        </div>

        <div className="divide-y divide-slate-700">
          {videos.length === 0 ? (
            <div className="p-8 text-center">
              <Video className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <p className="text-slate-400">Nenhum vídeo cadastrado ainda</p>
            </div>
          ) : (
            videos.map((video) => (
              <div key={video.id} className="p-6 flex items-center space-x-4">
                <img
                  src={video.thumbnail}
                  alt={video.title}
                  className="w-24 h-14 object-cover rounded-lg"
                />

                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">
                    {video.title}
                  </h4>
                  <div className="flex items-center space-x-4 text-sm text-slate-400 mt-1">
                    <span>{video.category}</span>
                    <span>•</span>
                    <span>{video.instructor}</span>
                    <span>•</span>
                    <span>{Math.floor(video.duration / 60)} min</span>
                    {video.isFree && (
                      <>
                        <span>•</span>
                        <span className="text-green-400">Gratuito</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setSelectedVideo(video)}
                    className="p-2 text-slate-400 hover:text-white transition-colors"
                    title="Visualizar"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteVideo(video.id)}
                    className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                    title="Excluir"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de Preview */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-slate-800 rounded-xl max-w-2xl w-full">
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">
                Preview do Vídeo
              </h3>
              <button
                onClick={() => setSelectedVideo(null)}
                className="text-slate-400 hover:text-white"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <img
                src={selectedVideo.thumbnail}
                alt={selectedVideo.title}
                className="w-full h-48 object-cover rounded-lg mb-4"
              />
              <h4 className="text-white font-medium mb-2">
                {selectedVideo.title}
              </h4>
              <p className="text-slate-300 text-sm mb-4">
                {selectedVideo.description}
              </p>
              <div className="flex items-center space-x-4 text-sm text-slate-400">
                <span>{selectedVideo.category}</span>
                <span>•</span>
                <span>{selectedVideo.instructor}</span>
                <span>•</span>
                <span>{Math.floor(selectedVideo.duration / 60)} min</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoManager;
