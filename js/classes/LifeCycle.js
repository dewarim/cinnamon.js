/**
 * User: ingo
 * Date: 13.05.13
 * Time: 22:38
 */

function LifeCycle(xml, registry) {
    this.registry = registry;
    addFields(this, xml, null, {id:'lifecycle > id', name:'lifecycle > name', sysName:'lifecycle > sysName'},
        [
            {type: 'lifeCycleState', path: 'defaultState > id', field: 'defaultState'}
        ], registry);
}

LifeCycle.prototype.getStates = function () {
    var myId = this.id;
    console.log("id: "+myId);
    this.states = this.registry.listBy('lifeCycleState', 'lifeCycle', function (item) {        
        console.log("item.lifeCycle.id:"+item.getLifeCycle().id);
        return item.lifeCycle.id == myId;
    });
    return this.states;
};