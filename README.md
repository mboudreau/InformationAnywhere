# Information Anywhere
Cisco Live Hackathon

"Red" team:

* [Michel Boudreau](https://github.com/mboudreau)
* [Ryan Djurovich](https://github.com/ryandjurovich)
* [Cosmin Ianculescu](https://github.com/cosmini)

[Slides Here](https://docs.google.com/presentation/d/1URBxDZeQCMe6jBNGNjuShR-mZpB4070FglEwAveeu-k/edit?usp=sharing)

## IOX, SSH and HTTP

We have a Cisco 819-4g Router running on 10.10.31.177

* SSH using `ssh cisco@10.10.31.177` and password `cisco`
* It is running a Linux virtual machine on local port 192.168.100.2
* SSH to VM using `ssh -l root 192.168.100.2` and password `root`
* The router also has the following port forwarding configured:
  * 8022 --> 22, to provide external access to the VM SSH server
  * 80 --> 8080, to provide external access to the VM Python HTTP server

For the `deploy.sh` script, we use the following SSH Config:

    Host iox
        HostName 10.10.31.177
        User root
        Port 8022

And to deploy run `./deploy.sh` and enter password `root`

We can then access the server using [http://10.10.31.177](http://10.10.31.177) if the server.py script is running.
