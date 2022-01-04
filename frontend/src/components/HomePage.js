import React, { Component } from 'react'
import RoomJoinPage from './RoomJoinPage'
import CreateRoomPage from './CreateRoomPage'

import {
    BrowserRouter,
    Routes,
    Route
  } from "react-router-dom";
export default class HomePage extends Component {
    constructor(props){
        super(props)
    }
    render() {
        return (
            <BrowserRouter>
            <Routes>
              <Route path="/" element={<>THis home page</>}/>
              <Route path="/join" element={<RoomJoinPage />} />
                <Route path="/create" element={<CreateRoomPage />}>
                  {/* <Route path=":teamId" element={<Team />} /> */}
                </Route>

         
            </Routes>
          </BrowserRouter>
        )
    }
}
