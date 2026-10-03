'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ExternalLink, ImagePlus, Loader2, Pencil, Plus, RefreshCw, Search, Sparkles, Trash2, X } from 'lucide-react';
import type { Product } from '@/db/schema';
import { CATEGORY_ORDER } from '@/lib/productGroups';
import { STOCK_STATUSES } from '@/lib/productInput';
import { parseGallery, parseSpecs } from '@/lib/productMedia';
import { errorText, readJson } from '@/lib/clientApi';
import { inlineImage, prepareImage } from '@/lib/clientImage';
import ProductImage from '@/components/ProductImage';
import Modal from '@/components/Modal';

const emptyDraft = () => ({
  title: '', titleBn: '', modelNo: '', brand: '', category: 'Industrial Automation',
  subCategory: '', description: '', descriptionBn: '', price: '0', priceType: 'quote',
  stockStatus: 'In Stock', originCountry: 'China', primaryImage: '', additionalImages: [] as string[],
  datasheetUrl: '', specs: '{}', featured: true, displayOrder: '0',
});
type Draft = ReturnType<typeof emptyDraft>;

export default function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [message, setMessage] = useState('');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formNotice, setFormNotice] = useState('');
  const [deleting, setDeleting] = useState<number | null>(null);

  const loadProducts = useCallback((signal?: AbortSignal) => fetch('/api/admin/products', { cache: 'no-store', signal })
    .then(response => readJson<{ products: Product[] }>(response))
    .then(data => {
      if (!Array.isArray(data.products)) throw new Error('The product list could not be read.');
      if (!signal?.aborted) { setProducts(data.products); setLoadError(''); }
    })
    .catch(error => { if (!signal?.aborted) setLoadError(errorText(error)); })
    .finally(() => { if (!signal?.aborted) setLoading(false); }), []);
  useEffect(() => {
    const controller = new AbortController();
    void loadProducts(controller.signal);
    return () => controller.abort();
  }, [loadProducts]);
  useEffect(() => () => { if (imagePreview) URL.revokeObjectURL(imagePreview); }, [imagePreview]);
  const refresh = () => { setLoading(true); setLoadError(''); void loadProducts(); };
  const selectPhoto = (file: File | null) => { setImageFile(file); setImagePreview(file ? URL.createObjectURL(file) : ''); };

  const setField = <K extends keyof Draft>(key: K, value: Draft[K]) => setDraft(previous => ({ ...previous, [key]: value }));
  const close = () => { if (!saving && !extracting) setOpen(false); };
  const start = (product?: Product) => {
    setEditing(product || null); selectPhoto(null); setGalleryFiles([]); setFormError(''); setFormNotice('');
    setDraft(product ? {
      title: product.title, titleBn: product.titleBn || '', modelNo: product.modelNo || '', brand: product.brand,
      category: product.category, subCategory: product.subCategory || '', description: product.description,
      descriptionBn: product.descriptionBn || '', price: String(product.price || 0), priceType: product.priceType || 'quote',
      stockStatus: product.stockStatus || 'In Stock', originCountry: product.originCountry || '',
      primaryImage: product.primaryImage, additionalImages: parseGallery(product.additionalImages),
      datasheetUrl: product.datasheetUrl || '', specs: JSON.stringify(parseSpecs(product.specs), null, 2),
      featured: product.featured === 1, displayOrder: String(product.displayOrder || 0),
    } : emptyDraft());
    setOpen(true);
  };

  const upload = async (file: File) => {
    const form = new FormData();
    form.append('file', await prepareImage(file));
    const data = await readJson<{ success: boolean; url: string }>(await fetch('/api/upload', { method: 'POST', body: form }));
    if (!data.success || !data.url) throw new Error('The photo could not be uploaded.');
    return data.url;
  };
  const extract = async () => {
    if (!imageFile) return;
    setExtracting(true); setFormError(''); setFormNotice('');
    try {
      const photo = await prepareImage(imageFile, 'image/jpeg', 600_000);
      const result = await readJson<{ data: Record<string, unknown> }>(await fetch('/api/ai/describe-part', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64: await inlineImage(photo), mimeType: photo.type }),
      }));
      if (!result.data) throw new Error('The extractor returned no product details.');
      const data = result.data;
      setDraft(previous => ({
        ...previous,
        ...Object.fromEntries(['title', 'titleBn', 'brand', 'modelNo', 'subCategory'].filter(key => typeof data[key] === 'string').map(key => [key, data[key]])),
        category: CATEGORY_ORDER.includes(data.category as typeof CATEGORY_ORDER[number]) ? String(data.category) : previous.category,
        description: typeof data.descriptionEn === 'string' ? data.descriptionEn : previous.description,
        descriptionBn: typeof data.descriptionBn === 'string' ? data.descriptionBn : previous.descriptionBn,
        specs: data.specs && typeof data.specs === 'object' && !Array.isArray(data.specs) ? JSON.stringify(data.specs, null, 2) : previous.specs,
      }));
      setFormNotice('Photo read. Review the details and specifications before publishing.');
    } catch (error) { setFormError(errorText(error)); }
    finally { setExtracting(false); }
  };
  const save = async (event: React.FormEvent) => {
    event.preventDefault(); if (saving || extracting) return;
    setFormError(''); setSaving(true);
    try {
      const specs: unknown = JSON.parse(draft.specs);
      if (!specs || typeof specs !== 'object' || Array.isArray(specs)) throw new Error('Specifications must be a JSON object with names and values.');
      if (!imageFile && !draft.primaryImage.trim()) throw new Error('Upload a product photo or enter its HTTPS URL.');
      const primaryImage = imageFile ? await upload(imageFile) : draft.primaryImage;
      const additionalImages = [...draft.additionalImages];
      setDraft(previous => ({ ...previous, primaryImage }));
      selectPhoto(null);
      for (const file of galleryFiles) {
        additionalImages.push(await upload(file));
        setDraft(previous => ({ ...previous, additionalImages: [...additionalImages] }));
        setGalleryFiles(previous => previous.filter(item => item !== file));
      }
      // Preserve successful uploads if saving fails; a retry must not upload them again.
      setDraft(previous => ({ ...previous, primaryImage, additionalImages }));
      selectPhoto(null); setGalleryFiles([]);
      const result = await readJson<{ success: boolean; product: Product }>(await fetch('/api/admin/products', {
        method: editing ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...draft, id: editing?.id, price: Number(draft.price), featured: draft.featured ? 1 : 0, displayOrder: Number(draft.displayOrder), primaryImage, additionalImages, specs }),
      }));
      if (!result.success || !result.product) throw new Error('The product was not saved. Please try again.');
      setProducts(previous => [...previous.filter(item => item.id !== result.product.id), result.product].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0) || b.id - a.id));
      setMessage(editing ? 'Product updated. The store now uses these details.' : 'Product published and available in the catalogue.');
      setOpen(false);
    } catch (error) { setFormError(error instanceof SyntaxError ? 'Specifications must contain valid JSON.' : errorText(error)); }
    finally { setSaving(false); }
  };
  const remove = async (product: Product) => {
    if (!confirm('Delete "' + product.title + '" from the store? Existing order records will be kept.')) return;
    setDeleting(product.id); setLoadError(''); setMessage('');
    try {
      const result = await readJson<{ success: boolean }>(await fetch('/api/admin/products?id=' + product.id, { method: 'DELETE' }));
      if (!result.success) throw new Error('The product could not be deleted.');
      setProducts(previous => previous.filter(item => item.id !== product.id)); setMessage('Product deleted from the store.');
    } catch (error) { setLoadError(errorText(error)); }
    finally { setDeleting(null); }
  };
  const filtered = useMemo(() => products.filter(product => (categoryFilter === 'All' || product.category === categoryFilter) &&
    [product.title, product.titleBn, product.modelNo, product.brand].some(value => (value || '').toLowerCase().includes(search.trim().toLowerCase()))), [products, categoryFilter, search]);
  const inputClass = 'w-full p-3 border border-gray-300 rounded-lg bg-white text-base';
  const textField = (key: keyof Draft, label: string, required = false, maxLength = 300) => <div key={key}>
    <label htmlFor={'product-' + key} className="block text-sm font-semibold mb-1">{label}</label>
    <input id={'product-' + key} value={String(draft[key])} onChange={event => setField(key, event.target.value as never)} required={required} maxLength={maxLength} className={inputClass} />
  </div>;

  return <div className="space-y-5 text-left">
    <div className="flex justify-between items-center flex-wrap gap-3">
      <div><h2 className="text-2xl font-bold">Manage products</h2><p className="text-sm text-gray-600">Photos, pricing and product details shown in your store.</p></div>
      <div className="flex gap-2"><button type="button" onClick={refresh} disabled={loading} className="btn-ghost"><RefreshCw size={16} />Refresh</button><button type="button" onClick={() => start()} className="btn-ink"><Plus size={16} />Add product</button></div>
    </div>
    {message && <p role="status" className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-lg">{message}</p>}
    {loadError && <p role="alert" className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-lg">{loadError}</p>}
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="flex items-center gap-2 flex-1 border border-gray-300 bg-white rounded-lg px-3"><Search size={18} aria-hidden /><label htmlFor="admin-product-search" className="sr-only">Search products</label><input id="admin-product-search" type="search" value={search} onChange={event => setSearch(event.target.value)} placeholder="Title, model or brand" className="w-full py-3 bg-transparent" /></div>
      <label className="sr-only" htmlFor="admin-product-category">Filter category</label><select id="admin-product-category" value={categoryFilter} onChange={event => setCategoryFilter(event.target.value)} className="border border-gray-300 rounded-lg p-3 bg-white"><option value="All">All categories</option>{CATEGORY_ORDER.map(category => <option key={category}>{category}</option>)}</select>
    </div>
    <p className="text-sm text-gray-600" role="status">{filtered.length} of {products.length} products</p>
    {loading ? <p className="p-12 flex justify-center gap-2"><Loader2 className="animate-spin" size={20} />Loading products…</p>
      : !filtered.length && !loadError ? <p className="p-10 border rounded-lg bg-white">No products match. Clear the filters or add your first product.</p>
      : <div className="grid gap-3">{filtered.map(product => <article key={product.id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-4 flex-wrap sm:flex-nowrap">
        <div className="w-20 h-20 shrink-0 overflow-hidden rounded-lg bg-gray-50"><ProductImage product={product} /></div>
        <div className="flex-1 min-w-0"><h3 className="font-semibold break-words">{product.title}</h3><p className="text-sm text-gray-500 break-words">{product.brand}{product.modelNo ? ' · ' + product.modelNo : ''}</p><p className="text-sm text-gray-600">{product.category}{product.subCategory ? ' / ' + product.subCategory : ''}</p><div className="flex flex-wrap gap-x-4 text-sm mt-2"><strong>{product.priceType === 'fixed' && Number(product.price) > 0 ? '৳' + Number(product.price).toLocaleString('en-BD') : 'Quotation'}</strong><span>{product.stockStatus}</span><span>Order: {product.displayOrder || 0}</span>{product.featured === 1 && <span className="text-emerald-700">Featured</span>}</div></div>
        <div className="flex sm:flex-col gap-2 ml-auto"><button type="button" onClick={() => start(product)} className="btn-ghost" aria-label={'Edit ' + product.title}><Pencil size={16} />Edit</button><Link href={'/products/' + product.slug} target="_blank" rel="noopener noreferrer" className="btn-ghost" aria-label={'View ' + product.title + ' in store'}><ExternalLink size={16} />View</Link><button type="button" disabled={deleting !== null} onClick={() => remove(product)} className="px-3 py-2 flex items-center justify-center gap-2 text-red-700 border border-red-200 rounded-lg" aria-label={'Delete ' + product.title}>{deleting === product.id ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}Delete</button></div>
      </article>)}</div>}
    {open && <Modal onClose={close} labelledBy="product-editor-title" wide>
      <div className="p-5 sm:p-8">
        <div className="flex justify-between items-center mb-5"><h2 id="product-editor-title" className="text-xl font-bold">{editing ? 'Edit product' : 'Add product'}</h2><button type="button" onClick={close} disabled={saving || extracting} className="p-2" aria-label="Close product editor"><X size={22} /></button></div>
        <form onSubmit={save} className="space-y-5">
          {formError && <p role="alert" className="p-3 bg-red-50 text-red-800 rounded-lg">{formError}</p>}
          {formNotice && <p role="status" className="p-3 bg-amber-50 text-amber-900 rounded-lg">{formNotice}</p>}
          <fieldset disabled={saving || extracting} className="space-y-5 disabled:opacity-70">
            <div className="border rounded-lg p-4 space-y-3">
              <h3 className="font-semibold">Primary product photo</h3>
              {(imagePreview || draft.primaryImage) && <div className="h-40 w-full bg-gray-50 overflow-hidden"><Image src={imagePreview || draft.primaryImage} alt="Primary product preview" width={480} height={160} unoptimized className="h-full w-full object-contain" /></div>}
              <label htmlFor="product-photo" className="block text-sm">Upload photo (phone photos are resized automatically)</label>
              <input id="product-photo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="w-full text-sm" onChange={event => selectPhoto(event.target.files?.[0] || null)} />
              <button type="button" disabled={!imageFile} onClick={extract} className="btn-ghost"><Sparkles size={16} />Read photo with Gemini</button>
              {textField('primaryImage', 'Or use a photo URL', false, 2048)}
              <p className="text-sm text-gray-500">Use a real photo of this product. AI details need your review.</p>
            </div>
            {textField('title', 'Product title *', true)}
            {textField('titleBn', 'Bangla title')}
            <div className="grid sm:grid-cols-2 gap-4">{textField('brand', 'Brand *', true, 120)}{textField('modelNo', 'Model / part number', false, 120)}</div>
            <div className="grid sm:grid-cols-2 gap-4"><div><label htmlFor="product-category" className="block text-sm font-semibold mb-1">Category *</label><select id="product-category" value={draft.category} onChange={event => setField('category', event.target.value)} className={inputClass}>{CATEGORY_ORDER.map(category => <option key={category}>{category}</option>)}</select></div>{textField('subCategory', 'Subcategory', false, 120)}</div>
            <div className="grid sm:grid-cols-2 gap-4"><div><label htmlFor="product-priceType" className="block text-sm font-semibold mb-1">Pricing</label><select id="product-priceType" value={draft.priceType} onChange={event => setField('priceType', event.target.value)} className={inputClass}><option value="quote">Request quotation</option><option value="fixed">Fixed price</option></select></div><div><label htmlFor="product-price" className="block text-sm font-semibold mb-1">Price (৳)</label><input id="product-price" type="number" min="1" max="1000000000" step="1" required={draft.priceType === 'fixed'} disabled={draft.priceType === 'quote'} value={draft.price} onChange={event => setField('price', event.target.value)} className={inputClass} /></div></div>
            <div><label htmlFor="product-description" className="block text-sm font-semibold mb-1">Description *</label><textarea id="product-description" rows={4} required maxLength={10000} value={draft.description} onChange={event => setField('description', event.target.value)} className={inputClass} /></div>
            <div><label htmlFor="product-descriptionBn" className="block text-sm font-semibold mb-1">Bangla description</label><textarea id="product-descriptionBn" rows={3} maxLength={10000} value={draft.descriptionBn} onChange={event => setField('descriptionBn', event.target.value)} className={inputClass} /></div>
            <div><label htmlFor="product-specs" className="block text-sm font-semibold mb-1">Specifications (JSON)</label><textarea id="product-specs" rows={5} value={draft.specs} onChange={event => setField('specs', event.target.value)} className={inputClass + ' font-mono'} /><p className="text-sm text-gray-500 mt-1">Example: {"{\"Voltage\":\"230V\",\"Power\":\"600W\"}"}</p></div>
            <div className="grid sm:grid-cols-2 gap-4"><div><label htmlFor="product-stockStatus" className="block text-sm font-semibold mb-1">Availability</label><select id="product-stockStatus" value={draft.stockStatus} onChange={event => setField('stockStatus', event.target.value)} className={inputClass}>{STOCK_STATUSES.map(status => <option key={status}>{status}</option>)}</select></div>{textField('originCountry', 'Country of origin', false, 120)}</div>
            {textField('datasheetUrl', 'Datasheet / manual HTTPS URL', false, 2048)}
            <div className="border rounded-lg p-4 space-y-3"><h3 className="font-semibold">Additional photos (up to 5)</h3><div className="flex gap-3 flex-wrap">{draft.additionalImages.map((source, index) => <div key={source + index} className="relative w-24 h-24"><Image src={source} alt={'Additional photo ' + (index + 1)} width={96} height={96} unoptimized className="w-full h-full object-contain border rounded-lg" /><button type="button" aria-label={'Remove additional photo ' + (index + 1)} onClick={() => setField('additionalImages', draft.additionalImages.filter((_, position) => position !== index))} className="absolute top-0 right-0 bg-white p-1 rounded-full border"><X size={16} /></button></div>)}</div><label htmlFor="product-gallery" className="block text-sm">Upload additional photos</label><input id="product-gallery" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" className="w-full text-sm" onChange={event => { const files = Array.from(event.target.files || []); if (files.length + draft.additionalImages.length > 5) { setFormError('Use up to five additional photos.'); event.target.value = ''; } else { setGalleryFiles(files); setFormError(''); } }} />{galleryFiles.map((file, index) => <p key={index} className="text-sm flex justify-between items-center">{file.name}<button type="button" aria-label={'Remove ' + file.name} onClick={() => setGalleryFiles(previous => previous.filter((_, position) => position !== index))}><X size={16} /></button></p>)}</div>
            <div className="grid sm:grid-cols-2 gap-4"><div><label htmlFor="product-displayOrder" className="block text-sm font-semibold mb-1">Display order (lower first)</label><input id="product-displayOrder" type="number" min="0" max="100000" step="1" value={draft.displayOrder} onChange={event => setField('displayOrder', event.target.value)} className={inputClass} /></div><label className="flex items-center gap-3 text-sm"><input type="checkbox" checked={draft.featured} onChange={event => setField('featured', event.target.checked)} />Feature on the Home desk (gadgets)</label></div>
          </fieldset>
          <div className="flex flex-wrap gap-3 pt-3 border-t"><button type="submit" disabled={saving || extracting} className="btn-ink flex-1">{saving ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}{saving ? 'Saving…' : editing ? 'Save changes' : 'Save & publish'}</button><button type="button" disabled={saving || extracting} onClick={close} className="btn-ghost">Cancel</button></div>
        </form>
      </div>
    </Modal>}
  </div>;
}
