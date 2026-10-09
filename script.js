(() => {
  "use strict";

  const WHATSAPP_NUMBER = "923499019790";
  const WHATSAPP_BASE = `https://wa.me/${WHATSAPP_NUMBER}`;
  const header = document.querySelector(".site-header");
  const menuToggle = document.querySelector(".menu-toggle");
  const primaryNav = document.querySelector(".primary-nav");
  const navLinks = primaryNav ? [...primaryNav.querySelectorAll("a")] : [];
  const filterButtons = [...document.querySelectorAll("[data-filter]")];
  const projectCards = [...document.querySelectorAll(".project-card[data-category]")];
  const filterStatus = document.getElementById("filter-status");
  const year = document.getElementById("current-year");
  const contactForm = document.getElementById("contact-form");
  const formFeedback = document.getElementById("form-feedback");
  const dialog = document.getElementById("project-dialog");
  const dialogClose = dialog?.querySelector(".dialog-close");
  let lastProjectTrigger = null;

  const projectDetails = {
    pulse: {
      title: "Pulse — Analytics dashboard",
      description: "An interface exploration for a lightweight analytics product. The direction puts key indicators first, then gives a traffic trend enough room to be read without visual noise.",
      focus: "Dashboard hierarchy, chart legibility, metric summaries, and a compact navigation system.",
      intent: "Make information feel calm and scannable, so someone can understand the shape of activity at a glance."
    },
    forma: {
      title: "Forma — E-commerce experience",
      description: "A storefront concept for everyday objects. Editorial typography and a restrained product palette give the collection space while keeping navigation and product discovery straightforward.",
      focus: "Product presentation, visual merchandising, typography, and browse-to-product flow.",
      intent: "Let the products lead and remove unnecessary friction between curiosity and exploration."
    },
    orbit: {
      title: "Orbit — Mobile productivity app",
      description: "A mobile UI exploration built around a small, achievable daily plan. The screen prioritizes a clear focus, concise task details, and useful progress without turning the day into a dashboard.",
      focus: "Mobile-first hierarchy, task states, one-handed scanning, and restrained progress cues.",
      intent: "Help a person see the next useful action instead of making productivity feel complicated."
    },
    northstar: {
      title: "Northstar — Landing page",
      description: "An editorial landing page concept for an independent creative practice. Its visual system relies on confident typography, open space, and one focused graphic rather than decorative effects.",
      focus: "First-screen messaging, art direction, page hierarchy, and a clear path to contact.",
      intent: "Give a distinctive idea a clear, memorable first impression that still feels easy to navigate."
    }
  };

  // Sticky header state is visual only; links remain useful without JavaScript.
  const updateHeader = () => {
    if (header) header.classList.toggle("is-scrolled", window.scrollY > 12);
  };
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  // Responsive navigation with Escape handling and a small focus loop on mobile.
  const isMobileMenu = () => window.matchMedia("(max-width: 640px)").matches;
  const setMenuOpen = (open, { returnFocus = false } = {}) => {
    if (!menuToggle || !primaryNav) return;
    const shouldOpen = Boolean(open) && isMobileMenu();
    menuToggle.setAttribute("aria-expanded", String(shouldOpen));
    menuToggle.setAttribute("aria-label", shouldOpen ? "Close navigation menu" : "Open navigation menu");
    primaryNav.classList.toggle("is-open", shouldOpen);
    document.body.classList.toggle("menu-open", shouldOpen);
    if (returnFocus) menuToggle.focus();
  };

  menuToggle?.addEventListener("click", () => {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!isExpanded);
    if (!isExpanded && isMobileMenu()) {
      const firstLink = primaryNav?.querySelector("a");
      firstLink?.focus({ preventScroll: true });
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    const menuIsOpen = menuToggle?.getAttribute("aria-expanded") === "true";
    if (event.key === "Escape" && menuIsOpen) {
      setMenuOpen(false, { returnFocus: true });
      return;
    }
    if (event.key !== "Tab" || !menuIsOpen || !primaryNav) return;
    const focusable = [menuToggle, ...navLinks].filter((element) => element && !element.hasAttribute("disabled"));
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last?.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first?.focus();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobileMenu()) setMenuOpen(false);
  }, { passive: true });

  // Working project filters, including live announcements for assistive technology.
  const filterLabels = {
    all: "all",
    websites: "website",
    "web-apps": "web app",
    "mobile-apps": "mobile app"
  };

  const applyFilter = (filter) => {
    let visibleCount = 0;
    projectCards.forEach((card) => {
      const category = card.dataset.category;
      const shouldShow = filter === "all"
        || (filter === "websites" && category === "websites")
        || (filter === "web-apps" && category === "web-apps")
        || (filter === "mobile-apps" && category === "mobile-apps");
      card.hidden = !shouldShow;
      if (shouldShow) visibleCount += 1;
    });
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === filter;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
    if (filterStatus) {
      const categoryLabel = filterLabels[filter] || "selected";
      filterStatus.textContent = filter === "all"
        ? `Showing all ${visibleCount} concepts.`
        : `Showing ${visibleCount} ${categoryLabel}${visibleCount === 1 ? "" : "s"}.`;
    }
  };

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => applyFilter(button.dataset.filter || "all"));
  });

  // Project detail modal: local concept notes only, no fake external case-study links.
  const openProjectDialog = (key, trigger) => {
    const details = projectDetails[key];
    if (!details || !dialog) return;
    const title = document.getElementById("dialog-title");
    const description = document.getElementById("dialog-description");
    const focus = document.getElementById("dialog-focus");
    const intent = document.getElementById("dialog-intent");
    if (!title || !description || !focus || !intent) return;
    title.textContent = details.title;
    description.textContent = details.description;
    focus.textContent = details.focus;
    intent.textContent = details.intent;
    lastProjectTrigger = trigger || null;
    if (typeof dialog.showModal === "function") {
      if (!dialog.open) dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
      dialogClose?.focus();
    }
  };

  document.querySelectorAll("[data-open-project]").forEach((button) => {
    button.addEventListener("click", () => openProjectDialog(button.dataset.openProject, button));
  });

  const closeProjectDialog = () => {
    if (!dialog) return;
    if (typeof dialog.close === "function" && dialog.open) {
      dialog.close();
    } else {
      dialog.removeAttribute("open");
    }
    lastProjectTrigger?.focus({ preventScroll: true });
  };

  dialogClose?.addEventListener("click", closeProjectDialog);
  dialog?.addEventListener("click", (event) => {
    if (event.target === dialog) closeProjectDialog();
  });
  dialog?.addEventListener("close", () => {
    lastProjectTrigger?.focus({ preventScroll: true });
  });

  // Contact form performs only client-side validation and prepares a WhatsApp draft.
  if (year) year.textContent = String(new Date().getFullYear());

  const formFields = contactForm
    ? [...contactForm.querySelectorAll("input, select, textarea")]
    : [];

  const setFieldError = (field, message) => {
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (!message) field.removeAttribute("aria-invalid");
    field.dataset.validationMessage = message || "";
  };

  const validateField = (field) => {
    const value = field.value.trim();
    let message = "";
    if (field.required && !value) {
      message = field.name === "projectType" ? "Please choose a project type." : "Please fill in this field.";
    } else if (field.name === "name" && value.length < 2) {
      message = "Please enter at least 2 characters for your name.";
    } else if (field.name === "message" && value.length < 10) {
      message = "Please add a little more detail (at least 10 characters).";
    } else if (field.maxLength > 0 && value.length > field.maxLength) {
      message = `Please keep this under ${field.maxLength} characters.`;
    }
    setFieldError(field, message);
    return message;
  };

  formFields.forEach((field) => {
    field.addEventListener("input", () => {
      if (field.hasAttribute("aria-invalid")) validateField(field);
      if (formFeedback?.classList.contains("is-error")) {
        formFeedback.textContent = "";
        formFeedback.classList.remove("is-error");
      }
    });
    field.addEventListener("change", () => {
      if (field.hasAttribute("aria-invalid")) validateField(field);
    });
  });

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!formFeedback) return;
    formFeedback.textContent = "";
    formFeedback.classList.remove("is-error");

    const errors = formFields.map((field) => ({ field, message: validateField(field) }))
      .filter((item) => item.message);

    if (errors.length > 0) {
      formFeedback.textContent = errors[0].message;
      formFeedback.classList.add("is-error");
      errors[0].field.focus();
      return;
    }

    const name = document.getElementById("contact-name")?.value.trim() || "";
    const projectType = document.getElementById("project-type")?.value || "";
    const message = document.getElementById("project-message")?.value.trim() || "";
    const whatsappMessage = [
      "Hello NEXORA Studio, I'd like to discuss a project.",
      "",
      `Name: ${name}`,
      `Project type: ${projectType}`,
      "Project details:",
      message
    ].join("\n");
    const whatsappUrl = `${WHATSAPP_BASE}?text=${encodeURIComponent(whatsappMessage)}`;
    const newWindow = window.open(whatsappUrl, "_blank");

    if (newWindow) {
      newWindow.opener = null;
      formFeedback.textContent = "Your message draft is ready in WhatsApp. Review it there, then press Send when you're ready. This website has not sent or stored anything.";
    } else {
      formFeedback.textContent = "Your browser blocked the new tab. Use the link below to open your prepared WhatsApp message.";
      const fallbackLink = document.createElement("a");
      fallbackLink.href = whatsappUrl;
      fallbackLink.target = "_blank";
      fallbackLink.rel = "noopener noreferrer";
      fallbackLink.textContent = " Open WhatsApp draft ↗";
      fallbackLink.className = "form-fallback-link";
      formFeedback.append(" ", fallbackLink);
    }
  });

  // Reveal elements on scroll. If IntersectionObserver is unavailable, leave everything visible.
  const revealElements = [...document.querySelectorAll(".reveal")];
  const motionReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (revealElements.length && !motionReduced && "IntersectionObserver" in window) {
    document.documentElement.classList.add("js-ready");
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });
    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }
})();
