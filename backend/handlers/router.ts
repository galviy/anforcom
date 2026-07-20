import path from 'path'
import {session_handler} from "./middleware"
import { parseCookie,verifyCSRF } from './cookies'

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
import * as reset_pass from "./routes/auth/reset_password"
import * as reset_confirm from "./routes/auth/reset_confirmation"
import * as edit_user from "./routes/teams/edit_user_team"
import * as user_edit from "./routes/user/edit"
import * as up_proposal from "./routes/teams/add_proposal"
import * as view_proposal from "./routes/teams/view_proposal"
import * as del_proposal from "./routes/teams/delete_proposal"
import * as resend_verif from "./routes/auth/resend_verification"
import * as resend_verif_token from "./routes/auth/resend_verification_by_token"

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
    ['/auth/verification',verification],
    ['/auth/reset_password', reset_pass],
    ['/auth/reset_confirmation',reset_confirm],
    ['/teams/edit_user_team',edit_user],
    ['/user/edit',user_edit],
    ['/teams/add_proposal',up_proposal],
    ['/teams/view_proposal',view_proposal],
    ['/teams/delete_proposal',del_proposal],
    ['/auth/resend_verification',resend_verif],
    ['/auth/resend_verification_by_token',resend_verif_token]
])

import {logger} from "../logger"

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
        if (url == "/user/me" || url == "/user/edit" || url == "/teams/edit_user_team" || url == "/teams/delete_user_team" || url == "/teams/delete_team" || url == "/teams/create_team" || url == "/teams/add_user_team" || url == "/teams/add_proposal" || url == "/teams/delete_proposal"){
             if (!verifyCSRF(req)) {
                return Response.json({ success: false, message: "Invalid CSRF token" }, { status: 403 });
            }
        }
        
        if (url == '/auth/login' || url == '/auth/create_account' || url == '/auth/verification' || url == '/auth/reset_password' || url == '/auth/reset_confirmation' || url == '/auth/resend_verification' || url == '/auth/resend_verification_by_token'){
           
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
        const clonedForLog = req.clone()
        try {
            return await route.handler(req,json);
        } catch(e){
            await logger.requestError(e, clonedForLog)
            console.error(e)
            return Response.json({ success: false, error: "Internal Server Error" }, { status: 500 })
        }
        
    }
}