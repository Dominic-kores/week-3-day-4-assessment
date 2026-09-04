// Select the form, its inputs, and the feedback controls.
const form = document.querySelector("#registration-form");
const inputs = [...form.querySelectorAll("input")];
const submitButton = document.querySelector("#submit-button");
const formStatus = document.querySelector("#form-status");

// Each validator returns an error message or "" when the value is valid.
const validators = {
  name(value) {
    // Ignore surrounding spaces when checking name length.
    return value.trim().length >= 2
      ? ""
      : "Name must contain at least 2 characters.";
  },

  email(value) {
    // Require one @ and a dotted domain, with no whitespace.
    const pattern = /^[^\s@]+@[^\s@.]+(?:\.[^\s@.]+)+$/;

    return pattern.test(value.trim())
      ? ""
      : "Email must contain @ and a dot after @, such as alex@example.com.";
  },

  phone(value) {
    // Match the whole value:
    // 0 + either 7 or 1 + eight more digits = ten digits.
    const pattern = /^0[71]\d{8}$/;

    return pattern.test(value)
      ? ""
      : "Phone must be 10 digits starting with 07 or 01.";
  },

  password(value) {
    // Check rules separately to provide a specific error.
    if (value.length < 8) {
      return "Password must contain at least 8 characters.";
    }

    if (!/[A-Z]/.test(value)) {
      return "Password must contain at least 1 uppercase letter.";
    }

    if (!/\d/.test(value)) {
      return "Password must contain at least 1 number.";
    }

    return "";
  }
};

function validateField(input) {
  // The input name selects the matching validator.
  const error = validators[input.name](input.value);
  const field = input.closest(".field");
  const valid = error === "";

  // Update the border colour through CSS classes.
  field.classList.toggle("valid", valid);
  field.classList.toggle("invalid", !valid);

  // Provide both visible and screen-reader feedback.
  input.setAttribute("aria-invalid", String(!valid));
  field.querySelector(".icon").textContent = valid ? "✓" : "×";
  field.querySelector(".feedback").textContent =
    valid ? "Looks good." : error;

  return valid;
}

function updateSubmitButton() {
  // every() returns true only when all four inputs pass.
  const allValid = inputs.every(input => {
    return validators[input.name](input.value) === "";
  });

  submitButton.disabled = !allValid;
}

function handleEdit(event) {
  // Ignore events that do not come from one of our inputs.
  if (!inputs.includes(event.target)) return;

  validateField(event.target);
  updateSubmitButton();

  // Remove an earlier success message after another edit.
  formStatus.textContent = "";
}

// EVENT DELEGATION:
// Input events bubble, so one listener handles all four fields.
form.addEventListener("input", handleEdit);

// Also handle changes committed through browser input controls.
form.addEventListener("change", handleEdit);

form.addEventListener("submit", event => {
  // Prevent navigation or page reload.
  event.preventDefault();

  // Recheck every field before using the data.
  const results = inputs.map(validateField);
  updateSubmitButton();

  const firstInvalid = results.indexOf(false);

  if (firstInvalid !== -1) {
    inputs[firstInvalid].focus();
    return;
  }

  // Convert the form's named inputs into a JavaScript object.
  const formData = Object.fromEntries(new FormData(form));

  formData.name = formData.name.trim();
  formData.email = formData.email.trim();

  // Required for this assignment demonstration.
  // Use a sample password; production applications must not log passwords.
  console.log("Registration data:", formData);

  formStatus.textContent =
    "Form submitted successfully. Check the browser console.";
});

// Check initial values and values restored through browser navigation.
window.addEventListener("pageshow", updateSubmitButton);
updateSubmitButton();