"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

type NotificationType = "success" | "info" | "warning" | "error";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (notification: Omit<Notification, "id">) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const showNotification = useCallback((notif: Omit<Notification, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { ...notif, id }]);
    
    const duration = notif.duration ?? 5000;
    if (duration > 0) {
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, duration);
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-2xl shadow-xl border backdrop-blur-md transition-all duration-300 translate-y-0 opacity-100 ${
              n.type === "success" ? "bg-emerald-50/95 border-emerald-200 text-emerald-900 dark:bg-emerald-900/90 dark:border-emerald-800 dark:text-emerald-50" :
              n.type === "error" ? "bg-red-50/95 border-red-200 text-red-900 dark:bg-red-900/90 dark:border-red-800 dark:text-red-50" :
              n.type === "warning" ? "bg-amber-50/95 border-amber-200 text-amber-900 dark:bg-amber-900/90 dark:border-amber-800 dark:text-amber-50" :
              "bg-white/95 border-gray-200 text-gray-900 dark:bg-neutral-900/90 dark:border-neutral-700 dark:text-white"
            }`}
          >
            {n.type === "success" && <span className="text-xl">✅</span>}
            {n.type === "error" && <span className="text-xl">🚨</span>}
            {n.type === "warning" && <span className="text-xl">⚠️</span>}
            {n.type === "info" && <span className="text-xl">💡</span>}
            
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm leading-tight mb-1">{n.title}</p>
              <p className="text-xs opacity-90 leading-snug">{n.message}</p>
            </div>
            <button
              onClick={() => removeNotification(n.id)}
              className="p-1 opacity-50 hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
