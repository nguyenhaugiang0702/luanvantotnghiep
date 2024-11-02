import { defineStore } from 'pinia';

export const useNotificationsStore = defineStore('notifications', {
  state: () => ({
    notifications: JSON.parse(localStorage.getItem('notifications')) || [],
  }),
  actions: {
    addNotification(notification) {
      this.notifications.push(notification);
      // Lưu vào localStorage
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    },
    markAllAsRead() {
      this.notifications.forEach((notif) => {
        notif.read = true;
      });
      localStorage.setItem('notifications', JSON.stringify(this.notifications));
    },
    loadNotifications() {
      this.notifications = JSON.parse(localStorage.getItem('notifications')) || [];
    },
  },
});