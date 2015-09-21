Ext.define('HammerAndPlanks.view.patient.PatientTreeController', {
    extend: 'Ext.app.ViewController',
	requires: [
		'HammerAndPlanks.model.PatientListModel',
		'HammerAndPlanks.model.Session',
		'HammerAndPlanks.store.Sessions'
	],
    alias: 'controller.patientTree',
	models: [
		'HammerAndPlanks.model.PatientTree',
		'HammerAndPlanks.model.Session'
	],
    stores: [
		'HammerAndPlanks.store.PatientTrees',
		'HammerAndPlanks.store.Sessions'	
	],
	
	onCheckChange: function( node, checked, eOpts ){
						if(node.hasChildNodes()){
							node.eachChild(function(childNode){
								childNode.set('checked', checked);
							});
						}
    },
	
	onItemClick: function(s,r) {
		//alert(r.data.name);
		var pTree = Ext.ComponentQuery.query('#pTreeId')[0];
		var selectedNode = pTree.getSelectionModel().getSelection()[0];
		var addBtn = Ext.ComponentQuery.query('#AddSessionBtn')[0];
		var removeBtn = Ext.ComponentQuery.query('#RemoveBtn')[0];
		//console.log(selectedNode);
		var selNodeName = new String(selectedNode.get('name'));
		
		if(selectedNode.isRoot()){
			removeBtn.disable();
		}else{
			removeBtn.enable();
		}
		
		if(selectedNode.isRoot()||(selNodeName.substring(0,7).valueOf() == 'Session'.valueOf()))
        {
			addBtn.disable();
        }
		else{
			addBtn.enable();
			//console.log(selectedNode.get('patientId'));
		};
	
	},
	
	onClickRemoveBtn: function(){
		var pTree = Ext.ComponentQuery.query('#pTreeId')[0];
		var selectedNode = pTree.getSelectionModel().getSelection()[0];
		
		selectedNode.parentNode.removeChild(selectedNode);

	},
	
    onClickAddSession: function(){
		/*Ext.define('Session', {
			extend: 'Ext.data.Model',
			fields: [ 'sessionNo', 'date']
		});*/
			
		/*var sessionStore = Ext.create('Ext.data.Store', {
			model: 'Session',
			data: [
				{ sessionNo: 'session 1', date: '17-06-2015'},
				{ sessionNo: 'session 2', date: '17-06-2015'},
				{ sessionNo: 'session 3', date: '17-06-2015'},
				{ sessionNo: 'session 4', date: '17-06-2015'}
			]
		});*/
		
		//Get currently selected patient
		var pTree = Ext.ComponentQuery.query('#pTreeId')[0];
		var selectedNode = pTree.getSelectionModel().getSelection()[0];
		var selPatientId = selectedNode.get('patientId');
		
		//Create the store
		var sessionStore = Ext.create('HammerAndPlanks.store.Sessions');
		sessionStore.getProxy().setUrl('http://localhost:80/hp/rest/sessions/'+selPatientId);
        sessionStore.load();
		
		//var sessionStore = Ext.create('HammerAndPlanks.store.Sessions');
		var sessionName = '';
		var date = '';
		var fileLocation = '';
		var sessionID = '';
		var exercise = '';//new added
		var onClickAddAllSession = function(){	
				//for(var i = 0; i < sessionStore.getTotalCount(); i++){
				for(var i = 0; i < 10; i++){ // The grid is paginated, each page shows 10 records
					selectedNode.appendChild({
						name: sessionStore.data.items[i].data.sessionName+' - '+sessionStore.data.items[i].data.exercise,
						sessionName: sessionStore.data.items[i].data.sessionName,
						sessionID: sessionStore.data.items[i].data.id,
						date: sessionStore.data.items[i].data.date,
						fileLoc: sessionStore.data.items[i].data.fileLocation,
						exercise: sessionStore.data.items[i].data.exercise,
						leaf: true,
						checked: false
					});
					selectedNode.expand();
				}
			};
		var grid = Ext.create('Ext.grid.Panel', {
			columnLines: true,
			store: sessionStore,
			selModel: {
				type: 'rowmodel',
				listeners: {
					/*selectionchange: function(){
						sessionName = this.selected.items[0].data.sessionNo;
						date = this.selected.items[0].data.date;
					}*/
					selectionchange: function(){
						sessionName = this.selected.items[0].data.sessionName;
						date = this.selected.items[0].data.date;
						fileLocation = this.selected.items[0].data.fileLocation;
						sessionID = this.selected.items[0].data.id;
						exercise = this.selected.items[0].data.exercise;//new added
					}
				}
			},
			defaultListenerScope: true,
			referenceHolder: true,

			/*columns:[
				{ xtype: 'rownumberer'},
				{ text: 'Session No', dataIndex: 'sessionNo', width: 100 },
				{ text: 'Date',  dataIndex: 'date', width: 100 }
			],*/
			xtype: 'paging-grid',
			height: 295,
			width: 390,
			tbar: {
                xtype: 'pagingtoolbar',
                store: sessionStore,
                displayInfo: true,
                displayMsg: 'Displaying {0} to {1} of {2}&nbsp;',
                emptyMsg: "No records to display&nbsp;"
            },
			columns:[
				{ xtype: 'rownumberer'},
				{ text: 'Session Name', dataIndex: 'sessionName', width: 100 },
				{ text: 'Exercise Type', dataIndex: 'exercise', width: 100 },
				{ text: 'Date',  dataIndex: 'date', width: 150 }
			],
			// inline buttons
			dockedItems: [{
				xtype: 'toolbar',
				dock: 'bottom',
				ui: 'footer',
				layout: {
					pack: 'right'
				},
				items: [{
							minWidth: 80,
							text: 'Add Session',
							listeners: {
								click: function(){
										
										selectedNode.appendChild({
											name: sessionName+' - '+exercise,
											sessionName: sessionName,
											sessionID: sessionID,
											date: date,
											fileLoc: fileLocation,
											exercise: exercise,//new added
											leaf: true,
											checked: false
										});
										selectedNode.expand();
								
									}
							}
						},{
							minWidth: 80,
							text: 'Add All',
							listeners:{
								click: onClickAddAllSession
							}
						}]
			}]
		});
		
		Ext.create('Ext.window.Window',{
			title: 'Add Session',
			height: 350,
			width: 395,
			items: [grid]
		}).show();
		
		
		
	},

    onClickAddPatient: function() {
	
		var patientStore = Ext.create('HammerAndPlanks.store.PatientListStore');
		patientStore.getProxy().setUrl('http://localhost:80/hp/rest/patients');
		patientStore.load();
		
		var fullname = '';
		var patientId = '';
		var gridPatient = Ext.create('Ext.grid.Panel', {
			columnLines: true,
			store: patientStore,
			xtype: 'paging-grid',
			height: 295,
			width: 430,
			tbar: {
                xtype: 'pagingtoolbar',
                store: patientStore,
                displayInfo: true,
                displayMsg: 'Displaying {0} to {1} of {2} &nbsp;records ',
                emptyMsg: "No records to display&nbsp;"
            },
			columns:[
				{ xtype: 'rownumberer'},
				{ text: 'First Name', dataIndex: 'firstName', width: 100 },
				{ text: 'Last Name', dataIndex: 'lastName', width: 100},
				{ text: 'Gender', dataIndex: 'gender', width: 100},
				{ text: 'Birth Date',  dataIndex: 'birthDate', width: 100 }
			],
			selModel: {
				type: 'rowmodel',
				listeners: {
					selectionchange: function(selModel, selections) {
						//getSelectionModel().getSelection();
						fullname = this.selected.items[0].data.firstName+' '+this.selected.items[0].data.lastName;
						patientId = this.selected.items[0].data.id;

					}
				}    
			},
			buttons: [{
				text: 'Add',
				reference: 'btnAdd',
				listeners: {
					click: function(){
						var pTree = Ext.ComponentQuery.query('#pTreeId')[0];

						var root = pTree.store.getRoot();

						root.appendChild({
							name: fullname,
							patientId: patientId,
							leaf: false,
							checked: false
						});
						
					}
				}
			}]
			
		});
		
		Ext.create('Ext.window.Window',{
			title: 'Add Patient',
			height: 350,
			width: 440,
			//autoScroll: true,
			items: [gridPatient]
		}).show();
    },

	onClickSession: function() {
		var pTree = Ext.ComponentQuery.query('#pTreeId')[0];
		var selectedNode = pTree.getSelectionModel().getSelection()[0];
		var patName = selectedNode.parentNode.get('name');
		var patientName = selectedNode.get('name').replace(/\s+/g, '').toLowerCase();
		var windowTitle = patName+' - '+selectedNode.get('name'),
			windowId = windowTitle.replace(/\s/g, "") ;
		var fileLoc = selectedNode.get('fileLoc');
		var selNodeName = new String(selectedNode.get('name'));
		var parentPanel = Ext.ComponentQuery.query('#panelCenter')[0];
		var onMaximize = function(window,opts){
							window.expand();
							window.setWidth(parentPanel.getWidth());
						};
		var onRestore = function( evt,toolEl,owner,tool ) {
							var window = owner.up( 'window' );
							window.expand('',false);
							window.setWidth(winWidth);
							window.center();
							isMinimized = false;
							this.hide();
							this.nextSibling().show();
						};
		var onMinimize = function( evt,toolEl,owner,tool ){
							var window = owner.up( 'window' );
							window.collapse();
							winWidth = window.getWidth();
							window.setWidth( 150 );
							window.alignTo( parentPanel.getEl(), 'bl-bl');
							this.hide();
							this.previousSibling().show();
							isMinimized = true;
						};
					
		if(selNodeName.substring(0,7).valueOf() == 'Session'.valueOf()){
						
			var win = Ext.create('Ext.window.Window', {
				title: windowTitle,
				constrain: true,
				constrainTo: parentPanel.getEl(),
				height: 200,
				width: 400,
				resizable: true,
				layout: 'fit',
				//minimizable: true,
				maximizable: true,
				html: "<iframe src='/hp/hpViz2/index2.html?jsonFile="+fileLoc+"' width='100%' height='100%' id='viz_iframe'></iframe>",
				listeners: {
					/*'minimize': function(window, opts) {
							window.collapse();
							window.setWidth(200);
							window.alignTo(Ext.getBody(), 'bl-bl');
					},*/
					'maximize': onMaximize
					
				},
				tools: [
					{  
						type: 'restore',
						hidden : true,
						handler: onRestore                           
					},{  
						type: 'minimize',
						handler: onMinimize                     
					}   
				]

			}).show();
			
			var eliframe = document.getElementById("viz_iframe");
			win.on({
				beforeresize: function(){
					eliframe.hidden = true;
				},
				resize: function(){
					eliframe.hidden = false;
				}
			})
		}else{
			var checkedSessions = pTree.getView().getChecked();
			var selectedSessions = [];
			var selSessionsText = '';
			
			Ext.Array.each(checkedSessions, function(rec){
				if(rec.parentNode.get('name').valueOf() == selectedNode.get('name').valueOf()){
					selectedSessions.push(rec.get('sessionName'));
					selSessionsText = selSessionsText + rec.get('sessionName').split(" ")[1]+','
				}
				
			});
			
			selSessionsText = selSessionsText.substring(0,selSessionsText.length-1)
			//var selSessions = JSON.stringify(selectedSessions);
			console.log(selSessionsText);
			var summaryWin = Ext.create('Ext.window.Window', {
				title: 'Summary',
				constrain: true,
				constrainTo: parentPanel.getEl(),
				height: 200,
				width: 400,
				resizable: true,
				layout: 'fit',
				//minimizable: true,
				maximizable: true,
				listeners: {
					/*'minimize': function(window, opts) {
							window.collapse();
							window.setWidth(200);
							window.alignTo(Ext.getBody(), 'bl-bl');
					},*/
					'maximize': onMaximize
					
				},
				tools: [
					{  
						type: 'restore',
						hidden : true,
						handler: onRestore                           
					},{  
						type: 'minimize',
						handler: onMinimize                     
					}   
				],
				//html: "<iframe src='/hp/summaryViz2/index.html?sessions="+selSessionsText+"&patientName="+patientName+"' width='100%' height='100%' id='viz_iframe'></iframe>"
				html: "<iframe src='/hp/hpSummary/index2.html?sessions="+selSessionsText+"&patientName="+patientName+"' width='100%' height='100%' id='viz_iframe'></iframe>"
			}).show();
			
			
		}
	}
	
});