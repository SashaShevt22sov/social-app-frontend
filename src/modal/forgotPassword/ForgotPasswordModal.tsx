import styles from "./ForgotPasswordModal.module.css";

import { motion } from "framer-motion";

interface ForgotProps {
  onClick: () => void;
}
const ForgotPasswordModal = ({ onClick }: ForgotProps) => {
  return (
    <div className={styles.overlay}>
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
        <p>Мы отправили иснтрукцию с восстановлением пароля на вашу почту</p>
        <button onClick={onClick}>Окей</button>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordModal;
