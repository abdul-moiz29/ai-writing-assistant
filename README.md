# AI Writing Assistant

A SaaS platform that helps users generate marketing text, blogs, and product descriptions using AI.

## Features

- User authentication (signup/login)
- Free credits system
- AI-powered text generation
- Generation history management
- Subscription plans via Stripe
- Responsive design
- Secure API endpoints

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB
- **Authentication**: JWT
- **Payments**: Stripe
- **AI**: OpenAI API

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Stripe account
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   # Install server dependencies
   cd server
   npm install

   # Install client dependencies
   cd ../client
   npm install
   ```
3. Create a `.env` file in the server directory
4. Start the development servers:
   ```bash
   # Start backend server
   cd server
   npm run dev

   # Start frontend server
   cd client
   npm run dev
   ```

## Project Structure

```
├── client/                 # Next.js frontend
│   ├── src/
│   │   ├── app/          # Next.js app router
│   │   ├── components/   # Reusable components
│   │   └── styles/       # CSS styles
│   └── public/           # Static files
│
└── server/               # Express backend
    ├── src/
    │   ├── controllers/  # Route controllers
    │   ├── routes/       # API routes
    │   ├── models/       # MongoDB models
    │   └── utils/        # Utility functions
    └── .env             # Environment variables
```

## License

This project is licensed under the MIT License. 