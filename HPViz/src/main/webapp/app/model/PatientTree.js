Ext.define('HammerAndPlanks.model.PatientTree', {
    extend: 'Ext.data.TreeModel',

    fields: [
        { name: 'id', type: 'int' },
        { name: 'name' }
    ]
});