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

  const revealItems = document.querySelectorAll(".reveal");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

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

    carousel.addEventListener(
      "touchstart",
      () => {
        window.clearInterval(carouselTimer);
      },
      { passive: true }
    );

    carousel.addEventListener(
      "touchend",
      () => {
        carouselTimer = window.setInterval(moveCarousel, 3600);
      },
      { passive: true }
    );
  }
});