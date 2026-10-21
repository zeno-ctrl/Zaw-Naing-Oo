/* ==========================================================================
   ZNO PORTFOLIO — progressive enhancement and small interactions
   No framework or build step required.
   ========================================================================== */
(() => {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const themeToggle = document.getElementById("themeToggle");
  const menuToggle = document.getElementById("menuToggle");
  const primaryNav = document.getElementById("primaryNav");
  const scrollProgress = document.getElementById("scrollProgress");
  const photoInput = document.getElementById("photoInput");
  const portraitImage = document.getElementById("portraitImage");
  const contactForm = document.getElementById("contactForm");
  const formNote = document.getElementById("formNote");
  const currentYear = document.getElementById("currentYear");
  const pointerGlow = document.querySelector(".pointer-glow");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const icons = {
    sun: '<svg class="icon theme-icon" aria-hidden="true"><use href="#i-sun"></use></svg>',
    moon: '<svg class="icon theme-icon" aria-hidden="true"><use href="#i-moon"></use></svg>',
    menu: '<svg class="icon menu-icon" aria-hidden="true"><use href="#i-menu"></use></svg>',
    close: '<svg class="icon menu-icon" aria-hidden="true"><use href="#i-close"></use></svg>'
  };

  function setTheme(theme, persist = true) {
    const nextTheme = theme === "light" ? "light" : "dark";
    root.dataset.theme = nextTheme;
    if (themeToggle) {
      const switchTo = nextTheme === "dark" ? "light" : "dark";
      themeToggle.setAttribute("aria-label", `Switch to ${switchTo} theme`);
      themeToggle.setAttribute("title", `Switch to ${switchTo} theme`);
      themeToggle.innerHTML = nextTheme === "dark" ? icons.sun : icons.moon;
    }
    if (persist) {
      try {
        window.localStorage.setItem("zno-theme", nextTheme);
      } catch (error) {
        // Theme still works for this visit if storage is unavailable.
      }
    }
  }

  try {
    const savedTheme = window.localStorage.getItem("zno-theme");
    if (savedTheme) setTheme(savedTheme, false);
    else if (window.matchMedia("(prefers-color-scheme: light)").matches) setTheme("light", false);
  } catch (error) {
    setTheme("dark", false);
  }

  themeToggle?.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  function setMenuOpen(isOpen) {
    if (!menuToggle || !primaryNav) return;
    primaryNav.classList.toggle("is-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
    menuToggle.innerHTML = isOpen ? icons.close : icons.menu;
  }

  menuToggle?.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isOpen);
  });

  primaryNav?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenuOpen(false);
  });

  document.addEventListener("click", (event) => {
    if (!primaryNav?.classList.contains("is-open")) return;
    if (primaryNav.contains(event.target) || menuToggle?.contains(event.target)) return;
    setMenuOpen(false);
  });

  function updateScrollUI() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    if (scrollProgress) scrollProgress.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    document.querySelector(".site-header")?.classList.toggle("is-scrolled", window.scrollY > 10);
  }

  let scrollFrame = 0;
  window.addEventListener("scroll", () => {
    if (scrollFrame) return;
    scrollFrame = window.requestAnimationFrame(() => {
      updateScrollUI();
      scrollFrame = 0;
    });
  }, { passive: true });
  updateScrollUI();

  const revealElements = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
    revealElements.forEach((element) => revealObserver.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const sections = [...document.querySelectorAll("main section[id]")];
  const navLinks = [...document.querySelectorAll(".primary-nav a[href^='#']")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          const active = link.getAttribute("href") === `#${entry.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-35% 0px -55% 0px", threshold: 0 });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  if (pointerGlow && window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
    window.addEventListener("pointermove", (event) => {
      pointerGlow.style.opacity = "1";
      pointerGlow.style.left = `${event.clientX}px`;
      pointerGlow.style.top = `${event.clientY}px`;
    }, { passive: true });
    document.addEventListener("pointerleave", () => {
      pointerGlow.style.opacity = "0";
    });
  }

  photoInput?.addEventListener("change", () => {
    const file = photoInput.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      announcePhoto("Please choose an image file.");
      photoInput.value = "";
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      announcePhoto("Please choose an image smaller than 8 MB.");
      photoInput.value = "";
      return;
    }
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string" && portraitImage) {
        portraitImage.src = reader.result;
        portraitImage.alt = "Your selected profile photo preview";
        announcePhoto("Photo preview updated. To keep it on the live site, replace the placeholder image in the assets folder.");
      }
    });
    reader.addEventListener("error", () => announcePhoto("Sorry, that image could not be opened. Try another one."));
    reader.readAsDataURL(file);
  });

  function announcePhoto(message) {
    let note = document.getElementById("photoNote");
    if (!note) {
      note = document.createElement("p");
      note.id = "photoNote";
      note.className = "photo-note";
      note.setAttribute("aria-live", "polite");
      document.querySelector(".photo-bottomline")?.after(note);
    }
    if (note) note.textContent = message;
  }

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;

    const formData = new FormData(contactForm);
    const name = String(formData.get("name") || "").trim();
    const email = String(formData.get("email") || "").trim();
    const message = String(formData.get("message") || "").trim();

    if (!name || !email || !message) {
      if (formNote) formNote.textContent = "Please complete each field before preparing your email.";
      return;
    }

    const subject = encodeURIComponent(`Portfolio enquiry from ${name}`);
    const bodyText = encodeURIComponent(`Hi Zaw,\n\n${message}\n\nFrom: ${name}\nEmail: ${email}`);
    const mailto = `mailto:directorzno@gmail.com?subject=${subject}&body=${bodyText}`;

    if (formNote) formNote.textContent = "Your email app should open with your message ready to review. You still need to press Send there.";
    window.location.href = mailto;
  });

  document.querySelectorAll("[data-copy]").forEach((button) => {
    button.addEventListener("click", async () => {
      const value = button.getAttribute("data-copy");
      if (!value) return;
      try {
        await navigator.clipboard.writeText(value);
        const original = button.textContent;
        button.textContent = "Copied!";
        window.setTimeout(() => { button.textContent = original; }, 1500);
      } catch (error) {
        window.prompt("Copy this text:", value);
      }
    });
  });

  // Gentle perspective movement is limited to fine pointers and never affects touch.
  if (window.matchMedia("(pointer: fine)").matches && !reducedMotion) {
    document.querySelectorAll(".project-card").forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width - 0.5;
        const y = (event.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(1100px) rotateX(${(-y * 1.8).toFixed(2)}deg) rotateY(${(x * 2.1).toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  if (currentYear) currentYear.textContent = String(new Date().getFullYear());

  // Ensure every in-page navigation action closes the mobile menu.
  window.addEventListener("resize", () => {
    if (window.innerWidth > 620) setMenuOpen(false);
  }, { passive: true });

  body.classList.add("portfolio-ready");
})();
