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
    document.querySelectorAll('.portfolio-card').forEach(card => {
        card.addEventListener('click', function (e) {
            // Prevent if clicking on tags or external links if any (though currently whole card is clickable)
            // But we want to target the image mainly? Or the whole card as a trigger?
            // The request was "show design in full size", so clicking the card usually implies "view project".
            // Let's use the image inside the card as the source.

            const img = this.querySelector('img');
            const title = this.querySelector('h3').textContent;

            if (img) {
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