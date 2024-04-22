# How to install
## Setup a NGINX Reverse Proxy for Node: https://jerryryle.github.io/rogueportal/
## Install Node v22 via: https://hassancorrigan.com/blog/install-nodejs-on-a-raspberry-pi-zero/
```
location /  
{ 
                proxy_set_header X-Real-IP $remote_addr; 
                proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; 
                proxy_set_header Host $host; 
                proxy_set_header X-NginX-Proxy true; 
                proxy_pass http://localhost:3000/; 
                proxy_redirect http://localhost:3000/ https://$server_name/;
                client_max_body_size 512M;
} 
```
## After thats done attach an antenna to pin 4 [I used 4 breadboard jumper wires]
# Features:
- WebUI
- Temp Audio file uploading
- RoguePortal Support via Reverse Proxy
- WAV Files only [Must be converted to Mono]

# Known Issues:
- Stop button not working [I'll fix soon]
- Audio Cuts / Repeats sometimes
