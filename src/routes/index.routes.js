import { Router } from 'express';
import authRoute from './auth.routes.js';
import adminRoute from './admin.routes.js';
import userRoute from './user.routes.js';
import amazonRoute from './amazon.routes.js';

const router = Router();

const defaultRoutes = [
  {
    path: '/auth',
    route: authRoute,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/admin/amazon',
    route: amazonRoute,
  },
  {
    path:'/',
    route : userRoute
  }
];



defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});


export default router;