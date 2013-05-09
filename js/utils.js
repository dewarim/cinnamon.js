/**
 * User: ingo
 * Date: 05.05.13
 * Time: 17:45
 *
 * Utility functions taken from "Eloquent JavaScript" by Marijn Haverbeke
 */

function clone(object) {
    function OneShotConstructor() {
    }

    OneShotConstructor.prototype = object;
    return new OneShotConstructor();
}

function forEach(array, action) {
    for (var i = 0; i < array.length; i++) {
        action(array[i]);
    }
}

Object.prototype.create = function () {
    var object = clone(this);
    if (object.construct != undefined) {
        object.construct.apply(object, arguments);
    }
    return object;
};

Object.prototype.extend = function(properties){
    var result = clone(this);
    forEachIn(properties, function(name, value){
        result[name] = value;
    })
};

Object.prototype.properties = function(){
    var result = [];
    for(var property in this){
        if(this.hasOwnProperty(property)){
            result.push(property);
        }
    }
    return result;
};

function forEachIn(object, action){
    for(var property in object){
        if(object.hasOwnProperty(property)){
            action(property, object[property])
        }
    }
}