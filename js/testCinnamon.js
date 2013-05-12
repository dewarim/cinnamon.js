/**
 * User: ingo
 * Date: 05.05.13
 * Time: 19:18
 */
 
function runTests(cinnamon) {
    cinnamon.connect();
    test("ensure valid ticket", function () {
        var ticket = cinnamon.ticket;
        equal(ticket.length, 41);
        var repository = ticket.split('@')[1];
        equal(repository, 'demo');
    });
    var folder;
    test('fetch root folder', function(){
        folder = cinnamon.fetchFolder();
        equal($(folder).find('folder > name').text(), 'root');        
    });
    
    test('fetch list of Acls', function(){
        var aclList = cinnamon.fetchObjectList('acl');
        ok(findObject(aclList, 'sysName', '_default_acl') != undefined);
        var id = aclList[0]['id'];
        console.log("aclId: "+id);
        console.log("registry: "+cinnamon.registry.get('acl',id ));
        equal(cinnamon.registry.get('acl',id ), aclList[0]);
    });
    
    test('fetch list of ObjectTypes', function(){
        var otList = cinnamon.fetchObjectList('objectType');
        ok(findObject(otList, 'sysName', '_default_objtype') != undefined);
        ok((/<meta\s*\/>/).test(otList[0].config));
        ok($(otList[0].configXml).find('meta').length > 0);
    });   
    
    test('fetch list of FolderTypes', function(){
        var ftList = cinnamon.fetchObjectList('folderType');
        ok(findObject(ftList, 'sysName', '_default_folder_type') != undefined);
        ok((/<meta\s*\/>/).test(ftList[0].config));
        ok($(ftList[0].configXml).find('meta').length > 0);
    }); 
    
    test('fetch list of MetasetTypes', function(){
        var mtList = cinnamon.fetchObjectList('metasetType');
        ok(findObject(mtList, 'sysName', 'test') != undefined);
        ok((/<metaset\s*\/>/).test(mtList[0].config));
        ok($(mtList[0].configXml).find('metaset').length > 0);
    });

    test('fetch list of Permissions', function(){
        var permList = cinnamon.fetchObjectList('permission');
        ok(findObject(permList, 'sysName', '_write_object_content') != undefined);
    });

    test('fetch list of Formats', function(){
        var formats = cinnamon.fetchObjectList('format');
        var registry = cinnamon.registry;
        var jpegFormat = findObject(formats, 'sysName', 'format.jpeg');
        ok(jpegFormat != undefined);        
        equal(jpegFormat.defaultObjectType, registry.getByName('objectType', 'image'));
        equal(jpegFormat.defaultObjectType.name, 'image');
        var xmlFormat = findObject(formats, 'sysName', 'format.xml');
        equal(xmlFormat.defaultObjectType, null);
    });
}

function findObject(list, field, value){
    var result;
    for(var x = 0; x < list.length; x++){
        var item = list[x];        
        if(item != undefined && item.hasOwnProperty(field) && item[field] == value){
            result = item;
            break;
        }
    }
    return result;
}