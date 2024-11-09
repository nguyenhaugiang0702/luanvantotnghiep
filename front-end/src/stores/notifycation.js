import { defineStore } from 'pinia';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: {
      newOrders: [],
      newMessages: [],
    },
  }),
  actions: {
    addNewOrderNotification(notification) {
      if (!Array.isArray(this.notifications.newOrders)) {
        this.notifications.newOrders = [];
      }
      this.notifications.newOrders.unshift(notification);
      this.saveNotificationsToLocalStorage();
    },
    addNewMessageNotification(notification) {
      if (!Array.isArray(this.notifications.newMessages)) {
        this.notifications.newMessages = [];
      }
      this.notifications.newMessages.unshift(notification);
      this.saveNotificationsToLocalStorage();
    },
    markAllAsRead() {
      this.notifications.newOrders.forEach((notif) => (notif.read = true));
      this.notifications.newMessages.forEach((notif) => (notif.read = true));
      this.saveNotificationsToLocalStorage();
    },
    loadNotifications() {
      const storedNotifications = JSON.parse(localStorage.getItem('notifications'));
      if (storedNotifications) {
        this.notifications.newOrders = storedNotifications.newOrders || [];
        this.notifications.newMessages = storedNotifications.newMessages || [];
        
        // Sắp xếp các thông báo chưa đọc lên đầu
        this.notifications.newOrders.sort((a, b) => (a.read ? 1 : -1) - (b.read ? 1 : -1));
        this.notifications.newMessages.sort((a, b) => (a.read ? 1 : -1) - (b.read ? 1 : -1));
      }
    },
    updateNotificationStatus(notificationType, notificationId) {
      const notificationsList = this.notifications[notificationType]; // 'newOrders' hoặc 'newMessages'
      const notification = notificationsList.find((notif) => notif.id === notificationId);
      if (notification) {
        notification.read = true;
        this.saveNotificationsToLocalStorage();
      }
    },
    saveNotificationsToLocalStorage() {
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    },
  },
});
