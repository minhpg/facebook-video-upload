

module.exports = (req,res) => {
    const template = `
<html>

<head>
    <title>Iframe</title>
    <meta name="referrer" content="no-referrer">
    <link rel="shortcut icon" href="/static/favicon.ico" type="image/x-icon">
    <style>
        body {
            margin: 0;
            background-color:  #000000;
        }
    </style>
    <script data-cfasync="false" src="https://ssl.p.jwpcdn.com/player/v/8.17.6/jwplayer.js"></script>
    <script>
        window.video_id = "${req.params.id}";
        jwplayer.key = "W7zSm81+mmIsg7F+fyHRKhF3ggLkTqtGMhvI92kbqf/ysE99";
    </script>
    <script type="text/javascript" data-cfasync="false" src="/static/player.js"></script>

</head>

<body>
    <div id="player">

    </div>
</body>

</html>
`
    res.send(template)
}

