"""
Model Context Protocol (MCP) JSON-RPC 2.0 Server Handler
Handles standard JSON-RPC 2.0 protocol envelopes for tool discovery and execution.
"""
from typing import Dict, Any, Optional, List
from app.mcp.registry import tool_registry
import app.mcp.tools  # Ensure tools are registered


class MCPServer:
    @classmethod
    async def handle_json_rpc(cls, request_dict: Dict[str, Any], user_permissions: Optional[List[str]] = None) -> Dict[str, Any]:
        """
        Process JSON-RPC 2.0 request.
        Request structure: {"jsonrpc": "2.0", "id": 1, "method": "tools/call", "params": {...}}
        """
        req_id = request_dict.get("id")
        method = request_dict.get("method")
        params = request_dict.get("params") or {}

        if request_dict.get("jsonrpc") != "2.0":
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32600, "message": "Invalid Request: 'jsonrpc' must be '2.0'"}
            }

        # Method: tools/list
        if method == "tools/list":
            tools = tool_registry.list_tools()
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "result": {"tools": tools}
            }

        # Method: tools/call
        elif method == "tools/call":
            tool_name = params.get("name")
            tool_args = params.get("arguments") or {}

            tool = tool_registry.get(tool_name)
            if not tool:
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {"code": -32601, "message": f"Method not found: tool '{tool_name}' is not registered."}
                }

            try:
                result = await tool.execute(tool_args, user_permissions=user_permissions)
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {"content": result}
                }
            except PermissionError as pe:
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {"code": -32001, "message": str(pe)}
                }
            except Exception as e:
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {"code": -32603, "message": f"Internal tool error: {str(e)}"}
                }

        else:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32601, "message": f"Method not found: '{method}'"}
            }
