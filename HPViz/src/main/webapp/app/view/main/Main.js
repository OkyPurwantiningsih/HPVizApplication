/**
 * This class is the main view for the application. It is specified in app.js as the
 * "autoCreateViewport" property. That setting automatically applies the "viewport"
 * plugin to promote that instance of this class to the body element.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('HammerAndPlanks.view.main.Main', {
    extend: 'Ext.container.Container',
    requires: [
        'HammerAndPlanks.view.main.MainController',
        'HammerAndPlanks.view.main.MainModel',
		'HammerAndPlanks.view.patient.PatientTreeController',
		'HammerAndPlanks.view.patient.PatientTree',
		'HammerAndPlanks.view.patientGrid.PatientList',
		'HammerAndPlanks.view.patientGrid.PatientListController',
		'HammerAndPlanks.model.PatientListModel',
		'HammerAndPlanks.store.PatientListStore',
		'HammerAndPlanks.model.PatientTree',
		'HammerAndPlanks.store.PatientTrees',
		'HammerAndPlanks.model.Session',
		'HammerAndPlanks.store.Sessions'
    ],

    xtype: 'app-main',
    
    controller: 'main',
	plugins: 'viewport',
    viewModel: {
        type: 'main'
    },

    layout: {
        type: 'border'
    },

    items: [/*{
			region: 'north',
			xtype: 'component',
			cls: 'appBanner',
			padding: 10,
			height: 40,
			html: 'Hammer and Planks Visualization'
        },*/{
			xtype: 'patienttree',
			region: 'west',
			width: 250,
			split: true
		},{
			itemId: 'panelCenter',
			region: 'center',
			xtype: 'panel',
			title: 'GamePlay Visualization',
			layout: 'card'/*,
			items: [{
				xtype: 'container',
				itemId: 'listCt',
				layout: {
					type: 'vbox',
					align: 'stretch'
				},
				defaults: {
					margin: 5
				},        
				items: []
			},{
				xtype: 'container',
				itemId: 'fitCt',
				layout: 'fit',
				items: []
			}]*/
    }]
});
