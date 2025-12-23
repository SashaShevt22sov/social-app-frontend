export interface NotificationResponseDto {
  notificationId: number;
  senderId: number;
  senderName: string;
  type?: string;
  read: boolean;
}
