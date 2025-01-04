# Portfolio Tracker Application - CapX Challenge

The Portfolio Tracker application is designed to help users manage their stock holdings effectively. It allows users to add, view, edit, and delete stocks, track their portfolio value based on real-time stock prices, and view key portfolio metrics on a dashboard.

[Try it](https://capx-front.vercel.app/)

## Technologies Used

- [Next.js 14](https://nextjs.org/docs/getting-started)
- [NextUI v2](https://nextui.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Tailwind Variants](https://tailwind-variants.org)
- [TypeScript](https://www.typescriptlang.org/)
- [Framer Motion](https://www.framer.com/motion/)
- [next-themes](https://github.com/pacocoursey/next-themes)

## How to Use

### Clone the project

Run the following command:

```bash
git clone https://github.com/ROR2022/capx-front.git
```

### Install dependencies

Using `npm`:

```bash
npm install
```

### ENVIROMENT VARIABLES

Create .env.local file like this:
NEXT_PUBLIC_DEV_ENV=http://localhost:5000
NEXT_PUBLIC_PRD_ENV=https://capx-api-production.up.railway.app
NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_LOCALSTORAGE_KEY=
NEXT_PUBLIC_ROLE_ADMIN=admin
NEXT_PUBLIC_ROLE_DEFAULT=user
NEXT_PUBLIC_USER_STATUS_DEFAULT=active
NEXT_PUBLIC_FINNHUB_APIKEY=

### Run the development server

```bash
npm run dev
```

## License

Licensed under the [MIT license](https://github.com/nextui-org/next-app-template/blob/main/LICENSE).
