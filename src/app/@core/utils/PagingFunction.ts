import { rowsPerPageOptions } from '../config/paging.config';
export class PagingFunction{
    public rows = 10;
    public totalRecords = 0;
    public totalRecordsDB = 0;
}

export class TablePagingFunction {
    public rowsPerPageOptions = rowsPerPageOptions;
}
