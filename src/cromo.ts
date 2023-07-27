import { CromoContext } from './context/context'
import type { CromoMiddleware, Handlers, Method } from './types/handler'
import { Use } from './use/use'

export class Cromo {
  private middlewares: CromoMiddleware[] = []

  private router = new Bun.FileSystemRouter({
    style: 'nextjs',
    dir: './api',
    fileExtensions: ['.ts', '.js']
  })

  setMiddleware (middlewares: CromoMiddleware[]) {
    this.middlewares = middlewares
  }

  listen (callback: (port: number) => undefined) {
    const router = this.router
    const middlewares = this.middlewares

    Bun.serve({
      async fetch (request) {
        const notFound = new Response(null, { status: 404 })

        const { url } = request
        const method = request.method.toUpperCase() as Method
        const parsedUrl = new URL(url)

        const matchedRoute = router.match(parsedUrl.pathname)
        if (!matchedRoute) return notFound

        const handlers: Handlers = await import(matchedRoute.filePath)
        const handler = handlers[method] || handlers.default
        if (!handler || typeof handler !== 'function') return notFound

        handlers.middlewares && middlewares.push(...handlers.middlewares)
        handlers[`${method}_middlewares`] && middlewares.push(...handlers[`${method}_middlewares`])
        const use = new Use(middlewares)
        const body = request.body ? await request.json() : void 0

        const context = new CromoContext(request, parsedUrl, matchedRoute, body)
        return use.exec(handler, context) || notFound
      }
    })

    const port = Number(Bun.env.PORT) || 3000
    callback(port)
  }
}
