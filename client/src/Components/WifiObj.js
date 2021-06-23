import React, {Component} from 'react'
import "../App.css";
const Swal = require('sweetalert2');

class WifiObj extends Component {
    constructor(props){
        super(props);
        this.state = {
            SSID: this.props.wifi_object.SSID,
            CHAN: this.props.wifi_object.CHAN,
            RATE: this.props.wifi_object.RATE,
            SIGNAL: this.props.wifi_object.SIGNAL,
            BARS: this.props.wifi_object.BARS,
            SECURITY: this.props.wifi_object.SECURITY
        }
        this.handleConnect = this.handleConnect.bind(this);
    }

    async handleConnect(){
        /*const { value: formValues } = await Swal.fire({
            title: 'Enter Username and Password',
            html:
              '<input id="swal-input1" class="swal2-input" placeholder="username">' +
              '<input id="swal-input2" class="swal2-input" placeholder="password"> ',
            focusConfirm: false,
            preConfirm: () => {
              return [
                document.getElementById('swal-input1').value,
                document.getElementById('swal-input2').value
              ]
            }
        })
        
        var username;
        var password;
        if (formValues) {
            const tmp = JSON.stringify(formValues)
            console.log(formValues)
            username=formValues[0];
            password=formValues[1];
            //console.log(username);
            //console.log(password);
        }
        */
        const { value: password } = await Swal.fire({
            title: 'Enter your password',
            input: 'password',
            inputLabel: 'Password',
            inputPlaceholder: 'Enter your password',
            inputAttributes: {
              maxlength: 10,
              autocapitalize: 'off',
              autocorrect: 'off'
            }
        })
        var pwd = password;
        
        
        this.props.connectWifi(this.state.SSID, password);
    }

    render() {
        return (
            <div className="container" style={{marginLeft: '10px', marginTop: '0px', padding: '0px'}}>
                <div className="container-fluid px-3" style={{margin: '0px', marginBottom: '0px'}} id="wifi_obj_row">
                    <div class="row">           
                        <div class="col-md-3 border bg-light" id="wifi_title_col">
                            <center><h4>{this.state.SSID}</h4></center>
                        </div>
                        <div class="col-md-1 border bg-light" id="wifi_title_col">
                            <center><h4>{this.state.SIGNAL}</h4></center>
                        </div>
                        <div class="col-md-1 border bg-light" id="wifi_title_col">
                            <center><h4>{this.state.CHAN}</h4></center>
                        </div>
                        <div class="col-md-1 border bg-light" id="wifi_title_col">
                            <center><h4>{this.state.RATE}</h4></center>
                        </div>
                        <div class="col-md-2 border bg-light" id="wifi_title_col">
                            <center><h4>{this.state.BARS}</h4></center>
                        </div>
                        <div class="col-md-2 border bg-light" id="wifi_title_col">
                            <center><h4>{this.state.SECURITY}</h4></center>
                        </div>
                        <div class="col-md-2 border bg-light" style={{paddingTop: '5px'}}>
                            <center>
                                <button onClick={this.handleConnect} class="btn btn-secondary">
                                    <b>Connect</b>
                                </button>
                            </center> 
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default WifiObj