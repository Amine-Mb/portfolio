// Smooth scroll animations using Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll('.fade-in').forEach(el => {
  observer.observe(el);
});

// Skills Progress Bars Animation
const animateSkills = () => {
  const skillsSection = document.querySelector('#skills');
  if (!skillsSection) return;

  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const progressBars = entry.target.querySelectorAll('.skills__progress-fill');
        progressBars.forEach(bar => {
          const progress = bar.getAttribute('data-progress');
          setTimeout(() => {
            bar.style.width = `${progress}%`;
          }, 100);
        });
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  skillsObserver.observe(skillsSection);
};

animateSkills();

// Testimonials Carousel
const initTestimonialsCarousel = () => {
  const opinions = document.querySelectorAll('.clients__opinion');
  const dots = document.querySelectorAll('.clients__dot');
  const prevBtn = document.querySelector('.clients__nav-btn--prev');
  const nextBtn = document.querySelector('.clients__nav-btn--next');
  
  if (!opinions.length) return;

  let currentIndex = 0;
  const totalTestimonials = opinions.length;

  const showTestimonial = (index) => {
    // Remove active class from all
    opinions.forEach(opinion => opinion.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current
    opinions[index].classList.add('active');
    dots[index].classList.add('active');
  };

  const nextTestimonial = () => {
    currentIndex = (currentIndex + 1) % totalTestimonials;
    showTestimonial(currentIndex);
  };

  const prevTestimonial = () => {
    currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
    showTestimonial(currentIndex);
  };

  // Event listeners
  if (nextBtn) nextBtn.addEventListener('click', nextTestimonial);
  if (prevBtn) prevBtn.addEventListener('click', prevTestimonial);

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      currentIndex = index;
      showTestimonial(currentIndex);
    });
  });

  // Auto-play carousel (optional)
  let autoPlayInterval = setInterval(nextTestimonial, 5000);

  // Pause on hover
  const clientsSection = document.querySelector('.clients__opinions');
  if (clientsSection) {
    clientsSection.addEventListener('mouseenter', () => {
      clearInterval(autoPlayInterval);
    });
    clientsSection.addEventListener('mouseleave', () => {
      autoPlayInterval = setInterval(nextTestimonial, 5000);
    });
  }
};

initTestimonialsCarousel();

// Scroll to Top Button
const initScrollToTop = () => {
  const scrollBtn = document.querySelector('.scroll-to-top');
  if (!scrollBtn) return;

  const toggleScrollButton = () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  };

  window.addEventListener('scroll', toggleScrollButton);
  toggleScrollButton(); // Check initial state

  scrollBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
};

initScrollToTop();

// Form Validation and Enhancement
const initFormValidation = () => {
  const form = document.querySelector('form');
  if (!form) return;

  const inputs = form.querySelectorAll('input, textarea');
  const submitBtn = form.querySelector('input[type="submit"]');

  inputs.forEach(input => {
    // Real-time validation
    input.addEventListener('blur', () => {
      validateField(input);
    });

    input.addEventListener('input', () => {
      if (input.classList.contains('error')) {
        validateField(input);
      }
    });
  });

  form.addEventListener('submit', (e) => {
    let isValid = true;

    inputs.forEach(input => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();
      // Show error message
      showFormMessage('Please fix the errors before submitting.', 'error');
    } else {
      // Show success message (form will submit normally)
      showFormMessage('Sending your message...', 'success');
    }
  });

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';

    // Remove previous error styling
    field.classList.remove('error');

    // Check required fields
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required.';
    }

    // Validate email
    if (field.type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address.';
      }
    }

    // Validate phone number (optional field)
    if (field.type === 'tel' && value) {
      const phoneRegex = /^[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(value) || value.length < 10) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number.';
      }
    }

    // Validate textarea
    if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
      isValid = false;
      errorMessage = 'Message must be at least 10 characters.';
    }

    if (!isValid) {
      field.classList.add('error');
      if (errorMessage) {
        field.setAttribute('title', errorMessage);
      }
    }

    return isValid;
  }

  function showFormMessage(message, type) {
    // Remove existing message
    const existingMsg = form.querySelector('.form-message');
    if (existingMsg) {
      existingMsg.remove();
    }

    // Create new message
    const msgEl = document.createElement('div');
    msgEl.className = `form-message form-message--${type}`;
    msgEl.textContent = message;
    form.insertBefore(msgEl, submitBtn);

    // Auto-remove after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        msgEl.remove();
      }, 5000);
    }
  }
};

initFormValidation();

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const headerOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  });
});

// Lazy loading for images
const initLazyLoading = () => {
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[data-src]');
    images.forEach(img => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll('img.lazy').forEach(img => {
      imageObserver.observe(img);
    });
  }
};

initLazyLoading();

// Add loading state to video
document.addEventListener('DOMContentLoaded', () => {
  const video = document.querySelector('.video-loop');
  if (video) {
    video.addEventListener('loadeddata', () => {
      video.classList.add('loaded');
    });
  }
});

// Close mobile menu when clicking on a link
const initMobileMenu = () => {
  const menuCheckbox = document.getElementById('menu');
  const navLinks = document.querySelectorAll('.navigation__link');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (menuCheckbox && menuCheckbox.checked) {
        menuCheckbox.checked = false;
      }
    });
  });
};

initMobileMenu();

// Add keyboard navigation for carousel
document.addEventListener('keydown', (e) => {
  const clientsSection = document.querySelector('#clients');
  if (!clientsSection) return;

  const isClientsSectionVisible = clientsSection.getBoundingClientRect().top < window.innerHeight &&
                                  clientsSection.getBoundingClientRect().bottom > 0;

  if (isClientsSectionVisible) {
    const nextBtn = document.querySelector('.clients__nav-btn--next');
    const prevBtn = document.querySelector('.clients__nav-btn--prev');

    if (e.key === 'ArrowRight' && nextBtn) {
      nextBtn.click();
    } else if (e.key === 'ArrowLeft' && prevBtn) {
      prevBtn.click();
    }
  }
});

// Statistics Counter Animation
const animateStatistics = () => {
  const statisticsSection = document.querySelector('#statistics');
  if (!statisticsSection) return;

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const numbers = entry.target.querySelectorAll('.statistics__number');
        
        numbers.forEach(number => {
          const target = parseInt(number.getAttribute('data-target'));
          const duration = 2000; // 2 seconds
          const increment = target / (duration / 16); // 60fps
          let current = 0;
          
          const updateCounter = () => {
            current += increment;
            if (current < target) {
              number.textContent = Math.floor(current);
              requestAnimationFrame(updateCounter);
            } else {
              number.textContent = target;
            }
          };
          
          updateCounter();
        });
        
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statsObserver.observe(statisticsSection);
};

animateStatistics();

// Loading Screen
const initLoadingScreen = () => {
  const loader = document.getElementById('loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.style.opacity = '0';
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 500);
  });
};

initLoadingScreen();

// Enhanced Project Card Hover Effects
const initProjectCards = () => {
  const projectImages = document.querySelectorAll('.projects__img');
  
  projectImages.forEach(img => {
    img.addEventListener('mouseenter', function() {
      this.style.transform = 'scale(1.05)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    img.addEventListener('mouseleave', function() {
      this.style.transform = 'scale(1)';
    });
  });
};

initProjectCards();

// Animated Text in Hero Section
const initAnimatedText = () => {
  const animatedText = document.querySelector('.bio__title-animated');
  if (!animatedText) return;

  const titles = ['Software Engineer', 'Content Creator', 'Problem Solver', 'Tech Enthusiast'];
  let currentIndex = 0;

  setInterval(() => {
    animatedText.style.opacity = '0';
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % titles.length;
      animatedText.textContent = titles[currentIndex];
      animatedText.style.opacity = '1';
    }, 300);
  }, 3000);
};

// Wait for DOM to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimatedText);
} else {
  initAnimatedText();
}

