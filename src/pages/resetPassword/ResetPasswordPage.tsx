import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";

import { validateResetPassword } from "../../validation/ResetPasswordValidate";

import api from "../../interceptor/api";

import { motion } from "framer-motion";

import styles from "./ResetPasswordPage.module.css";

const ResetPasswordPage = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [locationError, setLocationError] = useState<string | null>(null);
  const [pageError, setPageError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>("");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tokenFromUrl = searchParams.get("token");

    if (!tokenFromUrl) {
      setPageError("Токен сброса пароля отсутствует или недействителен");
    } else {
      setToken(tokenFromUrl);
    }
  }, [location]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    setLocationError("");
  };
  const onChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    setLocationError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errorPassword = validateResetPassword(password);

    if (errorPassword) {
      setLocationError(errorPassword);
      return;
    } else {
      setLocationError(null);
    }

    if (!password || !confirmPassword) {
      setLocationError("Заполните все поля");
      return;
    }

    if (password !== confirmPassword) {
      setLocationError("Пароли не совпадают");
      return;
    }

    if (!token) {
      setPageError("Неверная ссылка для сброса пароля");
    }

    try {
      const response = await api.post("/auth/reset-password", {
        password: password,
        token: token,
      });
      if (response.status === 200) {
        navigate("/login");
      }
    } catch (err: any) {
      setLocationError(err.response.data.message || "ошибка смены парроля");
    }
  };
  if (pageError) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className={styles.overlay2}
      >
        <motion.div
          initial={{ scale: 2, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            duration: 0.2,
            type: "spring",
            stiffness: 300,
            damping: 22,
          }}
          className={styles.modal2}
        >
          <h2 className={styles.title}>Ошибка</h2>
          <p className={styles.p}>{pageError}</p>
          <button className={styles.btn} onClick={() => navigate("/login")}>
            Запросить повторно
          </button>
        </motion.div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.overlay}
    >
      <motion.div
        initial={{ scale: 2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{
          duration: 0.2,
          type: "spring",
          stiffness: 300,
          damping: 22,
        }}
        className={styles.modal}
      >
        <h2>Сброс пароля</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="password ">
            Новый пароль<span className={styles.requred}>*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={onChange}
            required
            autoComplete="new-password"
          />
          <label htmlFor="password ">
            Подтверждение пароля<span className={styles.requred}>*</span>
          </label>
          <input
            type="password"
            value={confirmPassword}
            onChange={onChangeConfirmPassword}
            required
            autoComplete="new-password"
          />
          {locationError && <p className={styles.error}>{locationError}</p>}
          <button type="submit">Поменять</button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ResetPasswordPage;
