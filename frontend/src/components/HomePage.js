import React, { Component } from 'react'
import RoomJoinPage from './RoomJoinPage'
import CreateRoomPage from './CreateRoomPage'
import {Link} from 'react-router-dom'
import {ButtonGroup,Button,Grid,Typography} from '@material-ui/core';
import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";
import Room from './Room';
export default class HomePage extends Component {
    constructor(props){
        super(props)
    }
async componentDidMount(){
  
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
    render() {
        return (
            <BrowserRouter>
            <Routes>
              <Route path="/" element={this.rendeHomePage()}/>
              <Route path="/join" element={<RoomJoinPage />} />
              <Route path="/room/:roomCode" element={<Room />} />
                <Route path="/create" element={<CreateRoomPage />}>
                  {/* <Route path=":teamId" element={<Team />} /> */}
                </Route>

         
            </Routes>
          </BrowserRouter>
        )
    }
}
