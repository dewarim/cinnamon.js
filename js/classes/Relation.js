function Relation(xml, registry) {
    this.registry = registry;
    this.parent = null;
    addFields(this, xml, null,
        {id: 'relation > id', typeName:'relation > type'},
        [
            {type: 'relationType', path: 'relationType > typeId', field: 'type'},
            {type: 'osd', path: 'relationType > leftId', field: 'leftOsd'},
            {type: 'osd', path: 'relationType > rightId', field: 'rightOsd'}
        ], registry);
}
