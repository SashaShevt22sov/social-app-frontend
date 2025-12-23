import styles from "./OtpPage.module.css";

import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "../../hooks/hooksStore";
import { confirmOtpAndRegister } from "../../store/authSlice";

import { motion } from "framer-motion";

import Loading from "../../components/loading/Loading";

const OtpPage = () => {
  const [code, setCode] = useState("");

  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    if (!email) {
      navigate("/register", { replace: true });
    }
  }, [email]);

  const navigate = useNavigate();

  const { loading, error, tempRegisterData } = useAppSelector(
    (state) => state.auth
  );

  const dispatch = useAppDispatch();

  const refInputFocus = useRef<HTMLInputElement>(null);
  useEffect(() => {
    refInputFocus.current?.focus();
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tempRegisterData) {
      return;
    }
    try {
      const response = await dispatch(confirmOtpAndRegister({ otpCode: code }));
      if (confirmOtpAndRegister.fulfilled.match(response)) {
        navigate("/main", { replace: true });
        console.log("Регистрация прошла успешно в otpPage", response.payload);
      } else {
        console.log("Ошибка подтверждения OTPPage :", response.payload);
      }
    } catch (err: any) {
      console.error("Произошла ошибка:", err);
    }
  };
  return (
    <div className={styles.overlay}>
      {loading && <Loading />}
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
        <h2>Подтверждение</h2>
        <p className={styles.containerEmail}>
          Код был отправлен на вашу почту :{" "}
          <strong className={styles.email}>{email}</strong>
        </p>
        <form className={styles.form} onSubmit={handleSubmit}>
          <label htmlFor="otp">
            Код<span className={styles.requred}>*</span>
          </label>
          <input
            type="text"
            id="otp"
            value={code}
            placeholder="Введите код"
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              setCode(onlyNumbers);
            }}
            ref={refInputFocus}
            maxLength={10}
          />
          <button type="submit" disabled={loading || code.trim().length < 4}>
            {loading ? "отправляем" : "Отправить"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default OtpPage;
