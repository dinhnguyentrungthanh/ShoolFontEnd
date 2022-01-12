export class Mapping {

  public static toResponeDeletedByIds(map: any){
    return {
      errors: Object.keys(map).filter((k: any) => !map[k]),
      successes: Object.keys(map).filter((k: any) => map[k])
    };
  }
}
