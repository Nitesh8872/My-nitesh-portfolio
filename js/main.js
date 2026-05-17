(function () {
  "use strict";

  const header = document.getElementById("header");
  const navToggle = document.getElementById("nav-toggle");
  const navMenu = document.getElementById("nav-menu");
  const navLinks = document.querySelectorAll(".nav__link");
  const contactForm = document.getElementById("contact-form");
  const formStatus = document.getElementById("form-status");
  const yearEl = document.getElementById("year");
  const loader = document.getElementById("loader");

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* Page loader */
  window.addEventListener("load", () => {
    if (loader) {
      setTimeout(() => {
        loader.classList.add("loader--hidden");
      }, 500);
    }
  });

  /* Sticky header */
  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile nav */
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const open = navMenu.classList.toggle("open");
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open menu");
      });
    });
  }

  /* Active nav link */
  const sections = document.querySelectorAll("section[id]");

  function setActiveLink() {
    const scrollY = window.scrollY + 120;

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

  window.addEventListener("scroll", setActiveLink, { passive: true });
  setActiveLink();

  /* Scroll reveal */
  const revealEls = document.querySelectorAll(
    ".section__header, .about__content, .skill-card, .project-card, .contact__form, .contact__aside"
  );

  revealEls.forEach((el) => el.classList.add("reveal"));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* Contact form (mailto fallback) */
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = contactForm.querySelector('[name="name"]').value.trim();
      const email = contactForm.querySelector('[name="email"]').value.trim();
      const message = contactForm.querySelector('[name="message"]').value.trim();

      // Enhanced validation
      if (!name) {
        formStatus.textContent = "Please enter your name.";
        formStatus.className = "form__note error";
        contactForm.querySelector('[name="name"]').focus();
        return;
      }

      if (!email || !email.includes('@') || !email.includes('.')) {
        formStatus.textContent = "Please enter a valid email address.";
        formStatus.className = "form__note error";
        contactForm.querySelector('[name="email"]').focus();
        return;
      }

      if (!message || message.length < 10) {
        formStatus.textContent = "Please enter a message (at least 10 characters).";
        formStatus.className = "form__note error";
        contactForm.querySelector('[name="message"]').focus();
        return;
      }

      const subject = encodeURIComponent(`Portfolio contact from ${name}`);
      const body = encodeURIComponent(
        `Name: ${name}\nEmail: ${email}\n\n${message}`
      );
      const mailto = document.querySelector(".contact__email a");
      const to = mailto ? mailto.getAttribute("href").replace("mailto:", "") : "";

      if (to && !to.includes("example.com")) {
        // Add success animation
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        submitBtn.textContent = "Sending…";
        submitBtn.disabled = true;

        setTimeout(() => {
          window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
          formStatus.textContent = "Opening your email client…";
          formStatus.className = "form__note success";
          submitBtn.textContent = "Send message";
          submitBtn.disabled = false;
        }, 500);
      } else {
        formStatus.textContent =
          "Update your email in index.html, then try again.";
        formStatus.className = "form__note error";
      }

      contactForm.reset();
    });
  }
})();
