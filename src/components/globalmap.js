import React from 'react'
import ReactMapboxGl, {Popup, Cluster, Marker } from "react-mapbox-gl";
import firebase from 'firebase';


import Popmore from 'material-ui/svg-icons/navigation/arrow-forward'
import Popicon from 'material-ui/svg-icons/action/announcement'
import Upvote from 'material-ui/svg-icons/navigation/arrow-upward'
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';

const Map = ReactMapboxGl({
  accessToken: "",
  dragRotate: false
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
      currentcomment: "",
      commentcount: null,
      upvotes: null,
      showalreadyupvoted: false
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
                }else {
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

  upvotepost = () => {
      const user = firebase.auth().currentUser;
      if (user != null) {
        let feedkey = this.state.feedkey
        let upvotecheck = firebase.database().ref('users').child(user.uid).child('upvotes').once("value")
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
    const user = firebase.auth().currentUser;
      if (user != null) {
        firebase.database().ref('users').child(user.uid).child('markers').child(this.state.feedkey).update({
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
  closefeed = () => {this.setState({openfeed: false})}

  handleMapClick = (map, evt) => {
    this.setState({addpopuplat: evt.lngLat.lat , addpopuplng: evt.lngLat.lng})
  }

  leafclick = (lat, lng, title, key, c, up) => {
    this.setState({allowpopup: true, popuplat: lat, popuplng: lng, currentitle: title, feedkey: key, commentcount: c, upvotes: up})
  }

  clearpopup = () => {
    this.setState({popuplat: "", popuplng: "",currentitle: "", feedkey: "", allowpopup: false})
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
              containerStyle={{
                height: "100vh",
                width: "100vw"
              }}>
                <Cluster ClusterMarkerFactory={this.clusterMarker}>
                  {this.props.globalmarkers.map((marker, index)=><Marker
                                                            key={index} 
                                                            onClick={()=>{this.leafclick(marker.latitude, marker.longitude, marker.title, marker.feedkey, marker.commentcount, marker.upvotes)}}
                                                            coordinates={[marker.longitude, marker.latitude]}
                                                            ><Popicon/></Marker>)}
                </Cluster>
                {this.state.allowpopup ?(<Popup
                  coordinates={[this.state.popuplng,this.state.popuplat]}
                  offset={{
                    'bottom-left': [12, -38],  'bottom': [0, -38], 'bottom-right': [-12, -38]
                  }}>
                  <p>{this.state.currentitle}</p>
                  <Upvote onClick={this.upvotepost}/>
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