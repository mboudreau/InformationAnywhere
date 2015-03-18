import os
from bottle import route, run, static_file

@route('/')
def send_static():
    return static_file('index.html', root=os.path.join(os.getcwd()))

@route('/api')
def hello():
    return "{}"

run(host='', port=8080, debug=True)
