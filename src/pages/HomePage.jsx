import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductModal from '../components/ProductModal.jsx';
import { BookOpen, Cpu, Compass, Sparkles, Search, ArrowRight, PlusCircle } from 'lucide-react';

const CATEGORIES = [
  { name: 'Books & Notes', icon: BookOpen, count: 'FE / SE / TE / BE Semesters' },
  { name: 'Electronics', icon: Cpu, count: 'Casio Calculators & IoT Kits' },
  { name: 'Engineering Tools', icon: Compass, count: 'Mini Drafters & Sheet Tubes' },
  { name: 'Lab Coats & Kits', icon: Sparkles, count: 'Chemistry & Workshop Gear' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await api.getProducts();
      setProducts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/browse');
    }
  };

  const firstFeatured = products[0] || {
    id: 1,
    productName: 'Casio fx-991EX ClassWiz Scientific Calculator',
    price: 850,
    category: 'Electronics',
    condition: 'Second-hand',
    location: 'APSIT Main Canteen',
    seller: { name: 'Arav Patel', collegeEmail: 'arav.patel@apsit.edu.in', phoneNumber: '+919820112233' }
  };

  const secondFeatured = products[2] || products[1] || {
    id: 3,
    productName: 'Applied Mathematics Vol. 3 (Dr. G.V. Kumbhojkar)',
    price: 350,
    category: 'Books & Notes',
    condition: 'Second-hand',
    location: 'Central Library Reading Room',
    seller: { name: 'Neha Sharma', collegeEmail: 'neha.sharma@apsit.edu.in', phoneNumber: '+919876543210' }
  };

  return (
    <div>
      {/* 1. Corkboard Hero Section */}
      <section className="hero">
        <div className="container hero-inner">
          <div>
            <span className="eyebrow">
              A.P. Shah Institute of Technology · Campus Bulletin Board
            </span>
            <h1>
              Pin, Trade &amp; Reuse Campus Gear on CampX
            </h1>
            <p className="hero-lead">
              No shipping fees, no strangers. Pass on scientific calculators, mini drafters, Mumbai University textbooks, and lab coats directly to fellow APSIT students between lectures.
            </p>

            {/* Glassmorphic Search Bar */}
            <form onSubmit={handleHeroSearch} className="glass-panel p-2 my-5 flex items-center gap-2 max-w-xl">
              <Search className="w-5 h-5 text-[#5a4a34] ml-2 shrink-0" />
              <input
                type="text"
                placeholder="Search calculators, drafter kits, textbooks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent border-none px-2 py-1.5 text-sm text-[#2c2115] placeholder-[#5a4a34]/80 focus:outline-none"
              />
              <button type="submit" className="btn btn-primary btn-sm">
                Find Items
              </button>
            </form>

            <div className="hero-actions">
              <Link to="/browse" className="btn btn-primary btn-lg">
                Browse Bulletin Board
              </Link>
              <Link to="/sell" className="btn btn-outline btn-lg">
                <PlusCircle className="w-4 h-4" />
                Pin an Item for Sale
              </Link>
            </div>

            <ul className="hero-stats">
              <li>
                <strong>100% @apsit.edu.in</strong>
                <span>Verified College Domain</span>
              </li>
              <li>
                <strong>₹0 Fee</strong>
                <span>Direct Student-to-Student</span>
              </li>
              <li>
                <strong>In-Person</strong>
                <span>Canteen &amp; Library Handover</span>
              </li>
            </ul>
          </div>

          {/* Right Panel: Pinned Claymorphic & Glassmorphic Index Cards */}
          <div className="hero-panel">
            <div
              className="listing-preview-card"
              onClick={() => setSelectedProduct(firstFeatured)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedProduct(firstFeatured)}
            >
              <div className="listing-preview-header">
                <span className="text-xs font-bold text-[#3f6b3f]">
                  Available Now · {firstFeatured.condition}
                </span>
                <span className="listing-price">₹{Number(firstFeatured.price).toLocaleString('en-IN')}</span>
              </div>
              <h3 className="listing-preview-title">{firstFeatured.productName}</h3>
              <p className="listing-preview-meta">
                Category: {firstFeatured.category} · Pickup: {firstFeatured.location?.split(' or ')[0]}
              </p>
              <p className="listing-preview-seller mt-1">
                Pinned by <strong>{firstFeatured.seller?.name}</strong> ({firstFeatured.seller?.collegeEmail})
              </p>
            </div>

            <div
              className="listing-preview-card listing-preview-card--ghost"
              onClick={() => setSelectedProduct(secondFeatured)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelectedProduct(secondFeatured)}
            >
              <div className="listing-preview-header">
                <span className="text-xs font-bold text-[#96631c]">
                  Semester Essential · {secondFeatured.condition}
                </span>
                <span className="listing-price">₹{Number(secondFeatured.price).toLocaleString('en-IN')}</span>
              </div>
              <h3 className="listing-preview-title">{secondFeatured.productName}</h3>
              <p className="listing-preview-meta">
                Category: {secondFeatured.category} · Pickup: {secondFeatured.location?.split(' or ')[0]}
              </p>
              <p className="listing-preview-seller mt-1">
                Pinned by <strong>{secondFeatured.seller?.name}</strong> ({secondFeatured.seller?.collegeEmail})
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Featured Pinned Listings + Category Shortcuts */}
      <section className="section pt-2">
        <div className="container">
          {/* Pinned Category Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.name}
                  to={`/browse?category=${encodeURIComponent(cat.name)}`}
                  className="category-card"
                >
                  <div className="category-icon">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="category-name">{cat.name}</span>
                  <span className="category-count">{cat.count}</span>
                </Link>
              );
            })}
          </div>

          {/* Recent Campus Listings Grid */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
            <div className="section-heading mb-0">
              <h2>Freshly Pinned on the Board</h2>
              <p className="mb-0">
                Click any pinned index card to inspect full details, view the seller’s APSIT contact info, or start an in-app chat.
              </p>
            </div>
            <Link to="/browse" className="btn btn-outline">
              View All Listings ({products.length})
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="product-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="product-card p-6 h-72 animate-pulse">
                  <div className="bg-[#f1e6cb] h-36 rounded-lg mb-4"></div>
                  <div className="h-4 bg-[#e6d9b8] rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-[#e6d9b8] rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="clay-card p-10 text-center max-w-lg mx-auto">
              <h3>No items pinned yet</h3>
              <p className="text-sm text-[#5a4a34]">
                Be the first APSIT student to pin an item on the marketplace board!
              </p>
              <Link to="/sell" className="btn btn-primary mt-3">
                Pin Your First Item
              </Link>
            </div>
          ) : (
            <div className="product-grid">
              {products.slice(0, 6).map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. How It Works & Taped Campus Savings Ledger */}
      <section className="section pt-0">
        <div className="container space-y-12">
          <div className="how-inner">
            <div className="section-heading">
              <h2>How CampX Works at APSIT</h2>
              <p>Simple four-step campus exchange built for engineering students.</p>
            </div>

            <div className="steps-list">
              <div className="step">
                <span className="step-number">1</span>
                <div className="step-content">
                  <h3>Register with @apsit.edu.in</h3>
                  <p>Sign up using your official A.P. Shah Institute of Technology email address. Non-college domains are automatically rejected.</p>
                </div>
              </div>

              <div className="step">
                <span className="step-number">2</span>
                <div className="step-content">
                  <h3>Pin Your Unused Gear</h3>
                  <p>List your scientific calculator, mini drafter, textbooks, or lab coat with a fair campus price and preferred pickup spot.</p>
                </div>
              </div>

              <div className="step">
                <span className="step-number">3</span>
                <div className="step-content">
                  <h3>Chat &amp; Coordinate</h3>
                  <p>Message the seller directly inside CampX or contact them via phone/college email to agree on a break-time meetup.</p>
                </div>
              </div>

              <div className="step">
                <span className="step-number">4</span>
                <div className="step-content">
                  <h3>Meet on Campus &amp; Mark Sold</h3>
                  <p>Inspect the item at the APSIT Canteen, Library Foyer, or Main Gate, pay directly, and mark the card as Sold.</p>
                </div>
              </div>
            </div>

            <div className="why-us">
              <h3>Campus Trust &amp; Safety Rules</h3>
              <ul className="benefits-list">
                <li>Exclusively for A.P. Shah Institute of Technology students — verified @apsit.edu.in accounts only.</li>
                <li>Strict backend ownership enforcement — only the student who pinned a listing can edit, mark sold, or remove it.</li>
                <li>Inspect calculators, drafters, and books in person at campus common areas before making payment.</li>
              </ul>
            </div>
          </div>

          {/* Taped-up Ledger Sheet Table */}
          {(() => {
            const getTypicalStorePrice = (item) => {
              const name = (item.productName || '').toLowerCase();
              const price = Number(item.price) || 0;
              if (name.includes('casio') || name.includes('calculator')) return 1495;
              if (name.includes('drafter')) return 950;
              if (name.includes('mathematics') || name.includes('kumbhojkar')) return 680;
              if (name.includes('lab coat') || name.includes('apron')) return 550;
              if (name.includes('arduino') || name.includes('iot') || name.includes('sensor')) return 1950;
              if (name.includes('mechanics')) return 650;
              return Math.round((price * 1.75) / 10) * 10;
            };

            const ledgerItems = products.slice(0, 5);
            const totalStoreCost = ledgerItems.reduce((sum, item) => sum + getTypicalStorePrice(item), 0);
            const totalCampxCost = ledgerItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);
            const totalSaved = Math.max(0, totalStoreCost - totalCampxCost);

            return (
              <div className="table-wrapper">
                <table className="data-table">
                  <caption>Campus Savings Ledger — Live CampX Listings vs. Typical New Bookstore MRP</caption>
                  <thead>
                    <tr>
                      <th>Pinned Item</th>
                      <th>Category</th>
                      <th>Pickup Spot</th>
                      <th>Typical Store MRP</th>
                      <th>CampX Price</th>
                      <th>Student Saves</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ledgerItems.map((item) => {
                      const storePrice = getTypicalStorePrice(item);
                      const campxPrice = Number(item.price) || 0;
                      const saved = Math.max(0, storePrice - campxPrice);
                      const savedPercent = storePrice > 0 ? Math.round((saved / storePrice) * 100) : 0;

                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedProduct(item)}
                          className="cursor-pointer"
                        >
                          <td className="font-bold text-[#2c2115]">{item.productName}</td>
                          <td>{item.category}</td>
                          <td>{item.location?.split(' or ')[0]}</td>
                          <td className="line-through text-[#5a4a34]">
                            ₹{storePrice.toLocaleString('en-IN')}
                          </td>
                          <td className="font-bold text-[#b3352c]">
                            ₹{campxPrice.toLocaleString('en-IN')}
                          </td>
                          <td className="font-bold text-[#3f6b3f]">
                            ₹{saved.toLocaleString('en-IN')} ({savedPercent}% off)
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colSpan={3}>Total Semester Bundle Cost (Top {ledgerItems.length} Items)</td>
                      <td className="line-through text-[#5a4a34]">₹{totalStoreCost.toLocaleString('en-IN')}</td>
                      <td className="text-[#b3352c]">₹{totalCampxCost.toLocaleString('en-IN')}</td>
                      <td className="text-[#3f6b3f]">Save ₹{totalSaved.toLocaleString('en-IN')}</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            );
          })()}
        </div>
      </section>

      {/* Product Detail Popup Modal */}
      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
        />
      )}
    </div>
  );
}
