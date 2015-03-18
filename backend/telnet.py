import sys
import telnetlib

HOST = "10.10.31.239"
user = "red"
password = "cisco"

tn = telnetlib.Telnet(HOST)

print "until username"
tn.read_until("Username: ")
tn.write(user + "\n")
print "until password"
tn.read_until("Password: ")
tn.write(password + "\n")
print "then"
tn.write("show inventory\n")
print "and"
tn.write("exit\n")
print "done"
print tn.read_all()
