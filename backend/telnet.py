import sys
import telnetlib

hostname = "10.10.31.239"
username = "red"
password = "cisco"

output = ""

# Connect to host
tn = telnetlib.Telnet(hostname)

# Enter username
tn.read_until("Username: ")
tn.write(username + "\n")

# Enter password
tn.read_until("Password: ")
tn.write(password + "\n")

# Capture prompt
prompt = ''.join(tn.read_until(">").splitlines())

# Loop commands
for command in [ "show inventory" ]:

    # Execute command
    tn.write(command + "\n")

    # Read until command
    tn.read_until(command)

    # Capture output
    output += tn.read_until(prompt)[:-len(prompt)].rstrip()

# End session
tn.write("exit\n")
tn.read_all

# Print output
print output
