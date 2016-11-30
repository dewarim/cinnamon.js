import CinnamonBaseObject from './CinnamonBaseObject'
export default class Osd {

    constructor(xml, registry) {
        console.log(xml);
        this.registry = registry;

        CinnamonBaseObject.addFields(this, xml, null,
            {
                id: 'object > id',
                name: 'object > name',
                parentId: 'object > parentId',
                rootId: 'object > rootId',
                predecessorId: 'object > predecessorId',
                procstate: 'object > procstate',
                version: 'object > version',
                created: 'object > created',
                modified: 'object > modified',
                latestHead: 'object > latestHead',
                latestBranch: 'object > latestBranch',
                contentSize: 'object > contentsize',
                summary: 'object > summary'
            },
            [
                {type: 'userAccount', path: 'object > owner > id', field: 'owner', doFetch:true},
                {type: 'userAccount', path: 'object > lockedBy > id', field: 'lockedBy', doFetch:true},
                {type: 'userAccount', path: 'object > modifier > id', field: 'modifier', doFetch:true},
                {type: 'userAccount', path: 'object > creator > id', field: 'creator', doFetch:true},
                {type: 'acl', path: 'object > aclId', field: 'acl', doFetch:true},
                {type: 'objectType', path: 'object > objectType > id', field: 'objectType', doFetch:true},
                {type: 'format', path: 'object > format > id', field: 'format', doFetch:true},
                {type: 'language', path: 'object > language > id', field: 'language', doFetch:true},
                {type: 'lifeCycleState', path: 'object > lifeCycleState > id', field: 'lifeCycleState', doFetch:true}
            ], registry);
        var meta = $(xml).find('object > meta');
        if (meta.length) {
            this.meta = meta.clone();
        }
    }

    getParent() {
        if (this.parent == undefined) {
            this.parent = this.registry.get('folder', this.parentId, true)
        }
        return this.parent;
    };

    getRoot() {
        if (this.root == undefined) {
            if (this.rootId == this.id) {
                this.root = this;
            }
            else {
                this.root = this.registry.get('osd', this.rootId, true);
            }
        }
        return this.root
    };

    getPredecessor() {
        if (!this.predecessorId) {
            return null;
        }
        if (this.predecessor == undefined) {
            this.predecessor = this.registry.get('osd', this.predecessorId, true);
        }
        return this.predecessor;
    };


}