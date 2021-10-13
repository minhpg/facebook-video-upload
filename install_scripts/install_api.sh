wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
apt-get update
apt-get install -y nginx nodejs npm aria2 mongodb-org redis

cd install_scripts

rm /etc/nginx/sites-available/default
rm /etc/nginx/sites-enabled/default
cp nginx.conf /etc/nginx/sites-available/default
ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
systemctl restart nginx

systemctl start mongod
systemctl enable mongod

cp redis.conf /etc/redis/redis.conf
systemctl restart redis

cd ..
npm install
npm install -g pm2





