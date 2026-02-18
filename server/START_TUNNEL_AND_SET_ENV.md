# CC Avenue localhost callback setup (cloudflared)

You asked: *no long-running processes started by the assistant.*

So this file gives you the exact steps to run the tunnel yourself and paste the URL.

## 1) Start the backend (if not already)
In one terminal:

```bash
cd C:\Users\Poorav\OneDrive\Desktop\travel-website\server
node index.js
```

(Backend must be listening on http://localhost:5000)

## 2) Start a public HTTPS tunnel to localhost:5000
In a *separate* terminal:

```bash
C:\Users\Poorav\OneDrive\Desktop\cloudflared.exe tunnel --url http://localhost:5000
```

Cloudflared will print a URL like:

`https://random-words.trycloudflare.com`

Keep this terminal open.

## 3) Whitelist the tunnel URL in CC Avenue
In CC Avenue dashboard, add the domain:

`random-words.trycloudflare.com`

to the allowed/registered URLs for your merchant.

(Exact menu varies by account; it’s usually under **Settings → API/Integration → Redirect URLs / Allowed URLs**.)

## 4) Paste tunnel URLs into server/.env
Edit:

`C:\Users\Poorav\OneDrive\Desktop\travel-website\server\.env`

Set:

```env
CCAVENUE_REDIRECT_URL=https://random-words.trycloudflare.com/payment-response
CCAVENUE_CANCEL_URL=https://random-words.trycloudflare.com/payment-cancel
```

## 5) Restart backend
Stop `node index.js` and re-run it.

## 6) Test
On the frontend: Cart → Pay Reservation.

If CC Avenue still errors, check:
- You are using **prod keys** with `CCAVENUE_ENV=prod` (secure.ccavenue.com)
- Redirect URL is **https** and whitelisted
- No typos/extra spaces in Access Code / Working Key
