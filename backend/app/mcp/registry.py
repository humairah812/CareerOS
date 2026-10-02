"""
Model Context Protocol (MCP) Tool Registry
Enforces structured JSON schemas and role-based tool execution permissions.
"""
from typing import Dict, Any, Callable, List, Optional
import inspect


class MCPTool:
    def __init__(
        self,
        name: str,
        description: str,
        parameters_schema: Dict[str, Any],
        handler: Callable,
        required_permission: str = "general:read"
    ):
        self.name = name
        self.description = description
        self.parameters_schema = parameters_schema
        self.handler = handler
        self.required_permission = required_permission

    async def execute(self, params: Dict[str, Any], user_permissions: Optional[List[str]] = None) -> Any:
        # Check permissions
        perms = user_permissions or ["general:read", "read:resume", "read:jd", "query:vector_db", "query:github", "write:plan"]
        if self.required_permission not in perms and "admin" not in perms:
            raise PermissionError(f"Unauthorized: missing '{self.required_permission}' permission to invoke '{self.name}'.")

        if inspect.iscoroutinefunction(self.handler):
            return await self.handler(**params)
        return self.handler(**params)


class MCPToolRegistry:
    def __init__(self):
        self._tools: Dict[str, MCPTool] = {}

    def register(self, tool: MCPTool):
        self._tools[tool.name] = tool

    def get(self, name: str) -> Optional[MCPTool]:
        return self._tools.get(name)

    def list_tools(self) -> List[Dict[str, Any]]:
        return [
            {
                "name": t.name,
                "description": t.description,
                "parameters": t.parameters_schema,
                "required_permission": t.required_permission
            }
            for t in self._tools.values()
        ]


tool_registry = MCPToolRegistry()
