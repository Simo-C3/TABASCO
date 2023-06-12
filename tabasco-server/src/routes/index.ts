import { Hono } from 'hono';
import summary from './summary';
import share from './share';

const router = new Hono();
router.route('/summary', summary);
router.route('/share', share)

export default router;
