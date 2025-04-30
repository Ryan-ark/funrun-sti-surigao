# Password Reset Setup Guide

To enable the password reset functionality in your application, you need to set up the following environment variables in your `.env.local` file:

## Required Environment Variables

```
# Authentication (required for password reset links)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret

# Email (Mailtrap credentials)
EMAIL_SERVER=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=1027899dab9ad8
EMAIL_PASSWORD=cc5a3cfa20e34e
EMAIL_FROM="STI Surigao Fun Run <funrun@stisurigao.com>"
```

## Instructions

1. Create a `.env.local` file in the root of your project if it doesn't exist already
2. Copy the above variables into your `.env.local` file
3. Update the values according to your environment
4. Restart your development server to apply the changes

## Troubleshooting

If you encounter Prisma errors related to "resetToken" and "resetTokenExpiry" fields, follow these steps:

1. Close your development server and any other applications that might be using Prisma
2. Run `npx prisma generate` to update your Prisma client
3. If you still encounter permission errors, try running your command prompt as administrator

## Notes

- For production, make sure to use proper email service credentials (not Mailtrap)
- Keep your environment variables secure and never commit them to version control
- The reset token expiration time is set to 1 hour by default (3600000 ms) 