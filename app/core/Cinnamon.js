import CmnRegistry from './CmnRegistry'

import Acl from './Acl'
import Folder from './Folder'
import FolderType from './FolderType'
import Format from './Format'
import Osd from './Osd'
import Language from './Language'
import LifeCycle from './LifeCycle'
import LifeCycleState from './LifeCycleState'
import ObjectType from './ObjectType'
import Permission from './Permission'
import Relation from './Relation'
import RelationType from './RelationType'
import UiLanguage from './UiLanguage'
import UserAccount from './UserAccount'

export default class Cinnamon {

    constructor(config) {
        this.ticket = '::unconnected::';
        this.username = config.username;
        this.password = config.password;
        this.url = config.url;
        this.registry = new CmnRegistry(this);

        this.fetchFolderByPath.bind(this);
        this.searchFolders.bind(this);
        this.fetchObjectList.bind(this);

        // initialize registry:
        let registry = this.registry
        for(let entry in this.objectDict() ){
            console.log("key: "+entry)
            let objectList = [] // todo: for type objects like FolderType, load list at start?
            registry.setList(entry, objectList)
        }
    }


    static extractTicket(data) {
        var tick = $(data).find('ticket').text();
        console.log("extractTicket: " + tick);
        return tick;
    };

    /**
     * Connect to a Cinnamon 3 server via the xml API.
     * @param errorHandler an optional function which is used to display a login error.
     * If not set, use the default connectionError function.
     */
    connect(errorHandler) {
        let self = this;
        self.loginError = errorHandler ? errorHandler : self.connectionError;
        let connectionUrl = this.url + 'cinnamon/connect'
        console.log("connecting to Cinnamon with: " + connectionUrl)
        $.ajax(connectionUrl, {
            async: false,
            type: 'post',
            success: function (data) {
                self.ticket = Cinnamon.extractTicket(data);
            },
            data: {
                command: 'connect',
                user: this.username,
                pwd: this.password,
                repository: 'demo' // legacy parameter.
            },
            statusCode: {
                500: self.loginError
            }
        })
        
        if(self.ticket) {
            // fetch user list. This will be needed anyway to display the repository content or to
            // execute user related functions.
            console.log("load user accounts")
            this.fetchObjectList('userAccount')
            console.log("current user id = "+self.getCurrentUser().id)
        }
    };

    getCurrentUser(){
        console.log("get current user for "+this.username);
        return this.registry.getByName("userAccount", this.username);
    }
    
    isConnected() {
        return this.ticket != '::unconnected::';
    };

    connectionError(message) {
        console.log("Error connecting to Cinnamon server: " + message);
        alert(message);
    };

    fetchFolder(id) {
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
        let targetFolder = this.registry.get('folder',id,false)
        if(targetFolder){
            return targetFolder
        }
        return folder;
    };

    fetchObjects(folder) {
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
    fetchMetadata(id, metasets) {
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


    fetchFolderByPath(path) {
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

    objectDict() {
        return {
            acl: {
                controllerAction: 'acl/listXml',
                base: 'acls',
                cmn_constructor: Acl
            },
            objectType: {
                controllerAction: 'objectType/listXml',
                base: 'objectTypes',
                cmn_constructor: ObjectType
            },
            folderType: {
                controllerAction: 'folderType/listXml',
                base: 'folderTypes',
                cmn_constructor: FolderType
            },
            metasetType: {
                controllerAction: 'metasetType/listXml',
                base: 'metasetTypes',
                cmn_constructor: FolderType
            },
            format: {
                controllerAction: 'format/listXml',
                base: 'formats',
                cmn_constructor: Format
            },
            permission: {
                controllerAction: 'permission/listXml',
                base: 'permissions',
                cmn_constructor: Permission
            },
            language: {
                controllerAction: 'language/listXml',
                base: 'languages',
                cmn_constructor: Language
            },
            uiLanguage: {
                controllerAction: 'uiLanguage/listXml',
                base: 'languages',
                elementName: 'language',
                cmn_constructor: UiLanguage
            },
            lifeCycleState: {
                controllerAction: 'lifeCycle/listLifeCyclesXml',
                base: 'lifecycles > lifecycle > states',
                elementName: 'lifecycleState',
                cmn_constructor: LifeCycleState
            },
            lifeCycle: {
                controllerAction: 'lifeCycle/listLifeCyclesXml',
                base: 'lifecycles',
                elementName: 'lifecycle',
                cmn_constructor: LifeCycle
            },
            relationType: {
                controllerAction: 'relationType/listXml',
                base: 'relationTypes',
                elementName: 'relationType',
                cmn_constructor: RelationType
            },
            userAccount: {
                controllerAction: 'userAccount/listXml',
                base: 'users',
                elementName: 'user',
                cmn_constructor: UserAccount
            },
            folder: {
                getOneFunc: 'fetchFolder'
            },
            osd: {
                base: 'objects',
                elementName: 'object',
                cmn_constructor: Osd,
                getOne: 'osd/fetchObject',
                deleteControllerAction: 'osd/deleteXml'
            },
            relation: {
                base: 'relations',
                elementName: 'relation',
                cmn_constructor: Relation,
                deleteControllerAction: 'relation/deleteXml'
            }
        }
    }

    fetchObjectList(name, id) {
        var config = this.objectDict()[name];
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
                // console.log("Neither getOne or getOneFunc is defined for " + name);
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
                    var object = new config['cmn_constructor'](element, registry);
//                console.log("new object: "+object.name);
                    myObjects.push(object);
                });
            },
            data: data,
            statusCode: {
                500: self.connectionError
            }
        });
        items.forEach(item => {
            this.registry.add(name, item)
        })

        return items;
    };

    disconnect() {
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

    searchObjects(xmlQuery, pageSize, page, metasets) {
        var self = this;
        var objects = [];
        $.ajax(this.url + 'search/searchObjectsXml', {
            type: 'post',
            async: false,
            data: {
                query: xmlQuery,
                pageSize: pageSize,
                page: page,
                metaset_list: metasets
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

    searchFolders(xmlQuery, pageSize, page, metasets) {
        var self = this;
        var folders = [];
        $.ajax(this.url + 'search/searchFolders', {
            type: 'post',
            async: false,
            data: {
                query: xmlQuery,
                pageSize: pageSize,
                page: page,
                metaset_list: metasets
            },
            headers: {ticket: self.ticket},
            success: function (data) {
                var registry = self.registry;
                // console.log("looking for folders");
                // console.log("Found: ")
                // console.log(data)
                $(data).find('folders > folder').each(function (index, element) {
                    var folder = new Folder(element, registry);
                    console.log("found folder #" + folder.id + ", " + folder.name);
                    registry.add('folder', folder);
                    folders.push(folder);
                })
            },
            statusCode: {
                500: function () {
                    console.log("cinnamon: searchObjects failed.");
                }
            }
        });
        return folders;
    };


    padInteger(n, width, z) {
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
    createOsd(params, formData) {
        var self = this;
        var osd = null;
        var successHandler = function (data) {
            var registry = self.registry;
            console.log("looking for objects");
            var id = $(data).find('objectId').text();
            osd = self.fetchObjectList('osd', id);
            if (osd.length) {
                registry.add('osd', osd[0]);
            }
            else {
                console.log("no osd found after create osd. ObjectId: " + id);
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
    createRenderTask(formData) {
        var self = this;
        var osd = null;
        var successHandler = function (data) {
            var registry = self.registry;
            console.log("looking for objects");
            var id = $(data).find('startRenderTask > taskObjectId').text();
            osd = self.fetchObjectList('osd', id);
            if (osd.length) {
                registry.add('osd', osd[0]);
            }
            else {
                console.log("no osd found after createRenderTask. ObjectId: " + id);
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

    deleteOsd(id) {
        var self = this;
        var result = false;
        var successHandler = function (data) {
            console.log("looking for success message");
            var successNode = $(data).find('success');
            if (successNode.length) {
                result = successNode.text() == 'success.delete.object';
            }
        };
        $.ajax(this.url + 'osd/deleteXml', {
            type: 'post',
            async: false,
            data: {
                id: id
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
    updateSysMeta(id, parameter, value) {
        var self = this;
        var result = false;
        var successHandler = function (data) {
            console.log("looking for success message");
            var successNode = $(data).find('success');
            if (successNode.length) {
                result = successNode.text() == 'success.set.sys_meta';
            }
        };
        $.ajax(this.url + 'osd/updateSysMetaXml', {
            type: 'post',
            async: false,
            data: {
                id: id,
                parameter: parameter,
                value: value
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
    saveContent(formData) {
        var self = this;
        var result = false;
        var successHandler = function (data) {
            console.log("looking for success message");
            var successNode = $(data).find('success');
            if (successNode.length) {
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
    updateMetadata(id, metadata, write_policy) {
        var self = this;
        var result = false;
        var successHandler = function (data) {
            console.log("looking for success message");
            var successNode = $(data).find('success');
            if (successNode.length) {
                result = successNode.text() == 'success.set.metadata';
            }
        };
        $.ajax(this.url + 'osd/saveMetadataXml', {
            type: 'post',
            async: false,
            data: {
                id: id,
                metadata: metadata,
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
    saveMetaset(id, class_name, type_name, content, write_policy) {
        var self = this;
        var result = '<meta/>';
        var successHandler = function (data) {
            result = data;
        };
        $.ajax(this.url + 'metaset/saveMetaset', {
            type: 'post',
            async: false,
            data: {
                id: id,
                class_name: class_name,
                type_name: type_name,
                content: content,
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

    lock(id) {
        var self = this;
        var result = false;
        var successHandler = function (data) {
            console.log("looking for success message");
            var successNode = $(data).find('success');
            if (successNode.length) {
                result = successNode.text() == 'success.object.lock';
            }
        };
        $.ajax(this.url + 'osd/lockXml', {
            type: 'post',
            async: false,
            data: {
                id: id
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

    unlock(id) {
        var self = this;
        var result = false;
        var successHandler = function (data) {
            console.log("looking for success message");
            var successNode = $(data).find('success');
            if (successNode.length) {
                result = successNode.text() == 'success.object.unlock';
            }
        };
        $.ajax(this.url + 'osd/unlockXml', {
            type: 'post',
            async: false,
            data: {
                id: id
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

    fetchRelations(name, leftId, rightId, includeMetadata) {
        var self = this;
        var objects = [];
        $.ajax(this.url + 'relation/listXml', {
            type: 'post',
            async: false,
            data: {
                name: name,
                leftid: leftId,
                rightid: rightId,
                include_metadata: includeMetadata
            },
            headers: {ticket: self.ticket},
            success: function (data) {
                var registry = self.registry;
                console.log("looking for relations");
                $(data).find('relations > relation').each(function (index, element) {
                    var relation = new Relation(element, registry);
                    console.log("found relation #" + relation.id + ", type: " + relation.typeName);
                    registry.add('relation', relation);
                    objects.push(relation);
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


    deleteObj(className, id) {
        var self = this;
        var result = false;
        var deleteControllerAction = this.objectDict()[className].deleteControllerAction;
        if (!deleteControllerAction) {
            console.log("Class " + className + " does not have a dedicated delete action - failed to delete object " + id);
            return;
        }
        var successHandler = function (data) {
            console.log("looking for success message");
            var successNode = $(data).find('success');
            if (successNode.length) {
                result = successNode.text().match(/success\.delete.*/);
                console.log("successfully deleted " + className + " #" + id);
                cinnamon.registry.remove(className, id);
            }
        };
        $.ajax(this.url + deleteControllerAction, {
            type: 'post',
            async: false,
            data: {
                id: id
            },
            headers: {ticket: self.ticket},
            success: successHandler,
            statusCode: {
                500: function () {
                    console.log("cinnamon: delete relation failed.");
                }
            }
        });
        return result;
    };

}