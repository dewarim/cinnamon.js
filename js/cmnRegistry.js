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
        folderType:{hasName:true},
        metasetType:{hasName:true}, 
        objectType:{hasName:true}
    };
    this.registries = {};
    this.nameRegistry = {};
}

CmnRegistry.prototype.setList = function(name, objects){
    console.log("add dictionary for "+name);
    this.registries[name] = new Dictionary(objects, 'id');
    if(this.registryTypes[name].hasName){
        this.nameRegistry[name] = new Dictionary(objects, 'name');
    }
};

CmnRegistry.prototype.get = function(className, id){
    console.log("get dictionary value for "+className+" id:"+id);
    return this.registries[className].get(id);    
};

CmnRegistry.prototype.getByName = function(className, name){
    
};

