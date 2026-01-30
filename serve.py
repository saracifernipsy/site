import http.server
import socket
import socketserver
from contextlib import closing

PORT = 8000


def get_local_ip():
    try:
        with closing(socket.socket(socket.AF_INET, socket.SOCK_DGRAM)) as s:
            s.connect(("8.8.8.8", 80))
            return s.getsockname()[0]
    except OSError:
        return "127.0.0.1"


class Handler(http.server.SimpleHTTPRequestHandler):
    # Quiet a bit of noise in the terminal
    def log_message(self, format, *args):
        return


if __name__ == "__main__":
    with socketserver.TCPServer(("0.0.0.0", PORT), Handler) as httpd:
        ip = get_local_ip()
        print(f"Serving on http://{ip}:{PORT} (same Wi-Fi required)")
        print("Press Ctrl+C to stop")
        httpd.serve_forever()
