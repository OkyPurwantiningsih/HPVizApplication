Ext.define('HammerAndPlanks.view.patient.PatientTree', {
    extend: 'Ext.tree.Panel',
	
    alias : 'widget.patienttree',
	itemId: 'pTreeId',
    xtype: 'check-tree',
    title: 'Patient',
    animate: true,
	useArrows: true,
    frame: true,
    rootVisible: true,
    displayField: 'name',
    controller: 'patientTree',
	bufferedRenderer: false,
	tbar: [
		{
			text: 'Add Patient',
			listeners: {
				click: 'onClickAddPatient'
			}
			
		},{
			text: 'Add Session',
			itemId: 'AddSessionBtn',
			disabled: true,
			listeners: {
				click: 'onClickAddSession'
			}
		},{
			text: 'Remove',
			itemId: 'RemoveBtn',
			disabled: true,
			listeners: {
				click: 'onClickRemoveBtn'
			}
		}/*,{
			iconCls: 'tasks-show-complete',
            id: 'CheckAllBtn',
			disabled: true,
            tooltip: 'Check All Session'
        }*/
	],
	listeners: {
		/*'itemClick': {
			element: 'el', //bind to the underlying el property on the panel
			fn: function(){ 
					var addBtn = Ext.ComponentQuery.query('#AddSessionBtn')[0];
					addBtn.setDisabled(false);
					console.log(addBtn);
				}
		}*/
		itemclick: 'onItemClick',
		itemdblclick: 'onClickSession',
		checkchange: 'onCheckChange'
        
	},
	root: {
        expanded: true,
        id: -1,
        name: 'Patients'
    }

});