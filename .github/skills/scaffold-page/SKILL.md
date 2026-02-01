---
name: scaffold-page
description: Scaffolds a new page component with proper routing, role-based access control, and layout structure following the project's conventions.
---

# Scaffold New Page

## Description
Scaffolds a new page component with proper routing, role-based access control, and layout structure following the project's conventions.

## Usage
Use this skill to quickly create a new page in the ticketing application with all necessary boilerplate and routing configuration.

## Inputs
- **pageName** (required): The name of the page component (e.g., "TicketList", "UserProfile")
- **routePath** (required): The route path for the page (e.g., "/customer/tickets", "/admin/users")
- **role** (required): Required role to access the page - either "Customer" or "Admin"

## Instructions

When scaffolding a new page, follow these steps:

### 1. Create the Page Component

Determine the correct folder based on the role:
- **Admin pages**: `src/pages/Admin/`
- **Customer pages**: `src/pages/Customer/`

Create the page component file: `src/pages/{Role}/{PageName}.tsx`

Use this template:

```tsx
import "./styles/{PageName}.scss";

export const {PageName} = () => {
  return (
    <div className="{page-name-kebab}-container">
      <h1>{Page Title}</h1>
      {/* Page content goes here */}
    </div>
  );
};

```

### 2. Create the SCSS File

Create the corresponding stylesheet: `src/pages/{Role}/styles/{PageName}.scss`

Use this template:

```scss
.{page-name-kebab}-container {
  // Add your styles here
}
```

**Notes:**
- Use kebab-case for class names matching the component name
- Import `variables.scss` as in the all scss files in the project
- Keep styles minimal initially - add complexity as needed

### 3. Add Route to App.tsx

Open `src/App.tsx` and:

1. Add import statement at the top with other page imports (after auth imports, before the default export):
```tsx
import {PageName} from "./pages/{Role}/{PageName}";
```

2. Add the route within the appropriate `<RequireRole>` wrapper:

**For Customer pages**, add within the Customer routes section:
```tsx
{/* Customer routes */}
<Route element={<RequireRole allowedRoles={["Customer"]} />}>
  {/* ...existing routes... */}
  <Route path="{routePath}" element={<{PageName} />} />
</Route>
```

**For Admin pages**, add within the Admin routes section:
```tsx
{/* Admin-only routes */}
<Route element={<RequireRole allowedRoles={["Admin"]} />}>
  {/* ...existing routes... */}
  <Route path="{routePath}" element={<{PageName} />} />
</Route>
```

## Example Usage

**Prompt:** "Scaffold a new page called TicketList for customers at /customer/tickets"

**Expected Output:**
- Creates `src/pages/Customer/TicketList.tsx`
- Creates `src/pages/Customer/styles/TicketList.scss`
- Adds import and route to `src/App.tsx` within Customer routes section

## Notes
- Page names should be in PascalCase (e.g., TicketList, UserProfile)
- Route paths should start with `/customer/` or `/admin/` based on the role
- Always create the corresponding SCSS file in the styles subdirectory
- Use kebab-case for CSS class names (convert PascalCase: TicketList → ticket-list-container)
- The project doesn't use React.FC or explicit prop interfaces for simple components
- Keep components minimal - the project follows a simple, pragmatic structure
- Ensure proper indentation (2 spaces) when adding routes to App.tsx
- The RequireRole component handles authentication and authorization automatically
