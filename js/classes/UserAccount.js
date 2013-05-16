/**
 * User: ingo
 * Date: 16.05.13
 * Time: 22:15
 */

function UserAccount(xml, registry){
    this.registry = registry;
    addFields(this, xml, ['fullname', 'description',
            'activated', 'isSuperuser', 'sudoer', 'sudoable', 'email'], {name:'user > name',
            id: 'user > id'
    }, [
        {type:'uiLanguage', path:'language > id', field:'language'}
    ], registry);    
}
