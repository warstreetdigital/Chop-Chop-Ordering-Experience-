/**
 * CHOP CHOP — Premium Launch Experience Controller
 * 
 * Manages the cinematic, app-like welcome intro sequence on fresh page loads:
 * 1. Immediate dark launch screen covering viewport with zero menu flash
 * 2. Animated CHOP CHOP brand mark & display typography
 * 3. Text transition: "WELCOME TO CHOP CHOP" -> "BOLD. FRESH. READY."
 * 4. Micro pulse progress thread in CHOP CHOP warm flame gold
 * 5. Clean, cinematic exit reveal of the prepared menu catalog
 * 6. Full support for prefers-reduced-motion
 */

import { CHOP_CHOP_CONFIG } from './config.js';

export class LaunchExperience {
  constructor(options = {}) {
    this.screen = document.getElementById('chopchop-launch-screen') || document.getElementById('foodies-launch-screen');
    this.welcomeText = document.getElementById('launch-welcome-text');
    this.logoMark = document.getElementById('launch-brand-mark');
    this.duration = options.duration || CHOP_CHOP_CONFIG.launch.duration || 2100;
    this.transitionText = options.transitionText || CHOP_CHOP_CONFIG.launch.transitionText || 'BOLD. FRESH. READY.';
    this.hasRevealed = false;
  }

  init() {
    if (!this.screen) return;

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia && 
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      // Reduced motion: Quick and gentle 700ms fade
      setTimeout(() => {
        this.revealMenu();
      }, 700);
      return;
    }

    // Step 1: Ensure initial screen is active & body scroll locked
    document.body.classList.add('launch-active');

    // Step 2: Welcoming text transition (850ms in):
    // "WELCOME TO CHOP CHOP" -> "BOLD. FRESH. READY."
    setTimeout(() => {
      if (this.welcomeText && !this.hasRevealed) {
        this.welcomeText.classList.add('text-transitioning');
        setTimeout(() => {
          this.welcomeText.textContent = this.transitionText;
          this.welcomeText.classList.remove('text-transitioning');
          this.welcomeText.classList.add('text-secondary-state');
        }, 220);
      }
    }, 850);

    // Step 3: Smooth, cinematic reveal of menu after duration (approx 2.1s)
    setTimeout(() => {
      this.revealMenu();
    }, this.duration);
  }

  revealMenu() {
    if (this.hasRevealed || !this.screen) return;
    this.hasRevealed = true;

    // Trigger smooth fade-out & scale out
    this.screen.classList.add('launch-dismissed');

    // Unlock body scrolling
    document.body.classList.remove('launch-active');
    document.body.classList.add('launch-completed');

    // Remove from accessibility tree after transition completes
    setTimeout(() => {
      this.screen.setAttribute('aria-hidden', 'true');
      this.screen.style.display = 'none';
      // Shift focus cleanly to the main menu for accessibility
      const mainContent = document.getElementById('main-content');
      if (mainContent) {
        mainContent.setAttribute('tabindex', '-1');
      }
    }, 600);
  }
}
