import {getClient} from '../core/Client'
import OsdRowComponent from '../components/OsdRowComponent.jsx'
import ChildFolder from '../components/ChildFolder.jsx'
import React from 'react'
import {showFolderAction} from '../actions/folderActions'

export default class FolderHelper {

    constructor() {
        // initialize client here, assuming that by now the client is configured.
        this.client = getClient()
        this.myClient.bind(this)
        this.buildCurrentFolderState.bind(this)
    }

    myClient() {
        return this.client
    }

    createParentFolderSearchString(id) {
        let client = this.myClient()
        return `<BooleanQuery>
                        <Clause occurs="must">
                            <TermQuery fieldName="parent">${client.padInteger(id, 20, 0)}</TermQuery>
                        </Clause>
                        <Clause occurs="must">
                            <TermQuery fieldName="javaClass">cinnamon.Folder</TermQuery>
                        </Clause>
                        <Clause occurs="mustNot">
                            <TermQuery fieldName="hibernateId">${client.padInteger(id, 20, 0)}</TermQuery>                        
                        </Clause>
                </BooleanQuery>`
    }

    generateObjectsTable(folderId) {
        let objects = this.myClient().fetchObjects({id: folderId})
        if (objects.length == 0) {
            return
        }
        let objectComponents = objects.map(osd => {
            return <OsdRowComponent osd={osd} key={osd.id}/>
        })
        return (
            <table className="osd-table">
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Version</th>
                    <th>Size</th>
                    <th>Language</th>
                    <th>Owner</th>
                    <th>Locked by</th>
                </tr>
                </thead>
                <tbody>
                {objectComponents}
                </tbody>
            </table>
        )
    }

    loadChildFolders(folder) {

        let childFolders = []
        let client = this.myClient()
        if (folder.hasChildren) {
            let query = this.createParentFolderSearchString(folder.id)
            childFolders = client.searchFolders(query).filter(f => {
                console.log(f.id + " is root: " + f.isRootFolder())
                return !f.isRootFolder()
            })
        }

        return childFolders
    }

    createClickableFolderList(folders) {
        return folders.map((folder) => {
                return (
                    <li key={folder.id}>
                        <ChildFolder showFolder={() => console.log("child: "+folder.id)} folder={folder} key={folder.id}/>
                    </li>
                )
            }
        )
    }

    fetchFolderByPath(path) {
        return this.myClient().fetchFolderByPath(path)
    }

    getHomeFolder() {
        let client = this.myClient()
        return `/system/users/${client.username}/home`
    }

    loadParentFolder(folder) {
        if (folder.isRootFolder()) {
            console.log("loadParentFolder: already at root level.")
            return
        }
        let parent = this.myClient().fetchFolder(folder.parentId)
        if (parent.isRootFolder()) {
            console.log(parent.id + " is root folder")
        }
        return parent
    }

    buildCurrentFolderState(state, folderId) {
        console.log("build currentFolderState for "+folderId)
        console.log(state)
        let folder = this.myClient().fetchFolder(folderId)
        let parent = this.loadParentFolder(folder)
        let objectTable = this.generateObjectsTable(folderId)
        let childFolders = this.loadChildFolders(folder)
        let childFolderList = this.createClickableFolderList(childFolders)
        return {
            ...state,
            currentFolder: {
                folder: parent,
                isChild: false,
                objectTable: objectTable,
                childFolderList: childFolders
            }
        }

    }


}