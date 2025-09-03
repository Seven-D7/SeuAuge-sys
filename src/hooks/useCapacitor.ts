import { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Keyboard } from '@capacitor/keyboard';
import { Network } from '@capacitor/network';
import { StatusBar } from '@capacitor/status-bar';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

interface CapacitorState {
  isNative: boolean;
  platform: string;
  isOnline: boolean;
  keyboardHeight: number;
  appState: 'active' | 'background';
}

export const useCapacitor = () => {
  const [state, setState] = useState<CapacitorState>({
    isNative: Capacitor.isNativePlatform(),
    platform: Capacitor.getPlatform(),
    isOnline: true,
    keyboardHeight: 0,
    appState: 'active'
  });

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;

    // Initialize status bar
    StatusBar.setStyle({ style: 'DARK' });
    StatusBar.setBackgroundColor({ color: '#0f172a' });

    // Network status
    const initNetwork = async () => {
      const status = await Network.getStatus();
      setState(prev => ({ ...prev, isOnline: status.connected }));
    };

    initNetwork();

    // Listeners
    const networkListener = Network.addListener('networkStatusChange', (status) => {
      setState(prev => ({ ...prev, isOnline: status.connected }));
    });

    const keyboardShowListener = Keyboard.addListener('keyboardWillShow', (info) => {
      setState(prev => ({ ...prev, keyboardHeight: info.keyboardHeight }));
      document.body.classList.add('keyboard-open');
    });

    const keyboardHideListener = Keyboard.addListener('keyboardWillHide', () => {
      setState(prev => ({ ...prev, keyboardHeight: 0 }));
      document.body.classList.remove('keyboard-open');
    });

    const appStateListener = App.addListener('appStateChange', ({ isActive }) => {
      setState(prev => ({ ...prev, appState: isActive ? 'active' : 'background' }));
    });

    // Handle back button
    const backButtonListener = App.addListener('backButton', ({ canGoBack }) => {
      if (!canGoBack) {
        App.exitApp();
      } else {
        window.history.back();
      }
    });

    return () => {
      networkListener.remove();
      keyboardShowListener.remove();
      keyboardHideListener.remove();
      appStateListener.remove();
      backButtonListener.remove();
    };
  }, []);

  // Utility functions
  const triggerHaptic = async (style: ImpactStyle = ImpactStyle.Light) => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Haptics.impact({ style });
      } catch (error) {
        console.warn('Haptic feedback not available:', error);
      }
    }
  };

  const hideKeyboard = async () => {
    if (Capacitor.isNativePlatform()) {
      try {
        await Keyboard.hide();
      } catch (error) {
        console.warn('Keyboard hide failed:', error);
      }
    }
  };

  const setStatusBarStyle = async (style: 'LIGHT' | 'DARK') => {
    if (Capacitor.isNativePlatform()) {
      try {
        await StatusBar.setStyle({ style });
      } catch (error) {
        console.warn('Status bar style change failed:', error);
      }
    }
  };

  return {
    ...state,
    triggerHaptic,
    hideKeyboard,
    setStatusBarStyle,
  };
};

export default useCapacitor;