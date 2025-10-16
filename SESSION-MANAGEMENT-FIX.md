# Supabase Session Configuration

## Session Timeout Fix

The admin portal was automatically logging out after a few minutes due to Supabase's default session timeout. This has been resolved with the following implementations:

### 1. **Session Manager Hook** (`src/hooks/use-session-manager.ts`)
- **Automatic Token Refresh**: Refreshes session tokens every 20 minutes
- **Keep-Alive Functionality**: Monitors user activity and refreshes tokens when needed
- **Activity Tracking**: Tracks mouse, keyboard, and scroll events to determine user activity
- **Smart Refresh**: Only refreshes when session is close to expiring (within 10 minutes)
- **Inactivity Handling**: Stops refreshing if user is inactive for more than 4 hours

### 2. **Enhanced Auth Provider** (`src/components/providers/auth-provider.tsx`)
- **Better Session Handling**: Improved auth state change listener
- **Extended Session Duration**: Longer session duration for admin users
- **Token Refresh Events**: Proper handling of `TOKEN_REFRESHED` events
- **Session Persistence**: Better session persistence across page reloads

### 3. **Admin Dashboard Integration** (`src/app/admin/dashboard/page.tsx`)
- **Session Monitoring**: Real-time session status monitoring
- **Visual Indicators**: Session status indicator in the header
- **Manual Refresh**: Manual session refresh button
- **Session Info Display**: Shows time until session expiry

## Configuration Details

### Session Manager Settings:
```typescript
{
  refreshInterval: 20 * 60 * 1000,    // Refresh every 20 minutes
  keepAliveInterval: 5 * 60 * 1000,   // Check every 5 minutes
  maxInactivity: 4 * 60 * 60 * 1000,  // Max 4 hours of inactivity
}
```

### Activity Tracking Events:
- `mousedown`, `mousemove`, `keypress`, `scroll`, `touchstart`, `click`

### Session Status Indicators:
- **Green**: Session has more than 30 minutes remaining
- **Yellow**: Session expires within 30 minutes
- **Red**: Session has expired

## How It Works

1. **User Activity Detection**: The system tracks user interactions with the page
2. **Automatic Refresh**: Every 5 minutes, the system checks if the session needs refreshing
3. **Smart Timing**: Sessions are refreshed when they're within 10 minutes of expiring
4. **Inactivity Protection**: If a user is inactive for 4+ hours, the session won't be refreshed
5. **Visual Feedback**: Users can see their session status and manually refresh if needed

## Benefits

- **No More Unexpected Logouts**: Admin users won't be logged out while actively using the system
- **Seamless Experience**: Automatic token refresh happens in the background
- **Security**: Sessions still expire after reasonable inactivity periods
- **Transparency**: Users can see their session status and take action if needed
- **Performance**: Efficient refresh timing prevents unnecessary API calls

## Testing

The session management system is now active and will:
- Automatically refresh tokens every 20 minutes
- Monitor user activity every 5 minutes
- Show session status in the admin dashboard header
- Allow manual session refresh
- Prevent unexpected logouts during active use

---

*This implementation ensures that admin users can work uninterrupted for extended periods while maintaining security through proper session management.*










