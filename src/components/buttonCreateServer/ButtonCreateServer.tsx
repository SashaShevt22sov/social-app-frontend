import { useEffect, useState } from "react";
import styles from "./buttonCreateServer.module.css";

import { CirclePlus } from "lucide-react";
import ModalCreateServer from "../../modal/createServer/ModalCreateServer";

const ButtonCreateServer = () => {
  const [openModal, setOpenModal] = useState<boolean>(false);

  return (
    <div className={styles.containerBtn}>
      <div
        className={styles.containerIcon}
        onClick={() => {
          setOpenModal(true);
        }}
      >
        <CirclePlus size={26} />
      </div>
      {openModal && <ModalCreateServer onClose={() => setOpenModal(false)} />}
    </div>
  );
};

export default ButtonCreateServer;
