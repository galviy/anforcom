import { mkdir, appendFile } from 'fs/promises'
import path from 'path'

const ROOT = path.join(import.meta.dir, '..')

export class Logger {
  private logDir = path.join(ROOT, 'server_logs')
  private logFile = path.join(ROOT, 'server_logs', 'error.log')

  async error(message: string) {
    await mkdir(this.logDir, { recursive: true })
    const sekarang = new Date();
    const tanggal = sekarang.toLocaleDateString('en-CA'); 
    const jam = sekarang.toLocaleTimeString('en-GB', { hour12: false });
    await appendFile(this.logFile, `${tanggal} - ${jam} : ${message}\n`, 'utf-8');

  }
}