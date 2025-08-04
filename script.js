/**
 * Meridian Research - Main JavaScript
 * Handles scroll animations, navigation, and interactions
 */

document.addEventListener('DOMContentLoaded', function() {
    // Prevent transitions on page load
    document.body.classList.remove('preload');
    
    // ===================================
    // Animation State Management
    // ===================================
    const words = ['commands', 'syntax', 'scripts', 'programming'];
    let currentStep = 0; // Track the current animation step
    let isAnimating = false;
    let lastScrollTop = 0;
    let animationComplete = false;
    let animationsStarted = false;
    
    // Animation steps:
    // 0: Show word 1
    // 1: Strike word 1
    // 2: Show word 2
    // 3: Strike word 2
    // 4: Show word 3
    // 5: Strike word 3
    // 6: Show word 4
    // 7: Strike word 4
    // 8: Show final phrase
    // 9: Fade out final phrase
    // 10: Show logo
    // 11: Fade out logo
    // 12: Show menu bar and complete

    // DOM Elements
    const wordElements = words.map((_, i) => document.getElementById(`word${i + 1}`));
    const finalPhrase = document.getElementById('final-phrase');
    const logoReveal = document.getElementById('logo-reveal');
    const animationOverlay = document.getElementById('animation-overlay');
    const quoteSection = document.getElementById('quote-section');
    const mainContent = document.getElementById('main-content');
    const floatingMenu = document.getElementById('floating-menu');
    const menuLinks = document.querySelectorAll('.menu-links a');
    
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
        
        // Show the floating menu with a slight delay
        if (floatingMenu) {
            floatingMenu.classList.remove('hidden');
            floatingMenu.classList.add('visible');
            document.body.classList.add('menu-visible');
            updateActiveNavLink();
        }
        
        // Show main content with a slight delay
        if (mainContent) {
            setTimeout(() => {
                mainContent.style.visibility = 'visible';
                mainContent.style.opacity = '1';
                mainContent.classList.add('visible');
                
                // Scroll to top to ensure content is visible
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
    
    // Update active nav link based on scroll position
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
    
    // Handle scroll-based effects after animations complete
    function handleScrollEffects() {
        if (!animationComplete) return;
        
        // Update active nav link
        updateActiveNavLink();
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
    // Scroll Handler
    // ===================================
    
    function handleScrollDown() {
        if (isAnimating || animationComplete) return;
        
        switch (currentStep) {
            case 0: // Show word 1
                showWord(0);
                currentStep = 1;
                break;
            case 1: // Strike word 1
                strikeWord(0);
                currentStep = 2;
                break;
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
            case 11: // Fade out logo
                fadeOutLogo();
                currentStep = 12;
                break;
            case 12: // Show menu bar and complete
                showMenuBarAndComplete();
                currentStep = 13;
                break;
            default:
                break;
        }
    }
    
    // ===================================
    // Event Listeners
    // ===================================
    
    let scrollTimeout;
    let lastDirection = 'down';
    
    function onScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        
        if (!animationComplete) {
            // Only handle scroll down events during animation sequence
            if (scrollDirection === 'down') {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    handleScrollDown();
                }, 10);
            }
        } else {
            // After animations complete, handle quote display
            showQuote();
        }
        
        lastDirection = scrollDirection;
    }
    
    function onWheel(e) {
        if (!animationComplete) {
            // During animations, respond to wheel events even when scroll is disabled
            if (e.deltaY > 0) { // Scroll down
                e.preventDefault();
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    handleScrollDown();
                }, 10);
            }
        }
    }
    
    // ===================================
    // Initialization
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
        const delays = [1500, 2000, 1500, 2000, 1500, 2000, 1500, 3000, 2500, 2000, 2000]; // Delays between each step
        
        function executeNextStep() {
            if (animationComplete || currentStep >= 12) return;
            
            const delay = delays[currentStep - 2] || 1500; // Get delay for current step
            
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
    
    // Initialize everything when DOM is loaded
    initializeAnimations();
    
    // Smooth scroll for menu links and logo
    function setupMenuInteractions() {
        // Handle menu links
        menuLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 100,
                        behavior: 'smooth'
                    });
                    
                    // Update active link
                    menuLinks.forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            });
        });
        
        // Handle logo click to scroll to top
        const logoSection = document.querySelector('.logo-section');
        if (logoSection) {
            logoSection.style.cursor = 'pointer';
            logoSection.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
                // Update active link
                menuLinks.forEach(l => l.classList.remove('active'));
            });
        }
    }
    
    // Initialize menu interactions
    setupMenuInteractions();
    
    // Initialize scroll event listeners (only active after animations complete)
    window.addEventListener('scroll', (e) => {
        if (animationComplete) {
            onScroll(e);
        }
    }, { passive: true });
    
    window.addEventListener('wheel', (e) => {
        if (!animationComplete) {
            e.preventDefault(); // Prevent scrolling during animations
        } else {
            onWheel(e);
        }
    }, { passive: false });
    
    // Handle keyboard navigation (only after animations complete)
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === ' ' || e.key === 'PageDown') {
            if (animationComplete) {
                // Allow normal page scrolling after animations
                return;
            } else {
                e.preventDefault(); // Prevent scrolling during animations
            }
        }
    });
    
    // Handle touch events for mobile (only after animations complete)
    let touchStartY = 0;
    document.addEventListener('touchstart', (e) => {
        if (animationComplete) {
            touchStartY = e.touches[0].clientY;
        }
    }, { passive: true });
    
    document.addEventListener('touchend', (e) => {
        if (animationComplete) {
            // Allow normal touch scrolling after animations
            return;
        }
    }, { passive: true });
    
    // ===================================
    // Mobile Menu Toggle
    // ===================================
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Prevent body scroll when menu is open on mobile
            if (navMenu.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = 'auto';
            }
        });
    }
    
    // ===================================
    // Smooth Scrolling for Navigation
    // ===================================
    
    function setupSmoothScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                if (animationComplete) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        const headerHeight = mainHeader ? mainHeader.offsetHeight : 0;
                        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 30;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        if (hamburger && navMenu) {
                            hamburger.classList.remove('active');
                            navMenu.classList.remove('active');
                            document.body.style.overflow = 'auto';
                        }
                    }
                }
            });
        });
    }
    
    // ===================================
    // Section Animation Observer
    // ===================================
    
    function setupSectionAnimations() {
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
            observer.observe(section);
        });
    }
    
    // Navigation hover effects removed
    
    // ===================================
    // Initialize Everything
    // ===================================
    
    // Always play animations on page load
    initializeAnimations();
    
    // Setup other functionality
    setupSmoothScrolling();
    setupSectionAnimations();
    
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