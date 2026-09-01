# Capture Inbox setup

The direct Capture Inbox address is:

```text
https://main.d39wc75md4exup.amplifyapp.com/#capture
```

Sign in once on each device. Ogham keeps the Cognito refresh token locally so ordinary visits can open directly into Capture without loading the lesson library first.

## Windows and Chrome

The quickest desktop setup is a small Chrome app window with a keyboard shortcut:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/create-capture-shortcut.ps1 -AppUrl "https://main.d39wc75md4exup.amplifyapp.com/"
```

This creates an **Ogham Capture** shortcut on the desktop, opens `#capture` in a minimal Chrome window, and assigns `Ctrl+Alt+C`. Windows may require the desktop shortcut to remain in place for its hotkey to work. If that key is already taken, open the shortcut's Properties and choose a different Shortcut key.

You can also bookmark the direct Capture address in any browser. The input receives focus automatically, so the normal flow is: open, paste or type, press Enter, close.

## iPhone

1. Open the direct Capture address in Safari.
2. Sign in and confirm the Capture Inbox appears.
3. Tap **Share**, then **Add to Home Screen**.
4. Name it **Ogham Capture** and tap **Add**.

The new Home Screen icon opens the capture page directly. iOS may treat the Home Screen version as its own browser session, so the first launch may ask you to sign in once more.

## When the connection is poor

New text is saved on the device before Ogham calls AWS. If the call fails, the item is marked **Pending** and is retried on refresh, the next visit, or when the device reconnects. Keep the browser's site data intact until the item changes to **Saved to AWS**.

## Future additions

Translation, tagging, and review scheduling can be layered onto each stored capture later without changing the quick-entry address. The current first version intentionally stores the original text and timestamps only.
