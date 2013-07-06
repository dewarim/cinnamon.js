/**
 * User: ingo
 * Date: 10.05.13
 * Time: 21:45
 */

function toMap(objectList, keyName) {
    var map = {};
    for (var x = 0; x < objectList.length; x++) {
//        console.log("map: "+objectList[x][keyName]+" = "+objectList[x]);
        map[objectList[x][keyName]] = objectList[x];
    }
    return map;
}

function mapToValueList(map) {
    var list = [];
    for (var field in map) {
        if (map.hasOwnProperty(field)) {
            list.push(map[field])
        }
    }
    return list;
}

/**
 * Constructor for a Dictionary of [propertyValue::Object].
 * For example, given a keyName of id, and a list of FolderType objects,
 * create a map of [id,
 * @param valueList list of Objects, for example: ObjectType
 * @param keyName
 * @constructor
 */
function Dictionary(valueList, keyName) {
    this.keyName = keyName;
    this.values = toMap(valueList || [], keyName);
}

Dictionary.prototype.add = function (name, value) {
    this.values[name] = value;
};

Dictionary.prototype.get = function (name) {
    return this.values[name];
};

Dictionary.prototype.contains = function (name) {
    return Object.prototype.propertyIsEnumerable.call(this.values, name);
};

Dictionary.prototype.each = function (action) {
    forEachIn(this.values, action);
};

function forEachIn(object, action) {
    for (var property in object) {
        if (object.hasOwnProperty(property)) {
            action(property, object[property]);
        }
    }
}

function CmnRegistry(client) {
    this.client = client;
    this.registryTypes = {
        acl: {hasName: true},
        // folders have a name
        folder: {hasName: false, field: 'name'},
        folderType: {hasName: true},
        relationType: {hasName: true},
        metasetType: {hasName: true},
        objectType: {hasName: true},
        format: {hasName: true},
        lifeCycle: {hasName: true},
        lifeCycleState: {hasName: true},
        language: {hasName: true},
        uiLanguage: {hasName: true},
        userAccount: {hasName: true, field: 'name'},
        // technically, an OSD has a name, but it is not unique, so we cannot create a
        // map of [name:object]
        osd:{hasName:false}
    };
    this.registries = {};
    this.nameRegistries = {};
}

CmnRegistry.prototype.setList = function (name, objects) {
    console.log("add dictionary for " + name + " with " + objects.length + " items");
    this.registries[name] = new Dictionary(objects, 'id');
    addToNameRegistry(this, name, objects);
};

function addToNameRegistry(registry, name, objects) {
    var rType = registry.registryTypes[name];
    if (rType != undefined && rType.hasName) {
        console.log("add nameRegistry for " + name);
        var nameField = 'sysName';
        if (rType.hasOwnProperty('field')) {
            nameField = rType.field;
        }
        var nameReg = registry.nameRegistries[name];
        if (nameReg == undefined) {
            registry.nameRegistries[name] = new Dictionary(objects, nameField);
        }
        else {
            for (var x = 0; x < objects; x++) {
                nameReg.add(objects[x][nameField], objects[x]);
            }
        }
    }
}

CmnRegistry.prototype.add = function (className, object) {
    var classRegistry = this.registries[className];
    if (classRegistry == undefined) {
        this.setList(className, [object]);
    }
    else {
        classRegistry.add(object.id, object);
        addToNameRegistry(this, className, [object]);
    }
};

CmnRegistry.prototype.get = function (className, id, doFetch) {
    console.log("get dictionary value for " + className + " id:" + id);
    var classRegistry = this.registries[className];
    if (classRegistry == undefined) {
        return null;
    }
    var item = classRegistry.get(id);
    if( ! item && doFetch){
        console.log("Object "+className+"#"+id+" was not found in registry - trying to fetch it.");
        this.client.fetchObjectList(className, id)        
    }
    
    return classRegistry.get(id);
};

CmnRegistry.prototype.getByName = function (className, name) {
    console.log("get by name: class=" + className + " name=" + name);
    if (this.nameRegistries[className]) {
        return this.nameRegistries[className].get(name);
    }
    else {
        console.log("entry not found");
        return null;
    }
};

CmnRegistry.prototype.list = function (className) {
    return mapToValueList(this.registries[className].values);
};

CmnRegistry.prototype.listBy = function (className, property, propertyTest) {
    var items = this.list(className);
    var itemsFound = [];
    console.log("found " + items.length + " entries in registry " + className);
    for (var x = 0; x < items.length; x++) {
        if (propertyTest(items[x])) {
            itemsFound.push(items[x]);
        }
    }
    return itemsFound;
};

