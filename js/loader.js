// Loading Animation Manager
class LoadingManager {
    constructor() {
        this.loadingElement = document.getElementById('loading');
        this.loaded = false;
        this.minLoadTime = 1500; // Minimum loading time for smooth experience
        this.startTime = Date.now();
        
        this.init();
    }
    
    init() {
        // Create floating particles in loader
        this.createLoaderParticles();
        
        // Start loading process
        this.startLoading();
    }
    
    createLoaderParticles() {
        if (!this.loadingElement) return;
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'loader-particles';
        particlesContainer.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: -1;
        `;
        
        this.loadingElement.appendChild(particlesContainer);
        
        // Create floating particles
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.style.cssText = `
                position: absolute;
                width: ${Math.random() * 10 + 2}px;
                height: ${Math.random() * 10 + 2}px;
                background: linear-gradient(135deg, #3B82F6, #8B5CF6);
                border-radius: 50%;
                opacity: ${Math.random() * 0.3 + 0.1};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
            `;
            particlesContainer.appendChild(particle);
        }
        
        // Add floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translateY(0) rotate(0deg); }
                50% { transform: translateY(-20px) rotate(180deg); }
            }
        `;
        document.head.appendChild(style);
    }
    
    startLoading() {
        // Simulate resource loading
        const resources = [
            this.loadFonts(),
            this.loadImages(),
            this.loadScripts()
        ];
        
        // Wait for all resources or minimum time
        Promise.all(resources).then(() => {
            const elapsedTime = Date.now() - this.startTime;
            const remainingTime = Math.max(0, this.minLoadTime - elapsedTime);
            
            setTimeout(() => {
                this.finishLoading();
            }, remainingTime);
        });
    }
    
    loadFonts() {
        return new Promise(resolve => {
            // Load Google Fonts
            const link = document.createElement('link');
            link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap';
            link.rel = 'stylesheet';
            link.onload = resolve;
            link.onerror = resolve;
            document.head.appendChild(link);
        });
    }
    
    loadImages() {
        return new Promise(resolve => {
            // Preload critical images
            const images = [];
            const preloadImages = [
                'assets/visuals/hero-bg.svg',
                'assets/visuals/pattern.svg'
            ];
            
            let loaded = 0;
            const total = preloadImages.length;
            
            if (total === 0) {
                resolve();
                return;
            }
            
            preloadImages.forEach(src => {
                const img = new Image();
                img.src = src;
                img.onload = img.onerror = () => {
                    loaded++;
                    if (loaded === total) resolve();
                };
                images.push(img);
            });
        });
    }
    
    loadScripts() {
        return new Promise(resolve => {
            // Scripts are already loaded in HTML
            resolve();
        });
    }
    
    finishLoading() {
        if (this.loaded) return;
        this.loaded = true;
        
        // Animate loader out
        this.loadingElement.style.opacity = '0';
        this.loadingElement.style.transform = 'scale(1.1)';
        
        setTimeout(() => {
            this.loadingElement.style.display = 'none';
            
            // Trigger page animations
            this.triggerPageAnimations();
            
            // Initialize components
            this.initPageComponents();
        }, 500);
    }
    
    triggerPageAnimations() {
        // Animate hero section
        const heroTitle = document.querySelector('.hero-title');
        const heroDesc = document.querySelector('.hero-desc');
        const heroButtons = document.querySelector('.hero-buttons');
        const heroStats = document.querySelector('.hero-stats');
        
        if (heroTitle) {
            heroTitle.style.animation = 'fadeIn 0.8s ease forwards';
            heroTitle.style.opacity = '0';
        }
        
        if (heroDesc) {
            setTimeout(() => {
                heroDesc.style.animation = 'fadeIn 0.8s ease 0.2s forwards';
                heroDesc.style.opacity = '0';
            }, 200);
        }
        
        if (heroButtons) {
            setTimeout(() => {
                heroButtons.style.animation = 'fadeIn 0.8s ease 0.4s forwards';
                heroButtons.style.opacity = '0';
            }, 400);
        }
        
        if (heroStats) {
            setTimeout(() => {
                heroStats.style.animation = 'fadeIn 0.8s ease 0.6s forwards';
                heroStats.style.opacity = '0';
                
                // Animate stats counting
                this.animateStats();
            }, 600);
        }
    }
    
    animateStats() {
        const statNumbers = document.querySelectorAll('.stat-number');
        
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const suffix = stat.textContent.replace(/[0-9]/g, '');
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    stat.textContent = Math.floor(current) + suffix;
                }
            }, 16);
        });
    }
    
    initPageComponents() {
        // Initialize navbar scroll effect
        this.initNavbarScroll();
        
        // Initialize parallax
        this.initParallax();
        
        // Initialize tooltips
        this.initTooltips();
    }
    
    initNavbarScroll() {
        let lastScroll = 0;
        const navbar = document.querySelector('.navbar');
        
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navbar.style.background = 'rgba(255, 255, 255, 0.95)';
                navbar.style.boxShadow = 'var(--shadow-md)';
            } else {
                navbar.style.background = 'var(--glass-bg)';
                navbar.style.boxShadow = 'none';
            }
            
            if (currentScroll > lastScroll && currentScroll > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScroll = currentScroll;
        });
    }
    
    initParallax() {
        const parallaxBg = document.getElementById('parallax-bg');
        
        if (!parallaxBg) return;
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            parallaxBg.style.transform = `translate3d(0, ${rate}px, 0) scale(2)`;
        });
    }
    
    initTooltips() {
        // Add tooltips to interactive elements
        const tooltipElements = document.querySelectorAll('[data-tooltip]');
        
        tooltipElements.forEach(element => {
            const tooltipText = element.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = tooltipText;
            
            element.appendChild(tooltip);
            
            element.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });
            
            element.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        });
    }
}

// Initialize loader when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.loadingManager = new LoadingManager();
    
    // Mobile menu toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '100%';
            navMenu.style.left = '0';
            navMenu.style.width = '100%';
            navMenu.style.background = 'var(--glass-bg)';
            navMenu.style.backdropFilter = 'var(--glass-blur)';
            navMenu.style.padding = '2rem';
            navMenu.style.borderRadius = '0 0 var(--radius-lg) var(--radius-lg)';
            navMenu.style.boxShadow = 'var(--shadow-lg)';
        });
    }
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe all sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
});
