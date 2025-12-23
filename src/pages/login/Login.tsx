import styles from "./Login.module.css";

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { ArrowBigLeft } from "lucide-react";
import { motion } from "framer-motion";

import Logo from "../../components/logo/Logo";
import ForgotPasswordModal from "../../modal/forgotPassword/ForgotPasswordModal";
import Loading from "../../components/loading/Loading";

import type { LoginForm } from "../../types/types";

import { validationLogin } from "../../validation/LoginValidation";

import { useAppDispatch, useAppSelector } from "../../hooks/hooksStore";

import { login } from "../../store/authSlice";
import { forgotPassword } from "../../store/authSlice";

const Login = () => {
  const [modalResetPassword, setModalResetPassword] = useState(false);

  const { error, loading, isAuth } = useAppSelector((state) => state.auth);

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  });

  useEffect(() => {
    if (isAuth) {
      navigate("/main");
    }
  }, [isAuth, navigate]);

  const refInputFocus = useRef<HTMLInputElement>(null);
  useEffect(() => {
    refInputFocus.current?.focus();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validationLogin(loginForm);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setValidationErrors({});

    try {
      const response = await dispatch(login(loginForm));

      if (login.fulfilled.match(response)) {
        navigate("/main", { replace: true });
      }
    } catch (err: any) {
      console.log(" Ошибка входа в компоненте");
    }
  };

  const handleForgotPassword = async () => {
    if (!loginForm.email) {
      return setValidationErrors({ email: "Введите email" });
    }

    const response = await dispatch(forgotPassword({ email: loginForm.email }));

    if (forgotPassword.fulfilled.match(response)) {
      setModalResetPassword(true);
      console.log("Письмо отправленно");
    } else {
      console.log("ошибка отправки ресет пасворд ");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.containerLogin}
    >
      {loading && <Loading />}
      {modalResetPassword && (
        <ForgotPasswordModal onClick={() => setModalResetPassword(false)} />
      )}
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
        className={styles.logo}
      >
        <Logo />
      </motion.div>
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{
          duration: 0.3,
          type: "spring",
          stiffness: 200,
          damping: 20,
        }}
        className={styles.modal}
      >
        <Link to="/">
          <span className={styles.close}>
            <ArrowBigLeft size={30} />
          </span>
        </Link>

        <h2>Вход</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">
            E-mail<span className={styles.requred}>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={loginForm.email}
            onChange={onChange}
            required
            ref={refInputFocus}
            placeholder="example@mail.ru"
            className={validationErrors.email ? styles.inputError : ""}
          />
          <p className={styles.error}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: validationErrors.email ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {validationErrors.email || " "}
            </motion.span>
          </p>
          <label htmlFor="password">
            Пароль<span className={styles.requred}>*</span>
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={loginForm.password}
            onChange={onChange}
            placeholder="••••••••"
            autoComplete="new-password"
            className={validationErrors.password ? styles.inputError : ""}
          />
          <p className={styles.forgotPassword} onClick={handleForgotPassword}>
            Забыли пароль?
          </p>
          <p className={styles.error}>
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: validationErrors.password ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {validationErrors.password || " "}
            </motion.span>
          </p>

          <button type="submit">Войти</button>
        </form>
        <p className={styles.p}>
          Нету учетной записи?
          <Link className={styles.singIn} to="/register">
            Создать
          </Link>
        </p>
      </motion.div>
    </motion.div>
  );
};

export default Login;
