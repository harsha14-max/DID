'use client';

import { useEffect, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/components/providers/auth-provider';

interface SessionManagerOptions {
  refreshInterval?: number; // in milliseconds
  keepAliveInterval?: number; // in milliseconds
  maxInactivity?: number; // in milliseconds
}

export function useSessionManager(options: SessionManagerOptions = {}) {
  const { user } = useAuth();
  const refreshIntervalRef = useRef<NodeJS.Timeout>();
  const keepAliveIntervalRef = useRef<NodeJS.Timeout>();
  const lastActivityRef = useRef<number>(Date.now());
  const isRefreshingRef = useRef<boolean>(false);

  const {
    refreshInterval = 30 * 60 * 1000, // 30 minutes
    keepAliveInterval = 5 * 60 * 1000, // 5 minutes
    maxInactivity = 2 * 60 * 60 * 1000, // 2 hours
  } = options;

  // Track user activity
  const updateActivity = useCallback(() => {
    lastActivityRef.current = Date.now();
  }, []);

  // Refresh session token
  const refreshSession = useCallback(async () => {
    if (isRefreshingRef.current || !user) return;

    try {
      isRefreshingRef.current = true;
      console.log('Refreshing session token...');
      
      const { data, error } = await supabase.auth.refreshSession();
      
      if (error) {
        console.error('Session refresh failed:', error);
        // If refresh fails, the auth state change will handle logout
        return;
      }

      if (data.session) {
        console.log('Session refreshed successfully');
        console.log('New session expires at:', new Date(data.session.expires_at! * 1000));
      }
    } catch (error) {
      console.error('Error refreshing session:', error);
    } finally {
      isRefreshingRef.current = false;
    }
  }, [user]);

  // Keep alive functionality - refresh session if user is active
  const keepAlive = useCallback(async () => {
    if (!user) return;

    const now = Date.now();
    const timeSinceLastActivity = now - lastActivityRef.current;

    // If user has been inactive for too long, don't refresh
    if (timeSinceLastActivity > maxInactivity) {
      console.log('User inactive for too long, not refreshing session');
      return;
    }

    // Check if session is close to expiring (within 10 minutes)
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const expiresAt = session.expires_at! * 1000;
        const timeUntilExpiry = expiresAt - now;
        const tenMinutes = 10 * 60 * 1000;

        if (timeUntilExpiry < tenMinutes) {
          console.log('Session expires soon, refreshing...');
          await refreshSession();
        }
      }
    } catch (error) {
      console.error('Error checking session expiry:', error);
    }
  }, [user, maxInactivity, refreshSession]);

  // Set up activity tracking
  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const handleActivity = () => {
      updateActivity();
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity, true);
    });

    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity, true);
      });
    };
  }, [user, updateActivity]);

  // Set up automatic session refresh
  useEffect(() => {
    if (!user) {
      // Clear intervals when user logs out
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
      return;
    }

    console.log('Setting up session management for user:', user.email);

    // Set up periodic refresh
    refreshIntervalRef.current = setInterval(() => {
      refreshSession();
    }, refreshInterval);

    // Set up keep-alive
    keepAliveIntervalRef.current = setInterval(() => {
      keepAlive();
    }, keepAliveInterval);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
      }
      if (keepAliveIntervalRef.current) {
        clearInterval(keepAliveIntervalRef.current);
      }
    };
  }, [user, refreshInterval, keepAliveInterval, refreshSession, keepAlive]);

  // Manual refresh function
  const manualRefresh = useCallback(async () => {
    await refreshSession();
  }, [refreshSession]);

  // Get session info
  const getSessionInfo = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        const expiresAt = new Date(session.expires_at! * 1000);
        const timeUntilExpiry = expiresAt.getTime() - Date.now();
        
        return {
          expiresAt,
          timeUntilExpiry,
          isExpired: timeUntilExpiry <= 0,
          timeUntilExpiryMinutes: Math.floor(timeUntilExpiry / (1000 * 60)),
          sessionExists: true,
        };
      }
      
      return {
        expiresAt: null,
        timeUntilExpiry: 0,
        isExpired: true,
        timeUntilExpiryMinutes: 0,
        sessionExists: false,
      };
    } catch (error) {
      console.error('Error getting session info:', error);
      return {
        expiresAt: null,
        timeUntilExpiry: 0,
        isExpired: true,
        timeUntilExpiryMinutes: 0,
        sessionExists: false,
      };
    }
  }, []);

  return {
    refreshSession: manualRefresh,
    getSessionInfo,
    updateActivity,
  };
}
