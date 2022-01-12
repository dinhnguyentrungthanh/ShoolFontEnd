import { environment as env } from '../../../environments/environment';
import { Paging } from '../model/paging.model';

export class IBaseService {

  protected API_BASE: string = env.apiUrl;

  protected sendTo(path: string): string {
    return `${this.API_BASE}/${path}`;
  }

  protected sendToUsingPaging(path: string, paging?: Paging): string {
    let query = '';
    if (paging){
      query = `?size=${paging.size}&currentPage=${paging.currentPage}`;
    }
    return `${this.API_BASE}/${path}${query}`;
  }

  protected sendToNotUsingPaging(path: string): string {
    const query =  `?isPaging=0`;
    return `${this.API_BASE}/${path}${query}`;
  }


}
