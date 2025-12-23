import FriendsPanel from "../friendsPanel/FriendsPanel";
import styles from "./FindFriends.module.css";

import { useAppDispatch, useAppSelector } from "../../hooks/hooksStore";

import React, { useEffect, useRef, useState } from "react";

import {
  clearSuccess,
  sendFriendRequest,
  clearError,
} from "../../store/friendsSlice";
import ModalErrorAndSuccess from "../../modal/errorAndSuccess/ModalErrorAndSuccess";

const FindFriends = () => {
  const [userNameFindFriends, setUsernameFindFriends] = useState<string>("");
  const [errorLocation, setErrorLocation] = useState<string>("");

  const dispatch = useAppDispatch();

  const refInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    refInput.current?.focus();
  }, [refInput]);

  const { success, error } = useAppSelector((state) => state.friends);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsernameFindFriends(e.target.value);
    setErrorLocation("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("handleSubmit", userNameFindFriends);
    if (userNameFindFriends.trim().length === 0) {
      setErrorLocation("Введите username");
      return;
    }

    try {
      const response = await dispatch(
        sendFriendRequest({ username: userNameFindFriends })
      ).unwrap();
    } catch (err: any) {}
  };
  const firstError = error ? Object.values(error)[0] : "Неизвестная ошибка";
  return (
    <div className={styles.containerFindFriends}>
      {error && (
        <ModalErrorAndSuccess
          title="Ошибка"
          type="error"
          message={firstError}
          onClose={() => dispatch(clearError())}
        />
      )}
      {success && (
        <ModalErrorAndSuccess
          title="Успех"
          type="success"
          message={success}
          onClose={() => dispatch(clearSuccess())}
        />
      )}

      <div className={styles.containerInput}>
        <div className={styles.inputWrapper}>
          <form onSubmit={handleSubmit}>
            <input
              ref={refInput}
              type="text"
              placeholder="#username друга"
              onChange={onChange}
              value={userNameFindFriends}
            />

            {errorLocation && <p>{errorLocation}</p>}
            <button type="submit" className={styles.searchButton}>
              Отправить заявку
            </button>
          </form>
        </div>
      </div>

      <div className={styles.containerListFindFriends}></div>
    </div>
  );
};
export default FindFriends;
