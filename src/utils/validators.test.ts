import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validateStudentEmail,
  validatePassword,
  validatePhoneNumber,
  validateProduct,
  canStudentModifyProduct,
  canParticipateInChat
} from './validators.js';

test('Email validation: strictly allows only @apsit.edu.in emails', () => {
  // Valid APSIT emails
  assert.equal(validateStudentEmail('arav.patel@apsit.edu.in').valid, true);
  assert.equal(validateStudentEmail('neha.sharma@apsit.edu.in').valid, true);
  assert.equal(validateStudentEmail('student123@apsit.edu.in').valid, true);

  // Invalid domains
  assert.equal(validateStudentEmail('john@gmail.com').valid, false);
  assert.equal(validateStudentEmail('user@yahoo.co.in').valid, false);
  assert.equal(validateStudentEmail('attacker@apsit.edu.in.phishing.com').valid, false);
  assert.equal(validateStudentEmail('fake@othercollege.edu.in').valid, false);
  assert.equal(validateStudentEmail('').valid, false);
});

test('Password validation: requires at least 6 characters', () => {
  assert.equal(validatePassword('pass123').valid, true);
  assert.equal(validatePassword('12345').valid, false);
  assert.equal(validatePassword('').valid, false);
});

test('Phone number validation: validates Indian 10-digit mobile numbers', () => {
  assert.equal(validatePhoneNumber('9876543210').valid, true);
  assert.equal(validatePhoneNumber('+919876543210').valid, true);
  assert.equal(validatePhoneNumber('12345').valid, false);
  assert.equal(validatePhoneNumber('abcdefghij').valid, false);
});

test('Product validation: validates required fields, price, and condition', () => {
  const validProduct = {
    productName: 'Casio fx-991EX Scientific Calculator',
    description: 'Working fine with fresh battery, bought 6 months ago.',
    category: 'Electronics',
    price: 850,
    condition: 'Second-hand',
    location: 'Main Canteen or IT Lab 301'
  };
  const result = validateProduct(validProduct);
  assert.equal(result.valid, true);

  const invalidProduct = {
    productName: '',
    description: '',
    category: '',
    price: -50,
    condition: 'Broken',
    location: ''
  };
  const invalidResult = validateProduct(invalidProduct);
  assert.equal(invalidResult.valid, false);
  assert.ok(invalidResult.errors.productName);
  assert.ok(invalidResult.errors.price);
  assert.ok(invalidResult.errors.condition);
  assert.ok(invalidResult.errors.location);
});

test('Student ownership check: only listing owner can modify or delete', () => {
  const product = {
    id: 101,
    productName: 'Drafting Kit',
    seller: { id: 1, name: 'Arav Patel' }
  };

  assert.equal(canStudentModifyProduct(1, product), true);
  assert.equal(canStudentModifyProduct(2, product), false);
  assert.equal(canStudentModifyProduct(null as any, product), false);
});

test('Chat authorization: only buyer or seller can participate in conversation', () => {
  const conversation = {
    id: 5,
    buyerId: 2,
    sellerId: 1
  };

  assert.equal(canParticipateInChat(1, conversation), true);
  assert.equal(canParticipateInChat(2, conversation), true);
  assert.equal(canParticipateInChat(3, conversation), false);
  assert.equal(canParticipateInChat(null as any, conversation), false);
});
