"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useNotification } from "@/context/NotificationContext";

export default function AdminNotifications() {
  const { showNotification } = useNotification();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    try {
      const supabase = createClient();
      
      const channel = supabase
        .channel('admin-feedback-changes')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'feedback',
          },
          (payload) => {
            const data = payload.new as any;
            showNotification({
              title: "New Customer Feedback! ⭐",
              message: `${data.customer_name || 'Someone'} just left a ${data.rating}-star review.`,
              type: "success",
              duration: 8000,
            });
            
            // Dispatch a custom event so the Sidebar can update the unread count instantly
            window.dispatchEvent(new CustomEvent('admin-new-feedback'));
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn("Realtime feedback notifications disabled (Supabase not fully configured)");
    }
  }, [mounted, showNotification]);

  return null; // This is a logic-only component
}
