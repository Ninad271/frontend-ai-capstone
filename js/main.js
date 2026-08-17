/**
 * Shared initialization — highlights the active nav link based on the current page.
 */
(function initNavigation() {
  const pathname = window.location.pathname.replace(/\/$/, "") || "/";

  document.querySelectorAll(".site-nav__link").forEach((link) => {
    const href = link.getAttribute("href");
    const linkPath = href === "/" ? "/" : href.replace(/\/$/, "");
    const isActive =
      linkPath === pathname ||
      (linkPath === "/settings" && pathname.endsWith("/settings"));

    if (isActive) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
})();
