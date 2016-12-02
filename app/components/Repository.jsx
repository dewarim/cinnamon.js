import React from 'react'
import FolderContainer from '../containers/FolderContainer.jsx'
import {getClient} from '../core/Client'

export default class Repository extends React.Component {

    constructor(props) {
        super(props)
    }

    render() {
        let client = getClient()
        return (
            <div id="repository">
                <p>
                User {client.username} is {client.isConnected ? '' : 'not'} connected to {client.url} with ticket: {client.ticket}
                </p>
                <div id="folderContent">
                    <FolderContainer/>
                </div>
            </div>
        )

    }

}