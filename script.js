const CHECKOUT_1_UNIDADE = "#checkout-1-unidade";
const CHECKOUT_LEVE_3_PAGUE_2 = "#checkout-leve-3";

document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  document.querySelectorAll("[data-checkout]").forEach((link) => {
    const type = link.getAttribute("data-checkout");

    if (type === "single") {
      link.setAttribute("href", CHECKOUT_1_UNIDADE);
    }

    if (type === "bundle") {
      link.setAttribute("href", CHECKOUT_LEVE_3_PAGUE_2);
    }
  });

  const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");

        const icons = entry.target.querySelectorAll(".icon-animate");
        icons.forEach((icon, index) => {
          icon.style.animationDelay = `${index * 90}ms`;
          icon.classList.add("is-visible");
        });

        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealItems.forEach((item) => observer.observe(item));

  const carousel = document.getElementById("mobileTestimonialsCarousel");

  if (carousel) {
    let index = 0;

    const moveCarousel = () => {
      if (window.innerWidth > 720) return;

      const items = Array.from(carousel.querySelectorAll("img"));
      if (!items.length) return;

      index = (index + 1) % items.length;

      carousel.scrollTo({
        left: items[index].offsetLeft - 12,
        behavior: "smooth"
      });
    };

    let carouselTimer = window.setInterval(moveCarousel, 3600);

    carousel.addEventListener("touchstart", () => {
      window.clearInterval(carouselTimer);
    }, { passive: true });

    carousel.addEventListener("touchend", () => {
      carouselTimer = window.setInterval(moveCarousel, 3600);
    }, { passive: true });
  }
});