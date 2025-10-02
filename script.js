/**
 * ESPINITAS Y FLORES - WORLD-CLASS JAVASCRIPT
 * Advanced Interactions & Performance Optimization
 * ==============================================
 */

// ========================================
// GLOBAL VARIABLES & CONFIGURATION
// ========================================

const CONFIG = {
    // Performance settings
    lazyLoadThreshold: 100,
    scrollThreshold: 50,
    animationDuration: 300,
    
    // Gallery settings - TODAS las imágenes disponibles
    galleryImages: [
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_5tey9v5tey9v5tey.png',
            alt: 'Plantas ornamentales decorativas',
            category: 'ornamentales',
            title: 'Plantas Ornamentales'
        },
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_5vdbtl5vdbtl5vdb.png',
            alt: 'Diseño de jardín moderno',
            category: 'proyectos',
            title: 'Diseño de Jardín'
        },
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_howgaahowgaahowg.png',
            alt: 'Plantas purificadoras del aire',
            category: 'ornamentales',
            title: 'Plantas Purificadoras'
        },
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_uxuvdxuxuvdxuxuv.png',
            alt: 'Cactus y suculentas',
            category: 'cactus',
            title: 'Cactus y Suculentas'
        },
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_whvnl5whvnl5whvn.png',
            alt: 'Accesorios para plantas',
            category: 'accesorios',
            title: 'Accesorios'
        },
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_yq4a0wyq4a0wyq4a.png',
            alt: 'Proyecto de jardín vertical',
            category: 'proyectos',
            title: 'Jardín Vertical'
        },
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_3ko1og3ko1og3ko1.png',
            alt: 'Plantas de interior elegantes',
            category: 'ornamentales',
            title: 'Plantas de Interior'
        },
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_3wtfsq3wtfsq3wtf.png',
            alt: 'Jardín tropical exuberante',
            category: 'proyectos',
            title: 'Jardín Tropical'
        },
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_gmj19tgmj19tgmj1.png',
            alt: 'Macetas y jardineras decorativas',
            category: 'accesorios',
            title: 'Macetas Decorativas'
        },
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_kr2p9rkr2p9rkr2p.png',
            alt: 'Cactus exóticos y raros',
            category: 'cactus',
            title: 'Cactus Exóticos'
        },
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_kwxyv1kwxyv1kwxy.png',
            alt: 'Plantas aromáticas y medicinales',
            category: 'ornamentales',
            title: 'Plantas Aromáticas'
        },
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_mrtsr7mrtsr7mrts.png',
            alt: 'Terrario moderno con suculentas',
            category: 'proyectos',
            title: 'Terrario Moderno'
        },
        {
            src: 'imagenes mejoradas/Gemini_Generated_Image_t9ps1xt9ps1xt9ps.png',
            alt: 'Herramientas de jardinería profesionales',
            category: 'accesorios',
            title: 'Herramientas de Jardinería'
        }
    ],
    
    // Contact form settings
    contactForm: {
        endpoint: '/api/contact',
        successMessage: '¡Mensaje enviado exitosamente! Te contactaremos pronto.',
        errorMessage: 'Error al enviar el mensaje. Por favor, inténtalo de nuevo.'
    }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Debounce function for performance optimization
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Throttle function for scroll events
 */
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, threshold = 0.1) {
    const rect = element.getBoundingClientRect();
    const windowHeight = window.innerHeight || document.documentElement.clientHeight;
    const windowWidth = window.innerWidth || document.documentElement.clientWidth;
    
    return (
        rect.top <= windowHeight * (1 - threshold) &&
        rect.bottom >= windowHeight * threshold &&
        rect.left <= windowWidth &&
        rect.right >= 0
    );
}

/**
 * Smooth scroll to element
 */
function smoothScrollTo(target, offset = 80) {
    const element = document.querySelector(target);
    if (element) {
        const targetPosition = element.offsetTop - offset;
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

/**
 * Format phone number for display
 */
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3');
}

// ========================================
// NAVIGATION SYSTEM
// ========================================

class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.navToggle = document.getElementById('nav-toggle');
        this.navMenu = document.getElementById('nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.sections = document.querySelectorAll('section[id]');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupScrollSpy();
        this.setupMobileMenu();
    }
    
    setupEventListeners() {
        // Navbar scroll effect
        window.addEventListener('scroll', throttle(() => {
            this.handleScroll();
        }, 16));
        
        // Mobile menu toggle
        this.navToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });
        
        // Close mobile menu when clicking on links
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.navbar.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }
    
    handleScroll() {
        const scrollY = window.scrollY;
        
        // Add scrolled class for navbar styling
        if (scrollY > CONFIG.scrollThreshold) {
            this.navbar.classList.add('scrolled');
        } else {
            this.navbar.classList.remove('scrolled');
        }
        
        // Update active section
        this.updateActiveSection();
    }
    
    setupScrollSpy() {
        // Update active navigation link based on scroll position
        this.updateActiveSection();
    }
    
    updateActiveSection() {
        let currentSection = '';
        
        this.sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });
        
        // Update active nav link
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === currentSection) {
                link.classList.add('active');
            }
        });
    }
    
    setupMobileMenu() {
        // Handle window resize
        window.addEventListener('resize', debounce(() => {
            if (window.innerWidth > 768) {
                this.closeMobileMenu();
            }
        }, 250));
    }
    
    toggleMobileMenu() {
        this.navMenu.classList.toggle('active');
        this.navToggle.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }
    
    closeMobileMenu() {
        this.navMenu.classList.remove('active');
        this.navToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
    }
}

// ========================================
// GALLERY SYSTEM
// ========================================

class GalleryManager {
    constructor() {
        this.galleryGrid = document.getElementById('gallery-grid');
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.lightbox = document.getElementById('lightbox');
        this.lightboxImg = document.getElementById('lightbox-img');
        this.lightboxClose = document.getElementById('lightbox-close');
        this.lightboxPrev = document.getElementById('lightbox-prev');
        this.lightboxNext = document.getElementById('lightbox-next');
        
        this.currentFilter = 'all';
        this.currentImageIndex = 0;
        this.filteredImages = CONFIG.galleryImages;
        
        this.init();
    }
    
    init() {
        this.renderGallery();
        this.setupEventListeners();
        this.setupLazyLoading();
    }
    
    renderGallery() {
        this.galleryGrid.innerHTML = '';
        
        this.filteredImages.forEach((image, index) => {
            const galleryItem = this.createGalleryItem(image, index);
            this.galleryGrid.appendChild(galleryItem);
        });
        
        // Add animation delay to each item
        const items = this.galleryGrid.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    createGalleryItem(image, index) {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.setAttribute('data-category', image.category);
        item.setAttribute('data-index', index);
        
        item.innerHTML = `
            <img src="${image.src}" alt="${image.alt}" loading="lazy">
            <div class="gallery-overlay">
                <i class="fas fa-search-plus"></i>
            </div>
        `;
        
        // Add click event
        item.addEventListener('click', () => {
            this.openLightbox(index);
        });
        
        return item;
    }
    
    setupEventListeners() {
        // Filter buttons
        this.filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                this.filterGallery(button.getAttribute('data-filter'));
            });
        });
        
        // Lightbox events
        this.lightboxClose.addEventListener('click', () => {
            this.closeLightbox();
        });
        
        this.lightboxPrev.addEventListener('click', () => {
            this.previousImage();
        });
        
        this.lightboxNext.addEventListener('click', () => {
            this.nextImage();
        });
        
        // Close lightbox when clicking outside
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                switch(e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        this.nextImage();
                        break;
                }
            }
        });
    }
    
    filterGallery(filter) {
        this.currentFilter = filter;
        
        // Update active filter button
        this.filterButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === filter) {
                btn.classList.add('active');
            }
        });
        
        // Filter images
        if (filter === 'all') {
            this.filteredImages = CONFIG.galleryImages;
        } else {
            this.filteredImages = CONFIG.galleryImages.filter(img => img.category === filter);
        }
        
        // Re-render gallery with animation
        this.galleryGrid.style.opacity = '0';
        setTimeout(() => {
            this.renderGallery();
            this.galleryGrid.style.opacity = '1';
        }, 200);
    }
    
    openLightbox(index) {
        this.currentImageIndex = index;
        const image = this.filteredImages[index];
        
        this.lightboxImg.src = image.src;
        this.lightboxImg.alt = image.alt;
        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update navigation buttons visibility
        this.updateLightboxNavigation();
    }
    
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }
    
    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.filteredImages.length) % this.filteredImages.length;
        const image = this.filteredImages[this.currentImageIndex];
        
        this.lightboxImg.src = image.src;
        this.lightboxImg.alt = image.alt;
        this.updateLightboxNavigation();
    }
    
    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.filteredImages.length;
        const image = this.filteredImages[this.currentImageIndex];
        
        this.lightboxImg.src = image.src;
        this.lightboxImg.alt = image.alt;
        this.updateLightboxNavigation();
    }
    
    updateLightboxNavigation() {
        const hasMultipleImages = this.filteredImages.length > 1;
        this.lightboxPrev.style.display = hasMultipleImages ? 'flex' : 'none';
        this.lightboxNext.style.display = hasMultipleImages ? 'flex' : 'none';
    }
    
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '50px'
        });
        
        // Observe all images
        document.querySelectorAll('img[loading="lazy"]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// ========================================
// CONTACT FORM SYSTEM
// ========================================

class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contact-form');
        this.formGroups = this.form.querySelectorAll('.form-group');
        
        this.init();
    }
    
    init() {
        this.setupFormValidation();
        this.setupFormSubmission();
        this.setupFormAnimations();
    }
    
    setupFormValidation() {
        // Real-time validation
        this.formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', debounce(() => {
                this.validateField(input);
            }, 300));
        });
    }
    
    validateField(input) {
        const value = input.value.trim();
        const fieldName = input.name;
        let isValid = true;
        let errorMessage = '';
        
        // Remove existing error styling
        input.classList.remove('error');
        this.removeErrorMessage(input);
        
        // Validation rules
        switch(fieldName) {
            case 'name':
                if (!value) {
                    isValid = false;
                    errorMessage = 'El nombre es requerido';
                } else if (value.length < 2) {
                    isValid = false;
                    errorMessage = 'El nombre debe tener al menos 2 caracteres';
                }
                break;
                
            case 'email':
                if (!value) {
                    isValid = false;
                    errorMessage = 'El email es requerido';
                } else if (!this.isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Ingresa un email válido';
                }
                break;
                
            case 'phone':
                if (value && !this.isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Ingresa un teléfono válido';
                }
                break;
                
            case 'subject':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Selecciona un asunto';
                }
                break;
                
            case 'message':
                if (!value) {
                    isValid = false;
                    errorMessage = 'El mensaje es requerido';
                } else if (value.length < 10) {
                    isValid = false;
                    errorMessage = 'El mensaje debe tener al menos 10 caracteres';
                }
                break;
        }
        
        if (!isValid) {
            input.classList.add('error');
            this.showErrorMessage(input, errorMessage);
        }
        
        return isValid;
    }
    
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    isValidPhone(phone) {
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{9,}$/;
        return phoneRegex.test(phone);
    }
    
    showErrorMessage(input, message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = '#e53e3e';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.5rem';
        
        input.parentNode.appendChild(errorDiv);
    }
    
    removeErrorMessage(input) {
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) {
            existingError.remove();
        }
    }
    
    setupFormSubmission() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Validate all fields
            let isFormValid = true;
            this.formGroups.forEach(group => {
                const input = group.querySelector('input, select, textarea');
                if (!this.validateField(input)) {
                    isFormValid = false;
                }
            });
            
            if (!isFormValid) {
                this.showNotification('Por favor, corrige los errores en el formulario', 'error');
                return;
            }
            
            // Show loading state
            const submitButton = this.form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
            submitButton.disabled = true;
            
            try {
                // Simulate form submission (replace with actual API call)
                await this.submitForm();
                
                this.showNotification(CONFIG.contactForm.successMessage, 'success');
                this.form.reset();
                
            } catch (error) {
                this.showNotification(CONFIG.contactForm.errorMessage, 'error');
            } finally {
                // Reset button state
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    async submitForm() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);
        
        // Simulate API call
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate success/failure
                if (Math.random() > 0.1) { // 90% success rate
                    resolve(data);
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }
    
    setupFormAnimations() {
        // Floating label animation
        this.formGroups.forEach(group => {
            const input = group.querySelector('input, select, textarea');
            const label = group.querySelector('label');
            
            input.addEventListener('focus', () => {
                label.style.color = '#2e7d32';
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    label.style.color = '#9e9e9e';
                }
            });
        });
    }
    
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4caf50' : type === 'error' ? '#f44336' : '#2196f3'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 0.5rem;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Auto remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }
}

// ========================================
// PERFORMANCE OPTIMIZATION
// ========================================

class PerformanceManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupLazyLoading();
        this.setupPreloading();
        this.optimizeImages();
        this.setupServiceWorker();
    }
    
    setupLazyLoading() {
        // Intersection Observer for lazy loading
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    setupPreloading() {
        // Preload critical images
        const criticalImages = [
            'img/hero.webp',
            'logo1.png',
            'logo-texto.png'
        ];
        
        criticalImages.forEach(src => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = 'image';
            link.href = src;
            document.head.appendChild(link);
        });
    }
    
    optimizeImages() {
        // Add loading="lazy" to non-critical images
        const images = document.querySelectorAll('img:not([loading])');
        images.forEach((img, index) => {
            if (index > 2) { // Skip first 3 images (critical)
                img.setAttribute('loading', 'lazy');
            }
        });
    }
    
    setupServiceWorker() {
        // Register service worker for caching
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }
}

// ========================================
// ANIMATION SYSTEM
// ========================================

class AnimationManager {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupScrollAnimations();
        this.setupHoverEffects();
        this.setupLoadingScreen();
    }
    
    setupScrollAnimations() {
        // Animate elements on scroll
        const animatedElements = document.querySelectorAll('[data-aos]');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animationType = element.getAttribute('data-aos');
                    const delay = element.getAttribute('data-aos-delay') || 0;
                    
                    setTimeout(() => {
                        element.classList.add('aos-animate');
                    }, delay);
                    
                    animationObserver.unobserve(element);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => {
            animationObserver.observe(element);
        });
    }
    
    setupHoverEffects() {
        // Enhanced hover effects for cards
        const cards = document.querySelectorAll('.service-card, .blog-card, .gallery-item');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 500);
            }, 1500);
        });
    }
}

// ========================================
// INITIALIZATION
// ========================================

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all managers
    new NavigationManager();
    new GalleryManager();
    new ContactFormManager();
    new PerformanceManager();
    new AnimationManager();
    
    // Add smooth scrolling to all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = anchor.getAttribute('href');
            smoothScrollTo(target);
        });
    });
    
    // Add scroll to top functionality
    const scrollToTopButton = document.createElement('button');
    scrollToTopButton.innerHTML = '<i class="fas fa-chevron-up"></i>';
    scrollToTopButton.className = 'scroll-to-top';
    scrollToTopButton.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 50px;
        height: 50px;
        background: linear-gradient(135deg, #2e7d32, #4caf50);
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
    `;
    
    document.body.appendChild(scrollToTopButton);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 500) {
            scrollToTopButton.style.opacity = '1';
            scrollToTopButton.style.visibility = 'visible';
        } else {
            scrollToTopButton.style.opacity = '0';
            scrollToTopButton.style.visibility = 'hidden';
        }
    }, 100));
    
    // Scroll to top functionality
    scrollToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Add hover effect to scroll to top button
    scrollToTopButton.addEventListener('mouseenter', () => {
        scrollToTopButton.style.transform = 'translateY(-3px)';
    });
    
    scrollToTopButton.addEventListener('mouseleave', () => {
        scrollToTopButton.style.transform = 'translateY(0)';
    });
    
    console.log('🌱 Espinitas y Flores - Website initialized successfully!');
});

// ========================================
// ERROR HANDLING
// ========================================

window.addEventListener('error', (e) => {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled Promise Rejection:', e.reason);
    // In production, you might want to send this to an error tracking service
});

// ========================================
// ACCESSIBILITY ENHANCEMENTS
// ========================================

// Add main content ID
const mainContent = document.querySelector('main') || document.querySelector('.hero');
if (mainContent) {
    mainContent.id = 'main-content';
}
