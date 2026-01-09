import React, { useState, useEffect } from 'react';
import { subscribeToNotifications } from '../store/gameStore';
import type { Notification } from '../types';

const NotificationToast: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const unsubscribe = subscribeToNotifications(setNotifications);
    return unsubscribe;
  }, []);

  const getNotificationStyle = (type: Notification['type']) => {
    switch (type) {
      case 'xp':
        return 'bg-gradient-to-r from-duo-gold to-duo-orange border-duo-gold';
      case 'gem':
        return 'bg-gradient-to-r from-duo-blue to-cyan-500 border-duo-blue';
      case 'level_up':
        return 'bg-gradient-to-r from-duo-green to-emerald-500 border-duo-green';
      case 'achievement':
        return 'bg-gradient-to-r from-duo-purple to-pink-500 border-duo-purple';
      case 'streak':
        return 'bg-gradient-to-r from-duo-orange to-red-500 border-duo-orange';
      case 'combo':
        return 'bg-gradient-to-r from-yellow-500 to-duo-orange border-yellow-500';
      case 'league':
        return 'bg-gradient-to-r from-duo-gold to-amber-500 border-duo-gold';
      case 'warning':
        return 'bg-gradient-to-r from-duo-red to-rose-600 border-duo-red';
      default:
        return 'bg-gray-700 border-gray-500';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            toast-enter p-4 rounded-xl border-l-4 shadow-xl
            ${getNotificationStyle(notification.type)}
          `}
        >
          <div className="flex items-center gap-3">
            {notification.icon && (
              <span className="text-2xl">{notification.icon}</span>
            )}
            <div>
              <p className="font-bold text-white">{notification.title}</p>
              {notification.message && (
                <p className="text-sm text-white/80">{notification.message}</p>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NotificationToast;
