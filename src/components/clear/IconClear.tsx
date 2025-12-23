import styles from "./Clear.module.css";
import { Trash } from "lucide-react";

const IconClear = () => {
  return (
    <div className={styles.containerIcon}>
      <Trash className={styles.icon} />
    </div>
  );
};

export default IconClear;
