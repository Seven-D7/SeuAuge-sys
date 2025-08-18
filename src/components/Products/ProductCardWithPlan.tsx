import React from 'react';
import { ShoppingCart, Star, Percent, Crown } from 'lucide-react';
import { ProductWithPlan, getDiscountByPlan } from '../../types/content';
import { usePlanAccess } from '../../hooks/usePlanAccess';
import { useCartStore } from '../../stores/cartStore';
import PlanBadge from '../Common/PlanBadge';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';

interface ProductCardWithPlanProps {
  product: ProductWithPlan;
}

const ProductCardWithPlan: React.FC<ProductCardWithPlanProps> = ({ product }) => {
  const { userPlan } = usePlanAccess();
  const { addToCart, items } = useCartStore();
  
  const discount = getDiscountByPlan(product.discountByPlan, userPlan);
  const discountedPrice = product.price * (1 - discount / 100);
  const savings = product.price - discountedPrice;
  const isInCart = items.some(item => item.id === product.id);

  const handleAddToCart = () => {
    if (!isInCart) {
      addToCart({
        id: product.id,
        name: product.name,
        price: discountedPrice,
        originalPrice: product.price,
        image: product.image,
        quantity: 1,
        discount: discount,
        planTier: userPlan || 'FREE'
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  return (
    <Card className="group overflow-hidden border border-gray-200 hover:border-primary/30 transition-all duration-300 hover:shadow-lg bg-white">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-red-500 text-white">
              <Percent className="w-3 h-3 mr-1" />
              -{discount}%
            </Badge>
          </div>
        )}

        {/* Plan Badge */}
        {userPlan && userPlan !== 'FREE' && (
          <div className="absolute top-3 right-3">
            <PlanBadge planTier={userPlan} size="sm" />
          </div>
        )}

        {/* Stock Status */}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="bg-gray-800 text-white px-3 py-1 rounded-md text-sm font-medium">
              Esgotado
            </span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <CardContent className="p-4 space-y-3">
        {/* Title and Category */}
        <div>
          <h3 className="font-semibold text-gray-900 line-clamp-2 mb-1">
            {product.name}
          </h3>
          <span className="text-sm text-primary font-medium">
            {product.category}
          </span>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm line-clamp-2">
          {product.description}
        </p>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
          </div>
          <span className="text-gray-500 text-sm">
            ({product.reviewCount} avaliações)
          </span>
        </div>

        {/* Pricing */}
        <div className="space-y-2">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(discountedPrice)}
            </span>
            {discount > 0 && (
              <span className="text-sm text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
            )}
          </div>
          
          {/* Discount Info */}
          {discount > 0 && (
            <div className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-amber-500" />
              <span className="text-sm text-green-600 font-medium">
                Economia de {formatPrice(savings)} ({discount}% off)
              </span>
            </div>
          )}

          {/* Plan Benefits */}
          {userPlan && userPlan !== 'FREE' && (
            <div className="text-xs text-gray-600">
              💎 Desconto exclusivo do {userPlan === 'B' ? 'Plano Base' : userPlan === 'C' ? 'Plano Escalada' : 'Plano Auge'}
            </div>
          )}
        </div>

        {/* Plan Tags */}
        {product.planTags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {product.planTags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Add to Cart Button */}
        <Button
          onClick={handleAddToCart}
          disabled={!product.inStock || isInCart}
          className={`w-full ${
            isInCart 
              ? 'bg-green-600 hover:bg-green-700 text-white' 
              : 'bg-primary hover:bg-primary-dark text-white'
          }`}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {!product.inStock 
            ? 'Indisponível' 
            : isInCart 
              ? 'Adicionado ao Carrinho' 
              : 'Adicionar ao Carrinho'
          }
        </Button>

        {/* Discount Tiers Preview */}
        {!userPlan || userPlan === 'FREE' ? (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-3">
            <h4 className="text-sm font-semibold text-amber-800 mb-2">
              🎁 Descontos exclusivos por plano:
            </h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span>Plano Base:</span>
                <span className="font-medium">{product.discountByPlan.B}% off</span>
              </div>
              <div className="flex justify-between">
                <span>Plano Escalada:</span>
                <span className="font-medium">{product.discountByPlan.C}% off</span>
              </div>
              <div className="flex justify-between">
                <span>Plano Auge:</span>
                <span className="font-medium text-amber-700">{product.discountByPlan.D}% off</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Button
              variant="outline"
              size="sm"
              className="text-xs border-primary text-primary hover:bg-primary/5"
              onClick={() => window.location.href = '/payment'}
            >
              <Crown className="w-3 h-3 mr-1" />
              Upgrade para mais desconto
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductCardWithPlan;
