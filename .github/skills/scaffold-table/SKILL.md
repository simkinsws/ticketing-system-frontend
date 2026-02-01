---
name: scaffold-table
description: Generates a responsive table component with pagination, row selection, and actions using TanStack Table and SCSS styling.
---

# Scaffold Responsive Table Component

## Description
Generates a fully featured, responsive table component using TanStack Table (Headless UI) with built-in support for row selection, actions, pagination, loading states, and empty states. Works seamlessly on both desktop and mobile with proper scrolling behavior.

## Technology Stack
- **TanStack Table (React Table)** v8.21.3 - Headless table logic
- **SCSS** - Styling with CSS variables from design system
- **React Bootstrap** - Spinner for loading states
- **React Query** - Data fetching (if needed)

## Inputs
- **resourceName** (required): Singular resource name (e.g., "Ticket", "User", "Invoice")
- **tableName** (required): Display name for table (e.g., "Support Tickets", "User List")
- **fields** (required): Array of fields to display with types (e.g., "id: string", "title: string", "status: number")
- **rowActions** (required): Array of actions (e.g., ["view", "edit", "delete"])
- **withPagination** (required): true/false - Enable pagination

## Architecture

### File Structure
```
src/components/Tables/
├── {ResourceName}Table.tsx       (Main component)
├── styles/
│   └── {ResourceName}Table.scss  (Styling)
└── types.ts                       (Optional: Local types)

src/hooks/
└── use{ResourceName}TableApi.ts   (Data fetching hook)

src/api/
└── {resource}Api.ts               (API calls)
```

## Implementation Patterns

### Pattern: Data Types & Interfaces

Create types in your hook or API file:

```typescript
// src/types/{resource}.ts
export interface {ResourceName}Dto {
  id: string;
  [field: string]: any;
}

// For table row actions
export type RowAction = "view" | "edit" | "delete";
```

### Pattern 1: Simple Query-Based Table (No Pagination)

**Step 1: Create the Hook** (`src/hooks/use{ResourceName}TableApi.ts`):

```typescript
import { useQuery } from "@tanstack/react-query";
import { fetch{ResourceNames} } from "../api/{resource}Api";
import type { {ResourceName}Dto } from "../types/{resource}";

export const use{ResourceName}Table = () => {
  return useQuery<{ResourceName}Dto[]>({
    queryKey: ["/api/{resources}"],
    queryFn: fetch{ResourceNames},
  });
};
```

**Step 2: Create the Component** (`src/components/Tables/{ResourceName}Table.tsx`):

```typescript
import { useMemo, useState } from "react";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import { LoadingSpinner } from "../shared/LoadingSpinner";
import { use{ResourceName}Table } from "../../hooks/use{ResourceName}TableApi";
import type { {ResourceName}Dto } from "../../types/{resource}";
import "./styles/{ResourceName}Table.scss";

type RowAction = "view" | "edit" | "delete";

const columnHelper = createColumnHelper<{ResourceName}Dto>();

const {ResourceName}Table = () => {
  const { data = [], isLoading, isError } = use{ResourceName}Table();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const columns = [
    // Selection column
    {
      id: "select",
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          aria-label="Select all rows"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          aria-label={`Select row ${row.id}`}
        />
      ),
      size: 50,
    },
    // Data columns
    columnHelper.accessor("id", {
      header: "ID",
      size: 100,
    }),
    columnHelper.accessor("title", {
      header: "Title",
      size: 200,
    }),
    columnHelper.accessor("status", {
      header: "Status",
      size: 120,
    }),
    // Actions column
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <ActionMenu row={row} onAction={(action) => handleAction(row, action)} />
      ),
      size: 80,
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: { rowSelection },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  const handleAction = (row: any, action: RowAction) => {
    console.log(`${action} row:`, row.original);
    // Implement your action handlers
  };

  if (isLoading) {
    return (
      <div className="{resource-name-kebab}-table-container loading">
        <LoadingSpinner /> Loading {tableName}…
      </div>
    );
  }

  if (isError) {
    return (
      <div className="{resource-name-kebab}-table-container error">
        Failed to load {tableName}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="{resource-name-kebab}-table-container empty">
        <p>No {resources} found</p>
      </div>
    );
  }

  return (
    <div className="{resource-name-kebab}-table-container">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} style={{ width: header.getSize() }}>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext()
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className={row.getIsSelected() ? "selected" : ""}>
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Action menu component
function ActionMenu({
  row,
  onAction,
}: {
  row: any;
  onAction: (action: RowAction) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="action-menu">
      <button
        className="menu-trigger"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open actions menu"
      >
        ⋮
      </button>
      {isOpen && (
        <div className="menu-dropdown">
          <button onClick={() => { onAction("view"); setIsOpen(false); }}>
            View
          </button>
          <button onClick={() => { onAction("edit"); setIsOpen(false); }}>
            Edit
          </button>
          <button onClick={() => { onAction("delete"); setIsOpen(false); }}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

export default {ResourceName}Table;
```

**Step 3: Create SCSS** (`src/components/Tables/styles/{ResourceName}Table.scss`):

```scss
@import "../../../assets/variables.scss";

.{resource-name-kebab}-table-container {
  background: var(--bg-main);
  border-radius: 8px;
  overflow: hidden;
  
  &.loading,
  &.error,
  &.empty {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    color: var(--text-muted);
    font-size: 1rem;
  }

  .table-wrapper {
    overflow-x: auto;
    border: 1px solid var(--border-main);

    .data-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.9rem;

      thead {
        background-color: var(--table-header-bg);
        border-bottom: 1px solid var(--border-main);

        th {
          padding: 12px 16px;
          text-align: left;
          font-weight: 600;
          color: var(--table-header-text);
          white-space: nowrap;
        }
      }

      tbody {
        tr {
          border-bottom: 1px solid var(--border-main);
          transition: background-color 0.2s;

          &:hover {
            background-color: var(--bg-secondary);
          }

          &.selected {
            background-color: var(--badge-background-light-blue);
          }

          td {
            padding: 12px 16px;
            color: var(--text-body);
          }

          input[type="checkbox"] {
            cursor: pointer;
          }
        }
      }
    }
  }

  .action-menu {
    position: relative;

    .menu-trigger {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      padding: 4px 8px;
      color: var(--text-secondary);

      &:hover {
        color: var(--text-heading);
      }
    }

    .menu-dropdown {
      position: absolute;
      top: 100%;
      right: 0;
      background: var(--bg-main);
      border: 1px solid var(--border-main);
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      z-index: 10;
      min-width: 120px;

      button {
        display: block;
        width: 100%;
        padding: 8px 12px;
        border: none;
        background: none;
        text-align: left;
        cursor: pointer;
        color: var(--text-body);
        font-size: 0.9rem;

        &:hover {
          background-color: var(--bg-secondary);
        }

        &:first-child {
          border-radius: 4px 4px 0 0;
        }

        &:last-child {
          border-radius: 0 0 4px 4px;
        }
      }
    }
  }
}

// Mobile responsive
@media (max-width: 768px) {
  .{resource-name-kebab}-table-container {
    .table-wrapper {
      overflow-x: auto;
      -webkit-overflow-scrolling: touch;
    }

    .data-table {
      font-size: 0.85rem;

      th,
      td {
        padding: 10px 12px;
      }
    }
  }
}
```

---

### Pattern 2: Paginated Table

For pagination, use `getPaginationRowModel()`:

```typescript
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  state: { rowSelection },
  enableRowSelection: true,
  onRowSelectionChange: setRowSelection,
  initialState: {
    pagination: {
      pageIndex: 0,
      pageSize: 10,
    },
  },
});

// Add pagination controls
<div className="pagination">
  <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
    Previous
  </button>
  <span>
    Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
  </span>
  <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
    Next
  </button>
</div>
```

---

## Key Features Implemented

✅ **Row Selection**
- Checkbox column with select-all functionality
- Individual row selection with visual feedback
- Tracked via React state

✅ **Responsive Design**
- Desktop: Full table layout with all columns visible
- Mobile: Same table with horizontal scroll on overflow-x
- Touch-friendly controls

✅ **Loading & Empty States**
- Loading spinner with message
- Empty state message when no data
- Error state handling

✅ **Action Menu**
- Three-dot menu (⋮) with dropdown
- Actions: View, Edit, Delete
- Easy to customize

✅ **Styling**
- Uses CSS variables from design system
- Hover effects on rows
- Selected row highlighting
- Clean, professional appearance

✅ **TanStack Table Features**
- Column sizing control
- Header customization
- Cell rendering flexibility
- Type-safe column definitions

---

## Usage Examples

**Prompt:** "Scaffold a table for Users with fields: id, name, email, role and actions: view, edit, delete without pagination"

**Expected Output:**
- `src/components/Tables/UserTable.tsx` with full table logic
- `src/components/Tables/styles/UserTable.scss` with responsive styling
- `src/hooks/useUserTableApi.ts` with data fetching
- All integrated with TanStack Table and row selection

**Prompt:** "Create a paginated table for Tickets with fields: id, title, status, priority and add pagination with 10 rows per page"

**Expected Output:**
- Table component with `getPaginationRowModel()`
- Pagination controls (Previous/Next buttons)
- Page indicator
- All styling properly scoped

---

## Notes
- Column width can be customized via `size` property
- Action handlers should be implemented in parent component or via callbacks
- Use TypeScript interfaces for data types
- CSS variables ensure consistent styling across app
- Mobile scroll is smooth with `-webkit-overflow-scrolling: touch`
- All interactive elements have aria-labels for accessibility
- Row selection state is managed locally - connect to backend as needed
