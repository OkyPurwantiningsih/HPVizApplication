Ext.define('HammerAndPlanks.store.Sessions', {
    extend: 'Ext.data.Store',
	model: 'HammerAndPlanks.model.Session',
	storeId: 'sessionStoreId',
    autoLoad: true,
	autoSync: true,
    fields: ['id', 'patientID', 'date', 'exercise', 'exerciseDirection', 'sessionName', 'fileLocation'],
	proxy: {
        type: 'rest',
        url: '/rest/sessions',
		appendId: true,
		model: 'HammerAndPlanks.model.Session',
        reader: {
            type: 'json',
            rootProperty: 'session',
            successProperty: 'success',
			totalProperty: 'total'
        }
    },
	pageSize: 10

});