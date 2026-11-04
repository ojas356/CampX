/**
 * Validation utilities for CampX - APSIT Student Marketplace
 */

/**
 * Validates that an email belongs strictly to the approved APSIT domain (apsit.edu.in)
 * @param {string} email
 * @returns {{ valid: boolean, message?: string }}
 */
export function validateStudentEmail(email) {
  if (!email || typeof email !== 'string') {
    return { valid: false, message: 'College email is required.' };
  }

  const cleanEmail = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@apsit\.edu\.in$/;

  if (!emailRegex.test(cleanEmail)) {
    return {
      valid: false,
      message: 'Only official @apsit.edu.in student emails are allowed to register.'
    };
  }

  return { valid: true };
}

/**
 * Validates password strength (minimum 6 characters, must contain letters and numbers)
 * @param {string} password
 * @returns {{ valid: boolean, message?: string }}
 */
export function validatePassword(password) {
  if (!password || typeof password !== 'string') {
    return { valid: false, message: 'Password is required.' };
  }

  if (password.length < 6) {
    return { valid: false, message: 'Password must be at least 6 characters long.' };
  }

  return { valid: true };
}

/**
 * Validates phone number for Indian mobile numbers (10 digits, optionally starting with +91)
 * @param {string} phone
 * @returns {{ valid: boolean, message?: string }}
 */
export function validatePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, message: 'Phone number is required.' };
  }

  const cleaned = phone.replace(/[\s\-()]/g, '');
  const phoneRegex = /^(\+91)?[6-9]\d{9}$/;

  if (!phoneRegex.test(cleaned)) {
    return {
      valid: false,
      message: 'Please enter a valid 10-digit mobile number (e.g. 9876543210).'
    };
  }

  return { valid: true };
}

/**
 * Validates product listing inputs
 * @param {Object} product
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateProduct(product) {
  const errors = {};

  if (!product.productName || !product.productName.trim()) {
    errors.productName = 'Product name is required.';
  } else if (product.productName.trim().length < 3) {
    errors.productName = 'Product name must be at least 3 characters.';
  }

  if (!product.description || !product.description.trim()) {
    errors.description = 'Description is required.';
  }

  if (!product.category || !product.category.trim()) {
    errors.category = 'Category is required.';
  }

  const numPrice = Number(product.price);
  if (isNaN(numPrice) || numPrice <= 0) {
    errors.price = 'Price must be a valid positive number.';
  }

  if (!product.condition || !['New', 'Second-hand'].includes(product.condition)) {
    errors.condition = 'Condition must be either New or Second-hand.';
  }

  if (!product.location || !product.location.trim()) {
    errors.location = 'Preferred campus meeting point is required.';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors
  };
}

/**
 * Verifies if a student is the owner of a product
 * @param {number|string} currentStudentId
 * @param {Object} product
 * @returns {boolean}
 */
export function canStudentModifyProduct(currentStudentId, product) {
  if (!currentStudentId || !product) return false;
  const sellerId = product.seller?.id || product.sellerId || product.student?.id || product.studentId;
  return String(currentStudentId) === String(sellerId);
}

/**
 * Checks if a student can participate in a chat conversation
 * @param {number|string} currentStudentId
 * @param {Object} conversation
 * @returns {boolean}
 */
export function canParticipateInChat(currentStudentId, conversation) {
  if (!currentStudentId || !conversation) return false;
  const buyerId = conversation.buyerId || conversation.buyer?.id;
  const sellerId = conversation.sellerId || conversation.seller?.id;
  const strId = String(currentStudentId);
  return strId === String(buyerId) || strId === String(sellerId);
}
