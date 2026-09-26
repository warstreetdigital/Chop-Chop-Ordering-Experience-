/**
 * CHOP CHOP Digital Menu — Menu Controller
 * Compact scannable menu previews paired with an immersive, premium Product View experience.
 */

import { MENU_CATEGORIES, MENU_ITEMS } from '../data/menu.js';
import { cart } from './cart.js';
import { getItemGraphic } from './foodGraphics.js';
import { MotionController } from './motionController.js';

const CATEGORY_EDITORIAL_META = {
  breakfast: {
    label: 'BREAKFAST',
    subtitle: 'hearty morning grills, eggs & artisanal coffee'
  },
  mains: {
    label: 'MAINS & STEAKS',
    subtitle: '14-day aged cuts, fresh Kariba bream & flame-grilled favourites'
  },
  allday: {
    label: 'ALL DAY',
    subtitle: 'toasted sandwiches, loaded wraps & classic diner plates'
  },
  burgers: {
    label: 'BURGERS',
    subtitle: 'artisan flame-seared patties on toasted brioche with hand-cut fries'
  },
  platters: {
    label: 'PLATTERS',
    subtitle: 'generous sharing boards of ribs, wings & skewers for the table'
  },
  sides: {
    label: 'SIDES',
    subtitle: 'crispy hand-cut chips, beer-battered rings & fresh accompaniments'
  },
  pizza: {
    label: 'PIZZA',
    subtitle: 'stone-baked thin crusts topped with rich mozzarella & fresh basil'
  },
  salads: {
    label: 'SALADS',
    subtitle: 'crisp garden bowls, creamy feta, avocado & house vinaigrettes'
  },
  desserts: {
    label: 'TASTY TREATS',
    subtitle: 'warm Belgian waffles, gourmet sundaes & sweet artisanal finishes'
  },
  drinks: {
    label: 'COFFEE & DRINKS',
    subtitle: 'single-origin barista roasts, fresh cold juices & sodas'
  },
  mocktails: {
    label: 'MOCKTAILS',
    subtitle: 'handcrafted botanical refreshers, crushed ice & citrus blends'
  }
};

export class MenuController {
  constructor(items = null, categories = null) {
    this.container = document.getElementById('menu-items-container');
    this.categoryTabs = document.querySelectorAll('.category-tab');
    this.activeCategory = 'all';
    this.items = items || MENU_ITEMS;
    this.categories = categories || MENU_CATEGORIES;

    // Modal Elements
    this.modal = document.getElementById('product-view-modal');
    this.modalCard = document.getElementById('product-modal-card');
    this.modalCloseBtn = document.getElementById('btn-close-modal');
    this.modalFoodImg = document.getElementById('modal-food-img');
    this.modalCategoryBadge = document.getElementById('modal-category-badge');
    this.modalTitle = document.getElementById('modal-product-title');
    this.modalDesc = document.getElementById('modal-product-desc');
    this.modalSizesSection = document.getElementById('modal-sizes-section');
    this.modalSizesGroup = document.getElementById('modal-sizes-group');
    this.modalPortionSection = document.getElementById('modal-portion-section');
    this.modalPortionPrice = document.getElementById('modal-portion-price');
    this.modalModifiersContainer = document.getElementById('modal-modifiers-container');
    this.qtyCountVal = document.getElementById('qty-count-val');
    this.btnQtyMinus = document.getElementById('btn-qty-minus');
    this.btnQtyPlus = document.getElementById('btn-qty-plus');
    this.btnModalAddToOrder = document.getElementById('btn-modal-add-to-order');
    this.modalCalcTotal = document.getElementById('modal-calc-total');
    this.btnModalLabel = document.getElementById('btn-add-label');

    // Toast
    this.toast = document.getElementById('chopchop-toast') || document.getElementById('foodies-toast');
    this.toastMsg = document.getElementById('toast-message');
    this.toastTimeout = null;

    // Sticky Cart Elements
    this.stickyCartContainer = document.getElementById('sticky-cart-container');
    this.btnStickyCart = document.getElementById('btn-sticky-cart');
    this.cartBtnCount = document.getElementById('cart-btn-count');
    this.cartBtnTotal = document.getElementById('cart-btn-total');

    // Cart Drawer Elements
    this.cartModal = document.getElementById('cart-drawer-modal');
    this.cartDrawerCard = document.getElementById('cart-drawer-card');
    this.btnCloseCart = document.getElementById('btn-close-cart');
    this.btnClearCart = document.getElementById('btn-clear-cart');
    this.cartItemsList = document.getElementById('cart-items-list');
    this.cartDrawerItemsCount = document.getElementById('cart-drawer-items-count');
    this.cartModalGrandTotal = document.getElementById('cart-modal-grand-total');
    this.cartDrawerFooter = document.getElementById('cart-drawer-footer');
    this.btnCartContinue = document.getElementById('btn-cart-continue-browsing');
    this.btnCartSendOrder = document.getElementById('btn-cart-send-order');
    this.btnSendPrice = document.getElementById('btn-send-price');

    // Cart Confirmation Step Elements (READY TO SEND?)
    this.cartConfirmView = document.getElementById('cart-confirm-view');
    this.confirmItemsVal = document.getElementById('confirm-items-val');
    this.confirmTotalVal = document.getElementById('confirm-total-val');
    this.confirmErrorAlert = document.getElementById('confirm-error-alert');
    this.confirmErrorText = document.getElementById('confirm-error-text');
    this.btnConfirmSend = document.getElementById('btn-confirm-send');
    this.btnConfirmSendText = document.getElementById('btn-confirm-send-text');
    this.btnConfirmBack = document.getElementById('btn-confirm-back');

    // Cart Order Sent Success Elements
    this.cartSuccessView = document.getElementById('cart-success-view');
    this.successOrderNumber = document.getElementById('success-order-number');
    this.btnSuccessBackToMenu = document.getElementById('btn-success-back-to-menu');

    // Phase 5 Table Ordering & Fulfillment Elements
    this.checkoutTableSection = document.getElementById('checkout-table-section');
    this.tableMarkerCard = document.getElementById('table-marker-card');
    this.tableNumberInput = document.getElementById('table-number-input');
    this.tableNumberHint = document.getElementById('table-number-hint');
    this.tableInputError = document.getElementById('table-input-error');
    this.tableErrorText = document.getElementById('table-error-text');
    this.cartOptPickup = document.getElementById('cart-opt-pickup');
    this.cartOptDinein = document.getElementById('cart-opt-dinein');
    this.cartFulfillmentVal = document.getElementById('cart-fulfillment-val');
    this.confirmModeVal = document.getElementById('confirm-mode-val');
    this.confirmDestinationRow = document.getElementById('confirm-destination-row');
    this.confirmTableVal = document.getElementById('confirm-table-val');
    this.successFulfillmentCard = document.getElementById('success-fulfillment-card');
    this.successBadgeIcon = document.getElementById('success-badge-icon');
    this.successBadgeText = document.getElementById('success-badge-text');
    this.successFulfillmentMsg = document.getElementById('success-fulfillment-msg');

    this.tableNumber = '';

    // Active Cart View State: 'review' | 'confirm' | 'success'
    this.cartViewState = 'review';
    this.isOrderSubmitting = false;
    this.activeOrderMode = 'pickup';

    // Active Product View State
    this.activeItem = null;
    this.selectedSize = null;
    this.selectedModifiers = {};
    this.quantity = 1;
    this.lastFocusedElement = null;
    this.isSubmitting = false;

    // Motion & Scroll State Flags
    this.isAutoScrolling = false;
    this.isModalClosing = false;
    this.isCartClosing = false;
    this.revealObserver = null;
    this.scrollSpyObserver = null;

    // Central Art-Directed Motion & Depth System
    this.motion = new MotionController(this);
  }

  init() {
    this.renderMenu();
    this.initCategoryIndicator();
    this.bindCategoryTabs();
    this.bindOrderOptions();
    this.bindTableNumberInput();
    this.bindModalEvents();
    this.bindCartEvents();
    this.initCartSubscription();
    this.initScrollSpy();
    if (this.motion) {
      this.motion.init();
    }
  }

  // --------------------------------------------------------------------------
  // Order Mode Management (Pickup • Dine-In) & Two-Way Sync
  // --------------------------------------------------------------------------
  bindOrderOptions() {
    const optButtons = document.querySelectorAll('.order-opt-btn');
    optButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.currentTarget;
        const mode = targetBtn.getAttribute('data-mode');
        this.setOrderMode(mode, true);
      });
    });

    // Cart Drawer Fulfillment Mode Segmented Controls
    this.cartOptPickup?.addEventListener('click', () => {
      this.setOrderMode('pickup', true);
    });

    this.cartOptDinein?.addEventListener('click', () => {
      this.setOrderMode('dinein', true);
    });
  }

  setOrderMode(mode, showNotice = false) {
    this.activeOrderMode = mode === 'dinein' ? 'dinein' : 'pickup';
    const isDineIn = this.activeOrderMode === 'dinein';
    const modeLabel = isDineIn ? 'Dine-In' : 'Pickup';

    // Update Header buttons
    const optButtons = document.querySelectorAll('.order-opt-btn');
    optButtons.forEach(b => {
      const isActive = b.getAttribute('data-mode') === this.activeOrderMode;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-checked', isActive ? 'true' : 'false');
    });

    // Update Cart drawer buttons
    if (this.cartOptPickup) {
      this.cartOptPickup.classList.toggle('active', !isDineIn);
      this.cartOptPickup.setAttribute('aria-checked', !isDineIn ? 'true' : 'false');
    }
    if (this.cartOptDinein) {
      this.cartOptDinein.classList.toggle('active', isDineIn);
      this.cartOptDinein.setAttribute('aria-checked', isDineIn ? 'true' : 'false');
    }

    // Toggle Dine-In Table Section smoothly
    if (this.checkoutTableSection) {
      if (isDineIn) {
        this.checkoutTableSection.style.display = 'flex';
        if (this.tableNumberInput) {
          this.tableNumberInput.value = this.tableNumber;
        }
        this.updateTableHintAndFulfillment();
      } else {
        this.checkoutTableSection.style.display = 'none';
        this.clearTableError();
      }
    }

    this.updateFulfillmentDisplay();

    if (showNotice) {
      this.showToast(`Order mode: ${modeLabel}`);
    }
  }

  // --------------------------------------------------------------------------
  // Phase 5 Table Number Interaction & Real-time Formatting
  // --------------------------------------------------------------------------
  bindTableNumberInput() {
    if (!this.tableMarkerCard || !this.tableNumberInput) return;

    // Tapping anywhere on the physical digital marker card focuses the input
    this.tableMarkerCard.addEventListener('click', () => {
      this.tableNumberInput.focus();
    });

    this.tableNumberInput.addEventListener('focus', () => {
      this.tableMarkerCard.classList.add('is-focused');
      this.clearTableError();
      // On mobile viewports, smoothly scroll the marker card comfortably into view
      setTimeout(() => {
        this.tableMarkerCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    });

    this.tableNumberInput.addEventListener('blur', () => {
      this.tableMarkerCard.classList.remove('is-focused');
      if (this.tableNumber) {
        this.validateTableNumber(false);
      }
    });

    // Accessible numeric typing & subtle settle animation
    this.tableNumberInput.addEventListener('input', () => {
      const rawVal = this.tableNumberInput.value;
      const cleanVal = rawVal.replace(/\D/g, '').slice(0, 4);

      if (rawVal !== cleanVal) {
        this.tableNumberInput.value = cleanVal;
      }

      const hasChanged = cleanVal !== this.tableNumber;
      this.tableNumber = cleanVal;

      if (hasChanged && cleanVal) {
        // Trigger subtle number settle animation
        this.tableNumberInput.classList.remove('number-settle');
        void this.tableNumberInput.offsetWidth; // force reflow
        this.tableNumberInput.classList.add('number-settle');
        this.clearTableError();
      }

      this.updateTableHintAndFulfillment();
    });

    // Handle Enter key on mobile numeric keyboard
    this.tableNumberInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        if (this.validateTableNumber(true)) {
          this.tableNumberInput.blur();
        }
      }
    });
  }

  updateTableHintAndFulfillment() {
    if (this.tableNumberHint) {
      if (this.tableNumber) {
        this.tableNumberHint.textContent = `Chop Chop will bring your food to Table ${this.tableNumber}.`;
        this.tableNumberHint.classList.add('has-value');
      } else {
        this.tableNumberHint.textContent = 'Enter your table number so we can bring your food to you.';
        this.tableNumberHint.classList.remove('has-value');
      }
    }
    this.updateFulfillmentDisplay();
  }

  updateFulfillmentDisplay() {
    if (!this.cartFulfillmentVal) return;
    if (this.activeOrderMode === 'dinein') {
      const tbl = this.tableNumber ? `TABLE ${this.tableNumber}` : 'TABLE —';
      this.cartFulfillmentVal.textContent = `DINE-IN · ${tbl}`;
    } else {
      this.cartFulfillmentVal.textContent = 'PICKUP · COUNTER';
    }
  }

  clearTableError() {
    if (this.tableInputError) {
      this.tableInputError.style.display = 'none';
    }
    if (this.tableMarkerCard) {
      this.tableMarkerCard.classList.remove('has-error');
    }
  }

  showTableError(msg = 'Please enter your table number.') {
    if (this.tableErrorText) {
      this.tableErrorText.textContent = msg;
    }
    if (this.tableInputError) {
      this.tableInputError.style.display = 'flex';
    }
    if (this.tableMarkerCard) {
      this.tableMarkerCard.classList.remove('has-error');
      void this.tableMarkerCard.offsetWidth; // reflow
      this.tableMarkerCard.classList.add('has-error');
    }
  }

  validateTableNumber(focusOnError = true) {
    if (this.activeOrderMode !== 'dinein') return true;

    const trimmed = (this.tableNumber || '').trim();

    if (!trimmed) {
      this.showTableError('Please enter your table number.');
      if (focusOnError && this.tableNumberInput) {
        this.tableNumberInput.focus();
        this.tableMarkerCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return false;
    }

    if (!/^\d+$/.test(trimmed) || parseInt(trimmed, 10) <= 0) {
      this.showTableError('Please enter a valid table number.');
      if (focusOnError && this.tableNumberInput) {
        this.tableNumberInput.focus();
        this.tableMarkerCard?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      return false;
    }

    this.clearTableError();
    return true;
  }

  loadProducts(items, categories = null) {
    if (items && Array.isArray(items)) {
      this.items = items;
    }
    if (categories && Array.isArray(categories)) {
      this.categories = categories;
    }
    this.renderMenu();
    this.bindCardEvents();
    if (this.motion) {
      this.motion.initSectionChoreography();
      this.motion.initCardParallax();
    }
  }

  // --------------------------------------------------------------------------
  // Menu Rendering Logic (CHOP CHOP GRILL HOUSE & COFFEE SHOP)
  // Continuous editorial restaurant flow with sequential category chapters.
  // --------------------------------------------------------------------------
  renderMenu() {
    if (!this.container) return;

    const allItems = this.items || MENU_ITEMS;
    const allCategories = this.categories || MENU_CATEGORIES;

    // Sequence all published categories from allCategories
    const groups = allCategories.filter(c => c.id !== 'all');

    let html = '';
    groups.forEach(grp => {
      const grpItems = allItems.filter(item => {
        return item.category === grp.id || (Array.isArray(item.categories) && item.categories.includes(grp.id));
      });
      if (grpItems.length === 0) return;

      const editorial = CATEGORY_EDITORIAL_META[grp.id] || {
        label: grp.name.toUpperCase(),
        subtitle: grp.description || 'freshly prepared to order'
      };

      html += `
        <section class="category-group-section" id="section-${grp.id}" aria-labelledby="cat-heading-${grp.id}">
          <div class="category-group-header">
            <div class="category-header-left">
              <div class="category-title-wrap">
                <span class="category-title-pip" aria-hidden="true"></span>
                <h2 class="category-title" id="cat-heading-${grp.id}">${editorial.label}</h2>
              </div>
              <p class="category-subtitle">${editorial.subtitle}</p>
            </div>
            <span class="category-count">${grpItems.length} items</span>
          </div>
          <div class="grid-container">
            ${grpItems.map(item => this.createCompactCardMarkup(item)).join('')}
          </div>
        </section>
      `;
    });

    this.container.innerHTML = html;
    this.bindCardEvents();
    if (this.motion) {
      this.motion.initSectionChoreography();
      this.motion.initCardParallax();
    }
    this.initScrollSpy();
  }

  // --------------------------------------------------------------------------
  // Compact Menu Card Template (High Scannability & Flow)
  // --------------------------------------------------------------------------
  createCompactCardMarkup(item) {
    const hasSizes = item.sizes && item.sizes.length > 0;
    const startingPriceText = hasSizes 
      ? `From ${item.sizes[0].formattedPrice}`
      : item.formattedPrice;

    // Fast fallback visual vector if image network fails
    const fallbackSvg = getItemGraphic(item.id, item.category);

    return `
      <article 
        class="menu-card compact-card" 
        id="card-${item.id}" 
        data-item-id="${item.id}" 
        tabindex="0" 
        role="button" 
        aria-haspopup="dialog" 
        aria-label="${item.name}, ${startingPriceText}. Tap to view details and options."
      >
        <!-- Consistent Appetizing Food Thumbnail -->
        <div class="card-thumb-box">
          <img 
            src="${item.image}" 
            alt="${item.alt || item.name}" 
            class="card-thumb-img" 
            loading="lazy" 
            referrerPolicy="no-referrer"
            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
          />
          <div class="card-thumb-fallback" style="display: none;" aria-hidden="true">
            ${fallbackSvg}
          </div>
          ${item.categoryName ? `<span class="card-category-badge">${item.categoryName}</span>` : ''}
        </div>
        
        <!-- Product Details -->
        <div class="card-details">
          <div class="card-title-row">
            <h3 class="card-title">${item.name}</h3>
          </div>
          
          <!-- Short appetizing ingredient preview line -->
          <p class="card-short-desc">${item.shortDesc || item.description}</p>
          
          <!-- Starting Price & Clear Tap Action -->
          <div class="card-footer-row">
            <div class="card-price-tag">
              ${hasSizes ? '<span class="price-from-label">From</span>' : ''}
              <span class="price-val">${hasSizes ? item.sizes[0].formattedPrice : item.formattedPrice}</span>
            </div>

            <div class="btn-card-action" aria-hidden="true">
              <span class="btn-action-text">${hasSizes ? 'SELECT' : 'ADD'}</span>
              <svg class="btn-action-plus" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </article>
    `;
  }

  // --------------------------------------------------------------------------
  // Card Event Listeners & Tactile Motion Binding
  // --------------------------------------------------------------------------
  bindCardEvents() {
    const cards = this.container.querySelectorAll('.menu-card.compact-card');
    cards.forEach(card => {
      // Tactile touch pressure
      card.addEventListener('pointerdown', () => {
        card.classList.add('is-pressed');
      });
      card.addEventListener('pointerup', () => {
        card.classList.remove('is-pressed');
      });
      card.addEventListener('pointercancel', () => {
        card.classList.remove('is-pressed');
      });
      card.addEventListener('mouseleave', () => {
        card.classList.remove('is-pressed');
      });

      // Tap/click triggers Shared-Element cinematic expansion
      card.addEventListener('click', () => {
        const itemId = card.getAttribute('data-item-id');
        const item = (this.items || MENU_ITEMS).find(it => it.id === itemId);
        if (item) {
          if (this.motion) {
            this.motion.executeSharedElementTransition(card, this.modalFoodImg, () => {
              this.openProductView(item, card);
            });
          } else {
            this.openProductView(item, card);
          }
        }
      });

      // Keyboard accessibility (Enter or Space opens modal)
      card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          const itemId = card.getAttribute('data-item-id');
          const item = (this.items || MENU_ITEMS).find(it => it.id === itemId);
          if (item) {
            if (this.motion) {
              this.motion.executeSharedElementTransition(card, this.modalFoodImg, () => {
                this.openProductView(item, card);
              });
            } else {
              this.openProductView(item, card);
            }
          }
        }
      });
    });
  }

  // --------------------------------------------------------------------------
  // Product View (Modal / Bottom Sheet) Interaction
  // --------------------------------------------------------------------------
  openProductView(item, triggerElement = null) {
    if (!this.modal) return;

    this.activeItem = item;
    this.quantity = 1;
    this.lastFocusedElement = triggerElement || document.activeElement;
    this.isSubmitting = false;

    // Reset button state
    if (this.btnModalLabel) {
      this.btnModalLabel.textContent = 'ADD TO ORDER';
    }
    this.btnModalAddToOrder?.classList.remove('btn-added-success');

    // Populate Product Information
    if (this.modalFoodImg) {
      this.modalFoodImg.src = item.image;
      this.modalFoodImg.alt = item.alt || item.name;
    }

    if (this.modalCategoryBadge) {
      this.modalCategoryBadge.textContent = item.categoryName || 'Chop Chop Special';
    }

    if (this.modalTitle) {
      this.modalTitle.textContent = item.name;
    }

    if (this.modalDesc) {
      // Proper appetising full description
      this.modalDesc.textContent = item.description;
    }

    // Configure Sizes
    if (item.sizes && item.sizes.length > 0) {
      // Select first available size by default
      this.selectedSize = item.sizes[0];
      this.modalSizesSection.style.display = 'block';
      this.modalPortionSection.style.display = 'none';

      // Render sizes: REGULAR, MEDIUM, LARGE with exact prices
      this.renderSizeOptions(item.sizes);
    } else {
      this.selectedSize = null;
      this.modalSizesSection.style.display = 'none';
      this.modalPortionSection.style.display = 'block';

      if (this.modalPortionPrice) {
        this.modalPortionPrice.textContent = item.formattedPrice;
      }
    }

    // Configure Modifiers (Steak doneness, choice of sides, sauces, preparation basting)
    this.selectedModifiers = {};
    if (item.modifierGroups && item.modifierGroups.length > 0 && this.modalModifiersContainer) {
      this.modalModifiersContainer.style.display = 'block';
      this.renderModifierGroups(item.modifierGroups);
    } else if (this.modalModifiersContainer) {
      this.modalModifiersContainer.innerHTML = '';
      this.modalModifiersContainer.style.display = 'none';
    }

    // Reset Quantity
    this.updateQuantityDisplay();
    this.updateModalPrice();

    // Open Modal
    this.modal.classList.add('open');
    this.modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-scroll-lock');

    // Focus close button for accessible keyboard focus trap
    setTimeout(() => {
      this.modalCloseBtn?.focus();
    }, 50);
  }

  renderModifierGroups(groups) {
    if (!this.modalModifiersContainer) return;

    // Initialize default selections for each group
    groups.forEach(group => {
      if (group.maxSelect === 1) {
        const defaultOpt = group.options.find(o => o.default) || group.options[0];
        this.selectedModifiers[group.id] = defaultOpt ? [defaultOpt.id] : [];
      } else {
        const defaultOpts = group.options.filter(o => o.default);
        if (defaultOpts.length > 0) {
          this.selectedModifiers[group.id] = defaultOpts.slice(0, group.maxSelect).map(o => o.id);
        } else {
          const needed = group.minSelect || 1;
          this.selectedModifiers[group.id] = group.options.slice(0, Math.min(needed, group.maxSelect)).map(o => o.id);
        }
      }
    });

    this.modalModifiersContainer.innerHTML = groups.map(group => {
      const isSingle = group.maxSelect === 1;
      const hint = isSingle ? 'Select 1' : `Choose up to ${group.maxSelect}`;
      const selected = this.selectedModifiers[group.id] || [];

      return `
        <div class="modal-modifier-group" data-group-id="${group.id}">
          <div class="modal-section-title-row">
            <span class="modal-section-title">${group.name}</span>
            <span class="modal-section-hint">${hint}</span>
          </div>
          <div class="modal-modifier-options-grid" role="${isSingle ? 'radiogroup' : 'group'}" aria-label="${group.name}">
            ${group.options.map(opt => {
              const active = selected.includes(opt.id);
              const extraPrice = opt.price ? ` (+${opt.formattedPrice || `$${opt.price}`})` : '';
              return `
                <button 
                  type="button" 
                  class="modal-modifier-btn ${active ? 'active' : ''}" 
                  role="${isSingle ? 'radio' : 'checkbox'}" 
                  aria-checked="${active ? 'true' : 'false'}"
                  data-group-id="${group.id}" 
                  data-option-id="${opt.id}"
                >
                  <span class="modifier-pip" aria-hidden="true"></span>
                  <span class="modifier-btn-label">${opt.name}${extraPrice}</span>
                </button>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');

    // Bind modifier options click events
    const modButtons = this.modalModifiersContainer.querySelectorAll('.modal-modifier-btn');
    modButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.currentTarget;
        const groupId = targetBtn.getAttribute('data-group-id');
        const optionId = targetBtn.getAttribute('data-option-id');
        const group = groups.find(g => g.id === groupId);
        if (!group) return;

        if (group.maxSelect === 1) {
          this.selectedModifiers[groupId] = [optionId];
          const siblingBtns = this.modalModifiersContainer.querySelectorAll(`.modal-modifier-btn[data-group-id="${groupId}"]`);
          siblingBtns.forEach(b => {
            const isMatch = b.getAttribute('data-option-id') === optionId;
            b.classList.toggle('active', isMatch);
            b.setAttribute('aria-checked', isMatch ? 'true' : 'false');
          });
        } else {
          let curr = this.selectedModifiers[groupId] || [];
          if (curr.includes(optionId)) {
            const min = group.minSelect || 1;
            if (curr.length > min) {
              curr = curr.filter(id => id !== optionId);
            }
          } else {
            if (curr.length < group.maxSelect) {
              curr.push(optionId);
            } else {
              curr.shift();
              curr.push(optionId);
            }
          }
          this.selectedModifiers[groupId] = curr;
          const siblingBtns = this.modalModifiersContainer.querySelectorAll(`.modal-modifier-btn[data-group-id="${groupId}"]`);
          siblingBtns.forEach(b => {
            const optId = b.getAttribute('data-option-id');
            const isMatch = curr.includes(optId);
            b.classList.toggle('active', isMatch);
            b.setAttribute('aria-checked', isMatch ? 'true' : 'false');
          });
        }

        this.updateModalPrice();
      });
    });
  }

  renderSizeOptions(sizes) {
    if (!this.modalSizesGroup) return;

    this.modalSizesGroup.innerHTML = sizes.map((s, index) => {
      const isSelected = this.selectedSize && this.selectedSize.size === s.size;
      return `
        <button 
          type="button" 
          class="modal-size-option ${isSelected ? 'active' : ''}" 
          role="radio" 
          aria-checked="${isSelected ? 'true' : 'false'}"
          data-size="${s.size}"
          id="modal-size-opt-${s.size.toLowerCase()}"
          aria-label="${s.size} size, ${s.formattedPrice}"
        >
          <div class="size-option-radio-dot" aria-hidden="true">
            <span class="radio-inner-pip"></span>
          </div>
          <div class="size-option-text-col">
            <span class="size-option-name">${s.size}</span>
            <span class="size-option-subtitle">${s.label} Pizza</span>
          </div>
          <div class="size-option-price-col">
            <span class="size-option-price">${s.formattedPrice}</span>
          </div>
        </button>
      `;
    }).join('');

    // Bind size click events
    const optionBtns = this.modalSizesGroup.querySelectorAll('.modal-size-option');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const targetBtn = e.currentTarget;
        const sizeCode = targetBtn.getAttribute('data-size');
        const chosenSize = this.activeItem.sizes.find(s => s.size === sizeCode);
        if (chosenSize) {
          this.selectedSize = chosenSize;

          // Update active states
          optionBtns.forEach(b => {
            const active = b === targetBtn;
            b.classList.toggle('active', active);
            b.setAttribute('aria-checked', active ? 'true' : 'false');
          });

          this.updateModalPrice();
        }
      });
    });
  }

  closeProductView() {
    if (!this.modal || !this.modal.classList.contains('open') || this.isModalClosing) return;

    this.isModalClosing = true;
    this.modal.classList.add('is-closing');

    setTimeout(() => {
      this.modal.classList.remove('open');
      this.modal.classList.remove('is-closing');
      this.modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-scroll-lock');
      this.isModalClosing = false;

      // Return focus naturally to the item card so the customer can continue browsing seamlessly
      if (this.lastFocusedElement && typeof this.lastFocusedElement.focus === 'function') {
        this.lastFocusedElement.focus();
      }
    }, 180);
  }

  updateQuantityDisplay() {
    if (this.qtyCountVal) {
      this.qtyCountVal.textContent = this.quantity.toString();
      this.qtyCountVal.classList.remove('qty-pop');
      void this.qtyCountVal.offsetWidth;
      this.qtyCountVal.classList.add('qty-pop');
    }

    if (this.btnQtyMinus) {
      this.btnQtyMinus.disabled = this.quantity <= 1;
      this.btnQtyMinus.classList.toggle('disabled', this.quantity <= 1);
    }
  }

  updateModalPrice() {
    if (!this.activeItem) return;

    let unitPrice = this.selectedSize
      ? this.selectedSize.price
      : (this.activeItem.price || 0);

    // Add extra price for modifiers if applicable
    if (this.activeItem.modifierGroups) {
      this.activeItem.modifierGroups.forEach(grp => {
        const selected = this.selectedModifiers[grp.id] || [];
        selected.forEach(optId => {
          const opt = grp.options.find(o => o.id === optId);
          if (opt && opt.price) {
            unitPrice += opt.price;
          }
        });
      });
    }

    const total = unitPrice * this.quantity;
    const formattedTotal = `$${total.toFixed(2).replace(/\.00$/, '')}`;

    if (this.modalCalcTotal) {
      this.modalCalcTotal.textContent = formattedTotal;
      this.modalCalcTotal.classList.remove('price-pop-anim');
      void this.modalCalcTotal.offsetWidth;
      this.modalCalcTotal.classList.add('price-pop-anim');
    }
  }

  bindModalEvents() {
    // 1. Close Button
    this.modalCloseBtn?.addEventListener('click', () => {
      this.closeProductView();
    });

    // 2. Backdrop Tap to Dismiss
    this.modal?.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeProductView();
      }
    });

    // 3. Escape Key to Dismiss
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.modal?.classList.contains('open')) {
        this.closeProductView();
      }
    });

    // 4. Quantity Stepper
    this.btnQtyMinus?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.quantity > 1) {
        this.quantity -= 1;
        this.updateQuantityDisplay();
        this.updateModalPrice();
      }
    });

    this.btnQtyPlus?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (this.quantity < 20) {
        this.quantity += 1;
        this.updateQuantityDisplay();
        this.updateModalPrice();
      }
    });

    // 5. Add to Order Button (Signature Tactile Sequence)
    this.btnModalAddToOrder?.addEventListener('click', () => {
      if (!this.activeItem || this.isSubmitting) return;
      this.isSubmitting = true;

      // Build modifier label summary
      let modifiersText = '';
      if (this.activeItem.modifierGroups && this.activeItem.modifierGroups.length > 0) {
        const parts = [];
        this.activeItem.modifierGroups.forEach(grp => {
          const selected = this.selectedModifiers[grp.id] || [];
          const labels = selected.map(optId => {
            const found = grp.options.find(o => o.id === optId);
            return found ? found.name : optId;
          });
          if (labels.length > 0) {
            parts.push(labels.join(', '));
          }
        });
        modifiersText = parts.join(' • ');
      }

      // Add item directly to the real cart
      cart.addItem(this.activeItem, this.selectedSize, this.quantity, this.selectedModifiers, modifiersText);

      // Provide immediate tactile response on button
      if (this.btnModalLabel) {
        this.btnModalLabel.textContent = '✓ ADDED TO ORDER';
      }
      this.btnModalAddToOrder.classList.add('btn-added-success');

      // Signature traveling amber spark beam towards sticky cart
      if (this.motion) {
        this.motion.spawnAddToCartBeam(this.btnModalAddToOrder, this.btnStickyCart);
      }

      // Prepare feedback message
      const sizeLabel = this.selectedSize ? ` (${this.selectedSize.label || this.selectedSize.size})` : '';
      const message = `Added ${this.quantity} × ${this.activeItem.name}${sizeLabel} to order`;

      // Show toast notification
      this.showToast(message);

      // Return customer naturally to the menu so they can continue browsing
      setTimeout(() => {
        this.closeProductView();
        this.isSubmitting = false;
      }, 350);
    });
  }

  // --------------------------------------------------------------------------
  // Cart Subscriptions & UI Updates
  // --------------------------------------------------------------------------
  initCartSubscription() {
    cart.subscribe((state) => {
      this.updateCartUI(state);
    });
  }

  updateCartUI(state) {
    const { itemCount, formattedTotal, isEmpty, items } = state;

    // 1. Sticky Cart Button Visibility & Display
    // Shows: 🛒 Order · 1 item · $5
    if (this.stickyCartContainer && this.cartBtnCount && this.cartBtnTotal) {
      if (isEmpty) {
        this.stickyCartContainer.classList.remove('visible');
        this.stickyCartContainer.setAttribute('aria-hidden', 'true');
        // If the cart modal was open and user removed everything, close it so empty cart isn't placed over menu
        if (this.cartModal?.classList.contains('open')) {
          this.closeCartDrawer();
        }
      } else {
        const itemLabel = itemCount === 1 ? '1 item' : `${itemCount} items`;
        this.cartBtnCount.textContent = itemLabel;
        this.cartBtnTotal.textContent = formattedTotal;
        this.stickyCartContainer.classList.add('visible');
        this.stickyCartContainer.setAttribute('aria-hidden', 'false');

        // Tactile micro-interaction pulse on cart badge
        if (this.btnStickyCart) {
          this.btnStickyCart.classList.remove('cart-pill-pulse');
          void this.btnStickyCart.offsetWidth;
          this.btnStickyCart.classList.add('cart-pill-pulse');
        }
        if (this.cartBtnCount) {
          this.cartBtnCount.classList.remove('cart-count-pop');
          void this.cartBtnCount.offsetWidth;
          this.cartBtnCount.classList.add('cart-count-pop');
        }
      }
    }

    // 2. Cart Drawer Header & Grand Total
    if (this.cartDrawerItemsCount) {
      const itemLabel = itemCount === 1 ? '1 item' : `${itemCount} items`;
      this.cartDrawerItemsCount.textContent = itemLabel;
    }

    if (this.cartModalGrandTotal) {
      this.cartModalGrandTotal.textContent = formattedTotal;
    }

    if (this.btnSendPrice) {
      this.btnSendPrice.textContent = formattedTotal;
    }

    if (this.confirmItemsVal) {
      const itemLabel = itemCount === 1 ? '1 item' : `${itemCount} items`;
      this.confirmItemsVal.textContent = itemLabel;
    }

    if (this.confirmTotalVal) {
      this.confirmTotalVal.textContent = formattedTotal;
    }

    // 3. Render Cart Items inside Drawer
    this.renderCartItems(items);
  }

  renderCartItems(items) {
    if (!this.cartItemsList) return;

    // Show or hide Clear button based on whether cart has items
    if (this.btnClearCart) {
      this.btnClearCart.style.display = (!items || items.length === 0) ? 'none' : 'inline-flex';
    }

    if (!items || items.length === 0) {
      this.cartItemsList.innerHTML = `
        <div class="cart-empty-state">
          <div class="empty-cart-icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" class="empty-cart-icon">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
          </div>
          <h3 class="empty-cart-title">Your Order is Empty</h3>
          <p class="empty-cart-lead">Select your favorite flame-grilled steaks, burgers, breakfast, pizza or drinks from the menu to get started.</p>
          <button type="button" class="btn-empty-cart-browse" id="btn-empty-cart-browse">
            Explore Menu
          </button>
        </div>
      `;

      // Bind browse button inside empty state
      const browseBtn = this.cartItemsList.querySelector('#btn-empty-cart-browse');
      browseBtn?.addEventListener('click', () => {
        this.closeCartDrawer();
      });
      return;
    }

    this.cartItemsList.innerHTML = items.map(item => {
      const itemSubtotal = item.unitPrice * item.quantity;
      const formattedSubtotal = `$${itemSubtotal.toFixed(2).replace(/\.00$/, '')}`;
      const formattedUnitPrice = `$${item.unitPrice.toFixed(2).replace(/\.00$/, '')}`;
      const fallbackSvg = getItemGraphic(item.itemId || item.id.split('__')[0], item.category || '');

      return `
        <div class="cart-item-row" id="cart-item-${item.id}">
          <!-- Product Image -->
          <div class="cart-item-thumb">
            <img 
              src="${item.image}" 
              alt="${item.alt || item.name}" 
              class="cart-item-img" 
              loading="lazy" 
              referrerPolicy="no-referrer"
              onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
            />
            <div class="cart-thumb-fallback" style="display: none;" aria-hidden="true">
              ${fallbackSvg}
            </div>
          </div>

          <!-- Product Details -->
          <div class="cart-item-info">
            <div class="cart-item-title-row">
              <h4 class="cart-item-name">${item.name}</h4>
            </div>

            ${item.sizeLabel ? `<span class="cart-item-size-pill">${item.sizeLabel}</span>` : ''}
            ${item.modifiersText ? `<div class="cart-item-modifiers-summary">${item.modifiersText}</div>` : ''}

            <div class="cart-item-unit-price">${formattedUnitPrice} each</div>
          </div>

          <!-- Right Controls: Subtotal, Stepper (+/-), Remove -->
          <div class="cart-item-actions">
            <div class="cart-item-subtotal">${formattedSubtotal}</div>

            <div class="cart-stepper-wrap">
              <div class="cart-stepper" role="group" aria-label="Quantity controls for ${item.name}">
                <button 
                  type="button" 
                  class="btn-cart-step btn-cart-minus" 
                  data-cart-id="${item.id}"
                  aria-label="Decrease quantity for ${item.name}"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
                <span class="cart-step-val" aria-live="polite">${item.quantity}</span>
                <button 
                  type="button" 
                  class="btn-cart-step btn-cart-plus" 
                  data-cart-id="${item.id}"
                  aria-label="Increase quantity for ${item.name}"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <line x1="12" y1="5" x2="12" y2="19"></line>
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                  </svg>
                </button>
              </div>

              <!-- Remove option button -->
              <button 
                type="button" 
                class="btn-cart-remove" 
                data-cart-id="${item.id}"
                aria-label="Remove ${item.name} from order"
                title="Remove item"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  <line x1="10" y1="11" x2="10" y2="17"></line>
                  <line x1="14" y1="11" x2="14" y2="17"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  // --------------------------------------------------------------------------
  // Cart Drawer Interactions & Multi-Step Send Order Flow
  // --------------------------------------------------------------------------
  bindCartEvents() {
    // Delegated cart item stepper and remove events
    this.cartItemsList?.addEventListener('click', (e) => {
      const plusBtn = e.target.closest('.btn-cart-plus');
      if (plusBtn) {
        e.stopPropagation();
        const cartId = plusBtn.getAttribute('data-cart-id');
        if (cartId) cart.increment(cartId);
        return;
      }

      const minusBtn = e.target.closest('.btn-cart-minus');
      if (minusBtn) {
        e.stopPropagation();
        const cartId = minusBtn.getAttribute('data-cart-id');
        if (cartId) cart.decrement(cartId);
        return;
      }

      const removeBtn = e.target.closest('.btn-cart-remove');
      if (removeBtn) {
        e.stopPropagation();
        const cartId = removeBtn.getAttribute('data-cart-id');
        if (cartId) {
          cart.removeItem(cartId);
          this.showToast('Item removed from order');
        }
        return;
      }
    });
    // 1. Deliberate tap on sticky cart button opens cart drawer
    this.btnStickyCart?.addEventListener('click', () => {
      if (cart.getItemCount() > 0) {
        this.openCartDrawer();
      }
    });

    // 2. Close button in cart drawer
    this.btnCloseCart?.addEventListener('click', () => {
      this.closeCartDrawer();
    });

    // Clear Cart button
    this.btnClearCart?.addEventListener('click', () => {
      if (cart.getItemCount() > 0) {
        cart.clear();
        this.showToast('Order cleared');
      }
    });

    // 3. Continue Browsing button in cart footer
    this.btnCartContinue?.addEventListener('click', () => {
      this.closeCartDrawer();
    });

    // 4. Send Order button in cart footer -> Open "READY TO SEND?" confirmation step
    this.btnCartSendOrder?.addEventListener('click', () => {
      if (cart.getItemCount() === 0) return;
      if (this.activeOrderMode === 'dinein') {
        const isValid = this.validateTableNumber(true);
        if (!isValid) return; // Keep user on checkout review screen
      }
      this.setCartViewState('confirm');
    });

    // 5. Confirmation Step: Go Back button -> Return to Review Order
    this.btnConfirmBack?.addEventListener('click', () => {
      this.setCartViewState('review');
    });

    // 6. Confirmation Step: SEND ORDER button -> Actually submit order
    this.btnConfirmSend?.addEventListener('click', () => {
      this.submitOrder();
    });

    // 7. Order Sent Success Screen: BACK TO MENU button -> Clear cart & return to menu
    this.btnSuccessBackToMenu?.addEventListener('click', () => {
      this.completeOrderAndReturnToMenu();
    });

    // 8. Backdrop click closes cart drawer (only if not currently submitting)
    this.cartModal?.addEventListener('click', (e) => {
      if (e.target === this.cartModal && !this.isOrderSubmitting) {
        if (this.cartViewState === 'success') {
          this.completeOrderAndReturnToMenu();
        } else {
          this.closeCartDrawer();
        }
      }
    });

    // 9. Escape key closes cart drawer
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.cartModal?.classList.contains('open') && !this.isOrderSubmitting) {
        if (this.cartViewState === 'success') {
          this.completeOrderAndReturnToMenu();
        } else {
          this.closeCartDrawer();
        }
      }
    });
  }

  // Switch between 'review', 'confirm', and 'success' inside the cart modal
  setCartViewState(viewState) {
    this.cartViewState = viewState;

    if (viewState === 'review') {
      if (this.cartItemsList) {
        this.cartItemsList.style.display = '';
        this.cartItemsList.setAttribute('aria-hidden', 'false');
      }
      if (this.cartDrawerFooter) {
        this.cartDrawerFooter.style.display = '';
        this.cartDrawerFooter.setAttribute('aria-hidden', 'false');
      }
      if (this.cartConfirmView) {
        this.cartConfirmView.style.display = 'none';
        this.cartConfirmView.setAttribute('aria-hidden', 'true');
      }
      if (this.cartSuccessView) {
        this.cartSuccessView.style.display = 'none';
        this.cartSuccessView.setAttribute('aria-hidden', 'true');
      }
      if (this.confirmErrorAlert) this.confirmErrorAlert.style.display = 'none';

      // Restore table section according to active order mode
      if (this.checkoutTableSection) {
        this.checkoutTableSection.style.display = this.activeOrderMode === 'dinein' ? 'flex' : 'none';
      }
      this.updateFulfillmentDisplay();

      // Update header
      const titleEl = document.getElementById('cart-modal-title');
      if (titleEl) titleEl.textContent = 'Review Order';
      if (this.cartDrawerItemsCount) this.cartDrawerItemsCount.style.display = '';
      if (this.btnCloseCart) this.btnCloseCart.style.display = '';
    } else if (viewState === 'confirm') {
      if (this.cartItemsList) {
        this.cartItemsList.style.display = 'none';
        this.cartItemsList.setAttribute('aria-hidden', 'true');
      }
      if (this.cartDrawerFooter) {
        this.cartDrawerFooter.style.display = 'none';
        this.cartDrawerFooter.setAttribute('aria-hidden', 'true');
      }
      if (this.checkoutTableSection) {
        this.checkoutTableSection.style.display = 'none';
      }
      if (this.cartConfirmView) {
        this.cartConfirmView.style.display = 'flex';
        this.cartConfirmView.setAttribute('aria-hidden', 'false');
      }
      if (this.cartSuccessView) {
        this.cartSuccessView.style.display = 'none';
        this.cartSuccessView.setAttribute('aria-hidden', 'true');
      }
      if (this.confirmErrorAlert) this.confirmErrorAlert.style.display = 'none';

      // Update header
      const titleEl = document.getElementById('cart-modal-title');
      if (titleEl) titleEl.textContent = 'Confirm Order';
      if (this.cartDrawerItemsCount) this.cartDrawerItemsCount.style.display = 'none';
      if (this.btnCloseCart) this.btnCloseCart.style.display = '';

      // Update confirmation details
      const count = cart.getItemCount();
      const itemLabel = count === 1 ? '1 item' : `${count} items`;
      if (this.confirmItemsVal) this.confirmItemsVal.textContent = itemLabel;
      if (this.confirmTotalVal) this.confirmTotalVal.textContent = cart.getState().formattedTotal;

      // Update fulfillment summary in confirmation view
      if (this.confirmModeVal) {
        this.confirmModeVal.textContent = this.activeOrderMode === 'dinein' ? 'Dine-In' : 'Pickup';
      }
      if (this.confirmDestinationRow && this.confirmTableVal) {
        if (this.activeOrderMode === 'dinein') {
          this.confirmDestinationRow.style.display = 'flex';
          this.confirmTableVal.textContent = `Table ${this.tableNumber}`;
        } else {
          this.confirmDestinationRow.style.display = 'none';
        }
      }

      this.btnConfirmSend?.focus();
    } else if (viewState === 'success') {
      if (this.cartItemsList) {
        this.cartItemsList.style.display = 'none';
        this.cartItemsList.setAttribute('aria-hidden', 'true');
      }
      if (this.cartDrawerFooter) {
        this.cartDrawerFooter.style.display = 'none';
        this.cartDrawerFooter.setAttribute('aria-hidden', 'true');
      }
      if (this.checkoutTableSection) {
        this.checkoutTableSection.style.display = 'none';
      }
      if (this.cartConfirmView) {
        this.cartConfirmView.style.display = 'none';
        this.cartConfirmView.setAttribute('aria-hidden', 'true');
      }
      if (this.cartSuccessView) {
        this.cartSuccessView.style.display = 'flex';
        this.cartSuccessView.setAttribute('aria-hidden', 'false');
      }

      // Header on success
      const titleEl = document.getElementById('cart-modal-title');
      if (titleEl) titleEl.textContent = 'Order Confirmed';
      if (this.cartDrawerItemsCount) this.cartDrawerItemsCount.style.display = 'none';
      if (this.btnCloseCart) this.btnCloseCart.style.display = 'none'; // Customer taps BACK TO MENU

      // Dynamic fulfillment feedback card
      if (this.activeOrderMode === 'dinein') {
        if (this.successBadgeIcon) this.successBadgeIcon.textContent = '🍽️';
        if (this.successBadgeText) this.successBadgeText.textContent = `TABLE ${this.tableNumber}`;
        if (this.successFulfillmentMsg) this.successFulfillmentMsg.textContent = 'Your food will be brought to your table.';
      } else {
        if (this.successBadgeIcon) this.successBadgeIcon.textContent = '🛍️';
        if (this.successBadgeText) this.successBadgeText.textContent = 'PICKUP';
        if (this.successFulfillmentMsg) this.successFulfillmentMsg.textContent = 'Your order will be ready at the counter.';
      }

      this.btnSuccessBackToMenu?.focus();
    }
  }

  // Real Order Submission with API call & error handling
  async submitOrder() {
    if (this.isOrderSubmitting) return;

    const cartState = cart.getState();
    if (cartState.isEmpty || cartState.items.length === 0) {
      this.setCartViewState('review');
      return;
    }

    if (this.activeOrderMode === 'dinein') {
      const isValid = this.validateTableNumber(true);
      if (!isValid) {
        this.setCartViewState('review');
        return;
      }
    }

    this.isOrderSubmitting = true;
    if (this.confirmErrorAlert) this.confirmErrorAlert.style.display = 'none';
    if (this.btnConfirmSend) {
      this.btnConfirmSend.classList.add('loading');
      if (this.btnConfirmSendText) this.btnConfirmSendText.textContent = 'SENDING ORDER...';
    }

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: cartState.items,
          total: cartState.total,
          orderMode: this.activeOrderMode || 'pickup',
          tableNumber: this.activeOrderMode === 'dinein' ? this.tableNumber : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Server error occurred while sending order.');
      }

      const data = await response.json();

      if (!data.success || !data.orderNumber) {
        throw new Error(data.error || 'Invalid confirmation response.');
      }

      // Successful order received!
      if (this.successOrderNumber) {
        this.successOrderNumber.textContent = data.orderNumber;
      }

      // Transition to clean Chop Chop confirmation screen
      this.setCartViewState('success');

    } catch (err) {
      console.error('[CHOP CHOP] Failed to submit order:', err);
      // Show clear error message and allow customer to try again
      if (this.confirmErrorAlert && this.confirmErrorText) {
        this.confirmErrorText.textContent = err.message || 'Unable to send order. Please try again.';
        this.confirmErrorAlert.style.display = 'block';
      }
    } finally {
      this.isOrderSubmitting = false;
      if (this.btnConfirmSend) {
        this.btnConfirmSend.classList.remove('loading');
        if (this.btnConfirmSendText) this.btnConfirmSendText.textContent = 'SEND ORDER';
      }
    }
  }

  // Once customer finishes reviewing the success screen and taps BACK TO MENU
  completeOrderAndReturnToMenu() {
    // Clear cart completely
    cart.clear();

    // Reset cart view state back to review
    this.setCartViewState('review');

    // Close the drawer
    this.closeCartDrawer();

    // Subtle feedback on returning to the menu
    this.showToast('Thank you! Your order is on its way.');
  }

  openCartDrawer() {
    if (!this.cartModal || (cart.getItemCount() === 0 && this.cartViewState !== 'success')) return;

    // Synchronize mode and table section on open
    this.setOrderMode(this.activeOrderMode, false);

    // Ensure we start in review mode unless already showing success
    if (this.cartViewState !== 'success') {
      this.setCartViewState('review');
    }

    this.cartModal.classList.add('open');
    this.cartModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-scroll-lock');

    setTimeout(() => {
      this.btnCloseCart?.focus();
    }, 50);
  }

  closeCartDrawer() {
    if (!this.cartModal || !this.cartModal.classList.contains('open') || this.isCartClosing) return;

    this.isCartClosing = true;
    this.cartModal.classList.add('is-closing');

    setTimeout(() => {
      this.cartModal.classList.remove('open');
      this.cartModal.classList.remove('is-closing');
      this.cartModal.setAttribute('aria-hidden', 'true');
      // Only remove scroll-lock if product view modal is also not open
      if (!this.modal?.classList.contains('open')) {
        document.body.classList.remove('modal-scroll-lock');
      }

      // Reset view state to review when closed
      this.setCartViewState('review');
      this.isCartClosing = false;

      if (this.btnStickyCart && cart.getItemCount() > 0) {
        this.btnStickyCart.focus();
      }
    }, 180);
  }

  // --------------------------------------------------------------------------
  // Elegant Feedback Toast (Non-intrusive confirmation)
  // --------------------------------------------------------------------------
  showToast(message) {
    if (!this.toast) return;

    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }

    if (this.toastMsg) {
      this.toastMsg.textContent = message;
    }

    this.toast.classList.add('show');
    this.toast.setAttribute('aria-hidden', 'false');

    this.toastTimeout = setTimeout(() => {
      this.toast.classList.remove('show');
      this.toast.setAttribute('aria-hidden', 'true');
    }, 2800);
  }

  // --------------------------------------------------------------------------
  // Motion System: Scroll Depth Listener (Header / Category Nav Compression)
  // --------------------------------------------------------------------------
  initScrollDepth() {
    const checkScroll = () => {
      const isScrolled = window.scrollY > 24;
      document.body.classList.toggle('is-scrolled', isScrolled);
    };

    window.addEventListener('scroll', checkScroll, { passive: true });
    checkScroll();
  }

  // --------------------------------------------------------------------------
  // Motion System: Active Travelling Category Indicator
  // --------------------------------------------------------------------------
  initCategoryIndicator() {
    const container = document.getElementById('category-tabs-container');
    if (!container) return;

    let indicator = document.getElementById('category-nav-indicator');
    if (!indicator) {
      indicator = document.createElement('div');
      indicator.className = 'category-nav-indicator';
      indicator.id = 'category-nav-indicator';
      indicator.setAttribute('aria-hidden', 'true');
      container.appendChild(indicator);
    }
    container.classList.add('has-indicator');

    // Initial positioning over active tab
    requestAnimationFrame(() => {
      const activeTab = container.querySelector('.category-tab.active') || container.querySelector('.category-tab');
      if (activeTab) {
        this.updateActiveCategoryIndicator(activeTab);
      }
    });

    // Re-align indicator on resize
    window.addEventListener('resize', () => {
      const currentTab = container.querySelector('.category-tab.active');
      if (currentTab) {
        this.updateActiveCategoryIndicator(currentTab);
      }
    }, { passive: true });
  }

  updateActiveCategoryIndicator(targetTab) {
    const indicator = document.getElementById('category-nav-indicator');
    if (!indicator || !targetTab) return;

    const li = targetTab.closest('li');
    const tabLeft = li ? li.offsetLeft : targetTab.offsetLeft;
    const tabWidth = targetTab.offsetWidth;

    indicator.style.transform = `translate3d(${tabLeft}px, 0, 0)`;
    indicator.style.width = `${tabWidth}px`;
    indicator.style.opacity = '1';
  }

  // --------------------------------------------------------------------------
  // Motion System: Progressive Scroll Reveal for Menu Sections & Cards
  // --------------------------------------------------------------------------
  initScrollReveals() {
    if (this.motion) {
      this.motion.initSectionChoreography();
      this.motion.initCardParallax();
      return;
    }

    document.body.classList.add('js-reveal-ready');
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReduced) {
      document.querySelectorAll('.category-group-header, .menu-card.compact-card').forEach(el => {
        el.classList.add('is-revealed');
      });
      const footer = document.getElementById('app-footer');
      if (footer) footer.classList.add('is-revealed');
      return;
    }

    if (this.revealObserver) {
      this.revealObserver.disconnect();
    }

    this.revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = entry.target;

          if (target.classList.contains('category-group-section')) {
            const header = target.querySelector('.category-group-header');
            if (header) {
              header.classList.add('is-revealed');
            }

            const cards = target.querySelectorAll('.menu-card.compact-card');
            cards.forEach((card, idx) => {
              const delay = 40 + (idx * 40);
              setTimeout(() => {
                card.classList.add('is-revealed');
              }, delay);
            });

            observer.unobserve(target);
          } else if (target.id === 'app-footer') {
            target.classList.add('is-revealed');
            observer.unobserve(target);
          }
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.04
    });

    document.querySelectorAll('.category-group-section').forEach(sec => {
      this.revealObserver.observe(sec);
    });

    const footer = document.getElementById('app-footer');
    if (footer) {
      this.revealObserver.observe(footer);
    }
  }

  // --------------------------------------------------------------------------
  // Motion System: Scroll Spy (Tracks Active Menu Category)
  // --------------------------------------------------------------------------
  initScrollSpy() {
    const sections = document.querySelectorAll('.category-group-section');
    if (!sections.length) return;

    if (this.scrollSpyObserver) {
      this.scrollSpyObserver.disconnect();
    }

    this.scrollSpyObserver = new IntersectionObserver((entries) => {
      if (this.isAutoScrolling) return;

      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const catId = entry.target.id.replace('section-', '');
          this.updateActiveCategoryTab(catId);
        }
      });
    }, {
      root: null,
      rootMargin: '-105px 0px -65% 0px',
      threshold: 0
    });

    sections.forEach(sec => this.scrollSpyObserver.observe(sec));

    // Detect top of page scroll for 'all' tab
    window.addEventListener('scroll', () => {
      if (this.isAutoScrolling) return;
      if (window.scrollY < 120) {
        this.updateActiveCategoryTab('all');
      }
    }, { passive: true });
  }

  updateActiveCategoryTab(catId) {
    if (this.activeCategory === catId) return;
    this.activeCategory = catId;

    let targetTab = null;
    this.categoryTabs = document.querySelectorAll('.category-tab');
    this.categoryTabs.forEach(tab => {
      const isSelected = tab.getAttribute('data-category') === catId;
      tab.classList.toggle('active', isSelected);
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
      if (isSelected) {
        targetTab = tab;
      }
    });

    if (targetTab) {
      this.updateActiveCategoryIndicator(targetTab);
      targetTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }

  // --------------------------------------------------------------------------
  // Category Tab Click Handler (Smooth Scroll with Sticky Header Offset)
  // --------------------------------------------------------------------------
  bindCategoryTabs() {
    this.categoryTabs = document.querySelectorAll('.category-tab');
    this.categoryTabs.forEach(tab => {
      tab.addEventListener('click', (e) => {
        e.preventDefault();
        const targetTab = e.currentTarget;
        const category = targetTab.getAttribute('data-category');

        this.isAutoScrolling = true;
        this.updateActiveCategoryTab(category);

        if (category === 'all') {
          const intro = document.getElementById('menu-intro-header') || document.getElementById('main-content');
          if (intro) {
            const yOffset = -104;
            const y = intro.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        } else {
          const section = document.getElementById(`section-${category}`);
          if (section) {
            const yOffset = -104;
            const y = section.getBoundingClientRect().top + window.pageYOffset + yOffset;
            window.scrollTo({ top: y, behavior: 'smooth' });
          }
        }

        setTimeout(() => {
          this.isAutoScrolling = false;
        }, 800);
      });
    });
  }
}
