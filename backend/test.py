from telnet import Telnet

hostname = "10.10.31.239"
username = "red"
password = "cisco"

t = Telnet(hostname, username, password)
t.connect()
inventory = t.execute([ "show inventory" ])
t.disconnect()

print "raw inventory"
print inventory
print "----------"
print ""

# Split

mylist = inventory.strip().replace("\r","").replace("\n",", ").split(", ")
[x.strip() for x in mylist]

stuff = {}
for x in mylist:
    new = x.split(": ")
    key = new[0]
    value = new[1].strip('"').strip()
    stuff[key] = value

print stuff
