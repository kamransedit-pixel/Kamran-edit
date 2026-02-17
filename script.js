// Sticky Navbar
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth Scroll for Anchor Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        // Handle links to other pages (e.g. index.html#contact) if we are not on that page
        if (targetId.includes('.html')) {
            window.location.href = targetId;
            return;
        }

        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70, // Adjust for navbar height
                behavior: 'smooth'
            });
        }
    });
});

// Fade-in Animation Observer
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

document.querySelectorAll('.fade-in').forEach(element => {
    observer.observe(element);
});

// Mobile Menu Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        console.log('Mobile menu clicked');
        if (navLinks.style.display === 'flex') {
            navLinks.style.display = 'none';
        } else {
            navLinks.style.display = 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '70px';
            navLinks.style.left = '0';
            navLinks.style.width = '100%';
            navLinks.style.background = '#0a0a0a';
            navLinks.style.padding = '20px';
            navLinks.style.borderBottom = '1px solid #333';
        }
    });
}

/* --- PORTFOLIO LOGIC --- */

// Filter Functionality
const filterBtns = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

if (filterBtns.length > 0) {
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            filterBtns.forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');

                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = 'block';
                    // Re-trigger fade animation
                    item.classList.remove('visible');
                    setTimeout(() => item.classList.add('visible'), 100);
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
}

// Modal Functionality
const modal = document.getElementById('videoModal');
const modalIframe = document.getElementById('modalIframe');
const modalTitle = document.getElementById('modalTitle');
const modalCategory = document.getElementById('modalCategory');
const closeModal = document.querySelector('.close-modal');

if (modal) {
    // Open Modal
    portfolioItems.forEach(item => {
        item.addEventListener('click', () => {
            const title = item.querySelector('h3').textContent;
            const category = item.querySelector('.category-tag').textContent;
            const dataVideo = item.getAttribute('data-video');
            let videoUrl = dataVideo ? dataVideo : "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1";

            modalTitle.textContent = title;
            modalCategory.textContent = category;
            modalIframe.src = videoUrl;

            modal.classList.add('show');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        });
    });

    // Close Modal
    const closeModalFunc = () => {
        modal.classList.remove('show');
        modalIframe.src = ""; // Stop video
        document.body.style.overflow = 'auto'; // Restore scrolling
    };

    closeModal.addEventListener('click', closeModalFunc);

    // Close on Outside Click
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModalFunc();
        }
    });

    // Close on ESC Key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModalFunc();
        }
    });
}


/* --- VERTICAL REEL SLIDER --- */
const reelItems = document.querySelectorAll('.reel-item');
const reelPrevBtn = document.querySelector('.prev-btn');
const reelNextBtn = document.querySelector('.next-btn');
let currentReelIndex = 0;

if (reelItems.length > 0) {
    function updateReel() {
        if (reelItems.length === 0) return;

        reelItems.forEach((item, index) => {
            const video = item.querySelector('video');
            const iframe = item.querySelector('iframe');

            // Remove previous classes for clean state
            item.classList.remove('active', 'prev', 'next');

            if (index === currentReelIndex) {
                item.classList.add('active');
                item.style.transform = 'translateY(0)';
                item.style.zIndex = '2';

                if (video) {
                    video.currentTime = 0;
                    video.muted = true;
                    const playPromise = video.play();
                    if (playPromise !== undefined) {
                        playPromise.catch(error => { console.log("Autoplay prevented:", error); });
                    }
                }
                // For iframes, we can't easily force play without user interaction if it's not already autoplaying via URL
            } else {
                // Inactive items
                if (index < currentReelIndex) {
                    item.classList.add('prev');
                    item.style.transform = 'translateY(-100%)';
                } else {
                    item.classList.add('next');
                    item.style.transform = 'translateY(100%)';
                }

                item.style.zIndex = '0';

                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
                if (iframe) {
                    // Reset iframe src to stop playback
                    const src = iframe.src;
                    iframe.src = src;
                }
            }
        });
    }

    // Navigation Buttons
    if (reelNextBtn) {
        reelNextBtn.addEventListener('click', () => {
            if (currentReelIndex < reelItems.length - 1) {
                currentReelIndex++;
            } else {
                currentReelIndex = 0; // Loop to start
            }
            updateReel();
        });
    }

    if (reelPrevBtn) {
        reelPrevBtn.addEventListener('click', () => {
            if (currentReelIndex > 0) {
                currentReelIndex--;
                updateReel();
            }
        });
    }

    // Auto Play Next on Video End
    reelItems.forEach((item) => {
        const video = item.querySelector('video');
        if (video) {
            video.addEventListener('ended', () => {
                if (currentReelIndex < reelItems.length - 1) {
                    currentReelIndex++;
                } else {
                    currentReelIndex = 0;
                }
                updateReel();
            });
        }
    });

    // Touch / Swipe Support
    let touchStartY = 0;
    let touchEndY = 0;
    const reelContainer = document.querySelector('.reel-container');

    if (reelContainer) {
        reelContainer.addEventListener('touchstart', e => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        reelContainer.addEventListener('touchend', e => {
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const threshold = 50;
        if (touchStartY - touchEndY > threshold) {
            // Swipe Up -> Next
            if (currentReelIndex < reelItems.length - 1) {
                currentReelIndex++;
                updateReel();
            } else {
                currentReelIndex = 0;
                updateReel();
            }
        } else if (touchEndY - touchStartY > threshold) {
            // Swipe Down -> Prev
            if (currentReelIndex > 0) {
                currentReelIndex--;
                updateReel();
            }
        }
    }

    // Initialize
    // Wait for DOM to be fully ready if script is in head or executing too early?
    // Script is at end of body, so it should be fine.
    updateReel();
}
