import os, json, urllib2, base64
from bottle import route, run, static_file, request

@route('/')
def index():
    return static_file('index.html', root=os.path.join(os.getcwd()))

@route('/api/whoami')
def whoami():
    # Get the client IP address
    ip = request.remote_addr
    # Retrieve info from SMX server
    username = "learning"
    password = "learning"
    req = urllib2.Request("http://10.10.20.11/api/contextaware/v1/location/clients/10.10.30.166.json")
    base64string = base64.encodestring('%s:%s' % (username, password)).replace('\n', '')
    req.add_header("Authorization", "Basic %s" % base64string)   
    result = urllib2.urlopen(req)
    data = json.load(result)
    # Return JSON
    return { "ip": request.remote_addr, "json": data }

@route('/api/<mac>')
def api(mac):
    # Note: in production we would use ARP data to retrieve IP, then query
    #       the device using CDP or Device APIs
    from telnet import Telnet
    # Retrieve telnet credentials for mac address
    credentialsDb = {
        "E0:89:9D:DA:1E:00": {
            "hostname": "10.10.31.239",
            "username": "red",
            "password": "cisco"
        }
    }
    credentials = credentialsDb[mac]
    # Execute telnet commands to retrieve data
    t = Telnet(credentials["hostname"], credentials["username"], credentials["password"])
    t.connect()
    inventory = t.execute([ "show inventory" ])
    t.disconnect()
    # Format 'show inventory' data
    splitlist = inventory.strip().replace("\r","").replace("\n",", ").split(", ")
    data = {}
    for x in splitlist:
        temp = x.strip().split(": ")
        key = temp[0]
        value = temp[1].strip('"').strip()
        data[key] = value
    # Return json
    return {"status":"Good", "updated":1426679517, "inventory":data}

run(host='', port=8080, debug=True)
