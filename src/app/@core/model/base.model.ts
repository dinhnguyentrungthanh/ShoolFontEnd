export class BaseModel {
	public id?: string;
	public createdBy?: string;
	public createdDate?: Date | number;
	public modifiedBy?: string;
	public modifiedDate?: Date;
	public version?: number;
  public status?: number;
}
