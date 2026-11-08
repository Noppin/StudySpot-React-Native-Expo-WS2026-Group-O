import { QueryClient } from '@tanstack/react-query';

import { isApiError } from './apiService';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Retry once for transient failures; "empty" and "invalid" will not change on retry.
      retry: (failureCount, error) =>
        failureCount < 1 && (!isApiError(error) || ['network', 'timeout', 'server'].includes(error.kind)),
      staleTime: 5 * 60_000,
      networkMode: 'always',
    },
  },
});
