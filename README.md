                                      Shopify Product Edit Flow 
# Codem Internship Task — Product Edit Flow Overview
# Overview  :
    This project implements the Product Edit Flow for a Shopify embedded application as specified in the Codem Internship Task (Group 1). The application allows merchants to edit core product information and manage sibling product relationships, while ensuring only modified data is sent to Shopify through change-optimised mutations.

## Features

### Basic Info Tab
- Edit Product Title
- Edit Vendor
- Edit Product Type
- Edit Description
- Edit Tags
- Edit Product Status
- Edit SKU with uniqueness validation

### Siblings Tab
  - Lazy-loaded sibling product list
  - Display sibling thumbnail, title, and SKU
  - Open sibling product edit page
  - Remove sibling products
  - Save sibling relationships using Shopify metafields
  - Global Save / Discard (cross-tab)

### Global Save / Discard (cross-tab)
        Per an additional spec update during the internship, Save and Discard are implemented as a single persistent header bar
    - extracted into a shared, reusable component (SaveDiscardBar) 
    - that stays visible across bothtabs.
    - isDirty is derived from the combined form state of both tabs, not per-tab state
    - Switching tabs never resets or discards unsaved edits in the other tab
    - Save submits one combined payload covering both tabs
    - Discard reverts both tabs in a single action; if Siblings was never opened, only Basic Info resets

### Change-Optimised Updates
      The application compares current form data against the originally loaded data and executes only the required Shopify mutations. The diff is computed on the server by comparing submitted values against original values embedded as hidden fields in the form payload.
      
| Condition | Mutation |
|-----------|----------|
| Core fields changed only | productUpdate |
| SKU changed only | variantsBulkUpdate |
| Core fields + SKU changed | productUpdate + variantsBulkUpdate |
| Sibling handles changed only | Metafield Update |
| No changes detected | No mutation (no-op save) |

This prevents unnecessary API calls and preserves Shopify API rate limits.


### Error Handling
   The application implements all deterministic error messages defined in the specification:

   - Handle is required to load product
   - Handle is required to update product
   -Unauthorized session
   -Product not found
   -Invalid product payload
   - Unsupported tab
   - Unable to update product right now. Please try again.
   - Unable to load sibling tab data right now. Please try again.
   - SKU "" is already used by another product.

### Admin Extension

## The Admin Extension:
    - Reads the selected product ID from Shopify Admin
    - Resolves the product handle using GraphQL
    - Navigates to the Product Edit route
    - Closes the action modal after navigation
    - Uses centralised configuration for APP_HANDLE (defined once in config.js, never inlined)
## Acceptance Criteria Covered

| ID | Criterion | Status |
|----|-----------|--------|
| AC-01 | Exactly two tabs rendered: Basic Info and Siblings |  Done |
| AC-02 | Loader and Action contracts implemented per spec |  Done |
| AC-03 | Basic Info field updates persist correctly to Shopify |  Done |
| AC-04 | Sibling handles loaded, removed, and saved via metafield |  Done |
| AC-05 | No-op save fires zero GraphQL mutations |  Done |
| AC-06 | Duplicate SKU rejected with exact E-09 message |  Done |
| AC-07 | Partial sibling fetch failure shows banner, does not block saving |  Done |
| AC-08 | All deterministic error messages match the table verbatim |  Done |

### Tech Stack

    - React
    - Remix (React Router)
    - Shopify Admin GraphQL API
    - Shopify App Bridge
    - JavaScript
### Installation
    -npm install
    -npm run dev
### Testing
     -All critical flows and acceptance criteria are covered through testing.
## Repository
     -Developed as part of the Codem Internship Task — Group 1. 
