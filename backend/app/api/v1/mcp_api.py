"""
Model Context Protocol (MCP) Gateway API Router
Exposes JSON-RPC 2.0 protocol endpoint for MCP tools discovery and execution.
"""
from typing import Dict, Any
from fastapi import APIRouter, Body
from app.mcp.server import MCPServer

router = APIRouter(prefix="/mcp", tags=["Model Context Protocol"])


@router.post("")
async def mcp_json_rpc_endpoint(payload: Dict[str, Any] = Body(...)):
    """JSON-RPC 2.0 endpoint for MCP requests (e.g. tools/list, tools/call)."""
    return await MCPServer.handle_json_rpc(payload)
