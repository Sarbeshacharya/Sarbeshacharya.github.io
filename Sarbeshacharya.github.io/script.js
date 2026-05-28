// This file controls the mobile menu, image fallbacks, section reveal, active nav link,
// and automatic footer year. You can keep it unchanged while you learn.

// JS STATE: Enables reveal animations only when JavaScript is actually running.
document.documentElement.classList.add("js-enabled");

// NAV BUTTON: Selects the hamburger button on mobile.
const navToggle = document.querySelector(".nav-toggle");

// NAV MENU: Selects the group of navigation links.
const navLinks = document.querySelector("[data-nav-links]");

// NAV ITEMS: Selects every individual navigation link.
const navItems = document.querySelectorAll(".nav-links a");

// MOBILE MENU: Only runs if the menu button and menu links exist.
if (navToggle && navLinks) {
  // CLICK EVENT: Opens or closes the mobile menu.
  navToggle.addEventListener("click", () => {
    // MENU STATE: Adds/removes the class that makes the menu visible.
    const isOpen = navLinks.classList.toggle("is-open");

    // BUTTON STATE: Animates the hamburger icon into an X.
    navToggle.classList.toggle("is-open", isOpen);

    // ACCESSIBILITY: Tells screen readers whether the menu is open.
    navToggle.setAttribute("aria-expanded", String(isOpen));

    // PAGE SCROLL: Stops background scrolling while the mobile menu is open.
    document.body.classList.toggle("menu-open", isOpen);
  });

  // MENU LINKS: Closes the mobile menu after clicking any link.
  navItems.forEach((link) => {
    link.addEventListener("click", () => {
      // CLOSE MENU: Hides the dropdown menu.
      navLinks.classList.remove("is-open");

      // RESET ICON: Changes the X icon back into hamburger lines.
      navToggle.classList.remove("is-open");

      // RESET ACCESSIBILITY: Marks the menu as closed.
      navToggle.setAttribute("aria-expanded", "false");

      // RESET SCROLL: Allows the page to scroll again.
      document.body.classList.remove("menu-open");
    });
  });
}

// IMAGE PATHS: If assets/profile.jpg or assets/dashboard-preview.png is missing,
// the page shows a clean fallback instead of a broken image icon.
document.querySelectorAll("[data-fallback-image]").forEach((image) => {
  // IMAGE WRAPPER: The parent element receives the missing-image class.
  const wrapper = image.parentElement;

  // FALLBACK FUNCTION: Shows backup text if the image cannot load.
  const showFallback = () => {
    if (wrapper) {
      wrapper.classList.add("image-missing");
    }
  };

  // IMAGE ERROR: Runs when the browser cannot find the image file.
  image.addEventListener("error", showFallback);

  // CACHED ERROR CHECK: Handles images that already failed before JavaScript loaded.
  if (image.complete && image.naturalWidth === 0) {
    showFallback();
  }
});

// Subtle reveal effect for sections. It stays simple so the site feels professional.
const revealElements = document.querySelectorAll(".reveal");

// REVEAL SUPPORT: Uses IntersectionObserver if the browser supports it.
if ("IntersectionObserver" in window) {
  // REVEAL OBSERVER: Watches each hidden section as it enters the screen.
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // VISIBLE CHECK: Runs only when the element is in view.
        if (entry.isIntersecting) {
          // SHOW ELEMENT: Adds the class that fades the element in.
          entry.target.classList.add("is-visible");

          // STOP WATCHING: Saves browser work after the reveal happens once.
          revealObserver.unobserve(entry.target);
        }
      });
    },
    // REVEAL TIMING: Starts the reveal when a small part of the element is visible.
    { threshold: 0.12 }
  );

  // START REVEAL: Begins watching every element with the reveal class.
  revealElements.forEach((element) => revealObserver.observe(element));

  // REVEAL SAFETY NET: Prevents invisible blank spaces if the observer misses an element.
  window.setTimeout(() => {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }, 1200);
} else {
  // OLD BROWSER FALLBACK: Shows everything if IntersectionObserver is unavailable.
  revealElements.forEach((element) => element.classList.add("is-visible"));
}

// Active nav link: highlights the section currently in view.
const sections = document.querySelectorAll("main section[id]");

// ACTIVE SECTION SUPPORT: Only runs when sections and nav links exist.
if ("IntersectionObserver" in window && sections.length > 0 && navItems.length > 0) {
  // SECTION OBSERVER: Watches which section is currently visible.
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // SKIP HIDDEN SECTIONS: Only use the section currently in view.
        if (!entry.isIntersecting) {
          return;
        }

        // MATCH LINK: Finds the nav link that points to the visible section.
        const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);

        // RESET LINKS: Removes the active class from every nav link first.
        navItems.forEach((link) => link.classList.remove("is-active"));

        // SET ACTIVE LINK: Highlights the matching nav item.
        if (activeLink) {
          activeLink.classList.add("is-active");
        }
      });
    },
    // ACTIVE TIMING: Chooses the section near the middle of the screen.
    { rootMargin: "-38% 0px -55% 0px" }
  );

  // START ACTIVE NAV: Begins watching every section with an ID.
  sections.forEach((section) => sectionObserver.observe(section));
}

// FOOTER YEAR: Automatically keeps the copyright year current.
const yearElement = document.querySelector("[data-year]");

// YEAR CHECK: Only changes the year if the footer span exists.
if (yearElement) {
  // CURRENT YEAR: Inserts the visitor's current year into the footer.
  yearElement.textContent = new Date().getFullYear();
}
