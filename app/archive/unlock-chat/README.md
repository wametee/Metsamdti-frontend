# Unlock Chat Components (Archived)

## Overview

These components were archived for future use when payment integration is implemented. They provide the UI for users to unlock chat functionality through payment.

## Components

### `UnlockChat.tsx`
- Location: `components/archive/unlock-chat/UnlockChat.tsx`
- Purpose: Displays the unlock chat page with payment CTA
- Features:
  - Match illustration
  - Payment prompt
  - Google Translate support
  - User header integration

### `page.tsx`
- Location: `app/archive/unlock-chat/page.tsx`
- Purpose: Next.js page route for unlock chat
- Route: `/unlock-chat` (when restored)

## Restoration Instructions

1. **Move UnlockChat component:**
   ```bash
   mv components/archive/unlock-chat/UnlockChat.tsx components/user/UnlockChat.tsx
   ```

2. **Restore unlock-chat page:**
   ```bash
   mv app/archive/unlock-chat/page.tsx app/unlock-chat/page.tsx
   ```

3. **Update imports:**
   - Update import in `app/unlock-chat/page.tsx` to point to `@/components/user/UnlockChat`
   - Update any references to `/unlock-chat` route

4. **Integrate payment flow:**
   - Connect to payment processing API
   - Update `handleUnlockChat` in `History.tsx` to navigate to unlock-chat
   - Update `Chats.tsx` to show unlock prompt for unpaid matches
   - Update dashboard stats to include `unlockedChats` field

5. **Update database:**
   - Ensure `matches` table has `paid` and `chat_window_start/end` fields
   - Update chat access logic to check payment status

## Related Files

- `components/dashboard/History.tsx` - Contains unlock chat button (currently disabled)
- `components/dashboard/Chats.tsx` - Main chat interface
- `app/payment/page.tsx` - Payment processing page
- `lib/api/auth.ts` - Dashboard stats API (may need `unlockedChats` field)

## Notes

- These components were removed when implementing free real-time chat
- They will be needed when implementing paid chat windows
- Payment integration should be done before restoration

