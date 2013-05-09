/**
 * User: ingo
 * Date: 06.05.13
 * Time: 23:07
 */

/**
 * 
 * @param object an instance of a new Cinnamon object class, for example: Acl
 * @param xml the XML node which defines the class, for example "/acls/acl"
 * @param simpleFields list of top level elements (for example //acl/id, but not //object/relation/id) 
 * @param fields Map object of fields that are selected via jQuery selectors, for example:
 *  {foo: 'object > foo'}
 * @param references map of fields that reference other object ids, for example:
 *  {$name: {path:'object > aclId', type:'Acl'} } // TODO: implement object references
 */
function addFields(object, xml, simpleFields, fields, references){
    for (var x = 0; x < simpleFields.length; x++){
        var name = simpleFields[x];
        object[name] = $(xml).find(name).text();        
    }    
    for(var field in fields){
        if(fields.hasOwnProperty(field)){
            object[field] = $(xml).find(fields[field]).text();
        }
    }
}