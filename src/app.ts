import express, { Application, Response, NextFunction } from 'express';
import winstonLogger from './startup/logging';
import config from './startup/config';
import routes from './startup/routes';
import { sequelize } from './startup/database';
import { User, UserRequest } from './models/user';
import * as reqErrors from './util/requestErrors';

const app: Application = express();

global.logger = winstonLogger;

// Set user in request.
app.use(async (req: UserRequest, res: Response, next: NextFunction) => {
  const user = await User.findByPk(1);
  if (!user) {
    reqErrors.serverError(res, 'Base User not found.');
  } else {
    req.user = user!;
    next();
  }
});

config();
routes(app);

const startServer = async () => {
  await sequelize.sync();
  // sequelize.sync({ force: true });

  // Ensure we have base user in database.
  const user = await User.findByPk(1);
  if (!user) {
    await User.create({ name: 'Keith', email: 'test@test.com' });
  }

  const port = process.env.PORT || 3000;
  return app.listen(port, () => {
    logger.info(`LOGGER Listening on port ${port}...`);
  });
};

const server = startServer();

export default server;
