rm /etc/nginx/sites-available/default
rm /etc/nginx/sites-enabled/default
cp nginx.conf /etc/nginx/sites-available/default
ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/default
