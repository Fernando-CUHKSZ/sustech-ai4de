document.addEventListener('DOMContentLoaded', () => {
    const searchBar = document.getElementById('search-bar');
    const searchButton = document.getElementById('search-button');
    const modules = document.querySelectorAll('.module');
    const header = document.querySelector('header');
    const backToTopButton = document.getElementById('back-to-top');
    const heroBackground = document.querySelector('.hero-background');
    const heroSection = document.querySelector('#hero');
    
    // Dynamic search suggestions
    searchBar.addEventListener('input', (e) => {
        // Implement search suggestions logic here
        console.log('Search input:', e.target.value);
    });

    // Update the module hover effect
    modules.forEach(module => {
        module.addEventListener('mouseenter', () => {
            const field = module.getAttribute('data-field');
            module.style.backgroundImage = `url('images/${field}-bg.jpg')`;
            module.style.backgroundSize = 'cover';
        });

        module.addEventListener('mouseleave', () => {
            module.style.backgroundImage = 'none';
        });
    });

    // Implement smooth scrolling for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
            setTimeout(() => {
                createSmoothTransition(targetId);
            }, 500);
        });
    });

    // Add parallax scrolling effect and dynamic animations
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.parallax');
        parallaxElements.forEach(el => {
            const speed = el.getAttribute('data-speed');
            el.style.transform = `translateY(${scrolled * speed}px)`;
        });

        // Update header text color on scroll
        updateHeaderTextColor();

        // Change header background on scroll
        if (scrolled > 50) {
            header.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        } else {
            header.style.backgroundColor = 'transparent';
        }

        // Show/hide back to top button
        if (scrolled > 300) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }

        // Dynamic background color change
        const hue = (scrolled / (document.documentElement.scrollHeight - window.innerHeight)) * 60;
        heroBackground.style.background = `linear-gradient(45deg, hsl(${hue}, 100%, 50%), hsl(${hue + 60}, 100%, 50%))`;

        // Animate modules and research cards when they come into view
        animateOnScroll();
    });

    // Back to top functionality
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Implement featured research slider
    const researchSlider = document.querySelector('.research-slider');
    const researchData = [
        { title: 'Digital Twins in Aerospace', abstract: 'This study explores the application of digital twin technology in aerospace engineering, focusing on predictive maintenance and performance optimization of aircraft systems.' },
        { title: 'Automotive Manufacturing Optimization', abstract: 'A comprehensive analysis of digital twin implementation in automotive production lines, highlighting improvements in efficiency and quality control.' },
        { title: 'Healthcare and Digital Twins', abstract: 'Investigating the potential of digital twins in personalized medicine and hospital management, with case studies on patient care optimization.' },
        { title: 'Smart Cities and Urban Planning', abstract: 'Exploring the role of digital twins in urban development, focusing on infrastructure management and sustainable city planning.' },
        // Add more research data as needed
    ];

    researchData.forEach(research => {
        const card = document.createElement('div');
        card.classList.add('research-card');
        card.innerHTML = `
            <h3>${research.title}</h3>
            <p>${research.abstract}</p>
        `;
        researchSlider.appendChild(card);
    });

    // Function to animate elements when they come into view
    function animateOnScroll() {
        const elements = document.querySelectorAll('.module, .research-card');
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = (rect.top <= window.innerHeight * 0.75 && rect.bottom >= 0);
            if (isVisible) {
                el.classList.add('visible');
            }
        });
    }

    // Initial animation call
    animateOnScroll();

    // Intersection Observer for lazy loading and animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                if (entry.target.classList.contains('module') || entry.target.classList.contains('research-card')) {
                    entry.target.classList.add('visible');
                }
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.module, .research-card, img').forEach(el => {
        observer.observe(el);
    });

    // Function to create smooth transitions between sections
    function createSmoothTransition(targetId) {
        const target = document.querySelector(targetId);
        const currentSection = document.querySelector('.active-section');
        
        if (currentSection) {
            currentSection.classList.add('fade-out');
            setTimeout(() => {
                currentSection.classList.remove('active-section', 'fade-out');
            }, 500);
        }

        target.classList.add('active-section', 'fade-in');
        setTimeout(() => {
            target.classList.remove('fade-in');
        }, 500);
    }

    // Add event listeners for smooth transitions
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = e.target.getAttribute('href');
            createSmoothTransition(targetId);
        });
    });

    // Resize observer for responsive adjustments
    const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
            if (entry.target.classList.contains('module-grid')) {
                const columns = Math.floor(entry.contentRect.width / 320);
                entry.target.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
            }
        }
    });

    resizeObserver.observe(document.querySelector('.module-grid'));

    // Function to check if an element is in the viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to determine if a color is light or dark
    function isColorLight(color) {
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return brightness > 155; // You can adjust this threshold
    }

    // Function to get the background color of an element
    function getBackgroundColor(element) {
        return window.getComputedStyle(element).backgroundColor;
    }

    // Function to update header text color
    function updateHeaderTextColor() {
        const headerBgColor = getBackgroundColor(header);
        if (isColorLight(headerBgColor)) {
            header.classList.add('dark-text');
            header.classList.remove('light-text');
        } else {
            header.classList.add('light-text');
            header.classList.remove('dark-text');
        }
    }

    // Call the function on load and scroll
    updateHeaderTextColor();
});
