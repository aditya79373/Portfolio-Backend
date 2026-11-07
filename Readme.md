# Portfolio Backend

The API server for my **portfolio website**. It receives contact messages and code access requests from the website and emails them to me using the Brevo HTTP API.

The website lives in a separate repository: **Portfolio-Frontend**.


## Features

- **Contact form endpoint**: sends visitor messages to my inbox.
- **Code access requests**: sends a notification when someone requests project code access.
- **Email through the Brevo HTTP API** (works on Render, where SMTP ports are blocked).

## Tech stack

| Area | Tools |
| --- | --- |
| Runtime and framework | Node.js, Express |
| Email | Brevo HTTP API |
| Hosting | Render |

## Getting started

### Prerequisites

- Node.js (LTS)
- npm (comes with Node.js)
- A Brevo account with an API key and a verified sender email

### Clone

```bash
git clone https://github.com/aditya79373/Portfolio-Backend.git
cd Portfolio-Backend
```

### Install and run

```bash
npm install
npm run dev
```

The server starts on the port set in `.env` (default `5000`).

### Environment variables

Create a `.env` file in the project root:

```env
PORT=5000
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=your_verified_sender_email
RECEIVER_EMAIL=email_where_you_want_to_receive_messages
```

| Variable | Purpose |
| --- | --- |
| `PORT` | Port the server runs on |
| `BREVO_API_KEY` | Brevo API key used to send emails |
| `BREVO_SENDER_EMAIL` | Verified sender email in Brevo |
| `RECEIVER_EMAIL` | Inbox that receives contact and access request emails |

Never commit `.env` files or share your API keys.


## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the server in development |
| `npm start` | Start the server in production |

## Notes

- Do not commit `.env` files.
- Make sure CORS allows your portfolio's frontend URL.
