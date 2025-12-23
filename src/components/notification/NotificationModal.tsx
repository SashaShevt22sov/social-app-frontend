import styles from "./NotificationModal.module.css";

import { motion } from "framer-motion";
import NotificationPanel from "./NotificationPanel";
import {
  useDeleteAllNotificationMutation,
  useGetNotificationQuery,
} from "../../store/notificationApi";
import IconClose from "../close/IconClose";
import IconClear from "../clear/IconClear";

interface NotificationModalProps {
  isClose: () => void;
}

const NotificationModal = ({ isClose }: NotificationModalProps) => {
  const { data: notifications, isLoading, isError } = useGetNotificationQuery();
  const [deleteAll] = useDeleteAllNotificationMutation();

  const clearAllNotification = async () => {
    try {
      await deleteAll().unwrap();
    } catch (err: any) {
      console.log("Ошибка при удаление всех заявок ");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className={styles.overlay}
      onClick={isClose}
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0, opacity: 0 }}
        transition={{
          duration: 0.1,
          type: "spring",
          stiffness: 300,
          damping: 22,
        }}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.clear} onClick={clearAllNotification}>
          <IconClear />
        </div>
        <div className={styles.close} onClick={isClose}>
          <IconClose />
        </div>
        <h2 className={styles.title}>Уведомления</h2>
        <div className={styles.main}>
          {notifications?.length === 0 && <p>Новых нет</p>}
          {notifications?.map((notification) => (
            <NotificationPanel
              key={notification.notificationId}
              notification={notification}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default NotificationModal;
