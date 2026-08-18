# Qentrax Global landing page

A responsive static landing page for Qentrax Global. It has no build step and no third-party code dependency beyond the optional Google Fonts request.

## Preview locally

Open `index.html` in a browser, or serve this folder with any simple local web server.

## Deploy to Cloudflare Pages

1. Create a GitHub repository and upload this folder's contents to it.
2. In Cloudflare, go to **Workers & Pages → Create → Pages → Connect to Git**.
3. Select the repository. Choose **No framework**; leave the build command blank and set the output directory to `/`.
4. Deploy. Cloudflare will give you a temporary `pages.dev` address to test.
5. In the Pages project, open **Custom domains** and add `qentraxglobal.com` and `www.qentraxglobal.com`.
6. Apply the DNS records Cloudflare shows. If the domain remains registered at Spaceship, add those records in its DNS panel. Keep all existing email-related MX, SPF and DKIM records unchanged.

## Before publishing

The source copy intentionally preserves the supplied claims: `$80,000`, `over $75,000`, and `3-for-1`. A review reminder is kept in the HTML source and this README, not shown to visitors. Confirm all employment-cost calculations, comparisons and offer terms against current Australian requirements and your actual pricing before publishing.

## Make the booking form send real emails

The form uses a Cloudflare Pages Function at `/api/inquiry`. It deliberately shows success only after the email provider has accepted the inquiry.

1. Create a [Resend](https://resend.com) account and verify `qentraxglobal.com` as a sending domain.
2. In Cloudflare Pages, open the deployed project’s **Settings → Environment variables** and add:
   - `RESEND_API_KEY` — your Resend API key (mark as secret)
   - `LEAD_RECIPIENT` — `admin@qentraxglobal.com`
   - `SENDER_EMAIL` — `Qentrax Website <enquiries@send.qentraxglobal.com>` (the verified Resend sending subdomain).
3. Redeploy the site. Cloudflare will automatically deploy the function in `functions/api/inquiry.js`.

Until these are configured, the form clearly reports that email delivery is not configured; it does not pretend the lead was sent.

## Replace placeholders

All booking buttons currently open an email to `admin@qentraxglobal.com`. Replace these `mailto:` links with a Calendly or other booking URL once available.
