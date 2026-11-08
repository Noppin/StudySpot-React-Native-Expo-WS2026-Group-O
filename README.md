# StudySpot

StudySpot helps students find libraries, cafés and university buildings to study in near them in Vienna. Places come from OpenStreetMap, are shown in a searchable list and on a map, can be saved as favorites and remain available offline.

## Team

- Mark Stessl
- Nippon Lama (Noppin)

## Requirements

- Node.js **22.13 or newer** (Node 22 LTS recommended for Expo SDK 58)
- npm and Git
- Android Studio with an emulator, or an Android device with a compatible Expo Go / development build

## Install and run

Study places come from the [Geoapify Places API](https://apidocs.geoapify.com/docs/places/), which needs a free API key (3,000 requests per day, no credit card):

1. Create an account and a project at <https://myprojects.geoapify.com> and copy the API key.
2. Copy `.env.example` to `.env` and set `EXPO_PUBLIC_GEOAPIFY_API_KEY=<your key>`. `.env` is not committed.

```bash
npm install
npx expo install --fix
npm run typecheck
npm test
npx expo start
```

Press `a` in the Expo terminal to open the Android emulator, or scan the QR code with Expo Go on a device.

> **Maps in development builds:** Expo Go ships with a Google Maps key. For a development or release build, add a key through the `react-native-maps` config plugin (`androidGoogleMapsApiKey`).

## Features

| Screen | Content |
| --- | --- |
| **Home** | Location status, search by name, category filter (Library, Cafe, University) with reset, nearby list sorted by distance, pull-to-refresh, loading, error, empty and offline states |
| **Map** | User position (or the default location), search radius, one marker per place, a sheet with basic information and a link to details |
| **Location Details** | Name, category, address, distance, coordinates, opening hours, website, OpenStreetMap ID and a favorite toggle |
| **Favorites** | Saved places sorted by distance, remove with undo, empty state; opens details |
| **Settings** | Search radius, preferred category, location behaviour, cache info, refresh, cache deletion, reset |

Navigation uses a bottom tab navigator (Home, Map, Favorites, Settings). Home, Map and Favorites each contain a native stack that opens Location Details, so back returns to where the user came from.

## Data, location and offline behaviour

Places are loaded from the **Geoapify Places API** (categories `education.library`, `catering.cafe`, `education.university`, `education.college`) within the configured radius. Geoapify serves OpenStreetMap data, so every place keeps its OpenStreetMap id (e.g. `node-123`). Network errors, server errors, timeouts, a missing or invalid API key, invalid responses and empty results are turned into short, understandable messages.

The key is an `EXPO_PUBLIC_` variable and therefore part of the app bundle; restrict it in the Geoapify dashboard (e.g. to the Places API) before sharing a build.

Location permission is requested at runtime with **Expo Location** (foreground only). If permission is denied, GPS is unavailable or the user selects *Use default location*, the app keeps working and searches around FH Technikum Wien.

| Area | Strategy |
| --- | --- |
| Favorites | Zustand store persisted to AsyncStorage; survives restarts and cache deletion |
| API cache | Last successful result plus timestamp, origin and radius in AsyncStorage |
| Settings | Zustand store persisted to AsyncStorage |

Synchronisation: start app → load local cache → show cached data → request current data → update UI and cache on success → keep cached data on failure. Home and Map show an offline banner with the age of the data whenever the cache is displayed.

## Architecture

```text
App.tsx  ErrorBoundary › SafeAreaProvider › QueryClientProvider › NavigationContainer
src/
├── components/   LocationCard, SearchBar, CategoryFilter, LoadingView, ErrorView,
│                 OfflineBanner, InfoBanner, ScreenHeader, ScreenContainer
├── constants/    theme, storageKeys, default location and settings
├── hooks/        useLocations (TanStack Query + cache), useCurrentLocation
├── navigation/   AppNavigator (tabs), HomeStackNavigator (detail stacks), navigationTypes
├── screens/      Home, Map, LocationDetails, Favorites, Settings
├── services/     apiService (Overpass), locationService (GPS), storageService, queryClient
├── store/        favoritesStore, settingsStore (Zustand)
├── types/        Location, Settings
└── utils/        distance, filters
```

State: React `useState` for temporary UI state, Zustand for favorites and settings, TanStack Query for API requests, caching, loading/error states and refetching.

## Testing

```bash
npm run typecheck
npm test
```

Jest (`jest-expo` preset) and React Native Testing Library cover distance calculation and formatting, search and category filtering, Geoapify mapping, validation and error classification, the persisted favorites store, and the LocationCard, CategoryFilter and OfflineBanner components. Screens are tested manually on the Android emulator.

## OpenStreetMap attribution

Powered by [Geoapify](https://www.geoapify.com/). Place data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), available under the Open Database License (ODbL). Opening hours and other tags are community-maintained and may be incomplete or outdated.
