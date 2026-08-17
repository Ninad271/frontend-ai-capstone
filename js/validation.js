/**
 * Settings form validation helpers.
 * Exposed on window for browser use and Node-based manual testing.
 */
(function initValidation(global) {
  const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validateName(name) {
    const trimmed = name.trim();

    if (!trimmed) {
      return { valid: false, message: "Please enter your full name." };
    }

    return { valid: true, message: "" };
  }

  function validateEmail(email) {
    const trimmed = email.trim();

    if (!trimmed) {
      return { valid: false, message: "Please enter your email address." };
    }

    if (!EMAIL_PATTERN.test(trimmed)) {
      return { valid: false, message: "Please enter a valid email address." };
    }

    return { valid: true, message: "" };
  }

  function validateSettingsForm(values) {
    const nameResult = validateName(values.name);
    const emailResult = validateEmail(values.email);

    return {
      valid: nameResult.valid && emailResult.valid,
      fields: {
        name: nameResult,
        email: emailResult,
      },
    };
  }

  const validation = {
    validateName,
    validateEmail,
    validateSettingsForm,
  };

  global.SettingsValidation = validation;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = validation;
  }
})(typeof window !== "undefined" ? window : globalThis);
