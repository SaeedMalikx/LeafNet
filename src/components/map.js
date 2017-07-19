import React from 'react'
import ReactMapboxGl, {Popup, Cluster, Marker } from "react-mapbox-gl";
import firebase from 'firebase';

import Popcancel from 'material-ui/svg-icons/navigation/cancel'
import Adder from 'material-ui/svg-icons/content/add-box'
import Popicon from 'material-ui/svg-icons/action/announcement'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Badge from 'material-ui/Badge';

const Map = ReactMapboxGl({
  accessToken: "",
  doubleClickZoom: false,
  dragRotate: false,
});

class Mainmap extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      allowpopup: false,
      allowaddpopup: false,
      popuplat: "",
      popuplng: "",
      addpopuplat: "",
      addpopuplng: "",
      openadder: false,
      addertitle: "",
      openfeed: false,
      currenttitle: "",
      feedkey: "",
      globalvalue: "",
      feedcommentlist: [],
      currentcomment: "",
      commentcount: null,
      center: [-73.985541, 40.757964],
    };
  }

  openadder = () => {this.setState({openadder: true})}
  closefeed = () => {this.setState({openfeed: false, openadder: false})}

  handleMapClick = (map, evt) => {
    this.setState({allowaddpopup: true, addpopuplat: evt.lngLat.lat , addpopuplng: evt.lngLat.lng})
  }

  setaddertitle = (title) => {
      this.setState({addertitle: title.target.value})
  }

  addtodb = () => {
    const user = firebase.auth().currentUser;
    if (user != null) {
        firebase.database().ref('users').child(user.uid).child('markers').push({
            'latitude': this.state.addpopuplat,
            'longitude': this.state.addpopuplng,
            'title': this.state.addertitle,
            'global': false,
            'commentcount': 0,
            'upvotes': 0
        })
    }
    this.setState({openadder: false,allowaddpopup: false,addpopuplat: "" , addpopuplng: ""})
  }

  publishpost = () => {
    const user = firebase.auth().currentUser;
    if (user != null) {
        firebase.database().ref('global').child('markers').child(this.state.feedkey).set({
            'latitude': this.state.popuplat,
            'longitude': this.state.popuplng,
            'title': this.state.currentitle,
            'feedkey': this.state.feedkey,
            'userid': user.uid,
            'username': user.email,
            'commentcount': 0,
            'upvotes': 0
        })
        firebase.database().ref('global').child('posts').child(this.state.feedkey).set({
            'title': this.state.currentitle,
        })
        firebase.database().ref('users').child(user.uid).child('markers').child(this.state.feedkey).update({
            'global': true
        })
    }
    this.setState({globalvalue: true})
  }
  
  unpublishpost = () => {
      const user = firebase.auth().currentUser;
      if (user != null) {
        firebase.database().ref('global').child('markers').child(this.state.feedkey).remove()
        firebase.database().ref('users').child(user.uid).child('markers').child(this.state.feedkey).update({
            'global': false
        })
        firebase.database().ref('global').child('posts').child(this.state.feedkey).remove()
    }
  }

  leafclick = (lat, lng, title, key, gv, c) => {
    this.setState({
      allowpopup: true, 
      popuplat: lat, 
      popuplng: lng, 
      currentitle: title, 
      feedkey: key, 
      globalvalue: gv, 
      commentcount: c
    })
  }

  clearpopup = () => {
    this.setState({popuplat: "", popuplng: "",currentitle: "", feedkey: "", allowpopup: false, globalvalue: false})
  }
  clearaddpopup = () => {
    this.setState({addpopuplat: "", addpopuplng: "", allowaddpopup: false})
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
                } else {
                  this.setState({feedcommentlist: []})
                }
    });
    this.setState({openfeed: true})
  }

  setcomment = (comment) => {
      this.setState({currentcomment: comment.target.value})
  }

  addcomment = () => {
    const user = firebase.auth().currentUser;
    let commentc = this.state.commentcount + 1
    this.setState({commentcount: commentc})
    if (user != null) {
        firebase.database().ref('global').child('posts').child(this.state.feedkey).child('comments').push({
            'body': this.state.currentcomment,
        })
        firebase.database().ref('users').child(user.uid).child('markers').child(this.state.feedkey).update({
            'commentcount': commentc
        })
        firebase.database().ref('global').child('markers').child(this.state.feedkey).update({
            'commentcount': commentc
        })
    }
    this.setState({currentcomment: ""})
  }
  clusterMarker = (coordinates, pointCount) => (
    <Marker key={coordinates} coordinates={coordinates} >
        <FloatingActionButton mini={true} secondary={true}>
            {pointCount}
        </FloatingActionButton>
    </Marker>
  );
  render() {
    return (
      <div>
          <Map
              style="mapbox://styles/mapbox/light-v9"
              onClick={this.clearpopup}
              onDblClick={this.handleMapClick}
              center={this.state.center}
              containerStyle={{
                height: "100vh",
                width: "100vw"
              }}>
                <Cluster ClusterMarkerFactory={this.clusterMarker}>
                  {this.props.markers.map((marker, index)=><Marker
                                                            key={index} 
                                                            onClick={()=>{this.leafclick(marker.latitude, marker.longitude, marker.title, marker.postkey, marker.globalvalue, marker.commentcount)}}
                                                            coordinates={[marker.longitude, marker.latitude]}
                                                            >
                                                            <Badge badgeContent={marker.commentcount} primary={true}><Popicon/></Badge>
                                                            </Marker>)}
                </Cluster>
                {this.state.allowpopup ?(<Popup
                  coordinates={[this.state.popuplng,this.state.popuplat]}
                  offset={{
                    'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
                  }}>
                  <h3>{this.state.currentitle}</h3>
                  <RaisedButton label="Comments" primary={true}  onClick={this.openfeed}/>
                  {this.state.globalvalue ? (<RaisedButton label="UnPublish" secondary={true}  onClick={this.unpublishpost}/>):(<RaisedButton label="Publish" secondary={true}  onClick={this.publishpost}/>)}
                </Popup>):(<div></div>)}
                {this.state.allowaddpopup ? (<Popup
                  coordinates={[this.state.addpopuplng,this.state.addpopuplat]}
                  offset={{
                    'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
                  }}>
                  <h3>Add a Note Here</h3>
                  <Popcancel onClick={this.clearaddpopup}/>
                  <Adder onClick={this.openadder}/>
                </Popup>):(<div></div>)}
            </Map>


          <Dialog modal={false} open={this.state.openadder} onRequestClose={this.closefeed} autoDetectWindowHeight={true}>
                <input type="text" placeholder="Post Title" onChange={this.setaddertitle}></input>
                <RaisedButton label="Add" secondary={true} onClick={this.addtodb} />
          </Dialog>

          
          <Dialog 
            modal={false} 
            open={this.state.openfeed} 
            onRequestClose={this.closefeed} 
            autoScrollBodyContent={true} 
            autoDetectWindowHeight={true}
            contentClassName="dialogwidth"
            title={this.state.currentitle}
            actions={[<input type="text" placeholder="Add a Comment" onChange={this.setcomment} value={this.state.currentcomment}></input>,
                <RaisedButton label="Submit" primary={true} onClick={this.addcomment} />]}
          >
                <List>
                    {this.state.feedcommentlist.map((comment, index)=>
                        <ListItem
                        disabled={true}
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