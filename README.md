# EV Pathways

A React-based organization chart application built with TypeScript and Vite.

## Features

- Interactive organization chart visualization
- Built with React 19, TypeScript, and Vite
- Uses ReactFlow for chart rendering
- Tailwind CSS for styling
- ESLint configuration for code quality

## Development

This project uses the following technologies:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## GitHub Pages Deployment

This project is configured to automatically deploy to GitHub Pages using GitHub Actions.

### Workflow Details

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- Build the project using Node.js
- Run linting and type checking
- Build the production bundle
- Deploy to GitHub Pages

The app will be available at: `https://evchurch.github.io/pathways/`
