# Development Guide

## Why You Keep Having to Clear Cache

### The Problem
During development, you might notice that changes don't appear immediately, requiring you to clear browser cache or history. This happens due to:

1. **Aggressive Static Asset Caching**: Next.js caches static files (JS, CSS) with long expiration times for performance
2. **React Query Caching**: API responses are cached for 5-10 minutes
3. **Browser Caching**: Browsers cache resources based on HTTP headers
4. **Service Workers**: If any are registered, they can cache old versions
5. **Next.js Build Cache**: The `.next` folder caches compiled code

### The Solution (Already Implemented)

We've configured the app to **disable aggressive caching in development mode**:

- ✅ **Static Assets**: No cache headers in development
- ✅ **Images**: No cache TTL in development  
- ✅ **React Query**: Instant stale time in development (0ms)
- ✅ **API Cache**: Reduced to 1 minute in development

### Quick Fixes

#### Option 1: Hard Refresh (Recommended)
- **Chrome/Edge**: `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- **Firefox**: `Ctrl+F5` (Windows/Linux) or `Cmd+Shift+R` (Mac)
- **Safari**: `Cmd+Option+R`

#### Option 2: Clear Next.js Cache
```bash
# Stop the dev server, then:
rm -rf .next
npm run dev
```

#### Option 3: Clear Browser Cache (Nuclear Option)
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

#### Option 4: Use Incognito/Private Mode
- Always shows the latest code (no cache)
- Good for testing fresh user experience

### Development Best Practices

1. **Use Hard Refresh** instead of normal refresh when testing changes
2. **Restart Dev Server** after major config changes:
   ```bash
   # Stop server (Ctrl+C), then:
   npm run dev
   ```
3. **Clear `.next` folder** if you see weird behavior:
   ```bash
   rm -rf .next && npm run dev
   ```
4. **Use React Query DevTools** to see cached data and clear it if needed
5. **Check Network Tab** in DevTools to see if files are being cached

### When to Clear Cache

✅ **Clear cache when:**
- Changes to `next.config.ts` or other config files
- Changes to environment variables
- Installing/updating dependencies
- Seeing old code that should be updated
- API responses seem stale

❌ **Don't need to clear cache for:**
- Component code changes (should hot-reload)
- Style changes (should hot-reload)
- Most TypeScript changes (should hot-reload)

### Troubleshooting

#### Changes Not Appearing?
1. **Check if dev server restarted** - Look for "compiled successfully" message
2. **Hard refresh** the page (Ctrl+Shift+R)
3. **Check browser console** for errors
4. **Clear `.next` folder** and restart:
   ```bash
   rm -rf .next && npm run dev
   ```

#### Still Seeing Old Code?
1. **Check if you're in production mode**:
   ```bash
   # Make sure you're running:
   npm run dev
   # Not:
   npm run build && npm start
   ```
2. **Clear browser cache completely**
3. **Try incognito mode** to rule out browser extensions

### Production vs Development

- **Development**: No caching, instant updates
- **Production**: Aggressive caching for performance (30 days for static assets)

The caching configuration automatically switches based on `NODE_ENV`.

### Additional Tips

1. **Disable Browser Extensions** during development (some can interfere)
2. **Use Chrome DevTools** "Disable cache" checkbox (only works when DevTools is open)
3. **Check React Query DevTools** to see cached queries and manually invalidate if needed
4. **Monitor Network Tab** to see cache headers and verify files are fresh

### Quick Reference

```bash
# Clear Next.js cache
rm -rf .next

# Clear npm cache (if npm issues)
npm cache clean --force

# Fresh start
rm -rf .next node_modules package-lock.json
npm install
npm run dev
```

---

**Note**: With the new configuration, you should rarely need to clear cache in development. If you still experience issues, it might be a browser extension or service worker issue.

