# Nhà thuốc thân thiện

## Note

- Only check conditions in the 'layout.tsx' files, not in individual 'page.tsx' files.
- Only handle logic in hooks, render toasts in components

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
