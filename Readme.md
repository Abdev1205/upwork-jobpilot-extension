# Upwork Search Optimizer - Chrome Extension

A powerful Chrome extension built with React, TypeScript, and Tailwind CSS that helps you optimize your Upwork job searches with predefined search profiles.

## Features

- 🎯 **Multiple Search Profiles**: Create and manage different search profiles for various job types
- 🚀 **Quick Search**: One-click access to optimized Upwork job searches
- 🎨 **Customizable**: Color-coded profiles with custom descriptions
- 💾 **Local Storage**: All data stored locally using Chrome's storage API
- 🔄 **Pre-built Templates**: Frontend Heavy, Backend Heavy, and Full Stack templates included
- ⚡ **Modern UI**: Built with Shadcn/UI components and Tailwind CSS

## Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **Shadcn/UI** - UI Components
- **Chrome Extensions Manifest V3** - Extension API

## Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Chrome browser
- Basic knowledge of Chrome extensions

### Installation

1. **Clone or download the project files**
2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Build the extension**:

   ```bash
   npm run build
   ```

4. **Load the extension in Chrome**:
   - Open Chrome and go to `chrome://extensions/`
   - Enable "Developer mode" (toggle in top right)
   - Click "Load unpacked"
   - Select the `dist` folder from your project

### Development

For development with hot reload:

```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── ui/           # Shadcn/UI components
│   └── ProfileEditor.tsx
├── lib/
│   └── utils.ts      # Utility functions
├── App.tsx           # Main application
├── popup.tsx         # Extension popup entry
├── content.ts        # Content script
├── types.ts          # TypeScript types
└── globals.css       # Global styles
```

## Usage

1. **Click the extension icon** in your Chrome toolbar
2. **Use pre-built profiles** or create your own custom search profiles
3. **Click "Search Jobs"** to open Upwork with optimized search terms
4. **Manage profiles**: Edit, delete, or add new search profiles as needed

## Default Search Profiles

### Frontend Heavy

- React developer, React.js, Next.js developer, frontend developer, MERN stack, Tailwind CSS, Redux, Typescript, JavaScript, UI developer, Web app development

### Backend Heavy

- Node.js developer, Express.js, REST API, GraphQL, backend developer, API integration, Payment gateway, Stripe integration, MongoDB, PostgreSQL, Redis, Docker, NGINX, AWS, Azure, Microservices

### Full Stack

- Full stack developer, MERN stack developer, React.js, Next.js, Node.js, SaaS development, Dashboard development, Marketplace website, Chrome extension developer, Bug fixing, Website optimization

## Customization

### Adding New Search Profiles

1. Click the "Add" button in the extension popup
2. Fill in the profile name, description, and keywords
3. Choose a color for easy identification
4. Save the profile

### Using Templates

The extension includes quick templates for common job types that you can use as starting points for your custom profiles.

## Storage

All data is stored locally using Chrome's `chrome.storage.local` API, ensuring your search profiles are private and persist across browser sessions.

## Contributing

Feel free to submit issues, fork the repository, and create pull requests for any improvements.

## License

MIT License - feel free to use this project for personal or commercial purposes.
