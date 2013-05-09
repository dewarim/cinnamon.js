/**
 * User: ingo
 * Date: 08.05.13
 * Time: 23:37
 */

function FolderType(xml){
    addFields(this, xml, ['id', 'name', 'sysName', 'config'], null, null);
    this.configXml = $.parseXML(this.config);
}