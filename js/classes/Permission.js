/**
 * User: ingo
 * Date: 12.05.13
 * Time: 16:26
 */

function Permission(xml){
    addFields(this, xml, ['id', 'name', 'sysName'], null, null);
}