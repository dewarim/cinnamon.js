import CinnamonBaseObject from './CinnamonBaseObject'

export default class ObjectType{

    constructor(xml, registry ){
        this.registry = registry;
        CinnamonBaseObject.addFields(this, xml, ['id', 'name', 'sysName', 'config'], null, null);
        this.configXml = $.parseXML(this.config);
    }

}