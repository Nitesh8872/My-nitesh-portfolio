(function () {
  "use strict";

  const loader = document.getElementById("loader");
  const header = document.getElementById("header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav__link");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const yearEl = document.getElementById("year");

  // Set current year
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // Loader - Hide after DOM content loads
  function hideLoader() {
    if (loader) {
      setTimeout(() => {
        loader.classList.add("hidden");
      }, 800);
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', hideLoader);
  } else {
    hideLoader();
  }
  
  // Also ensure it hides on window load
  window.addEventListener("load", hideLoader);

  // Mobile menu toggle
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Header scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  });

  // Active nav link
  const sections = document.querySelectorAll("section[id]");

  function setActiveNav() {
    const scrollY = window.scrollY + 100;

    sections.forEach((section) => {
      const id = section.getAttribute("id");
      const top = section.offsetTop;
      const height = section.offsetHeight;

      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  }

  window.addEventListener("scroll", setActiveNav, { passive: true });
  setActiveNav();

  // Enhanced scroll reveal animations with stagger effect
  const revealElements = document.querySelectorAll(
    ".section__header, .about__content, .about__details, .detail-card, " +
    ".skill-category, .project-card, .achievement-item, .contact__info, .contact__form"
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || 0;
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
            entry.target.classList.add("revealed");
          }, delay);
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -100px 0px",
    }
  );

  revealElements.forEach((el, index) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(40px)";
    el.style.transition = "opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    // Add stagger delay for grid items
    if (el.classList.contains("skill-category") || 
        el.classList.contains("project-card") || 
        el.classList.contains("achievement-item") ||
        el.classList.contains("detail-card")) {
      const gridIndex = Array.from(el.parentElement.children).indexOf(el);
      el.dataset.delay = `${gridIndex * 100}`;
    }
    revealObserver.observe(el);
  });

  // Contact form handling
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const formData = new FormData(contactForm);
      const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
      };

      // Show processing state
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending...";
      submitBtn.disabled = true;

      try {
        // Send email via Formspree or similar service
        const response = await fetch("https://formspree.io/f/YOUR_FORM_ID", {
          method: "POST",
          body: JSON.stringify(data),
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          formStatus.textContent = "✓ Message sent successfully!";
          formStatus.classList.add("success");
          formStatus.classList.remove("error");
          contactForm.reset();
        } else {
          throw new Error("Form submission failed");
        }
      } catch (error) {
        formStatus.textContent =
          "✗ Failed to send message. Please try again.";
        formStatus.classList.add("error");
        formStatus.classList.remove("success");
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;

        // Clear message after 5 seconds
        setTimeout(() => {
          formStatus.textContent = "";
          formStatus.classList.remove("success", "error");
        }, 5000);
      }
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href === "#") return;

      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // Add ripple effect to buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const ripple = document.createElement("span");
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("ripple");

      this.appendChild(ripple);

      setTimeout(() => ripple.remove(), 600);
    });
  });

  // Parallax effect for hero background
  const heroBg = document.querySelector(".hero__bg");
  if (heroBg) {
    window.addEventListener("scroll", () => {
      const scrolled = window.scrollY;
      const rate = scrolled * 0.3;
      heroBg.style.transform = `translateY(${rate}px)`;
    }, { passive: true });
  }

  // Smooth hover effects for cards
  const cards = document.querySelectorAll(".skill-category, .project-card, .achievement-item, .detail-card");
  cards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  // Magnetic effect for buttons
  const magneticButtons = document.querySelectorAll(".btn");
  magneticButtons.forEach(btn => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "translate(0, 0)";
    });
  });
})();
