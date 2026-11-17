export class Utility {
  public static isEmpty(val: any): boolean {
    return val === null || val === undefined || (typeof val === 'string' && val.trim().length === 0);
  }

  public static isNotEmpty(val: any): boolean {
    return !this.isEmpty(val);
  }
}
