import type { RegisterForm } from "../types/types";

export const validationRegisterForm = (
  values: RegisterForm
): Record<string, string> => {
  const errors: Record<string, string> = {};

  const hasLowercase = /[a-z]/;
  // Проверяет наличие хотя бы одной строчной латинской буквы
  const hasUppercase = /[A-Z]/;
  // Проверяет наличие хотя бы одной заглавной латинской буквы
  const hasDigit = /\d/;
  // Проверяет наличие хотя бы одной цифры
  const hasSpecial = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
  // Проверяет наличие хотя бы одного спецсимвола
  const noCyrillic = /^[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/;
  // Разрешает только латиницу, цифры и спецсимволы (запрещает кириллицу)

  // Имя пользователя
  if (!values.username.trim()) {
    errors.username = "Имя пользователя обязательно";
  } else if (values.username.length < 3) {
    errors.username = "Минимум 3 символа";
  }

  // Отображаемое имя
  if (!values.displayName.trim()) {
    errors.displayName = "Nickname обязателен";
  } else if (values.displayName.length < 3) {
    errors.displayName = "Минимум 3 символа";
  }

  // Email
  if (!values.email.trim()) {
    errors.email = "Email обязателен";
  } else if (!/^\S+@\S+\.\S+$/.test(values.email)) {
    errors.email = "Некорректный email";
  }

  // Пароль
  if (!values.password) {
    errors.password = "Пароль обязателен";
  } else {
    if (values.password.length < 8) {
      errors.password = "Минимум 8 символов";
    } else if (!noCyrillic.test(values.password)) {
      errors.password = "Пароль не должен содержать кириллицу";
    } else if (!hasLowercase.test(values.password)) {
      errors.password = "Добавьте строчную букву";
    } else if (!hasUppercase.test(values.password)) {
      errors.password = "Добавьте заглавную букву";
    } else if (!hasDigit.test(values.password)) {
      errors.password = "Добавьте цифру";
    } else if (!hasSpecial.test(values.password)) {
      errors.password = "Добавьте спецсимвол ( ?, ! ) ";
    }
  }

  return errors;
};
