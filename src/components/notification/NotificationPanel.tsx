import styles from "./NotificationPanel.module.css";

import { Check } from "lucide-react";
import { X } from "lucide-react";
import type { NotificationResponseDto } from "../../types/notification";
import {
  useAcceptFriendMutation,
  useRejectFriendMutation,
} from "../../store/notificationApi";

interface NotificationProps {
  notification: NotificationResponseDto;
}
const NotificationPanel = ({ notification }: NotificationProps) => {
  const [acceptFriend] = useAcceptFriendMutation();
  const [rejectFriend] = useRejectFriendMutation();

  const handleAccept = async () => {
    try {
      await acceptFriend(notification.notificationId).unwrap();
    } catch (err: any) {
      console.log("Ошибка accept");
    }
  };

  const handleReject = async () => {
    try {
      await rejectFriend(notification.notificationId).unwrap();
    } catch (err: any) {
      console.log("ошибка reject");
    }
  };
  return (
    <div className={styles.containerPanel}>
      <div className={styles.username}>{notification.senderName}</div>
      <div className={styles.containerBtn}>
        <button className={styles.btnAccept} onClick={handleAccept}>
          <Check size={20} />
        </button>
        <button className={styles.btnCancel} onClick={handleReject}>
          <X size={20} />
        </button>
      </div>
    </div>
  );
};

export default NotificationPanel;
