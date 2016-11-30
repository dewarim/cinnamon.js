import CinnamonBaseObject from './CinnamonBaseObject'

export default class Language{

    constructor(xml, registry ){
        this.registry = registry;
        CinnamonBaseObject.addFields(this, xml, ['id', 'name', 'sysName'], null, null);
        this.meta = $(xml).find('meta');
    }


}