/**
 * CHOP CHOP Cart State Manager
 * Real working shopping cart system with reactive subscribers and local persistence.
 */

const STORAGE_KEY = 'chopchop_order_cart_v1';
const LEGACY_STORAGE_KEY = 'foodies_order_cart_v1';

export class CartManager {
  constructor() {
    this.items = []; // Array of { id, itemId, name, size, sizeLabel, unitPrice, quantity, image, isPizza }
    this.listeners = new Set();
    this.load();
  }

  // Load cart from localStorage if available (with fallback to legacy key)
  load() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const raw = window.localStorage.getItem(STORAGE_KEY) || window.localStorage.getItem(LEGACY_STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            this.items = parsed;
          }
        }
      }
    } catch (err) {
      console.warn('Unable to load stored cart:', err);
      this.items = [];
    }
  }

  // Save cart to localStorage
  save() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
      }
    } catch (err) {
      console.warn('Unable to persist cart:', err);
    }
  }

  // Subscribe to cart changes
  subscribe(callback) {
    this.listeners.add(callback);
    callback(this.getState());
    return () => this.listeners.delete(callback);
  }

  notify() {
    this.save();
    const state = this.getState();
    this.listeners.forEach(cb => {
      try {
        cb(state);
      } catch (err) {
        console.error('Error in cart listener:', err);
      }
    });
  }

  // Helper unique key for cart items (item id + size + modifiersKey)
  static generateCartItemId(itemId, size, modKey = '') {
    let key = size ? `${itemId}__${size}` : itemId;
    if (modKey) key += `__${modKey}`;
    return key;
  }

  /**
   * Add item to cart
   * @param {Object} item - Product item from MENU_ITEMS
   * @param {Object|null} size - Selected size { size: 'REGULAR'|'MEDIUM'|'LARGE', label: 'Regular', price: 4.00 }
   * @param {number} quantity - Quantity to add
   * @param {Object|null} modifiers - Selected modifiers object
   * @param {string} modifiersText - Formatted modifiers summary text
   */
  addItem(item, size = null, quantity = 1, modifiers = null, modifiersText = '') {
    const qty = Math.max(1, parseInt(quantity, 10) || 1);
    const unitPrice = size ? size.price : (item.price || 0);
    const sizeCode = size ? size.size : null;
    const sizeLabel = size ? size.label : null;
    const modKey = modifiersText ? modifiersText.toLowerCase().replace(/[^a-z0-9]/g, '_') : '';
    const cartItemId = CartManager.generateCartItemId(item.id, sizeCode, modKey);

    const existingIndex = this.items.findIndex(ci => ci.id === cartItemId);

    if (existingIndex > -1) {
      // Increment quantity
      this.items[existingIndex].quantity += qty;
    } else {
      // New item
      this.items.push({
        id: cartItemId,
        itemId: item.id,
        name: item.name,
        size: sizeCode,
        sizeLabel: sizeLabel,
        modifiers: modifiers,
        modifiersText: modifiersText,
        unitPrice: unitPrice,
        quantity: qty,
        image: item.image,
        alt: item.alt || item.name,
        category: item.category,
        isPizza: !!item.isPizza,
      });
    }

    this.notify();
    return {
      cartItemId,
      unitPrice,
      quantity: qty,
      sizeLabel,
      modifiersText,
    };
  }

  /**
   * Update quantity of a specific cart item
   * @param {string} cartItemId 
   * @param {number} newQuantity 
   */
  updateQuantity(cartItemId, newQuantity) {
    const qty = parseInt(newQuantity, 10);
    const index = this.items.findIndex(ci => ci.id === cartItemId);
    if (index === -1) return;

    if (qty <= 0) {
      this.removeItem(cartItemId);
      return;
    }

    this.items[index].quantity = qty;
    this.notify();
  }

  /**
   * Increment quantity by 1
   */
  increment(cartItemId) {
    const index = this.items.findIndex(ci => ci.id === cartItemId);
    if (index > -1) {
      this.items[index].quantity += 1;
      this.notify();
    }
  }

  /**
   * Decrement quantity by 1 (removes if reaches 0)
   */
  decrement(cartItemId) {
    const index = this.items.findIndex(ci => ci.id === cartItemId);
    if (index > -1) {
      if (this.items[index].quantity > 1) {
        this.items[index].quantity -= 1;
        this.notify();
      } else {
        this.removeItem(cartItemId);
      }
    }
  }

  /**
   * Remove item from cart completely
   */
  removeItem(cartItemId) {
    const prevLen = this.items.length;
    this.items = this.items.filter(ci => ci.id !== cartItemId);
    if (this.items.length !== prevLen) {
      this.notify();
    }
  }

  /**
   * Clear all items in cart
   */
  clear() {
    this.items = [];
    this.notify();
  }

  /**
   * Get total count of individual items
   */
  getItemCount() {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  /**
   * Get total monetary value
   */
  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);
  }

  /**
   * Formats numeric price to string (e.g. $5 or $5.50)
   */
  static formatPrice(amount) {
    const fixed = Number(amount).toFixed(2);
    return `$${fixed.replace(/\.00$/, '')}`;
  }

  /**
   * Get immutable snapshot of current state
   */
  getState() {
    const itemCount = this.getItemCount();
    const total = this.getTotal();
    const formattedTotal = CartManager.formatPrice(total);
    const itemWord = itemCount === 1 ? 'item' : 'items';

    return {
      items: [...this.items],
      itemCount,
      total,
      formattedTotal,
      itemWord,
      isEmpty: itemCount === 0,
    };
  }
}

// Export singleton instance for unified store
export const cart = new CartManager();
