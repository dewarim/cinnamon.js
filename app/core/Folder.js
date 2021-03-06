import CinnamonBaseObject from './CinnamonBaseObject'
export default class Folder {

    constructor(xml, registry) {
        this.registry = registry;
        this.parent = null;
        CinnamonBaseObject.addFields(this, xml, null,
            {
                id: 'folder > id',
                name: 'folder > name',
                parentId: 'folder > parentId',
                summary: 'folder > summary',
                hasChildren: 'folder > hasChildren'
            },
            [
                {type: 'userAccount', path: 'folder > owner > id', field: 'owner', doFetch:true},
                {type: 'acl', path: 'folder > aclId', field: 'acl', doFetch:true},
                {type: 'folderType', path: 'folder > typeId', field: 'folderType', doFetch:true}
            ], registry);
        var meta = $(xml).find('folder > meta');
        if (meta.length) {
            this.meta = meta.clone();
        }
        console.log(this)
        this.isRootFolder.bind(this)
        this.getParent.bind(this)
    }

    getParent() {
        var self = this;
        if (self.isRootFolder()) {
            return null
        }
        if (this.parent == null) {
            this.parent = this.registry.get('folder', this.parentId);
        }
        return this.parent;
    };

    isRootFolder() {
        console.log(`this.id=${this.id} parentId=${this.parentId}`)
        return this.id == this.parentId
    };


}