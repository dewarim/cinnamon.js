export default class Dictionary {
    /**
     * Constructor for a Dictionary of [propertyValue::Object].
     * For example, given a keyName of id, and a list of FolderType objects,
     * create a map of [id,
     * @param valueList list of Objects, for example: ObjectType
     * @param keyName
     * @constructor
     */
    constructor(valueList, keyName) {
        this.keyName = keyName;
        this.values = Dictionary.toMap(valueList || [], keyName);
    }

    add(name, value) {
        this.values[name] = value;
    };

    get(name) {
        return this.values[name];
    };

    contains(name) {
        return Object.prototype.propertyIsEnumerable.call(this.values, name);
    };

    each(action) {
        forEachIn(this.values, action);
    };

    forEachIn(object, action) {
        for (var property in object) {
            if (object.hasOwnProperty(property)) {
                action(property, object[property]);
            }
        }
    }

    static toMap(objectList, keyName) {
        var map = {};
        for (var x = 0; x < objectList.length; x++) {
//        console.log("map: "+objectList[x][keyName]+" = "+objectList[x]);
            map[objectList[x][keyName]] = objectList[x];
        }
        return map;
    }

    mapToValueList(map) {
        var list = [];
        for (var field in map) {
            if (map.hasOwnProperty(field)) {
                list.push(map[field])
            }
        }
        return list;
    }
}