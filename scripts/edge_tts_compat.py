"""Runtime fixes for edge-tts, applied by gen_audio.py on import. No files are patched.

1. Endpoint. Since Oct 2026 the legacy host (speech.platform.bing.com) answers 403 to
   synthesis; Edge itself now uses api.msedgeservices.com with the same public token
   (upstream fix: rany2/edge-tts PR #491, unmerged as of edge-tts 7.2.8). Only applied
   while the installed edge-tts still points at the legacy host, so it becomes a no-op
   once upstream ships the fix.
2. IPv4. The new host resolves to IPv6 first and this dev machine has no IPv6 route
   ("Network is unreachable"); prefer IPv4 addresses when any exist.
3. CA store. On the corporate network the new host goes through a TLS-inspecting proxy
   whose root is in the system CA store but not in certifi, which edge-tts uses. Use the
   system store when present. Certificate verification stays ON.
"""
import socket
import ssl
from pathlib import Path

import edge_tts.communicate as _cm
import edge_tts.constants as _c

_NEW_WSS = ("wss://api.msedgeservices.com/tts/cognitiveservices/websocket/v1"
            f"?Ocp-Apim-Subscription-Key={_c.TRUSTED_CLIENT_TOKEN}")
if "speech.platform.bing.com" in getattr(_cm, "WSS_URL", ""):
    _c.WSS_URL = _cm.WSS_URL = _NEW_WSS

_getaddrinfo = socket.getaddrinfo


def _prefer_ipv4(*args, **kwargs):
    res = _getaddrinfo(*args, **kwargs)
    return [r for r in res if r[0] == socket.AF_INET] or res


socket.getaddrinfo = _prefer_ipv4

_SYSTEM_CA = Path("/etc/ssl/certs/ca-certificates.crt")
if _SYSTEM_CA.exists() and hasattr(_cm, "_SSL_CTX"):
    _cm._SSL_CTX = ssl.create_default_context(cafile=str(_SYSTEM_CA))
