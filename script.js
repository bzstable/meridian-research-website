/**
 * Meridian Research - Main JavaScript
 * Handles scroll animations, navigation, and interactions
 */

// Global state variables
let isAnimating = false;
let currentStep = 0;
let lastScrollTop = 0;
let animationComplete = false;
let animationsStarted = false;

// DOM Elements
let wordElements;
let finalPhrase;
let logoReveal;
let floatingMenu;
let mainContent;
let animationOverlay;
let quoteSection;
let menuLinks;
let hamburger;
let navLinks;
let navMenu;
let mainHeader;

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    wordElements = document.querySelectorAll('.word');
    finalPhrase = document.querySelector('#final-phrase');
    logoReveal = document.querySelector('#logo-reveal');
    floatingMenu = document.querySelector('#floating-menu');
    mainContent = document.querySelector('#main-content');
    animationOverlay = document.querySelector('#animation-overlay');
    quoteSection = document.querySelector('#quote-section');
    menuLinks = document.querySelectorAll('.menu-links a');
    hamburger = document.querySelector('.hamburger');
    navLinks = document.querySelector('.nav-links');
    navMenu = document.querySelector('.nav-menu');
    mainHeader = document.querySelector('#main-header');

    // Prevent transitions on page load
    document.body.classList.remove('preload');

    // Initialize animations and functionality
    initializeAnimations();
    setupSmoothScrolling();
    setupSectionAnimations();
    setupMobileMenu();
    setupScrollEffects();

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resizing');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resizing');
        }, 250);
    });

    console.log('Meridian Research website initialized');
});

// ===================================
// Animation Functions
// ===================================

function showWord(wordIndex) {
    if (wordIndex < 0 || wordIndex >= wordElements.length) return;
    
    isAnimating = true;
    const word = wordElements[wordIndex];
    
    // Hide all other words completely
    wordElements.forEach((w, i) => {
        if (i !== wordIndex && w) {
            w.classList.remove('visible', 'strike');
            w.classList.add('hidden');
            w.style.display = 'none';
        }
    });
    
    // Hide final phrase if visible
    if (finalPhrase) {
        finalPhrase.classList.remove('visible');
        finalPhrase.style.display = 'none';
    }
    
    // Show current word
    if (word) {
        word.style.display = 'flex';
        word.classList.remove('hidden', 'strike');
        word.classList.add('visible');
    }
    
    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

function strikeWord(wordIndex) {
    if (wordIndex < 0 || wordIndex >= wordElements.length) return;
    
    isAnimating = true;
    const word = wordElements[wordIndex];
    
    if (word && word.classList.contains('visible')) {
        word.classList.add('strike');
        
        setTimeout(() => {
            word.classList.remove('visible', 'strike');
            word.classList.add('hidden');
            word.style.display = 'none';
            isAnimating = false;
        }, 1000);
    } else {
        isAnimating = false;
    }
}

function showFinalPhrase() {
    isAnimating = true;
    
    // Hide all words completely
    wordElements.forEach(word => {
        if (word) {
            word.classList.remove('visible', 'strike');
            word.classList.add('hidden');
            word.style.display = 'none';
        }
    });
    
    // Show final phrase
    if (finalPhrase) {
        finalPhrase.style.display = 'flex';
        finalPhrase.classList.add('visible');
    }
    
    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

function hideFinalPhrase() {
    isAnimating = true;
    
    if (finalPhrase) {
        finalPhrase.classList.add('fade-out');
        finalPhrase.classList.remove('visible');
        setTimeout(() => {
            finalPhrase.style.display = 'none';
        }, 800);
    }
    
    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

function showLogo() {
    isAnimating = true;
    
    if (logoReveal) {
        logoReveal.style.display = 'flex';
        logoReveal.classList.remove('hidden');
        logoReveal.classList.add('visible');
    }
    
    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

function fadeOutLogo() {
    isAnimating = true;
    
    if (logoReveal) {
        logoReveal.classList.add('fade-out');
        logoReveal.classList.remove('visible');
        setTimeout(() => {
            logoReveal.style.display = 'none';
        }, 800);
    }
    
    setTimeout(() => {
        isAnimating = false;
    }, 800);
}

function showMenuBarAndComplete() {
    isAnimating = true;
    
    // Hide logo completely
    if (logoReveal) {
        logoReveal.style.display = 'none';
    }
    
    // Show floating menu bar
    if (floatingMenu) {
        floatingMenu.classList.remove('hidden');
        floatingMenu.classList.add('visible');
        floatingMenu.style.display = 'block';
    }
    
    // Complete the animation sequence
    completeAnimations();
    
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

function completeAnimations() {
    isAnimating = true;
    
    // Hide the animation overlay
    if (animationOverlay) {
        animationOverlay.classList.remove('active');
        animationOverlay.classList.add('hidden');
    }
    
    // Show the floating menu
    if (floatingMenu) {
        floatingMenu.classList.remove('hidden');
        floatingMenu.classList.add('visible');
        document.body.classList.add('menu-visible');
        updateActiveNavLink();
    }
    
    // Show main content
    if (mainContent) {
        setTimeout(() => {
            mainContent.style.visibility = 'visible';
            mainContent.style.opacity = '1';
            mainContent.classList.add('visible');
            
            // Scroll to top
            window.scrollTo(0, 0);
        }, 300);
    }
    
    // Enable normal scrolling
    document.body.classList.remove('animation-active');
    document.body.classList.add('animation-complete');
    
    // Mark animations as complete
    animationComplete = true;
    
    // Initialize scroll-based effects
    window.addEventListener('scroll', handleScrollEffects);
    
    setTimeout(() => {
        isAnimating = false;
    }, 500);
}

// ===================================
// Automatic Animation Sequence
// ===================================

function startAutomaticAnimationSequence() {
    // Step 0: Show first word after 1 second
    setTimeout(() => {
        if (!animationComplete && currentStep === 0) {
            showWord(0);
            currentStep = 1;
            
            // Step 1: Strike first word after 2 seconds
            setTimeout(() => {
                if (!animationComplete && currentStep === 1) {
                    strikeWord(0);
                    currentStep = 2;
                    
                    // Continue with the rest of the sequence
                    continueAnimationSequence();
                }
            }, 2000);
        }
    }, 1000);
}

function continueAnimationSequence() {
    const delays = [1500, 2000, 1500, 2000, 1500, 2000, 1500, 3000, 2500, 2000, 2000];
    
    function executeNextStep() {
        if (animationComplete || currentStep >= 12) return;
        
        const delay = delays[currentStep - 2] || 1500;
        
        setTimeout(() => {
            if (!animationComplete) {
                switch(currentStep) {
                    case 2: // Show word 2
                        showWord(1);
                        currentStep = 3;
                        break;
                    case 3: // Strike word 2
                        strikeWord(1);
                        currentStep = 4;
                        break;
                    case 4: // Show word 3
                        showWord(2);
                        currentStep = 5;
                        break;
                    case 5: // Strike word 3
                        strikeWord(2);
                        currentStep = 6;
                        break;
                    case 6: // Show word 4
                        showWord(3);
                        currentStep = 7;
                        break;
                    case 7: // Strike word 4
                        strikeWord(3);
                        currentStep = 8;
                        break;
                    case 8: // Show final phrase
                        showFinalPhrase();
                        currentStep = 9;
                        break;
                    case 9: // Fade out final phrase
                        hideFinalPhrase();
                        currentStep = 10;
                        break;
                    case 10: // Show logo
                        showLogo();
                        currentStep = 11;
                        break;
                    case 11: // Fade out logo and show menu
                        fadeOutLogo();
                        showMenuBarAndComplete();
                        currentStep = 12;
                        break;
                }
                
                // Continue to next step
                if (currentStep < 12) {
                    executeNextStep();
                }
            }
        }, delay);
    }
    
    executeNextStep();
}

// ===================================
// Scroll and Navigation Functions
// ===================================

function updateActiveNavLink() {
    if (!animationComplete) return;
    
    const scrollPosition = window.scrollY + 100;
    const sections = document.querySelectorAll('section[id]');
    let currentSection = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });
    
    menuLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

function handleScrollEffects() {
    if (!animationComplete) return;
    updateActiveNavLink();
    showQuote();
}

function showQuote() {
    if (quoteSection && animationComplete) {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop < window.innerHeight * 0.5) {
            quoteSection.classList.add('visible');
        } else {
            quoteSection.classList.remove('visible');
        }
    }
}

// ===================================
// Setup Functions
// ===================================

function initializeAnimations() {
    // Set initial state
    document.body.classList.add('animation-active');
    
    // Make sure main content is hidden initially
    if (mainContent) {
        mainContent.style.opacity = '0';
        mainContent.style.visibility = 'hidden';
    }
    
    if (animationOverlay) {
        animationOverlay.classList.add('active');
    }
    
    animationsStarted = true;
    
    // Start the automatic animation sequence
    startAutomaticAnimationSequence();
}

function setupSmoothScrolling() {
    // Add smooth scrolling for navigation links
    menuLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const menuHeight = floatingMenu ? floatingMenu.offsetHeight : 80;
                const offsetTop = targetElement.offsetTop - menuHeight - 40;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    if (hamburger) hamburger.classList.remove('active');
                    document.body.style.overflow = 'auto';
                }
            }
        });
    });

    // Add click handler for logo section to scroll to top
    const logoSection = document.querySelector('.logo-section');
    if (logoSection) {
        logoSection.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

function setupMobileMenu() {
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
}

function setupScrollEffects() {
    // Setup intersection observer for sections
    const sections = document.querySelectorAll('.section');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && animationComplete) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        if (section) {
            observer.observe(section);
        }
    });

    // Handle scroll events
    window.addEventListener('scroll', handleScrollEffects, { passive: true });
}

// ===================================
// Event Handlers
// ===================================

function onWheel(e) {
    if (!animationComplete) {
        // During animations, prevent default scroll
        e.preventDefault();
    }
}

// Prevent default scroll during animations
window.addEventListener('wheel', onWheel, { passive: false });

// Handle touch events for mobile
let touchStartY = 0;
window.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
}, { passive: true });

window.addEventListener('touchend', e => {
    if (!animationComplete) {
        e.preventDefault();
    }
}, { passive: false });

// Easing function for smooth scrolling
function easeInOutQuad(t, b, c, d) {
    t /= d/2;
    if (t < 1) return c/2*t*t + b;
    t--;
    return -c/2 * (t*(t-2) - 1) + b;
}
