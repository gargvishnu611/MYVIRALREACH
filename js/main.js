// Main JavaScript for MyViralReach Platform
class MyViralReach {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialize components
        this.initNavigation();
        this.initAnimations();
        this.initForms();
        this.initInteractiveElements();
        this.initPerformance();
    }
    
    initNavigation() {
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                
                if (href === '#') return;
                
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
        
        // Active navigation highlighting
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        window.addEventListener('scroll', () => {
            let current = '';
            const scrollPosition = window.scrollY + 100;
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                    current = section.getAttribute('id');
                }
            });
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }
    
    initAnimations() {
        // Floating animation for elements
        this.createFloatingElements();
        
        // Scroll-triggered animations
        this.initScrollAnimations();
        
        // Hover effects
        this.initHoverEffects();
    }
    
    createFloatingElements() {
        const floatElements = document.querySelectorAll('.float-element');
        
        floatElements.forEach((element, index) => {
            element.style.animation = `float ${3 + index * 0.5}s ease-in-out infinite`;
            element.style.animationDelay = `${index * 0.2}s`;
        });
        
        // Add floating animation keyframes if not exists
        if (!document.querySelector('#float-animation')) {
            const style = document.createElement('style');
            style.id = 'float-animation';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    initScrollAnimations() {
        const animatedElements = document.querySelectorAll('.animate-on-scroll');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    
                    // Add staggered animation for child elements
                    const children = entry.target.querySelectorAll('.animate-child');
                    children.forEach((child, index) => {
                        child.style.animationDelay = `${index * 0.1}s`;
                        child.classList.add('animated');
                    });
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        animatedElements.forEach(element => observer.observe(element));
    }
    
    initHoverEffects() {
        // 3D tilt effect for cards
        const tiltCards = document.querySelectorAll('.tilt-card');
        
        tiltCards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateY = (x - centerX) / 25;
                const rotateX = (centerY - y) / 25;
                
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
            });
        });
        
        // Glow effect on hover
        const glowElements = document.querySelectorAll('.glow-on-hover');
        
        glowElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                element.style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.3)';
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.boxShadow = '';
            });
        });
    }
    
    initForms() {
        // Initialize EmailJS
        emailjs.init("Qjee81I9Hf7ohhdgy");
        
        // Form validation and submission
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalText = submitBtn.innerHTML;
                
                // Show loading state
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
                submitBtn.disabled = true;
                
                try {
                    // Collect form data
                    const formData = new FormData(form);
                    const data = Object.fromEntries(formData);
                    
                    // Add metadata
                    data.page = window.location.pathname;
                    data.timestamp = new Date().toISOString();
                    data.userAgent = navigator.userAgent;
                    
                    // Send via EmailJS
                    await emailjs.send('default_service', 'template_2v27heb', {
                        ...data,
                        to_email: "shivgarg597@gmail.com"
                    });
                    
                    // Show success message
                    this.showNotification('Success! We will contact you soon.', 'success');
                    form.reset();
                    
                } catch (error) {
                    console.error('Form submission error:', error);
                    
                    // Fallback to mailto
                    const body = Object.entries(data)
                        .map(([key, value]) => `${key}: ${value}`)
                        .join('\n');
                    
                    window.location.href = `mailto:shivgarg597@gmail.com?subject=New Inquiry - MyViralReach&body=${encodeURIComponent(body)}`;
                    
                    this.showNotification('Form prepared in email. Please send to complete.', 'info');
                    
                } finally {
                    // Reset button
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
                }
            });
        });
        
        // Real-time form validation
        document.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('blur', () => {
                this.validateInput(input);
            });
            
            input.addEventListener('input', () => {
                this.validateInput(input, true);
            });
        });
    }
    
    validateInput(input, realtime = false) {
        const value = input.value.trim();
        const type = input.type;
        const isRequired = input.required;
        
        // Clear previous validation
        input.classList.remove('valid', 'invalid');
        
        if (!isRequired && value === '') {
            return true;
        }
        
        let isValid = true;
        let message = '';
        
        switch (type) {
            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                isValid = emailRegex.test(value);
                message = isValid ? '' : 'Please enter a valid email address';
                break;
                
            case 'tel':
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                isValid = phoneRegex.test(value.replace(/[^0-9+]/g, ''));
                message = isValid ? '' : 'Please enter a valid phone number';
                break;
                
            case 'url':
                const urlRegex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                isValid = urlRegex.test(value);
                message = isValid ? '' : 'Please enter a valid URL';
                break;
                
            default:
                if (input.hasAttribute('minlength')) {
                    const minLength = parseInt(input.getAttribute('minlength'));
                    isValid = value.length >= minLength;
                    message = `Minimum ${minLength} characters required`;
                }
                
                if (input.hasAttribute('maxlength')) {
                    const maxLength = parseInt(input.getAttribute('maxlength'));
                    isValid = value.length <= maxLength;
                    message = `Maximum ${maxLength} characters allowed`;
                }
                break;
        }
        
        if (isRequired && value === '') {
            isValid = false;
            message = 'This field is required';
        }
        
        // Apply validation state
        if (!realtime && !isValid) {
            input.classList.add('invalid');
            this.showInputError(input, message);
        } else if (realtime && isValid && value !== '') {
            input.classList.add('valid');
        }
        
        return isValid;
    }
    
    showInputError(input, message) {
        // Remove existing error
        const existingError = input.parentNode.querySelector('.error-message');
        if (existingError) existingError.remove();
        
        // Create error message
        const error = document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        error.style.cssText = `
            color: var(--danger);
            font-size: 0.875rem;
            margin-top: 0.25rem;
        `;
        
        input.parentNode.appendChild(error);
        
        // Auto-remove error on input
        input.addEventListener('input', () => {
            error.remove();
            input.classList.remove('invalid');
        }, { once: true });
    }
    
    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--danger)' : 'var(--primary)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: var(--radius-md);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            box-shadow: var(--shadow-lg);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        `;
        
        // Add animation keyframes
        if (!document.querySelector('#notification-animation')) {
            const style = document.createElement('style');
            style.id = 'notification-animation';
            style.textContent = `
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(notification);
        
        // Close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease forwards';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
    
    initInteractiveElements() {
        // Copy to clipboard functionality
        document.querySelectorAll('.copy-btn').forEach(button => {
            button.addEventListener('click', async () => {
                const text = button.getAttribute('data-copy');
                try {
                    await navigator.clipboard.writeText(text);
                    this.showNotification('Copied to clipboard!', 'success');
                } catch (err) {
                    this.showNotification('Failed to copy', 'error');
                }
            });
        });
        
        // Toggle elements
        document.querySelectorAll('.toggle-btn').forEach(button => {
            button.addEventListener('click', () => {
                const target = document.querySelector(button.getAttribute('data-target'));
                if (target) {
                    target.classList.toggle('active');
                    button.classList.toggle('active');
                    
                    const icon = button.querySelector('i');
                    if (icon) {
                        icon.className = target.classList.contains('active') ? 
                            'fas fa-chevron-up' : 'fas fa-chevron-down';
                    }
                }
            });
        });
        
        // Tab navigation
        document.querySelectorAll('.tab-btn').forEach(button => {
            button.addEventListener('click', () => {
                const tabId = button.getAttribute('data-tab');
                const tabContainer = button.closest('.tabs');
                
                // Update active tab
                tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                button.classList.add('active');
                
                // Show corresponding content
                tabContainer.querySelectorAll('.tab-content').forEach(content => {
                    content.classList.remove('active');
                });
                
                const targetContent = document.getElementById(tabId);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
            });
        });
    }
    
    initPerformance() {
        // Lazy loading images
        this.initLazyLoading();
        
        // Debounce scroll events
        this.debounceScroll();
        
        // Monitor performance
        this.monitorPerformance();
    }
    
    initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.getAttribute('data-src');
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => imageObserver.observe(img));
    }
    
    debounceScroll() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    // Handle scroll events efficiently
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    monitorPerformance() {
        // Log performance metrics
        window.addEventListener('load', () => {
            if ('performance' in window) {
                const timing = performance.timing;
                const loadTime = timing.loadEventEnd - timing.navigationStart;
                
                console.log(`Page loaded in ${loadTime}ms`);
                
                // Send to analytics (if implemented)
                if (typeof ga !== 'undefined') {
                    ga('send', 'timing', 'Page Load', 'load', loadTime);
                }
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new MyViralReach();
    
    // Add CSS for animations
    const style = document.createElement('style');
    style.textContent = `
        .fade-in {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .fade-in.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        .animate-child {
            opacity: 0;
            transform: translateY(20px);
            transition: opacity 0.6s ease, transform 0.6s ease;
        }
        
        .animate-child.animated {
            opacity: 1;
            transform: translateY(0);
        }
        
        .tilt-card {
            transition: transform 0.3s ease;
        }
        
        .form-control.valid {
            border-color: var(--success);
        }
        
        .form-control.invalid {
            border-color: var(--danger);
        }
        
        .tab-content {
            display: none;
        }
        
        .tab-content.active {
            display: block;
            animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
    `;
    document.head.appendChild(style);
});
