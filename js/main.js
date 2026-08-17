/**
 * Shared initialization — highlights the active nav link based on the current page.
 */
(function initNavigation() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".site-nav__link").forEach((link) => {
    const linkPage = link.getAttribute("href");
    const isActive = linkPage === currentPage;

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
})();
