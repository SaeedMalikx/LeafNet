import React from 'react'
import ReactMapboxGl, { Layer, Feature, Popup } from "react-mapbox-gl";
import firebase from 'firebase';

import PopFeed from './popfeed.js'

import Popcancel from 'material-ui/svg-icons/navigation/cancel'
import Popmore from 'material-ui/svg-icons/navigation/arrow-forward'
import Adder from 'material-ui/svg-icons/content/add-box'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';

const Map = ReactMapboxGl({
  accessToken: ""
});
class Mainmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      popuplat: "",
      popuplng: "",
      openfeed: false,
      currenttitle: "",
      feedkey: "",
      commentlist: []
    };
  }

  openfeed = () => {
      
    firebase.database().ref('users').child('markers').child(this.state.feedkey).child('comments').on('value', snap =>{
                
                if (snap.val()) {
                    let comments = snap.val();
                    let commentlist = [];
                    for (let comment in comments) {
                        commentlist.push({
                            commentkey: comment,
                            body: comments[comment].body,
                        })
                        this.setState({commentlist: commentlist})
                    }
                }
    });
    this.setState({openfeed: true})
  }
  closefeed = () => {this.setState({openfeed: false})}

  handleMapClick = (map, evt) => {
    this.setState({addpopuplat: evt.lngLat.lat , addpopuplng: evt.lngLat.lng})
  }

  leafclick = (e, title, key, gv) => {
    this.setState({popuplat: e.lngLat.lat, popuplng: e.lngLat.lng, currentitle: title, feedkey: key})
  }

  clearpopup = () => {
    this.setState({popuplat: "", popuplng: "",currentitle: "", feedkey: ""})
  }
  render() {
    return (
      <div>
          <Map
              style="mapbox://styles/mapbox/light-v9"
              onDblClick={this.handleMapClick}
              containerStyle={{
                height: "100vh",
                width: "100vw"
              }}>
                <Layer
                  type="symbol"
                  id="marker"
                  layout={{ "icon-image": "square-15" }}>
                  {this.props.globalmarkers.map((marker, index)=><Feature 
                                                            key={index} 
                                                            onClick={(e)=>{this.leafclick(e, marker.title, marker.feedkey)}}
                                                            coordinates={[marker.longitude, marker.latitude]}
                                                            />)}
                </Layer>
                <Popup
                  coordinates={[this.state.popuplng,this.state.popuplat]}
                  offset={{
                    'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
                  }}>
                  <p>{this.state.currentitle}</p>
                  <Popcancel onClick={this.clearpopup}/>
                  <Popmore onClick={this.openfeed}/>
                </Popup>
            </Map>


          <Dialog modal={false} open={this.state.openfeed} onRequestClose={this.closefeed} autoDetectWindowHeight={true}>
                
          </Dialog>

      </div>
    )
  }
}

export default Mainmap