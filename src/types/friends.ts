export interface sendRequsetFriend {
  username: string;
}
export interface sendResponseFriend {
  message: string;
}
export interface PendingUser {
  id: number;
  username: string;
  displayName?: string;
}
export interface FriendsList {
  friendId: number;
  friendName: string;
}
