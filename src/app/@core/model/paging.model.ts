export interface Paging {
    currentPage: number;
    size: number;
}

export class ObjectResponsePaging<T> {
    totalElements?: number;
	totalPages?: number;
	size?: number;
	currentPage?: number;
	elements?: Array<T>;
}
