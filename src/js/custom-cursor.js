// Custom Cursor Implementation - Optimized for Performance
(function() {
    'use strict';

    // Check if device supports hover (skip on mobile/touch devices)
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    if (isTouchDevice) {
        return; // Exit on touch devices
    }

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        return; // Exit if user prefers reduced motion
    }

    // Create cursor elements
    function createCursor() {
        const cursorContainer = document.createElement('div');
        cursorContainer.className = 'custom-cursor';
        
        const cursorDot = document.createElement('div');
        cursorDot.className = 'cursor-dot';
        
        const cursorOutline = document.createElement('div');
        cursorOutline.className = 'cursor-outline';
        
        cursorContainer.appendChild(cursorDot);
        cursorContainer.appendChild(cursorOutline);
        document.body.appendChild(cursorContainer);
        
        return { container: cursorContainer, dot: cursorDot, outline: cursorOutline };
    }

    // Initialize cursor
    function initCustomCursor() {
        const cursor = createCursor();
        let mouseX = 0;
        let mouseY = 0;
        let cursorX = 0;
        let cursorY = 0;
        let outlineX = 0;
        let outlineY = 0;
        let isMoving = false;
        let animationId = null;

        // Throttle mousemove for better performance
        let lastMoveTime = 0;
        const moveThrottle = 16; // ~60fps

        // Update cursor position
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            if (now - lastMoveTime < moveThrottle) return;
            
            mouseX = e.clientX;
            mouseY = e.clientY;
            isMoving = true;
            lastMoveTime = now;
            
            // Start animation if not running
            if (!animationId) {
                animate();
            }
        });

        // Smooth cursor animation with performance optimization
        function animate() {
            // Calculate distance to target
            const dotDx = mouseX - cursorX;
            const dotDy = mouseY - cursorY;
            const outlineDx = mouseX - outlineX;
            const outlineDy = mouseY - outlineY;
            
            // Stop animation if cursor is close enough and not moving
            const threshold = 0.5;
            if (Math.abs(dotDx) < threshold && Math.abs(dotDy) < threshold && 
                Math.abs(outlineDx) < threshold && Math.abs(outlineDy) < threshold) {
                isMoving = false;
                animationId = null;
                return;
            }
            
            // Cursor dot follows mouse with easing
            cursorX += dotDx * 0.25;
            cursorY += dotDy * 0.25;
            
            // Outline follows with delay
            outlineX += outlineDx * 0.12;
            outlineY += outlineDy * 0.12;
            
            // Use transform for better performance (GPU accelerated)
            cursor.dot.style.transform = `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;
            cursor.outline.style.transform = `translate(${outlineX}px, ${outlineY}px) translate(-50%, -50%)`;
            
            animationId = requestAnimationFrame(animate);
        }

        // Hover effects for clickable elements (optimized with event delegation)
        const hoverElements = 'a, button, input[type="submit"], input[type="button"], .btn, .nav-item, .icon-btn, .profile-menu, .notification-btn, [onclick], [role="button"]';
        
        let currentHoverElement = null;
        
        document.addEventListener('mouseover', (e) => {
            const target = e.target.matches(hoverElements) ? e.target : e.target.closest(hoverElements);
            if (target && target !== currentHoverElement) {
                document.body.classList.add('cursor-hover');
                currentHoverElement = target;
            }
        }, { passive: true });
        
        document.addEventListener('mouseout', (e) => {
            const target = e.target.matches(hoverElements) ? e.target : e.target.closest(hoverElements);
            if (target === currentHoverElement) {
                document.body.classList.remove('cursor-hover');
                currentHoverElement = null;
            }
        }, { passive: true });

        // Active state on click
        document.addEventListener('mousedown', () => {
            document.body.classList.add('cursor-active');
        }, { passive: true });
        
        document.addEventListener('mouseup', () => {
            document.body.classList.remove('cursor-active');
        }, { passive: true });

        // Text selection cursor (optimized)
        const textElements = 'input[type="text"], input[type="email"], input[type="password"], input[type="number"], input[type="tel"], textarea, [contenteditable="true"]';
        
        let currentTextElement = null;
        
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches(textElements) && e.target !== currentTextElement) {
                document.body.classList.add('cursor-text');
                currentTextElement = e.target;
            }
        }, { passive: true });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target === currentTextElement) {
                document.body.classList.remove('cursor-text');
                currentTextElement = null;
            }
        }, { passive: true });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', () => {
            document.body.classList.add('cursor-hidden');
        }, { passive: true });
        
        document.addEventListener('mouseenter', () => {
            document.body.classList.remove('cursor-hidden');
        }, { passive: true });

        // Loading state (can be triggered by other scripts)
        window.setCursorLoading = function(loading) {
            if (loading) {
                document.body.classList.add('cursor-loading');
            } else {
                document.body.classList.remove('cursor-loading');
            }
        };
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCustomCursor);
    } else {
        initCustomCursor();
    }
})();
