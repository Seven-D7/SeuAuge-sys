import React from 'react';
import { X, ShoppingCart } from 'lucide-react';
import { Product, useCartStore } from '../../stores/cartStore';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  const { addItem } = useCartStore();

  const handleAdd = () => {
    addItem(product);
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="relative bg-slate-900 text-white w-full max-w-md rounded-xl overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-700"
          >
            <X className="w-5 h-5" />
          </button>
          <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
          <div className="p-6 space-y-4">
            <h2 className="text-2xl font-bold">{product.name}</h2>
            <p className="text-slate-300 text-sm">{product.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold text-primary">R$ {product.price.toFixed(2).replace('.', ',')}</span>
              <button
                onClick={handleAdd}
                className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Adicionar</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductModal;
