import styles from "./IconClose.module.css";
import { X } from "lucide-react";

const IconClose = () => {
  return (
    <div className={styles.containerIcon}>
      <X className={styles.icon} />
    </div>
  );
};

export default IconClose;
