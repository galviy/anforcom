import { Logger } from './logger'
import { StaticHandler } from './handlers/staticHandler'
import { router } from './handlers/router'


export class Server {
  private logger = new Logger()
  private static_ = new StaticHandler()
  private router = new router();
  
 private port = Number(Bun.env.Backend_PORT) 

  private async handleRequest(req: Request,server: Bun.Server<any>): Promise<Response> {
    // console.log(server.requestIP(req))
    // console.log(req)
    //console.log(new URL(req.url).pathname)
    
    const url = new URL(req.url)
    const pathname = url.pathname
    if(pathname.startsWith("/api/"))
        return this.router.handle(req,pathname);
    return this.static_.handle(req,pathname)
  }

  start() {
    Bun.serve({
      port: this.port,
      fetch: (req,server) => this.handleRequest(req,server),
      error: (err) => {
        console.log(err)
        this.logger.error(err.message)
        return new Response(null, { status: 500 });
      },
    })

    console.log(`Running at http://localhost:${this.port}`)
  }
}