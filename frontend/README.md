# Customer Feedback Explorer Frontend

This is the frontend for the Customer Feedback Explorer application.

## Setup and Installation

1. Install dependencies (including dev dependencies):
   ```
   npm install --include=dev
   ```

2. Build the CSS (important step!):
   ```
   npx postcss src/styles/tailwind.css -o src/styles/main.css
   ```

3. Start the development server:
   ```
   npm start
   ```

## Troubleshooting

### 'postcss' is not recognized as an internal or external command

If you see this error, it means the PostCSS CLI isn't installed or isn't in your PATH. Use `npx` to run it:

```
npx postcss src/styles/tailwind.css -o src/styles/main.css
```

### SVG Icons Appear Too Large

If SVG icons appear too large, make sure you've built the CSS files:

```
npx postcss src/styles/tailwind.css -o src/styles/main.css
```

Then restart your development server:

```
npm start
```

### Alternative Solution: Use the Icon Component

We've added an `Icon` component that handles sizing internally. You can use it like this:

```jsx
import Icon from './components/Icon';

// In your component:
<Icon name="search" size="h-4" className="text-blue-600" />
```

Available icon names: search, info, document, lightning, clipboard, upload, lightbulb, database, warning, error, success, clock, box, id, emoji

### Testing SVG Icons

You can test if SVG icons are displaying correctly by visiting:
http://localhost:3000/test-icons.html

This page shows various SVG icons with different size classes to help diagnose any styling issues.

## Building for Production

To build the application for production:

```
npm run build
```

This will create a production-ready build in the `build` directory.

## Docker

To build and run using Docker:

```
docker-compose build frontend
docker-compose up
```