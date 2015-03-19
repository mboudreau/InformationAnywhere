from telnet import Telnet
from credentials import Credentials

# Retrieve telnet credentials for mac address
credentials = Credentials.telnet("E0:89:9D:DA:1E:00")
# Execute telnet commands to retrieve data
t = Telnet(credentials["hostname"], credentials["username"], credentials["password"])
t.connect()
print t.execute([ "show inventory", "show version", "show mac address-table | exclude (Fa0/1|CPU)" ])
t.disconnect()
