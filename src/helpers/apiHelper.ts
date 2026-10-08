export const getAccessToken = (): string | null => {
  if (typeof window === "undefined" || !window.localStorage) {
    return null;
  }
  return localStorage.getItem("accessToken");
};

export const putAccessToken = (token: string): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.setItem("accessToken", token);
  }
};

export const removeAccessToken = (): void => {
  if (typeof window !== "undefined" && window.localStorage) {
    localStorage.removeItem("accessToken");
  }
};

export const getBaseUrl = (): string => {
  return "https://open-api.delcom.org/api/v1";
};

export interface FetchOptions extends RequestInit {
  requiresAuth?: boolean;
}

export const fetchApi = async <T = any>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> => {
  const { requiresAuth = true, headers = {}, ...restOptions } = options;
  const baseUrl = getBaseUrl();
  const url = endpoint.startsWith("http") ? endpoint : `${baseUrl}${endpoint}`;

  const requestHeaders: Record<string, string> = {
    ...(headers as Record<string, string>)
  };

  if (requiresAuth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(url, {
    ...restOptions,
    headers: requestHeaders
  });

  let responseData: any;
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    responseData = await response.json();
  } else {
    responseData = await response.text();
  }

  if (!response.ok) {
    const errorMessage =
      (responseData && typeof responseData === "object" && responseData.message) ||
      `Request failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  return responseData as T;
};

