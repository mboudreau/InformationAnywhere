from bottle import route, run
import paramiko, base64
import commands

@route('/ssh')

def ssh():
    key = paramiko.RSAKey(data=base64.decodestring('AAA...'))
    client = paramiko.SSHClient()
    client.get_host_keys().add('ssh.example.com', 'ssh-rsa', key)
    client.connect('10.10.31.177', username='cisco', password='cisco')
    stdin, stdout, stderr = client.exec_command('show inventory')
    return 'output is: ' + stdout
    # for line in stdout:
    #     return '... ' + line.strip('\n')
    client.close()


run(host='localhost', port=8080, debug=True)

