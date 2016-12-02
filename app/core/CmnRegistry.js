import Dictionary from './Dictionary'
// import Folder from './Folder'

export default class CmnRegistry {

    constructor(client) {
        this.client = client;
        this.registryTypes = {
            acl: {hasName: true},
            // folders have a name
            folder: {hasName: false, field: 'name'},
            relation: {hasName: false},
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
            osd: {hasName: false}
        };
        this.registries = {};
        this.nameRegistries = {};
    }

    setList(name, objects) {
        // console.log("add dictionary for " + name + " with " + objects.length + " items");
        console.log(objects)
        this.registries[name] = new Dictionary(objects, 'id');
        this.addToNameRegistry(this, name, objects);
    };

    addToNameRegistry(registry, name, objects) {
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

    removeFromNameRegistry(registry, name, objects) {
        var rType = registry.registryTypes[name];
        if (rType != undefined && rType.hasName) {
            var nameField = 'sysName';
            if (rType.hasOwnProperty('field')) {
                nameField = rType.field;
            }
            var nameReg = registry.nameRegistries[name];
            if (nameReg != undefined) {
                for (var x = 0; x < objects; x++) {
                    nameReg.add(objects[x][nameField], undefined);
                }
            }
        }
    }

    add(className, object) {
        var classRegistry = this.registries[className];
        if (classRegistry == undefined) {
            this.setList(className, [object]);
        }
        else {
            classRegistry.add(object.id, object);
            this.addToNameRegistry(this, className, [object]);
        }
    };

    remove(className, object) {
        var classRegistry = this.registries[className];
        if (classRegistry) {
            classRegistry.add(object.id, null);
            this.removeFromNameRegistry(this, className, [object]);
        }
    };

    get(className, id, doFetch) {
        // console.log("get dictionary value for " + className + " id:" + id);
        var classRegistry = this.registries[className];
        if (classRegistry == undefined) {
            console.log(`classRegistry for ${className} is undefined`)
            return null;
        }
        var item = classRegistry.get(id);
        if (!item && doFetch) {
            console.log("Object " + className + "#" + id + " was not found in registry - trying to fetch it.");
            this.client.fetchObjectList(className, id)
        }

        return classRegistry.get(id);
    };

    getByName(className, name) {
        console.log("get by name: class=" + className + " name=" + name);
        if (this.nameRegistries[className]) {
            return this.nameRegistries[className].get(name);
        }
        else {
            console.log("entry not found");
            return null;
        }
    };

    list(className) {
        return mapToValueList(this.registries[className].values);
    };

    listBy(className, property, propertyTest) {
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


}