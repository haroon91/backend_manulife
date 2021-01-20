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

function composeApiResponse(count: Number, recordsPerPage: Number, totalPages: Number, currentPage: Number, records: Object[]): Object {
    let result = {
        totalRecords: count,
        recordsPerPage,
        totalPages,
        currentPage,
        records,
    }
    return result;
}

router.get('/', async (req: Request, res:Response) => {
    const { startDate, endDate, limit=1000, page=0 } = req.query;

    let sDate, eDate;

    let nRecords = 1000;
    let currentPage = 0;
    let offset = 0;

    if (limit) {
        nRecords = Number(limit);
        if (isNaN(nRecords)){
            nRecords = 1000;
        }
    }
    if (page) {
        currentPage = Number(page);
        offset = currentPage * nRecords;
        if (isNaN(currentPage)){
            currentPage=0;
            offset = 0;
        }
    }
    
    if (startDate) {
        sDate = getDate(startDate);
        if (!isValidDate(sDate)) {
            return res.status(400).send({
                errorMsg: 'Provide a valid startDate in the format: dd-mm-yyyy'
            });
        }
        sDate = transformDate(sDate);
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

    let items: any;
    let result: any;

    if (sDate && !eDate) {
        //find from startDate to now
        items = await Record.findAndCountAll({ 
            where: {
                LAST_PURCHASE_DATE: {
                    [Op.between]: [sDate, transformDate(new Date())]
                }
            },
            limit: nRecords,
            offset
        });

    } else if (!sDate && eDate){
        //find all from less than or equal endDate
        items = await Record.findAndCountAll({ 
            where: {
                LAST_PURCHASE_DATE: {
                    [Op.lte]: eDate
                }
            },
            limit: nRecords,
            offset
        });

    } else if (sDate && eDate) {
        items = await Record.findAndCountAll({ 
            where: {
                LAST_PURCHASE_DATE: {
                    [Op.between]: [sDate, eDate]
                }
            },
            limit: nRecords,
            offset
        });
    } else {
        //find all items
        items = await Record.findAndCountAll({ limit: nRecords, offset });
    }
    let totalPages = Math.floor((items.count / nRecords));

    result = composeApiResponse(items.count, nRecords, totalPages, currentPage, items.rows);
    return res.status(200).send(result);
});


export const ReportRouter:Router = router;