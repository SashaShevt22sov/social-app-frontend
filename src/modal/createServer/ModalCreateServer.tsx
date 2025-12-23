import { useEffect, useRef, useState } from "react";

import styles from "./ModalCreateServer.module.css";

import { useAppDispatch } from "../../hooks/hooksStore";
import { createServer } from "../../store/serverSlice";

import { motion } from "framer-motion";

interface ModalCreateServeProps {
  onClose: () => void;
}

const ModalCreateServer = ({ onClose }: ModalCreateServeProps) => {
  const [serverName, setServerName] = useState("");
  const [locationError, setLocationError] = useState("");

  const dispach = useAppDispatch();

  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    ref.current?.focus();
  }, [ref]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setServerName(e.target.value);
    setLocationError("");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (serverName.length < 2) {
      setLocationError(
        "Название сервера должно состоять хотя бы из двух символов"
      );
      return;
    }
    try {
      const response = await dispach(createServer({ serverName: serverName }));
      onClose();
    } catch (err: any) {
      console.log("Ошибка создания сервера в компоненте");
    }
  };
  return (
    <div className={styles.overlay} onClick={onClose}>
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
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Новый сервер</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="nameServer">Название сервера</label>
          <input
            type="text"
            id="nameServer"
            ref={ref}
            value={serverName}
            onChange={onChange}
            maxLength={20}
            placeholder="#nameServer"
          />
          {locationError && <p className={styles.err}>{locationError}</p>}
          <button type="submit">Создать</button>
        </form>
      </motion.div>
    </div>
  );
};

export default ModalCreateServer;
