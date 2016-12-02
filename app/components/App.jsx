import React from 'react'
import {Client} from '../core/Client'
import Repository from './Repository.jsx'
import {Router, Route, Link} from 'react-router'

export default class App extends React.Component {

    constructor(props) {
        super(props);

        // create a global Cinnamon client
        let client = new Client({
            username: 'admin',
            password: 'admin',
            url: 'http://localhost:8080/cinnamon/'
        })

        client.connect()
    }

    render() {
        /*
         // TODO: later use react routing (when v4 is out, which allows more 'react-like' declarations)
         let repository = <Repository client={client}/>
         return (
         <Router>
         <Route path='/' component={repository}/> // does not work this way.
         </Router>
         );
         */

        return (
            <div>
                <Repository />
            </div>
        );
    }
}
