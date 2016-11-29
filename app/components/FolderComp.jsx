import React from "react";
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
    }

    loadParentFolder(e) {
        let folder = this.state.folder
        if(folder.isRootFolder()){
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

    stepIntoFolder(folderId, e) {
        console.log(folderId)
        console.log(e)
        let folder = this.fetchFolder(folderId)
        this.setState({folder: folder,
            isChild:false
        })
    }

    createClickableFolderList(folders) {
        return folders.map((folderComponent) => {
                let folder = folderComponent.props.folder
                return (
                    <li onClick={this.stepIntoFolder.bind(null, folder.id)} key={folder.id}>
                        {folderComponent}
                    </li>
                )
            }
        )
    }

    render() {
        let folder = this.state.folder
        let childFolders = this.loadChildFolders(folder)
        let childFolderList
        if(!this.state.isChild) {
            childFolderList = <ul>{this.createClickableFolderList(childFolders)}</ul>
        }
        let parentFolderButton
        if(! this.state.isChild && !folder.isRootFolder()){
            console.log(folder.name + " is not root folder")
            parentFolderButton = <button onClick={this.loadParentFolder}>Parent Folder</button>
        }
        return (
            <div className="folder">
                {folder.name} {parentFolderButton}
                <br/>
                    {childFolderList}
            </div>

        )

    }
}