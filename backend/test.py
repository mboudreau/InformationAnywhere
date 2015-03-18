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

splitlist = inventory.strip().replace("\r","").replace("\n",", ").split(", ")
data = {}
for x in splitlist:
    temp = x.strip().split(": ")
    key = temp[0]
    value = temp[1].strip('"').strip()
    data[key] = value

print data
