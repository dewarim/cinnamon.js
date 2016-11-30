import CinnamonBaseObject from './CinnamonBaseObject'

export default class UserAccount {

    constructor(xml, registry) {
        this.registry = registry;
        CinnamonBaseObject.addFields(this, xml,
            ['fullname', 'description', 'activated', 'isSuperuser', 'sudoer', 'sudoable', 'email'],
            {
                name: 'user > name',
                id: 'user > id'
            },
            [
                {type: 'uiLanguage', path: 'language > id', field: 'language'}
            ], registry);
    }


}