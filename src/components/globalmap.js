import React from 'react'
import ReactMapboxGl, {Popup, Cluster, Marker } from "react-mapbox-gl";
import firebase from 'firebase';


import Popicon from 'material-ui/svg-icons/action/announcement'
import Upvote from 'material-ui/svg-icons/maps/navigation'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Snackbar from 'material-ui/Snackbar';
import Badge from 'material-ui/Badge';

const Map = ReactMapboxGl({
  accessToken: "",
  dragRotate: false,
  doubleClickZoom: false,
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
      postuserid: null,
      feedcommentlist: [],
      currentcomment: "",
      commentcount: null,
      upvotes: null,
      showalreadyupvoted: false,
      showupvoted: false,
      center: [-73.985541, 40.757964],
      zoom: [9]
    };
  }

  openfeed = () => {
    this.setState({openfeed: true, feedcommentlist: []})
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
                }else {
                  this.setState({feedcommentlist: []})
                }
    });
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
        firebase.database().ref('users').child(this.state.postuserid).child('markers').child(this.state.feedkey).update({
            'commentcount': commentc
        })
        firebase.database().ref('global').child('markers').child(this.state.feedkey).update({
            'commentcount': commentc
        })
    }
    this.setState({currentcomment: ""})
  }

  upvotepost = () => {
      const user = firebase.auth().currentUser;
      if (user != null) {
        let feedkey = this.state.feedkey
        firebase.database().ref('users').child(user.uid).child('upvotes').once("value")
            .then(snapshot => {
                if(snapshot.hasChild(feedkey)){
                  this.setState({showalreadyupvoted: true}) 
                } else {
                    this.commitupvote();
                }
            });
    }
  }

  commitupvote = () => {
    let upvotec = this.state.upvotes + 1
    this.setState({showupvoted: true, upvotes: upvotec})
    const user = firebase.auth().currentUser;
      if (user != null) {
        firebase.database().ref('users').child(this.state.postuserid).child('markers').child(this.state.feedkey).update({
                'upvotes': upvotec
            })
            firebase.database().ref('users').child(user.uid).child('upvotes').child(this.state.feedkey).set({
                'upvoted': true
            })
            firebase.database().ref('global').child('markers').child(this.state.feedkey).update({
                'upvotes': upvotec
            })
    }
  }
  closefeed = () => {
      firebase.database().ref('global').child('posts').child(this.state.feedkey).child('comments').off('value',snap=>{})
      this.setState({openfeed: false})
  }

  handleMapClick = (map, evt) => {
    this.setState({addpopuplat: evt.lngLat.lat , addpopuplng: evt.lngLat.lng})
  }

  leafclick = (lat, lng, title, key, c, up, id) => {
    this.setState({
        allowpopup: true, 
        popuplat: lat, 
        popuplng: lng, 
        currentitle: title, 
        feedkey: key, 
        commentcount: c, 
        upvotes: up, 
        postuserid: id, 
        showalreadyupvoted: false, 
        showupvoted: false
    })
  }

  clearpopup = () => {
    this.setState({popuplat: "", popuplng: "",currentitle: "", feedkey: "", allowpopup: false, showalreadyupvoted: false, showupvoted: false})
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
              center={this.state.center}
              zoom={this.state.zoom}
              containerStyle={{
                height: "100vh",
                width: "100vw"
              }}>
                <Cluster ClusterMarkerFactory={this.clusterMarker}>
                  {this.props.globalmarkers.map((marker, index)=><Marker
                                                                key={index} 
                                                                onClick={()=>{this.leafclick(marker.latitude, marker.longitude, marker.title, marker.feedkey, marker.commentcount, marker.upvotes, marker.userid)}}
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
                  <RaisedButton label={this.state.upvotes} primary={true} onClick={this.upvotepost} icon={<Upvote />} />
                  <RaisedButton label={this.state.commentcount} secondary={true}  onClick={this.openfeed}  icon={<Popicon />}/>
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

          <Snackbar
            open={this.state.showalreadyupvoted}
            message="Already Upvoted "
            autoHideDuration={1000}
          />
          <Snackbar
            open={this.state.showupvoted}
            message="Upvoted"
            autoHideDuration={1000}
          />
      </div>
    )
  }
}

export default Mainmap