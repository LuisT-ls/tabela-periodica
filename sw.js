const CACHE_NAME = 'tabela-periodica-v2.5.0'
const STATIC_CACHE = 'static-v2.5.0'
const DYNAMIC_CACHE = 'dynamic-v2.5.0'

// Arquivos para cache estático
const STATIC_FILES = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/css/modules/base/variables.css',
  '/assets/css/modules/base/reset.css',
  '/assets/css/modules/base/typography.css',
  '/assets/css/modules/base/animations.css',
  '/assets/css/modules/layout/container.css',
  '/assets/css/modules/layout/header.css',
  '/assets/css/modules/layout/footer.css',
  '/assets/css/modules/components/buttons.css',
  '/assets/css/modules/components/modal.css',
  '/assets/css/modules/features/periodic-table.css',
  '/assets/css/modules/features/element-modal.css',
  '/js/app.js',
  '/js/modules/data-loader.js',
  '/js/modules/table-renderer.js',
  '/js/modules/element-modal.js',
  '/js/modules/search.js',
  '/js/modules/filters.js',
  '/js/modules/dark-mode.js',
  '/js/modules/favorites.js',
  '/js/modules/trends.js',
  '/js/modules/comparison.js',
  '/js/modules/notification.js',
  '/js/modules/mobile-menu.js',
  '/js/modules/electron-animation.js',
  '/data/elements.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.7.1/chart.min.js'
]

// Instalação do Service Worker
self.addEventListener('install', event => {
  console.log('Service Worker instalando...')

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then(cache => {
        console.log('Cache estático aberto')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Arquivos em cache')
        return self.skipWaiting()
      })
      .catch(error => {
        console.error('Erro ao instalar cache:', error)
      })
  )
})

// Ativação do Service Worker
self.addEventListener('activate', event => {
  console.log('Service Worker ativando...')

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Removendo cache antigo:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker ativado')
        return self.clients.claim()
      })
  )
})

// Interceptação de requisições
self.addEventListener('fetch', event => {
  const { request } = event
  const url = new URL(request.url)

  // Estratégia para arquivos estáticos
  if (
    STATIC_FILES.includes(url.pathname) ||
    STATIC_FILES.includes(request.url)
  ) {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response
        }
        return fetch(request).then(response => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches
              .open(STATIC_CACHE)
              .then(cache => cache.put(request, responseClone))
          }
          return response
        })
      })
    )
    return
  }

  // Estratégia para dados JSON
  if (url.pathname.includes('/data/') || url.pathname.endsWith('.json')) {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response
        }
        return fetch(request)
          .then(response => {
            if (response.status === 200) {
              const responseClone = response.clone()
              caches
                .open(DYNAMIC_CACHE)
                .then(cache => cache.put(request, responseClone))
            }
            return response
          })
          .catch(() => {
            // Fallback para dados offline
            if (url.pathname.includes('elements.json')) {
              return caches.match('/data/elements.json')
            }
          })
      })
    )
    return
  }

  // Estratégia para recursos externos
  if (url.origin !== location.origin) {
    event.respondWith(
      caches.match(request).then(response => {
        if (response) {
          return response
        }
        return fetch(request).then(response => {
          if (response.status === 200) {
            const responseClone = response.clone()
            caches
              .open(DYNAMIC_CACHE)
              .then(cache => cache.put(request, responseClone))
          }
          return response
        })
      })
    )
    return
  }

  // Estratégia padrão: Network First
  event.respondWith(
    fetch(request)
      .then(response => {
        if (response.status === 200) {
          const responseClone = response.clone()
          caches
            .open(DYNAMIC_CACHE)
            .then(cache => cache.put(request, responseClone))
        }
        return response
      })
      .catch(() => {
        return caches.match(request)
      })
  )
})

// Sincronização em background
self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

// Notificações push
self.addEventListener('push', event => {
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível!',
    icon: '/assets/img/favicon/android-chrome-192x192.png',
    badge: '/assets/img/favicon/favicon-32x32.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Explorar',
        icon: '/assets/img/icons/explore.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/assets/img/icons/close.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Tabela Periódica', options)
  )
})

// Clique em notificação
self.addEventListener('notificationclick', event => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(clients.openWindow('/'))
  }
})

// Função para sincronização em background
async function doBackgroundSync() {
  try {
    // Verificar atualizações de dados
    const response = await fetch('/data/elements.json')
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE)
      await cache.put('/data/elements.json', response)
      console.log('Dados sincronizados em background')
    }
  } catch (error) {
    console.error('Erro na sincronização:', error)
  }
}

// Mensagens do cliente
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }

  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME })
  }
})
