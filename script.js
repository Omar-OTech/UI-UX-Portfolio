/**
 * Enhanced Responsive Image Slider
 * A professional, responsive slider implementation with touch support
 * and performance optimizations for all screen sizes.
 */

// Wait for DOM to be fully loaded before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Get slider elements using more specific selectors
    const sliderContainer = document.querySelector('.slider-container');
    const slider = document.querySelector('.slider');
    const slides = Array.from(document.querySelectorAll('.slide'));
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    const dotsContainer = document.querySelector('.slider-dots');
    
    // Slider state
    const state = {
      currentSlide: 0,
      slideCount: slides.length,
      isAnimating: false,
      touchStartX: 0,
      touchEndX: 0,
      slideInterval: null,
      slideIntervalDuration: 6000, // Reduced from 8000 for better user experience
    };
  
    // Create dots with better performance (document fragment)
    const createDots = () => {
      const fragment = document.createDocumentFragment();
      
      slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        
        // Use data attribute for better practice
        dot.dataset.slideIndex = index;
        fragment.appendChild(dot);
      });
      
      // Append all dots at once (better performance)
      dotsContainer.appendChild(fragment);
      
      // Event delegation for dots (better performance than individual listeners)
      dotsContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('dot')) {
          const index = parseInt(e.target.dataset.slideIndex, 10);
          goToSlide(index);
        }
      });
    };
  
    // Update dots to reflect current slide with optimized DOM operations
    const updateDots = () => {
      const dots = document.querySelectorAll('.dot');
      dots.forEach((dot, index) => {
        // Only modify classes if needed
        if (index === state.currentSlide && !dot.classList.contains('active')) {
          dot.classList.add('active');
        } else if (index !== state.currentSlide && dot.classList.contains('active')) {
          dot.classList.remove('active');
        }
      });
    };
  
    // Transition to specific slide with smoother animation
    const goToSlide = (index) => {
      // Prevent rapid clicking
      if (state.isAnimating) return;
      
      state.isAnimating = true;
      state.currentSlide = index;
      
      // Add a transition class for smoother animation
      slider.classList.add('slider-transitioning');
      
      // Use transform with GPU acceleration
      const offset = -state.currentSlide * 100;
      slider.style.transform = `translate3d(${offset}%, 0, 0)`;
      
      updateDots();
      updateSlideAria();
      
      // Reset animation flag after transition
      setTimeout(() => {
        state.isAnimating = false;
        slider.classList.remove('slider-transitioning');
      }, 600); // Match this to your CSS transition time
    };
  
    // Next slide with bounds checking
    const nextSlide = () => {
      const next = (state.currentSlide + 1) % state.slideCount;
      goToSlide(next);
    };
  
    // Previous slide with bounds checking
    const prevSlide = () => {
      const prev = (state.currentSlide - 1 + state.slideCount) % state.slideCount;
      goToSlide(prev);
    };
  
    // Handle keyboard navigation for accessibility
    const handleKeyNavigation = (e) => {
      if (e.key === 'ArrowLeft') {
        prevSlide();
        resetInterval();
      } else if (e.key === 'ArrowRight') {
        nextSlide();
        resetInterval();
      }
    };
  
    // Add accessibility features
    const setupAccessibility = () => {
      sliderContainer.setAttribute('role', 'region');
      sliderContainer.setAttribute('aria-label', 'Image Slider');
      
      slides.forEach((slide, index) => {
        slide.setAttribute('role', 'group');
        slide.setAttribute('aria-label', `Slide ${index + 1} of ${state.slideCount}`);
        slide.setAttribute('aria-hidden', index === 0 ? 'false' : 'true');
      });
      
      prevBtn.setAttribute('aria-label', 'Previous slide');
      nextBtn.setAttribute('aria-label', 'Next slide');
      
      // Make slider focusable for keyboard navigation
      sliderContainer.setAttribute('tabindex', '0');
    };
    
    // Update ARIA attributes when slide changes
    const updateSlideAria = () => {
      slides.forEach((slide, index) => {
        slide.setAttribute('aria-hidden', index === state.currentSlide ? 'false' : 'true');
      });
    };
  
    // Set up auto-advance with better timing
    const startAutoAdvance = () => {
      state.slideInterval = setInterval(nextSlide, state.slideIntervalDuration);
    };
  
    // Reset the interval (called after manual navigation)
    const resetInterval = () => {
      clearInterval(state.slideInterval);
      startAutoAdvance();
    };
  
    // Handle touch events for mobile with improved detection
    const handleTouchStart = (e) => {
      state.touchStartX = e.changedTouches[0].screenX;
      clearInterval(state.slideInterval);
    };
  
    const handleTouchEnd = (e) => {
      state.touchEndX = e.changedTouches[0].screenX;
      const touchDiff = state.touchStartX - state.touchEndX;
      
      // Calculate threshold based on screen width for better responsiveness
      const threshold = window.innerWidth * 0.1; // 10% of screen width
      
      if (Math.abs(touchDiff) > threshold) {
        if (touchDiff > 0) {
          nextSlide();
        } else {
          prevSlide();
        }
      }
      
      startAutoAdvance();
    };
  
    // Handle resize events for responsive behavior
    const handleResize = () => {
      // Ensure the slider stays on the current slide when resizing
      const offset = -state.currentSlide * 100;
      slider.style.transform = `translate3d(${offset}%, 0, 0)`;
    };
  
    // Initialize slider functionality
    const init = () => {
      // Set up dots
      createDots();
      
      // Set up event listeners
      prevBtn.addEventListener('click', () => {
        prevSlide();
        resetInterval();
      });
      
      nextBtn.addEventListener('click', () => {
        nextSlide();
        resetInterval();
      });
      
      // Mouse events for auto-advance
      sliderContainer.addEventListener('mouseenter', () => {
        clearInterval(state.slideInterval);
      });
      
      sliderContainer.addEventListener('mouseleave', () => {
        startAutoAdvance();
      });
      
      // Touch events for mobile
      sliderContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
      sliderContainer.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      // Keyboard accessibility
      sliderContainer.addEventListener('keydown', handleKeyNavigation);
      
      // Window resize handling
      window.addEventListener('resize', handleResize, { passive: true });
      
      // Set up accessibility
      setupAccessibility();
      
      // Start auto-advance
      startAutoAdvance();
      
      // Add swipe indicator for mobile users
      if ('ontouchstart' in window) {
        sliderContainer.classList.add('touch-device');
        
        // Add swipe hint that fades after first interaction
        const swipeHint = document.createElement('div');
        swipeHint.classList.add('swipe-hint');
        swipeHint.innerHTML = '<span>Swipe</span>';
        sliderContainer.appendChild(swipeHint);
        
        // Remove hint after first interaction
        sliderContainer.addEventListener('touchend', () => {
          swipeHint.classList.add('fade-out');
          setTimeout(() => {
            swipeHint.remove();
          }, 500);
        }, { once: true });
      }
  
      // Preload adjacent images for smoother experience
      const preloadAdjacentImages = () => {
        // Get current slide index
        const current = state.currentSlide;
        
        // Calculate next and prev indices
        const next = (current + 1) % state.slideCount;
        const prev = (current - 1 + state.slideCount) % state.slideCount;
        
        // Find images in these slides
        const preloadIndices = [next, prev];
        preloadIndices.forEach(index => {
          const img = slides[index].querySelector('img');
          if (img && !img.complete) {
            const preloadImg = new Image();
            preloadImg.src = img.src;
          }
        });
      };
      
      // Call preload on slide change
      const originalGoToSlide = goToSlide;
      goToSlide = (index) => {
        originalGoToSlide(index);
        preloadAdjacentImages();
      };
      
      // Initial preload
      preloadAdjacentImages();
    };
  
    // Initialize the slider
    init();
  });