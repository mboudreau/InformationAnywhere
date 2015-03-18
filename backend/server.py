from bottle import route, run

@route('/')
def hello():
    return "{}"

run(host='', port=8080, debug=True)
