'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Edit3, ImagePlus, Sparkles, CheckCircle2, X } from 'lucide-react';
import { Product } from '@/db/schema';

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [msg, setMsg] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);

  // Form states
  const [title, setTitle] = useState('');
  const [titleBn, setTitleBn] = useState('');
  const [modelNo, setModelNo] = useState('');
  const [brand, setBrand] = useState('Siemens');
  const [category, setCategory] = useState('Industrial Automation');
  const [subCategory, setSubCategory] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('0');
  const [stockStatus, setStockStatus] = useState('In Stock');
  const [originCountry, setOriginCountry] = useState('China');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [primaryImage, setPrimaryImage] = useState('');
  const [specsJson, setSpecsJson] = useState('{}');
  const [isExtracting, setIsExtracting] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      if (Array.isArray(data)) setProducts(data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();
    if (!res.ok || data.error) throw new Error(data.error || 'Upload failed');
    return data.url;
  };

  const handleAiExtract = async () => {
    if (!imageFile && !primaryImage) {
      alert('Upload an image first to extract specs with Gemini AI');
      return;
    }

    setIsExtracting(true);
    try {
      let imageUrl = primaryImage;
      if (imageFile && !primaryImage) {
        imageUrl = await handleImageUpload(imageFile);
        setPrimaryImage(imageUrl);
      }

      const res = await fetch('/api/ai/nameplate-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl })
      });

      const data = await res.json();
      if (data.specs) {
        if (data.specs.brand) setBrand(data.specs.brand);
        if (data.specs.modelNo) setModelNo(data.specs.modelNo);
        if (data.specs.title) setTitle(data.specs.title);
        if (data.specs.description) setDescription(data.specs.description);
        if (data.specs.specs) setSpecsJson(JSON.stringify(data.specs.specs, null, 2));
      }
    } catch (err: any) {
      alert('AI Extraction failed: ' + err.message);
    } finally {
      setIsExtracting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMsg(null);

    try {
      let uploadedUrl = primaryImage;
      if (imageFile) {
        uploadedUrl = await handleImageUpload(imageFile);
      }

      if (!uploadedUrl) {
        throw new Error('Please provide or upload a primary product image');
      }

      const slug = (title || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);

      const res = await fetch('/api/admin/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          title,
          titleBn: titleBn || null,
          modelNo: modelNo || null,
          brand,
          category,
          subCategory: subCategory || null,
          description,
          price: parseInt(price) || 0,
          priceType: parseInt(price) > 0 ? 'fixed' : 'quote',
          primaryImage: uploadedUrl,
          specs: specsJson,
          stockStatus,
          originCountry
        })
      });

      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || 'Failed to save product');

      setMsg({ kind: 'ok', text: 'Product published to store!' });
      setIsModalOpen(false);
      // Reset form
      setTitle('');
      setTitleBn('');
      setModelNo('');
      setDescription('');
      setPrice('0');
      setImageFile(null);
      setPrimaryImage('');
      setSpecsJson('{}');
      fetchProducts();
    } catch (err: any) {
      setMsg({ kind: 'err', text: err.message || 'Save failed' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await fetch(`/api/admin/products?id=${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch {
      alert('Delete failed');
    }
  };

  return (
    <div className="space-y-6 text-left">
      <div className="flex justify-between items-center flex-wrap gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#1a1a1a]">Manage Products</h2>
          <p className="text-xs text-gray-500">View, add, edit, or remove hardware and consumer gadgets from your store.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-[#1a3a5c] hover:bg-[#0f2a45] text-white font-bold text-xs rounded-xl flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {msg && (
        <div className={`p-3 rounded-xl text-xs font-medium ${msg.kind === 'ok' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
          {msg.text}
        </div>
      )}

      {/* Product List Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-gray-400 flex items-center justify-center gap-2">
            <Loader2 className="animate-spin" size={18} />
            <span>Loading catalog...</span>
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center text-gray-400">No products found. Add one above!</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#fafaf8] border-b border-gray-200 text-gray-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="p-3.5">Image</th>
                  <th className="p-3.5">Product Title / Model</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Price</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-3.5">
                      <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 p-1 flex items-center justify-center overflow-hidden">
                        <img src={p.primaryImage} alt={p.title} className="max-h-full max-w-full object-contain" />
                      </div>
                    </td>
                    <td className="p-3.5">
                      <div className="font-bold text-[#1a1a1a] line-clamp-1">{p.title}</div>
                      <div className="text-[11px] text-gray-400 mono">Brand: {p.brand} {p.modelNo ? `| PN: ${p.modelNo}` : ''}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-semibold">{p.category}</span>
                    </td>
                    <td className="p-3.5 font-bold mono text-[#1a1a1a]">
                      {p.price ? `৳${p.price.toLocaleString()}` : 'Quote'}
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold">{p.stockStatus}</span>
                    </td>
                    <td className="p-3.5 text-right">
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                        title="Delete product"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 border border-gray-200 shadow-2xl my-8">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-base text-[#1a1a1a]">Add New Product to Store</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Image & AI Extraction */}
              <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 space-y-3">
                <label className="block font-bold text-gray-700">Product Image & AI Auto-Extractor</label>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 font-semibold">
                    <ImagePlus size={15} />
                    <span>{imageFile ? imageFile.name.slice(0, 25) : 'Select Image'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    />
                  </label>
                  <button
                    type="button"
                    onClick={handleAiExtract}
                    disabled={isExtracting || (!imageFile && !primaryImage)}
                    className="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold rounded-xl flex items-center gap-1.5"
                  >
                    {isExtracting ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
                    <span>Gemini AI Nameplate OCR</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 140W GaN Pro Multi-Port Desktop Charger"
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Brand *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Siemens / Synapse / HiTHIUM"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Model / Part Number</label>
                  <input
                    type="text"
                    value={modelNo}
                    onChange={(e) => setModelNo(e.target.value)}
                    placeholder="e.g. 6ES7532-5HD00-0AB0"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 border rounded-xl bg-white"
                  >
                    <option value="Industrial Automation">Industrial Automation</option>
                    <option value="Solar & Power Solutions">Solar & Power Solutions</option>
                    <option value="Consumer Tech & Gadgets">Consumer Tech & Gadgets</option>
                    <option value="Global Sourcing & Import">Global Sourcing & Import</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price (৳, 0 = Quote)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="e.g. 4200"
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed product overview..."
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex-1 py-3 bg-[#1a3a5c] hover:bg-[#0f2a45] disabled:opacity-50 text-white font-bold rounded-xl flex items-center justify-center gap-2"
                >
                  {isSaving ? <Loader2 size={15} className="animate-spin" /> : null}
                  <span>Save & Publish Product</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
