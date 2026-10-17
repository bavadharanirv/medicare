# Unit 4 implementation notes

## Topics implemented

- **Jest + React Testing Library:** Jest configuration, DOM matchers, and `src/__tests__/DoctorCard.test.jsx` covering rendered doctor details, click behavior, and unavailable doctors.
- **Performance:** route-level `React.lazy`/`Suspense` code splitting and `React.memo` for repeated doctor cards. Existing doctor filtering already uses `useMemo`.
- **PWA:** web app manifest, SVG app icon, and a service worker registered only for production. The service worker caches the app shell/static resources and deliberately skips appointment/auth API responses so patient data is not cached.
- **Accessibility:** skip-to-main link, visible keyboard focus, semantic doctor card, descriptive button label, and accessible loading status. Form `Input` already associates labels and validation errors with fields.
- **Security:** server authentication error messages are allow-listed before display; existing form validation and protected routes are retained. The service worker avoids caching authenticated API data.

## Run on Windows

Open a terminal in the extracted `unit4` folder and run:

```bash
npm install
npm run dev
```

Start the backend in a second terminal using the project's existing server command if login/appointments require it.

Run tests after installing the dependencies:

```bash
npm test
```

Build for production (PWA service-worker registration is enabled in production builds):

```bash
npm run build
npm run preview
```

**Note:** Jest and React Testing Library are added to `package.json` as development dependencies, so `npm install` is required before running the tests.
