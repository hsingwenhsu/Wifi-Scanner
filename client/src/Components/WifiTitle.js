import React, {Component} from 'react'
import "../App.css";
class WifiTitle extends Component {
    render() {
        return (
            <div className="container" style={{margin: '0px', marginTop: '0px', padding: '0px'}}>
                <div className="container-fluid px-3" style={{margin: '10px', marginBottom: '0px'}} id="rcorner1">
                    <div class="row">           
                        <div class="col-md-3 border bg-light" id="wifi_title_col">
                            <center><h4>SSID</h4></center>
                        </div>
                        <div class="col-md-1 border bg-light" id="wifi_title_col">
                            <center><h4>SIG</h4></center>
                        </div>
                        <div class="col-md-1 border bg-light" id="wifi_title_col">
                            <center><h4>CHAN</h4></center>
                        </div>
                        <div class="col-md-1 border bg-light" id="wifi_title_col">
                            <center><h4>RATE</h4></center>
                        </div>
                        
                        <div class="col-md-2 border bg-light" id="wifi_title_col">
                            <center><h4>BARS</h4></center>
                        </div>
                        <div class="col-md-2 border bg-light" id="wifi_title_col">
                            <center><h4>SECURITY</h4></center>
                        </div>
                        <div class="col-md-2 border bg-light" id="wifi_title_col">
                            <center><h4>CONNECT</h4></center>
                        </div>
                        
                    </div>
                </div>
            </div>
        )
    }
}

export default WifiTitle