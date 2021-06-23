import React, {Component} from 'react'
import "../App.css";
const Swal = require('sweetalert2');

class Checkbox extends Component {
    constructor(props){
        super(props);
        this.checkboxReact = this.checkboxReact.bind(this);
        this.state = {
            wifi_object: this.props.wifi_object
        }
    }

    checkboxReact(){
        console.log('checkbox.js', this.state.wifi_object.ID, this.state.wifi_object.SSID);
        this.props.handleCheckbox(this.state.wifi_object.SSID);
    }

    render() {
        return (
            <div class="form-check" id="checklist_item">
                <input onClick={this.checkboxReact} class="form-check-input" type="checkbox" value="" id="flexCheckDefault"></input>
                <label class="form-check-label" for="flexCheckDefault">{this.state.wifi_object.SSID}</label>
            </div>
        )
    }
}

export default Checkbox;