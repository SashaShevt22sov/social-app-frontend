import { NavLink } from "react-router-dom";
import FriendsPanel from "../friendsPanel/FriendsPanel";
import UserPanel from "../userPanel/UserPanel";
import styles from "./FriendList.module.css";

import { motion } from "framer-motion";

import { Users } from "lucide-react";
import { useGetFriendsQuery } from "../../store/notificationApi";

const FriendList = () => {
  const { data: friends = [], isLoading } = useGetFriendsQuery();
  return (
    <motion.div className={styles.containerFriendsList}>
      <div className={styles.containerTop}>
        <div className={styles.iconFriendsContainer}>
          <Users />
        </div>
        <div className={styles.containerBtn}>
          <NavLink to="find-friends" className={styles.btn}>
            Добавить в друзья
          </NavLink>
        </div>
      </div>
      <div className={styles.containerCenter}>
        <div className={styles.containerBlockFriends}>
          {isLoading ? (
            <p>Loading</p>
          ) : friends.length === 0 ? (
            <p className={styles.listEmpty}>Список друзей пуст</p>
          ) : (
            friends.map((friend) => (
              <FriendsPanel key={friend.friendId} friends={friend} />
            ))
          )}
        </div>
      </div>
      <div className={styles.containerBottom}>
        <UserPanel />
      </div>
    </motion.div>
  );
};

export default FriendList;
