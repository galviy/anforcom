import path from 'path'

const ROOT = path.join(import.meta.dir)
import * as login from './routes/auth/login'
import * as user from './routes/user/me'
import * as c_acc from './routes/auth/create_account'
import * as c_team from './routes/teams/create_team'
import * as show_u from './routes/teams/show_team'
import * as show_t from './routes/teams/show_member_teams'
import * as del_t from './routes/teams/delete_team'
import * as del_u_t from './routes/teams/delete_user_team'

const rutercoy = new Map([
    ['/auth/login', login],
    ['/auth/create_account',c_acc],
    ['/user/me', user],
    ['/teams/create_team',c_team],
    ['/teams/show_team',show_u],
    ['/teams/show_member_teams',show_t],
    ['/teams/delete_team',del_t],
    ['/teams/delete_user_team',del_u_t]

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