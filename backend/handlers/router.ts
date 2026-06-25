import path from 'path'

const ROOT = path.join(import.meta.dir)
import * as login from './routes/auth/login'
import * as user from './routes/user/'

const rutercoy = new Map([
    ['/auth/login', login],
    ['/user', user]
])

export class router {
    private publicDir: string


    constructor() {
        this.publicDir = path.join(ROOT)
    }
    private get notFound(): Response{
        return Response.json({ message: "Invalid endpoint??", success:false}, {status:404});
    }

    async handle(req: Request,pathname: string): Promise<Response> {
        let url = pathname.replace("/api", "");
        if (!url) return this.notFound;
        console.log(url)
        let route = rutercoy.get(url) 
        if(!route) return this.notFound;
        return route.handler(req)
    }
}