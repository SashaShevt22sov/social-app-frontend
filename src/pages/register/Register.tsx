import { useEffect, useRef, useState } from "react";
import { ArrowBigLeft } from "lucide-react";
import styles from "./Register.module.css";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { clearError, sendOtp } from "../../store/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/hooksStore";
import type { RegisterForm } from "../../types/types";
import { validationRegisterForm } from "../../validation/RegisterValidation";
import Loading from "../../components/loading/Loading";

const Register = () => {
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [focusFiel, setFocusFiel] = useState<Record<string, boolean>>({
    username: false,
    displayName: false,
    email: false,
    password: false,
  });

  const [formRegister, setFormRegister] = useState<RegisterForm>({
    username: "",
    displayName: "",
    email: "",
    password: "",
  });

  const handleFocus = (fieldName: string) => {
    setFocusFiel((prev) => ({ ...prev, [fieldName]: true }));
  };

  const showError = (fieldName: string) => {
    return focusFiel[fieldName] && validationErrors[fieldName];
  };

  const dispatch = useAppDispatch();

  const { error, loading, success, isAuth } = useAppSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

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
    setFormRegister((prev) => ({ ...prev, [name]: value }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validationRegisterForm(formRegister);

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }
    setValidationErrors({});

    try {
      const resultAction = await dispatch(sendOtp(formRegister));
      if (sendOtp.rejected.match(resultAction)) {
        const apiErrors = resultAction.payload;
        if (apiErrors) {
          setValidationErrors(apiErrors);
        }
        return;
      }

      if (sendOtp.fulfilled.match(resultAction)) {
        console.log("Регистрация успешна!", resultAction.payload);
        navigate("/otp", { state: { email: formRegister.email } });
      } else {
        console.log("Ошибка регистрации:", resultAction.payload);
      }
    } catch (err: any) {
      console.error("Произошла непредвиденная ошибка:", err);
    }
  };

  return (
    <motion.div className={styles.containerRegister}>
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
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
        {loading && <Loading />}
        <Link to="/">
          <span className={styles.close}>
            <ArrowBigLeft size={30} />
          </span>
        </Link>
        <h2>Регистрация</h2>

        <form onSubmit={handleSubmit}>
          <motion.label
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 300,
              damping: 22,
            }}
            htmlFor="username"
          >
            Имя пользователя<span className={styles.requred}>*</span>
          </motion.label>
          <input
            type="text"
            id="username"
            name="username"
            value={formRegister.username}
            onChange={onChange}
            onFocus={() => handleFocus("username")}
            ref={refInputFocus}
            className={validationErrors.username ? styles.inputError : ""}
          />
          <AnimatePresence>
            {showError("username") && (
              <motion.p
                className={styles.error}
                initial={{
                  opacity: 0,
                  height: 0,
                  marginTop: 0,
                  marginBottom: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                {validationErrors.username}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.label
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 300,
              damping: 22,
            }}
            htmlFor="displayName"
          >
            Nickname (отображаемое имя)<span className={styles.requred}>*</span>
          </motion.label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={formRegister.displayName}
            onFocus={() => handleFocus("displayName")}
            onChange={onChange}
            className={validationErrors.displayName ? styles.inputError : ""}
          />
          <AnimatePresence>
            {showError("displayName") && (
              <motion.p
                className={styles.error}
                initial={{
                  opacity: 0,
                  height: 0,
                  marginTop: 0,
                  marginBottom: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                {validationErrors.displayName}
              </motion.p>
            )}
          </AnimatePresence>
          <motion.label
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 300,
              damping: 22,
            }}
            htmlFor="email"
          >
            E-mail<span className={styles.requred}>*</span>
          </motion.label>
          <input
            type="email"
            id="email"
            name="email"
            value={formRegister.email}
            onChange={onChange}
            onFocus={() => handleFocus("email")}
            placeholder="example@mail.ru"
            required
            className={validationErrors.email ? styles.inputError : ""}
          />

          <AnimatePresence>
            {showError("email") && (
              <motion.p
                className={styles.error}
                initial={{
                  opacity: 0,
                  height: "1px",
                  marginTop: 0,
                  marginBottom: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                {validationErrors.email}
              </motion.p>
            )}
          </AnimatePresence>

          <motion.label
            initial={{ scale: 2, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              duration: 0.2,
              type: "spring",
              stiffness: 300,
              damping: 22,
            }}
            htmlFor="password"
          >
            Пароль<span className={styles.requred}>*</span>
          </motion.label>
          <input
            type="password"
            id="password"
            name="password"
            value={formRegister.password}
            onChange={onChange}
            onFocus={() => handleFocus("password")}
            placeholder="••••••••"
            autoComplete="new-password"
            required
            className={validationErrors.password ? styles.inputError : ""}
          />

          <AnimatePresence>
            {showError("password") && (
              <motion.p
                className={styles.error}
                initial={{
                  opacity: 0,
                  height: 0,
                  marginTop: 0,
                  marginBottom: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{ opacity: 0, height: 0, marginTop: 0, marginBottom: 0 }}
                transition={{ duration: 0.2 }}
                style={{ overflow: "hidden" }}
              >
                {validationErrors.password}
              </motion.p>
            )}
          </AnimatePresence>

          <button type="submit">Создать</button>

          <p className={styles.p}>
            Уже есть учетная запись?
            <Link to="/login" className={styles.singIn}>
              Войти
            </Link>
          </p>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Register;
