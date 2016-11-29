import React from 'react'
import Cinnamon from '../core/Cinnamon'
import Repository from './Repository.jsx'

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            client: new Cinnamon({
                username:'admin',
                password:'admin',
                url:'http://localhost:8080/cinnamon/'

            })
        };

        this.state.client.connect()
    }


    render() {
        let client = this.state.client
        return (
            <div>
                User {client.username} is {client.isConnected ? '' : 'not'} connected to {client.url} with ticket: {client.ticket}
                <br/>
                <Repository client={client}/>
            </div>
        );
    }
}
