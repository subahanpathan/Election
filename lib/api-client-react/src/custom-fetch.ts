export const customFetch = async <T>(
  url: string,
  options?: RequestInit,
): Promise<T> => {
  const method = options?.method?.toUpperCase() ?? "GET";
  const headers: Record<string, string> = {
    ...Object.fromEntries(
      Object.entries(options?.headers ?? {}).map(([k, v]) => [k, String(v)]),
    ),
  };

  if (method !== "GET") {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const body = await response.json();
      if (body && typeof body.error === "string") {
        message = body.error;
      }
    } catch {
      // response body is not JSON, use default message
    }
    throw new Error(message);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};
