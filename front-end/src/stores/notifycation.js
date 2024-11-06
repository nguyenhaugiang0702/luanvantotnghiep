import { defineStore } from 'pinia';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: JSON.parse(localStorage.getItem('notifications')) || { newOrders: [], newMessages: [] },
  }),
  actions: {
    addNewOrderNotification(notification) {
      this.notifications.newOrders.push(notification);
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    },
    addNewMessageNotification(notification) {
      this.notifications.newMessages.push(notification);
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    },
    markAllAsRead() {
      this.notifications.newOrders.forEach((notif) => (notif.read = true));
      this.notifications.newMessages.forEach((notif) => (notif.read = true));
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    },
    loadNotifications() {
      const storedNotifications = JSON.parse(localStorage.getItem('notifications'));
      this.notifications = storedNotifications || { newOrders: [], newMessages: [] };
    },
  },
});
