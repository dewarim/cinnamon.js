/**
 * User: ingo
 * Date: 16.05.13
 * Time: 22:59
 */

function Folder(xml, registry) {
    this.registry = registry;
    this.parent = null;
    addFields(this, xml, null,
        {id: 'folder > id', name: 'folder > name', parentId: 'folder > parentId'},
        [
            {type: 'userAccount', path: 'folder > owner > id', field: 'owner'},
            {type: 'acl', path: 'folder > aclId', field: 'acl'},
            {type: 'folderType', path: 'folder > typeId', field: 'type'}
        ], registry);
    var meta = $(xml).find('folder > meta');
    if(meta.length){
        this.meta = meta.clone();
    }
}

Folder.prototype.getParent = function () {
    var self = this;
    if(self.isRootFolder()){
        return null
    }
    if(this.parent == null){
        this.parent = this.registry.get('folder', this.parentId);
    } 
    return this.parent;
};

Folder.prototype.isRootFolder = function(){
    return this.id == this.parentId
};
