// Select the elements used by the modal system.
const overlay = document.querySelector("#overlay");
const modal = document.querySelector("#modal");
const modalTitle = document.querySelector("#modal-title");
const modalDescription = document.querySelector("#modal-description");
const topicCards = document.querySelector("#topic-cards");
const backgroundSections = document.querySelectorAll("header, main");

// Remember the opening button so focus can return when the modal closes.
let openingButton = null;
let previousOverflow = "";

// Each button's data-topic value matches a key in this object.
const topics = {
  events: {
    title: "Event handling",
    description:
      "Event handling makes a page interactive. Use addEventListener() " +
      "to run a function when a user clicks, types, or presses a key."
  },

  delegation: {
    title: "Event delegation",
    description:
      "Most events bubble from a child element to its parents. " +
      "A listener on the parent can handle events from several children."
  },

  storage: {
    title: "localStorage",
    description:
      "localStorage saves strings in the browser between visits. " +
      "Use JSON.stringify() to store arrays and JSON.parse() to restore them."
  }
};

function openModal(button) {
  // Read data-topic from the clicked button.
  const topic = topics[button.dataset.topic];

  if (!topic) return;

  openingButton = button;

  // Insert plain text into the shared dialog.
  modalTitle.textContent = topic.title;
  modalDescription.textContent = topic.description;

  // Remember the original setting before disabling background scrolling.
  previousOverflow = document.body.style.overflow;
  document.body.style.overflow = "hidden";

  // Prevent interaction with the page behind the modal.
  backgroundSections.forEach(section => {
    section.inert = true;
  });

  overlay.setAttribute("aria-hidden", "false");
  overlay.classList.add("open");

  // Move keyboard focus into the modal.
  modal.querySelector("button").focus();
}

function closeModal() {
  // Do nothing if the modal is already closed.
  if (!overlay.classList.contains("open")) return;

  overlay.classList.remove("open");

  backgroundSections.forEach(section => {
    section.inert = false;
  });

  // Restore scrolling and return focus to the opening button.
  document.body.style.overflow = previousOverflow;
  openingButton?.focus();

  overlay.setAttribute("aria-hidden", "true");
}

// EVENT DELEGATION:
// A single listener handles clicks on all three Learn More buttons.
topicCards.addEventListener("click", event => {
  const button = event.target.closest("[data-topic]");

  if (button) {
    openModal(button);
  }
});

// Close when the backdrop or either close button is clicked.
overlay.addEventListener("click", event => {
  const clickedBackdrop = event.target === overlay;
  const clickedClose = event.target.closest("[data-close]");

  if (clickedBackdrop || clickedClose) {
    closeModal();
  }
});

// Handle Escape and keep keyboard focus inside the open modal.
document.addEventListener("keydown", event => {
  if (!overlay.classList.contains("open")) return;

  if (event.key === "Escape") {
    event.preventDefault();
    closeModal();
    return;
  }

  if (event.key === "Tab") {
    const buttons = modal.querySelectorAll("button");
    const firstButton = buttons[0];
    const lastButton = buttons[buttons.length - 1];

    // Shift+Tab from the first button wraps to the last.
    if (event.shiftKey && document.activeElement === firstButton) {
      event.preventDefault();
      lastButton.focus();
    }

    // Tab from the last button wraps to the first.
    if (!event.shiftKey && document.activeElement === lastButton) {
      event.preventDefault();
      firstButton.focus();
    }
  }
});