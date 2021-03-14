# tovuti-hermes

### Project Setup
```
git clone {repo url}

# install deps
cd tovuti-hermes
npm i 
cd server
npm i

# install redis server
# See https://www.digitalocean.com/community/tutorials/how-to-install-and-secure-redis-on-ubuntu-18-04

sudo apt update
sudo apt install redis-server
sudo vi /etc/redis/redis.conf
# Set the supervised config option to 'systemmd'. See link above for more details
sudo systemctl restart redis.service

# Spin up dev environment
cd tovuti-hermes
npm run serve

# Build for prod
cd tovuti-hermes
npm run build

# Spin up api server
cd tovuti-hermes/server
npm run start
```

### Dependency Information

This project uses the following stack:
* Vuetify - component library + cli for vue based on material design spec, includes Bootstrap
* Vue.js - frontend javascript framework
* Material Icons

* Express.js
* Node.js
* Redis - we are using redis-server, and the 'redis' package from npm for the client

### Notes
Sometimes the redis server needs to be stopped in prod. This will be evident if the server
doesn't spin up after using `npm start` If this happens, use:
```
sudo service redis-server stop
```


Also, when deploying, we need to forward port 80 to the port that this service is on. Use:
```
sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j REDIRECT --to-port 3000
```
In the future, this should be set up when the AWS instance boots up, but for now I'm dropping these commands
here for future reference.
