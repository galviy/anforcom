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

        const distDir = path.join(this.publicDir, 'dist')
        const indexPath = path.join(distDir, 'index.html')

        if (pathname === '/') {
            return this.serveFile(indexPath)
        }

        // Coba serve sebagai file statis asli dulu (mis. /assets/index-abc.js, /vite.svg)
        const filePath = path.join(distDir, pathname)
        const safeTargetDir = path.resolve(distDir)
        const requestedPath = path.resolve(filePath)

        if (!requestedPath.startsWith(safeTargetDir)) {
            console.warn(`[WARNING] path traversal: ${pathname}`);
            return this.notFound;
        }

        const file = Bun.file(requestedPath)
        if (await file.exists()) {
            return this.serveFile(requestedPath)
        }

        // Bukan file statis -> anggap ini route React Router (/login, /dashboard, dst),
        // balikin index.html biar client-side routing yang nangani.
        return this.serveFile(indexPath)
    }
}