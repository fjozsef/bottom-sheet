# Bottom Sheet Demo Application

A demo Angular application that showcases a bottom sheet component with tab management capabilities. This application demonstrates how to implement a responsive bottom sheet with dynamic tab creation and content management in Angular.

## Features

- Bottom sheet component that appears when tabs are present
- Dynamic tab management system:
  - Create tabs with custom names
  - Close individual tabs
  - Keep tab state alive when switching between tabs (optional)
- Scrollable tab header with navigation:
  - Left/right scroll buttons
  - Mouse wheel support
- Example tab content types:
  - Text Area component (SimpleTextComponent)
  - Chart component

## Prerequisites

- Node.js (LTS version recommended)
- Angular CLI version 19.2.9 or higher

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Using the Application

1. The main interface displays a tab opener section where you can:
   - Enter a custom name for your new tab
   - Toggle "Keep alive" option to preserve tab state when inactive
   - Create new tabs with different content types

2. When you create a tab, the bottom sheet appears automatically at the bottom of the screen
3. Use the tab header to:
   - Switch between tabs
   - Close tabs using the 'x' button
   - Scroll through tabs using navigation buttons or mouse wheel

## Running Tests

Execute the unit tests via Karma:

```bash
npm test
```

Generate a test coverage report:

```bash
npm run test:coverage
```

Coverage reports are available in the `coverage/bottom-sheet/` directory.

## Building

Create a production build:

```bash
npm run build
```

Build artifacts will be stored in the `dist/` directory.
