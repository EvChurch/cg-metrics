# Parent Window API Implementation Guide

This document describes what needs to be implemented on the parent window to handle API requests from the iframe.

## Overview

The iframe sends postMessage requests to the parent window, which should:
1. Receive the message
2. Execute the fetch request
3. Send the response back to the iframe

## Message Format

### Incoming Message (from iframe)

The iframe sends messages with the following structure:

```typescript
interface ParentMessage {
  requestId: string;        // Unique identifier for this request
  input: RequestInfo | URL; // URL string or Request object (same as fetch first param)
  init?: RequestInit;       // Optional fetch options (same as fetch second param)
}
```

### Outgoing Response (to iframe)

The parent must respond with:

```typescript
interface ParentResponse {
  requestId: string;        // Must match the requestId from the request
  ok: boolean;              // Whether the fetch was successful
  status: number;           // HTTP status code
  statusText: string;       // HTTP status text
  data?: unknown;          // Response data (if ok is true)
  error?: string;          // Error message (if ok is false)
}
```

## Implementation

### Basic Example

```javascript
window.addEventListener('message', async (event) => {
  // Validate origin for security
  const allowedOrigins = [
    'https://www.ev.church',
    'http://localhost:5173',
    'https://evchurch.github.io'
  ];
  
  if (!allowedOrigins.includes(event.origin)) {
    return;
  }

  // Check if this is an API request
  const message = event.data;
  if (!message.requestId || !message.input) {
    return; // Not an API request, ignore
  }

  try {
    // Execute the fetch request
    const response = await fetch(message.input, message.init);
    
    // Parse response data
    const data = await response.json();
    
    // Send success response back to iframe
    event.source.postMessage({
      requestId: message.requestId,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: data
    }, event.origin);
    
  } catch (error) {
    // Send error response back to iframe
    event.source.postMessage({
      requestId: message.requestId,
      ok: false,
      status: 0,
      statusText: 'Network Error',
      error: error.message || 'Request failed'
    }, event.origin);
  }
});
```

### TypeScript Example

```typescript
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
  'https://www.ev.church',
  'http://localhost:5173',
  'https://evchurch.github.io'
];

window.addEventListener('message', async (event: MessageEvent) => {
  if (!ALLOWED_ORIGINS.includes(event.origin)) {
    return;
  }

  const message = event.data as ParentMessage;
  
  // Validate message structure
  if (!message.requestId || !message.input) {
    return;
  }

  try {
    const response = await fetch(message.input, message.init);
    const data = await response.json();

    const responseMessage: ParentResponse = {
      requestId: message.requestId,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: data
    };

    if (event.source && 'postMessage' in event.source) {
      event.source.postMessage(responseMessage, event.origin);
    }
  } catch (error) {
    const responseMessage: ParentResponse = {
      requestId: message.requestId,
      ok: false,
      status: 0,
      statusText: 'Network Error',
      error: error instanceof Error ? error.message : 'Request failed'
    };

    if (event.source && 'postMessage' in event.source) {
      event.source.postMessage(responseMessage, event.origin);
    }
  }
});
```

## Important Considerations

### 1. Origin Validation

Always validate the `event.origin` to ensure messages are coming from trusted sources. The iframe expects these origins:
- `https://www.ev.church`
- `http://localhost:5173`
- `https://evchurch.github.io`

### 2. Response Format

- **Success**: Set `ok: true` and include the parsed data in `data`
- **Failure**: Set `ok: false` and include error details in `error`
- Always include `status`, `statusText`, and the matching `requestId`

### 3. Response Parsing

The example uses `response.json()`, but you may need to handle different content types:

```javascript
let data;
const contentType = response.headers.get('content-type');
if (contentType?.includes('application/json')) {
  data = await response.json();
} else if (contentType?.includes('text/')) {
  data = await response.text();
} else {
  data = await response.blob();
}
```

### 4. Error Handling

Handle both network errors and HTTP error status codes:

```javascript
try {
  const response = await fetch(message.input, message.init);
  const data = await response.json();
  
  // Even if fetch succeeds, check response.ok
  if (!response.ok) {
    throw new Error(data.error || `HTTP ${response.status}`);
  }
  
  // Send success response
  // ...
} catch (error) {
  // Send error response
  // ...
}
```

### 5. Request ID Matching

The `requestId` must be included in the response exactly as received. This allows the iframe to match responses to requests.

## Complete Example with Error Handling

```javascript
window.addEventListener('message', async (event) => {
  const ALLOWED_ORIGINS = [
    'https://www.ev.church',
    'http://localhost:5173',
    'https://evchurch.github.io'
  ];
  
  if (!ALLOWED_ORIGINS.includes(event.origin)) {
    return;
  }

  const message = event.data;
  
  // Only handle API requests
  if (!message || typeof message.requestId !== 'string' || !message.input) {
    return;
  }

  if (!event.source || typeof event.source.postMessage !== 'function') {
    return;
  }

  try {
    const response = await fetch(message.input, message.init);
    
    let data;
    const contentType = response.headers.get('content-type') || '';
    
    if (contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType.includes('text/')) {
      data = await response.text();
    } else {
      data = await response.blob();
    }

    event.source.postMessage({
      requestId: message.requestId,
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      data: response.ok ? data : undefined,
      error: response.ok ? undefined : (data?.error || `HTTP ${response.status}`)
    }, event.origin);
    
  } catch (error) {
    event.source.postMessage({
      requestId: message.requestId,
      ok: false,
      status: 0,
      statusText: 'Network Error',
      error: error instanceof Error ? error.message : 'Request failed'
    }, event.origin);
  }
});
```

## Testing

To test the implementation:

1. Load the parent page with the iframe
2. In the iframe console, call:
   ```javascript
   import { requestParentApi } from './utils/parentApi';
   const response = await requestParentApi('/api/test');
   console.log(await response.json());
   ```
3. Check the parent window console for the received message
4. Verify the response is sent back correctly

