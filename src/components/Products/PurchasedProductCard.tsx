import React from 'react';
import { ArrowRight } from 'lucide-react';
import type { Product } from '../../stores/cartStore';

interface PurchasedProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
}

const PurchasedProductCard: React.FC<PurchasedProductCardProps> = ({ product, onSelect }) => {
  return (
    <div className="group bg-slate-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 hover:shadow-xl hover:shadow-teal-500/10">
      <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4 flex flex-col space-y-3">
        <h3 className="font-semibold text-white line-clamp-2">{product.name}</h3>
        <button
          onClick={() => onSelect(product)}
          className="mt-auto inline-flex items-center justify-center bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
        >
          Acessar
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </div>
  );
};

export default PurchasedProductCard;
