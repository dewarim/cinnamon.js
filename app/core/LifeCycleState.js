import CinnamonBaseObject from './CinnamonBaseObject'

import LifeCycle from './LifeCycle'
export default class LifeCycleState{

    constructor(xml, registry ){
        this.registry = registry;
        CinnamonBaseObject.addFields(this, xml, ['id', 'name', 'sysName', 'stateClass', 'parameter',
            'lifeCycle', 'lifeCycleStateForCopy'])
    }


    getLifeCycle(){
        if(this.lifeCycle){
            if(this.lifeCycle instanceof LifeCycle){
                return this.lifeCycle;
            }
            else{
                /*
                 * LifeCycle and LifeCycleState may have a cyclic
                 * dependency, which is resolved at runtime (after both
                 * have been loaded from the server).
                 */
                this.lifeCycle = this.registry.get('lifeCycle', this.lifeCycle);
                return this.lifeCycle
            }
        }
        return null
    };

    getLifeCycleStateForCopy(registry){
        if(this.lifeCycleStateForCopy){
            if(this.lifeCycleStateForCopy instanceof LifeCycleState){
                return this.lifeCycleStateForCopy;
            }
            else{
                /*
                 * LifeCycle and LifeCycleState may have a cyclic
                 * dependency, which is resolved at runtime (after both
                 * have been loaded from the server).
                 */
                this.lifeCycleStateForCopy = registry.get('lifeCycleState', this.lifeCycleStateForCopy);
                return this.lifeCycleStateForCopy
            }
        }
        return null
    };
}