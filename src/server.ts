import express from 'express';
import { sequelize } from './sequelize';

import bodyParser from 'body-parser';
import cors from 'cors';
import fileUpload from 'express-fileupload';
import { ReportRouter } from './controllers/report/report.router';
import { RecordRouter } from './controllers/record/record.router';

import { Models } from './controllers/model';

async function initializeDB () {
    await sequelize.addModels(Models);
    await sequelize.sync();
    sequelize.options.logging = false
}

initializeDB();

const app = express();

const port = process.env.PORT || 8082;

app.use(bodyParser.json());
app.use(fileUpload());
app.use(cors({
    allowedHeaders: [
        'Origin', '*'   
    ],
    methods: 'GET,PUT,POST,DELETE,HEAD,OPTIONS'
}));


app.use('/sales/record', RecordRouter);
app.use('/sales/report', ReportRouter);


app.listen(port, () => {
    console.log(`Server running on ${port}`);
});

export default app;