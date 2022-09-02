export interface FetcherResponse<T> {
    data: T | null;
    errorCode?: string;
}
