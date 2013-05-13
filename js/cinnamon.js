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
    this.registry = new CmnRegistry();

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

Cinnamon.prototype.connectionError = function (message) {
    alert(message);
};

Cinnamon.prototype.fetchFolder = function (id) {
    var self = this;
    if (!id) {
        id = 0;
    }
    var folder;
    $.ajax(this.url + 'folder/fetchFolderXml', {
        async: false,
        type: 'post',
        headers: {ticket: self.ticket},
        success: function (data) {
            folder = $(data).find('folder');
        },
        data: {
            id: id
        },
        statusCode: {
            500: self.connectionError
        }
    });
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
        }
    }
}

Cinnamon.prototype.fetchObjectList = function(name) {
    var config = objectDict()[name];
    var self = this;    
    var items = [];
    $.ajax(this.url + config.controllerAction, {
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
        data: { },
        statusCode: {
            500: self.connectionError
        }
    });
    this.registry.setList(name, items);
    return items;
};