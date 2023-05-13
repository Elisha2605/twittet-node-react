interface ICustomError extends Error {
    statusCode?: number;
}

export const CustomError = (
    message: string,
    statusCode: number
): ICustomError => {
    const error: ICustomError = new Error(message);
    error.statusCode = statusCode;
    return error;
};

export const ValidationError = (status: number, message: string) => {
    const validate = { status, message };
    return validate;
};
