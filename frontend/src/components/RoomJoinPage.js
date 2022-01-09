import React, { Component } from 'react'
import {TextField,Button,Grid,Typography} from '@material-ui/core';
import {Link} from 'react-router-dom'
import { useNavigate } from "react-router-dom";

function withParams(Component) {
    return props => <Component {...props} navigate={useNavigate()} />;
  }

class RoomJoinPage extends Component {
    constructor(props){
        super(props)
        this.state={
            roomCode:"",
            error:""
        }
        this.handleTextFieldChange=this.handleTextFieldChange.bind(this)
        this.roomButtonPressed=this.roomButtonPressed.bind(this)
        this.navigate=this.props.navigate;
    }
    render() {
        return (
           <Grid container spacing={1} align='center'>
               <Grid item xs={12}>
                    <Typography variant="h4" component="h4">
                            Join a Room
                    </Typography>
               </Grid>
                <Grid item xs={12} align="center">
                    <TextField  
                    error={this.state.error}
                    label="Code" 
                    placeholder="Enter the Room code"
                    defaulValue={this.state.roomCode}
                    helperText={this.state.error}
                    variant="outlined"
                    onChange={this.handleTextFieldChange}
                    />
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="secandary" onClick={this.roomButtonPressed} >Enter Room</Button>
                </Grid>
                <Grid item xs={12} align="center">
                    <Button variant="contained" color="primary" to='/' component={Link}>Go Back</Button>
                </Grid>
           </Grid>
        )
    }
    handleTextFieldChange(e){
        this.setState({
            roomCode:e.target.value
        })
    }
    roomButtonPressed(){
        const requestOptions={
            method:"POST",
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
                code:this.state.roomCode
            })
        }
        fetch('/api/join-room',requestOptions).then((response)=>{
            if(response.ok){
                this.navigate(`/room/${this.state.roomCode}`)
            }else{
                this.setState({error:"Room not Found"})
            }
        }).catch((error)=>{
            console.log(error)
        })
    }
}
export default withParams(RoomJoinPage)