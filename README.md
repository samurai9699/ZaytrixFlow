# 💼 ZaytrixFlow

ZaytrixFlow is an **Automated Invoice Reminder** and **Late-Payment Reporter** built specifically for **freelancers** and **micro-agencies**.

## 🚨 The Problem

Freelancers lose time and money chasing overdue payments. Manual spreadsheets and disorganized reminders often lead to:
- Forgotten invoices
- Awkward client follow-ups
- Unpredictable cash flow

Popular accounting tools like FreshBooks or QuickBooks are often **too expensive** and **feature-bloated** for simple needs.

---

## ✅ The Solution

ZaytrixFlow automates your freelance billing workflow:

- 🧠 **Smart Invoice Reminders**  
  Automatically emails clients when payments are due or late.

- 📈 **FAA (Freelance Accounts Aging) Reports**  
  Visual breakdown of outstanding payments over 30, 60, and 90+ days.

- 🕵️ **Late Payment Tracking**  
  Keep a history of which clients delay payments — perfect for vetting future work.

- 📊 **Clean Dashboard UI**  
  Focused, minimalist interface tailored for solo workers.

---

## 🧑‍💻 Ideal Users

- Freelancers (Designers, Developers, Consultants)
- Tiny agencies (less than 5 people)
- Remote workers in emerging markets where debt collection is costly

---

## 🛠️ Tech Stack

- **Frontend**: React.js, TailwindCSS  
- **Backend**: Supabase Edge Functions  
- **Database**: Supabase PostgreSQL with Row-Level Security (RLS)  
- **Payments**: Stripe (Subscriptions + One-time purchases)

---

## 💳 Stripe Integration

ZaytrixFlow uses **Stripe Checkout** to offer secure, global payment handling:

- 🧾 Monthly Plans:
  - **Pro** – $8/mo: For growing freelancers
  - **Premium** – $15/mo: For power users needing advanced reporting

- 🔁 Handles:
  - Subscription lifecycle
  - One-time payments
  - Webhook syncing for real-time status updates

- 🛡️ Built with best practices:
  - JWT-secured endpoints
  - Webhook signature verification
  - Supabase RLS for secure data access

---

## 🔐 Supabase Integration

- 🔄 Real-time database syncing of Stripe events
- 🔐 Row-Level Security isolates user data
- 🔗 Stripe-Supabase mapping via custom tables:
  - `stripe_customers`
  - `stripe_subscriptions`
  - `stripe_orders`

- ✅ Functions:
  - `/stripe-checkout` – Creates checkout sessions with Stripe
  - `/stripe-webhook` – Handles Stripe events securely

---

## 🚀 User Flow

1. User signs up and selects a plan
2. Redirected to secure Stripe Checkout
3. On success:
   - Supabase stores and syncs payment data
   - Dashboard shows subscription status with 👑 crown badge
4. App unlocks full features based on plan

---

## 🧪 Testing

- Stripe Test Mode supported
- Use test cards like `4242 4242 4242 4242`
- Supabase logs show real-time webhook + session activity

---

## 📅 Coming Soon

- Invoicing Templates
- Custom Reminder Schedules
- Integration with PayPal & QuickBooks
- Stripe Smart Retries for failed payments

---



## 📬 Contact

For questions or feedback, contact **Sam Muriithi Wangui** at `samuelmuriithi965@gmail.com`

---