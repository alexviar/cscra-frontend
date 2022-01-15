import { matchRequestUrl, MockedRequest } from 'msw'
import { setupServer } from 'msw/node'
import { handlers } from './handlers'
// This configures a request mocking server with the given request handlers.
export const server = setupServer(...handlers)

export function waitForRequest(method: string, url: string) {
  let requestId = ''

  return new Promise<MockedRequest>((resolve, reject) => {
    server.on('request:start', (req) => {
      const matchesMethod = req.method.toLowerCase() === method.toLowerCase()
      const matchesUrl = matchRequestUrl(req.url, url)

      if (matchesMethod && matchesUrl.matches) {
        requestId = req.id
      }
    })

    server.on('request:match', (req) => {
      if (req.id === requestId) {
        resolve(req)
      }
    })

    server.on('request:unhandled', (req) => {
      if (req.id === requestId) {
        reject(
          new Error(`The ${req.method} ${req.url.href} request was unhandled.`),
        )
      }
    })
  })
}