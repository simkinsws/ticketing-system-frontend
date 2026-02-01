---
name: scaffold-react-query
description: Generates React Query hooks and API functions based on the project's implementation patterns.
---

# React Query Resource Generator

## Description
Generates React Query hooks (queries and mutations) with corresponding API functions following the project's established patterns and conventions.

## Usage
Use this skill to quickly create new React Query resources (hooks + API functions) that follow your project's structure and best practices.

## Project Patterns

Your project uses a **two-file pattern**:
1. **API functions** in `src/api/{resource}Api.ts` - Pure API calls using axios `http` client
2. **Custom hooks** in `src/hooks/use{ResourceType}Api.ts` - React Query wrappers with caching and invalidation

## Inputs
- **resourceName** (required): The name of the resource (e.g., "User", "Ticket", "Conversation")
- **operationType** (required): Either "query" (GET) or "mutation" (POST/PUT/DELETE)
- **endpoint** (required): The API endpoint (e.g., "/api/tickets", "/api/chat/messages/send")
- **dataType** (optional): TypeScript return type name (e.g., "TicketDto", "MessageDto")
- **params** (optional): Query/mutation parameters as key-value pairs

## Instructions

### Pattern 1: Query Hooks (Read Operations)

For `useQuery` operations, follow this structure:

**Step 1: Create API function** in `src/api/{resource}Api.ts`:

```typescript
import { http } from "./http";
import type { {DataType} } from "../types/{resource}";

export const {queryKey} = "/api/{endpoint}";

export async function fetch{ResourceName}(params?: {ResourceName}Params): Promise<{DataType}[]> {
  const res = await http.get("{endpoint}", { params });
  return res.data;
}
```

**Step 2: Create hook** in `src/hooks/use{ResourceName}Api.ts`:

```typescript
import { useQuery } from "@tanstack/react-query";
import { fetch{ResourceName}, {queryKey} } from "../api/{resource}Api";

export interface {ResourceName}Params {
  // Define your parameters here
}

export const use{ResourceName} = (params?: {ResourceName}Params) => {
  return useQuery({
    queryKey: [{queryKey}, params],
    queryFn: () => fetch{ResourceName}(params),
    // Add options as needed:
    // refetchInterval: 10000,
    // staleTime: 5 * 60 * 1000,
  });
};
```

**Real Example:** `useAdminInbox`
```typescript
// src/api/chatApi.ts
export const adminInboxKey = "/api/admin/inbox";
export async function fetchAdminInbox(): Promise<ConversationListItemDto[]> {
  const res = await http.get("/api/admin/inbox");
  return res.data;
}

// src/hooks/useAdminInbox.ts
export function useAdminInbox() {
  return useQuery({
    queryKey: [adminInboxKey],
    queryFn: fetchAdminInbox,
    refetchInterval: 10000,
  });
}
```

---

### Pattern 2: Mutation Hooks (Write Operations)

For `useMutation` operations, follow this structure:

**Step 1: Create API function** in `src/api/{resource}Api.ts`:

```typescript
import { http } from "./http";
import type { {InputType}, {ResponseType} } from "../types/{resource}";

export async function {operationName}(data: {InputType}): Promise<{ResponseType}> {
  const res = await http.post("{endpoint}", data);
  return res.data;
}
```

**Step 2: Create hook** in `src/hooks/use{ResourceName}Api.ts`:

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { {operationName} } from "../api/{resource}Api";

export const use{OperationName} = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: {operationName},
    onSuccess: (data) => {
      // Invalidate related queries
      qc.invalidateQueries({ queryKey: ["{relatedQueryKey}"] });
    },
  });
};
```

**Real Example:** `useSendMessage`
```typescript
// src/api/chatApi.ts
export async function sendMessage(conversationId: string, text: string): Promise<MessageDto> {
  const res = await http.post(`/api/chat/messages/send`, { conversationId, text });
  return res.data;
}

// src/hooks/useChatMutations.ts
export function useSendMessage(conversationId: string | null) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (text: string) => {
      if (!conversationId) throw new Error("No conversationId provided");
      return await sendMessage(conversationId, text);
    },
    onSuccess: (sent) => {
      if (!conversationId) return;
      const key = [messageKey(conversationId)];
      qc.setQueryData(key, (old: MessageDto[] | undefined) => {
        const prev = (old ?? []) as MessageDto[];
        if (prev.some((m) => m.id === sent.id)) return prev;
        return [...prev, sent].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      });
      qc.invalidateQueries({ queryKey: [adminInboxKey], exact: true });
    },
  });
}
```

---

## Key Conventions

✅ **API Functions:**
- Named with `fetch{Resource}` for queries or `{action}{Resource}` for mutations
- Located in `src/api/{resource}Api.ts` 
- Pure functions that only call `http` client
- Return typed promises
- Define query key constants at top of file

✅ **Custom Hooks:**
- Named with `use{Resource}{Type}Api` (e.g., `useAdminInbox`, `useLoginApi`, `useSendMessage`)
- Located in `src/hooks/`
- Wrap React Query hooks (useQuery/useMutation)
- Use `useQueryClient()` for cache invalidation in mutations
- Return the hook result directly (don't wrap in extra logic)

✅ **Cache Invalidation:**
- Call `qc.invalidateQueries()` in mutation `onSuccess` for related queries
- Use `qc.setQueryData()` for optimistic updates when appropriate
- Pass `exact: true` to target specific query keys

✅ **Types:**
- Define API request/response types in `src/types/{resource}.ts`
- Use DTOs (Data Transfer Objects) - e.g., `MessageDto`, `ConversationListItemDto`

✅ **Configuration:**
- Add `staleTime`, `refetchInterval`, `retry` options as needed
- Disable auto-refetch with `enabled: false` for dependent queries

---

## Example Usage

**Prompt:** "Generate a query hook for fetching user profile from /api/user/profile"

**Expected Output:**
- Creates/updates `src/api/userApi.ts` with `fetchUserProfile` function
- Creates `src/hooks/useUserProfileApi.ts` with `useUserProfile` hook
- Follows project's query key patterns
- Properly typed with return types

**Prompt:** "Generate a mutation hook for updating ticket status POST to /api/tickets/update-status"

**Expected Output:**
- Creates/updates `src/api/ticketApi.ts` with `updateTicketStatus` function
- Creates `src/hooks/useUpdateTicketStatusApi.ts` with `useUpdateTicketStatus` hook
- Includes cache invalidation for ticket list queries
- Handles error cases appropriately

---

## Notes
- Always import types from `src/types/{resource}.ts`
- Use the `http` client from `src/api/http.ts` for all API calls
- Query keys should match or reference the API endpoint for consistency
- Mutations should invalidate related queries to keep cache fresh
- Add parameters interface for queries that accept filters/pagination
- Use optional chaining and null checks for dependent operations
