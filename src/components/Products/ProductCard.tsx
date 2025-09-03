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
    <div className={`
      group cursor-pointer overflow-hidden rounded-lg sm:rounded-xl
      ${designUtils.glass('dark')}
      hover:scale-[1.02] sm:hover:scale-105 transition-all duration-300 
      hover:shadow-xl hover:shadow-primary/10
      ${COMMON_CLASSES.focus}
    `}>
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <LazyImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
          loading="lazy"
          width={300}
          height={300}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Discount Badge */}
        {product.discount && (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3">
            <div className={`
              px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-bold
              ${designUtils.gradient('sunset')}
              text-white shadow-lg
            `}>
              -{product.discount}%
            </div>
          </div>
        )}

        {/* Category Badge */}
        <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
          <div className={`
            flex items-center gap-1 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full text-xs font-medium
            ${designUtils.glass('primary')}
            text-primary-200
          `}>
            {getCategoryIcon(product.category)}
            {product.category}
          </div>
        </div>

        {/* Favorite Button */}
        <button
          onClick={toggleFavorite}
          className={`
            absolute bottom-2 right-2 sm:bottom-3 sm:right-3 p-1.5 sm:p-2 rounded-full transition-all duration-200
            ${designUtils.glass('dark')}
            hover:scale-110 ${COMMON_CLASSES.focus}
            ${isFavorite ? 'text-red-400' : 'text-white/70 hover:text-white'}
          `}
          aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
        >
          <Heart className={`w-3 h-3 sm:w-4 sm:h-4 ${isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add to Cart */}
        <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
          <button
            onClick={handleAddToCart}
            className={`
              p-1.5 sm:p-2 rounded-full transition-all duration-200
              ${designUtils.gradient('primary')}
              text-white shadow-lg hover:scale-110
              ${COMMON_CLASSES.focus}
            `}
            aria-label="Adicionar ao carrinho"
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-4">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-2">
          <div className="flex items-center gap-0.5">
            {renderStars(product.rating)}
          </div>
          <span className="text-gray-400 text-xs truncate">
            ({product.reviews} avaliações)
          </span>
        </div>

        {/* Product Name */}
        <h3 className={`
          font-semibold text-white line-clamp-2 mb-2
          ${COMMON_CLASSES.heading.h4}
          text-sm
        `}>
          {product.name}
        </h3>

        {/* Product Description */}
        <p className="text-gray-400 text-xs line-clamp-2 mb-3">
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
            <span className={`
              font-bold text-base sm:text-lg
              ${designUtils.gradient('primary')}
              bg-clip-text text-transparent
            `}>
              R$ {product.price.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {product.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="px-1.5 py-0.5 bg-gray-700/50 text-gray-300 text-xs rounded-md"
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
            className={`
              flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm font-medium
              bg-white/10 hover:bg-white/20 text-white border border-white/20
              transition-all duration-200 hover:scale-[1.02] sm:hover:scale-105
              ${COMMON_CLASSES.focus}
            `}
          >
            <span className="hidden sm:inline">Ver Detalhes</span>
            <span className="sm:hidden">Ver</span>
          </button>
          <button
            onClick={handleAddToCart}
            className={`
              px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium
              ${designUtils.gradient('primary')}
              text-white shadow-md hover:shadow-lg
              transition-all duration-200 hover:scale-[1.02] sm:hover:scale-105
              ${COMMON_CLASSES.focus}
            `}
          >
            <ShoppingCart className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>

        {/* Stock Status */}
        {product.stock !== undefined && (
          <div className="mt-3">
            <div className={`
              text-xs font-medium
              ${product.stock > 10 
                ? 'text-success-400' 
                : product.stock > 0 
                  ? 'text-warning-400' 
                  : 'text-error-400'
              }
            `}>
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
