class BaseDto {
  constructor(fields) {
    this.fields = fields;
  }

  validate(body = {}) {
    const errors = [];

    for (const [field, rules] of Object.entries(this.fields)) {
      const value = body[field];
      const isEmpty =
        value === undefined || value === null || String(value).trim() === "";

      if (rules.required && isEmpty) {
        errors.push(`'${field}' is required`);
        continue;
      }

      if (!isEmpty) {
        const strVal = String(value).trim();

        if (rules.type === "email") {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(strVal)) {
            errors.push(`'${field}' must be a valid email address`);
          }
        }

        if (rules.minLength && strVal.length < rules.minLength) {
          errors.push(
            `'${field}' must be at least ${rules.minLength} characters long`
          );
        }

        if (rules.maxLength && strVal.length > rules.maxLength) {
          errors.push(
            `'${field}' must be at most ${rules.maxLength} characters long`
          );
        }
      }
    }

    return errors;
  }
}

module.exports = BaseDto;
