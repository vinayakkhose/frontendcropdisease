# Frontend Setup Guide

## Installation

```bash
cd frontend
npm install
```

## Required Dependencies

All dependencies are listed in `package.json`. Key packages:

- **UI**: ShadCN UI components, Radix UI primitives
- **Styling**: Tailwind CSS, tailwindcss-animate
- **Theming**: next-themes
- **Charts**: Recharts
- **Maps**: Leaflet, react-leaflet
- **PDF**: jsPDF, jspdf-autotable
- **Utils**: clsx, tailwind-merge, class-variance-authority

## Features

### ✅ Implemented

1. **Dark/Light Mode** - Full theme support
2. **Multi-language** - English, Spanish, Hindi, French
3. **ShadCN UI** - Modern component library
4. **Maps** - Leaflet integration
5. **Voice Guidance** - Web Speech API
6. **Offline Support** - IndexedDB + Service Worker
7. **Reports** - PDF/CSV export
8. **Analytics** - Interactive charts
9. **Responsive Design** - Mobile-first

### Configuration

1. **Theme**: Configured in `tailwind.config.js` and `globals.css`
2. **Languages**: Add translations in `lib/language-context.tsx`
3. **Maps**: Leaflet tiles (can switch to Mapbox)

## Development

```bash
npm run dev
```

Visit `http://localhost:3000`

## Build

```bash
npm run build
npm start
```

## Notes

- Leaflet CSS is imported in `globals.css`
- Service Worker for offline support
- IndexedDB for local storage
- Voice API requires HTTPS in production
