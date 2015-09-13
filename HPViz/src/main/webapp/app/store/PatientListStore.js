Ext.define('HammerAndPlanks.store.PatientListStore', {
    extend: 'Ext.data.Store',
	model: 'HammerAndPlanks.model.PatientListModel',
	storeId: 'patientStoreId',
    autoLoad: true,
	autoSync: true,
    fields: ['id', 'firstname', 'lastname', 'birthdate', 'comments', 'gender'],
    proxy: {
        type: 'rest',
        url: '/rest/patients',
		model: 'HammerAndPlanks.model.PatientListModel',
        reader: {
            type: 'json',
            rootProperty: 'patients',
            successProperty: 'success',
			totalProperty: 'total'
        }

    },
	pageSize: 10

});