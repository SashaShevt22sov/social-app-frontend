import { useEffect } from "react";
import styles from "./ModalErrorAndSuccess.module.css";
import { motion } from "framer-motion";

interface ModalErrorAndSuccessProps {
  title: string;
  message: string;
  type: "error" | "success";
  onClose: () => void;
}

const ModalErrorAndSuccess = ({
  title,
  message,
  type,
  onClose,
}: ModalErrorAndSuccessProps) => {
  useEffect(() => {
    if (type === "success") {
      const timer = setTimeout(() => {
        onClose();
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [onClose, type]);

  return (
    <motion.div className={styles.overlay} onClick={onClose}>
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
        <h2
          className={`${styles.title} ${
            type === "error" ? styles.titleError : styles.titleSuccess
          }`}
        >
          {title}
        </h2>
        <p className={styles.message}>{message}</p>
        <button className={styles.btn} onClick={onClose}>
          Закрыть
        </button>
      </motion.div>
    </motion.div>
  );
};

export default ModalErrorAndSuccess;
