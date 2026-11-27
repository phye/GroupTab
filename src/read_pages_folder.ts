import { globSync } from 'glob'
import path from 'node:path'

const pages = globSync('pages/*.html')

const entries = pages.map((file) => [path.basename(file, '.html'), file])

export const config = Object.fromEntries(entries)
