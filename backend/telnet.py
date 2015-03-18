import socket, select, string, sys
if __name__ == "__main__":

    host = "rainmaker.wunderground.com"
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
    
    print 'Connected to remote host'

    # while 1:
    #     try:
    #         buf = skt.recv(4096)
    #         print("RECV: %s" % buf)
    #     except socket.error, e:
    #         print("Error receiving data: %s" % e)
    #         sys.exit(1)
    #     if not len(buf):
    #         break
    #     sys.stdout.write(buf)

    while 1:
        socket_list = [sys.stdin, skt]
          
        # Get the list sockets which are readable
        read_sockets, write_sockets, error_sockets = select.select(socket_list , [], [])
         
        for sock in read_sockets:
            #incoming message from remote server
            if sock == skt:
                data = sock.recv(4096)
                if not data :
                    print 'Connection closed'
                    sys.exit()
                else :
                    #print data
                    sys.stdout.write(data)
             
            #user entered a message
            else :
                msg = sys.stdin.readline()
                skt.send(msg)
