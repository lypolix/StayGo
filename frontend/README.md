# StayGo - Hotel Booking Platform

StayGo is a modern hotel booking platform built with React, TypeScript, and Vite. This frontend application provides a seamless user experience for discovering and booking hotels.

## Features

### User Authentication
- Secure login and registration
- User profile management
- Authentication state persistence

### Hotel Discovery
- Browse and search hotels
- Filter and sort hotel listings
- View detailed hotel information
- Responsive image galleries
- Location-based search

### Hotel Details
- Comprehensive hotel information
- High-quality image galleries
- Room type selection
- Amenities listing
- Guest reviews and ratings
- Similar hotels recommendation

### Booking Management
- Real-time availability check
- Date selection with calendar
- Room type selection
- Booking confirmation

### User Experience
- Responsive design for all devices
- Dark/light theme support
- Loading and error states
- Interactive UI components
- Smooth animations and transitions

## Tech Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit (RTK) + RTK Query
- **UI Library**: Chakra UI
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **Data Fetching**: RTK Query
- **Icons**: React Icons
- **Testing**: Jest + React Testing Library

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```
3. Create a `.env` file based on `.env.example` and update the environment variables
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

### Available Scripts

- `dev` - Start development server
- `build` - Build for production
- `preview` - Preview production build
- `test` - Run tests
- `lint` - Run ESLint
- `format` - Format code with Prettier

## Project Structure

```
src/
├── app/               # App configuration and routing
├── assets/            # Static assets
├── components/        # Reusable UI components
├── features/          # Feature-based modules
│   ├── auth/         # Authentication feature
│   ├── hotels/       # Hotels feature
│   ├── landing/      # Landing page
│   └── user/         # User profile and settings
├── shared/           # Shared utilities and types
├── styles/           # Global styles
└── utils/            # Utility functions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

