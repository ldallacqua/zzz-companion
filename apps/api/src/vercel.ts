import { getRequestListener } from '@hono/node-server'
import app from './index'

/**
 * Vercel Node.js function: adapts the fetch handler to Node's (req, res). Bundled into one file
 * by `scripts/build-vercel.mjs`, which routes every path here.
 */
export default getRequestListener(app.fetch)
