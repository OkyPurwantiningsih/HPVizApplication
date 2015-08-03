Ext.define('HammerAndPlanks.view.patientGrid.PatientList', {
    extend: 'Ext.window.Window',
	controller: 'patientlist',
    alias: 'widget.patientList',
	height: 200,
	width: 500,
	layout: 'fit',
	modal: true,
	items: [{
        xtype: 'gridpanel',
		columnLines: true,
		selModel: {
			type: 'rowmodel',
			listeners: {
				selectionchange: function(selModel, selections) {
					lookupReference('btnAdd').setDisabled(selections.length === 0);
					console.log('select changes');
				}
			}    
		},
		store: Ext.StoreMgr.lookup('patientStoreId'),
		columns:[
				{ xtype: 'rownumberer'},
				{ text: 'First Name', dataIndex: 'firstname', width: 100 },
				{ text: 'Last Name', dataIndex: 'lastname', width: 100},
				{ text: 'Birth Date',  dataIndex: 'birthdate', width: 100 }
			],
		buttons: [{
			text: 'Add',
			reference: 'btnAdd',
			listeners: {
				// Call is routed to our ViewController (Ticket.view.user.UserController):
				click: function(){
					console.log('select changes');
				}
			}
		}]
    }]
});