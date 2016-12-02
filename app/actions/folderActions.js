import {SHOW_FOLDER} from '../constants/actionTypes'

// actionCreator:
function showFolderAction(id) {
    console.log("showFolderAction: "+id)
    return {
        type: SHOW_FOLDER,
        folderId: id
    }
}

export {showFolderAction}