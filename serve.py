#!/usr/bin/env python3
"""Petit serveur statique local pour prévisualiser le site."""
import functools
import http.server
import os
import socketserver

ROOT = os.path.dirname(os.path.abspath(__file__))
PORT = 4310

os.chdir(ROOT)
handler = functools.partial(http.server.SimpleHTTPRequestHandler, directory=ROOT)


class Server(socketserver.TCPServer):
    allow_reuse_address = True


with Server(("127.0.0.1", PORT), handler) as httpd:
    print("Superorganisme — http://localhost:%d (racine : %s)" % (PORT, ROOT), flush=True)
    httpd.serve_forever()
