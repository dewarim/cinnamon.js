import CinnamonBaseObject from './CinnamonBaseObject'

export default class FolderType{

    constructor(xml, registry ){
        this.registry = registry;
        CinnamonBaseObject.addFields(this, xml, ['id', 'name', 'sysName'], null, null);
    }


}