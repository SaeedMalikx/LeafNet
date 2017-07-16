import React from 'react'
import ReactMapboxGl, { Layer, Feature, Popup } from "react-mapbox-gl";
import firebase from 'firebase';

import PopFeed from './popfeed.js'

import Popcancel from 'material-ui/svg-icons/navigation/cancel'
import Popmore from 'material-ui/svg-icons/navigation/arrow-forward'
import Adder from 'material-ui/svg-icons/content/add-box'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import {List, ListItem} from 'material-ui/List';
import Divider from 'material-ui/Divider';
import Subheader from 'material-ui/Subheader';
import Avatar from 'material-ui/Avatar';

const Map = ReactMapboxGl({
  accessToken: ""
});
class Mainmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allowpopup: false,
      popuplat: "",
      popuplng: "",
      openfeed: false,
      currenttitle: "",
      feedkey: "",
      feedcommentlist: [],
      currentcomment: ""
    };
  }

  openfeed = () => {
      
    firebase.database().ref('global').child('posts').child(this.state.feedkey).child('comments').on('value', snap =>{
                
                if (snap.val()) {
                    let comments = snap.val();
                    let commentlist = [];
                    for (let comment in comments) {
                        commentlist.push({
                            commentkey: comment,
                            body: comments[comment].body,
                        })
                        this.setState({feedcommentlist: commentlist})
                    }
                }
    });
    this.setState({openfeed: true})
  }

  setcomment = (comment) => {
      this.setState({currentcomment: comment.target.value}, console.log(this.state.currentcomment))
  }

  addcomment = () => {
    const user = firebase.auth().currentUser;
    if (user != null) {
        firebase.database().ref('global').child('posts').child(this.state.feedkey).child('comments').push({
            'body': this.state.currentcomment,
        })
    }
  }
  closefeed = () => {this.setState({openfeed: false})}

  handleMapClick = (map, evt) => {
    this.setState({addpopuplat: evt.lngLat.lat , addpopuplng: evt.lngLat.lng})
  }

  leafclick = (e, title, key, gv) => {
    this.setState({allowpopup: true, popuplat: e.lngLat.lat, popuplng: e.lngLat.lng, currentitle: title, feedkey: key})
  }

  clearpopup = () => {
    this.setState({popuplat: "", popuplng: "",currentitle: "", feedkey: "", allowpopup: false})
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
                {this.state.allowpopup ?(<Popup
                  coordinates={[this.state.popuplng,this.state.popuplat]}
                  offset={{
                    'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
                  }}>
                  <p>{this.state.currentitle}</p>
                  <Popcancel onClick={this.clearpopup}/>
                  <Popmore onClick={this.openfeed}/>
                </Popup>):(<div></div>)}
            </Map>


          <Dialog 
            modal={false} 
            open={this.state.openfeed} 
            onRequestClose={this.closefeed} 
            autoScrollBodyContent={true} 
            autoDetectWindowHeight={true}
            contentClassName="dialogwidth"
            title={this.state.currentitle}
            actions={[<input type="text" placeholder="Add a Comment" onChange={this.setcomment}></input>,
                <RaisedButton label="Submit" primary={true} onClick={this.addcomment} />]}
          >
                <List>
                    {this.state.feedcommentlist.map((comment, index)=>
                        <ListItem
                        key={comment.commentkey}
                        leftAvatar={<Avatar src="" />}
                        secondaryText={
                            <p>
                            {comment.body}
                            </p>
                        }
                    />)}
                </List>
          </Dialog>

      </div>
    )
  }
}

export default Mainmap