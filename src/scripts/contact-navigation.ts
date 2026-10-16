/** Move explicit contact navigation to the form while preserving native anchors. */
export function setupContactNavigation() {
  const form = document.querySelector<HTMLFormElement>("#contact-form");
  const panel = form?.closest<HTMLElement>("[data-contact-form-panel]");
  if (!form || !panel) return;

  let frame: number | null = null;
  const scheduleNavigation = () => {
    if (frame !== null) return;
    // Run after the link's native hash update and the mobile menu's close handler.
    frame = window.requestAnimationFrame(() => {
      frame = null;
      if (window.location.hash !== "#kontakt") return;
      form.focus({ preventScroll: true });
      // CSS scroll-padding accounts for the header, and scroll-behavior honors
      // reduced motion. Align the panel so its heading remains visible as well.
      panel.scrollIntoView({ block: "start", behavior: "auto" });
    });
  };

  document.addEventListener("click", (event) => {
    if (event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target instanceof Element
      ? event.target.closest<HTMLAnchorElement>("a[href]")
      : null;
    if (!link || link.hasAttribute("download") ||
        (link.target && link.target.toLowerCase() !== "_self")) return;

    const destination = new URL(link.href);
    if (destination.origin === window.location.origin &&
        destination.pathname === window.location.pathname &&
        destination.hash === "#kontakt") {
      // Also handles a second click when #kontakt is already in the address.
      scheduleNavigation();
    }
  });

  window.addEventListener("hashchange", scheduleNavigation);

  if (window.location.hash === "#kontakt") {
    scheduleNavigation();
    if (document.readyState !== "complete") {
      // Native fragment positioning may run again after images finish loading.
      // Correct it once, unless the user has already started interacting.
      let initialNavigationPending = true;
      const cancelInitialNavigation = () => { initialNavigationPending = false; };
      const interactionEvents = ["pointerdown", "touchstart", "wheel", "keydown"] as const;
      for (const type of interactionEvents) {
        window.addEventListener(type, cancelInitialNavigation, { passive: true, once: true });
      }
      window.addEventListener("load", () => {
        for (const type of interactionEvents) {
          window.removeEventListener(type, cancelInitialNavigation);
        }
        if (initialNavigationPending) scheduleNavigation();
      }, { once: true });
    }
  }
}
