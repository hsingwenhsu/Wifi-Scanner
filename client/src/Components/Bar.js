import React, {Component} from 'react'
import "./SignalGraph.css";
import {Line} from 'react-chartjs-2'


class Bar extends Component {
    constructor(props){
        super(props);
        this.getSingleDataset = this.getSingleDataset.bind(this);
        this.getDataset = this.getDataset.bind(this);
        this.state = {
            data: {
                labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
                datasets: [
                    {
                        label: "Videos Mades",
                        backgroundColor: "rgba(255, 0, 255, 0.75)",
                        data: [0, 0, 0, 10, 0, 0, 0, 0, 0, 0],
                        fill: 'origin',
                        pointRadius: 0
                    },
                    {
                        label: "Subscriptions",
                        backgroundColor: "rgba(0, 255, 0, 0.75)",
                        data: [14, 15, 21, 0, 12, 45, 12],
                        fill: 'origin',
                        pointRadius: 0
                    }
                ]
            },
            datasets: []
        }
    }
    
    //generate dataset with this function
    getSingleDataset(ssid, channel, signal_level) {
        var cid = parseInt(channel);
        var slevel = parseFloat(signal_level);
        var left_cid = cid-2;
        var right_cid = cid+2;

    }
    getDataset() {
        console.log('getDataset');
    }
    render() {
        
        return (
            <div style={{margin: '0px', padding:'0px', width: 600, height: 550}} >
                <Line 
                    options = {{responsive: true}}
                    data = {this.state.data}
                    
                />
                
                 
                
            </div>
        )
    }
}

export default Bar