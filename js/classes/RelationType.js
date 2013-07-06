/**
 */

function RelationType(xml){
    addFields(this, xml, ['id', 'name', 'sysName', 'leftResolver', 'rightResolver',
        'leftobjectprotected', 'rightobjectprotected',
        'cloneOnLeftCopy', 'cloneOnRightCopy',
        'cloneOnLeftVersion', 'cloneOnRightVersion'
    ], null, null);
}