/**
 * The main application class. An instance of this class is created by app.js when it calls
 * Ext.application(). This is the ideal place to handle application launch and initialization
 * details.
 */
Ext.define('HammerAndPlanks.Application', {
    extend: 'Ext.app.Application',
    
    name: 'HammerAndPlanks',
	
    stores: [
    ],
    
    views: [

    ],
    launch: function () {
		Ext.Ajax.request({
			url : 'http://localhost:80/hp/rest/refreshDB/',
			method:'POST',
			scope: this
		}); 
    }
});
