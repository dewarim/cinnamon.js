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
 *  [{path:'object > aclId', type:'acl', field:'acl'} ]
 * @param registry an instance of CmnRegistry to resolve the references
 */
function addFields(object, xml, simpleFields, fields, references, registry) {
    if (simpleFields) {
        for (var x = 0; x < simpleFields.length; x++) {
            var name = simpleFields[x];
            object[name] = $(xml).find(name).text();
        }
    }
    for (var field in fields) {
        console.log("field: "+field);
        if (fields.hasOwnProperty(field)) {
            console.log("looking for: "+field+" in "+fields[field]);
            object[field] = $(xml).find(fields[field]).text();
        }
    }
    if (references) {
        for (x = 0; x < references.length; x++) {
            var ref = references[x];
//            console.log("ref.type:" + ref.type);
//            console.log("ref.path:" + ref.path);
//            console.log("ref.field:" + ref.field);
            object[ref.field] = registry.get(ref.type, $(xml).find(ref.path).text());
        }
    }
}