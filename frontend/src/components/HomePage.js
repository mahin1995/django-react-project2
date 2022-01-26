import React, { Component } from 'react'
import RoomJoinPage from './RoomJoinPage'
import CreateRoomPage from './CreateRoomPage'
import {Link} from 'react-router-dom'
import {ButtonGroup,Button,Grid,Typography} from '@material-ui/core';
import { Navigate } from "react-router-dom";

import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";
import Room from './Room';
function PrivateRoute(props) {
    return props.roomcode? <Navigate to={`/room/${props.roomcode}`} />:props.children ;

}
 class HomePage extends Component {
    constructor(props){
        super(props)
        this.state=({
          roomCode:null
        })
        this.clearRoomCode=this.clearRoomCode.bind(this)
    }
async componentDidMount(){
  fetch("/api/user-in-room")
  .then((response)=>response.json())
  .then((data)=>{
    console.log(data)
    this.setState({
      roomCode:data.code
    })
  })

}

    rendeHomePage(){
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} align="center">
            <Typography varient="h3" compact="h3">
              House Party
            </Typography>
          </Grid>
          <Grid item xs={12} align="center">
            <ButtonGroup disableElevation varient="contained" color="primary">
              <Button color="primary" to="/join" component={Link} >Join a Room</Button>
              <Button color="secondary" to="/create" component={Link} >Create a Room</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      )
    }
clearRoomCode(){
  this.setState({
    roomCode:null
  })
}
    render() {
        return (
            <BrowserRouter>
            <Routes>
              <Route path="/" element={ 
                <PrivateRoute roomcode={this.state.roomCode}>
                  {this.rendeHomePage()}
                </PrivateRoute>
                } />
             

              <Route path="/join" element={<RoomJoinPage />} />
              <Route path="/room/:roomCode" element={<Room leaveRoomCallback={this.clearRoomCode} />} />
                <Route path="/create" element={<CreateRoomPage />}>
                  {/* <Route path=":teamId" element={<Team />} /> */}
                </Route>

         
            </Routes>
          </BrowserRouter>
        )
    }
}
export default HomePage