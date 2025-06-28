import { create } from 'zustand';

export interface Video {
  id: string;
  title: string;
  duration: string;
  category: string;
  isFree: boolean;
  videoUrl: string;
  thumbnail: string;
  description: string;
  instructor: string;
}

interface FavoritesStore {
  favoriteVideos: Video[];
  favoriteProducts: any[];
  addVideoToFavorites: (video: Video) => void;
  removeVideoFromFavorites: (videoId: string) => void;
  addProductToFavorites: (product: any) => void;
  removeProductFromFavorites: (productId: string) => void;
  isVideoFavorite: (videoId: string) => boolean;
  isProductFavorite: (productId: string) => boolean;
}

export const useFavoritesStore = create<FavoritesStore>((set, get) => ({
  favoriteVideos: [],
  favoriteProducts: [],
  
  addVideoToFavorites: (video: Video) =>
    set((state) => ({
      favoriteVideos: [...state.favoriteVideos, video],
    })),
  
  removeVideoFromFavorites: (videoId: string) =>
    set((state) => ({
      favoriteVideos: state.favoriteVideos.filter((video) => video.id !== videoId),
    })),
  
  addProductToFavorites: (product: any) =>
    set((state) => ({
      favoriteProducts: [...state.favoriteProducts, product],
    })),
  
  removeProductFromFavorites: (productId: string) =>
    set((state) => ({
      favoriteProducts: state.favoriteProducts.filter((product) => product.id !== productId),
    })),
  
  isVideoFavorite: (videoId: string) =>
    get().favoriteVideos.some((video) => video.id === videoId),
  
  isProductFavorite: (productId: string) =>
    get().favoriteProducts.some((product) => product.id === productId),
}));