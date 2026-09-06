
# Week 2, Day 4: Events Deep Dive

## Overview

This assignment demonstrates event handling, event delegation, real-time form validation, drag-and-drop, and localStorage using HTML, CSS, and vanilla JavaScript.

It includes three tasks and a dark-mode bonus. Comments throughout the code explain the main functions and event handlers.

## Project Structure

```text
week-2-day-4-assignment/
├── modal.html
├── modal.js
├── form.html
├── form.js
├── drag.html
├── drag.js
├── styles.css
├── theme.js
└── README.md
```

## Getting Started

1. Save all files in the same folder.
2. Open `modal.html` in a modern browser.
3. Use the navigation links to move between tasks.

No dependencies or build step are required.

For consistent localStorage behaviour across pages, use a local server such as VS Code’s Live Server. Storage behaviour may vary when opening HTML files directly.

## Task 1: Modal System

**Files:** `modal.html` and `modal.js`

Three **Learn More** buttons open a reusable modal with different topic content.

### Features

- Centred modal with a maximum width of 500px.
- Dark overlay using `rgba(0, 0, 0, 0.5)`.
- Title, description, and close buttons.
- Closing through a close button, the backdrop, or Escape.
- Background scrolling disabled while the modal is open.
- Scrolling restored when the modal closes.
- Fade-in effect using a CSS opacity transition.
- Keyboard focus kept inside the modal and returned to the opening button.

### Event Handling

A click listener on the cards container uses event delegation to identify the selected topic. Additional click and keyboard listeners handle closing and focus management.

## Task 2: Real-Time Form Validation

**Files:** `form.html` and `form.js`

The registration form provides immediate feedback as the user types.

### Validation Rules

| Field | Requirements |
|---|---|
| Name | At least 2 characters after trimming surrounding spaces |
| Email | One `@` and a dotted domain, without whitespace |
| Phone | Exactly 10 digits, starting with `07` or `01` |
| Password | At least 8 characters, one uppercase letter, and one number |

### Validation Behaviour

- Valid fields show a green border and a checkmark.
- Invalid fields show a red border, a cross, and a specific error message.
- Submit remains disabled until every field is valid.
- Submission rechecks all fields.
- `preventDefault()` prevents a page reload.
- Valid form data is logged to the browser console as an object.

### Sample Data

```text
Name: Alex
Email: alex@example.com
Phone: 0712345678
Password: Example1
```

Use sample information only. The assignment logs the password as part of the demonstration object. Production applications must not log passwords.

The form does not create an account, save registration details, or send data to a server.

## Task 3: Drag-and-Drop Priority List

**Files:** `drag.html` and `drag.js`

Users can reorder five tasks by priority:

1. Deploy website
2. Fix login bug
3. Write tests
4. Update documentation
5. Review pull requests

### Features

- Each task uses `draggable="true"`.
- Tasks can be dragged into a new position.
- Priority numbers update after reordering.
- The dragged item becomes semi-transparent.
- A line indicates the proposed drop position.
- Arrow buttons provide keyboard and touchscreen alternatives.
- localStorage preserves the task order.
- Reset order restores the original sequence.
- Cancelling a drag leaves the order unchanged.

### Drag Events

| Event | Purpose |
|---|---|
| `dragstart` | Identify the dragged task and apply visual feedback |
| `dragover` | Allow dropping and calculate the insertion position |
| `drop` | Update, display, and save the task order |
| `dragend` | Clear temporary drag state and styling |
| `dragleave` | Remove the indicator when the pointer leaves the list |

Listeners are attached to the parent list so they continue working when task rows are recreated.

## Bonus: Dark Mode

**File:** `theme.js`

The shared theme toggle:

- Switches between light and dark colours.
- Saves the selected theme in localStorage.
- Restores the choice on subsequent visits.
- Uses the system colour preference when no choice has been saved.

All three pages share the same theme script and stylesheet.

## Shared Styling

**File:** `styles.css`

The stylesheet provides:

- Light and dark theme variables.
- Responsive layouts.
- Modal positioning and transitions.
- Form validation colours and icons.
- Drag-and-drop feedback.
- Visible keyboard focus indicators.
- Reduced-motion support.

## Local Storage

| Key | Value |
|---|---|
| `assignment-theme` | `light` or `dark` |
| `assignment-priority-order` | A JSON array of task IDs |

Only the theme and priority order are saved. Registration details are not stored.

If localStorage is unavailable, the controls still work during the current visit, but changes may not persist after reloading.

## Manual Testing Checklist

### Modal System

- [ ] Each Learn More button displays the correct topic.
- [ ] Both close buttons close the modal.
- [ ] Clicking the backdrop closes the modal.
- [ ] Clicking inside the modal does not close it.
- [ ] Escape closes the modal.
- [ ] Background scrolling is disabled while open and restored after closing.
- [ ] Tab and Shift+Tab keep focus inside the modal.
- [ ] Focus returns to the opening button.

### Form Validation

- [ ] A name shorter than 2 characters shows an error.
- [ ] An email without `@` or a dotted domain shows an error.
- [ ] A phone number with the wrong length or prefix shows an error.
- [ ] Each failing password rule produces a specific message.
- [ ] Valid fields display green borders and checkmarks.
- [ ] Submit remains disabled while any field is invalid.
- [ ] Valid submission displays a success message without reloading.
- [ ] The browser console contains the submitted data object.

### Priority List

- [ ] Tasks move both up and down through dragging.
- [ ] The dragged task becomes semi-transparent.
- [ ] A drop indicator shows the proposed position.
- [ ] Priority numbers update after each move.
- [ ] Cancelling a drag preserves the order.
- [ ] Arrow buttons reorder tasks.
- [ ] Reloading restores the saved order.
- [ ] Reset order restores the original sequence.

### Theme

- [ ] The toggle switches between light and dark themes.
- [ ] The selected theme persists across pages and reloads.

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Native Drag and Drop API
- localStorage
# week-2-day-4-assignment
