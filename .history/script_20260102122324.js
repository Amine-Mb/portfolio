// Smooth scroll animations using Intersection Observer
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, observerOptions);

// Observe all fade-in elements
document.querySelectorAll(".fade-in").forEach((el) => {
  observer.observe(el);
});

// Skills Progress Bars Animation
const animateSkills = () => {
  const skillsSection = document.querySelector("#skills");
  if (!skillsSection) return;

  const skillsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const progressBars = entry.target.querySelectorAll(
            ".skills__progress-fill"
          );
          progressBars.forEach((bar) => {
            const progress = bar.getAttribute("data-progress");
            setTimeout(() => {
              bar.style.width = `${progress}%`;
            }, 100);
          });
          skillsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 }
  );

  skillsObserver.observe(skillsSection);
};

animateSkills();

// Testimonials Carousel
const initTestimonialsCarousel = () => {
  const opinions = document.querySelectorAll(".clients__opinion");
  const dots = document.querySelectorAll(".clients__dot");
  const prevBtn = document.querySelector(".clients__nav-btn--prev");
  const nextBtn = document.querySelector(".clients__nav-btn--next");

  if (!opinions.length) return;

  let currentIndex = 0;
  const totalTestimonials = opinions.length;

  const showTestimonial = (index) => {
    // Remove active class from all
    opinions.forEach((opinion) => opinion.classList.remove("active"));
    dots.forEach((dot) => dot.classList.remove("active"));

    // Add active class to current
    opinions[index].classList.add("active");
    dots[index].classList.add("active");
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
  if (nextBtn) nextBtn.addEventListener("click", nextTestimonial);
  if (prevBtn) prevBtn.addEventListener("click", prevTestimonial);

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      currentIndex = index;
      showTestimonial(currentIndex);
    });
  });

  // Auto-play carousel (optional)
  let autoPlayInterval = setInterval(nextTestimonial, 5000);

  // Pause on hover
  const clientsSection = document.querySelector(".clients__opinions");
  if (clientsSection) {
    clientsSection.addEventListener("mouseenter", () => {
      clearInterval(autoPlayInterval);
    });
    clientsSection.addEventListener("mouseleave", () => {
      autoPlayInterval = setInterval(nextTestimonial, 5000);
    });
  }
};

initTestimonialsCarousel();

// Scroll to Top Button
const initScrollToTop = () => {
  const scrollBtn = document.querySelector(".scroll-to-top");
  if (!scrollBtn) return;

  const toggleScrollButton = () => {
    if (window.scrollY > 300) {
      scrollBtn.classList.add("visible");
    } else {
      scrollBtn.classList.remove("visible");
    }
  };

  window.addEventListener("scroll", toggleScrollButton);
  toggleScrollButton(); // Check initial state

  scrollBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
};

initScrollToTop();

// Form Validation and Enhancement
const initFormValidation = () => {
  const form = document.querySelector("form");
  if (!form) return;

  const inputs = form.querySelectorAll("input, textarea");
  const submitBtn = form.querySelector('input[type="submit"]');

  inputs.forEach((input) => {
    // Real-time validation
    input.addEventListener("blur", () => {
      validateField(input);
    });

    input.addEventListener("input", () => {
      if (input.classList.contains("error")) {
        validateField(input);
      }
    });
  });

  form.addEventListener("submit", (e) => {
    let isValid = true;

    inputs.forEach((input) => {
      if (!validateField(input)) {
        isValid = false;
      }
    });

    if (!isValid) {
      e.preventDefault();
      // Show error message
      showFormMessage("Please fix the errors before submitting.", "error");
    } else {
      // Show success message (form will submit normally)
      showFormMessage("Sending your message...", "success");
    }
  });

  function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = "";

    // Remove previous error styling
    field.classList.remove("error");

    // Check required fields
    if (field.hasAttribute("required") && !value) {
      isValid = false;
      errorMessage = "This field is required.";
    }

    // Validate email
    if (field.type === "email" && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = "Please enter a valid email address.";
      }
    }

    // Validate phone number (optional field)
    if (field.type === "tel" && value) {
      const phoneRegex = /^[\d\s\-\(\)]+$/;
      if (!phoneRegex.test(value) || value.length < 10) {
        isValid = false;
        errorMessage = "Please enter a valid phone number.";
      }
    }

    // Validate textarea
    if (field.tagName === "TEXTAREA" && value && value.length < 10) {
      isValid = false;
      errorMessage = "Message must be at least 10 characters.";
    }

    if (!isValid) {
      field.classList.add("error");
      if (errorMessage) {
        field.setAttribute("title", errorMessage);
      }
    }

    return isValid;
  }

  function showFormMessage(message, type) {
    // Remove existing message
    const existingMsg = form.querySelector(".form-message");
    if (existingMsg) {
      existingMsg.remove();
    }

    // Create new message
    const msgEl = document.createElement("div");
    msgEl.className = `form-message form-message--${type}`;
    msgEl.textContent = message;
    form.insertBefore(msgEl, submitBtn);

    // Auto-remove after 5 seconds
    if (type === "success") {
      setTimeout(() => {
        msgEl.remove();
      }, 5000);
    }
  }
};

initFormValidation();

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const headerOffset = 100;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  });
});

// Lazy loading for images
const initLazyLoading = () => {
  if ("loading" in HTMLImageElement.prototype) {
    const images = document.querySelectorAll("img[data-src]");
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  } else {
    // Fallback for browsers that don't support lazy loading
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    document.querySelectorAll("img.lazy").forEach((img) => {
      imageObserver.observe(img);
    });
  }
};

initLazyLoading();

// Video is already set to low opacity as background - no need to change opacity on load
// Keeping it subtle at all times

// Close mobile menu when clicking on a link
const initMobileMenu = () => {
  const menuCheckbox = document.getElementById("menu");
  const navLinks = document.querySelectorAll(".navigation__link");

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (menuCheckbox && menuCheckbox.checked) {
        menuCheckbox.checked = false;
      }
    });
  });
};

initMobileMenu();

// Add keyboard navigation for carousel
document.addEventListener("keydown", (e) => {
  const clientsSection = document.querySelector("#clients");
  if (!clientsSection) return;

  const isClientsSectionVisible =
    clientsSection.getBoundingClientRect().top < window.innerHeight &&
    clientsSection.getBoundingClientRect().bottom > 0;

  if (isClientsSectionVisible) {
    const nextBtn = document.querySelector(".clients__nav-btn--next");
    const prevBtn = document.querySelector(".clients__nav-btn--prev");

    if (e.key === "ArrowRight" && nextBtn) {
      nextBtn.click();
    } else if (e.key === "ArrowLeft" && prevBtn) {
      prevBtn.click();
    }
  }
});

// Statistics Counter Animation
const animateStatistics = () => {
  const statisticsSection = document.querySelector("#statistics");
  if (!statisticsSection) return;

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const numbers = entry.target.querySelectorAll(".statistics__number");

          numbers.forEach((number) => {
            const target = parseInt(number.getAttribute("data-target"));
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
    },
    { threshold: 0.5 }
  );

  statsObserver.observe(statisticsSection);
};

animateStatistics();

// Loading Screen
const initLoadingScreen = () => {
  const loader = document.getElementById("loader");
  if (!loader) return;

  window.addEventListener("load", () => {
    setTimeout(() => {
      loader.style.opacity = "0";
      setTimeout(() => {
        loader.style.display = "none";
      }, 500);
    }, 500);
  });
};

initLoadingScreen();

// Enhanced Project Card Hover Effects
const initProjectCards = () => {
  const projectImages = document.querySelectorAll(".projects__img");

  projectImages.forEach((img) => {
    img.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)";
      this.style.transition = "transform 0.3s ease";
    });

    img.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
    });
  });
};

initProjectCards();

// Animated Text in Hero Section
const initAnimatedText = () => {
  const animatedText = document.querySelector(".bio__title-animated");
  if (!animatedText) return;

  const titles = [
    "Software Engineer",
    "Content Creator",
    "Problem Solver",
    "Tech Enthusiast",
  ];
  let currentIndex = 0;

  setInterval(() => {
    animatedText.style.opacity = "0";
    setTimeout(() => {
      currentIndex = (currentIndex + 1) % titles.length;
      animatedText.textContent = titles[currentIndex];
      animatedText.style.opacity = "1";
    }, 300);
  }, 3000);
};

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initAnimatedText);
} else {
  initAnimatedText();
}

// GitHub Integration - Fetch and Display Projects
const initGitHubProjects = () => {
  // Replace 'YOUR_GITHUB_USERNAME' with your actual GitHub username
  const GITHUB_USERNAME = "YOUR_GITHUB_USERNAME"; // User will provide this
  const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6`;
  
  const projectsGrid = document.getElementById("github-projects-grid");
  const loadingEl = document.getElementById("github-loading");
  
  if (!projectsGrid || !loadingEl) return;
  
  // Check if username is set
  if (GITHUB_USERNAME === "YOUR_GITHUB_USERNAME") {
    loadingEl.innerHTML = '<p style="opacity: 0.6;">Add your GitHub username in script.js to display projects</p>';
    return;
  }
  
  fetch(GITHUB_API_URL)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch GitHub repositories");
      }
      return response.json();
    })
    .then((repos) => {
      loadingEl.style.display = "none";
      
      if (repos.length === 0) {
        projectsGrid.innerHTML = '<p style="text-align: center; opacity: 0.6;">No repositories found</p>';
        return;
      }
      
      // Filter out forks and create project cards
      const filteredRepos = repos
        .filter((repo) => !repo.fork && !repo.archived)
        .slice(0, 6);
      
      filteredRepos.forEach((repo) => {
        const projectCard = createProjectCard(repo);
        projectsGrid.appendChild(projectCard);
      });
      
      // Add fade-in animation to cards
      const cards = projectsGrid.querySelectorAll(".github-project-card");
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("visible");
        }, index * 100);
      });
    })
    .catch((error) => {
      console.error("Error fetching GitHub projects:", error);
      loadingEl.innerHTML = '<p style="color: var(--color-red);">Failed to load projects. Please check your GitHub username.</p>';
    });
};

const createProjectCard = (repo) => {
  const card = document.createElement("div");
  card.className = "github-project-card";
  
  // Get primary language
  const language = repo.language || "Code";
  const languageColor = getLanguageColor(repo.language);
  
  // Format description
  const description = repo.description || "No description available";
  const truncatedDescription = description.length > 120 
    ? description.substring(0, 120) + "..." 
    : description;
  
  card.innerHTML = `
    <div class="github-project-card__header">
      <h3 class="github-project-card__title">${repo.name}</h3>
      <div class="github-project-card__meta">
        <span class="github-project-card__language" style="background-color: ${languageColor}20; color: ${languageColor};">
          ${language}
        </span>
        <div class="github-project-card__stats">
          <span class="github-project-card__star">⭐ ${repo.stargazers_count || 0}</span>
          <span class="github-project-card__fork">🍴 ${repo.forks_count || 0}</span>
        </div>
      </div>
    </div>
    <p class="github-project-card__description">${truncatedDescription}</p>
    <div class="github-project-card__footer">
      <a 
        href="${repo.html_url}" 
        target="_blank" 
        rel="noopener noreferrer"
        class="github-project-card__link"
      >
        View on GitHub →
      </a>
      ${repo.homepage ? `
        <a 
          href="${repo.homepage}" 
          target="_blank" 
          rel="noopener noreferrer"
          class="github-project-card__link github-project-card__link--demo"
        >
          Live Demo →
        </a>
      ` : ''}
    </div>
  `;
  
  return card;
};

const getLanguageColor = (language) => {
  const colors = {
    JavaScript: "#F7DF1E",
    TypeScript: "#3178C6",
    Python: "#3776AB",
    Java: "#ED8B00",
    "C++": "#00599C",
    C: "#A8B9CC",
    "C#": "#239120",
    PHP: "#777BB4",
    Ruby: "#CC342D",
    Go: "#00ADD8",
    Rust: "#000000",
    Swift: "#FA7343",
    Kotlin: "#7F52FF",
    HTML: "#E34F26",
    CSS: "#1572B6",
    SCSS: "#CC6699",
    Vue: "#4FC08D",
    React: "#61DAFB",
    Angular: "#DD0031",
    "Vue.js": "#4FC08D",
    "React.js": "#61DAFB",
    "Node.js": "#339933",
  };
  return colors[language] || "#03a696";
};

// Initialize GitHub projects when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initGitHubProjects);
} else {
  initGitHubProjects();
}
