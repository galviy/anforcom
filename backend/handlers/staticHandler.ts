import path from 'path'

const ROOT = path.join(import.meta.dir)


export class StaticHandler {
    private publicDir: string

    constructor() {
        this.publicDir = path.join(ROOT, '../../frontend/')
    }
    private get notFound(): Response{
        return new Response(null, {status:404});
    }


    private async serveFile(filePath: string): Promise<Response> {
        const file = Bun.file(filePath)

        if (!(await file.exists())) {
            return this.notFound;
        }
        return new Response(file, {
            headers: {
                "Content-Type": file.type,
                 "Cache-Control": "public, max-age=86400, immutable"
            }
        });
    }
  

    async handle(req: Request,pathname: string): Promise<Response> {
        

        console.log(req)
        
        if (pathname === '/') {
            const indexPath = path.join(this.publicDir + "/dist/", 'index.html')
           // console.log(indexPath)
            return this.serveFile(indexPath)
        }

    
        if (pathname.startsWith('/dist/')) {
         
            const filePath = path.join(this.publicDir, pathname)
            
            const safeTargetDir = path.resolve(this.publicDir, "dist");
            const requestedPath = path.resolve(this.publicDir, `.${pathname}`);

       
            if (!requestedPath.startsWith(safeTargetDir)) {
                console.warn(`[WARNING] path traversal: ${pathname}`);
                return this.notFound; 
            }

            return this.serveFile(filePath)
        }
    
        return this.notFound;
    }
}