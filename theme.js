// Keep theme variables separate from the exercise scripts.
(() => {
  const themeButton = document.querySelector("#theme-toggle");
  const storageKey = "assignment-theme";
  let savedTheme = null;

  try {
    savedTheme = localStorage.getItem(storageKey);
  } catch {
    // The toggle can still work when browser storage is blocked.
  }

  // Use a saved theme when available; otherwise follow system settings.
  const preferredTheme =
    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

  let theme = ["light", "dark"].includes(savedTheme)
    ? savedTheme
    : preferredTheme;

  function applyTheme() {
    // This attribute selects the corresponding CSS colour variables.
    document.documentElement.dataset.theme = theme;

    // Show what clicking the button will do.
    themeButton.textContent =
      theme === "dark" ? "Light mode" : "Dark mode";

    themeButton.setAttribute(
      "aria-pressed",
      String(theme === "dark")
    );
  }

  themeButton.addEventListener("click", () => {
    theme = theme === "dark" ? "light" : "dark";
    applyTheme();

    try {
      // Remember the choice across pages and future visits.
      localStorage.setItem(storageKey, theme);
    } catch {
      // The current theme still changes if saving is unavailable.
    }
  });

  applyTheme();
})();