import styles from "./FriendsPanel.module.css";
import { MessageSquare, UserPlus } from "lucide-react";
import type { FriendsList } from "../../types/friends";

interface FriendsPanelProps {
  friends: FriendsList;
}

const FriendsPanel = ({ friends }: FriendsPanelProps) => {
  return (
    <div className={styles.containerFriendsPanel}>
      <div className={styles.containerAvatar}>
        <img src="https://via.placeholder.com/40" alt="avatar" />
      </div>

      <div className={styles.containerNickName}>
        <span className={styles.nickName}>{friends.friendName}</span>
      </div>

      <div className={styles.actions}>
        <button className={styles.btn}>
          <MessageSquare size={18} />
        </button>

        <button className={styles.btn}>
          <UserPlus size={18} />
        </button>
      </div>
    </div>
  );
};

export default FriendsPanel;
