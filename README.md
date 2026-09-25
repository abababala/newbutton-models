# Newbutton Models — Setup Guide

This is your whole website: homepage, model board, and an admin dashboard for
adding/removing models. Follow these steps once. After that, you'll only
ever use the `/admin` dashboard.

## Step 1 — Put this on GitHub

1. Go to github.com, create a free account if you don't have one.
2. Click "New repository." Name it `newbutton-models` (or anything). Keep it Public.
3. On your computer, upload all these files into that repo — easiest way:
   on the repo page, click "uploading an existing file" and drag this whole
   folder in.

## Step 2 — Connect Netlify (free hosting)

1. Go to netlify.com, sign up free — sign up **with your GitHub account**,
   it's one click and links them automatically.
2. Click "Add new site" → "Import an existing project" → choose GitHub →
   select your `newbutton-models` repo.
3. Build settings: leave everything as default (this site has no build step
   for the pages themselves — Netlify will detect the config automatically).
4. Click Deploy. In under a minute you'll get a live URL like
   `random-name-123.netlify.app` — that's your site, live.

## Step 3 — Turn on the admin login (Decap CMS + GitHub)

The admin dashboard at `/admin` needs permission to save changes to your
GitHub repo on your behalf. This takes 2 minutes:

1. In Netlify: Site settings → Identity → click "Enable Identity."
2. Still in Identity settings, scroll to "Registration" → set to "Invite only"
   (so random people can't sign up).
3. Scroll to "Services" → "Git Gateway" → click "Enable Git Gateway." This is
   what lets the dashboard save your changes.
4. Go to the "Identity" tab (top of your site dashboard) → "Invite users" →
   enter your own email. Check your email, accept the invite, set a password.
5. Open `admin/config.yml` in this folder and change this line:
   ```
   repo: YOUR-GITHUB-USERNAME/YOUR-REPO-NAME
   ```
   to your actual GitHub username and repo name, e.g. `repo: allan123/newbutton-models`.
   Push that change back to GitHub (edit the file directly on github.com is fine).

## Step 4 — Point your Porkbun domain at Netlify

1. In Netlify: Site settings → Domain management → "Add a domain" →
   enter `newbuttonmodels.com`.
2. Netlify will show you DNS records to add (usually one line pointing to
   Netlify's servers).
3. Log into Porkbun → your domain → DNS → add the record Netlify gave you.
4. Takes anywhere from a few minutes to a few hours to go live. Netlify auto-adds
   free HTTPS once it's connected.

## Step 5 — Using it day to day (this is the part you'll actually do)

1. Go to `newbuttonmodels.com/admin` (or your `.netlify.app` URL + `/admin`
   until the domain is connected).
2. Log in with the email/password from Step 3.
3. Click "Models" → "New Model."
4. Fill in name, category, upload a photo, hit "Publish."
5. Wait about a minute — the site rebuilds itself automatically and the new
   model appears on the homepage. No code, no GitHub, no me needed.
6. To remove a model (contract expired, etc.): open their entry in the
   dashboard, click delete, confirm. Same automatic rebuild.

## If something doesn't show up

- Changes take ~30-60 seconds to go live after publishing (Netlify is
  rebuilding the site). Refresh after a minute.
- If the homepage shows 4 placeholder models you don't recognize (Amara,
  Tomiwa, Zainab, Kwame) — that's just the fallback until your first real
  model is published through /admin. Totally normal on first launch.
