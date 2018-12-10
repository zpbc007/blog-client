export interface ServerRes<T = any> {
    data: T;
    msg?: string;
}