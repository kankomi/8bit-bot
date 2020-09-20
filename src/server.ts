import bodyParser from 'body-parser';
import cors from 'cors';
import express from 'express';
import logger from './utils/logging';
import StreamHandler from './youtube-stream/StreamHandler';

class Server {
  private app: express.Application;

  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: true }));
    this.app.use(cors());
    this.routes();
  }

  private routes() {
    const router = express.Router();
    router.get('/songs/:id', (req, res) => {
      const guildId = req.params.id;
      if (!guildId) {
        res.status(400);
        return res.send({ error: 'guildId is undefined' });
      }
      const queue = StreamHandler.getServerQueue(guildId);

      if (!queue) {
        return res.send({ songs: [] });
      }

      return res.send({ songs: queue.songs });
    });

    router.post('/songs/:id', (req, res) => {
      const { action } = req.body;
      const guildId = req.params.id;
      if (!guildId) {
        logger.error(`guildId ${guildId} is undefined!`);
        res.status(400);
        return res.send({ error: 'guildId is undefined' });
      }

      if (!action) {
        res.status(400);
        return res.send({ error: 'action is missing' });
      }

      if (action === 'SKIP') {
        logger.info('skipping song');
        StreamHandler.skip(guildId);
        return res.sendStatus(201);
      }

      if (action === 'STOP') {
        logger.info('stopping');
        StreamHandler.stop(guildId);
        return res.sendStatus(201);
      }

      res.status(404);
      return res.send({ error: 'unknown action' });
    });

    this.app.use('/', router);
  }

  start() {
    const port = process.env.SERVER_PORT || 3000;
    this.app.listen(port, () => {
      logger.info(`Listening on port ${port}`);
    });
  }
}

export default new Server();
