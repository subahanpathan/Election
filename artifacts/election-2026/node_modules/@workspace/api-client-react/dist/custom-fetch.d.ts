type RequestOptions = RequestInit & {
    query?: Record<string, unknown>;
};
export declare function customFetch<T>(url: string, options: RequestOptions): Promise<T>;
export default customFetch;
