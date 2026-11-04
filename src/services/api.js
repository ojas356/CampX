/**
 * CampX API Service Layer
 * Communicates with the Kotlin Spring Boot backend REST API.
 * Uses the native Fetch API as required.
 */

import { PRODUCT_ILLUSTRATIONS } from '../utils/productIllustrations.js';

const API_BASE_URL = typeof window !== 'undefined' && window.CAMPX_API_URL 
  ? window.CAMPX_API_URL 
  : '/api';

// Initial seed data for standalone preview mode
const INITIAL_STUDENTS = [
  {
    id: 1,
    name: "Arav Patel",
    collegeEmail: "arav.patel@apsit.edu.in",
    phoneNumber: "+919820112233",
    createdAt: "2026-08-15T10:00:00"
  },
  {
    id: 2,
    name: "Neha Sharma",
    collegeEmail: "neha.sharma@apsit.edu.in",
    phoneNumber: "+919876543210",
    createdAt: "2026-08-16T11:30:00"
  },
  {
    id: 3,
    name: "Rohit Verma",
    collegeEmail: "rohit.verma@apsit.edu.in",
    phoneNumber: "+919765432109",
    createdAt: "2026-08-18T09:15:00"
  }
];

const INITIAL_PRODUCTS = [
  {
    id: 1,
    productName: "Casio fx-991EX ClassWiz Scientific Calculator",
    description: "Mint condition, used for two semesters in FE/SE engineering. Original protective sliding case included. Genuine solar + battery powered with QR code support for graphs.",
    category: "Electronics",
    price: 850,
    condition: "Second-hand",
    imageUrl: PRODUCT_ILLUSTRATIONS.calculator,
    location: "APSIT Main Canteen or 3rd Floor IT Lab",
    status: "ACTIVE",
    seller: INITIAL_STUDENTS[0],
    createdAt: "2026-10-18T14:30:00",
    updatedAt: "2026-10-18T14:30:00"
  },
  {
    id: 2,
    productName: "Omega Mini Drafter & Sheet Holder Tube",
    description: "Complete Engineering Graphics & Design set. Includes steel clamp mini drafter with precision scale, sheet container tube, and set squares. No cracks or loose joints.",
    category: "Engineering Tools",
    price: 450,
    condition: "Second-hand",
    imageUrl: PRODUCT_ILLUSTRATIONS.drafter,
    location: "Mechanical Workshop or Ground Floor Foyer",
    status: "ACTIVE",
    seller: INITIAL_STUDENTS[0],
    createdAt: "2026-10-19T09:15:00",
    updatedAt: "2026-10-19T09:15:00"
  },
  {
    id: 3,
    productName: "Applied Mathematics Vol. 3 (Dr. G.V. Kumbhojkar)",
    description: "Clean copy with pencil annotations only on formula summaries. Essential for Semester 3 Computer & IT students. Covers Laplace, Fourier, and Complex Analysis.",
    category: "Books & Notes",
    price: 350,
    condition: "Second-hand",
    imageUrl: PRODUCT_ILLUSTRATIONS.book,
    location: "Central Library Reading Room or Gate 1",
    status: "ACTIVE",
    seller: INITIAL_STUDENTS[1],
    createdAt: "2026-10-19T16:45:00",
    updatedAt: "2026-10-19T16:45:00"
  },
  {
    id: 4,
    productName: "Brand New White Lab Coat (Size L, 40)",
    description: "Unused 100% cotton lab coat required for Chemistry Lab and Workshop practices. Bought wrong size, tags still intact. Includes chest pocket with pen holder.",
    category: "Lab Coats & Kits",
    price: 300,
    condition: "New",
    imageUrl: PRODUCT_ILLUSTRATIONS.labcoat,
    location: "Chemistry Lab 1st Floor or Girls Common Room",
    status: "ACTIVE",
    seller: INITIAL_STUDENTS[1],
    createdAt: "2026-10-20T11:00:00",
    updatedAt: "2026-10-20T11:00:00"
  },
  {
    id: 5,
    productName: "Arduino Uno R3 Starter Kit with Sensor Modules",
    description: "Complete starter pack for Mini-Projects and IoT lab work. Comes with Breadboard, jumper wires, ultrasonic sensor, DHT11, LED matrix, and servo motor.",
    category: "Electronics",
    price: 950,
    condition: "Second-hand",
    imageUrl: PRODUCT_ILLUSTRATIONS.arduino,
    location: "EXTC Embedded Lab or Main Gate",
    status: "ACTIVE",
    seller: INITIAL_STUDENTS[2],
    createdAt: "2026-10-20T15:20:00",
    updatedAt: "2026-10-20T15:20:00"
  }
];

const INITIAL_CONVERSATIONS = [
  {
    id: 1,
    productId: 1,
    productName: "Casio fx-991EX ClassWiz Scientific Calculator",
    productPrice: 850,
    productImageUrl: PRODUCT_ILLUSTRATIONS.calculator,
    buyer: INITIAL_STUDENTS[1],
    seller: INITIAL_STUDENTS[0],
    lastMessage: "Hi Neha! Yes it is available. 1:15 PM at the canteen tables works great for me. See you then!",
    lastMessageTime: "2026-10-21T01:45:00",
    updatedAt: "2026-10-21T01:45:00"
  }
];

const INITIAL_MESSAGES = [
  {
    id: 1,
    conversationId: 1,
    senderId: 2,
    senderName: "Neha Sharma",
    content: "Hey Arav! Is the Casio calculator still available? Can we meet around 1:15 PM near the canteen?",
    timestamp: "2026-10-21T01:30:00"
  },
  {
    id: 2,
    conversationId: 1,
    senderId: 1,
    senderName: "Arav Patel",
    content: "Hi Neha! Yes it is available. 1:15 PM at the canteen tables works great for me. See you then!",
    timestamp: "2026-10-21T01:45:00"
  }
];

// Helper to initialize local storage store
function getStore(key, defaultVal) {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(`campx_v2_${key}`);
    return item ? JSON.parse(item) : defaultVal;
  } catch (e) {
    return defaultVal;
  }
}

function setStore(key, value) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(`campx_v2_${key}`, JSON.stringify(value));
  } catch (e) {
    console.error("Storage error:", e);
  }
}

// Ensure initial seed in localStorage if empty
if (typeof window !== 'undefined') {
  if (!localStorage.getItem('campx_v2_products')) {
    setStore('products', INITIAL_PRODUCTS);
  }
  if (!localStorage.getItem('campx_v2_students')) {
    setStore('students', INITIAL_STUDENTS);
  }
  if (!localStorage.getItem('campx_v2_conversations')) {
    setStore('conversations', INITIAL_CONVERSATIONS);
  }
  if (!localStorage.getItem('campx_v2_messages')) {
    setStore('messages', INITIAL_MESSAGES);
  }
}

const localStore = {
  getProducts: (category, query) => {
    let list = getStore('products', INITIAL_PRODUCTS);
    if (category && category !== 'All') {
      list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
    }
    if (query && query.trim()) {
      const q = query.toLowerCase().trim();
      list = list.filter(p => 
        p.productName.toLowerCase().includes(q) || 
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    }
    return list;
  },

  getProductById: (id) => {
    const list = getStore('products', INITIAL_PRODUCTS);
    const item = list.find(p => String(p.id) === String(id));
    if (!item) throw new Error("Product not found");
    return item;
  },

  createProduct: (productData, student) => {
    const list = getStore('products', INITIAL_PRODUCTS);
    const newId = list.length > 0 ? Math.max(...list.map(p => Number(p.id) || 0)) + 1 : 1;
    const newProduct = {
      id: newId,
      productName: productData.productName.trim(),
      description: productData.description.trim(),
      category: productData.category.trim(),
      price: Number(productData.price),
      condition: productData.condition,
      imageUrl: productData.imageUrl || PRODUCT_ILLUSTRATIONS.book,
      location: productData.location.trim(),
      status: "ACTIVE",
      seller: {
        id: student.id,
        name: student.name,
        collegeEmail: student.collegeEmail,
        phoneNumber: student.phoneNumber
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(newProduct);
    setStore('products', list);
    return newProduct;
  },

  updateProduct: (id, productData, studentId) => {
    const list = getStore('products', INITIAL_PRODUCTS);
    const index = list.findIndex(p => String(p.id) === String(id));
    if (index === -1) throw new Error("Product not found");
    
    if (String(list[index].seller.id) !== String(studentId)) {
      throw new Error("Unauthorized: You can only edit your own listings.");
    }

    list[index] = {
      ...list[index],
      productName: productData.productName.trim(),
      description: productData.description.trim(),
      category: productData.category.trim(),
      price: Number(productData.price),
      condition: productData.condition,
      imageUrl: productData.imageUrl || list[index].imageUrl,
      location: productData.location.trim(),
      updatedAt: new Date().toISOString()
    };
    setStore('products', list);
    return list[index];
  },

  deleteProduct: (id, studentId) => {
    const list = getStore('products', INITIAL_PRODUCTS);
    const index = list.findIndex(p => String(p.id) === String(id));
    if (index === -1) throw new Error("Product not found");

    if (String(list[index].seller.id) !== String(studentId)) {
      throw new Error("Unauthorized: You can only delete your own listings.");
    }

    list.splice(index, 1);
    setStore('products', list);
    return { success: true };
  },

  markAsSold: (id, studentId) => {
    const list = getStore('products', INITIAL_PRODUCTS);
    const index = list.findIndex(p => String(p.id) === String(id));
    if (index === -1) throw new Error("Product not found");

    if (String(list[index].seller.id) !== String(studentId)) {
      throw new Error("Unauthorized: You can only mark your own listings as sold.");
    }

    list[index].status = "SOLD";
    list[index].updatedAt = new Date().toISOString();
    setStore('products', list);
    return list[index];
  },

  getMyListings: (studentId, status) => {
    const list = getStore('products', INITIAL_PRODUCTS);
    let userListings = list.filter(p => String(p.seller.id) === String(studentId));
    if (status) {
      userListings = userListings.filter(p => p.status === status);
    }
    return userListings;
  },

  getConversations: (studentId) => {
    const convs = getStore('conversations', INITIAL_CONVERSATIONS);
    return convs.filter(c => 
      String(c.buyer.id) === String(studentId) || 
      String(c.seller.id) === String(studentId)
    );
  },

  getMessages: (convId, studentId) => {
    const convs = getStore('conversations', INITIAL_CONVERSATIONS);
    const conv = convs.find(c => String(c.id) === String(convId));
    if (!conv) throw new Error("Conversation not found");

    if (String(conv.buyer.id) !== String(studentId) && String(conv.seller.id) !== String(studentId)) {
      throw new Error("Access denied: You are not a participant in this conversation.");
    }

    const messages = getStore('messages', INITIAL_MESSAGES);
    return messages.filter(m => String(m.conversationId) === String(convId));
  },

  startConversation: (productId, initialMessage, buyer) => {
    const products = getStore('products', INITIAL_PRODUCTS);
    const product = products.find(p => String(p.id) === String(productId));
    if (!product) throw new Error("Product not found");

    if (String(product.seller.id) === String(buyer.id)) {
      throw new Error("You cannot start a chat conversation for your own product.");
    }

    const convs = getStore('conversations', INITIAL_CONVERSATIONS);
    let conv = convs.find(c => 
      String(c.productId) === String(productId) && 
      String(c.buyer.id) === String(buyer.id)
    );

    if (!conv) {
      const newId = convs.length > 0 ? Math.max(...convs.map(c => Number(c.id) || 0)) + 1 : 1;
      conv = {
        id: newId,
        productId: product.id,
        productName: product.productName,
        productPrice: product.price,
        productImageUrl: product.imageUrl,
        buyer: {
          id: buyer.id,
          name: buyer.name,
          collegeEmail: buyer.collegeEmail,
          phoneNumber: buyer.phoneNumber
        },
        seller: {
          id: product.seller.id,
          name: product.seller.name,
          collegeEmail: product.seller.collegeEmail,
          phoneNumber: product.seller.phoneNumber
        },
        lastMessage: initialMessage,
        lastMessageTime: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      convs.unshift(conv);
      setStore('conversations', convs);
    }

    if (initialMessage && initialMessage.trim()) {
      const messages = getStore('messages', INITIAL_MESSAGES);
      const newMsgId = messages.length > 0 ? Math.max(...messages.map(m => Number(m.id) || 0)) + 1 : 1;
      const msg = {
        id: newMsgId,
        conversationId: conv.id,
        senderId: buyer.id,
        senderName: buyer.name,
        content: initialMessage.trim(),
        timestamp: new Date().toISOString()
      };
      messages.push(msg);
      setStore('messages', messages);

      conv.lastMessage = msg.content;
      conv.lastMessageTime = msg.timestamp;
      conv.updatedAt = msg.timestamp;
      setStore('conversations', convs);
    }

    return conv;
  },

  sendMessage: (convId, content, sender) => {
    const convs = getStore('conversations', INITIAL_CONVERSATIONS);
    const conv = convs.find(c => String(c.id) === String(convId));
    if (!conv) throw new Error("Conversation not found");

    if (String(conv.buyer.id) !== String(sender.id) && String(conv.seller.id) !== String(sender.id)) {
      throw new Error("Access denied: You are not a participant in this conversation.");
    }

    const messages = getStore('messages', INITIAL_MESSAGES);
    const newMsgId = messages.length > 0 ? Math.max(...messages.map(m => Number(m.id) || 0)) + 1 : 1;
    const msg = {
      id: newMsgId,
      conversationId: conv.id,
      senderId: sender.id,
      senderName: sender.name,
      content: content.trim(),
      timestamp: new Date().toISOString()
    };
    messages.push(msg);
    setStore('messages', messages);

    conv.lastMessage = msg.content;
    conv.lastMessageTime = msg.timestamp;
    conv.updatedAt = msg.timestamp;
    setStore('conversations', convs);

    return msg;
  }
};

async function request(endpoint, options = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('campx_token') : null;
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    throw new Error(errData.message || `Request failed with status ${res.status}`);
  }

  return await res.json();
}

export const api = {
  register: async (studentData) => {
    try {
      return await request('/auth/register', {
        method: 'POST',
        body: JSON.stringify(studentData),
      });
    } catch (e) {
      const email = studentData.collegeEmail.trim().toLowerCase();
      if (!email.endsWith('@apsit.edu.in')) {
        throw new Error('Only official @apsit.edu.in student emails are allowed to register.');
      }
      const students = getStore('students', INITIAL_STUDENTS);
      if (students.some(s => s.collegeEmail.toLowerCase() === email)) {
        throw new Error('An account with this email already exists.');
      }
      const newStudent = {
        id: students.length + 1,
        name: studentData.name.trim(),
        collegeEmail: email,
        phoneNumber: studentData.phoneNumber.trim(),
        createdAt: new Date().toISOString()
      };
      students.push(newStudent);
      setStore('students', students);
      const token = `mock-jwt-token-${newStudent.id}`;
      return { token, student: newStudent };
    }
  },

  login: async (credentials) => {
    try {
      return await request('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
    } catch (e) {
      const email = credentials.collegeEmail.trim().toLowerCase();
      const students = getStore('students', INITIAL_STUDENTS);
      const student = students.find(s => s.collegeEmail.toLowerCase() === email);
      if (!student) {
        throw new Error('Invalid email or password.');
      }
      const token = `mock-jwt-token-${student.id}`;
      return { token, student };
    }
  },

  getProfile: async () => {
    try {
      return await request('/auth/me');
    } catch (e) {
      const user = getStore('currentUser', INITIAL_STUDENTS[0]);
      return user;
    }
  },

  updateProfile: async (data, studentId) => {
    try {
      return await request('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    } catch (e) {
      const students = getStore('students', INITIAL_STUDENTS);
      const student = students.find(s => String(s.id) === String(studentId));
      if (student) {
        student.name = data.name.trim();
        student.phoneNumber = data.phoneNumber.trim();
        setStore('students', students);
      }
      return student;
    }
  },

  getProducts: async (category, query) => {
    try {
      const params = new URLSearchParams();
      if (category && category !== 'All') params.append('category', category);
      if (query) params.append('query', query);
      const qs = params.toString() ? `?${params.toString()}` : '';
      return await request(`/products${qs}`);
    } catch (e) {
      return localStore.getProducts(category, query);
    }
  },

  getProduct: async (id) => {
    try {
      return await request(`/products/${id}`);
    } catch (e) {
      return localStore.getProductById(id);
    }
  },

  createProduct: async (productData, student) => {
    try {
      return await request('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
      });
    } catch (e) {
      return localStore.createProduct(productData, student);
    }
  },

  updateProduct: async (id, productData, studentId) => {
    try {
      return await request(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
      });
    } catch (e) {
      return localStore.updateProduct(id, productData, studentId);
    }
  },

  deleteProduct: async (id, studentId) => {
    try {
      return await request(`/products/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      return localStore.deleteProduct(id, studentId);
    }
  },

  markAsSold: async (id, studentId) => {
    try {
      return await request(`/products/${id}/sold`, {
        method: 'PATCH',
      });
    } catch (e) {
      return localStore.markAsSold(id, studentId);
    }
  },

  getMyListings: async (studentId, status) => {
    try {
      const qs = status ? `?status=${status}` : '';
      return await request(`/products/my-listings${qs}`);
    } catch (e) {
      return localStore.getMyListings(studentId, status);
    }
  },

  getConversations: async (studentId) => {
    try {
      return await request('/chat/conversations');
    } catch (e) {
      return localStore.getConversations(studentId);
    }
  },

  getMessages: async (conversationId, studentId) => {
    try {
      return await request(`/chat/conversations/${conversationId}/messages`);
    } catch (e) {
      return localStore.getMessages(conversationId, studentId);
    }
  },

  startConversation: async (productId, initialMessage, buyer) => {
    try {
      return await request('/chat/start', {
        method: 'POST',
        body: JSON.stringify({ productId, initialMessage }),
      });
    } catch (e) {
      return localStore.startConversation(productId, initialMessage, buyer);
    }
  },

  sendMessage: async (conversationId, content, sender) => {
    try {
      return await request(`/chat/conversations/${conversationId}/messages`, {
        method: 'POST',
        body: JSON.stringify({ content }),
      });
    } catch (e) {
      return localStore.sendMessage(conversationId, content, sender);
    }
  },

  getDemoStudents: () => {
    return getStore('students', INITIAL_STUDENTS);
  }
};
