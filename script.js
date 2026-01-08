document.addEventListener('DOMContentLoaded', () => {

    // Mobile Menu Toggle
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            mobileBtn.textContent = navLinks.classList.contains('active') ? '✕' : '☰';
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if (mobileBtn) mobileBtn.textContent = '☰';
        });
    });

    // Smooth Scroll for Anchor Links (Backup for old browsers, though CSS handles it)
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });

    // Lightbox Modal Functionality
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-image');
    const captionText = document.getElementById('caption');
    const closeBtn = document.querySelector('.modal-close');

    // Open Modal when clicking on project images
    // Open Modal when clicking on project images
    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('click', function (e) {
            // Check if multiple images exist (slider) or single image
            const sliderTrack = this.querySelector('.slider-track');
            let img;

            if (sliderTrack) {
                // If it's a slider, get the currently visible image
                // We'll track the index on the slider container or calculate from transform
                // Actually, let's just find the one that matches the current index.
                // We will implement slider logic below and store current index in dataset.
                const currentIndex = parseInt(this.querySelector('.slider-container').dataset.currentIndex || 0);
                img = sliderTrack.children[currentIndex];
            } else {
                img = this.querySelector('img');
            }

            const title = this.querySelector('h3').textContent;

            // Only open if we didn't click a slider button
            if (img && !e.target.classList.contains('slider-btn')) {
                modal.style.display = "flex";
                // Trigger reflow to enable transition
                void modal.offsetWidth;
                modal.classList.add('show');

                modalImg.src = img.src;
                modalImg.alt = img.alt;
                captionText.textContent = title;
                document.body.style.overflow = 'hidden'; // Disable scroll
            }
        });
    });

    // Slider Functionality
    document.querySelectorAll('.slider-container').forEach(slider => {
        const track = slider.querySelector('.slider-track');
        const slides = track.querySelectorAll('.slider-item');
        const nextBtn = slider.querySelector('.next-btn');
        const prevBtn = slider.querySelector('.prev-btn');
        let currentIndex = 0;

        // Initialize dataset
        slider.dataset.currentIndex = 0;

        function updateSlider() {
            track.style.transform = `translateX(-${currentIndex * 100}%)`;
            slider.dataset.currentIndex = currentIndex; // Update for lightbox usage
        }

        if (nextBtn && prevBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening lightbox
                currentIndex = (currentIndex + 1) % slides.length;
                updateSlider();
            });

            prevBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent opening lightbox
                currentIndex = (currentIndex - 1 + slides.length) % slides.length;
                updateSlider();
            });
        }
    });

    // Close Modal Function
    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = "none";
            document.body.style.overflow = 'auto'; // Enable scroll
        }, 300); // Match transition duration
    }

    // Close on X click
    if (closeBtn) {
        closeBtn.addEventListener('click', closeModal);
    }

    // Close on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close on Escape Key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal();
        }
    });
});