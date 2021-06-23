import React, {Component} from 'react'
import "./SignalGraph.css";
import {Bar} from 'react-chartjs-2'

var color_list = [
    "rgba(255, 102, 102, 0.8)", "rgba(102, 255, 102, 0.8)", "rgba(102, 102, 255, 0.8)", 
    "rgba(0, 255, 204, 0.8)" ,"rgba(255, 204, 102, 0.8)", "rgba(204, 153, 255, 0.8)", 
    "rgba(153, 51, 255, 0.8)", "rgba(0, 102, 255, 0.8)", "rgba(255, 102, 255, 0.8)",
    "rgba(0, 255, 153, 0.8)", "rgba(255, 0, 102, 0.8)", "rgba(255, 153, 102, 0.8)", 
    "rgba(204, 204, 255, 0.8)", "rgba(102, 255, 255, 0.8)", "rgba(255, 255, 0, 0.8)"
]

var bcolor_list = [
    "rgba(255, 102, 102)", "rgba(102, 255, 102)", "rgba(102, 102, 255)", 
    "rgba(0, 255, 204)" ,"rgba(255, 204, 102)", "rgba(204, 153, 255)", 
    "rgba(153, 51, 255)", "rgba(0, 102, 255)", "rgba(255, 102, 255)",
    "rgba(0, 255, 153)", "rgba(255, 0, 102)", "rgba(255, 153, 102)", 
    "rgba(204, 204, 255)", "rgba(102, 255, 255)", "rgba(255, 255, 0)"
]



class SignalGraph extends Component {
    constructor(props){
        super(props);
        
        this.state = {
            data: {
                labels: this.props.label_list,
                datasets: [
                    {   
                        label: 'Wifi Signal',
                        backgroundColor: this.props.bglist,
                        borderColor: this.props.bdlist,
                        data: this.props.data_list
                    }
                ]
            }
        }
        //get data for each ssid
        console.log('Signal graph', this.state.data)
        
    }
    
    
    render() {
        
        return (
            <div style={{margin: '0px', padding:'0px', width: '1200px'}} >
               <h2>Signal</h2>
               <Bar data={this.state.data}
               height={500}
               width={500}
               
               />
               
                
            </div>
        )
    }
}

export default SignalGraph

/*
var i;
        var datasets_tmp = []
        for(i = 0; i<this.state.wifi_objects.length; i++){
            console.log('wifi object', i);
            if(this.state.wifi_objects[i].CHECKED==0){
                console.log('if')    
                var color_idx = i%color_list.length;
                var dataset_tmp = {
                    label: this.state.wifi_objects[i].SSID,
                    backgroundColor: color_list[color_idx],
                    data: parseInt(this.state.wifi_objects[i].SIGNAL)
                }
                datasets_tmp.push(dataset_tmp);
            }
        }
        console.log(datasets_tmp);
        data_tmp = {
            labels: this.state.channels,
            datasets: datasets_tmp
        }
        console.log(data_tmp)
        this.setState({data: data_tmp});
        console.log('set dataset')
        console.log(this.state.data)
*/