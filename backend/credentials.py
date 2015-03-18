class Credentials:
    @staticmethod
    def telnet(mac):
        # Retrieve telnet credentials for mac address
        credentialsDb = {
            "E0:89:9D:DA:1E:00": {
                "hostname": "10.10.31.239",
                "username": "red",
                "password": "cisco"
            }
        }
        return credentialsDb[mac]
    @staticmethod
    def cmx():
        # Return cmx api credentials
        return {
            "hostname": "10.10.20.11",
            "username": "learning",
            "password": "learning"
            }
