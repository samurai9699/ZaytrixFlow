interface HelpCategory {
    id: string;
    name: string;
    description: string;
    faqs: {
        question: string;
        answer: string;
    }[];
}

export const HELP_CATEGORIES: HelpCategory[] = [
    {
        id: "getting-started",
        name: "Getting Started",
        description: "Learn the basics of using ZaytrixFlow for your freelance business",
        faqs: [
            {
                question: "How do I create an account?",
                answer: "Creating an account is simple! Click the 'Sign Up' button, enter your email and password, and complete your profile information. You'll need to verify your email address before you can start using ZaytrixFlow."
            },
            {
                question: "What are the system requirements?",
                answer: "ZaytrixFlow is a web-based application that works on any modern browser (Chrome, Firefox, Safari, Edge). There's no need to install any software - just sign in and start using it!"
            },
            {
                question: "Is there a free trial?",
                answer: "Yes! We offer a 14-day free trial with full access to all features. No credit card is required to start your trial."
            }
        ]
    },
    {
        id: "invoicing",
        name: "Invoicing",
        description: "Everything you need to know about creating and managing invoices",
        faqs: [
            {
                question: "How do I create an invoice?",
                answer: "Creating an invoice is simple! From your dashboard, click the 'New Invoice' button. Fill in your client's details, add line items, and customize the payment terms. You can also save invoice templates for future use."
            },
            {
                question: "Can I customize invoice templates?",
                answer: "Yes! You can fully customize your invoice templates with your logo, brand colors, and preferred layout. Go to Settings > Invoice Templates to create and manage your templates."
            },
            {
                question: "How do I send recurring invoices?",
                answer: "To set up recurring invoices, create a regular invoice first, then click the 'Make Recurring' button. You can set the frequency (weekly, monthly, etc.) and the duration of the recurring series."
            },
            {
                question: "Can I accept different currencies?",
                answer: "Yes! ZaytrixFlow supports multiple currencies. When creating an invoice, you can select the currency from the dropdown menu. Exchange rates are updated daily."
            }
        ]
    },
    {
        id: "payments",
        name: "Payments",
        description: "Learn about payment processing, tracking, and management",
        faqs: [
            {
                question: "What payment methods are supported?",
                answer: "We support major credit cards, PayPal, bank transfers (ACH/SEPA), and cryptocurrency payments through our integrations with Stripe and other payment processors."
            },
            {
                question: "How long does it take to receive payments?",
                answer: "Processing times vary by payment method: Credit cards typically process in 1-2 business days, PayPal is instant, and bank transfers can take 2-5 business days."
            },
            {
                question: "Are there any transaction fees?",
                answer: "Transaction fees vary by payment method and your subscription plan. Check our pricing page for detailed fee information. Premium plans include reduced transaction fees."
            }
        ]
    },
    {
        id: "reminders",
        name: "Reminders",
        description: "Configure and manage payment reminders",
        faqs: [
            {
                question: "How do I set up payment reminders?",
                answer: "Navigate to the 'Reminders' section in your dashboard. You can create custom reminder schedules for each invoice or use our smart templates. Set the frequency, timing, and customize the message for each reminder."
            },
            {
                question: "Can I customize reminder messages?",
                answer: "Yes! You can fully customize reminder messages using our template editor. Add your brand voice, include specific payment instructions, and use variables like {{client_name}} and {{amount}} for personalization."
            },
            {
                question: "How do automatic reminders work?",
                answer: "Automatic reminders are sent based on your configured schedule. The system checks payment status daily and sends reminders according to your settings. You can set different reminder frequencies for different payment stages."
            }
        ]
    },
    {
        id: "account-settings",
        name: "Account Settings",
        description: "Manage your account, profile, and preferences",
        faqs: [
            {
                question: "How do I update my profile?",
                answer: "Go to Settings > Profile to update your personal information, business details, and contact preferences. Don't forget to click 'Save Changes' after making updates."
            },
            {
                question: "How do I change my password?",
                answer: "Go to Settings > Security to change your password. You'll need to enter your current password and choose a new one. We recommend using a strong password with a mix of letters, numbers, and symbols."
            },
            {
                question: "Can I have multiple users on my account?",
                answer: "Yes! Premium plans support multiple user accounts with different permission levels. Go to Settings > Team Members to invite new users and manage their access rights."
            }
        ]
    },
    {
        id: "integrations",
        name: "Integrations",
        description: "Connect ZaytrixFlow with your favorite tools",
        faqs: [
            {
                question: "What apps can I integrate with?",
                answer: "ZaytrixFlow integrates with popular accounting software (QuickBooks, Xero), payment processors (Stripe, PayPal), and project management tools (Asana, Trello). Check our integrations page for the full list."
            },
            {
                question: "How do I set up integrations?",
                answer: "Go to Settings > Integrations, choose the app you want to connect, and follow the authentication steps. Most integrations can be set up in just a few clicks."
            },
            {
                question: "Is there an API available?",
                answer: "Yes! We offer a RESTful API for custom integrations. Visit our Developer Portal for API documentation, SDKs, and integration guides."
            }
        ]
    }
]; 