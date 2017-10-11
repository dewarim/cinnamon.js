import CinnamonBaseObject from './CinnamonBaseObject'

export default class RelationType {

    constructor(xml, registry) {
        this.registry = registry;
        CinnamonBaseObject.addFields(this, xml, ['id', 'name', 'sysName', 'leftResolver', 'rightResolver',
            'leftobjectprotected', 'rightobjectprotected',
            'cloneOnLeftCopy', 'cloneOnRightCopy',
            'cloneOnLeftVersion', 'cloneOnRightVersion'
        ], null, null);
    }


}