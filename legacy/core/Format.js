import CinnamonBaseObject from './CinnamonBaseObject'

export default class Format{

    constructor(xml, registry ){
        this.registry = registry;
        CinnamonBaseObject.addFields(this, xml, ['id', 'name', 'extension',
            'contenttype', 'defaultObjectType'], null, null);
        if(this.defaultObjectType && this.defaultObjectType.length > 0){
            // it's defined and not an empty string
            this.defaultObjectType = registry.getByName('objectType', this.defaultObjectType);
        }
        else{
            this.defaultObjectType = null;
        }
    }


}