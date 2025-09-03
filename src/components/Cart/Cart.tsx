import React from 'react';
import { X, Plus, Minus, ShoppingBag, CreditCard, Smartphone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../../stores/cartStore';

const Cart: React.FC = () => {
  const {
    items,
    isOpen,
    toggleCart,
    removeItem,
    updateQuantity,
    getTotalPrice,
    clearCart
  } = useCartStore();

  const navigate = useNavigate();

  const totalPrice = getTotalPrice();

  const handleCheckout = () => {
    toggleCart();
    navigate('/payment');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={toggleCart}
      />
      
      {/* Cart sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 max-w-[90vw] bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white border-l border-slate-200 dark:border-slate-800 z-50 transform transition-transform duration-300 ease-in-out safe-area-inset overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-slate-200 dark:border-slate-800 safe-area-inset-top">
          <h2 className="text-base sm:text-lg font-semibold truncate flex-1 mr-2">Carrinho de Compras</h2>
          <button
            onClick={toggleCart}
            className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center flex-shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 safe-area-inset-x">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <ShoppingBag className="w-16 h-16 text-slate-600 mb-4" />
              <p className="text-slate-400 mb-2 break-words">Seu carrinho está vazio</p>
              <p className="text-sm text-slate-500 break-words text-center px-4">Adicione alguns produtos de saúde para começar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-3 sm:space-x-4 bg-slate-200 dark:bg-slate-800 rounded-lg p-3 sm:p-4 overflow-hidden">
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-lg flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 dark:text-white mb-1 text-sm sm:text-base break-words overflow-hidden leading-tight" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.product.name}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mb-2">R$ {item.product.price.toFixed(2).replace('.', ',')}</p>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-700 rounded min-w-[32px] min-h-[32px] flex items-center justify-center"
                      >
                        <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>

                      <span className="px-2 text-sm min-w-[24px] text-center">{item.quantity}</span>

                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-300 dark:hover:bg-slate-700 rounded min-w-[32px] min-h-[32px] flex items-center justify-center"
                      >
                        <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-slate-300 dark:hover:bg-slate-700 rounded-lg transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center flex-shrink-0"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-slate-200 dark:border-slate-800 p-4 sm:p-6 safe-area-inset-bottom">
            <div className="flex justify-between items-center mb-4">
              <span className="text-base sm:text-lg font-semibold truncate">Total:</span>
              <span className="text-base sm:text-lg font-bold text-primary dark:text-primary flex-shrink-0">R$ {totalPrice.toFixed(2).replace('.', ',')}</span>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleCheckout}
                className="w-full bg-gradient-to-r from-primary to-emerald-600 hover:from-primary-dark hover:to-emerald-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base min-h-[48px]"
              >
                <CreditCard className="w-4 h-4" />
                <span className="truncate">Finalizar Compra</span>
              </button>

              <div className="grid grid-cols-3 gap-2">
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-2 rounded-lg transition-colors text-xs sm:text-sm flex items-center justify-center space-x-1 min-h-[40px]">
                  <Smartphone className="w-3 h-3" />
                  <span>PIX</span>
                </button>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-2 rounded-lg transition-colors text-xs sm:text-sm min-h-[40px] flex items-center justify-center">
                  Cartão
                </button>
                <button className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-2 rounded-lg transition-colors text-xs sm:text-sm min-h-[40px] flex items-center justify-center">
                  Boleto
                </button>
              </div>

              <button
                onClick={clearCart}
                className="w-full bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium py-3 px-4 rounded-lg transition-colors text-sm sm:text-base min-h-[48px] flex items-center justify-center"
              >
                <span className="truncate">Limpar Carrinho</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Cart;
