/**
 * User: ingo
 * Date: 09.05.13
 * Time: 18:32
 */

function MetasetType(xml){
    addFields(this, xml, ['id', 'name', 'sysName', 'config'], null, null);
    this.configXml = $.parseXML(this.config);
}
