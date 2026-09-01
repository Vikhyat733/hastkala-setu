import React from 'react';
import { useMarketplace } from '../context/MarketplaceContext';
import { PackageCheck, Truck, Clock, CheckCircle2, ArrowLeft, Printer } from 'lucide-react';

export const MyOrdersView: React.FC = () => {
  const { recentOrders, formatPrice, setCurrentView } = useMarketplace();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 animate-in fade-in duration-300">
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('marketplace')}
            className="p-2 rounded-xl border border-artisan-terracotta/20 hover:bg-artisan-sand text-artisan-indigo"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="font-serif font-bold text-2xl text-artisan-indigo">
              My Orders & Receipts
            </h2>
            <p className="text-xs text-artisan-slate/70">
              Track your handcrafted heritage deliveries and artisan guild contributions
            </p>
          </div>
        </div>
      </div>

      {recentOrders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-artisan-terracotta/20 space-y-4 shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-artisan-sand flex items-center justify-center mx-auto text-artisan-terracotta">
            <PackageCheck className="w-8 h-8" />
          </div>
          <h3 className="font-serif font-bold text-lg text-artisan-indigo">
            No Orders Placed Yet
          </h3>
          <p className="text-xs text-artisan-slate/70 max-w-sm mx-auto">
            Your craft purchases directly fund the livelihood of rural master artisans across 28 states.
          </p>
          <button
            onClick={() => setCurrentView('marketplace')}
            className="px-5 py-2.5 rounded-xl bg-artisan-terracotta text-white font-bold text-xs"
          >
            Explore Handicrafts
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {recentOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl p-6 border border-artisan-terracotta/20 shadow-craft space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between border-b border-artisan-terracotta/10 pb-4 gap-2">
                <div>
                  <span className="text-xs font-mono font-bold text-artisan-terracotta">
                    {order.id}
                  </span>
                  <p className="text-[11px] text-artisan-slate/60">
                    Placed on {new Date(order.orderDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Dispatched via Postal Guild</span>
                  </span>
                  <span className="font-black text-base text-artisan-indigo">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-2">
                {order.items.map((item) => (
                  <div key={item.product.id} className="flex items-center justify-between text-xs py-1">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title.en}
                        className="w-10 h-10 rounded-lg object-cover border border-artisan-terracotta/15"
                      />
                      <div>
                        <p className="font-bold text-artisan-indigo">{item.product.title.en}</p>
                        <p className="text-[10px] text-artisan-slate/60">Qty: {item.quantity} • By {item.product.artisan.name}</p>
                      </div>
                    </div>
                    <span className="font-bold text-artisan-indigo">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <div className="pt-3 border-t border-artisan-terracotta/10 flex flex-wrap items-center justify-between gap-2 text-xs text-artisan-slate/80">
                <div className="flex items-center gap-2">
                  <Truck className="w-4 h-4 text-artisan-terracotta" />
                  <span>Tracking: <strong className="font-mono text-artisan-indigo">{order.trackingNumber}</strong></span>
                </div>

                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1.5 text-xs font-bold text-artisan-indigo hover:text-artisan-terracotta"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Receipt</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
