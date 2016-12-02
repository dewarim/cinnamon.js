import {SHOW_FOLDER, SHOW_PARENT_FOLDER} from '../constants/actionTypes'
import {combineReducers} from 'redux'
import FolderHelper from './FolderHelper.jsx'

let initialState = {
    currentFolder: {
        isChild: false,
        folder: 0
    }
};


let folderHelper = new FolderHelper()

function show_folder(state = initialState, action) {
    console.log("show_folder state")
    console.log(state)
    if (state.folder == 0) {
        console.log("folderReducer: lazy load client for initialState")
        let path = folderHelper.getHomeFolder()
        state.folder = folderHelper.fetchFolderByPath(path)
    }

    switch (action.type) {
        case SHOW_FOLDER:
            console.log("folderReducer: SHOW_FOLDER")
            return folderHelper.buildCurrentFolderState(state, action.folderId)
            break;
        case SHOW_PARENT_FOLDER:
            let parentFolderId = folderHelper.fetchFolder(action.folderId).parentId
            return folderHelper.buildCurrentFolderState(state, parentFolderId)
        default:
            return state
    }
}

let reducer = (state, action) => {
    combineReducers(show_folder)
}

export default reducer