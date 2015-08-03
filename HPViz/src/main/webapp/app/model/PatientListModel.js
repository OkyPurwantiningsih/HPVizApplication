Ext.define('HammerAndPlanks.model.PatientListModel', {
    extend: 'Ext.data.Model',
	alias: 'model.patient',

    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'firstname',
            type: 'string'
        },
        {
            name: 'lastname',
            type: 'string'
        },
		{
			name: 'birthdate',
			type: 'string'
		},
		{
			name: 'comments',
			type: 'string'
		},
		{
			name: 'gender',
			type: 'string'			
		}
    ]
	
});