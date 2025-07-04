import React from 'react';
import { ShoppingCart, Heart, Star } from 'lucide-react';
import { Product, useCartStore } from '../../stores/cartStore';
import { useFavoritesStore } from '../../stores/favoritesStore';

interface ProductCardProps {
  product: Product;
  onSelect?: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { addItem } = useCartStore();
  const { isProductFavorite, addProductToFavorites, removeProductFromFavorites } = useFavoritesStore();
  const isFavorite = isProductFavorite(product.id);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      removeProductFromFavorites(product.id);
    } else {
      addProductToFavorites(product);
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`w-4 h-4 ${i < rating ? 'text-yellow-500 fill-current' : 'text-slate-600'}`} 
      />
    ));
  };

  return (
    <div
      className="group cursor-pointer bg-slate-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10"
      onClick={() => onSelect?.(product)}
    >
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        
        {/* Favorite button */}
        <button
          onClick={toggleFavorite}
          className="absolute top-3 right-3 p-2 bg-black bg-opacity-50 hover:bg-opacity-70 rounded-full transition-all duration-200"
        >
          <Heart 
            className={`w-4 h-4 ${isFavorite ? 'text-red-500 fill-current' : 'text-white'}`} 
          />
        </button>

        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="bg-emerald-600 text-white px-2 py-1 rounded-full text-xs font-medium">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-white mb-2 line-clamp-2">{product.name}</h3>
        <p className="text-sm text-slate-400 mb-3 line-clamp-2">{product.description}</p>
        
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex items-center mr-2">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-slate-400">({product.rating})</span>
        </div>

        {/* Price and action */}
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</span>
          <button
            onClick={handleAddToCart}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;