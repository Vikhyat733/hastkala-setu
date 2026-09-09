import React, { useState, useEffect } from 'react';
import {
  Package,
  Plus,
  Sparkles,
  CheckCircle2,
  ArrowLeft,
  RefreshCw,
  ShoppingBag,
  Tag,
  Edit3,
  Trash2,
  Eye,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import { productService, ProductItem } from '../../../services/products/productService';
import { useMela } from '../../../context/MelaContext';
import { AppHeader } from '../../../core/design-system/AppHeader';
import { PrimaryButton } from '../../../core/design-system/PrimaryButton';

export const MyProductsScreen: React.FC = () => {
  const { t, selectedLanguage, navigate } = useMela();
  const lang = selectedLanguage as 'hi' | 'en';

  const [products, setProducts] = useState<ProductItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Edit Modal State
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    category: string;
    material: string;
    price: number;
    stock: number;
    description: string;
  }>({
    title: '',
    category: '',
    material: '',
    price: 0,
    stock: 1,
    description: '',
  });
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const list = await productService.getProducts();
      setProducts(list);
    } catch {
      // fallback handled in service
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpenEdit = (item: ProductItem) => {
    setEditingProduct(item);
    setEditForm({
      title: item.title,
      category: item.category || '',
      material: item.material || '',
      price: item.price || 0,
      stock: item.stock !== undefined ? item.stock : 1,
      description: item.description_hindi || item.description || item.description_english || '',
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    setIsSaving(true);
    try {
      const updated = await productService.updateProduct(editingProduct.id, {
        title: editForm.title,
        category: editForm.category,
        material: editForm.material,
        price: Number(editForm.price),
        stock: Number(editForm.stock),
        description: editForm.description,
        description_hindi: editForm.description,
      });

      if (updated) {
        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updated } : p))
        );
      }
      setEditingProduct(null);
    } catch (err) {
      console.warn('Failed to save manual edits:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between pb-12">
      {/* Top Header with Standard Back Button */}
      <AppHeader
        title={t.myProducts.title}
        subtitle="MELA Artisan Hub"
        onBack={() => navigate('/dashboard')}
        showLanguageToggle={true}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 space-y-5 pb-20 md:pb-6">
        {/* Title and Sell Action */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-[#261D1A]">
              {t.myProducts.title}
            </h2>
            <p className="text-xs text-[#6B5E59]">
              {t.myProducts.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate('/sell')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl bg-[#C04B27] text-white text-xs font-black shadow-md hover:bg-[#A93E1E] active:scale-95 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.myProducts.addNew}</span>
          </button>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="p-10 text-center space-y-3 bg-white rounded-3xl border border-[#E0D8CE] shadow-2xs">
            <RefreshCw className="w-8 h-8 text-[#C04B27] animate-spin mx-auto" />
            <p className="text-xs font-bold text-[#6B5E59]">
              {lang === 'hi' ? 'सामान लोड हो रहा है...' : 'Loading your products...'}
            </p>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="p-8 text-center bg-white rounded-3xl border-2 border-dashed border-[#E0D8CE] space-y-4">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-[#C04B27] mx-auto flex items-center justify-center text-3xl">
              📦
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-black text-[#261D1A]">{t.myProducts.emptyTitle}</h3>
              <p className="text-xs text-[#6B5E59] max-w-xs mx-auto">{t.myProducts.emptyDesc}</p>
            </div>
            <div className="pt-2">
              <PrimaryButton onClick={() => navigate('/sell')}>
                {t.myProducts.addNew}
              </PrimaryButton>
            </div>
          </div>
        ) : (
          /* Products List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-5">
            {products.map((item) => {
              const isOutOfStock = (item.stock || 0) <= 0;
              const isDraft = item.status === 'draft';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl p-4 border border-[#E0D8CE] shadow-xs flex flex-col gap-3.5 hover:shadow-md transition-shadow h-full"
                >
                  <div className="flex flex-col gap-3.5 items-center">
                    {/* Product Thumbnail */}
                    <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-stone-100 flex-shrink-0 border border-[#EAE2D5]">
                      <img
                        src={item.enhanced_image_url || item.image_url || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=300'}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 left-2">
                        <span className="p-1 rounded-full bg-[#1B4D3E] text-white block">
                          <Sparkles className="w-3 h-3 text-amber-300" />
                        </span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 w-full flex flex-col justify-between min-w-0 space-y-1">
                      <div className="flex items-center gap-1.5 justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C04B27] truncate">
                          {item.category || 'हस्तशिल्प'}
                        </span>

                        {/* Status Badge */}
                        {isOutOfStock ? (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-red-100 text-red-800">
                            {lang === 'hi' ? 'स्टॉक समाप्त' : 'Out of Stock'}
                          </span>
                        ) : isDraft ? (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                            {lang === 'hi' ? 'ड्राफ्ट' : 'Draft'}
                          </span>
                        ) : (
                          <span className="text-[9px] font-black px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800 flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            {lang === 'hi' ? 'लाइव बाज़ार' : 'Published'}
                          </span>
                        )}
                      </div>

                      <h4 className="text-sm font-black text-[#261D1A] truncate leading-tight mt-1">
                        {item.title}
                      </h4>

                      <div className="flex items-center justify-between pt-2">
                        <span className="text-lg font-black text-[#1B4D3E]">
                          ₹{item.price}
                        </span>
                        <span className="text-[11px] font-bold text-[#6B5E59]">
                          {lang === 'hi' ? `स्टॉक: ${item.stock || 1}` : `Stock: ${item.stock || 1}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar: View in Market & Edit */}
                  <div className="flex gap-2 pt-2 border-t border-[#F0EBE1] mt-auto">
                    <button
                      type="button"
                      onClick={() => navigate('/marketplace')}
                      className="flex-1 py-2 px-3 rounded-xl border border-[#E0D8CE] bg-[#FAF6F0] text-[#1B4D3E] text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-stone-100 active:scale-95 transition-all cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'बाज़ार' : 'Market'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="flex-1 py-2 px-3 rounded-xl bg-[#1B4D3E] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-2xs hover:bg-[#143d31] active:scale-95 transition-all cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{lang === 'hi' ? 'बदलें (Edit)' : 'Edit'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ── ARTISAN PRODUCT EDIT MODAL ── */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-4 animate-in fade-in">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 border-2 border-[#1B4D3E] shadow-2xl space-y-4 animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-[#1B4D3E] flex items-center gap-1.5">
                <Edit3 className="w-4 h-4 text-[#C04B27]" />
                {lang === 'hi' ? 'सामान का विवरण बदलें' : 'Edit Product Listing'}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-xl text-stone-500 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3.5 text-left text-xs">
              {/* Title */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] mb-1">
                  {lang === 'hi' ? 'उत्पाद का नाम (Title):' : 'Product Title:'}
                </label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  required
                  className="w-full p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] font-bold text-sm text-[#261D1A] focus:border-[#C04B27] focus:outline-hidden"
                />
              </div>

              {/* Price & Stock Grid */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] mb-1">
                    {lang === 'hi' ? 'मूल्य (₹):' : 'Price (₹):'}
                  </label>
                  <input
                    type="number"
                    value={editForm.price}
                    onChange={(e) => setEditForm({ ...editForm, price: Number(e.target.value) })}
                    min="10"
                    required
                    className="w-full p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] font-black text-sm text-[#1B4D3E] focus:border-[#C04B27] focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] mb-1">
                    {lang === 'hi' ? 'उपलब्ध स्टॉक:' : 'Stock Quantity:'}
                  </label>
                  <input
                    type="number"
                    value={editForm.stock}
                    onChange={(e) => setEditForm({ ...editForm, stock: Number(e.target.value) })}
                    min="0"
                    required
                    className="w-full p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] font-black text-sm text-[#261D1A] focus:border-[#C04B27] focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] mb-1">
                  {lang === 'hi' ? 'श्रेणी (Category):' : 'Category:'}
                </label>
                <input
                  type="text"
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] font-semibold text-xs text-[#261D1A] focus:border-[#C04B27] focus:outline-hidden"
                />
              </div>

              {/* Material */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] mb-1">
                  {lang === 'hi' ? 'सामग्री (Material):' : 'Material:'}
                </label>
                <input
                  type="text"
                  value={editForm.material}
                  onChange={(e) => setEditForm({ ...editForm, material: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] font-semibold text-xs text-[#261D1A] focus:border-[#C04B27] focus:outline-hidden"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6B5E59] mb-1">
                  {lang === 'hi' ? 'विवरण (Description):' : 'Description:'}
                </label>
                <textarea
                  rows={3}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-[#FAF6F0] border border-[#E0D8CE] font-medium text-xs text-[#261D1A] focus:border-[#C04B27] focus:outline-hidden resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E0D8CE] font-bold text-xs text-[#6B5E59]"
                >
                  {lang === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-2.5 rounded-xl bg-[#1B4D3E] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:bg-[#143d31]"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                  <span>{lang === 'hi' ? 'सहेजें (Save)' : 'Save Changes'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
