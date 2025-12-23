import styles from "./PendingFriends.module.css";

import {
  useCancelPendingFriendsMutation,
  useGetFriendsPendingQuery,
} from "../../store/notificationApi";

const PendingFriends = () => {
  const { data: pendingFriends = [] } = useGetFriendsPendingQuery();
  const [cancelPendingFriend, { isLoading }] =
    useCancelPendingFriendsMutation();

  return (
    <div className={styles.containerPendingFriends}>
      {pendingFriends.length === 0 ? (
        <p className={styles.pendingEmpty}>Заявок нету </p>
      ) : (
        pendingFriends.map((user) => (
          <div className={styles.containerBlockFriends} key={user.id}>
            <span className={styles.containerUserName}>{user.username}</span>
            <span className={styles.containerPending}>заявка отправлена</span>
            <span
              className={styles.containerCancel}
              onClick={() => cancelPendingFriend(user.id)}
            >
              отмена
            </span>
          </div>
        ))
      )}
    </div>
  );
};

export default PendingFriends;
