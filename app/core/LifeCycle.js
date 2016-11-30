import CinnamonBaseObject from './CinnamonBaseObject'

export default class LifeCycle {

    constructor(xml, registry) {
        this.registry = registry;
        CinnamonBaseObject.addFields(this, xml, null,
            {id: 'lifecycle > id', name: 'lifecycle > name', sysName: 'lifecycle > sysName'},
            [
                {type: 'lifeCycleState', path: 'defaultState > id', field: 'defaultState'}
            ], registry);
    }

    getStates() {
        var myId = this.id;
        console.log("id: " + myId);
        this.states = this.registry.listBy('lifeCycleState', 'lifeCycle', function (item) {
            console.log("item.lifeCycle.id:" + item.getLifeCycle().id);
            return item.lifeCycle.id == myId;
        });
        return this.states;
    };


}