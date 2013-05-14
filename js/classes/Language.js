/**
 * User: ingo
 * Date: 14.05.13
 * Time: 23:33
 */

function Language(xml){
    addFields(this, xml, ['id', 'name', 'sysName'], null, null);
    this.meta = $(xml).find('meta');
}