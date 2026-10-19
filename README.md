# Debt Advisors Canada

Debt Advisors Canada is a responsive public website for Canadians exploring debt relief options. It provides information about the assessment process, debt options, common questions, and a free multi-step debt assessment form.

The site is built with React, Vite, Tailwind CSS 4, and custom CSS. Supabase stores assessment submissions and runs the submission Edge Function. Brevo sends internal notification emails when a submission is received.

## Features

- Responsive landing page with service information, process overview, debt options, FAQs, contact links, and required service disclosures.
- Four-step assessment form collecting contact details and information about debt, homeownership, age range, and prior filings.
- Assessment validation and submission through the Supabase `submit-assessment` Edge Function.
- Secure assessment storage in the Supabase `assessments` table. Browser clients do not have direct read or write access to this table; the Edge Function validates submissions and writes using the server-side service role.
- Brevo notification emails with the assessment details and the prospect set as the reply-to contact.
- First-touch and latest-touch campaign attribution, including UTM parameters, common ad click IDs, landing page, and referrer. Attribution is stored with the assessment and included in the notification email.

## Requirements

- Node.js 20 or newer and npm.
- A Supabase project.
- A Brevo account with transactional email enabled and a verified sender address or domain.
- Supabase CLI access to the target project. The CLI is included as a project dependency and can be run with `npx supabase`.

## Run locally

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create `.env.local` in the project root with the public Supabase project URL and anon key:

   ```dotenv
   VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
   ```

   These are browser-facing Supabase values. Never put the Supabase service role key or Brevo API key in a `VITE_` variable or in frontend code.

3. Start the Vite development server:

   ```sh
   npm run dev
   ```

4. Create a production build when needed:

   ```sh
   npm run build
   ```

   Vite writes the static production site to `dist/`. You can serve that build locally with `npm run preview`.

## Supabase setup

From the project root, authenticate with the Supabase CLI and link this folder to your Supabase project:

```sh
npx supabase login
npx supabase link --project-ref YOUR_PROJECT_REF
```

Apply the database migrations in `supabase/migrations/`:

```sh
npx supabase db push
```

The migrations create the `public.assessments` table and add its `attribution` JSON column. Row Level Security is enabled, and the `anon` and `authenticated` roles are denied direct access. Submissions should go through the Edge Function.

## Brevo email setup

In Brevo, enable transactional email and verify the sender email address or domain. Then set the following values as Supabase Edge Function secrets. Do not commit the values to this repository.

| Secret | Purpose |
| --- | --- |
| `BREVO_API_KEY` | Brevo API key used by the Edge Function to send transactional email. |
| `BREVO_SENDER_EMAIL` | Verified sender email address in Brevo. |
| `ASSESSMENT_NOTIFICATION_EMAIL` | Primary internal recipient for new assessment notifications. |
| `ASSESSMENT_EXTRA_NOTIFICATION_EMAILS` | Optional additional recipients, separated by commas. |
| `ALLOWED_ORIGIN` | Production website origin allowed to call the Edge Function, such as `https://www.example.ca`. |

For example, in PowerShell (replace each placeholder with the actual value):

```powershell
npx supabase secrets set BREVO_API_KEY=YOUR_BREVO_API_KEY BREVO_SENDER_EMAIL=YOUR_VERIFIED_SENDER_EMAIL ASSESSMENT_NOTIFICATION_EMAIL=YOUR_TEAM_EMAIL ASSESSMENT_EXTRA_NOTIFICATION_EMAILS=ANOTHER_RECIPIENT ALLOWED_ORIGIN=https://www.example.ca
```

Supabase provides `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` to deployed Edge Functions. Do not manually expose or add the service role key to the frontend.

Deploy the assessment submission function:

```sh
npx supabase functions deploy submit-assessment
```

The function stores a valid submission first, then requests a Brevo email. If Brevo is unavailable or rejects the email, the submission remains stored in Supabase; check the function logs for the email error. Ensure the sender is validated in Brevo and each notification recipient is correct.

## Campaign attribution

The site reads these parameters from the landing URL:

- UTM: `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`
- Click IDs: `gclid`, `fbclid`, `msclkid`
- Context: landing page and referring page

First-touch and latest-touch attribution are retained in the browser session and submitted with the assessment. For a local example, open a URL like:

```text
http://localhost:5173/?utm_source=facebook&utm_medium=paid_social&utm_campaign=fall_relief
```

Attribution is persisted in `assessments.attribution` and included in the internal Brevo notification.

## Frontend deployment

Build the site with `npm run build` and deploy the generated `dist/` directory to a static hosting provider such as Vercel or Netlify. Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in the hosting provider's environment settings, then rebuild and redeploy. Set the Supabase `ALLOWED_ORIGIN` secret to the exact deployed site origin and redeploy the Edge Function after changing function code or its deployment configuration.

## Project layout

```text
src/
  App.jsx                 Landing page and assessment form
  main.jsx                React application entry point
  style.css               Tailwind import and site styles
  lib/supabase.js         Supabase client and assessment invocation
  lib/attribution.js      UTM and click ID capture
supabase/
  functions/submit-assessment/  Assessment validation, storage, and Brevo email
  migrations/                  Assessment table and attribution schema
```

## Privacy and service disclosure

Assessment submissions contain personal and financial information. Limit access to the Supabase project and notification inbox to authorized team members. The site states that Debt Advisors Canada provides assessment and referral services and is not a Licensed Insolvency Trustee firm; review the on-site disclosure and privacy terms before publishing changes.
