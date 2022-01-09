import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import TextField from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import FormControl from '@material-ui/core/FormControl'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
function withParams(Component) {
    return props => <Component {...props} navigate={useNavigate()} />;
  }

 class CreateRoomPage extends Component {
    constructor(props){
        super(props)
        this.state={
            guestCanPause:true,
            votesToSkip:this.defaultVotes
        }
        this.handleRoomButtonPressed=this.handleRoomButtonPressed.bind(this)
        this.handaleVotesChange=this.handaleVotesChange.bind(this)
        this.handleGuestCanPauseChange=this.handleGuestCanPauseChange.bind(this)
        this.navigate=this.props.navigate;
    }
    handaleVotesChange(e){
        this.setState({
            votesToSkip:e.target.value
        })
    }
    handleGuestCanPauseChange(e){
        this.setState({
            guestCanPause:e.target.value==="true"?true:false
        })
    }
    handleRoomButtonPressed(){
        
        const reqestOptions={
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                votes_to_skip:this.state.votesToSkip,
                guest_can_pause:this.state.guestCanPause
            })
        }
        fetch("/api/create_room",reqestOptions)
        .then((response)=>response.json())
        .then((data)=>this.navigate(`/room/${data.code}`))
    }
    render() {
        return (
        <Grid container spacing={1}>
            <Grid items xs={12} align="center" >
                <Typography component="h4" variant="h4">
                    Create A Room
                </Typography>
            </Grid>
            <Grid items xs={12} align="center" >
               <FormControl component="fieldset">
                   <FormHelperText>
                       <div align="center">
                        Guest control playback state
                       </div>
                   </FormHelperText>
                   <RadioGroup row defaultValue="true" onChange={this.handleGuestCanPauseChange}>
                       <FormControlLabel 
                       value="true" 
                       control={<Radio color='primary'/>} 
                       label="Play/Pause"
                       labelPlacement="bottom"
                       />
                       <FormControlLabel 
                       value="false" 
                       control={<Radio color='secondary'/>} 
                       label="No control"
                       labelPlacement="bottom"
                       />
                   </RadioGroup> 
               </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
            <FormControl>
                <TextField required={true} 
                type="number"
                onChange={this.handaleVotesChange}
                defaultValue={this.defaultVotes}
                inputProps={{
                    min:1,
                    style:{textAlign:"center"}
                }}
                />
                <FormHelperText>
                    <div align="center">Votes Required To Skip Song</div>
                </FormHelperText>
            </FormControl>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="primary" 
                onClick={this.handleRoomButtonPressed}
                variant="contained">Create A Room</Button>
            </Grid>
            <Grid item xs={12} align="center">
                <Button color="secondary" variant="contained" to="/" component={Link}>Back</Button>
            </Grid>
        </Grid>
        )
    }
}

export default withParams(CreateRoomPage);