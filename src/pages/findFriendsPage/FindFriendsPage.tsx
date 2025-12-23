import styles from "./FindFriendsPage.module.css";

import FindFriends from "../../features/findFriends/FindFriends";
import PendingFriends from "../../features/pendingFriends/PendingFriends";

import { Outlet, NavLink } from "react-router-dom";

const FindFriendsPage = () => {
  return (
    <div className={styles.containerFindFriends}>
      <div className={styles.containerBtn}>
        <NavLink to="/main/find-friends/pending" className={styles.btn}>
          Ожидание
        </NavLink>

        <NavLink to="/main/find-friends/find" className={styles.btn}>
          Поиск
        </NavLink>
      </div>
      <div className={styles.containerListFindFriends}>
        <Outlet />
      </div>
    </div>
  );
};

export default FindFriendsPage;
