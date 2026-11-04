import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { getProductIllustration } from '../utils/productIllustrations.js';
import { MessageSquare, Phone, Mail, Share2 } from 'lucide-react';

export default function ProductModal({ product, onClose }) {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [chatStarting, setChatStarting] = useState(false);
  const [chatError, setChatError] = useState('');
  const [copiedContact, setCopiedContact] = useState(false);

  if (!product) return null;

  const isOwner = currentUser && (
    String(product.seller?.id) === String(currentUser.id) ||
    String(product.sellerId) === String(currentUser.id)
  );

  const isSecondHand = product.condition === 'Second-hand' || product.condition === 'SECOND_HAND';
  const conditionLabel = isSecondHand ? 'Second-hand' : 'New';
  const imageSrc = getProductIllustration(product);

  const formattedDate = product.createdAt 
    ? new Date(product.createdAt).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : 'Recently';

  const handleStartChat = async () => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (isOwner) {
      navigate('/my-listings');
      return;
    }

    setChatStarting(true);
    setChatError('');

    try {
      const initialMessage = `Hi ${product.seller?.name?.split(' ')[0] || 'there'}! I am interested in buying your "${product.productName}". Is it still available?`;
      const conv = await api.startConversation(product.id, initialMessage, currentUser);
      onClose();
      navigate(`/messages?conversationId=${conv.id}`);
    } catch (err) {
      setChatError(err.message || 'Failed to start chat conversation');
      setChatStarting(false);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedContact(true);
    setTimeout(() => setCopiedContact(false), 2000);
  };

  return (
    <div
      className="detail-popup-overlay detail-popup-overlay--visible"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
    >
      <div
        className="detail-popup-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="detail-popup-close"
          aria-label="Close product popup"
        >
          ×
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Claymorphic Image Frame */}
          <div className="md:col-span-5">
            <div className="rounded-xl overflow-hidden bg-[#f1e6cb] border-2 border-[#2c2115] shadow-inner aspect-4/3 flex items-center justify-center">
              <img
                src={imageSrc}
                alt={product.productName}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            <div className="mt-3 p-3 rounded-xl bg-[#f7efd8] border border-[#e6d9b8] text-xs space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2c2115]">Condition</span>
                <span className="font-semibold text-[#5a4a34]">{conditionLabel}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2c2115]">Category</span>
                <span className="font-semibold text-[#5a4a34]">{product.category}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2c2115]">Listed Date</span>
                <span className="font-semibold text-[#5a4a34]">{formattedDate}</span>
              </div>
            </div>
          </div>

          {/* Right: Index Card Details */}
          <div className="md:col-span-7">
            <div className="detail-popup-header">
              <h3 id="modal-product-title" className="text-xl sm:text-2xl">
                {product.productName}
              </h3>
            </div>

            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-['Kalam'] text-2xl sm:text-3xl font-bold text-[#b3352c] tabular-nums">
                ₹{Number(product.price).toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-semibold text-[#5a4a34]">
                {product.status === 'SOLD' ? 'Marked as Sold' : 'Available on Campus'}
              </span>
            </div>

            <div className="detail-popup-body">
              <div className="detail-row">
                <strong>Item Description</strong>
                <span>{product.description}</span>
              </div>

              <div className="detail-row">
                <strong>Preferred Campus Meeting Spot</strong>
                <span>{product.location}</span>
              </div>

              <div className="detail-row">
                <strong>Seller Information (Verified APSIT Student)</strong>
                <span className="font-bold text-[#2c2115]">
                  {product.seller?.name || 'APSIT Student'}
                </span>
                <span>Email: {product.seller?.collegeEmail || 'student@apsit.edu.in'}</span>
                <span>Phone: {product.seller?.phoneNumber || '+919820112233'}</span>
              </div>
            </div>

            {chatError && (
              <div className="mt-3 p-2.5 rounded-lg bg-[#f2d8d2] border border-[#9c2f26] text-xs text-[#9c2f26] font-semibold">
                {chatError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="mt-4 pt-3 border-t-2 border-dashed border-[#c9a86a] flex flex-wrap gap-2">
              {isOwner ? (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    navigate('/my-listings');
                  }}
                  className="btn btn-primary w-full"
                >
                  You listed this item — Manage in My Listings
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleStartChat}
                    disabled={chatStarting || product.status === 'SOLD'}
                    className="btn btn-primary flex-1"
                  >
                    <MessageSquare className="w-4 h-4" />
                    {chatStarting ? 'Opening Chat...' : 'Chat with Seller'}
                  </button>

                  {product.seller?.phoneNumber && (
                    <a
                      href={`tel:${product.seller.phoneNumber}`}
                      className="btn btn-outline"
                      title="Direct call seller"
                    >
                      <Phone className="w-4 h-4" />
                      Call Seller
                    </a>
                  )}

                  {product.seller?.collegeEmail && (
                    <a
                      href={`mailto:${product.seller.collegeEmail}?subject=CampX Inquiry: ${encodeURIComponent(product.productName)}`}
                      className="btn btn-outline"
                      title="Email seller"
                    >
                      <Mail className="w-4 h-4" />
                      Email
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={handleShare}
                    className="btn btn-outline btn-sm"
                    aria-label="Share listing"
                    title="Copy listing link"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>

            {copiedContact && (
              <p className="text-center text-xs font-bold text-[#3f6b3f] mt-2">
                Link copied to clipboard!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
