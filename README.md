This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

```bash
my-islamic-app/
├── public/                  # Static assets (images, SVGs, fonts)
│   ├── icons/
│   └── images/
├── src/                     # Main source directory
│   ├── app/                 # App Router (Pages & Routing)
│   │   ├── layout.tsx       # Global layout (HTML wrapper, Navbar, Footer)
│   │   ├── page.tsx         # Homepage dashboard (Where the panels sit)
│   │   └── globals.css      # Global styles (Tailwind directives, custom font loading)
│   │
│   ├── components/          # Reusable UI Components
│   │   ├── ui/              # Atom/Primitive design system elements
│   │   │   ├── button.tsx
│   │   │   └── card.tsx
│   │   │
│   │   ├── dashboard/       # Feature-specific layout containers
│   │   │   ├── prayer-panel.tsx  # Wraps the row of cards
│   │   │   └── hadith-panel.tsx  # Right-side card containing Arabic text
│   │   │
│   │   └── features/        # Business-logic UI components
│   │       └── prayer/
│   │           ├── prayer-time-card.tsx      <-- Your Neumorphic component!
│   │           └── prayer-time-card.test.tsx # UI Automation / Unit tests
│   │
│   ├── hooks/               # Custom React hooks (e.g., usePrayerTimer)
│   │   └── use-prayer-timer.ts
│   │
│   ├── lib/                 # Third-party configurations or core utils
│   │   ├── utils.ts         # Tailwind merging helpers (clsx + tailwind-merge)
│   │   └── prayer-calc.ts   # Calculations for times if done client-side
│   │
│   └── types/               # TypeScript type definitions
│       └── index.ts
│
├── .env.local               # Environment variables
├── docker-compose.yml       # Dev/Prod orchestration environment
├── Dockerfile               # Multi-stage production build configuration
├── next.config.js           # Next.js specific configuration
├── package.json             # Core dependencies and test scripts
└── tsconfig.json            # TypeScript rules
```
