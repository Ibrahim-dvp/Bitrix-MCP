/**
 * HTTP/SSE MCP Server for Open WebUI
 */

import express, { Request, Response } from 'express';
import cors from 'cors';
import { serverConfig } from './config/index.js';
import { allTools } from './tools/index.js';
import { BitrixAPIError } from './lib/bitrix-api.js';

const app = express();

// Middleware
app.use(cors({
  origin: serverConfig.allowedOrigins.includes('*') ? '*' : serverConfig.allowedOrigins,
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    service: 'bitrix-mcp-server',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

// MCP: List tools
app.get('/mcp/tools', (_req: Request, res: Response) => {
  const tools = allTools.map((tool) => ({
    name: tool.name,
    description: tool.description,
    inputSchema: tool.inputSchema,
  }));

  res.json({
    tools,
    count: tools.length,
  });
});

// MCP: Execute tool
app.post('/mcp/tools/:toolName', async (req: Request, res: Response) => {
  const { toolName } = req.params;
  const args = req.body || {};

  try {
    // Find the tool
    const tool = allTools.find((t) => t.name === toolName);

    if (!tool) {
      return res.status(404).json({
        success: false,
        error: `Tool not found: ${toolName}`,
      });
    }

    // Execute the tool
    const result = await tool.handler(args);

    // Return the result
    return res.json(result);
  } catch (error) {
    console.error(`Error executing tool ${toolName}:`, error);

    let errorResponse = {
      success: false,
      error: (error as Error).message,
      details: {} as any,
    };

    if (error instanceof BitrixAPIError) {
      errorResponse.details = error.details;
    }

    return res.status(500).json(errorResponse);
  }
});

// SSE endpoint for streaming (Open WebUI compatibility)
app.get('/mcp/sse', (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial connection message
  res.write(`data: ${JSON.stringify({ type: 'connected', timestamp: new Date().toISOString() })}\n\n`);

  // Keep connection alive
  const keepAlive = setInterval(() => {
    res.write(`data: ${JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() })}\n\n`);
  }, 30000);

  // Cleanup on close
  req.on('close', () => {
    clearInterval(keepAlive);
    res.end();
  });
});

// Root endpoint - API documentation
app.get('/', (_req: Request, res: Response) => {
  res.json({
    service: 'Bitrix24 MCP Server',
    version: '1.0.0',
    description: 'Model Context Protocol server for Bitrix24 CRM - Open WebUI compatible',
    endpoints: {
      health: 'GET /health - Health check',
      tools: 'GET /mcp/tools - List available tools',
      execute: 'POST /mcp/tools/:toolName - Execute a tool',
      sse: 'GET /mcp/sse - Server-Sent Events stream',
    },
    toolsCount: allTools.length,
    documentation: 'https://github.com/your-repo/bitrix-mcp-server',
  });
});

export function startServer(): void {
  const port = serverConfig.port;

  app.listen(port, () => {
    console.log(`
╔═══════════════════════════════════════════════════╗
║   Bitrix24 MCP Server - Running                  ║
╚═══════════════════════════════════════════════════╝

Server:    http://localhost:${port}
Health:    http://localhost:${port}/health
Tools:     http://localhost:${port}/mcp/tools
SSE:       http://localhost:${port}/mcp/sse

Environment: ${serverConfig.nodeEnv}
Tools:       ${allTools.length} available
    `);
  });
}

export default app;
