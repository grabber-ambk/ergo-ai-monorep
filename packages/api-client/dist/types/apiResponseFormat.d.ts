export interface ApiResponseFormat<T> {
    data: T;
    message: string;
    status: number;
    success: boolean;
}
