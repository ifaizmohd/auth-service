import { Request, Response } from 'express';
import { BaseController } from './BaseController';

class ViewController extends BaseController {
  constructor() {
    super();
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get('*', this.renderView);
  }

  renderView(req: Request, res: Response) {
    const title: string = 'User Management System';
    try {
      if (req?.url === '/') {
        res.render('index', {
          title,
          page: 'Home',
        });
      } else {
        res.render('login', { title, page: 'Login' });
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default new ViewController().router;
