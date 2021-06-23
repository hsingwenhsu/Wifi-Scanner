const express = require('express');
const PORT = process.env.PORT || 3001;
const app = express();
const {exec} = require('child_process');
const {spawn} = require('child_process');
var cors = require('cors');
const { RSA_NO_PADDING } = require('constants');
const { connect } = require('http2');

app.use(cors());
app.use(express.json());

app.post("/post", (req, res) => {
    console.log("Connected to react");
    res.redirect("/");
})

app.get("/wifi", (req, res) => {
    //console.log('wifi');
    exec('sudo nmcli dev wifi rescan');
    //console.log('rescan')
    exec('sudo nmcli dev wifi list', (err, stdout, stderr) => {
        if(err){
            console.log('error');
            console.log(err);
        }else{
            console.log('stdout');
            //console.log(stdout);
            res.send(stdout);
        }

    })
})

app.get("/channel", (req, res) => {
    console.log('index.js get channel');
    exec('nmcli dev wifi rescan');
    exec('sudo iwlist wlp3s0 scan | grep Frequency | sort | uniq -c | sort -n', (err, stdout, stderr) => {
        if(err){
            console.log('error: ', err);
        }else{
            console.log('channel output');
            res.send(stdout);
        }
    })
})

app.post("/connect", (req, res) => {
    const ssid = req.body.SSID;
    const password = req.body.PASSWORD;
    console.log('index.js connect')
    var connect_command = 'nmcli dev wifi connect '+ssid+' password '+password;

    console.log('connect_command', connect_command)
    /*exec('ls', (err, stdout, stderr) => {
        console.log(stdout);
    })*/
    exec(connect_command, (err, stdout, stderr) => {
        if(stderr){
            console.log('stderr', stderr);
        }
        if(err){
            console.log('error: ', err);
        }else{
            var stdout_arr = stdout.split(" ");
            console.log('stdout 0', stdout_arr[0])
            if(stdout_arr[0]=="Error:"){
                console.log("wrong password")
                res.send({
                    token: '-1'
                });
            }else{
                res.send({
                    token: '1'
                })
            }
            
        }
    })
    console.log('connect hehe', ssid, password);
    redirect('/after_connect');
});

/*app.get('/connect_succeeded', (req, res) => {
    console.log('after connect succeeded');
    res.send('1');
})

app.get('/connect_failed', (req, res) => {
    console.log('after connect failed');
    res.send('-1');
})*/

app.get('/speed', (req, res) => {
    console.log('index.js test speed');
    exec("speedtest-cli | egrep 'Download|Upload|Hosted'", (err, stdout, stderr) => {
        if(err){
            console.log('speed test error');
        }else{
            console.log('speed test succeeded');
            res.send(stdout);
        }
    })
});

app.listen(PORT, console.log(`Server started on port ${PORT}`));
