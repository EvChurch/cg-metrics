interface ParentMessage {
  requestId: string;
  input: RequestInfo | URL;
  init?: RequestInit;
}

interface ParentResponse {
  requestId: string;
  ok: boolean;
  status: number;
  statusText: string;
  data?: unknown;
  error?: string;
}

const ALLOWED_ORIGINS = [
  "https://www.ev.church",
  "http://localhost:5173",
  "https://evchurch.github.io",
];

const DEFAULT_TIMEOUT = 30000;

export async function requestParentApi(
  input: RequestInfo | URL,
  init?: RequestInit,
  timeout = DEFAULT_TIMEOUT
): Promise<Response> {
  const requestId = `${String(Date.now())}-${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  return new Promise<Response>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      window.removeEventListener("message", messageHandler);
      reject(new Error("Request timeout"));
    }, timeout);

    function messageHandler(event: MessageEvent) {
      if (!ALLOWED_ORIGINS.includes(event.origin)) {
        return;
      }

      const response = event.data as ParentResponse;
      if (response.requestId !== requestId) {
        return;
      }

      clearTimeout(timeoutId);
      window.removeEventListener("message", messageHandler);

      const fetchResponse = new Response(
        JSON.stringify(response.ok ? response.data : { error: response.error }),
        {
          status: response.status,
          statusText: response.statusText,
        }
      );
      resolve(fetchResponse);
    }

    window.addEventListener("message", messageHandler);

    const message: ParentMessage = {
      requestId,
      input,
      init,
    };

    try {
      window.parent.postMessage(message, "*");
    } catch {
      window.removeEventListener("message", messageHandler);
      clearTimeout(timeoutId);
      reject(new Error("Not running in an iframe"));
    }
  });
}
