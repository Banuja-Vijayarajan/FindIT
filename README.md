# FindIT

FindIT is a campus lost-and-found app built with Expo and React Native. It helps a campus community post lost or found items, browse reports, and coordinate an item's return.

## Features

- Create lost or found reports with a category, location, contact details, description, and optional photo.
- Browse active reports and filter by lost/found status or category; search titles, locations, and descriptions.
- View report details, mark items as claimed/returned, and delete reports.
- See recent activity and community counts on the home screen.
- Edit a local profile and switch between light and dark themes.
- Use the app on Android, iOS, and web.

## Tech stack

- Expo SDK 58 and React Native 0.88
- React Navigation (native stack and bottom tabs)
- Expo SQLite for on-device item storage
- Expo ImagePicker for selecting or taking report photos
- React Native Web for the web app

## Getting started

### Requirements

- Node.js and npm
- Expo-compatible development environment for the platform you want to run

### Install and start

```bash
npm ci
npx expo start
```

Use the Expo CLI prompts to open the app on a device or simulator. You can also start a specific target with:

```bash
npm run android
npm run ios
npm run web
```

## Data and privacy notes

- On Android and iOS, reports are stored locally in the device's SQLite database (`findit.db`). The app does not currently sync reports between devices or use a backend service.
- On web, reports are held in memory and are cleared when the page is reloaded or closed.
- The app starts with example reports when the local item database is empty.
- Profile details and the selected theme are held in app state and are not persisted between launches.
- Report contact details are shown in the report details screen. Avoid entering sensitive information.

## Project structure

```text
src/
  components/   Reusable UI components
  constants/    Item categories and shared constants
  context/      User and theme state
  database/     Local report storage and operations
  navigation/   React Navigation setup
  screens/      App screens
  styles/       Theme and screen styles
assets/         App icons, fonts, and images
```

## Available npm scripts

| Script | Description |
| --- | --- |
| `npm start` | Start the Expo development server |
| `npm run android` | Start Expo for Android |
| `npm run ios` | Start Expo for iOS |
| `npm run web` | Start Expo for web |
