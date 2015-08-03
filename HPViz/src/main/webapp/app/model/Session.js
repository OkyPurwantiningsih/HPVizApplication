Ext.define('HammerAndPlanks.model.Session', {
    extend: 'Ext.data.Model',
	alias: 'model.session',
	//fields: [ 'sessionNo', 'date']
    idProperty: 'id',
    fields: [
        {
            name: 'id',
            type: 'string'
        },
        {
            name: 'patientID',
            type: 'string'
        },
		{
            name: 'date',
            type: 'string'
        },
        {
            name: 'exercise',
            type: 'string'
        },
		{
			name: 'exerciseDirection',
			type: 'string'
		},
		{
			name: 'sessionName',
			type: 'string'
		},
		{
			name: 'fileLocation',
			type: 'string'			
		}
    ]
	
});