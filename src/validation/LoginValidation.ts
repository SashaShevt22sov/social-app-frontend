import type { LoginForm } from "../types/types";

export const validationLogin = (values: LoginForm): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.email) {
    errors.email = "Введите email";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(values.email)) {
      errors.email = "Введите корректный email";
    }
  }

  if (!values.password) {
    errors.password = "Введите пароль";
  } else if (values.password.length < 6) {
    errors.password = "Пароль должен быть минимум 6 символов";
  }

  return errors;
};
