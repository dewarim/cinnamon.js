/**
 * User: ingo
 * Date: 05.05.13
 * Time: 19:18
 */
 
function runTests(cinnamon) {
    cinnamon.connect();
    QUnit.config.reorder = false;
    test("ensure valid ticket", function () {
        var ticket = cinnamon.ticket;
        equal(ticket.length, 41);
        var repository = ticket.split('@')[1];
        equal(repository, 'demo');
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
        ok((/<config\s*\/>/).test(otList[0].config));
        ok($(otList[0].configXml).find('config').length > 0);
    });   
    
    test('fetch list of FolderTypes', function(){
        var ftList = cinnamon.fetchObjectList('folderType');
        ok(findObject(ftList, 'sysName', '_default_folder_type') != undefined);
        ok((/<config\s*\/>/).test(ftList[0].config));
        ok($(ftList[0].configXml).find('config').length > 0);
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
    
    test('fetch list of Languages', function(){
        var langList = cinnamon.fetchObjectList('language');
        ok(findObject(langList, 'sysName', 'und') != undefined);
        ok(findObject(langList, 'sysName', 'zxx') != undefined);
        ok(findObject(langList, 'sysName', 'mul') != undefined);
    });
    
    test('fetch list of UiLanguages', function(){
        var langList = cinnamon.fetchObjectList('uiLanguage');
        ok(langList.length >= 3);
    });
    
    test('fetch list of Formats', function(){
        var formats = cinnamon.fetchObjectList('format');
        var registry = cinnamon.registry;
        var jpegFormat = findObject(formats, 'name', 'jpeg');
        ok(jpegFormat != undefined);
        // objectType is not defined in demo database at the moment.
        // equal(jpegFormat.defaultObjectType, registry.getByName('objectType', 'image'));
        // equal(jpegFormat.defaultObjectType.name, 'image');
        var xmlFormat = findObject(formats, 'name', 'xml');
        equal(xmlFormat.defaultObjectType, null);
    });

    test('fetch list of LifeCycleStates', function(){
        var lcsList = cinnamon.fetchObjectList('lifeCycleState');
        // console.log(lcsList);
        ok(lcsList.length >= 4); // demo repository contains 12 lcs at the moment.
        ok(cinnamon.registry.getByName('lifeCycleState', 'newRenderTask'));
        ok(cinnamon.registry.list('lifeCycleState').length > 4);
        ok(findObject(lcsList, 'sysName', 'newRenderTask'));
    });
    
    test('fetch list of relationTypes', function(){
        var rtList = cinnamon.fetchObjectList('relationType');
        // console.log(rtList)
        ok(rtList.length > 6);
        ok(cinnamon.registry.getByName('relationType', 'child_content'));
        equal(cinnamon.registry.list('relationType').length, rtList.length);
        ok(findObject(rtList, 'sysName', 'child_content'));
    });

    test('fetch list of LifeCycles', function(){
        var lcList = cinnamon.fetchObjectList('lifeCycle');
        // console.log(lcList);
        ok(lcList.length >= 1);
        var renderLc = findObject(lcList, 'sysName', '_RenderServerLC'); 
        ok(renderLc);
        equal(renderLc.getStates().length, 4);               
    });

    test('fetch list of UserAccounts', function(){
        var userList = cinnamon.fetchObjectList('userAccount');
        ok(userList.length > 0);
        var admin = findObject(userList, 'name', 'admin');
        ok(admin);
        var undeterminedLanguage = cinnamon.registry.getByName('uiLanguage', 'und');
        ok(undeterminedLanguage);
        equal(admin.language, undeterminedLanguage);        
    });

    var folder;
    test('fetch root folder', function(){
        folder = cinnamon.fetchFolder();
        equal(folder.name, 'root');
        equal(folder.getParent(), null);
    });
    test('fetch folder by name', function(){
        console.log("looking for folder by name");
        folder = cinnamon.fetchFolderByPath('system');
        equal(folder.name, 'system');        
        var rootFolder = cinnamon.fetchFolderByPath('/');
        equal(rootFolder.name, 'root');
        equal(folder.getParent(), rootFolder);
        folder = cinnamon.fetchFolderByPath('/system/transient');
        equal(folder.name, 'transient');
    });
    test('fetch osd', function(){
        // TODO: do not use hard coded ids - needs: "create osd" function, which needs "create test folder"
        var osds = cinnamon.fetchObjectList('osd', 209);
        equal(osds.length, 1);
        var osd = osds[0];
        // TODO: create test object for this test
        //  instead of relying of finding one with id 503 in the test db.
        equal(osd.name, 'concept');        
        equal(osd.getParent().id,200 );
    });
    test('fetch objects in folder', function(){
        // TODO: create test objects for this test instead of relying on current repo layout.
        var folder = cinnamon.fetchFolderByPath('/templates/dita');
        var osds = cinnamon.fetchObjects(folder);
        equal(osds.length, 5);
        var osd = osds[0];        
        equal(osd.name, 'concept');
        equal(osd.getParent().id,200);
    });     
    test('disconnect', function(){
        ok(cinnamon.disconnect());
    })
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