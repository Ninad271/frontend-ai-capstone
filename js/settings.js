/**
 * Settings form — validation, persistence, and user feedback.
 */
(function initSettingsForm() {
  const STORAGE_KEY = "capstone-settings";
  const form = document.getElementById("settings-form");

  if (!form || !window.SettingsValidation) return;

  const { validateSettingsForm } = window.SettingsValidation;

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

  const fieldErrors = {
    name: nameError,
    email: emailError,
  };

  const fieldHints = {
    name: "name-hint",
    email: "email-hint",
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
      name: fields.name.value,
      email: fields.email.value,
      notifyEmail: fields.notifyEmail.checked,
      notifyPush: fields.notifyPush.checked,
      notifyMarketing: fields.notifyMarketing.checked,
      notifyWeekly: fields.notifyWeekly.checked,
    };
  }

  function showFieldError(fieldName, message) {
    const input = fields[fieldName];
    const errorEl = fieldErrors[fieldName];
    const hintId = fieldHints[fieldName];

    input.classList.add("form-input--error");
    input.setAttribute("aria-invalid", "true");
    input.setAttribute("aria-describedby", `${hintId} ${errorEl.id}`);
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function clearFieldError(fieldName) {
    const input = fields[fieldName];
    const errorEl = fieldErrors[fieldName];
    const hintId = fieldHints[fieldName];

    input.classList.remove("form-input--error");
    input.removeAttribute("aria-invalid");
    input.setAttribute("aria-describedby", hintId);
    errorEl.textContent = "";
    errorEl.hidden = true;
  }

  function clearAllFieldErrors() {
    Object.keys(fieldErrors).forEach(clearFieldError);
  }

  function applyValidationResults(results) {
    clearAllFieldErrors();

    Object.entries(results.fields).forEach(([fieldName, result]) => {
      if (!result.valid) {
        showFieldError(fieldName, result.message);
      }
    });
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
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        name: data.name.trim(),
        email: data.email.trim(),
        notifyEmail: data.notifyEmail,
        notifyPush: data.notifyPush,
        notifyMarketing: data.notifyMarketing,
        notifyWeekly: data.notifyWeekly,
      })
    );
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const validation = validateSettingsForm(getFormData());

    if (!validation.valid) {
      applyValidationResults(validation);
      showFeedback("Please fix the errors below before saving.", "error");

      const firstInvalidField = Object.entries(validation.fields).find(
        ([, result]) => !result.valid
      );

      if (firstInvalidField) {
        fields[firstInvalidField[0]].focus();
      }

      return;
    }

    clearAllFieldErrors();
    saveSettings(getFormData());
    showFeedback("Your settings have been saved successfully.", "success");
  });

  form.addEventListener("reset", () => {
    window.setTimeout(() => {
      clearAllFieldErrors();
      feedback.hidden = true;
      localStorage.removeItem(STORAGE_KEY);
    }, 0);
  });

  ["name", "email"].forEach((fieldName) => {
    fields[fieldName].addEventListener("input", () => {
      if (fields[fieldName].hasAttribute("aria-invalid")) {
        clearFieldError(fieldName);
      }
    });
  });

  loadSettings();
})();
