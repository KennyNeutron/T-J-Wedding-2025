// Enhanced Wedding Website JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // Add fade-in to sections FIRST so the observer can see them
  document.querySelectorAll("section").forEach((section) => {
    section.classList.add("fade-in");
  });

  // Initialize everything after classes are in place
  initLucideIcons();
  initScrollAnimations();
  enhanceForm();
  setupIconAnimations();
  startCountdown();
});

// Initialize Lucide icons
function initLucideIcons() {
  if (window.lucide) {
    window.lucide.createIcons();
  } else {
    console.warn("Lucide icons not available");
  }
}

// Countdown functionality
function startCountdown() {
  const targetTime = new Date("2025-12-19T14:30:00+08:00").getTime();
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function pad(n, len = 2) {
    return n.toString().padStart(len, "0");
  }

  function flipTo(card, newValue) {
    if (!card) return;

    const oldValue = card.dataset.value || "00";
    if (oldValue === newValue) return;

    const valueEl = card.querySelector(".value");
    if (!valueEl) return;

    // Remove any existing flip elements
    card.querySelectorAll(".flip-half").forEach((el) => el.remove());

    if (reduceMotion) {
      valueEl.textContent = newValue;
      card.dataset.value = newValue;
      return;
    }

    card.classList.add("is-flipping");

    const top = document.createElement("div");
    const bottom = document.createElement("div");
    top.className = "flip-half flip-upper";
    bottom.className = "flip-half flip-lower";

    // Set initial text content
    top.textContent = oldValue;
    bottom.textContent = newValue;

    card.appendChild(top);
    card.appendChild(bottom);

    // Clean up after animations
    top.addEventListener("animationend", () => {
      if (top.parentNode) top.remove();
    });

    bottom.addEventListener("animationend", () => {
      if (bottom.parentNode) bottom.remove();
      valueEl.textContent = newValue;
      card.dataset.value = newValue;
      card.classList.remove("is-flipping");
    });
  }

  function updateCountdown() {
    const now = Date.now();
    let diff = targetTime - now;

    if (diff <= 0) {
      diff = 0;
      if (!document.body.classList.contains("celebrating")) {
        document.body.classList.add("celebrating");
        celebrate();
      }
    }

    const total = Math.floor(diff / 1000);
    const d = Math.floor(total / 86400);
    const h = Math.floor((total % 86400) / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;

    flipTo(document.getElementById("flip-days"), pad(d, 2));
    flipTo(document.getElementById("flip-hours"), pad(h));
    flipTo(document.getElementById("flip-minutes"), pad(m));
    flipTo(document.getElementById("flip-seconds"), pad(s));
  }

  updateCountdown();
  setInterval(updateCountdown, 1000);
}

// Scroll animations
function initScrollAnimations() {
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

  // Observe anything with fade-in; if none, fall back to all sections
  const targets = document.querySelectorAll(".fade-in").length
    ? document.querySelectorAll(".fade-in")
    : document.querySelectorAll("section");

  targets.forEach((el) => observer.observe(el));
}

// Celebration effect
function celebrate() {
  const colors = ["#a3b18a", "#c7b98e", "#8faf9e", "#6f7f61"];
  const container = document.querySelector(".countdown-inner");
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";

    const color = colors[Math.floor(Math.random() * colors.length)];

    confetti.style.cssText = `
      position: absolute;
      width: 10px;
      height: 10px;
      background: ${color};
      top: 50%;
      left: 50%;
      opacity: 0;
      border-radius: 2px;
    `;

    container.appendChild(confetti);

    confetti.animate(
      [
        { transform: `translate(-50%, -50%) rotate(0deg)`, opacity: 1 },
        {
          transform: `translate(${(Math.random() - 0.5) * 200}px, ${
            150 + Math.random() * 200
          }px) rotate(${Math.random() * 360}deg)`,
          opacity: 0,
        },
      ],
      {
        duration: 2000 + Math.random() * 1000,
        easing: "cubic-bezier(0.1, 0.8, 0.2, 1)",
      }
    ).onfinish = () => confetti.remove();
  }
}

// Enhanced form submission with animation
function enhanceForm() {
  const form = document.getElementById("rsvp-form");
  const submitBtn = document.getElementById("rsvp-submit");
  const successMsg = document.getElementById("rsvp-success");
  const errorMsg = document.getElementById("rsvp-error");

  if (!form || !submitBtn) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const originalContent = submitBtn.innerHTML;
    submitBtn.innerHTML =
      '<i data-lucide="loader" aria-hidden="true"></i><span>Sending...</span>';
    submitBtn.disabled = true;
    initLucideIcons();

    setTimeout(() => {
      const isSuccess = Math.random() > 0.2;

      if (isSuccess) {
        submitBtn.innerHTML =
          '<i data-lucide="check" aria-hidden="true"></i><span>Sent Successfully!</span>';
        if (successMsg) successMsg.style.display = "block";
        if (errorMsg) errorMsg.style.display = "none";
      } else {
        submitBtn.innerHTML =
          '<i data-lucide="alert-circle" aria-hidden="true"></i><span>Try Again</span>';
        if (errorMsg) errorMsg.style.display = "block";
        if (successMsg) successMsg.style.display = "none";
      }

      initLucideIcons();

      if (isSuccess) {
        setTimeout(() => {
          form.reset();
          submitBtn.innerHTML = originalContent;
          submitBtn.disabled = false;
          initLucideIcons();
          if (successMsg) successMsg.style.display = "none";
        }, 3000);
      } else {
        setTimeout(() => {
          submitBtn.innerHTML = originalContent;
          submitBtn.disabled = false;
          initLucideIcons();
          if (errorMsg) errorMsg.style.display = "none";
        }, 3000);
      }
    }, 2000);
  });
}

// Icon animations
function setupIconAnimations() {
  document.querySelectorAll(".with-icon").forEach((icon) => {
    icon.addEventListener("mouseenter", function () {
      const lucideIcon = this.querySelector("[data-lucide]");
      if (lucideIcon) lucideIcon.style.transform = "scale(1.2)";
    });

    icon.addEventListener("mouseleave", function () {
      const lucideIcon = this.querySelector("[data-lucide]");
      if (lucideIcon) lucideIcon.style.transform = "scale(1)";
    });
  });
}

// Add basic error handling for images
document.addEventListener("DOMContentLoaded", function () {
  const images = document.querySelectorAll("img");
  images.forEach((img) => {
    img.addEventListener("error", function () {
      this.src =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjdmNmYyIi8+CjxwYXRoIGQ9Ik0wIDE1MCBRMjAwIDEwMCA0MDAgMTUwIEw0MDAgMzAwIEwwIDMwMCBaIiBmaWxsPSIjYTNiMThhIi8+CjxjaXJjbGUgY3g9IjIwMCIgY3k9IjE1MCIgcj0iNTAiIGZpbGw9IiNjN2I5OGUiLz4KPHN2Zz4=";
      this.alt = "Image not available";
    });
  });
});
