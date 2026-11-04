import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Books & Notes',
  'Electronics',
  'Engineering Tools',
  'Lab Coats & Kits',
  'Stationery & Supplies',
  'Hostel & Daily Essentials',
  'Others'
];

export default function BrowsePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCondition, setSelectedCondition] = useState('All');
  const [maxPrice, setMaxPrice] = useState(3000);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(cat);
    const search = searchParams.get('search');
    if (search) setSearchQuery(search);
  }, [searchParams]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts(selectedCategory === 'All' ? null : selectedCategory);
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchName = p.productName?.toLowerCase().includes(q);
          const matchDesc = p.description?.toLowerCase().includes(q);
          const matchLoc = p.location?.toLowerCase().includes(q);
          if (!matchName && !matchDesc && !matchLoc) return false;
        }

        if (selectedCategory !== 'All' && p.category?.toLowerCase() !== selectedCategory.toLowerCase()) {
          return false;
        }

        if (selectedCondition !== 'All') {
          const isSecondHand = p.condition === 'Second-hand' || p.condition === 'SECOND_HAND';
          if (selectedCondition === 'Second-hand' && !isSecondHand) return false;
          if (selectedCondition === 'New' && isSecondHand) return false;
        }

        if (Number(p.price) > maxPrice) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return Number(a.price) - Number(b.price);
        if (sortBy === 'price-high') return Number(b.price) - Number(a.price);
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });
  }, [products, searchQuery, selectedCategory, selectedCondition, maxPrice, sortBy]);

  const clearAllFilters = () => {
    setSelectedCategory('All');
    setSearchQuery('');
    setSelectedCondition('All');
    setMaxPrice(3000);
    setSortBy('newest');
    setSearchParams({});
  };

  return (
    <div className="section pt-8">
      <div className="container">
        <div className="section-heading mb-6">
          <span className="eyebrow">APSIT Campus Marketplace</span>
          <h1>Browse Pinned Student Listings</h1>
          <p className="mb-0">
            Filter by department category, item condition, or price range to find textbooks, calculators, and engineering kits.
          </p>
        </div>

        {/* Frosted Glass Filter Toolbar */}
        <div className="glass-panel p-4 mb-8 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#5a4a34] absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by item name, subject, or pickup spot..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-lg bg-[#fffdf7] border-2 border-[#2c2115] text-sm text-[#2c2115]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-[#5a4a34] hover:text-[#2c2115]"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Condition Segmented Control */}
          <div className="flex items-center gap-1.5 bg-[#f1e6cb] p-1 rounded-xl border border-[#c9a86a]">
            {['All', 'New', 'Second-hand'].map((cond) => (
              <button
                key={cond}
                type="button"
                onClick={() => setSelectedCondition(cond)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCondition === cond
                    ? 'bg-[#b3352c] text-[#fff9ee] shadow-xs'
                    : 'text-[#2c2115] hover:bg-[#fdf8ec]'
                }`}
              >
                {cond}
              </button>
            ))}
          </div>

          {/* Max Price Slider */}
          <div className="flex items-center gap-3 bg-[#fdf8ec]/90 px-3.5 py-2 rounded-xl border border-[#c9a86a]">
            <label htmlFor="priceRange" className="text-xs font-bold text-[#2c2115] whitespace-nowrap">
              Max: ₹{maxPrice.toLocaleString('en-IN')}
            </label>
            <input
              id="priceRange"
              type="range"
              min="100"
              max="5000"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-28 accent-[#b3352c] cursor-pointer"
            />
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              aria-label="Sort listings"
              className="px-3 py-2 rounded-lg bg-[#fffdf7] border-2 border-[#2c2115] text-xs font-bold text-[#2c2115]"
            >
              <option value="newest">Sort: Newest Pinned</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>

            <button
              type="button"
              onClick={clearAllFilters}
              className="btn btn-outline btn-sm"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`btn btn-sm ${
                selectedCategory === cat ? 'btn-primary' : 'btn-outline'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between text-sm font-semibold text-[#2c2115]">
          <span>
            Showing <strong>{filteredProducts.length}</strong> pinned listing{filteredProducts.length === 1 ? '' : 's'}
          </span>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="product-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="product-card p-6 h-72 animate-pulse">
                <div className="bg-[#f1e6cb] h-36 rounded-lg mb-4"></div>
                <div className="h-4 bg-[#e6d9b8] rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-[#e6d9b8] rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="clay-card p-12 text-center max-w-lg mx-auto">
            <SlidersHorizontal className="w-10 h-10 text-[#5a4a34] mx-auto mb-3" />
            <h3>No pinned items match your filter</h3>
            <p className="text-sm text-[#5a4a34]">
              Try resetting your category, condition, or maximum price filter.
            </p>
            <button
              type="button"
              onClick={clearAllFilters}
              className="btn btn-primary mt-3"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="product-grid">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) => setSelectedProduct(p)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
