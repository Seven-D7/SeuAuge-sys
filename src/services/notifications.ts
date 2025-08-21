// Push notification service for SeuAuge
import toast from 'react-hot-toast';

export interface NotificationData {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  data?: Record<string, any>;
  actions?: NotificationAction[];
  requireInteraction?: boolean;
  silent?: boolean;
  tag?: string;
  renotify?: boolean;
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

class NotificationService {
  private swRegistration: ServiceWorkerRegistration | null = null;
  private permission: NotificationPermission = 'default';

  constructor() {
    this.init();
  }

  private async init() {
    // Check if service workers and notifications are supported
    if (!('serviceWorker' in navigator) || !('Notification' in window)) {
      console.warn('Push notifications not supported');
      return;
    }

    // Get current permission status
    this.permission = Notification.permission;

    // Register service worker if not already registered
    try {
      this.swRegistration = await navigator.serviceWorker.register('/sw.js');
      console.log('Service Worker registered successfully');
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  }

  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.warn('Notifications not supported');
      return false;
    }

    if (this.permission === 'granted') {
      return true;
    }

    if (this.permission === 'denied') {
      console.warn('Notification permission denied');
      return false;
    }

    try {
      this.permission = await Notification.requestPermission();
      return this.permission === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }

  async showNotification(data: NotificationData): Promise<void> {
    // Check permission
    if (this.permission !== 'granted') {
      const hasPermission = await this.requestPermission();
      if (!hasPermission) {
        // Fallback to toast notification
        this.showToastFallback(data);
        return;
      }
    }

    // Show browser notification if service worker is available
    if (this.swRegistration) {
      try {
        await this.swRegistration.showNotification(data.title, {
          body: data.body,
          icon: data.icon || '/icons/icon-192.png',
          badge: data.badge || '/icons/badge-72.png',
          data: data.data,
          actions: data.actions,
          requireInteraction: data.requireInteraction || false,
          silent: data.silent || false,
          tag: data.tag,
          renotify: data.renotify || false,
          vibrate: [200, 100, 200], // Vibration pattern for mobile
        });
      } catch (error) {
        console.error('Error showing notification:', error);
        this.showToastFallback(data);
      }
    } else {
      // Fallback to regular browser notification
      try {
        const notification = new Notification(data.title, {
          body: data.body,
          icon: data.icon || '/icons/icon-192.png',
          badge: data.badge || '/icons/badge-72.png',
          data: data.data,
          requireInteraction: data.requireInteraction || false,
          silent: data.silent || false,
          tag: data.tag,
          renotify: data.renotify || false,
        });

        // Handle notification click
        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      } catch (error) {
        console.error('Error creating notification:', error);
        this.showToastFallback(data);
      }
    }
  }

  private showToastFallback(data: NotificationData): void {
    toast.success(`${data.title}: ${data.body}`, {
      duration: 5000,
      icon: data.icon ? `<img src="${data.icon}" alt="" style="width: 20px; height: 20px;" />` : '🔔',
    });
  }

  // Achievement-specific notification
  async showAchievementNotification(achievement: {
    title: string;
    description: string;
    icon: string;
    rarity: string;
    xpReward: number;
  }): Promise<void> {
    const rarityEmoji = {
      common: '🏆',
      rare: '⭐',
      epic: '💎',
      legendary: '👑'
    }[achievement.rarity] || '🏆';

    await this.showNotification({
      title: `${rarityEmoji} Conquista Desbloqueada!`,
      body: `"${achievement.title}" - +${achievement.xpReward} XP`,
      icon: '/icons/achievement-icon.png',
      tag: 'achievement',
      requireInteraction: true,
      data: {
        type: 'achievement',
        achievement: achievement
      },
      actions: [
        {
          action: 'view',
          title: 'Ver Detalhes',
          icon: '/icons/view-icon.png'
        },
        {
          action: 'share',
          title: 'Compartilhar',
          icon: '/icons/share-icon.png'
        }
      ]
    });
  }

  // Level up notification
  async showLevelUpNotification(newLevel: number, xpGained: number): Promise<void> {
    await this.showNotification({
      title: '🚀 Subiu de Nível!',
      body: `Parabéns! Você alcançou o nível ${newLevel} (+${xpGained} XP)`,
      icon: '/icons/level-up-icon.png',
      tag: 'level-up',
      requireInteraction: true,
      data: {
        type: 'level-up',
        level: newLevel,
        xp: xpGained
      }
    });
  }

  // Streak notification
  async showStreakNotification(streakDays: number): Promise<void> {
    const streakEmoji = streakDays >= 30 ? '🔥🔥🔥' : streakDays >= 7 ? '🔥🔥' : '🔥';
    
    await this.showNotification({
      title: `${streakEmoji} Sequência Incrível!`,
      body: `${streakDays} dias consecutivos! Continue assim!`,
      icon: '/icons/streak-icon.png',
      tag: 'streak',
      data: {
        type: 'streak',
        days: streakDays
      }
    });
  }

  // Daily reminder notification
  async showDailyReminder(): Promise<void> {
    await this.showNotification({
      title: '💪 Hora do Treino!',
      body: 'Que tal fazer suas atividades de hoje? Seu corpo agradece!',
      icon: '/icons/reminder-icon.png',
      tag: 'daily-reminder',
      data: {
        type: 'reminder'
      },
      actions: [
        {
          action: 'start-workout',
          title: 'Começar Treino',
          icon: '/icons/workout-icon.png'
        },
        {
          action: 'snooze',
          title: 'Lembrar Mais Tarde',
          icon: '/icons/snooze-icon.png'
        }
      ]
    });
  }

  // Goal completion notification
  async showGoalCompletionNotification(goalTitle: string): Promise<void> {
    await this.showNotification({
      title: '🎯 Meta Concluída!',
      body: `Parabéns! Você completou: "${goalTitle}"`,
      icon: '/icons/goal-icon.png',
      tag: 'goal-completion',
      requireInteraction: true,
      data: {
        type: 'goal-completion',
        goal: goalTitle
      }
    });
  }

  // Challenge invitation notification
  async showChallengeInvitation(challengeName: string, fromUser: string): Promise<void> {
    await this.showNotification({
      title: '⚔️ Desafio Recebido!',
      body: `${fromUser} te desafiou para: "${challengeName}"`,
      icon: '/icons/challenge-icon.png',
      tag: 'challenge-invitation',
      requireInteraction: true,
      data: {
        type: 'challenge',
        challenge: challengeName,
        from: fromUser
      },
      actions: [
        {
          action: 'accept',
          title: 'Aceitar',
          icon: '/icons/accept-icon.png'
        },
        {
          action: 'decline',
          title: 'Recusar',
          icon: '/icons/decline-icon.png'
        }
      ]
    });
  }

  // Schedule daily reminders
  async scheduleDailyReminders(): Promise<void> {
    if (!this.swRegistration) return;

    // Cancel existing reminders
    const notifications = await this.swRegistration.getNotifications({
      tag: 'daily-reminder'
    });
    
    notifications.forEach(notification => notification.close());

    // Schedule new reminders (this would typically be done server-side)
    // For now, we'll just set a simple timeout
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0); // 9 AM reminder

    const timeUntilReminder = tomorrow.getTime() - now.getTime();
    
    setTimeout(() => {
      this.showDailyReminder();
    }, timeUntilReminder);
  }

  // Check if notifications are supported
  isSupported(): boolean {
    return 'Notification' in window && 'serviceWorker' in navigator;
  }

  // Get current permission status
  getPermissionStatus(): NotificationPermission {
    return this.permission;
  }
}

// Create singleton instance
export const notificationService = new NotificationService();

// Export convenience functions
export const showAchievementNotification = (achievement: any) => 
  notificationService.showAchievementNotification(achievement);

export const showLevelUpNotification = (level: number, xp: number) => 
  notificationService.showLevelUpNotification(level, xp);

export const showStreakNotification = (days: number) => 
  notificationService.showStreakNotification(days);

export const requestNotificationPermission = () => 
  notificationService.requestPermission();

export default notificationService;
