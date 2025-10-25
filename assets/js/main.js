// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name') || contactForm.querySelector('input[type="text"]').value;
        const email = formData.get('email') || contactForm.querySelector('input[type="email"]').value;
        const message = formData.get('message') || contactForm.querySelector('textarea').value;
        const privacyAccepted = formData.get('privacy') ? true : contactForm.querySelector('input[type="checkbox"]').checked;

        // Validation
        if (!name || !email || !message || !privacyAccepted) {
            alert('Please fill in all fields and accept the privacy policy.');
            return;
        }

        // Disable submit button
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = 'Sending...';

        try {
            // Send to API
            const response = await API.submitContact({
                name,
                email,
                message,
                privacy_accepted: privacyAccepted,
            });

            // Show success message
            alert(response.message || 'Thank you for your message! We will get back to you soon.');
            contactForm.reset();
        } catch (error) {
            // Show error message
            alert('Error: ' + (error.message || 'Failed to submit form. Please try again.'));
        } finally {
            // Re-enable submit button
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });
}

// Smooth Scrolling for anchor links
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

// Load and Display Testimonials
let currentTestimonial = 0;
let testimonials = [];
let testimonialsInterval = null;

async function loadTestimonials() {
    const testimonialsContainer = document.querySelector('.testimonial-slider');

    if (!testimonialsContainer) return;

    try {
        // Fetch testimonials from API
        const response = await API.getTestimonials();
        testimonials = response.testimonials || [];

        if (testimonials.length === 0) {
            // Keep existing static testimonials if API returns empty
            testimonials = document.querySelectorAll('.testimonial');
            if (testimonials.length > 0) {
                startTestimonialRotation();
            }
            return;
        }

        // Clear container and render testimonials
        testimonialsContainer.innerHTML = '';
        testimonials.forEach((testimonial, index) => {
            const testimonialElement = document.createElement('div');
            testimonialElement.className = 'testimonial';
            testimonialElement.style.display = index === 0 ? 'block' : 'none';
            testimonialElement.innerHTML = `
                ${testimonial.image_url ? `<img src="${testimonial.image_url}" alt="${testimonial.name}">` : ''}
                <blockquote>${testimonial.content}</blockquote>
                <cite>- ${testimonial.name}${testimonial.age ? ', ' + testimonial.age : ''}</cite>
            `;
            testimonialsContainer.appendChild(testimonialElement);
        });

        startTestimonialRotation();
    } catch (error) {
        console.error('Failed to load testimonials:', error);
        // Keep existing static testimonials
        testimonials = document.querySelectorAll('.testimonial');
        if (testimonials.length > 0) {
            startTestimonialRotation();
        }
    }
}

function rotateTestimonials() {
    const testimonialElements = document.querySelectorAll('.testimonial');
    if (testimonialElements.length > 1) {
        testimonialElements.forEach(t => t.style.display = 'none');
        testimonialElements[currentTestimonial].style.display = 'block';
        currentTestimonial = (currentTestimonial + 1) % testimonialElements.length;
    }
}

function startTestimonialRotation() {
    if (testimonialsInterval) {
        clearInterval(testimonialsInterval);
    }
    testimonialsInterval = setInterval(rotateTestimonials, 5000);
}

// Load testimonials on page load
if (document.querySelector('.testimonial-slider')) {
    // Try to load from API if available, otherwise use static content
    if (window.API) {
        loadTestimonials();
    } else {
        // Fallback to static testimonials
        testimonials = document.querySelectorAll('.testimonial');
        if (testimonials.length > 0) {
            startTestimonialRotation();
        }
    }
}
