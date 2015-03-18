import socket, select, string, sys
if __name__ == "__main__":

    host = "10.10.31.239"
    port = 23

    try:
        skt = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    except socket.error, e:
        print("Error creating socket: %s" % e)
        sys.exit(1)

    try:
        skt.connect((host, port))
    except socket.gaierror, e:
        print("Address-related error connecting to server: %s" % e)
        sys.exit(1)
    except socket.error, e:
        print("Error connecting to socket: %s" % e)
        sys.exit(1)

    commands = ["red", "cisco", "show inventory"]

    sent = 1;

    for command in commands:
        skt.send(command+"\n")
        sent += len(command)

    count = 0

    while 1:
        count += 1
        try:
            buf = skt.recv(4096)
        except socket.error, e:
            print("Error receiving data: %s" % e)
            sys.exit(1)
        if count == sent:
            print buf
            break
