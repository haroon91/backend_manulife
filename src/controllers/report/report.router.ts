import {Router, Request, Response} from 'express';
import { Op } from 'sequelize';
import { Record } from '../record/model/record.model';


const router: Router = Router();

function getDate(queryDate: any): Date {
    let [d, m, y] = queryDate.toString().trim().split('-');
    let [dd, mm, yyyy] = [parseInt(d), parseInt(m), parseInt(y)];
    let myDate = new Date(Date.UTC(yyyy,mm-1,dd));
    return myDate;
}

function isValidDate(date: any): boolean {
    return date instanceof Date && !isNaN(date.getTime());
}

function transformDate(date: Date): string {
    return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
}

router.get('/', async (req: Request, res:Response) => {
    let { startDate, endDate } = req.query;
    console.log(`Start: ${startDate}`);
    console.log(`End: ${endDate}`);

    let sDate, eDate;

    if (startDate) {
        sDate = getDate(startDate);
        if (!isValidDate(sDate)) {
            return res.status(400).send({
                errorMsg: 'Provide a valid startDate in the format: dd-mm-yyyy'
            });
        }
        sDate = transformDate(sDate);
        console.log('sDate', sDate);
    }

    if (endDate) {
        eDate = getDate(endDate); 
        if (!isValidDate(eDate)) {
            return res.status(400).send({
                errorMsg: 'Provide a valid endDate in the format: dd-mm-yyyy' 
            });
        }
        eDate = transformDate(eDate);
    }

    if (sDate && !eDate) {
        console.log('now: ', transformDate(new Date()));
        const items = await Record.findAll({ limit: 12 });
        console.log(items);
        return res.status(200).send(items);

    } else if (!sDate && eDate){

    } else if (sDate && eDate) {

    }
    res.status(200).send('/sales/report');
});


export const ReportRouter:Router = router;