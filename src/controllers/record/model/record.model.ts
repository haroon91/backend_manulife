import {Table, Column, Model, CreatedAt, UpdatedAt} from 'sequelize-typescript'; 
@Table
export class Record extends Model<Record> {
    @Column
    public USER_NAME!: string;

    @Column
    public AGE!: number;

    @Column
    public HEIGHT!: number;

    @Column
    public GENDER!: string;

    @Column
    public SALE_AMOUNT!: number;

    @Column
    public LAST_PURCHASE_DATE!: Date;

    @Column
    @CreatedAt
    public createdAt: Date = new Date();

    @Column
    @UpdatedAt
    public updatedAt: Date = new Date();
}