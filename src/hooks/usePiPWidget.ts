"use client"

import { useState, useCallback } from 'react';

export function usePiPWidget() {
  const [pipWindow, setPipWindow] = useState<Window | null>(null);

  const isSupported = typeof window !== 'undefined' && 'documentPictureInPicture' in window;

  const requestPiP = useCallback(async (width: number, height: number) => {
    if (!isSupported) {
      return null;
    }

    try {
      // @ts-expect-error - Document Picture-in-Picture API is not fully typed yet
      const win = await window.documentPictureInPicture.requestWindow({
        width,
        height,
      });

      // Copy all stylesheets to the PiP window so styling remains correct
      const styleSheets = Array.from(document.styleSheets);
      for (const styleSheet of styleSheets) {
        try {
          if (styleSheet.href) {
            const link = win.document.createElement('link');
            link.rel = 'stylesheet';
            link.href = styleSheet.href;
            win.document.head.appendChild(link);
          } else if (styleSheet.cssRules) {
            const style = win.document.createElement('style');
            Array.from(styleSheet.cssRules).forEach((rule) => {
              style.appendChild(win.document.createTextNode(rule.cssText));
            });
            win.document.head.appendChild(style);
          }
        } catch (e) {
          console.warn('Could not copy stylesheet', e);
        }
      }
      
      const styles = document.querySelectorAll('style');
      styles.forEach(style => {
        win.document.head.appendChild(style.cloneNode(true));
      });

      win.addEventListener('pagehide', () => {
        setPipWindow(null);
      });

      setPipWindow(win);
      return win;
    } catch (e) {
      console.error('Failed to open PiP window:', e);
      return null;
    }
  }, [isSupported]);

  const closePiP = useCallback(() => {
    if (pipWindow) {
      pipWindow.close();
      setPipWindow(null);
    }
  }, [pipWindow]);

  return { isSupported, pipWindow, requestPiP, closePiP };
}
