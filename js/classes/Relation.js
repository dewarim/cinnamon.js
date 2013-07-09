function Relation(xml, registry) {
    this.registry = registry;
    this.parent = null;
    addFields(this, xml, null,
        {id: 'relation > id', typeName:'relation > type'},
        [
            {type: 'relation', path: 'relation > typeId', field: 'type'},
            {type: 'osd', path: 'relation > leftId', field: 'leftOsd', doFetch:true},
            {type: 'osd', path: 'relation > rightId', field: 'rightOsd', doFetch:true}
        ], registry);
}
