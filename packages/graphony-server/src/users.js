import polka from 'graphony-polka';
import { bodyParser } from './middleware/bodyParser';
import login from './middleware/login'
import register from './middleware/register';

const router = polka();

router.post('api/users/login', bodyParser, login)
router.post('api/users/register', bodyParser, register)

export default router;