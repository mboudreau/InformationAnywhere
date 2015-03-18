import os
from bottle import route, run, static_file, request

@route('/')
def index():
    return static_file('index.html', root=os.path.join(os.getcwd()))

@route('/api/whoami')
def whoami():
    return { "ip": request.remote_addr }

@route('/api/<hostname>/<username>/<password>')
def api(hostname, username, password):
    from telnet import Telnet

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

    return {"status":"Good", "updated":1426679517, "inventory":data}

run(host='', port=8080, debug=True)
