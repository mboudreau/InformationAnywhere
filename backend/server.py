import os
from bottle import route, run, static_file

@route('/')
def send_static():
    return static_file('index.html', root=os.path.join(os.getcwd()))

@route('/api')
def root():
    from telnet import Telnet

    hostname = "10.10.31.239"
    username = "red"
    password = "cisco"

    t = Telnet(hostname, username, password)
    t.connect()
    inventory = t.execute([ "show inventory" ])
    t.disconnect()

    # Split

    splitlist = inventory.strip().replace("\r","").replace("\n",", ").split(", ")
    data = {}
    for x in splitlist:
        temp = x.strip().split(": ")
        key = temp[0]
        value = temp[1].strip('"').strip()
        data[key] = value

    return {"name":"Red Team's Router","status":"Good", "updated":1426679517, "inventory":data}

run(host='', port=8080, debug=True)
