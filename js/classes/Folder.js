/**
 * User: ingo
 * Date: 16.05.13
 * Time: 22:59
 */

function Folder(xml, registry) {
    this.registry = registry;
    addFields(this, xml, null,
        {id: 'folder > id', name: 'folder > name', parentId: 'folder > parentId'},
        [
            {type: 'userAccount', path: 'folder > owner > id', field: 'owner'},
            {type: 'acl', path: 'folder > aclId', field: 'acl'},
            {type: 'folderType', path: 'folder > typeId', field: 'type'},
            {type: 'folder', path: 'folder > parentId', field: 'parent'}
        ], registry);

}

Folder.prototype.getParent = function () {
    // TODO: implement getParent
    // must check if this is the rootFolder to avoid endless loop.    
};

Folder.prototype.isRootFolder = function(){
    // TODO: implement isRootFolder
};
