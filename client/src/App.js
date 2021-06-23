import "./App.css";
import React, {Component} from 'react'
import Axios from 'axios'

import 'bootstrap/dist/css/bootstrap.css'
import Navbar from './Components/Navbar'
import WifiTitle from './Components/WifiTitle'
import WifiObj from './Components/WifiObj'
import SignalGraph from "./Components/SignalGraph";
import Checkbox from "./Components/Checkbox";
import {Bar} from 'react-chartjs-2'
import Swal from "sweetalert2";
import Loader from "react-loader-spinner";

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

class App extends Component {
  componentWillMount(){

  }
  constructor(props){
    super(props);
    this.getWifi = this.getWifi.bind(this);
    this.testSpeed = this.testSpeed.bind(this);
    this.rankWifi = this.rankWifi.bind(this);
    this.getChannel = this.getChannel.bind(this);
    this.connectWifi = this.connectWifi.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.state = {
      wifi_objects: [],
      curr_wifi_obj: 0,
      //channel_set: new Set(),
      channel_objects: [],
      sig_graph_data: {},
      chan_graph_data: {},
      wifi_objects_ranked: [],
      speed_stat: {ping: 0, download: 0, upload: 0}
    }
  }

  testSpeed(){
    console.log('App.js test speed');
    fetch("http://localhost:3001/speed")
    .then(res => res.text())
    .then(res => {
      var speed_info = res.split("\n");
      var ping_info = speed_info[0].split(" ");
      var download_info = speed_info[1].split(" ");
      var upload_info = speed_info[2].split(" ");

      var ping_arr = [];
      var download_arr = [];
      var upload_arr = [];

      var i;
      for(i = 0; i<ping_info.length; i++){
        if(ping_info[i].length!=0){
          ping_arr.push(ping_info[i]);
        }
      }

      for(i = 0; i<download_info.length; i++){
        if(download_info[i].length!=0){
          download_arr.push(download_info[i]);
        }
      }

      for(i = 0; i<upload_info.length; i++){
        if(upload_info[i].length!=0){
          upload_arr.push(upload_info[i]);
        }
      }

      this.setState({
        speed_stat: {
          ping: ping_arr[ping_arr.length-2],
          download: download_arr[download_arr.length-2], 
          upload: upload_arr[upload_arr.length-2]
        }
      })

      console.log(this.state.speed_stat);
    })
  }

  getChannel(){
    console.log('get channel');
    fetch("http://localhost:3001/channel")
    .then(res => res.text())
    .then(res => {
      console.log('channel res', res)
      var wifi_objects_tmp = this.state.wifi_objects;
      var channel_objects_tmp = [];
      var arr = res.split("\n");
      var i; 
      var j;
      for(i = 0; i<arr.length; i++){
        var channel_tmp = arr[i].split(" ");
        var channel_info_tmp = [];
        for(j = 0; j<channel_tmp.length; j++){
          if(channel_tmp[j].length!=0){
            channel_info_tmp.push(channel_tmp[j]);
          }
        }

        var cinfo_len = channel_info_tmp.length;
        if(cinfo_len==5){
          var channel_cnt = parseInt(channel_info_tmp[0]); //number of ap using the channel
          var cnum_str = channel_info_tmp[cinfo_len-1];
          var cnum_strlen = cnum_str.length; 
          var chan_id = cnum_str.substr(0, cnum_strlen-1)
          var channel_obj_tmp = {
            channel_id: chan_id,
            channel_cnt: channel_cnt
          }
          channel_objects_tmp.push(channel_obj_tmp);
  
          for(j = 0; j<wifi_objects_tmp.length; j++){
            console.log(wifi_objects_tmp[j].CHAN, chan_id)
            if(wifi_objects_tmp[j].CHAN==chan_id){
              wifi_objects_tmp[j].CHAN_CONGEST = channel_cnt;
            }
          }
        }
        
      }//end getting channel objects
      //construct bar data
      var chan_label_list = []
      var chan_data_list = []
      var chan_color_list = []
      var chan_bcolor_list = []
      var color_id = 0;

      for(i = 0; i<channel_objects_tmp.length; i++){
        chan_label_list.push('Channel '+channel_objects_tmp[i].channel_id)
        chan_data_list.push(channel_objects_tmp[i].channel_cnt);
        color_id = i%color_list.length;
        chan_color_list.push(color_list[color_id]);
        chan_bcolor_list.push(bcolor_list[color_id]);
        color_id++
      }
     
      this.setState({
        wifi_objects: wifi_objects_tmp,
        channel_objects: channel_objects_tmp,
        chan_graph_data: {
          labels: chan_label_list,
          datasets: [
            {
              label: 'Channel Congestion State',
              backgroundColor: chan_color_list,
              borderColor: chan_bcolor_list,
              data: chan_data_list
            }
          ]
        }
      })
      
    })//end .then
  }
  getWifi(){
    fetch("http://localhost:3001/wifi")
    .then(res => res.text())
    .then(res => {
      var wifi_objects_tmp = [];
      var wifi_objects_set = new Set();
      var arr = res.split("\n");
      var i;
      var idx = 0;
      for(i = 1;i<arr.length; i++){
        var wifi_tmp = arr[i].split(" ");
        var wifi_info_tmp = [];
        var j;
        for(j = 0; j<wifi_tmp.length; j++){
          if(wifi_tmp[j].length!=0){
            wifi_info_tmp.push(wifi_tmp[j]);
          }
        }
        console.log(wifi_info_tmp);
        
        if(wifi_info_tmp.length==9){
          //check if it is the wifi we are currently using
          if(wifi_info_tmp[0]=="*"){
            var wifi_object = {
              ID: idx,
              INUSE: 1,
              SSID: wifi_info_tmp[1],
              CHAN: wifi_info_tmp[3],
              RATE: parseInt(wifi_info_tmp[4]),
              SIGNAL: parseInt(wifi_info_tmp[6]),
              BARS: wifi_info_tmp[7],
              SECURITY: wifi_info_tmp[8],
              CHECKED: 0,
              CHAN_CONGEST: 0
            }
            //var channel_tmp = parseInt(wifi_info_tmp[3])
            //var channel_set_tmp = this.state.channel_set
            //channel_set_tmp.add(channel_tmp);
            //wifi_objects_tmp.push(wifi_object);
            wifi_objects_set.add(wifi_object);
            this.setState({
              curr_wifi_obj: wifi_object
              //,channel_set: channel_set_tmp
            });
            idx++;
          }
        }
        else if(wifi_info_tmp.length==8){
          var wifi_object = {
            ID: idx,
            INUSE: 0,
            SSID: wifi_info_tmp[0],
            CHAN: wifi_info_tmp[2],
            RATE: parseInt(wifi_info_tmp[3]),
            SIGNAL: parseInt(wifi_info_tmp[5]),
            BARS: wifi_info_tmp[6],
            SECURITY: wifi_info_tmp[7],
            CHECKED: 0,
            CHAN_CONGEST: 0
          }
          //var channel_tmp = parseInt(wifi_info_tmp[2])
          //var channel_set_tmp = this.state.channel_set

          //channel_set_tmp.add(channel_tmp);
          //wifi_objects_tmp.push(wifi_object);
          wifi_objects_set.add(wifi_object);
          idx++;
        }
        
      }
      wifi_objects_tmp = Array.from(wifi_objects_set);
      this.setState({
        wifi_objects: wifi_objects_tmp
        //,channel_set: channel_set_tmp
      });
      console.log(this.state.wifi_objects);
    })
    console.log("get wifi");
  }
  

  rankWifi(){
    console.log('start ranking wifi');
    //rank the aps according to different criteria
    var ranked_wifi_tmp = []
    var wifi_objects_tmp = this.state.wifi_objects;
    var wifi_objects_tmp2 = []
    var i;
    for(i = 0; i<wifi_objects_tmp.length; i++){
      if(wifi_objects_tmp[i].CHECKED==1){
        wifi_objects_tmp2.append(wifi_objects_tmp[i]);
      }
    }
    console.log('wifi_objects_tmp2', wifi_objects_tmp2)
    wifi_objects_tmp2.sort(function(wifi1, wifi2){
      if(wifi1.RATE>wifi2.RATE) return 1;
      if(wifi1.RATE==wifi2.RATE){
        if(wifi1.SIGNAL>=wifi2.SIGNAL) return 1;
        else return -1;
      }else{
        return -1
      }
    })
    console.log('rank wifi')
    console.log(wifi_objects_tmp2);
    //start ranking wifi_objects_tmp2
    //sort the wifis according to their speed
    //sort the wifis according to signal strength 
    //sort the wifis according to channel congestion
  }

  connectWifi(ssid, password){
    console.log('line 245', password);
    //Axios.post("http://localhost:3001/connect", {SSID: ssid, USERNAME: username, PASSWORD: password})
    Axios.post("http://localhost:3001/connect", {SSID: ssid, PASSWORD: password})
    .then(res => {
      console.log(res)
      console.log(res.data)
      if(res.data=="1"){
        Swal.fire(
          'Success!',
          'You have connected to a WiFi Hotspot!',
          'success'
        )
        //update current wifi object
        var i;
        var new_wifi;
        for(i = 0; i<this.state.wifi_objects.length; i++){
          if(this.state.wifi_objects[i].SSID==ssid){
            new_wifi = this.state.wifi_objects[i];
            this.setState({
              curr_wifi_obj: new_wifi
            })
            break;
          }
        }
      }else{
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Wrong username or password!',
          footer: '<a href="">Why do I have this issue?</a>'
        })
      }
    })
    
  }

 
  handleCheckbox(wifi_id){
    var update = require('immutability-helper')
    console.log('handleCheckbox', wifi_id);
    var wifi_objects_copy = this.state.wifi_objects;
    var sig_data_list_tmp = []
    var sig_bglist_tmp = []
    var sig_bdlist_tmp = []
    var sig_label_list_tmp = []

    var idx_tmp = wifi_objects_copy.findIndex(function(c) {
      return c.SSID==wifi_id;
    });
    var new_wifi_objects = this.state.wifi_objects;
    if(wifi_objects_copy[idx_tmp].CHECKED==0){
      var updatedWifiObj = update(wifi_objects_copy[idx_tmp], {CHECKED: {$set: 1}});

      new_wifi_objects = update(wifi_objects_copy, {
        $splice: [[idx_tmp, 1, updatedWifiObj]]
      });
    }
    else{
      var updatedWifiObj = update(wifi_objects_copy[idx_tmp], {CHECKED: {$set: 0}});
      new_wifi_objects = update(wifi_objects_copy, {
        $splice: [[idx_tmp, 1, updatedWifiObj]]
      });
    }
    
    this.setState({
      wifi_objects: new_wifi_objects
    });
    
    //construct datalist, label list for signal graph
    var i;
    var color_id = 0;
    for(i = 0; i<this.state.wifi_objects.length; i++){
      if(new_wifi_objects[i].CHECKED==1){
        sig_data_list_tmp.push(this.state.wifi_objects[i].SIGNAL);
        sig_label_list_tmp.push(this.state.wifi_objects[i].SSID);
        color_id = color_id%color_list.length;
        sig_bglist_tmp.push(color_list[color_id]);
        sig_bdlist_tmp.push(bcolor_list[color_id]);
        color_id++;
      }
    }
  
   
    this.setState({
      sig_graph_data:{
        labels: sig_label_list_tmp,
        datasets: [
          {
            label: 'Wifi Signal',
            backgroundColor: sig_bglist_tmp,
            borderColor: sig_bdlist_tmp,
            data: sig_data_list_tmp
          }
        ]
      }
    });

  }
  render(){
    return (
      <div className="container-fluid" style={{marginTop: '100px', marginRight: '0px', marginLeft: '320px', padding: '0px'}}>
        <Navbar />
       
        <div class="sidebar" style={{marginTop: '90px', paddingTop: '10px'}}>
          <div class="card text-white bg-secondary mb-3" style={{width: '250px', marginLeft: '30px', marginTop: '40px'}}>
            <div class="card-header"><h4>Current Status</h4></div>
            <div class="card-body">
              <h5 class="card-title">SSID: {this.state.curr_wifi_obj.SSID}</h5>
              <h5 class="card-title">Rate: {this.state.curr_wifi_obj.RATE}</h5>
              <h5 class="card-title">Signal: {this.state.curr_wifi_obj.SIGNAL}</h5>
              <h5 class="card-title">Channel: {this.state.curr_wifi_obj.CHAN}</h5>
            </div>
          </div>
          <div class="card text-white bg-secondary mb-3" style={{width: '250px', marginLeft: '30px', marginTop: '40px'}}>
            <div class="card-header"><h4>Speed Test</h4></div>
            <div class="card-body">
              <h5 class="card-title">Ping: {this.state.speed_stat.ping} ms</h5>
              <h5 class="card-title">Download: {this.state.speed_stat.download} Mb/s</h5>
              <h5 class="card-title">Upload: {this.state.speed_stat.upload} Mb/s</h5>
              <center><button onClick={this.testSpeed} class="btn btn-light">Start Test</button></center>
              
            </div>
          </div>
          <button onClick={this.getWifi} class="btn btn-secondary sidebar_but"><h4>Get Wifi!</h4></button>
          <button class="btn btn-secondary sidebar_but" onclick={this.rankWifi} ><h4>Rank</h4></button>
          <button class="btn btn-secondary sidebar_but" onClick={this.getChannel}><h4>Channel</h4></button>
          <h5 id="checklist_title">Select available Wifi</h5>
          {this.state.wifi_objects.map((wifi_object, index)=> {
            return <Checkbox wifi_object={wifi_object} handleCheckbox={this.handleCheckbox}/>
          })}
        </div>
        
        <div style={{width: '1100px', paddingBottom: '20px', marginBottom: '50px', marginLeft: '30px'}}>
          <div class="alert alert-dark" role="alert" style={{paddingBottom: '20px', marginBottom: '10px', marginTop: '10px', marginLeft: '5px', width: '1150px'}}>
            <h4 id="section_title">My Wifi</h4>
          </div>
          <WifiTitle />
          {this.state.wifi_objects.map((wifi_object, index)=> {
            if(wifi_object.CHECKED==1){
              return <WifiObj wifi_object={wifi_object} connectWifi={this.connectWifi}/>
            }
            
          })}
        </div>
        
        <div style={{width: '1100px', height: '600px', paddingBottom: '20px', marginBottom: '50px', marginLeft: '30px'}}>
          <div class="alert alert-dark" role="alert" style={{ paddingBottom: '20px', marginBottom: '50px', marginLeft: '5px', width: '1150px'}}>
            <h4 id="section_title">Signal</h4>
          </div>
          <Bar data={this.state.sig_graph_data}
                options={{maintainAspectRatio: true, indexAxis: 'y'}}
                height={400}
                width={1000}
          />
        </div>
        <div style={{width: '1100px', height: '600px', paddingBottom: '20px', marginBottom: '50px', marginLeft: '30px'}}>
          <div class="alert alert-dark" role="alert" style={{ paddingBottom: '20px', marginBottom: '50px', marginLeft: '5px', width: '1150px'}}>
            <h4 id="section_title">Channel Congestion State</h4>
          </div>
          <Bar data={this.state.chan_graph_data}
                options={{maintainAspectRatio: true, indexAxis: 'y'}}
                height={400}
                width={1000}
          />
        </div>
        
        
      </div>
    )
  }
}


export default App;

