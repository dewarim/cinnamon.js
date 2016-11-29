import React from 'react'
import Cinnamon from '../core/Cinnamon'
import Repository from './Repository.jsx'
import {Router, Route, Link} from 'react-router'

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            client: new Cinnamon({
                username: 'admin',
                password: 'admin',
                url: 'http://localhost:8080/cinnamon/'

            })
        };

        this.state.client.connect()
    }


    render() {
        let client = this.state.client

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
                <Repository client={client}/>
            </div>
        );
    }
}
