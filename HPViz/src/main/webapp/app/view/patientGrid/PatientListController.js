Ext.define('HammerAndPlanks.view.patientGrid.PatientListController', {
    extend: 'Ext.app.ViewController',
	 alias: 'controller.patientlist',
    models: [ 'HammerAndPlanks.model.PatientListModel'],
    stores: [ 'HammerAndPlanks.store.PatientListStore'],
    views:  [ 'HammerAndPlanks.view.patientGrid.PatientList'],
	
	onSelectionChange: function(selModel, selections) {
        this.lookupReference('btnAdd').setDisabled(selections.length === 0);
		console.log('select changes');
    },
});