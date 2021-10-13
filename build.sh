sudo rm -r dist
sudo mkdir dist
bytenode --compile src/app.js
sudo mv src/app.jsc dist
bytenode --compile src/worker/video/index.js
sudo mv src/worker/video/index.jsc dist/video.jsc
bytenode --compile src/worker/account/index.js
sudo mv src/worker/account/index.jsc dist/account.jsc
