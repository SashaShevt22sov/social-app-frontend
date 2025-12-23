import styles from "./ServerList.module.css";

import { useAppSelector } from "../../hooks/hooksStore";

import { motion } from "framer-motion";

const ServerList = () => {
  const servers = useAppSelector((state) => state.server.servers);

  return (
    <div className={styles.containerServerList}>
      {servers && servers.length > 0 ? (
        servers.map((server) => (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.1 }}
            key={server.id}
            className={styles.blockServerItem}
          >
            <span className={styles.nameBlock}>
              {server.serverName.charAt(0).toUpperCase()}
            </span>
          </motion.div>
        ))
      ) : (
        <p className={styles.serverP}>Сервера</p>
      )}
    </div>
  );
};

export default ServerList;
