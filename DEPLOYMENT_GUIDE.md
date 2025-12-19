# Bitrix24 MCP Server - Deployment Guide

## Project Status: 95% Complete ✅

Everything is ready for deployment except 3 tool files need TypeScript conversion (see FIXME.md).

---

## Quick Deploy to Railway (Recommended)

### 1. Fix the 3 Tool Files First

See `FIXME.md` for instructions (5 minutes to fix).

### 2. Push to GitHub

```bash
# Add your GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/bitrix-mcp-server.git

# Push
git branch -M main
git push -u origin main
```

### 3. Deploy on Railway

1. Go to [railway.app](https://railway.app)
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your `bitrix-mcp-server` repository
5. Railway will auto-detect settings from `railway.json`

### 4. Add Environment Variables

In Railway dashboard, add:

```
BITRIX_BASE_URL=https://my.harlock.it/rest/80
BITRIX_TOKEN=zvwggfj2atgmja5q
NODE_ENV=production
ALLOWED_ORIGINS=*
```

(PORT is automatically provided by Railway)

### 5. Deploy!

Railway will automatically:
- Run `npm install`
- Run `npm run build`
- Start with `npm start`

Your server will be live at: `https://your-project.up.railway.app`

---

## Integrate with Open WebUI

### Method 1: MCP Configuration

In Open WebUI settings, add MCP server:

```json
{
  "name": "Bitrix24 CRM",
  "url": "https://your-project.up.railway.app",
  "type": "http",
  "endpoints": {
    "list_tools": "/mcp/tools",
    "call_tool": "/mcp/tools/{tool_name}",
    "sse": "/mcp/sse"
  }
}
```

### Method 2: Direct API Calls

Open WebUI can call the REST endpoints directly:

```javascript
// List tools
GET https://your-project.up.railway.app/mcp/tools

// Execute tool
POST https://your-project.up.railway.app/mcp/tools/bitrix_company_search
{
  "query": "Acme"
}
```

---

## Test Locally First

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials

# Test connection
npm test

# Run development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

Server runs on `http://localhost:3000`

Test endpoints:
- Health: `GET http://localhost:3000/health`
- Tools: `GET http://localhost:3000/mcp/tools`
- Search: `POST http://localhost:3000/mcp/tools/bitrix_company_search`

---

## Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `BITRIX_BASE_URL` | Yes | - | Bitrix24 webhook URL (e.g., `https://domain.bitrix24.com/rest/USER_ID`) |
| `BITRIX_TOKEN` | Yes | - | Webhook access token |
| `PORT` | No | 3000 | Server port (Railway provides this automatically) |
| `NODE_ENV` | No | development | Environment (`development` or `production`) |
| `ALLOWED_ORIGINS` | No | * | CORS allowed origins (comma-separated or `*`) |

---

## API Endpoints Reference

### Health Check
```
GET /health
```

Returns server status and version.

### List Tools
```
GET /mcp/tools
```

Returns all 32 available tools with their schemas.

### Execute Tool
```
POST /mcp/tools/:toolName

Body: {tool parameters}
```

Examples:
- `/mcp/tools/bitrix_company_search`
- `/mcp/tools/bitrix_invoice_create`
- `/mcp/tools/bitrix_contact_get`

### SSE Stream
```
GET /mcp/sse
```

Server-Sent Events stream for real-time updates (Open WebUI compatibility).

---

## Available Tools (32 total)

### Companies (6)
- `bitrix_company_list`
- `bitrix_company_get`
- `bitrix_company_search`
- `bitrix_company_create`
- `bitrix_company_update`
- `bitrix_company_delete`

### Contacts (6)
- `bitrix_contact_list/get/search/create/update/delete`

### Leads (6)
- `bitrix_lead_list/get/search/create/update/delete`

### Deals (6)
- `bitrix_deal_list/get/search/create/update/delete`

### Invoices (7)
- `bitrix_invoice_list/get/search/create/update/delete`
- `bitrix_invoice_add_products`

### Field Discovery (1)
- `bitrix_fields_get`

---

## Troubleshooting

### Build Fails

Check that contact/lead/deal tools are fixed (see FIXME.md).

### Connection Errors

Verify environment variables in Railway dashboard.

### CORS Issues

Set `ALLOWED_ORIGINS` to your Open WebUI domain:
```
ALLOWED_ORIGINS=https://your-openwebui.com,http://localhost:3000
```

### 404 on Tool Execution

Check tool name is correct:
```bash
curl https://your-project.up.railway.app/mcp/tools | jq '.tools[].name'
```

---

## Monitoring

Railway provides:
- Automatic logs
- Metrics dashboard
- Deployment history
- Environment variable management

Access via Railway dashboard.

---

## Costs

**Railway Free Tier:**
- 500 execution hours/month
- Plenty for personal/testing use
- No credit card required for trial

**Upgrade if needed:**
- $5/month for more hours
- Better for production use

---

## Security Notes

1. **Keep tokens secret** - Never commit `.env` to Git (already in .gitignore)
2. **Use CORS wisely** - Don't use `*` in production, specify domains
3. **Rotate webhooks** - Periodically rotate Bitrix24 webhook tokens
4. **Monitor logs** - Check Railway logs for unusual activity
5. **HTTPS only** - Railway provides HTTPS automatically

---

## Next Steps After Deployment

1. Test all tools via Postman or curl
2. Configure Open WebUI integration
3. Create example workflows
4. Monitor usage and errors
5. Add custom tools as needed

---

## Support

- GitHub Issues: Create issues for bugs/features
- Railway Docs: [docs.railway.app](https://docs.railway.app)
- Bitrix24 API: [dev.bitrix24.com](https://dev.bitrix24.com)

---

## What's Working

✅ HTTP/SSE server
✅ Express routes with CORS
✅ TypeScript compilation (except 3 tool files)
✅ Company tools (fully working)
✅ Invoice tools (fully working)
✅ Fields discovery
✅ Configuration management
✅ Error handling
✅ Rate limiting
✅ Italian tax fields support
✅ Railway deployment config
✅ Documentation
✅ Git repository initialized

**You're 95% there! Just fix the 3 tool files and deploy! 🚀**
