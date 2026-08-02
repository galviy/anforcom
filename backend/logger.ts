import { mkdir, appendFile } from 'fs/promises'
import path from 'path'

const ROOT = path.join(import.meta.dir, '..')

export class Logger {
  private logDir = path.join(ROOT, 'server_logs')
  private logFile = path.join(ROOT, 'server_logs', 'error.log')


  private async write(message: string) {
    await mkdir(this.logDir, { recursive: true })
    const sekarang = new Date()
    const tanggal = sekarang.toLocaleDateString('en-CA')
    const jam = sekarang.toLocaleTimeString('en-GB', { hour12: false })
    await appendFile(this.logFile, `${tanggal} - ${jam} : ${message}\n`, 'utf-8')
  }
  async error(message: string) {
    await this.write(`[ERROR] ${message}`)
  }
  public async sendWebhook(text: string, webHookUrl: any) {
    try {
      if (Bun.env.logging_mode == "true"){
        const response = await fetch(webHookUrl, {
          method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
              content: text 
            }),
        });

        if (!response.ok) {
          throw new Error(`Discord API error: ${response.status} ${response.statusText}`);
        }
      }
    
    } catch (error) {
      console.error('Gagal mengirim pesan ke Discord:', error);
      throw error;
    }
  }
   public async requestError(err: unknown, req: any) {
    //console.log(req)
    const url = new URL(req.url)
    const method = req.method
    const route = url.pathname
    const query = url.search

    let body: string | null = null
    if (method === 'POST') {
      try {
      body = await req.text()
      //console.log('body:', body)
      } catch (e) {
    
        body = '(gagal baca body)'
      }
    }

   // console.log(body)
    const errMessage = err instanceof Error ? err.stack ?? err.message : String(err)

    const detail = [
      `[ERROR] ${method} ${route}${query}`,
      `Headers   : ${JSON.stringify(Object.fromEntries(req.headers))}`,
      body ? `Body      : ${body}` : null,
      `Error     : ${errMessage}`,
      '-----------------------------------------'
    ].filter(Boolean).join('\n')

    await this.write(detail)
  }
  
}

export const logger = new Logger()