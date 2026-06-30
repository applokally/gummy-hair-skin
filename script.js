const CHECKOUT_START_URL = "https://api.americanmagichair.com.br/checkout-start.php";

const SINGLE_CHECKOUT_URL =
  "https://checkout.yapay.com.br/transacao/tedc9e616ccf6e708b5435b3e3255548d";

const CHECKOUT_PAGES = {
  single: "gummy-hair-skin-1-unidade",
  bundle: "gummy-hair-skin-kit-3-meses"
};

function getRefFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return (params.get("ref") || "").trim();
}

function getStoredRef() {
  return (window.localStorage.getItem("amh_ref") || "").trim();
}

function saveRef(ref) {
  if (!ref) return;

  window.localStorage.setItem("amh_ref", ref);

  const expires = new Date();
  expires.setDate(expires.getDate() + 30);

  document.cookie = `amh_ref=${encodeURIComponent(ref)}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
}

function buildCheckoutUrl(type, ref) {
  if (type === "single") {
    return SINGLE_CHECKOUT_URL;
  }

  const pageSlug = CHECKOUT_PAGES[type];

  if (!pageSlug) {
    return "";
  }

  const url = new URL(CHECKOUT_START_URL);
  url.searchParams.set("page", pageSlug);

  if (ref) {
    url.searchParams.set("ref", ref);
  }

  return url.toString();
}

// Enhanced reveal animation with staggered timing
function setupRevealAnimations() {
  const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        // Add a slight delay before revealing
        setTimeout(() => {
          entry.target.classList.add("is-visible");

          const icons = entry.target.querySelectorAll(".icon-animate");

          icons.forEach((icon, index) => {
            icon.style.animationDelay = `${index * 90}ms`;
            icon.classList.add("is-visible");
          });
        }, 50);

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));
}

// Smooth scroll enhancement
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#" || href === "") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
}

// Enhanced carousel with touch support
function setupCarousel() {
  const carousel = document.getElementById("mobileTestimonialsCarousel");

  if (carousel) {
    let index = 0;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    const moveCarousel = () => {
      if (window.innerWidth > 720) {
        return;
      }

      const items = Array.from(carousel.querySelectorAll("img"));

      if (!items.length) {
        return;
      }

      index = (index + 1) % items.length;

      carousel.scrollTo({
        left: items[index].offsetLeft - 12,
        behavior: "smooth"
      });
    };

    let carouselTimer = window.setInterval(moveCarousel, 3600);

    // Mouse drag support
    carousel.addEventListener("mousedown", (e) => {
      isDragging = true;
      startX = e.pageX - carousel.offsetLeft;
      scrollLeft = carousel.scrollLeft;
      window.clearInterval(carouselTimer);
      carousel.style.cursor = "grabbing";
    });

    carousel.addEventListener("mouseleave", () => {
      isDragging = false;
      carousel.style.cursor = "grab";
      carouselTimer = window.setInterval(moveCarousel, 3600);
    });

    carousel.addEventListener("mouseup", () => {
      isDragging = false;
      carousel.style.cursor = "grab";
      carouselTimer = window.setInterval(moveCarousel, 3600);
    });

    carousel.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      e.preventDefault();
      const x = e.pageX - carousel.offsetLeft;
      const walk = (x - startX) * 1;
      carousel.scrollLeft = scrollLeft - walk;
    });

    // Touch support
    carousel.addEventListener(
      "touchstart",
      (e) => {
        isDragging = true;
        startX = e.touches[0].pageX - carousel.offsetLeft;
        scrollLeft = carousel.scrollLeft;
        window.clearInterval(carouselTimer);
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchend",
      () => {
        isDragging = false;
        carouselTimer = window.setInterval(moveCarousel, 3600);
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchmove",
      (e) => {
        if (!isDragging) return;
        const x = e.touches[0].pageX - carousel.offsetLeft;
        const walk = (x - startX) * 1;
        carousel.scrollLeft = scrollLeft - walk;
      },
      { passive: true }
    );
  }
}

// Add parallax effect to hero section
function setupParallax() {
  const hero = document.querySelector(".hero-banner");
  if (!hero) return;

  window.addEventListener("scroll", () => {
    const scrolled = window.pageYOffset;
    const heroRect = hero.getBoundingClientRect();

    if (heroRect.top < window.innerHeight) {
      const yPos = scrolled * 0.5;
      hero.style.transform = `translateY(${yPos * 0.1}px)`;
    }
  });
}

// Enhanced button interactions
function setupButtonEnhancements() {
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-3px)";
    });

    btn.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
    });
  });
}

// Add scroll-triggered animations for elements
function setupScrollAnimations() {
  const elements = document.querySelectorAll(
    ".benefit-card, .protocol-step, .offer-option, .safe-item"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = "fadeInUp 0.6s ease-out forwards";
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px"
    }
  );

  elements.forEach((el) => observer.observe(el));
}

// Enhance details/accordion interactions
function setupAccordionEnhancements() {
  document.querySelectorAll("details").forEach((detail) => {
    detail.addEventListener("toggle", function () {
      if (this.open) {
        this.style.borderBottomColor = "var(--gold)";
      } else {
        this.style.borderBottomColor = "rgba(39, 41, 45, .1)";
      }
    });
  });
}

// Initialize all enhancements
document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const urlRef = getRefFromUrl();
  const storedRef = getStoredRef();
  const ref = urlRef || storedRef;

  if (urlRef) {
    saveRef(urlRef);
  }

  document.querySelectorAll("[data-checkout]").forEach((link) => {
    const type = link.getAttribute("data-checkout");
    const checkoutUrl = buildCheckoutUrl(type, ref);

    if (!checkoutUrl) {
      return;
    }

    link.setAttribute("href", checkoutUrl);
  });

  // Initialize all enhancements
  setupRevealAnimations();
  setupSmoothScroll();
  setupCarousel();
  setupParallax();
  setupButtonEnhancements();
  setupScrollAnimations();
  setupAccordionEnhancements();

  // Add loading state to page
  document.body.style.opacity = "1";
  document.body.style.transition = "opacity 0.5s ease";
});

// Handle window resize for responsive adjustments
window.addEventListener("resize", () => {
  const carousel = document.getElementById("mobileTestimonialsCarousel");
  if (carousel && window.innerWidth > 720) {
    carousel.style.transform = "translateX(0)";
  }
});

// Prevent layout shift on page load
window.addEventListener("load", () => {
  document.documentElement.style.scrollBehavior = "smooth";
});
