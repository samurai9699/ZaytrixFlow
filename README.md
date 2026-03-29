# ZaytrixFlow

ZaytrixFlow is an **Automated Invoice Reminder** and **Late-Payment Reporter** built specifically for **freelancers** and **micro-agencies**.

## 🎯 Live Demo

Visit the live application to explore the full feature set:
- **Dashboard**: Real-time invoice tracking and analytics
- **Analytics**: Revenue forecasting, client risk scoring, and payment trends
- **Payments**: Secure Stripe integration for subscriptions
- **Reminders**: Automated email workflows for payment collection

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

- **Frontend**: React 18, TypeScript, TailwindCSS, Framer Motion
- **Backend**: Supabase Edge Functions (Deno)
- **Database**: Supabase PostgreSQL with Row-Level Security (RLS)
- **Payments**: Stripe (Subscriptions + Webhooks)
- **Deployment**: Vercel (Frontend), Supabase (Backend + Database)
- **Additional**: D3.js/Recharts (Analytics), jsPDF (Reports), FullCalendar (Reminders)

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

## 🏗️ Architecture Highlights

### Frontend Features
- **Dashboard**: Responsive grid layout with drag-and-drop widgets
- **Analytics**: Advanced revenue forecasting with statistical models
- **Client Management**: Track payment history and risk scoring
- **Invoice Management**: Create, edit, preview, and export invoices
- **Reminder System**: Calendar-based reminder scheduling with templates
- **Dark Mode**: Full theme support across all components

### Backend Services
- **Edge Functions**: 4 deployed functions handling payments and emails
- **Email Service**: Automated reminders and notifications
- **Stripe Webhooks**: Real-time subscription lifecycle management
- **Revenue Forecasting**: Predictive analytics with confidence intervals
- **PDF Generation**: Invoice exports with custom formatting

### Database
- **14 Tables**: Users, invoices, clients, subscriptions, reminders, and more
- **Row-Level Security**: Multi-tenant data isolation at database level
- **Relationships**: Proper foreign keys and cascading updates
- **Indexes**: Optimized queries for analytics and reporting

---

## 🔧 Project Structure

```
src/
├── components/          # React components (80+)
│   ├── dashboard/      # Main dashboard and widgets
│   ├── invoices/       # Invoice management
│   ├── reminders/      # Reminder system
│   ├── settings/       # User settings
│   └── auth/           # Authentication flows
├── contexts/           # React Context API (Auth, Theme, Notifications)
├── lib/               # Core utilities and Supabase client
├── services/          # Business logic (email, forecasting)
├── utils/             # Helpers (PDF generation, debounce)
└── types/             # TypeScript type definitions

supabase/
├── migrations/        # 14 database migrations
└── functions/         # 4 Edge Functions (email, invoicing, payments)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account (database and Edge Functions)
- Stripe account (payment processing)

### Installation

```bash
npm install
npm run dev
```

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🧪 Testing

- **Stripe Test Mode**: Use test card `4242 4242 4242 4242`
- **Database**: Full RLS policies protect test data
- **Edge Functions**: All 4 functions deployed and active

---

## 📈 Key Metrics

- **80+ React Components**: Fully typed with TypeScript
- **14 Database Tables**: Multi-tenant architecture with RLS
- **4 Edge Functions**: Serverless payment and email workflows
- **Revenue Forecasting**: ML-inspired statistical prediction engine
- **Analytics Dashboard**: Real-time data visualization with D3/Recharts

---

## 📝 License

This project is built for demonstrating full-stack SaaS development capabilities.

---

## 📬 Contact

For questions or feedback, contact **Sam Muriithi Wangui** at `samuelmuriithi965@gmail.com`

---