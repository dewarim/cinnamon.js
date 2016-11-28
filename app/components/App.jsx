import React from 'react'
import Cinnamon from '../core/Cinnamon'
import FolderComp from './FolderComp.jsx'

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
        let homeFolder = client.fetchFolderByPath('/system/users/admin/home')
        let childFolders = []
        if(homeFolder.hasChildren){
            childFolders = client.searchFolders(`<BooleanQuery fieldName="parent"><Clause occurs="must"><TermQuery>${client.padInteger(homeFolder.id, 20, 0)}</TermQuery></Clause></BooleanQuery>`)
        }
        console.log("found childFolders: "+childFolders)
        console.log(childFolders)
        return (
            <div>
                User {client.username} is {client.isConnected ? '' : 'not'} connected to {client.url} with ticket: {client.ticket}
                <br/>
                <FolderComp folder={homeFolder} />
            </div>
        );
    }
}
