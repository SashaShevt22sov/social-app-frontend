import { Link, useNavigate } from "react-router-dom";
import styles from "./Landing.module.css";
import { motion } from "framer-motion";
import { useAppSelector } from "../../hooks/hooksStore";

const Landing = () => {
  const navigate = useNavigate();
  const { isAuth } = useAppSelector((state) => state.auth);
  const handleClickLogin = () => {
    if (isAuth) {
      navigate("/main");
    } else {
      navigate("/login");
    }
  };

  return (
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
      className={styles.containerLanding}
    >
      <div className={styles.trevoo}>Trevoo</div>
      <div className={styles.containerBtn}>
        <Link to="/login">
          <button onClick={handleClickLogin}>Войти</button>
        </Link>
      </div>
    </motion.div>
  );
};

export default Landing;
