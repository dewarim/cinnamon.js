import React from 'react'
import FolderComp from './FolderComp.jsx'
export default class Repository extends React.Component {

    constructor(props) {
        super(props)
        this.fetchFolder = this.fetchFolder.bind(this)
        this.loadChildFolders = this.loadChildFolders.bind(this)

        let client = props.client
        let homeFolder = client.fetchFolderByPath(`/system/users/${client.username}/home`)
        let childFolders = []
        let query = this.createParentFolderSearchString(client, homeFolder.id)
        if (homeFolder.hasChildren) {
            childFolders = client.searchFolders(query)
        }
        console.log("found childFolders: " + childFolders)
        console.log(childFolders)

        this.state = {
            client: props.client,
            homeFolder: homeFolder,
        }

    }

    createParentFolderSearchString(client, id){
        return `<BooleanQuery>
                        <Clause occurs="must">
                            <TermQuery fieldName="parent">${client.padInteger(id, 20, 0)}</TermQuery>
                        </Clause>
                        <Clause occurs="must">
                            <TermQuery fieldName="javaClass">cinnamon.Folder</TermQuery>
                        </Clause>
                        <Clause occurs="mustNot">
                            <TermQuery fieldName="hibernateId">${client.padInteger(id,20,0)}</TermQuery>                        
                        </Clause>
                </BooleanQuery>`
    }

    fetchFolder(id) {
        return this.state.client.fetchFolder(id)
    }

    fetchObjectsOfFolder(id){
        return this.state.client.fetchObjects({id:id})
    }

    loadChildFolders(folder) {

        let childFolders = []
        let client = this.state.client
        if (folder.hasChildren) {
            let query = this.createParentFolderSearchString(client, folder.id)
            childFolders = client.searchFolders(query) .filter(f => {
                console.log(f.id + " is root: "+f.isRootFolder())
                return !f.isRootFolder()})
        }

        return childFolders.map((child) => {
                return <FolderComp folder={child} fetchFolder={this.fetchFolder} key={child.id} loadChildFolders={this.loadChildFolders}
                                   isChild={true} />
            }
        )
    }


    render() {
        let client = this.state.client
        return (
            <div id="repository">
                <p>
                User {client.username} is {client.isConnected ? '' : 'not'} connected to {client.url} with ticket: {client.ticket}
                </p>
                <div id="folderContent">
                    <FolderComp folder={this.state.homeFolder} fetchFolder={this.fetchFolder} loadChildFolders={this.loadChildFolders}
                                isChild={false}/>
                </div>
            </div>
        )

    }

}