export class ApiResponse<T = any> {
  public success: boolean;
  public message?: string;
  public data?: T;

  constructor(success: boolean, message?: string, data?: T) {
    this.success = success;
    this.message = message;
    this.data = data;
  }

  public static ok<T>(data: T, message?: string): ApiResponse<T> {
    return new ApiResponse<T>(true, message, data);
  }

  public static fail(message: string): ApiResponse<null> {
    return new ApiResponse<null>(false, message, null);
  }
}
