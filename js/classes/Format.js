/**
 * User: ingo
 * Date: 11.05.13
 * Time: 19:13
 */

function Format(xml, registry){
    addFields(this, xml, ['id', 'name', 'sysName', 'extension', 
        'contenttype', 'defaultObjectType'], null, null);
    if(this.defaultObjectType && this.defaultObjectType.length > 0){
        // it's defined and not an empty string
        this.defaultObjectType = registry.getByName('objectType', this.defaultObjectType);
    }
    else{
        this.defaultObjectType = null;
    }
}