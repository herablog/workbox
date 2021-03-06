/* global workbox */

importScripts('/__test/bundle/workbox-routing');

self.addEventListener('install', (event) => event.waitUntil(self.skipWaiting()));
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

const routes = [];

routes.push(new workbox.routing.Route({
  match: ({url}) => url.pathname.endsWith('static'),
  handler: {
    handle: () => Promise.resolve(new Response('static response')),
  },
}));

routes.push(new workbox.routing.Route({
  match: ({url}) => url.pathname.endsWith('throw-error'),
  handler: {
    handle: () => Promise.resolve().then(() => {
      throw new Error();
    }),
  },
}));

const defaultHandler = {
  handle: () => Promise.resolve(new Response('defaultHandler response')),
};

const catchHandler = {
  handle: () => Promise.resolve(new Response('catchHandler response')),
};

const router = new workbox.routing.Router();
router.registerRoutes({routes});

router.setDefaultHandler({handler: defaultHandler});
router.setCatchHandler({handler: catchHandler});
