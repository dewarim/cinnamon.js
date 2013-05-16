/**
 * User: ingo
 * Date: 16.05.13
 * Time: 22:15
 */

function UserAccount(xml, registry){
    this.registry = registry;
    addFields(this, xml, ['id', 'fullname', 'description',
            'activated', 'isSuperuser', 'sudoer', 'sudoable', 'email'], {name:'user > name'}, [
        {type:'uiLanguage', path:'language > id', field:'language'}
    ], registry);    
}
