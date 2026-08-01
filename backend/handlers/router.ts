import path from 'path'
import {session_handler, isAdminToken} from "./middleware"
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
import * as ping from "./routes/user/ping"
import * as up_pembayaran from "./routes/teams/pembayaran/upload_pembayaran"
import * as del_pembayaran from "./routes/teams/pembayaran/delete_pembayaran"
import * as view_pembayaran from "./routes/teams/pembayaran/view_pembayaran"
import * as up_pernyataan from "./routes/teams/pernyataan/upload_pernyataan"
import * as del_pernyataan from "./routes/teams/pernyataan/delete_pernyataan"
import * as view_pernyataan from "./routes/teams/pernyataan/view_pernyataan"


/* admin boy */

import * as bukti_p from "./routes/admin/bukti"
import * as pembayaran from "./routes/admin/pembayaran"
import * as pernyataan from "./routes/admin/pernyataan"
import * as proposal from "./routes/admin/proposal"
import * as semua_tim from "./routes/admin/semua_tim"
import * as tim_detail from "./routes/admin/tim_detail"
import * as delete_tim from "./routes/admin/delete_tim"
import * as verif_tim from "./routes/admin/verifBerhasil"
import * as send_private_mail from "./routes/admin/send_private_mail"
import * as persebaran from "./routes/admin/persebaran"


/* Public file anjay*/

import * as panitia_akses from "./routes/panitia_akses"

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
    ['/auth/resend_verification_by_token',resend_verif_token],
    ['/user/ping',ping],
    ['/teams/pembayaran/upload_pembayaran',up_pembayaran],
    ['/teams/pembayaran/delete_pembayaran',del_pembayaran],
    ['/teams/pembayaran/view_pembayaran',view_pembayaran],
    ['/teams/pernyataan/upload_pernyataan',up_pernyataan],
    ['/teams/pembayaran/delete_pernyataan',del_pernyataan],
    ['/teams/pembayaran/view_pernyataan',view_pernyataan],


    ['/admin/bukti', bukti_p],
    ['/admin/pembayaran', pembayaran],
    ['/admin/pernyataan', pernyataan],
    ['/admin/proposal', proposal],
    ['/admin/semua_tim', semua_tim],
    ['/admin/tim_detail', tim_detail],
    ['/admin/delete_tim', delete_tim],
    ['/admin/verifBerhasil',verif_tim],
    ['/admin/send_private_mail',send_private_mail],
    ['/admin/persebaran',persebaran],


    ['/panitia_akses',panitia_akses]
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
        
        //console.log(req)
        if(!route) return this.notFound;
        if(Bun.env.DEVELOPER_MODE === 'false'){
            /*CSRF Handler*/
            if (url == "/teams/pembayaran/view_pernyataan" || url == "/teams/pembayaran/delete_pernyataan" || url == "/teams/pernyataan/upload_pernyataan" || url == "/user/me"|| url == "/user/edit" || url == "/teams/edit_user_team" || url == "/teams/delete_user_team" || url == "/teams/delete_team" || url == "/teams/create_team" || url == "/teams/add_user_team" || url == "/teams/add_proposal" || url == "/teams/delete_proposal" || url == "/user/ping"){
                if (!verifyCSRF(req)) {
                    return Response.json({ success: false, message: "Invalid CSRF token" }, { status: 403 });
                }
            }
        }   
        
        /* Endpoint public */
        if (url == "/panitia_akses" || url == '/auth/login' || url == '/auth/create_account' || url == '/auth/verification' || url == '/auth/reset_password' || url == '/auth/reset_confirmation' || url == '/auth/resend_verification' || url == '/auth/resend_verification_by_token'){
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
        /* admin akses, hanya lewat discord bot*/
        if (url == "/admin/persebaran" || url == "/admin/send_private_mail" || url == "/admin/verifBerhasil" || url == "/admin/delete_tim" || url == '/admin/bukti' || url == "/admin/pembayaran" || url == "/admin/pernyataan" || url == "/admin/proposal" || url == "/admin/semua_tim" || url == "/admin/tim_detail"){
            console.log("masuk")
            let cekadminboy = await isAdminToken(raw);
            if (!cekadminboy) {
                return Response.json({ success: false, error: "nani?" }, { status: 401 })
            }
            return route.handler(req,  "ok");
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