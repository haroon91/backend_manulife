import {expect} from 'chai';
import { agent as request } from 'supertest';
import app from '../src/server';
import { testData } from './testData';

const { validDate, validDate2, invalidDate1, invalidDate2, validLimit, invalidLimit, defaultLimit, validPage, invalidPage, defaultPage } = testData;
const RECORD_ENDPOINT = "/sales/record";
const REPORT_ENDPOINT = "/sales/report";

const invalidStartDateMsg = "Provide a valid startDate in the format: dd-mm-yyyy";
const invalidEndDateMsg = "Provide a valid endDate in the format: dd-mm-yyyy";
const noFileUploadedMsg = "Please upload the data file";
const fileUploadSuccessMsg = "Finished uploading file";

describe("api /sales/record testing", () => {

    it('POST /sales/record with no data file', async () => {
        const res = await request(app)
                            .post(RECORD_ENDPOINT)
        
        expect(res.status).to.equal(400);
        expect(res.body).not.to.be.empty;
        expect(res.body.errorMsg).to.equal(noFileUploadedMsg);
    });

    it('POST /sales/record with valid data file', async () => {
        const res = await request(app)
                            .post(RECORD_ENDPOINT)
                            .field('Content-Type', 'multipart/form-data')
                            .attach('dataFile', '/Users/haroonbashir/manulife/backend/test/sample.csv')

        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.msg).to.equal(fileUploadSuccessMsg);
    });

});

describe("api /sales/report testing", () => {

    it('GET /sales/report', async () => {
        const res = await request(app).get(REPORT_ENDPOINT);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.recordsPerPage).to.equal(defaultLimit);
        expect(res.body.currentPage).to.equal(defaultPage);
    });

    it('GET /sales/report with valid startDate parameter specified', async () => {
        const res = await request(app).get(`${REPORT_ENDPOINT}?startDate=${validDate2}`);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
    });

    it('GET /sales/report with valid endDate parameter specified', async () => {
        const res = await request(app).get(`${REPORT_ENDPOINT}?endDate=${validDate}`);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
    });

    it('GET /sales/report with valid startDate and endDate parameter specified', async () => {
        const res = await request(app).get(`${REPORT_ENDPOINT}?startDate=${validDate2}&endDate=${validDate}`);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
    });

    it('GET /sales/report with invalid startDate format specified', async () => {
        const res = await request(app).get(`${REPORT_ENDPOINT}?startDate=${invalidDate1}`);
        expect(res.status).to.equal(400);
        expect(res.body).not.to.be.empty;
        expect(res.body.errorMsg).to.equal(invalidStartDateMsg);
    });

    it('GET /sales/report with invalid endDate format specified', async () => {
        const res = await request(app).get(`${REPORT_ENDPOINT}?endDate=${invalidDate2}`);
        expect(res.status).to.equal(400);
        expect(res.body).not.to.be.empty;
        expect(res.body.errorMsg).to.equal(invalidEndDateMsg);
    });

    it('GET /sales/report with invalid startDate but valid endDate format specified', async () => {
        const res = await request(app).get(`${REPORT_ENDPOINT}?startDate=${invalidDate1}&endDate=${validDate2}`);
        expect(res.status).to.equal(400);
        expect(res.body).not.to.be.empty;
        expect(res.body.errorMsg).to.equal(invalidStartDateMsg);
    });

    it('GET /sales/report with valid startDate but invalid endDate format specified', async () => {
        const res = await request(app).get(`${REPORT_ENDPOINT}?startDate=${validDate2}&endDate=${invalidDate2}`);
        expect(res.status).to.equal(400);
        expect(res.body).not.to.be.empty;
        expect(res.body.errorMsg).to.equal(invalidEndDateMsg);
    });
    
    it('GET /sales/report with invalid startDate and invalid endDate format specified', async () => {
        const res = await request(app).get(`${REPORT_ENDPOINT}?startDate=${invalidDate1}&endDate=${invalidDate2}`);
        expect(res.status).to.equal(400);
        expect(res.body).not.to.be.empty;
        expect(res.body.errorMsg).to.equal(invalidStartDateMsg);
    });

    it('GET /sales/report with valid limit parameter', async () => {
        const res = await request(app).get(`${REPORT_ENDPOINT}?limit=${validLimit}`);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.recordsPerPage).to.equal(validLimit);
    });

    it('GET /sales/report with invalid limit parameter', async () => {
        const res = await request(app).get(`${REPORT_ENDPOINT}?limit=${invalidLimit}`);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.recordsPerPage).to.equal(defaultLimit);
    });

    it('GET /sales/report with valid page parameter', async () => {
        const res = await request(app).get(`${REPORT_ENDPOINT}?page=${validPage}`);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.currentPage).to.equal(validPage);
    });

    it('GET /sales/report with invalid page parameter', async () => {
        const res = await request(app).get(`${REPORT_ENDPOINT}?page=${invalidPage}`);
        expect(res.status).to.equal(200);
        expect(res.body).not.to.be.empty;
        expect(res.body.currentPage).to.equal(defaultPage);
    });

});