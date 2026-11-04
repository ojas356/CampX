import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { validateProduct } from '../utils/validators.js';
import { PRODUCT_ILLUSTRATIONS } from '../utils/productIllustrations.js';
import { Upload, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  'Books & Notes',
  'Electronics',
  'Engineering Tools',
  'Lab Coats & Kits',
  'Stationery & Supplies',
  'Hostel & Daily Essentials',
  'Others'
];

const CAMPUS_LOCATIONS = [
  'APSIT Main Canteen',
  'Central Library Foyer (3rd Floor)',
  'Main Entrance Gate 1',
  'Mechanical Workshop & Shed',
  'Computer / IT Labs (3rd & 4th Floor)',
  'Ground Floor Seminar Hall Reception',
  'Kasarvadavali Bus Stop near College'
];

const PRESET_SAMPLE_IMAGES = [
  { label: 'Scientific Calculator', url: PRODUCT_ILLUSTRATIONS.calculator },
  { label: 'Engineering Drafter', url: PRODUCT_ILLUSTRATIONS.drafter },
  { label: 'Engineering Textbook', url: PRODUCT_ILLUSTRATIONS.book },
  { label: 'White Lab Coat', url: PRODUCT_ILLUSTRATIONS.labcoat },
  { label: 'Arduino / IoT Kit', url: PRODUCT_ILLUSTRATIONS.arduino }
];

export default function SellPage() {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    category: 'Books & Notes',
    price: '',
    condition: 'Second-hand',
    location: CAMPUS_LOCATIONS[0],
    customLocation: '',
    imageUrl: ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  if (!isAuthenticated) {
    return (
      <div className="section">
        <div className="container">
          <div className="clay-card p-8 max-w-md mx-auto text-center">
            <h2>Student Login Required</h2>
            <p className="text-sm text-[#5a4a34]">
              Only verified A.P. Shah Institute of Technology students can pin items on CampX.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="btn btn-primary w-full"
              >
                Log In with APSIT Email
              </button>
              <button
                type="button"
                onClick={() => navigate('/register')}
                className="btn btn-outline w-full"
              >
                Register New Account
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, imageUrl: 'Image must be under 5MB.' }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData((prev) => ({ ...prev, imageUrl: reader.result }));
        setErrors((prev) => ({ ...prev, imageUrl: '' }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectPreset = (url) => {
    setImagePreview(url);
    setFormData((prev) => ({ ...prev, imageUrl: url }));
    setErrors((prev) => ({ ...prev, imageUrl: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    const finalLocation = formData.location === 'Other' && formData.customLocation.trim()
      ? formData.customLocation.trim()
      : formData.location;

    const payload = {
      productName: formData.productName,
      description: formData.description,
      category: formData.category,
      price: formData.price,
      condition: formData.condition,
      location: finalLocation,
      imageUrl: formData.imageUrl || PRESET_SAMPLE_IMAGES[0].url
    };

    const validation = validateProduct(payload);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    try {
      await api.createProduct(payload, currentUser);
      setSuccessMessage('Listing pinned to the board!');
      setTimeout(() => {
        navigate('/my-listings');
      }, 900);
    } catch (err) {
      setErrors({ form: err.message || 'Failed to list product.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="section pt-8">
      <div className="container sell-inner">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn btn-outline btn-sm mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="section-heading mb-6">
          <span className="eyebrow">Pin an Index Card</span>
          <h1>Sell Your Campus Gear on CampX</h1>
          <p className="mb-0">
            Posting as <strong>{currentUser.name}</strong> ({currentUser.collegeEmail})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          {errors.form && (
            <div className="mb-6 p-3.5 rounded-lg bg-[#f2d8d2] border-2 border-[#9c2f26] text-sm text-[#9c2f26] font-bold flex items-center gap-2">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{errors.form}</span>
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3.5 rounded-lg bg-[#e6ead9] border-2 border-[#3f6b3f] text-sm text-[#3f6b3f] font-bold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>{successMessage} Redirecting to your listings...</span>
            </div>
          )}

          <fieldset className="form-fieldset">
            <legend>1. Item Specifications</legend>

            <div className="form-group">
              <label htmlFor="productName">Product Title *</label>
              <input
                id="productName"
                type="text"
                placeholder="e.g. Casio fx-991EX Scientific Calculator or Omega Mini Drafter"
                value={formData.productName}
                onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
              />
              {errors.productName && (
                <p className="text-xs text-[#9c2f26] font-bold mt-1 mb-0">{errors.productName}</p>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Department Category *</label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="price">Price (₹ INR) *</label>
                <input
                  id="price"
                  type="number"
                  min="1"
                  step="1"
                  placeholder="350"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
                {errors.price && (
                  <p className="text-xs text-[#9c2f26] font-bold mt-1 mb-0">{errors.price}</p>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>Condition *</label>
              <div className="flex gap-3">
                {['Second-hand', 'New'].map((cond) => (
                  <button
                    type="button"
                    key={cond}
                    onClick={() => setFormData({ ...formData, condition: cond })}
                    className={`btn btn-sm ${
                      formData.condition === cond ? 'btn-primary' : 'btn-outline'
                    }`}
                  >
                    {cond}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="description">Full Description &amp; Working Condition *</label>
              <textarea
                id="description"
                rows="4"
                placeholder="Mention semester used, book author/edition, included accessories, or any wear..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
              {errors.description && (
                <p className="text-xs text-[#9c2f26] font-bold mt-1 mb-0">{errors.description}</p>
              )}
            </div>
          </fieldset>

          <fieldset className="form-fieldset">
            <legend>2. Campus Handover &amp; Illustration</legend>

            <div className="form-group">
              <label htmlFor="location">Preferred Campus Meeting Spot *</label>
              <select
                id="location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
                <option value="Other">Other Custom Campus Spot...</option>
              </select>

              {formData.location === 'Other' && (
                <input
                  type="text"
                  placeholder="Specify campus spot (e.g. 4th Floor IT Lab Corridor)"
                  value={formData.customLocation}
                  onChange={(e) => setFormData({ ...formData, customLocation: e.target.value })}
                  className="mt-2"
                />
              )}
              {errors.location && (
                <p className="text-xs text-[#9c2f26] font-bold mt-1 mb-0">{errors.location}</p>
              )}
            </div>

            <div className="form-row items-center">
              <div className="form-group mb-0">
                <label htmlFor="imageUpload">Upload Product Photo</label>
                <input
                  type="file"
                  id="imageUpload"
                  accept="image/*"
                  onChange={handleImageFileChange}
                />
                <div className="mt-3">
                  <span className="text-xs font-bold text-[#5a4a34] block mb-1.5">
                    Or pick an illustrated campus card:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_SAMPLE_IMAGES.map((preset) => (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => handleSelectPreset(preset.url)}
                        className="btn btn-outline btn-sm"
                      >
                        {preset.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="rounded-xl bg-[#f1e6cb] border-2 border-dashed border-[#2c2115] aspect-4/3 flex items-center justify-center overflow-hidden p-2">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Selected item preview"
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="text-center text-xs text-[#5a4a34] p-4">
                    <Upload className="w-7 h-7 mx-auto mb-1.5" />
                    <span>Image preview appears here</span>
                  </div>
                )}
              </div>
            </div>
          </fieldset>

          <div className="form-actions">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn btn-outline"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn btn-primary"
            >
              {submitting ? 'Pinning Item...' : 'Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
