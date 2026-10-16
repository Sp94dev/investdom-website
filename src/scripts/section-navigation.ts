/** Position one shared underline in each menu, including on server-marked subpages. */
function setupNavigationIndicators(header: HTMLElement) {
  const menus = [...header.querySelectorAll<HTMLElement>("[data-section-nav]")];
  let frame: number | null = null;

  const update = () => {
    frame = null;
    const positions = menus.map((menu) => {
      const indicator = menu.querySelector<HTMLElement>("[data-section-indicator]");
      const label = menu.querySelector<HTMLElement>(
        'a[data-section-link][aria-current] [data-section-label]',
      );
      // Offsets are relative to the positioned nav, unaffected by the mobile
      // menu's scale animation. Hidden desktop/mobile variants have no layout.
      const position = label && menu.offsetWidth > 0
        ? { x: label.offsetLeft, y: label.offsetTop + label.offsetHeight + 4, width: label.offsetWidth }
        : null;
      return { indicator, position };
    });

    for (const { indicator, position } of positions) {
      if (!indicator) continue;
      if (!position) {
        indicator.removeAttribute("data-visible");
        continue;
      }

      // First appearance only fades in at its destination. Subsequent section
      // changes move the same line from its current position in either direction.
      indicator.toggleAttribute("data-moving", indicator.hasAttribute("data-visible"));
      indicator.style.setProperty("--indicator-x", `${position.x}px`);
      indicator.style.setProperty("--indicator-y", `${position.y}px`);
      indicator.style.setProperty("--indicator-width", `${position.width}px`);
      indicator.setAttribute("data-visible", "");
    }

    // Keep the native underline as a fallback until positioning is available.
    header.setAttribute("data-animated-navigation", "");
  };

  const scheduleUpdate = () => {
    if (frame === null) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("pageshow", scheduleUpdate);
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleUpdate);
    for (const menu of menus) {
      observer.observe(menu);
      for (const label of menu.querySelectorAll<HTMLElement>("[data-section-label]")) {
        observer.observe(label);
      }
    }
  }
  void document.fonts.ready.then(scheduleUpdate);
  scheduleUpdate();
  return scheduleUpdate;
}

/** Highlight the section at the reading line without changing URL or focus. */
export function setupSectionNavigation() {
  const header = document.querySelector<HTMLElement>("#main-header");
  if (!header) return;
  const updateIndicators = setupNavigationIndicators(header);
  if (header.dataset.trackSections !== "true") return;

  const links = [...header.querySelectorAll<HTMLAnchorElement>("a[data-section-link]")];
  const sections = ["o-firmie", "domy", "uslugi", "kontakt"]
    .map((id) => document.getElementById(id))
    .filter((section): section is HTMLElement => section !== null);
  if (!sections.length) return;

  let activeSection: string | null = null;
  let frame: number | null = null;
  let headerHeight = 0;

  const update = () => {
    frame = null;
    const nextHeaderHeight = header.getBoundingClientRect().height;
    const readingLine = nextHeaderHeight + 16;
    let nextSection: string | null = null;

    // The last section whose start passed the reading line stays active.
    // This also keeps Services active throughout the following FAQ section.
    for (const section of sections) {
      if (section.getBoundingClientRect().top <= readingLine + 1) {
        nextSection = section.id;
      } else {
        break;
      }
    }

    const documentHeight = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    );
    if (window.scrollY > 0 && window.scrollY + window.innerHeight >= documentHeight - 2) {
      nextSection = sections.find((section) => section.id === "kontakt")?.id ?? nextSection;
    }

    // Perform reads before writes; the scroll handler itself only schedules a frame.
    if (headerHeight !== nextHeaderHeight) {
      headerHeight = nextHeaderHeight;
      document.documentElement.style.setProperty("--site-header-height", `${headerHeight}px`);
    }
    if (activeSection === nextSection) return;
    activeSection = nextSection;

    for (const link of links) {
      if (link.dataset.sectionLink === activeSection) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    }
    updateIndicators();
  };

  const scheduleUpdate = () => {
    if (frame === null) frame = window.requestAnimationFrame(update);
  };

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  window.addEventListener("hashchange", scheduleUpdate);
  window.addEventListener("pageshow", scheduleUpdate);
  window.addEventListener("load", scheduleUpdate);

  // Re-evaluate after images, fonts or responsive layout change section positions.
  if ("ResizeObserver" in window) {
    const observer = new ResizeObserver(scheduleUpdate);
    observer.observe(header);
    const main = document.querySelector("main");
    if (main) observer.observe(main);
  }

  scheduleUpdate();
}
