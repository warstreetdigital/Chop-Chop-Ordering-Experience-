/**
 * CHOP CHOP Digital Ordering System — App Bootstrap
 * Official Digital Menu
 * 
 * Dynamically loads structured products from data/menu.js into the DOM.
 */

import { CHOP_CHOP_CONFIG } from './config.js';
import { menu, MENU_ITEMS, MENU_CATEGORIES, categories } from '../data/menu.js';
import { MenuController } from './menuController.js';
import { LaunchExperience } from './launchExperience.js';

/**
 * Dynamically loads structured Chop Chop products into the DOM,
 * replacing any placeholder or fallback markup with live catalog items.
 * 
 * @param {Array} items - Array of menu items from data/menu.js
 * @param {Array} cats - Array of category specifications
 * @param {MenuController} controller - Active MenuController instance
 */
export function loadProductsIntoDOM(items = MENU_ITEMS, cats = MENU_CATEGORIES, controller = null) {
  const container = document.getElementById('menu-items-container');
  if (!container) {
    console.warn('[CHOP CHOP] #menu-items-container not found in DOM.');
    return;
  }

  // Remove any legacy placeholder items or skeleton loaders
  const existingPlaceholders = container.querySelectorAll('.placeholder-item, .menu-skeleton');
  existingPlaceholders.forEach(el => el.remove());

  // Render authentic items through controller
  if (controller) {
    controller.loadProducts(items, cats);
  } else {
    // Fallback if controller not yet instantiated
    const tempController = new MenuController(items, cats);
    tempController.init();
  }

  console.log(`[CHOP CHOP] Dynamically loaded ${items.length} products across ${cats.length} categories into DOM.`);
}

document.addEventListener('DOMContentLoaded', () => {
  console.log(`${CHOP_CHOP_CONFIG.brand.name} Digital Menu initialized.`);

  // 1. Trigger the CHOP CHOP Launch Experience immediately
  const launch = new LaunchExperience({ 
    duration: CHOP_CHOP_CONFIG.launch.duration,
    welcomeText: CHOP_CHOP_CONFIG.launch.welcomeText,
    transitionText: CHOP_CHOP_CONFIG.launch.transitionText,
  });
  launch.init();

  // 2. Instantiate MenuController with structured menu data from data/menu.js
  const menuController = new MenuController(MENU_ITEMS, MENU_CATEGORIES);
  menuController.init();

  // 3. Dynamically load products into the DOM replacing any placeholder content
  loadProductsIntoDOM(MENU_ITEMS, MENU_CATEGORIES, menuController);

  // 4. Expose globals for developer/runtime inspection
  window.chopChopMenu = menu;
  window.menuController = menuController;
  window.loadProductsIntoDOM = loadProductsIntoDOM;
});

export { menu, MENU_ITEMS, MENU_CATEGORIES, categories };
