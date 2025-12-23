export const validateResetPassword = (value: string): string | undefined => {
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[A-Za-z\d!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]{8,}$/;

  if (!value) {
    return "Пароль обязателен";
  }

  if (!passwordRegex.test(value)) {
    return "Пароль должен быть не менее 8 символов, без кириллицы, содержать заглавную и строчную букву, цифру и спецсимвол";
  }

  return undefined;
};
