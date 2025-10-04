# Outdoor Event Weather Risk – Frontend

This frontend provides a mobile-first interface to query the likelihood of adverse weather conditions (very hot, very cold, very windy, very wet, very uncomfortable) for a chosen place and time.

## Quick start

1) Install dependencies

```bash
npm install
```

2) Configure backend URL

- Copy `.env.example` to `.env` and set `VITE_API_BASE_URL` to your backend origin (e.g. `http://localhost:8000`).

3) Run locally

```bash
npm run dev
```

## API contract

The app expects a GET endpoint at `${VITE_API_BASE_URL}/api/risk?q=<query>&datetime=<iso8601>` returning JSON:

```json
{
  "locationName": "Thrissur, India",
  "latitude": 10.52,
  "longitude": 76.21,
  "isoDateTime": "2025-10-05T14:00:00Z",
  "risks": [
    { "kind": "very hot", "probability": 0.12 },
    { "kind": "very cold", "probability": 0.05 },
    { "kind": "very windy", "probability": 0.18 },
    { "kind": "very wet", "probability": 0.24 },
    { "kind": "very uncomfortable", "probability": 0.35 }
  ]
}
```

## Styling

- Tailwind CSS powers layout, glassmorphism cards, and adaptive typography.
- The UI is optimized for a narrow viewport (~390x844) similar to the provided mockups.
