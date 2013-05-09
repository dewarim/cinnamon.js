/**
 * User: ingo
 * Date: 07.05.13
 * Time: 23:42
 */

function ObjectType(xml){
    addFields(this, xml, ['id', 'name', 'sysName', 'config'], null, null);
    this.configXml = $.parseXML(this.config);
}