# StudySpot

StudySpot is a React Native application that helps students find libraries, cafés, universities and coworking spaces around the FHTW campus.

## Team

- Mark Stessl
- Nippon Lama (Noppin)

## Requirements

- Node.js **22.13 or newer** (Node 22 LTS recommended for Expo SDK 58).
- npm.
- Android Studio with an Android emulator, or an Android device with a compatible Expo Go / development build.
- Git.

Check your Node version:

```bash
node --version
```

## Install and run

```bash
npm install
npx expo install --fix
npm run typecheck
npm test
npx expo start
```

Press `a` in the Expo terminal to open the Android emulator. For a physical Android device, scan the QR code with the compatible Expo Go app. If the current Expo Go client does not yet support your SDK, use an Expo development build.

## Main features

- **Explore:** browse and search nearby study places by name, category or address.
- **Nearby:** request foreground GPS permission and sort places by distance.
- **Saved:** keep a persistent offline shortlist.
- **Settings:** refresh the OpenStreetMap data and clear only the downloaded location cache.
- **Details:** inspect address, opening hours, coordinates and website when provided.

## Data and offline behaviour

StudySpot queries the public OpenStreetMap Overpass API for named libraries, cafés, universities, colleges and coworking spaces around the FHTW campus. Results are mapped into the `StudyLocation` domain model.

The app stores the latest successful place list and saved favourites in AsyncStorage:

1. Previously cached places and favourites are loaded at startup.
2. A network refresh is attempted.
3. Successful results replace the location cache.
4. If the API is unavailable, the app keeps cached places.
5. If no cache exists, built-in sample places are shown.
6. Favourites remain available offline and are not removed when the location cache is cleared.

GPS is requested only after the user taps **Use my location**. StudySpot uses foreground permission only and does not track users in the background. If permission is denied, distances are calculated from the FHTW campus reference point.

## Architecture

```text
App.tsx
└── StudySpotProvider
    └── NavigationContainer
        └── AppNavigator
            ├── Explore
            ├── Nearby
            ├── Saved
            ├── Settings
            └── Place Details

src/
├── components/     Reusable UI components
├── constants/      Campus coordinates, storage keys and theme
├── hooks/          Context hook
├── navigation/     Typed stack and tab navigation
├── screens/        Explore, Nearby, Saved, Settings and Details
├── services/       Overpass API, GPS, AsyncStorage and sample data
├── store/          Shared StudySpot context and state
├── types/          Domain models
└── utils/          Distance calculations and unit tests
```

## Testing

```bash
npm run typecheck
npm test
```

The unit tests cover Haversine distance calculation, distance formatting, sorting, OpenStreetMap element mapping, response validation and duplicate removal.

## OpenStreetMap attribution

Place data © [OpenStreetMap contributors](https://www.openstreetmap.org/copyright), available under the Open Database License (ODbL). Data availability and opening hours depend on community-maintained map tags and may be incomplete or outdated.

## Project documentation

See [`PROJECT_SPECIFICATION.md`](./PROJECT_SPECIFICATION.md) for the project concept, user stories, acceptance criteria, architecture, offline strategy, changelog and implementation traceability.
