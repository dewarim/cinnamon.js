/**
 * User: ingo
 * Date: 03.05.13
 * Time: 20:00
 */

function Cinnamon(config) {

    this.ticket = '::unconnected::';
    this.username = config.get('username');
    this.password = config.get('password');
    this.repository = config.get('repository');
    this.url = config.get('url');
    this.registry = new CmnRegistry(this);

}

Cinnamon.prototype.extractTicket = function (data) {
    var tick = $(data).find('ticket').text();
    console.log("extractTicket: " + tick);
    return tick;
};

/**
 * Connect to a Cinnamon 3 server via the xml API.
 */
Cinnamon.prototype.connect = function () {
    var self = this;
    $.ajax(this.url + 'cinnamon/connect', {
        async: false,
        type: 'post',
        success: function (data) {
            self.ticket = self.extractTicket(data);
        },
        data: {
            command: 'connect',
            user: this.username,
            pwd: this.password,
            repository: this.repository
        },
        statusCode: {
            500: self.connectionError
        }
    })
};

Cinnamon.prototype.isConnected = function(){
    return this.ticket != '::unconnected::';
};

Cinnamon.prototype.connectionError = function (message) {
    alert(message);
};

Cinnamon.prototype.fetchFolder = function (id) {
    var self = this;
    if (!id) {
        id = 0;
    }
    var folder = null;
    $.ajax(this.url + 'folder/fetchFolderXml', {
        async: false,
        type: 'post',
        headers: {ticket: self.ticket},
        success: function (data) {
            var registry = self.registry;
            $(data).find('folders > folder').each(function(index, element){
                var anyId = $(element).find('folder > id').text();
                var anyFolder;
                var parentId = $(element).find('folder > parentId').text();
                if( anyId == id || anyId == parentId){                    
                    console.log("found folder!");
                    folder = new Folder(element, registry);
                    anyFolder = folder;
                }
                else{
                    console.log("found id: "+anyId);
                    anyFolder = new Folder(element, registry);
                }
                registry.add('folder', anyFolder);
            });
        },            
        data: {
            id: id
        },
        statusCode: {
            500: self.connectionError
        }
    });
    if(folder){
        console.log("found folder:"+folder.id);
    }
    return folder;
};

Cinnamon.prototype.fetchObjects = function(folder){
    console.log("fetch objects in folder");
    var self = this;
    if(! folder){
        console.log("Invalid folder object");
        return undefined;
    }
    var objects = [];
    $.ajax(this.url + 'osd/fetchObjects',{
            async:false,
            type:'post',
            data:{
              parentid:folder.id  
            },
            headers: {ticket:self.ticket},
            success: function(data){
                var registry = self.registry;
                console.log("looking for objects");
                $(data).find('objects > object').each(function(index, element){
                    var osd = new Osd(element, registry);
                    console.log("found osd #"+osd.id+", "+osd.name);
                    registry.add('osd', osd);
                    objects.push(osd);
                })
            },
            statusCode: {
                500: function(){
                    // TODO: proper error handler
                    console.log("failed to do fetchObjects")
                }
            }
        }
    );
    return objects;
};

/**
 * Fetch one or more metasets of a given OSD.
 * @param osd an OSD object
 * @param metasets (optional) a comma separated list of metaset names
 * @return if osd is invalid, returns undefined. Otherwise either an empty meta element or
 * the metadata returned by the server as an XML doc.
 */
Cinnamon.prototype.fetchMetadata = function(osd, metasets){
    var self = this;
    if(! osd){
        console.log("invalid object given to fetchMetasets");
        return undefined;
    }
    var meta = '<meta/>';
    $.ajax(this.url + 'osd/getOsdMeta',{
        async: false,
        type: 'post',
        headers: {ticket: self.ticket},
        success: function (data) {
            meta = data;
        },
        data: {
            id:osd.id,
            metasets:metasets
        },
        statusCode: {
            500: function(){
                // TODO: proper error handler
                console.log("failed to do fetchMetadata")
            }
        }
    });
    return meta;
};


Cinnamon.prototype.fetchFolderByPath = function(path){
    console.log("fetch folder by path");
    var self = this;
    var folder = null;
    if(! path || (path == '/')){
        // on empty path, return root folder:
        console.log("path is: "+path+"; return: root folder");
        folder = self.fetchFolder(0);
    }
    else{
        if(path.match('/^\//')){
            // always prepend / for root-folder.
            path = '/'+path;
        }
        var name = path.split('/').pop();
        $.ajax(this.url + 'folder/fetchFolderByPath', {
            async: false,
            type: 'post',
            headers: {ticket: self.ticket},
            success: function (data) {
                var registry = self.registry;
                console.log("Searching for folder: "+name);
                $(data).find('folders > folder').each(function(index, element){
                    var myName = $(element).find('folder > name').text();
                    console.log("Found folder with name "+myName);
                    var anyFolder;
                    if( name == myName ){
                        folder = new Folder(element, registry);
                        anyFolder = folder;
                    }
                    else{
                        anyFolder = new Folder(element, registry);
                    }
                    registry.add('folder', anyFolder);                    
                });
            },
            data: {
                path:path
            },
            statusCode: {
                500: self.connectionError
            }
        });      
    }
    return folder;
};

function objectDict() {
    return {
        acl: {
            controllerAction: 'acl/listXml',
            base: 'acls',
            constructor: Acl
        },
        objectType: {
            controllerAction: 'objectType/listXml',
            base: 'objectTypes',
            constructor: ObjectType
        },
        folderType: {
            controllerAction: 'folderType/listXml',
            base: 'folderTypes',
            constructor: FolderType
        },  
        metasetType: {
            controllerAction: 'metasetType/listXml',
            base: 'metasetTypes',
            constructor: FolderType
        },
        format: {
            controllerAction: 'format/listXml',
            base: 'formats',
            constructor: Format
        },    
        permission: {
            controllerAction: 'permission/listXml',
            base: 'permissions',
            constructor: Permission
        },
        language: {
            controllerAction: 'language/listXml',
            base: 'languages',
            constructor: Language
        },
        uiLanguage: {
            controllerAction: 'uiLanguage/listXml',
            base: 'languages',
            elementName:'language',
            constructor: UiLanguage
        },
        lifeCycleState:{
            controllerAction: 'lifeCycle/listLifeCyclesXml',
            base: 'lifecycles > lifecycle > states',
            elementName:'lifecycleState',
            constructor: LifeCycleState
        },
        lifeCycle:{
            controllerAction: 'lifeCycle/listLifeCyclesXml',
            base: 'lifecycles',
            elementName:'lifecycle',
            constructor: LifeCycle
        },
        userAccount:{
            controllerAction: 'userAccount/listXml',
            base: 'users',
            elementName:'user',
            constructor: UserAccount
        },
        folder:{
            getOneFunc:'fetchFolder'
        },
        osd:{
            base: 'objects',
            elementName: 'object',
            constructor: Osd,
            getOne:'osd/fetchObject'
        }
    }
}

Cinnamon.prototype.fetchObjectList = function(name, id) {
    var config = objectDict()[name];
    var self = this;    
    var items = [];
    var data = {};
    var controllerAction = config.controllerAction;
    if(id != undefined){
        console.log("looking for specific "+name+"#"+id);
        data['id'] = id;
        if(config.getOne){
            controllerAction = config.getOne
        }
        else if(config.getOneFunc){
            return [self[config.getOneFunc](id)];
        }
        else{
            console.log("Neither getOne or getOneFunc is defined for "+name);
        }
    }
    $.ajax(this.url + controllerAction, {
        async: false,
        type: 'post',
        headers: {ticket: self.ticket},
        success: function (data) {
            var myObjects = items;
            var registry = self.registry;
            var elementName = config.elementName != undefined ? config.elementName : name;
            var path = config.base + ' > ' + elementName;
            console.log("path = "+path);
            $(data).find(path).each(function(index, element){                
                var object = new config['constructor'](element, registry);
//                console.log("new object: "+object.name);
                myObjects.push(object);
            });
        },
        data: data,
        statusCode: {
            500: self.connectionError
        }
    });
    this.registry.setList(name, items);
    return items;
};

Cinnamon.prototype.disconnect = function(){
    var result = false;
    var self = this;
    $.ajax(this.url + 'cinnamon/disconnect',{
        type:'post',
        async:false,
        headers: {ticket:self.ticket},
        data: {ticket:self.ticket},
        success: function(){
            console.log("cinnamon: disconnected");
            result = true;
        },
        statusCode:{
            500: function(){
                console.log("cinnamon: disconnect failed.");
            }
        }
    });
    return result;
};

Cinnamon.prototype.searchObjects = function(xmlQuery, pageSize, page){
    var self = this;
    var objects = [];
    $.ajax(this.url + 'search/searchObjectsXml',{
        type:'post',
        async:false,
        data:{
            query:xmlQuery,
            pageSize:pageSize,
            page:page
        },
        headers: {ticket:self.ticket},
        success: function(data){
            var registry = self.registry;
            console.log("looking for objects");
            $(data).find('objects > object').each(function(index, element){
                var osd = new Osd(element, registry);
                console.log("found osd #"+osd.id+", "+osd.name);
                registry.add('osd', osd);
                objects.push(osd);
            })
        },
        statusCode:{
            500: function(){
                console.log("cinnamon: searchObjects failed.");
            }
        }
    });
    return objects;
};

function padInteger(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}