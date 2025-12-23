import { Outlet } from "react-router-dom";

import ButtonCreateServer from "../../components/buttonCreateServer/ButtonCreateServer";
import FriendList from "../../features/friendsList/FriendList";
import ServerList from "../../features/serverList/ServerList";
import styles from "./PrivatePage.module.css";

import { motion } from "framer-motion";

const PrivatePage = () => {
  return (
    <motion.div
      className={styles.containerPrivatePage}
      initial={{ width: 0, height: 0, opacity: 0 }}
      animate={{ width: "100vw", height: "100vh", opacity: 1 }}
      transition={{
        width: { duration: 0.3, ease: "easeOut" },
        height: { duration: 0.25, delay: 0.15, ease: "easeOut" },
        opacity: { duration: 0.3 },
      }}
      style={{ margin: "0 auto" }}
    >
      <div className={styles.left}>
        <ServerList />
        <ButtonCreateServer />
      </div>
      <div className={styles.center}>
        <Outlet />
      </div>
      <div className={styles.right}>
        <FriendList />
      </div>
    </motion.div>
  );
};

export default PrivatePage;
