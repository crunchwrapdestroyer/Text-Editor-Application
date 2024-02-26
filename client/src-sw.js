const { warmStrategyCache } = require('workbox-recipes');
const { CacheFirst } = require('workbox-strategies');
const { registerRoute } = require('workbox-routing');
const { CacheableResponsePlugin } = require('workbox-cacheable-response');
const { ExpirationPlugin } = require('workbox-expiration');
const { precacheAndRoute } = require('workbox-precaching/precacheAndRoute');

precacheAndRoute(self.__WB_MANIFEST);

const pageCache = new CacheFirst({
  cacheName: 'page-cache',
  plugins: [
    new CacheableResponsePlugin({
      statuses: [0, 200],
    }),
    new ExpirationPlugin({
      maxAgeSeconds: 30 * 24 * 60 * 60,
    }),
  ],
});

warmStrategyCache({
  urls: ['/index.html', '/'],
  strategy: pageCache,
});

registerRoute(({ request }) => request.mode === 'navigate', pageCache);

// TODO: Implement asset caching
registerRoute(
  // Define a function to match requests for specific asset types
  ({ request }) => {
    // Check if the request URL ends with a specific file extension (e.g., .js, .css, .png)
    return request.destination === 'style' || request.destination === 'script' || request.destination === 'image';
  },
  // Specify the caching strategy for the matched requests
  new CacheFirst({
    // Set a unique cache name for the assets
    cacheName: 'assets-cache',
    plugins: [
      // Configure the CacheableResponsePlugin to cache responses with specific status codes
      new CacheableResponsePlugin({
        statuses: [0, 200],
      }),
      // Set expiration for cached assets
      new ExpirationPlugin({
        maxAgeSeconds: 30 * 24 * 60 * 60, // Cache assets for 30 days
      }),
    ],
  })
);