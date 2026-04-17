import 'dotenv/config';
import express from 'express';
import cors from 'cors'
import uploadRoutes from './routes/upload.js';
import { initDb } from './db/postgress.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads')),
app.use('/api', uploadRoutes)


// create db table if not create otherwise run server
initDb().then(() => {
    app.listen(1312, () => {
        console.log('server run in 1312 port');
    });
});