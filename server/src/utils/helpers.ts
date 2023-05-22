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

export const generatePasswordToken = () => {
    const length = 8;
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        token += characters[randomIndex];
    }

    return token;
};
