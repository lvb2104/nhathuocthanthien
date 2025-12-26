# Nhà thuốc thân thiện

## Note

- Only check conditions in the 'layout.tsx' files, not in individual 'page.tsx' files.
- Only handle logic in hooks, render toasts in components
- Use server axios to call API in server side to boost performance
- Use client axios to call API in client side to make data fresh compared to server fetched data
- Use stale time to prevent refetching data too often
- Use initial data to prevent refetching data too often
- Use query client to invalidate queries after mutation

## Visual

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ Has cookies in memory
       │ Makes request with credentials: 'include'
       ↓
┌──────────────────┐         ┌─────────────┐
│  Next.js Server  │────────→│   Backend   │
│ (Node process)   │         │    API      │
└──────────────────┘         └─────────────┘
       ❌ No cookies attached
       (server doesn't know about browser cookies)
```

- Sign-in flow: Browser → Next.js proxy → Backend → Proxy forwards cookies → Browser receives refreshToken cookie on Next.js domain
- Refresh flow: NextAuth callback → getIncomingCookieHeader() → Now finds refreshToken cookie (same domain!) → Proxy forwards to backend → Success!

---
