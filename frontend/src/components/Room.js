import React,{Component} from 'react'
import { useParams } from "react-router-dom";
function withParams(Component) {
    return props => <Component {...props} params={useParams()} />;
  }
 class Room extends Component {
    constructor(props){
        super(props)
        this.state={
            votesToSkip:2,
            guestCanPause:false,
            isHost:false,
        }
        this.roomCode=this.props.params.roomCode;
    }

getRoomDetails(){
    fetch("/api/get_room"+"?code="+this.roomCode)
    .then(response=>response.json())
    .then(data=>{
        console.log(data)
        this.setState({
            votesToSkip:data.votes_to_skip,
            guestCanPause:data.guest_can_pause,
            isHost:data.is_host
        })
    })
}
componentDidMount(){
    this.getRoomDetails()
}

    render() {
        console.log(this.roomCode)
        
        return (
            <div>
                <h3>{this.roomCode}</h3>
                <p>Votes: {this.state.votesToSkip}</p>
                <p>Guest Can Pause: {this.state.guestCanPause.toString()}</p>
                <p>is Host: {this.state.isHost.toString()}</p>
            </div>
        )
    }
}
export default withParams(Room)
