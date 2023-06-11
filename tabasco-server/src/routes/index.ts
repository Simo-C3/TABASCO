import { Hono } from 'hono';
import summary from './summary';

const router = new Hono();
router.route('/summary', summary);

export default router;
