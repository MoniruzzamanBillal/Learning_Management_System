class AppError extends Error {
  public status: number;

  constructor(statusCde: number, message: string, stack = "") {
    super(message);
    this.status = statusCde;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export default AppError;
