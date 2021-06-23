const express = require("express");
const PORT = process.env.PORT || 3001;
const app = express();

var router = express.Router();

router.get('/', function(req, res, next) {
    if(error){
        console.log(`error.message`)
        return;
    }if(stderr){
        console.log(`stderr: `$(stderr));
        return;
    }
    res.send(`${stdout}`)
})

router.get("/api", (req, res) =>{
    console.log('api');
    res.send('testing');
})

module.exports = router;