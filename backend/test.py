from telnet import Telnet

hostname = "10.10.31.239"
username = "red"
password = "cisco"

t = Telnet(hostname, username, password)
t.connect()
print t.execute([ "show inventory", "show inventory" ])
t.disconnect()
