export interface SuccessResponse {
    success: boolean;
    message: string;
    status: number;
}

export interface ErrorResponse {
    success: boolean;
    message: string;
    status: number;
    error?: any;
}

export interface ApiResponse<T> {
    success: boolean;
    message: string;
    status: number;
    error?: any;
    payload?: T;
}
