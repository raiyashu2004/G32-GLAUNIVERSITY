# G32-GLAUNIVERSITY
A repository created for the full stack exam for Super-150 Students in a hackathon based setup.
                         ┌────────────────────┐
                         │      Start         │
                         └─────────┬──────────┘
                                   │
                                   ▼
                      ┌──────────────────────────┐
                      │ User Logs Into the System│
                      └───────────┬──────────────┘
                                  │
          ┌───────────────────────┼───────────────────────────┐
          ▼                       ▼                           ▼
 ┌────────────────┐     ┌────────────────────┐      ┌──────────────────────┐
 │ Admin Dashboard│     │ Warehouse Dashboard│      │   Reports Dashboard   │
 └───────┬────────┘     └──────────┬─────────┘      └──────────┬──────────┘
         │                         │                            │
         │                         │                            │
         ▼                         ▼                            ▼
 ┌──────────────────┐      ┌──────────────────────┐    ┌────────────────────┐
 │Product Management │      │   Stock In Process   │    │  Generate Reports  │
 │ Add/Edit/Delete  │      └──────────┬───────────┘    └────────┬──────────┘
 └─────────┬────────┘                 │                         │
           │                           │                         │
           ▼                           ▼                         ▼
 ┌──────────────────┐      ┌────────────────────────┐   ┌──────────────────────┐
 │Supplier Mgmt      │      │   Enter Incoming Qty   │   │  Top Selling Items   │
 │ Add/Edit/Delete   │      │   Select Product       │   │  Dead Stock Report   │
 └─────────┬────────┘      │   Validate Entry        │   │  Category Analysis   │
           │               └──────────┬──────────────┘   └────────┬────────────┘
           │                           │                         │
           ▼                           ▼                         ▼
 ┌──────────────────┐      ┌────────────────────────┐   ┌──────────────────────┐
 │User Management   │      │   Create Transaction    │   │  Export CSV/Excel    │
 │ Create Staff IDs │      │   Log (Stock IN)        │   │  Share with Manager  │
 └─────────┬────────┘      └──────────┬──────────────┘   └────────┬────────────┘
           │                           │                         │
           │                           ▼                         │
           │                  ┌──────────────────────┐           │
           │                  │ Update Product Qty    │           │
           │                  └──────────┬────────────┘           │
           │                           │                         │
           │                           ▼                         │
           │                  ┌──────────────────────┐           │
           │                  │   Low Stock Check     │ ◄────────┘
           │                  │ If qty ≤ reorder lvl  │
           │                  └──────────┬────────────┘
           │                           │
           │                        Yes▼     No
           │                  ┌──────────────────────┐
           │                  │ Trigger Low Stock     │
           │                  │ Alert (UI/Email)      │
           │                  └──────────┬────────────┘
           │                           │
           │                           ▼
           └────────────────────────► End Workflow
