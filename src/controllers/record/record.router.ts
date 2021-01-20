import {Router, Request, Response} from 'express';
import * as csv from '@fast-csv/parse';
import * as fs from 'fs';
import path from 'path';
import { Record } from './model/record.model';

const router: Router = Router();

// function csvDataValidation(data: Record): boolean {
//     const {USER_NAME, AGE, HEIGHT, GENDER, SALE_AMOUNT, LAST_PURCHASE_DATE} = data;
//     return typeof(USER_NAME) == 'string' 
//             && typeof(AGE) === 'number'
//             && typeof(HEIGHT) === 'number'
//             && typeof(GENDER) === 'string'
//             && typeof(SALE_AMOUNT) === 'number'
//             && typeof(LAST_PURCHASE_DATE.getMonth) === 'function';
// }

async function parseCSVData(filePath: string) {
    let count = 0;
    let startTime = Date.now();
    let allData: any [] = [];

    let parser = csv.parse<Record, Record>({ headers: true})
            .on("error", (error) => {
                console.error(error);
            })
            .on("data-invalid", (row, rowNumber) => {
                console.log(`Invalid [rowNumber=${rowNumber}] [row=${JSON.stringify(row)}]`);
            })
            .on("data", async (row) => {
                allData.push(row);
                if (allData.length === 10000) {
                    parser.pause()
                    await storeData(allData);
                    count += allData.length;
                    allData = [];
                    parser.resume();
                } 
            })
            .on("end", async (rowCount: number) => {
                if (allData.length > 0) {
                    await storeData(allData);
                    count += allData.length;
                }

                let totalTime = Date.now() - startTime;
                console.log(`Parsed ${rowCount} rows in ${totalTime} ms`);
            })

    fs.createReadStream(filePath).pipe(parser);
}

async function storeData(allData: any[]) {
    await Record.bulkCreate(allData);
}

router.post('/', async (req: Request, res:Response) => {
    let file: any = req.files ? req.files.dataFile : undefined;

    if (file) {
        let filePath = path.join(__dirname, file.name);
        await file.mv(filePath)
        
        await parseCSVData(filePath);
        //cleanup
        fs.unlinkSync(filePath);
        res.status(200).send({
            msg: 'Finished uploading file'
        });
    } else {
        res.status(400).send({
            errorMsg: 'Please upload the data file'
        });
    }
});


export const RecordRouter:Router = router;