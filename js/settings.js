/**
 * Settings form — validation, persistence, and user feedback.
 */
(function initSettingsForm() {
  const STORAGE_KEY = "capstone-settings";
  const form = document.getElementById("settings-form");

  if (!form) return;

  const feedback = document.getElementById("form-feedback");
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const nameError = document.getElementById("name-error");
  const emailError = document.getElementById("email-error");

  const fields = {
    name: nameInput,
    email: emailInput,
    notifyEmail: document.getElementById("notify-email"),
    notifyPush: document.getElementById("notify-push"),
    notifyMarketing: document.getElementById("notify-marketing"),
    notifyWeekly: document.getElementById("notify-weekly"),
  };

  function loadSettings() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;

      const settings = JSON.parse(saved);

      if (settings.name) fields.name.value = settings.name;
      if (settings.email) fields.email.value = settings.email;
      fields.notifyEmail.checked = settings.notifyEmail ?? true;
      fields.notifyPush.checked = settings.notifyPush ?? false;
      fields.notifyMarketing.checked = settings.notifyMarketing ?? false;
      fields.notifyWeekly.checked = settings.notifyWeekly ?? true;
    } catch {
      /* Ignore corrupted storage data */
    }
  }

  function getFormData() {
    return {
      name: fields.name.value.trim(),
      email: fields.email.value.trim(),
      notifyEmail: fields.notifyEmail.checked,
      notifyPush: fields.notifyPush.checked,
      notifyMarketing: fields.notifyMarketing.checked,
      notifyWeekly: fields.notifyWeekly.checked,
    };
  }

  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function showFieldError(input, errorEl, message) {
    input.classList.add("form-input--error");
    input.setAttribute("aria-invalid", "true");
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearFieldError(input, errorEl) {
    input.classList.remove("form-input--error");
    input.removeAttribute("aria-invalid");
    errorEl.textContent = "";
    errorEl.hidden = true;
  }

  function validateForm() {
    let isValid = true;

    clearFieldError(fields.name, nameError);
    clearFieldError(fields.email, emailError);

    if (!fields.name.value.trim()) {
      showFieldError(fields.name, nameError, "Please enter your name.");
      isValid = false;
    } else if (fields.name.value.trim().length < 2) {
      showFieldError(fields.name, nameError, "Name must be at least 2 characters.");
      isValid = false;
    }

    if (!fields.email.value.trim()) {
      showFieldError(fields.email, emailError, "Please enter your email address.");
      isValid = false;
    } else if (!validateEmail(fields.email.value.trim())) {
      showFieldError(fields.email, emailError, "Please enter a valid email address.");
      isValid = false;
    }

    return isValid;
  }

  function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = `alert alert--${type}`;
    feedback.hidden = false;

    window.clearTimeout(showFeedback._timer);
    showFeedback._timer = window.setTimeout(() => {
      feedback.hidden = true;
    }, 4000);
  }

  function saveSettings(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validateForm()) {
      showFeedback("Please fix the errors below before saving.", "error");
      const firstInvalid = form.querySelector("[aria-invalid='true']");
      firstInvalid?.focus();
      return;
    }

    const data = getFormData();
    saveSettings(data);
    showFeedback("Your settings have been saved successfully.", "success");
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      Object.values(fields).forEach((field) => {
        if (field.type === "text" || field.type === "email") {
          clearFieldError(field, field === fields.name ? nameError : emailError);
        }
      });
      feedback.hidden = true;
      localStorage.removeItem(STORAGE_KEY);
    }, 0);
  });

  [fields.name, fields.email].forEach((input) => {
    input.addEventListener("input", () => {
      const errorEl = input === fields.name ? nameError : emailError;
      if (input.hasAttribute("aria-invalid")) {
        clearFieldError(input, errorEl);
      }
    });
  });

  loadSettings();
})();
