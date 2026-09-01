# Capture Inbox setup

The direct Capture Inbox address is:

```text
https://main.d39wc75md4exup.amplifyapp.com/#capture
```

Sign in once on each device. Ogham keeps the Cognito refresh token locally so ordinary visits can open directly into Capture without loading the lesson library first.

## Windows and Chrome

### Screen OCR hotkey

`Ctrl+Alt+C` now launches **Ogham Screen Capture**:

1. The screen darkens and the pointer becomes a crosshair.
2. Drag a box around the French text.
3. Windows recognizes the text locally and copies it to the clipboard.
4. Ogham Capture opens in Chrome and pastes the text into the focused box.
5. Review the text, then press Enter to save it to AWS.

Press Escape while the screen is darkened to cancel. The screenshot is never uploaded or stored; only the recognized text reaches Ogham after you choose to save it. If the first use shows the Ogham sign-in page, sign in, then press `Ctrl+V` once—the recognized text remains on the clipboard.

The installed helper lives at `%LOCALAPPDATA%\Ogham\OghamScreenCapture.exe`. Its source and repeatable install script live in `tools/OghamScreenCapture/` and `scripts/install-screen-capture.ps1`.

### Direct Capture shortcut

The separate **Ogham Capture** desktop shortcut still opens the inbox directly without OCR. It no longer owns the hotkey, avoiding a conflict with Screen Capture. It can be recreated with:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/create-capture-shortcut.ps1 -AppUrl "https://main.d39wc75md4exup.amplifyapp.com/"
```

The input receives focus automatically, so its normal flow is: open, paste or type, press Enter, close.

You can also bookmark the direct Capture address in any browser.

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
