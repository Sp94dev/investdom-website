/** Highlight the section at the reading line without changing URL or focus. */
export function setupSectionNavigation() {
  const header = document.querySelector<HTMLElement>("#main-header");
  if (!header || header.dataset.trackSections !== "true") return;

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
