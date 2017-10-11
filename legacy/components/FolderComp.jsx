import React from "react";

/**
 * React component to render a Cinnamon Folder which
 * contains a name, a button for the parent folder and a clickable list of child folders.
 *
 * props should contain:
 * - folder
 * - isChild
 * - fetchFolder-ref
 * - loadChildFolder-ref
 *
 * Object's state contains:
 * {
     *  folder: the Cinnamon object as JavaScript class
     *  isChild: if true, do not render list child folders
     * }
 *
 */
import ChildFolder from './ChildFolder.jsx'
import OsdRowComponent from './OsdRowComponent.jsx'
export default class FolderComp extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            folder: props.folder,
            isChild: props.isChild
        }
        this.fetchFolder = props.fetchFolder
        this.loadParentFolder = this.loadParentFolder.bind(this)
        this.loadChildFolders = props.loadChildFolders
        this.stepIntoFolder = this.stepIntoFolder.bind(this)
        this.fetchObjects = props.fetchObjects
    }

    loadParentFolder(e) {
        let folder = this.state.folder
        if (folder.isRootFolder()) {
            console.log("loadParentFolder: already at root level.")
            return
        }
        console.log("current.id=" + folder.id)
        let parent = this.fetchFolder(folder.parentId)
        console.log("new.id=" + parent.id)
        if (parent.isRootFolder()) {
            console.log(parent.id + " is root folder")
        }
        this.setState({folder: parent})
    }

    loadFolderContent(folderId, e) {
        return this.fetchObjects(folderId)
    }

    stepIntoFolder(folderId, e) {
        e.stopPropagation()
        let folder = this.fetchFolder(folderId)
        this.setState({
            folder: folder,
            isChild: false
        })
    }

    createClickableFolderList(folders) {
        return folders.map((folderComponent) => {
                let folder = folderComponent.props.folder
                return (
                    <li key={folder.id}>
                        <ChildFolder stepInto={this.stepIntoFolder} folder={folder} key={folder.id}/>
                    </li>
                )
            }
        )
    }

    createTableOfFolderContent(objects) {
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

    render() {
        let folder = this.state.folder
        let childFolders = this.loadChildFolders(folder)
        let childFolderList
        if (!this.state.isChild) {
            childFolderList = <ul>{this.createClickableFolderList(childFolders)}</ul>
        }
        let parentFolderButton
        if (!this.state.isChild && !folder.isRootFolder()) {
            console.log(folder.name + " is not root folder")
            parentFolderButton = <button onClick={this.loadParentFolder}>Parent Folder</button>
        }
        let objects = this.loadFolderContent(folder.id)
        let objectTable
        if (objects.length > 0) {
            console.log("found objects:")
            console.log(objects)
            objectTable = this.createTableOfFolderContent(objects)
        }

        return (
            <div className="folder">
                {folder.name} {parentFolderButton}
                <div className="child-folders">
                    {childFolderList}
                </div>
                <div className="folder-content">
                    {objectTable}
                </div>
            </div>

        )

    }
}