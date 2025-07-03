// Store que gerencia o carrinho de compras
import { create } from 'zustand';

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
  showAddedAnimation: boolean;
  setShowAddedAnimation: (show: boolean) => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isOpen: false,
  showAddedAnimation: false,
  
  addItem: (product: Product) => {
    set((state) => {
      const existingItem = state.items.find((item) => item.product.id === product.id);
      if (existingItem) {
        return {
          items: state.items.map((item) =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
          showAddedAnimation: true,
        };
      }
      return {
        items: [...state.items, { product, quantity: 1 }],
        showAddedAnimation: true,
      };
    });
    console.log('Produto adicionado ao carrinho', product.name);
    
    // Remove a animação após 2 segundos
    setTimeout(() => {
      set({ showAddedAnimation: false });
    }, 2000);
  },
  
  removeItem: (productId: string) =>
    set((state) => ({
      items: state.items.filter((item) => item.product.id !== productId),
    })),
  
  updateQuantity: (productId: string, quantity: number) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      ),
    })),
  
  clearCart: () => set({ items: [] }),
  
  toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
  
  getTotalPrice: () =>
    get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),
  
  getTotalItems: () =>
    get().items.reduce((total, item) => total + item.quantity, 0),

  setShowAddedAnimation: (show: boolean) => set({ showAddedAnimation: show }),
}));