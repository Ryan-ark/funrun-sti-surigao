This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

For database management, you can run Prisma Studio:

```bash
npx prisma studio
```

> Note: If you encounter any errors, you may need to ask for the `.env` file which contains necessary environment variables.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Database Scripts

This project includes utility scripts for seeding and viewing database data.

### Running Seed Scripts

Seed scripts are used to populate the database with initial data. Each script handles a specific entity:

```bash
# Seed users
node scripts/seed/seed-users.js

# Seed events
node scripts/seed/seed-events.js

# Seed event categories
node scripts/seed/seed-event-categories.js

# Seed event staff
node scripts/seed/seed-event-staff.js

# Seed marshal profiles
node scripts/seed/seed-marshal-profiles.js

# Seed participants
node scripts/seed/seed-participants.js

# Seed results
node scripts/seed/seed-results.js

# Seed runner profiles
node scripts/seed/seed-runner-profiles.js
```

### Running View Scripts

View scripts are used to display database content in a readable format:

```bash
# View users
node scripts/view/view-users.js

# View events
node scripts/view/view-events.js

# View events with categories
node scripts/view/view-events-with-categories.js

# View event staff
node scripts/view/view-event-staff.js

# View marshal profiles
node scripts/view/view-marshal-profiles.js

# View participants
node scripts/view/view-participants.js

# View results
node scripts/view/view-results.js

# View runner profiles
node scripts/view/view-runner-profiles.js
```

### Testing All Scripts

You can test all seed and view scripts at once using the test script:

```bash
node test-scripts.js
```

This will run all available scripts and provide a summary of successes and failures.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
