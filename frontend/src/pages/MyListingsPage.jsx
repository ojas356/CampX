import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { getProductIllustration } from '../utils/productIllustrations.js';
import { CheckCircle, Trash2, Edit3, PlusCircle } from 'lucide-react';

export default function MyListingsPage() {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('ACTIVE');
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [itemToDelete, setItemToDelete] = useState(null);
  const [itemToEdit, setItemToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({});
  const [editError, setEditError] = useState('');

  useEffect(() => {
    if (currentUser) {
      loadListings();
    }
  }, [currentUser]);

  const loadListings = async () => {
    setLoading(true);
    try {
      const data = await api.getMyListings(currentUser?.id);
      setListings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="section">
        <div className="container">
          <div className="clay-card p-8 max-w-md mx-auto text-center">
            <h2>Sign in to view your listings</h2>
            <p className="text-sm text-[#5a4a34]">Manage and track your pinned campus sales.</p>
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="btn btn-primary mt-4 w-full"
            >
              Log In
            </button>
          </div>
        </div>
      </div>
    );
  }

  const activeListings = listings.filter((p) => p.status === 'ACTIVE');
  const soldListings = listings.filter((p) => p.status === 'SOLD');
  const displayedListings = activeTab === 'ACTIVE' ? activeListings : soldListings;

  const handleMarkAsSold = async (id) => {
    try {
      await api.markAsSold(id, currentUser.id);
      loadListings();
    } catch (err) {
      console.error(err);
    }
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    try {
      await api.deleteProduct(itemToDelete.id, currentUser.id);
      setItemToDelete(null);
      loadListings();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (product) => {
    setItemToEdit(product);
    setEditFormData({
      productName: product.productName,
      price: product.price,
      description: product.description,
      location: product.location,
      condition: product.condition === 'SECOND_HAND' ? 'Second-hand' : product.condition,
      category: product.category,
      imageUrl: product.imageUrl
    });
    setEditError('');
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!itemToEdit) return;
    try {
      await api.updateProduct(itemToEdit.id, editFormData, currentUser.id);
      setItemToEdit(null);
      loadListings();
    } catch (err) {
      setEditError(err.message || 'Failed to update product');
    }
  };

  return (
    <div className="section pt-8">
      <div className="container">
        {/* Header */}
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div className="section-heading mb-0">
            <span className="eyebrow">Student Seller Dashboard</span>
            <h1>My Pinned Campus Listings</h1>
            <p className="mb-0">
              Managing listings pinned by <strong>{currentUser.name}</strong> ({currentUser.collegeEmail})
            </p>
          </div>

          <Link to="/sell" className="btn btn-primary">
            <PlusCircle className="w-4 h-4" />
            List Another Item
          </Link>
        </div>

        {/* Summary Bar */}
        <div className="glass-panel p-5 mb-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5a4a34]">Active on Board</span>
            <p className="font-['Kalam'] text-3xl font-bold text-[#2c2115] mb-0 tabular-nums">{activeListings.length}</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5a4a34]">Items Marked Sold</span>
            <p className="font-['Kalam'] text-3xl font-bold text-[#3f6b3f] mb-0 tabular-nums">{soldListings.length}</p>
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#5a4a34]">Total Pinned Cards</span>
            <p className="font-['Kalam'] text-3xl font-bold text-[#b3352c] mb-0 tabular-nums">{listings.length}</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => setActiveTab('ACTIVE')}
            className={`btn ${activeTab === 'ACTIVE' ? 'btn-primary' : 'btn-outline'}`}
          >
            Active Listings ({activeListings.length})
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('SOLD')}
            className={`btn ${activeTab === 'SOLD' ? 'btn-primary' : 'btn-outline'}`}
          >
            Sold / Previous ({soldListings.length})
          </button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="product-grid">
            {[1, 2].map((i) => (
              <div key={i} className="product-card p-6 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : displayedListings.length === 0 ? (
          <div className="clay-card p-12 text-center max-w-md mx-auto">
            <h3>No {activeTab.toLowerCase()} listings found</h3>
            <p className="text-sm text-[#5a4a34]">
              {activeTab === 'ACTIVE'
                ? 'You have no active cards pinned to the board right now.'
                : 'You have not marked any listings as sold yet.'}
            </p>
            {activeTab === 'ACTIVE' && (
              <Link to="/sell" className="btn btn-primary mt-3">
                <PlusCircle className="w-4 h-4" />
                Pin Your First Item
              </Link>
            )}
          </div>
        ) : (
          <div className="product-grid">
            {displayedListings.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-card-media">
                  <img
                    src={getProductIllustration(product)}
                    alt={product.productName}
                    referrerPolicy="no-referrer"
                  />
                </div>

                <div className="product-card-body">
                  <div>
                    <div className="product-card-top">
                      <span className="font-bold text-[#5a4a34]">
                        {product.category} · {product.condition === 'SECOND_HAND' ? 'Second-hand' : product.condition}
                      </span>
                      <span className="product-price">
                        ₹{Number(product.price).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <h3 className="product-title">{product.productName}</h3>
                    <p className="product-meta mt-1">Pickup: {product.location}</p>
                  </div>

                  <div className="product-card-actions pt-3 border-t border-dashed border-[#c9a86a] flex items-center justify-between gap-2">
                    {product.status === 'ACTIVE' ? (
                      <button
                        type="button"
                        onClick={() => handleMarkAsSold(product.id)}
                        className="btn btn-outline btn-sm text-[#3f6b3f]"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Mark as Sold
                      </button>
                    ) : (
                      <span className="text-xs font-bold text-[#9c2f26]">Marked Sold</span>
                    )}

                    <div className="flex items-center gap-1.5">
                      {product.status === 'ACTIVE' && (
                        <button
                          type="button"
                          onClick={() => openEditModal(product)}
                          className="btn btn-outline btn-sm"
                          aria-label={`Edit ${product.productName}`}
                          title="Edit Listing"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => setItemToDelete(product)}
                        className="btn btn-outline btn-sm btn-delete"
                        aria-label={`Delete ${product.productName}`}
                        title="Delete Listing"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {itemToDelete && (
          <div className="detail-popup-overlay detail-popup-overlay--visible">
            <div className="detail-popup-card max-w-md">
              <h3>Unpin &amp; Delete Listing?</h3>
              <p className="text-sm text-[#5a4a34]">
                Are you sure you want to remove <strong>"{itemToDelete.productName}"</strong> from the CampX board?
              </p>
              <div className="form-actions mt-4">
                <button
                  type="button"
                  onClick={() => setItemToDelete(null)}
                  className="btn btn-outline btn-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  className="btn btn-primary btn-sm"
                >
                  Yes, Delete Listing
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Product Modal */}
        {itemToEdit && (
          <div className="detail-popup-overlay detail-popup-overlay--visible">
            <div className="detail-popup-card max-w-lg">
              <button
                type="button"
                onClick={() => setItemToEdit(null)}
                className="detail-popup-close"
                aria-label="Close edit modal"
              >
                ×
              </button>
              <h3>Edit Pinned Listing</h3>

              {editError && (
                <div className="mb-3 p-2.5 rounded bg-[#f2d8d2] text-xs text-[#9c2f26] font-bold">
                  {editError}
                </div>
              )}

              <form onSubmit={handleSaveEdit} className="mt-4">
                <div className="form-group">
                  <label>Product Title</label>
                  <input
                    type="text"
                    value={editFormData.productName || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, productName: e.target.value })}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹ INR)</label>
                    <input
                      type="number"
                      min="1"
                      value={editFormData.price || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, price: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Condition</label>
                    <select
                      value={editFormData.condition || 'Second-hand'}
                      onChange={(e) => setEditFormData({ ...editFormData, condition: e.target.value })}
                    >
                      <option value="Second-hand">Second-hand</option>
                      <option value="New">New</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Campus Meeting Location</label>
                  <input
                    type="text"
                    value={editFormData.location || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    rows="3"
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                    required
                  ></textarea>
                </div>

                <div className="form-actions">
                  <button
                    type="button"
                    onClick={() => setItemToEdit(null)}
                    className="btn btn-outline btn-sm"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
