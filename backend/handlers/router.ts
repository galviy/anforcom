import path from 'path'
import {session_handler,RateLimiter} from "./middleware"
import { parseCookie } from './cookies'

const ROOT = path.join(import.meta.dir)
import * as login from './routes/auth/login'
import * as user from './routes/user/me'
import * as c_acc from './routes/auth/create_account'
import * as c_team from './routes/teams/create_team'
import * as show_u from './routes/teams/show_team'
import * as show_t from './routes/teams/show_member_teams'
import * as del_t from './routes/teams/delete_team'
import * as del_u_t from './routes/teams/delete_user_team'
import * as add_u from './routes/teams/add_user_team'
import * as view_ktm from './routes/teams/view_ktm'
import * as logout from './routes/user/logout'
import * as verification from "./routes/auth/verification"

const rutercoy = new Map([
    ['/auth/login', login],
    ['/auth/create_account',c_acc],
    ['/user/me', user],
    ['/teams/create_team',c_team],
    ['/teams/show_team',show_u],
    ['/teams/show_member_teams',show_t],
    ['/teams/delete_team',del_t],
    ['/teams/delete_user_team',del_u_t],
    ['/teams/add_user_team',add_u],
    ['/teams/view_ktm',view_ktm],
    ['/user/me/logout', logout],
    ['/auth/verification',verification]
])


export class router {
    private publicDir: string


    constructor() {
        this.publicDir = path.join(ROOT)
    }
    private get notFound(): Response{
        return new Response(null, {status:404});
    }

    async handle(req: Request,pathname: string,server: Bun.Server<any>): Promise<Response> {
        let url = pathname.replace("/api", "");
        if (!url) return this.notFound;
        let route = rutercoy.get(url) 
        

        if(!route) return this.notFound;
        
        if (url == '/auth/login' || url == '/auth/create_account' || url == '/auth/verification'){
           
           return route.handler(req,  "ok");
        }
        const cookieHeader = req.headers.get('cookie')
        if (!cookieHeader) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }
        const raw = parseCookie(cookieHeader)?.session
        if (!raw) {
            return Response.json({ success: false, error: "Unauthorized" }, { status: 401 })
        }

        let json = await session_handler(raw);
         if (json instanceof Response) {
            return json; //kata ai lebih stabil gini :v
        }
        /*
        if (json.ok == false){
            //console.log("Blocked by middleware")
            return json;
        }*/
       

       
        return route.handler(req,json);
    }
}