import styles from "./UserPanel.module.css";

import { Mic, MicOff, Volume2, VolumeX, Settings, Bell } from "lucide-react";

import { useAppSelector } from "../../hooks/hooksStore";
import NotificationIcon from "../../components/notification/NotificationIcon";

const UserPanel = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className={styles.containerUserPanel}>
      {/* ACTIONS */}
      <div className={styles.actions}>
        <button className={styles.btn}>
          <Mic size={20} />
        </button>

        <button className={styles.btn}>
          <Volume2 size={20} />
        </button>

        <div className={styles.btn}>
          <NotificationIcon />
        </div>

        <button className={styles.btn}>
          <Settings size={20} />
        </button>
      </div>
      {/* PROFILE */}
      <div className={styles.containerProfileUser}>
        <span className={styles.nickNameUser}>{user?.displayName}</span>
        <img
          className={styles.avatarUser}
          src="https://via.placeholder.com/36"
          alt="avatar"
        />
      </div>
    </div>
  );
};

export default UserPanel;
