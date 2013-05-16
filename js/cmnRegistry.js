/**
 * User: ingo
 * Date: 10.05.13
 * Time: 21:45
 */

function toMap(objectList, keyName){
    var map = {};
    for(var x = 0;x < objectList.length; x++){
//        console.log("map: "+objectList[x][keyName]+" = "+objectList[x]);
        map[objectList[x][keyName]] = objectList[x];        
    }
    return map;
}

function mapToValueList(map){
    var list = [];
    for(var field in map){
        if(map.hasOwnProperty(field)){
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
function Dictionary(valueList, keyName){
    this.keyName = keyName;
    this.values = toMap(valueList || [], keyName);
}

Dictionary.prototype.add = function(name,value){
    this.values[name] = value;
};

Dictionary.prototype.get = function(name){
    return this.values[name];
};

Dictionary.prototype.contains = function(name){
    return Object.prototype.propertyIsEnumerable.call(this.values, name);    
};

Dictionary.prototype.each = function(action){
    forEachIn(this.values, action);
};

function forEachIn(object, action){
    for(var property in object){
        if(object.hasOwnProperty(property)){
            action(property, object[property]);
        }
    }
}

function CmnRegistry(){
    this.registryTypes = {
        acl:{hasName:true},
        folder:{hasName:true, field:'name'},
        folderType:{hasName:true},
        metasetType:{hasName:true}, 
        objectType:{hasName:true},
        format:{hasName:true},
        lifeCycle:{hasName:true},
        lifeCycleState:{hasName:true},
        language:{hasName:true},
        uiLanguage:{hasName:true},
        userAccount:{hasName:true}
    };
    this.registries = {};
    this.nameRegistries = {};
}

CmnRegistry.prototype.setList = function(name, objects){
    console.log("add dictionary for "+name+" with "+objects.length+" items");
    this.registries[name] = new Dictionary(objects, 'id');
    var rType = this.registryTypes[name]; 
    if(rType != undefined && rType.hasName){
        console.log("add nameRegistry for "+name);
        var nameField = 'sysName';
        if(rType.hasOwnProperty('field')){
            nameField = rType.field;
        }
        this.nameRegistries[name] = new Dictionary(objects, nameField);
    }
};

CmnRegistry.prototype.add = function(className, object){
    this.setList(className, [object]);
};

CmnRegistry.prototype.get = function(className, id){
    console.log("get dictionary value for "+className+" id:"+id);
    return this.registries[className].get(id);    
};

CmnRegistry.prototype.getByName = function(className, name){
    console.log("get by name: class="+className+" name="+name);
    if(this.nameRegistries[className]){
        return this.nameRegistries[className].get(name);
    }
    else{
        console.log("entry not found");
        return null;
    }
};

CmnRegistry.prototype.list = function(className){
    return mapToValueList(this.registries[className].values);
};

CmnRegistry.prototype.listBy = function(className, property, propertyTest){
    var items = this.list(className);
    var itemsFound = [];
    console.log("found "+items.length+" entries in registry "+className);
    for(var x = 0; x < items.length; x++){
        if(propertyTest(items[x])){
            itemsFound.push(items[x]);
        }
    }
    return itemsFound;
};

