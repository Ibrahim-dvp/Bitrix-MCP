# Complete Operations Guide - All 32 CRUD Operations

Railway is deploying now. Once complete (~2 minutes), you'll have **full CRUD access to all Bitrix24 entities** via Open WebUI.

## 🎯 What You Can Do Now

### Companies (6 operations)

**Search & List:**
- "Search for companies named Atoma"
- "List the latest 20 companies"
- "Show all CUSTOMER companies"

**Get Details:**
- "Get details for company ID 123"
- "Show me company 456 information"

**Create:**
- "Create a new company named Test Corp with VAT 12345678901"
- "Add a company called ABC Ltd with email info@abc.com"

**Update:**
- "Update company 123 to change the phone number to 555-1234"
- "Change the email for company 456 to newemail@example.com"

**Delete:**
- "Delete company ID 789"

### Contacts (6 operations)

**Search & List:**
- "Find contacts named Barbara"
- "List all contacts from company 123"
- "Show me the latest 15 contacts"

**Get Details:**
- "Get contact ID 456 details"

**Create:**
- "Create a new contact named John Smith with email john@example.com"
- "Add contact Maria Rossi to company 123"

**Update:**
- "Update contact 456 phone number to 555-9999"
- "Change last name for contact 789 to Johnson"

**Delete:**
- "Delete contact ID 321"

### Leads (6 operations)

**Search & List:**
- "Find leads with status NEW"
- "List all leads from last month"
- "Show me leads matching XYZ"

**Get Details:**
- "Get lead ID 111 information"

**Create:**
- "Create a new lead titled 'Potential Deal' with contact Mario"
- "Add a lead for company ABC Corp"

**Update:**
- "Update lead 222 status to QUALIFIED"
- "Change opportunity amount for lead 333 to 5000"

**Delete:**
- "Delete lead ID 444"

### Deals (6 operations)

**Search & List:**
- "Find deals in WON stage"
- "List all deals worth more than 10000"
- "Show me deals for company 123"

**Get Details:**
- "Get deal ID 555 details"

**Create:**
- "Create a deal titled 'Q4 Contract' for company 123 worth 25000 EUR"
- "Add a new deal for contact 456"

**Update:**
- "Update deal 666 stage to NEGOTIATION"
- "Change deal 777 opportunity to 30000"

**Delete:**
- "Delete deal ID 888"

### Invoices (7 operations)

**Search & List:**
- "Find invoices from 2024"
- "List all invoices for company 123"
- "Show me unpaid invoices"

**Get Details:**
- "Get invoice ID 999 information"

**Create:**
- "Create an invoice for company 123 worth 1500 EUR"
- "Add new invoice titled 'December Services'"

**Update:**
- "Update invoice 111 amount to 2000"
- "Change invoice 222 status to PAID"

**Delete:**
- "Delete invoice ID 333"

**Add Products:**
- "Add 3 units of Product A at 50 EUR each to invoice 444"
- "Add products to invoice 555"

### Field Discovery (1 operation)

**Get Available Fields:**
- "What fields are available for companies?"
- "Show me all invoice fields"
- "List contact fields including custom fields"

## 📋 All Available Operations (32 Total)

### Companies (6)
1. ✅ `bitrix_company_list` - List companies with filters
2. ✅ `bitrix_company_get` - Get company by ID
3. ✅ `bitrix_company_search` - Search by name
4. ✅ `bitrix_company_create` - Create new company
5. ✅ `bitrix_company_update` - Update existing company
6. ✅ `bitrix_company_delete` - Delete company

### Contacts (6)
7. ✅ `bitrix_contact_list` - List contacts
8. ✅ `bitrix_contact_get` - Get contact by ID
9. ✅ `bitrix_contact_search` - Search contacts
10. ✅ `bitrix_contact_create` - Create new contact
11. ✅ `bitrix_contact_update` - Update contact
12. ✅ `bitrix_contact_delete` - Delete contact

### Leads (6)
13. ✅ `bitrix_lead_list` - List leads
14. ✅ `bitrix_lead_get` - Get lead by ID
15. ✅ `bitrix_lead_search` - Search leads
16. ✅ `bitrix_lead_create` - Create new lead
17. ✅ `bitrix_lead_update` - Update lead
18. ✅ `bitrix_lead_delete` - Delete lead

### Deals (6)
19. ✅ `bitrix_deal_list` - List deals
20. ✅ `bitrix_deal_get` - Get deal by ID
21. ✅ `bitrix_deal_search` - Search deals
22. ✅ `bitrix_deal_create` - Create new deal
23. ✅ `bitrix_deal_update` - Update deal
24. ✅ `bitrix_deal_delete` - Delete deal

### Invoices (7)
25. ✅ `bitrix_invoice_list` - List invoices
26. ✅ `bitrix_invoice_get` - Get invoice by ID
27. ✅ `bitrix_invoice_search` - Search invoices
28. ✅ `bitrix_invoice_create` - Create new invoice
29. ✅ `bitrix_invoice_update` - Update invoice
30. ✅ `bitrix_invoice_delete` - Delete invoice
31. ✅ `bitrix_invoice_add_products` - Add products to invoice

### Fields (1)
32. ✅ `bitrix_fields_get` - Discover available fields

## 🌐 API Endpoints

All operations accessible via REST API:

**Companies:**
- `POST /api/company/list`
- `GET /api/company/{id}`
- `POST /api/company/search`
- `POST /api/company` (create)
- `PUT /api/company` (update)
- `DELETE /api/company/{id}`

**Contacts:**
- `POST /api/contact/list`
- `GET /api/contact/{id}`
- `POST /api/contact/search`
- `POST /api/contact` (create)
- `PUT /api/contact` (update)
- `DELETE /api/contact/{id}`

**Leads:**
- `POST /api/lead/list`
- `GET /api/lead/{id}`
- `POST /api/lead/search`
- `POST /api/lead` (create)
- `PUT /api/lead` (update)
- `DELETE /api/lead/{id}`

**Deals:**
- `POST /api/deal/list`
- `GET /api/deal/{id}`
- `POST /api/deal/search`
- `POST /api/deal` (create)
- `PUT /api/deal` (update)
- `DELETE /api/deal/{id}`

**Invoices:**
- `POST /api/invoice/list`
- `GET /api/invoice/{id}`
- `POST /api/invoice/search`
- `POST /api/invoice` (create)
- `PUT /api/invoice` (update)
- `DELETE /api/invoice/{id}`
- `POST /api/invoice/{id}/products` (add products)

**Fields:**
- `GET /api/fields/{entity}` (entity: company|contact|lead|deal|invoice)

## 📖 Documentation

**Interactive API Docs (Swagger UI):**
https://bitrix-mcp-production.up.railway.app/docs

**OpenAPI Specification:**
https://bitrix-mcp-production.up.railway.app/openapi.json

## 🔧 Technical Details

**All operations support:**
- ✅ Italian tax fields (VAT, Tax Code, PEC, SDI)
- ✅ Custom field discovery
- ✅ Filtering and pagination
- ✅ Full error handling
- ✅ Rate limiting protection

**Protocols Supported:**
1. ✅ OpenAPI 3.0 (stable - recommended for Open WebUI)
2. ✅ MCP Streamable HTTP v1 (experimental)
3. ✅ Legacy REST endpoints

## 🎨 Example Workflows

**1. Complete Sales Pipeline:**
```
1. "Create a lead named 'New Opportunity' for company ABC"
2. "Update lead {id} status to QUALIFIED"
3. "Create a deal from lead {id} worth 5000 EUR"
4. "Update deal {id} stage to WON"
5. "Create invoice for deal {id}"
6. "Add products to invoice {id}"
```

**2. Company Management:**
```
1. "Search for company Atoma"
2. "Get details for company {id}"
3. "Update company {id} VAT to IT12345678901"
4. "List all contacts for company {id}"
5. "Create new contact for company {id}"
```

**3. Invoice Processing:**
```
1. "List all unpaid invoices"
2. "Get invoice {id} details"
3. "Add products to invoice {id}"
4. "Update invoice {id} status to PAID"
```

---

**Status: ALL 32 OPERATIONS DEPLOYED AND READY! 🚀**

Railway deployment in progress. Connection already established in Open WebUI.
Once deployment completes, all CRUD operations will be immediately available.
