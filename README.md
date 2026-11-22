# ASTRION – Space & Science Discovery Mobile Application

> **Explore the Universe, Discover Science.**

ASTRION is an educational mobile application built with React Native and Expo, crafted to ignite curiosity and make astrophysics, space missions, and planetary science interactive and accessible.

---

## 🛠️ Technology Stack (Foundational Setup)

- **Framework:** [Expo](https://expo.dev/) (SDK 58)
- **Runtime:** [React Native](https://reactnative.dev/) (0.88)
- **Language:** [TypeScript](https://www.typescriptlang.org/) (Strict Mode)
- **Package Manager:** `npm`
- **Navigation (Planned):** React Navigation
- **Target Platform:** Android (tested on physical mobile via Expo Go) & iOS

---

## 📂 Project Structure

```text
ASTRION/
├── assets/                  # Icons, splash screens, and image assets
├── App.tsx                  # Root component (Welcome Screen & UI Foundation)
├── app.json                 # Expo project configuration and app metadata
├── index.ts                 # Expo application entry point (registerRootComponent)
├── package.json             # Project dependencies and npm scripts
├── tsconfig.json            # TypeScript compiler configuration (extends expo/tsconfig.base)
└── README.md                # Project documentation and developer guide
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** v20+ (recommended v22.x)
- **npm:** v10+
- **Expo Go App:** Installed on your physical Android mobile device from the Google Play Store.
- Both your development machine and your Android phone should be connected to the **same Wi-Fi network**.

### Running the Development Server

1. Open PowerShell or Terminal and navigate to the project root:
   ```bash
   cd D:\MyProjects\ASTRION
   ```

2. Start the Expo development server:
   ```bash
   npx expo start
   ```

3. Open the **Expo Go** application on your Android phone and scan the QR code displayed in your terminal.

---

## 🔍 Validation & Diagnostics

To run health and dependency compatibility checks across your project:

```bash
npx expo-doctor
```

To verify TypeScript types without emitting build artifacts:

```bash
npx tsc --noEmit
```

---

## 📄 License

Academic / Educational Assignment - Information Technology Degree.
