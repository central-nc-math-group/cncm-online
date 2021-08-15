export const siteURL = !process.env.PRODUCTION
  ? `http://localhost:${process.env.NEXT_PUBLIC_PORT}`
  : process.env.PRODUCTION_URL;
