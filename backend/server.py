import os, json, urllib2, base64
from bottle import route, run, static_file, request
from telnet import Telnet
from credentials import Credentials

@route('/')
def index():
    return static_file('index.html', root=os.path.join(os.getcwd()))

@route('/api/<mac>')
def api(mac):
    # Get the client IP address
    ip = request.remote_addr
    # Retrieve client info from CMX server
    cmx_credentials = Credentials.cmx()
    cmx_requqest = urllib2.Request(
        "http://" +
        cmx_credentials["hostname"] + 
        "/api/contextaware/v1/location/clients/10.10.30.166.json"
        )
    cmx_requqest.add_header(
        "Authorization",
        "Basic %s" % base64.encodestring(
            '%s:%s' % (cmx_credentials["username"], cmx_credentials["password"])
            ).replace('\n', '')
        )
    try:
        result = urllib2.urlopen(cmx_requqest)
    except URLError as e:
        print e.reason
    if result:
        cmxdata = json.load(result)
    else:
        cmxdata = {}
    # Note: in production we would use ARP data to retrieve IP, then query
    #       the device using CDP or Device APIs
    # Retrieve telnet credentials for mac address
    credentials = Credentials.telnet(mac)
    # Execute telnet commands to retrieve data
    t = Telnet(credentials["hostname"], credentials["username"], credentials["password"])
    t.connect()
    inventory = t.execute([ "show inventory" ])
    version = t.execute([ "show version" ])
    t.disconnect()
    # Format 'show inventory' data
    splitlist = inventory.strip().replace("\r","").replace("\n",", ").split(", ")
    data = {}
    for x in splitlist:
        temp = x.strip().split(": ")
        key = temp[0]
        value = temp[1].strip('"').strip()
        if key == 'imageName':
        	value = "http://10.10.20.11/api/contextaware/v1/maps/imagesource/"+value
        data[key] = value
    # Return json
    return {
        "device": {
            "inventory": data,
            "version" : version
            },
        "cmx": cmxdata
        }

run(host='', port=8080, debug=True)
