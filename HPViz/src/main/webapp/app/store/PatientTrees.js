Ext.define('HammerAndPlanks.store.PatientTrees', {
    extend: 'Ext.data.TreeStore',
    model: 'HammerAndPlanks.model.PatientTree',

    root: {
        expanded: true,
        id: -1,
        name: 'Patients'
    }

});

