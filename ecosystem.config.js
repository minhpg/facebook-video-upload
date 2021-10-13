module.exports = {
    apps : [{
        name   : "api",
        script : "./dist/app.js",
        instances : "max",
        exec_mode : "cluster"
      },{
        name   : "video-worker",
        script : "./dist/worker/video/index.js",
        instances : "max",
        exec_mode : "cluster"
      },{
        name   : "account-worker",
        script : "./dist/worker/account/index.js"
      }]
  }