import os
from bottle import route, run, static_file

@route('/')
def send_static():
    return static_file('index.html', root=os.path.join(os.getcwd()))

@route('/api')
def root():
    return {"name":"Red Team's Router","status":"Good", "ip": "10.10.31.177", "updated":1426679517}

run(host='', port=8080, debug=True)
