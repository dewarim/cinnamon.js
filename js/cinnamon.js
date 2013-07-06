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

Cinnamon.prototype.isConnected = function () {
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
            $(data).find('folders > folder').each(function (index, element) {
                var anyId = $(element).find('folder > id').text();
                var anyFolder;
                var parentId = $(element).find('folder > parentId').text();
                if (anyId == id || anyId == parentId) {
                    console.log("found folder!");
                    folder = new Folder(element, registry);
                    anyFolder = folder;
                }
                else {
                    console.log("found id: " + anyId);
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
    if (folder) {
        console.log("found folder:" + folder.id);
    }
    return folder;
};

Cinnamon.prototype.fetchObjects = function (folder) {
    console.log("fetch objects in folder");
    var self = this;
    if (!folder) {
        console.log("Invalid folder object");
        return undefined;
    }
    var objects = [];
    $.ajax(this.url + 'osd/fetchObjects', {
            async: false,
            type: 'post',
            data: {
                parentid: folder.id
            },
            headers: {ticket: self.ticket},
            success: function (data) {
                var registry = self.registry;
                console.log("looking for objects");
                $(data).find('objects > object').each(function (index, element) {
                    var osd = new Osd(element, registry);
                    console.log("found osd #" + osd.id + ", " + osd.name);
                    registry.add('osd', osd);
                    objects.push(osd);
                })
            },
            statusCode: {
                500: function () {
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
 * @param id id of an OSD object
 * @param metasets (optional) a comma separated list of metaset names
 * @return if osd is invalid, returns undefined. Otherwise either an empty meta element or
 * the metadata returned by the server as an XML doc.
 */
Cinnamon.prototype.fetchMetadata = function (id, metasets) {
    var self = this;
    if (!id) {
        console.log("invalid object id given to fetchMetasets");
        return undefined;
    }
    var meta = '<meta/>';
    $.ajax(this.url + 'osd/getOsdMeta', {
        async: false,
        type: 'post',
        headers: {ticket: self.ticket},
        success: function (data) {            
            meta = data;
        },
        data: {
            id: id,
            metasets: metasets
        },
        statusCode: {
            500: function () {
                // TODO: proper error handler
                console.log("failed to do fetchMetadata")
            }
        }
    });
    return meta;
};


Cinnamon.prototype.fetchFolderByPath = function (path) {
    console.log("fetch folder by path");
    var self = this;
    var folder = null;
    if (!path || (path == '/')) {
        // on empty path, return root folder:
        console.log("path is: " + path + "; return: root folder");
        folder = self.fetchFolder(0);
    }
    else {
        if (path.match('/^\//')) {
            // always prepend / for root-folder.
            path = '/' + path;
        }
        var name = path.split('/').pop();
        $.ajax(this.url + 'folder/fetchFolderByPath', {
            async: false,
            type: 'post',
            headers: {ticket: self.ticket},
            success: function (data) {
                var registry = self.registry;
                console.log("Searching for folder: " + name);
                $(data).find('folders > folder').each(function (index, element) {
                    var myName = $(element).find('folder > name').text();
                    console.log("Found folder with name " + myName);
                    var anyFolder;
                    if (name == myName) {
                        folder = new Folder(element, registry);
                        anyFolder = folder;
                    }
                    else {
                        anyFolder = new Folder(element, registry);
                    }
                    registry.add('folder', anyFolder);
                });
            },
            data: {
                path: path
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
            elementName: 'language',
            constructor: UiLanguage
        },
        lifeCycleState: {
            controllerAction: 'lifeCycle/listLifeCyclesXml',
            base: 'lifecycles > lifecycle > states',
            elementName: 'lifecycleState',
            constructor: LifeCycleState
        },
        lifeCycle: {
            controllerAction: 'lifeCycle/listLifeCyclesXml',
            base: 'lifecycles',
            elementName: 'lifecycle',
            constructor: LifeCycle
        },
        userAccount: {
            controllerAction: 'userAccount/listXml',
            base: 'users',
            elementName: 'user',
            constructor: UserAccount
        },
        folder: {
            getOneFunc: 'fetchFolder'
        },
        osd: {
            base: 'objects',
            elementName: 'object',
            constructor: Osd,
            getOne: 'osd/fetchObject'
        }
    }
}

Cinnamon.prototype.fetchObjectList = function (name, id) {
    var config = objectDict()[name];
    var self = this;
    var items = [];
    var data = {};
    var controllerAction = config.controllerAction;
    if (id != undefined) {
        console.log("looking for specific " + name + "#" + id);
        data['id'] = id;
        if (config.getOne) {
            controllerAction = config.getOne
        }
        else if (config.getOneFunc) {
            return [self[config.getOneFunc](id)];
        }
        else {
            console.log("Neither getOne or getOneFunc is defined for " + name);
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
            console.log("path = " + path);
            $(data).find(path).each(function (index, element) {
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

Cinnamon.prototype.disconnect = function () {
    var result = false;
    var self = this;
    $.ajax(this.url + 'cinnamon/disconnect', {
        type: 'post',
        async: false,
        headers: {ticket: self.ticket},
        data: {ticket: self.ticket},
        success: function () {
            console.log("cinnamon: disconnected");
            result = true;
        },
        statusCode: {
            500: function () {
                console.log("cinnamon: disconnect failed.");
            }
        }
    });
    return result;
};

Cinnamon.prototype.searchObjects = function (xmlQuery, pageSize, page) {
    var self = this;
    var objects = [];
    $.ajax(this.url + 'search/searchObjectsXml', {
        type: 'post',
        async: false,
        data: {
            query: xmlQuery,
            pageSize: pageSize,
            page: page
        },
        headers: {ticket: self.ticket},
        success: function (data) {
            var registry = self.registry;
            console.log("looking for objects");
            $(data).find('objects > object').each(function (index, element) {
                var osd = new Osd(element, registry);
                console.log("found osd #" + osd.id + ", " + osd.name);
                registry.add('osd', osd);
                objects.push(osd);
            })
        },
        statusCode: {
            500: function () {
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

/**
 * Create a new OSD object in the Cinnamon repository.
 *
 * @param params
 *  valid fields in params map:
 *      - parentid: id of parent folder
 *      - preid: id of predecessor (otpional)
 *      - name: name of object
 *      - metadata: string containing an XML metadata object (optional)
 *      - objtype_id: id of ObjectType (optional, defaults to _default_objtype)
 *      - objtype: name of ObjectType (choose one of objtype_id or objtype)
 *      - format_id: id of format (note: you should use a FormData object to upload files)
 *      - format: name of Format object (choose one of format_id or format)
 *      - acl_id: id of ACL object (optional, defaults to _default_acl)
 *      - acl: name of ACL to set (choose either one of acl_id or acl)
 *      - language_id: optional id specifying this object's language.
 * @param formData
 * @returns {*}
 */
Cinnamon.prototype.createOsd = function (params, formData) {
    var self = this;
    var osd = null;
    var successHandler = function (data) {
        var registry = self.registry;
        console.log("looking for objects");
        var id = $(data).find('objectId').text();
        osd = self.fetchObjectList('osd', id);
        if(osd.length){
            registry.add('osd', osd[0]);
        }
        else{
            console.log("no osd found after create osd. ObjectId: "+id);
        }
    };
    if (formData) {
        $.ajax(this.url + 'osd/createOsd', {
            type: 'post',
            async: false,
            data: formData,
            contentType: false,
            processData: false,
            headers: {ticket: self.ticket},
            success: successHandler,
            statusCode: {
                500: function () {
                    console.log("cinnamon: createOsd failed.");
                }
            }
        });
    }
    else {
        $.ajax(this.url + 'osd/createOsd', {
            type: 'post',
            async: false,
            data: {
                parentid: params.parentId,
                preid: params.preId,
                name: params.name,
                metadata: params.metadata,
                objtype_id: params.objectTypeId,
                objtype: params.objectType,
                format_id: params.format,
                format: params.format,
                acl_id: params.aclId,
                acl: params.acl,
                language_id: params.languageId
            },
            headers: {ticket: self.ticket},
            success: successHandler,
            statusCode: {
                500: function () {
                    console.log("cinnamon: createOsd failed.");
                }
            }
        });
    }
    return osd.length ? osd[0] : null;
};

/**
 * Create a render task.
 * @param formData
 *  - name: name of the RenderTask
 *  - parentid: folder where the task object should be created
 *  - metadata: a metaset for the renderServer, should be in the form:
 *  <pre>{@code
 *  <metaset type="render_input"><sourceId>542</sourceId><renderTaskName>foo</renderTaskName></metaset>
 *  }</pre>
 *  
 * @returns {*}
 */
Cinnamon.prototype.createRenderTask = function (formData) {
    var self = this;
    var osd = null;
    var successHandler = function (data) {
        var registry = self.registry;
        console.log("looking for objects");
        var id = $(data).find('startRenderTask > taskObjectId').text();
        osd = self.fetchObjectList('osd', id);
        if(osd.length){
            registry.add('osd', osd[0]);
        }
        else{
            console.log("no osd found after createRenderTask. ObjectId: "+id);
        }
    };
    $.ajax(this.url + 'renderServer/createRenderTask', {
        type: 'post',
        async: false,
        data: formData,
        contentType: false,
        processData: false,
        headers: {ticket: self.ticket},
        success: successHandler,
        statusCode: {
            500: function () {
                console.log("cinnamon: createOsd failed.");
            }
        }
    });
    return osd.length ? osd[0] : null;
};

Cinnamon.prototype.deleteOsd = function(id){
    var self = this;
    var result = false;
    var successHandler = function (data) {
        console.log("looking for success message");
        var successNode = $(data).find('success');
        if(successNode.length){
            result = successNode.text() == 'success.delete.object';
        }
    };
    $.ajax(this.url + 'osd/deleteXml', {
        type: 'post',
        async: false,
        data: {
            id:id
        },
        headers: {ticket: self.ticket},
        success: successHandler,
        statusCode: {
            500: function () {
                console.log("cinnamon: deleteOsd failed.");
            }
        }
    });
    return result;
};

/**
 * Set system metadata of an OSD.
 * @param id the obligatory id of the OSD that will be updated.
 * @param parameter contains the name of the field that will be updated
 * The following parameters can be set:
 * <ul>
 * <li>parentid (= id of folder in which the object or folder resides)</li>
 * <li>name</li>
 * <li>owner  (=id of the owner)</li>
 * <li>procstate </li>
 * <li>acl_id (= id of an ACL)</li>
 * <li>objtype  (currently, this parameter is the _name_ of an objtype, NOT an id!)</li>
 * <li>language_id (= id of a language)</li>
 * </ul>
 * @param value the new value.
 * @returns {boolean}
 */
Cinnamon.prototype.updateSysMeta = function(id, parameter, value){
    var self = this;
    var result = false;
    var successHandler = function (data) {
        console.log("looking for success message");
        var successNode = $(data).find('success');
        if(successNode.length){
            result = successNode.text() == 'success.set.sys_meta';
        }
    };
    $.ajax(this.url + 'osd/updateSysMetaXml', {
        type: 'post',
        async: false,
        data:{
            id:id,
            parameter:parameter,
            value:value
        }, 
        headers: {ticket: self.ticket},
        success: successHandler,
        statusCode: {
            500: function () {
                console.log("cinnamon: updateSysMeta failed.");
            }
        }
    });
    return result;
};

/**
 * Upload file content to an existing object.
 * @param formData with the following fields:
 *  - file: the file upload field
 *  - id: the id of the OSD
 *  - format: the format of the uploaded content - this is the name of 
 *      a format object in the Cinnamon repository, for example 'format.txt'
 * @returns {boolean}
 */
Cinnamon.prototype.saveContent = function (formData) {
    var self = this;
    var result = false;
    var successHandler = function (data) {
        console.log("looking for success message");
        var successNode = $(data).find('success');
        if(successNode.length){
            result = successNode.text() == 'success.set.content';
        }
    };

    if (formData) {
        $.ajax(this.url + 'osd/saveContentXml', {
            type: 'post',
            async: false,
            data: formData,
            contentType: false,
            processData: false,
            headers: {ticket: self.ticket},
            success: successHandler,
            statusCode: {
                500: function () {
                    console.log("cinnamon: saveContent failed.");
                }
            }
        });
    }  
    return result;
};

/**
 * Update custom metadata of an existing object.
 * Note: this method requires a complete metadata string with all metasets.
 * @param id the id of the object to update
 * @param metadata the complete XML metadata string
 * @param write_policy one of [one of WRITE, IGNORE, BRANCH], see Cinnamon server for more information;
 *  defaults to BRANCH. Leave as is, unless you know what you are doing.
 * @returns {boolean}
 */
Cinnamon.prototype.updateMetadata = function(id, metadata, write_policy){
    var self = this;
    var result = false;
    var successHandler = function (data) {
        console.log("looking for success message");
        var successNode = $(data).find('success');
        if(successNode.length){
            result = successNode.text() == 'success.set.metadata';
        }
    };
    $.ajax(this.url + 'osd/saveMetadataXml', {
        type: 'post',
        async: false,
        data:{
            id:id,
            metadata:metadata,
            write_policy: write_policy ? write_policy : 'BRANCH'
        },
        headers: {ticket: self.ticket},
        success: successHandler,
        statusCode: {
            500: function () {
                console.log("cinnamon: updateSysMeta failed.");
            }
        }
    });
    return result;
};

/**
 * Create or update the metaset of an existing object.
 * @param id the id of the object to update
 * @param class_name "Folder" or "OSD", depending on type.
 * @param type_name the name of the metaset type
 * @param content the XML metaset string
 * 
 * @param write_policy one of [one of WRITE, IGNORE, BRANCH], see Cinnamon server for more information;
 *  defaults to BRANCH. Leave as is, unless you know what you are doing.
 * @returns an empty '<meta/>'-string on failure, or the updated metaset. 
 */
Cinnamon.prototype.saveMetaset = function(id, class_name, type_name, content, write_policy){
    var self = this;
    var result = '<meta/>';
    var successHandler = function (data) {
        result = data;
    };
    $.ajax(this.url + 'metaset/saveMetaset', {
        type: 'post',
        async: false,
        data:{
            id:id,
            class_name:class_name,
            type_name:type_name,           
            content:content,            
            write_policy: write_policy ? write_policy : 'BRANCH'
        },
        headers: {ticket: self.ticket},
        success: successHandler,
        statusCode: {
            500: function () {
                console.log("cinnamon: updateSysMeta failed.");
            }
        }
    });
    return result;
};

Cinnamon.prototype.lock = function(id){
    var self = this;
    var result = false;
    var successHandler = function (data) {
        console.log("looking for success message");
        var successNode = $(data).find('success');
        if(successNode.length){
            result = successNode.text() == 'success.object.lock';
        }
    };
    $.ajax(this.url + 'osd/lockXml', {
        type: 'post',
        async: false,
        data:{
            id:id
        },
        headers: {ticket: self.ticket},
        success: successHandler,
        statusCode: {
            500: function () {
                console.log("cinnamon: updateSysMeta failed.");
            }
        }
    });
    return result;
};

Cinnamon.prototype.unlock = function(id){
    var self = this;
    var result = false;
    var successHandler = function (data) {
        console.log("looking for success message");
        var successNode = $(data).find('success');
        if(successNode.length){
            result = successNode.text() == 'success.object.unlock';
        }
    };
    $.ajax(this.url + 'osd/unlockXml', {
        type: 'post',
        async: false,
        data:{
            id:id
        },
        headers: {ticket: self.ticket},
        success: successHandler,
        statusCode: {
            500: function () {
                console.log("cinnamon: updateSysMeta failed.");
            }
        }
    });
    return result;
};
