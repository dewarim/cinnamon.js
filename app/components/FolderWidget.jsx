import React from "react";
// import ChildFolder from './ChildFolder.jsx'

let FolderWidget = (props) => {
    console.log("FolderWidget.props:")
    console.log(props)
    let {folder, parentFolderButton, childFolderList, objectTable} = props.currentFolder

    let boundShowFolder = props.showFolder.bind(this)

    /*
     <ChildFolder showFolder={boundShowFolder} folder={folder} key={folder.id}/>
     */

    return <div className="folder">
        {folder.name} {parentFolderButton}
        <div className="child-folders">
            <ul>
            {childFolderList.map(folder => {
                return (
                    <li key={folder.id}>
                        <a href="#" onClick={ () => boundShowFolder(folder.id)}>{folder.name}</a>
                    </li>

                )
            })}
                </ul>
        </div>
        <div className="folder-content">
            {objectTable}
        </div>
    </div>

}

export default FolderWidget

