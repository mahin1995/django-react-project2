import React,{Component} from 'react'
import { useParams } from "react-router-dom";
import {ButtonGroup,Button,Grid,Typography} from '@material-ui/core';
import { useNavigate } from "react-router-dom";
import CreateRoomPage from './CreateRoomPage'
function withParams(Component) {
    return props => <Component {...props} params={useParams()} navigate={useNavigate()} />;
  }
 class Room extends Component {
    constructor(props){
        super(props)
        this.state={
            votesToSkip:2,
            guestCanPause:false,
            isHost:false,
            showSettings:false
        }
        this.roomCode=this.props.params.roomCode;
        this.navigate=this.props.navigate;
        this.renderSettings=this.renderSettings.bind(this)
        this.renderSettings=this.renderSettings.bind(this)
        this.renderSettingsButton=this.renderSettingsButton.bind(this)
        this.getRoomDetails=this.getRoomDetails.bind(this)
        this.getRoomDetails()
    }

getRoomDetails(){
    fetch("/api/get_room"+"?code="+this.roomCode)
    .then(response=>{
        if(!response.ok){
            this.props.leaveRoomCallback()
            this.navigate(`/`)
        }
       return    response.json()
    })
    .then(data=>{
        console.log(data)
        this.setState({
            votesToSkip:data.votes_to_skip,
            guestCanPause:data.guest_can_pause,
            isHost:data.is_host
        })
    })
    this.leaveButtonPressed=this.leaveButtonPressed.bind(this)
    this.updateShowSettings=this.updateShowSettings.bind(this)
}
// componentDidMount(){
//     this.getRoomDetails()
// }
leaveButtonPressed(){
        const requestOptions={
            method:'POST',
            headers:{
                "Content-type":"application/json"
            }
        }
        fetch('/api/leave-room',requestOptions).then((_response)=>{
            this.navigate(`/`)
        })
}
updateShowSettings(value){
    this.setState({
        showSettings:value
    })
}

renderSettings(){
 return(   <Grid container spcing={1}>
         <Grid item xs={12} align="center">
            <CreateRoomPage 
            update={true} 
            votesToSkip={this.state.votesToSkip}
            guestCanPause={this.state.guestCanPause}
            roomCode={this.roomCode}
            updateCallback={this.getRoomDetails}
            />

         </Grid>
         <Grid item xs={12} align="center">
         
             <br/>
            <Button variant="contained" 
            color="secondary" 
            onClick={()=>this.updateShowSettings(false)} >
                close</Button>

         </Grid>
    </Grid>)
}


renderSettingsButton(){
    return (
        <Grid itme xs={12} align="center" >
            <Button variant="contained" color="primary" onClick={()=>this.updateShowSettings(true)} >setting</Button>
        </Grid>
    )
}

    render() {
        if(this.state.showSettings){
            return this.renderSettings()
        }
        return (
            <Grid container spacing={1}>
                    <Grid item xs={12} align="center">
                        <Typography varient="h4" component="h4">
                                Code:{this.roomCode}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                    <Typography varient="h6" component="h6">
                    Votes: {this.state.votesToSkip}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                    <Typography varient="h6" component="h6">
                    Guest Can Pause: {this.state.guestCanPause.toString()}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} align="center">
                    <Typography varient="h6" component="h6">
                    is Host: {this.state.isHost.toString()}
                        </Typography>
                    </Grid>
                    {this.state.isHost ? this.renderSettingsButton():null}
                    <Grid item xs={12} align="center">
                        <Button color="secondary" variant="contained" onClick={this.leaveButtonPressed} >Leave Room</Button>
                    </Grid>
            </Grid>
            // <div>
            //     <h3>{this.roomCode}</h3>
            //     <p>Votes: {this.state.votesToSkip}</p>
            //     <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
            //     <p>is Host: {this.state.isHost.toString()}</p>
            // </div>
        )
    }
}
export default withParams(Room)
