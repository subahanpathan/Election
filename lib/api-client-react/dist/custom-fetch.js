export async function customFetch(url, options) {
    const query = options.query;
    if (query && Object.keys(query).length > 0) {
        const searchParams = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) {
            if (value !== undefined && value !== null) {
                searchParams.append(key, String(value));
            }
        }
        const qs = searchParams.toString();
        if (qs) {
            url += (url.includes("?") ? "&" : "?") + qs;
        }
    }
    const response = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });
    if (!response.ok) {
        const detail = await response.text();
        throw new Error(`${response.status}: ${detail}`);
    }
    if (response.status === 204) {
        return undefined;
    }
    return (await response.json());
}
export default customFetch;
