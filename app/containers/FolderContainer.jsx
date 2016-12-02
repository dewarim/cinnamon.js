/**
 * React component to render a Cinnamon Folder which
 * contains a name, a button for the parent folder and a clickable list of child folders.
 *
 */

import React from "react";
import FolderWidget from '../components/FolderWidget.jsx'
import {showFolderAction} from '../actions/folderActions'
import {connect} from 'react-redux'
import FolderHelper from '../reducers/FolderHelper.jsx'

function mapStateToProps(state) {
    if (state) {
        return state.currentFolder
    }
    else {
        let folderHelper = new FolderHelper()
        let folder = folderHelper.fetchFolderByPath(folderHelper.getHomeFolder())
        return folderHelper.buildCurrentFolderState(state, folder.id)
    }

}

function mapDispatchToProps(dispatch) {
    return {
        showFolder(id) {
            console.log("dispatch for showFolderAction "+id)
            dispatch(showFolderAction(id))

        }
    }
}

let FolderContainer = connect(mapStateToProps, mapDispatchToProps)(FolderWidget)
export default FolderContainer