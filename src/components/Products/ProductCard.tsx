import React from 'react';
import { ShoppingCart, Heart, Star, Zap, Leaf } from 'lucide-react';
import { Product, useCartStore } from '../../stores/cartStore';
import { useFavoritesStore } from '../../stores/favoritesStore';
import { designUtils, COMMON_CLASSES } from '../../lib/design-system';
import LazyImage from '../ui/LazyImage';

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
        className={`w-3 h-3 sm:w-4 sm:h-4 ${
          i < rating 
            ? 'text-yellow-400 fill-current' 
            : 'text-gray-600'
        }`} 
      />
    ));
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'suplementos':
        return <Zap className="w-3 h-3" />;
      case 'naturais':
        return <Leaf className="w-3 h-3" />;
      default:
        return null;
    }
  };

  return (
    <div className="group cursor-pointer overflow-hidden rounded-lg sm:rounded-xl bg-slate-800 border border-slate-700 hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 focus:outline-none focus:ring-2 focus:ring-primary w-full max-w-full">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <div className="px-2 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg">
              -{product.discount}%
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-primary/20 text-primary border border-primary/30 max-w-[100px]">
            {getCategoryIcon(product.category)}
            <span className="truncate">{product.category}</span>
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-2 rounded-full transition-all duration-200 bg-black/60 hover:bg-black/80 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary min-w-[32px] min-h-[32px] flex items-center justify-center ${
            isFavorite ? 'text-red-400' : 'text-white/70 hover:text-white'
          }`}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            className="p-2 rounded-full transition-all duration-200 bg-gradient-to-r from-primary to-emerald-500 text-white shadow-lg hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary min-w-[32px] min-h-[32px] flex items-center justify-center"
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4 overflow-hidden">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            {renderStars(product.rating)}
          </div>
          <span className="text-gray-400 text-xs truncate flex-shrink-0">
            ({product.reviews} avaliações)
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-white text-sm mb-2 break-words overflow-hidden leading-tight" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-gray-400 text-xs mb-3 break-words overflow-hidden leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
          {product.description}
        </p>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {product.originalPrice && (
              <span className="text-gray-500 text-sm line-through">
                R$ {product.originalPrice.toFixed(2)}
              </span>
            )}
            <span className="font-bold text-base sm:text-lg bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
              R$ {product.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4 overflow-hidden">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded-md truncate max-w-[80px]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => onSelect?.(product)}
            className="flex-1 py-2 px-3 rounded-lg text-xs sm:text-sm font-medium bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary min-h-[36px] flex items-center justify-center"
          >
            <span className="text-white truncate">Ver Detalhes</span>
          </button>
          <button
            onClick={handleAddToCart}
            className="px-4 py-2 rounded-lg text-xs sm:text-sm font-medium bg-gradient-to-r from-primary to-emerald-500 text-white shadow-md hover:shadow-lg transition-all duration-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-primary min-h-[36px] min-w-[44px] flex items-center justify-center"
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="mt-3">
            <div className={`text-xs font-medium truncate ${
              product.stock > 10 
                ? 'text-green-400' 
                : product.stock > 0 
                  ? 'text-yellow-400' 
                  : 'text-red-400'
            }`}>
              {product.stock > 0 
                ? `${product.stock} em estoque`
                : 'Fora de estoque'
              }
            </div>
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-lg sm:rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute inset-0 rounded-lg sm:rounded-xl shadow-lg shadow-primary/20"></div>
      </div>
    </div>
  );
};

export default ProductCard;
