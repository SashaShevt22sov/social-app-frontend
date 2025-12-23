import { useState } from "react";
import styles from "./NotificationIcon.module.css";

import { Bell } from "lucide-react";

import NotificationModal from "./NotificationModal";

import { AnimatePresence } from "framer-motion";
import { useGetNotificationQuery } from "../../store/notificationApi";

const NotificationIcon = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { data: notifications } = useGetNotificationQuery();
  const unreadCount = notifications?.filter((n) => !n.read).length ?? 0;

  return (
    <div className={styles.containerNotification}>
      <div
        className={styles.containerIcon}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <Bell className={styles.icon} size={20} />
        {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
      </div>
      <AnimatePresence>
        {isOpen && <NotificationModal isClose={() => setIsOpen(false)} />}
      </AnimatePresence>
    </div>
  );
};

export default NotificationIcon;
