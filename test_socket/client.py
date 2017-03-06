#!/usr/bin/env python
from socketIO_client import SocketIO, LoggingNamespace

with SocketIO('localhost', 8080, LoggingNamespace) as socketIO:
    socketIO.emit('aaa')
    socketIO.wait(seconds=1)
