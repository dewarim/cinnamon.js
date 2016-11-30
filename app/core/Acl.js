import CinnamonBaseObject from './CinnamonBaseObject'

export default class Acl{

    constructor(xml, registry ){
        this.registry = registry;
        CinnamonBaseObject.addFields(this, xml, ['id', 'name', 'sysName'], null, null);
    }


}