const taskList = document.querySelector("#task-list");
const orderStatus = document.querySelector("#order-status");
const storageKey = "assignment-priority-order";

// Stable IDs identify tasks even when their positions change.
const tasks = [
  { id: "deploy", title: "Deploy website" },
  { id: "login", title: "Fix login bug" },
  { id: "tests", title: "Write tests" },
  { id: "docs", title: "Update documentation" },
  { id: "review", title: "Review pull requests" }
];

let order = tasks.map(task => task.id);
let draggedItem = null;

// null means the dragged task should be placed at the end.
let beforeItem = null;

// Restore saved priorities only if every known ID appears exactly once.
try {
  const savedOrder = JSON.parse(localStorage.getItem(storageKey));

  const validSavedOrder =
    Array.isArray(savedOrder) &&
    savedOrder.length === tasks.length &&
    new Set(savedOrder).size === tasks.length &&
    savedOrder.every(id => order.includes(id));

  if (validSavedOrder) {
    order = savedOrder;
  }
} catch {
  // Invalid JSON or blocked storage should not stop the list working.
}

function renderTasks() {
  // Remove old rows before displaying the current order.
  taskList.replaceChildren();

  order.forEach((id, index) => {
    const task = tasks.find(task => task.id === id);
    const item = document.createElement("li");

    item.className = "task";
    item.dataset.id = id;

    // Enable the browser's native Drag and Drop API.
    item.draggable = true;

    // Only fixed markup is inserted with innerHTML.
    item.innerHTML = `
      <span class="priority"></span>
      <span class="task-name"></span>
      <button type="button" class="move-button" data-move="up">↑</button>
      <button type="button" class="move-button" data-move="down">↓</button>
    `;

    // Array indexes begin at zero; priority labels begin at one.
    item.querySelector(".priority").textContent = `${index + 1}.`;
    item.querySelector(".task-name").textContent = task.title;

    const upButton = item.querySelector('[data-move="up"]');
    const downButton = item.querySelector('[data-move="down"]');

    upButton.setAttribute("aria-label", `Move ${task.title} up`);
    downButton.setAttribute("aria-label", `Move ${task.title} down`);

    // Prevent movement past the first or last position.
    upButton.disabled = index === 0;
    downButton.disabled = index === order.length - 1;

    taskList.append(item);
  });
}

function saveOrder() {
  try {
    // localStorage stores strings, so convert the array into JSON.
    localStorage.setItem(storageKey, JSON.stringify(order));
    orderStatus.textContent = "Priority order saved in this browser.";
  } catch {
    orderStatus.textContent =
      "Order updated, but browser storage is unavailable.";
  }
}

function clearIndicators() {
  taskList.querySelectorAll(".task").forEach(item => {
    item.classList.remove("drop-before", "drop-after");
  });
}

// EVENT DELEGATION:
// Listeners stay on the parent even when renderTasks replaces its children.
taskList.addEventListener("dragstart", event => {
  const item = event.target.closest(".task");

  if (!item) return;

  draggedItem = item;
  beforeItem = null;

  // Tell the browser which task is being moved.
  event.dataTransfer.setData("text/plain", item.dataset.id);
  event.dataTransfer.effectAllowed = "move";

  item.classList.add("dragging");
});

taskList.addEventListener("dragover", event => {
  if (!draggedItem) return;

  // The browser allows dropping only if dragover's default is prevented.
  event.preventDefault();
  event.dataTransfer.dropEffect = "move";

  clearIndicators();

  // Exclude the dragged row from the possible insertion targets.
  const otherItems = [...taskList.querySelectorAll(".task")]
    .filter(item => item !== draggedItem);

  // Find the first row whose vertical midpoint is below the pointer.
  beforeItem = otherItems.find(item => {
    const rectangle = item.getBoundingClientRect();
    const midpoint = rectangle.top + rectangle.height / 2;

    return event.clientY < midpoint;
  }) || null;

  if (beforeItem) {
    beforeItem.classList.add("drop-before");
  } else {
    // If no row follows the pointer, indicate the end of the list.
    otherItems.at(-1)?.classList.add("drop-after");
  }
});

taskList.addEventListener("drop", event => {
  if (!draggedItem) return;

  event.preventDefault();

  const draggedId = draggedItem.dataset.id;

  // Remove the task from its original position.
  const remaining = order.filter(id => id !== draggedId);

  const newIndex = beforeItem
    ? remaining.indexOf(beforeItem.dataset.id)
    : remaining.length;

  // Insert the task without deleting any neighbouring items.
  remaining.splice(newIndex, 0, draggedId);
  order = remaining;

  draggedItem = null;
  beforeItem = null;

  // Rebuild the priority labels and remember the new order.
  renderTasks();
  saveOrder();
});

taskList.addEventListener("dragend", () => {
  // This also runs after cancellation, such as pressing Escape.
  // The order changes only on drop, so cancellation preserves it.
  draggedItem?.classList.remove("dragging");

  draggedItem = null;
  beforeItem = null;

  clearIndicators();
});

taskList.addEventListener("dragleave", event => {
  // Clear the line when the pointer leaves the whole list.
  if (!taskList.contains(event.relatedTarget)) {
    clearIndicators();
  }
});

// Arrow buttons provide keyboard and touchscreen alternatives.
taskList.addEventListener("click", event => {
  const button = event.target.closest("[data-move]");

  if (!button) return;

  const id = button.closest(".task").dataset.id;
  const index = order.indexOf(id);
  const direction = button.dataset.move;
  const newIndex = index + (direction === "up" ? -1 : 1);

  if (newIndex < 0 || newIndex >= order.length) return;

  // Swap the task with the neighbouring task.
  [order[index], order[newIndex]] = [order[newIndex], order[index]];

  renderTasks();
  saveOrder();

  // Rendering creates new buttons, so restore focus to the moved row.
  const movedRow = [...taskList.children]
    .find(item => item.dataset.id === id);

  const preferredButton =
    movedRow.querySelector(`[data-move="${direction}"]`);

  const focusTarget = preferredButton.disabled
    ? movedRow.querySelector("button:not(:disabled)")
    : preferredButton;

  focusTarget.focus();
});

document.querySelector("#reset-order").addEventListener("click", () => {
  order = tasks.map(task => task.id);
  renderTasks();
  saveOrder();
});

// Display the saved order, or the default order on the first visit.
renderTasks();