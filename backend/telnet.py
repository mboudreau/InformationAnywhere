import sys
import telnetlib

class Telnet:

    def __init__(self, hostname, username, password):

        # Save params
        self.hostname = hostname
        self.username = username
        self.password = password

    def connect(self):

        # Connect to host
        self.session = telnetlib.Telnet(self.hostname)

        # Enter username
        self.session.read_until("Username: ")
        self.session.write(self.username + "\n")

        # Enter password
        self.session.read_until("Password: ")
        self.session.write(self.password + "\n")

        # Capture prompt
        self.prompt = ''.join(self.session.read_until(">").splitlines())

    def execute(self, commands):

        output = ""

        # Loop commands
        for command in commands:

            # Execute command
            self.session.write(command + "\n\n")

            # Read until command
            self.session.read_until(command)

            # Capture output
            output += self.session.read_until(self.prompt)[:-len(self.prompt)].rstrip()

        return output

    def disconnect(self):

        # End session
        self.session.write("exit\n")
        self.session.read_all
