/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
ns1blankspace.projectTask = 
{
	init: function (oParam)
	{
		var bShowHome = ns1blankspace.util.getParam(oParam, 'showHome', {'default': true}).value;

		ns1blankspace.app.reset();

		ns1blankspace.object = 11;
		ns1blankspace.objectName = 'projectTask';
		ns1blankspace.objectParentName = undefined;
		ns1blankspace.objectMethod = 'PROJECT_TASK';
		ns1blankspace.objectContext = -1;
		ns1blankspace.objectContextData = undefined;
		ns1blankspace.viewName = 'Project Tasks';
			
		ns1blankspace.app.set(oParam);
	},

	home: function (oParam, oResponse)
	{
		var aHTML = [];
	
		if (oResponse == undefined)
		{
			$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

			var aHTML = [];
						
			aHTML.push('<table class="ns1blankspace">');
			aHTML.push('<tr class="ns1blankspace">' +
							'<td id="ns1blankspaceMostLikely" class="ins1blankspace">' +
							ns1blankspace.xhtml.loading +
							'</td>' +
							'</tr>');
			aHTML.push('</table>');					
			
			$('#ns1blankspaceMain').html(aHTML.join(''));

			var aHTML = [];
						
			aHTML.push('<table>');

			aHTML.push('<tr><td><div id="ns1blankspaceViewProjectTaskLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
						
			aHTML.push('</table>');		
			
			$('#ns1blankspaceControl').html(aHTML.join(''));	

			var oSearch = new AdvancedSearch();
			oSearch.method = 'PROJECT_TASK_SEARCH';
			oSearch.addField('reference,title');
			oSearch.async = false;
			oSearch.rf = 'json';
			oSearch.rows = 10;
			oSearch.sort('modifieddate', 'desc');
			
			oSearch.getResults(function(oResponse)
			{
				if (oResponse.status == 'OK')
				{
					ns1blankspace.projectTask.home(oParam, oResponse);
				}
				else {ns1blankspace.status.error(oResponse.error.errornotes)}
			});
			
		}
		else
		{
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table>' +
								'<tr><td class="ns1blankspaceNothing">Click New to create a project task.</td></tr>' +
								'</table>');
			}
			else
			{
				aHTML.push('<table>');
				aHTML.push('<tr><td class="ns1blankspaceCaption">MOST LIKELY</td></tr>');

				$.each(oResponse.data.rows, function()
				{
					aHTML.push('<tr class="ns1blankspaceRow">');
					
					aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
									'" class="ns1blankspaceMostLikely">' + this.reference.formatXHTML() + '</td>' +
									'<td id="ns1blankspaceMostLikely_title-' + this.id + 
									'" class="ns1blankspaceMostLikely">' + this.title.formatXHTML() + '</td>');
					
					aHTML.push('</tr>');
				});
				
				aHTML.push('</table>');			
			}
			
			$('#ns1blankspaceMostLikely').html(aHTML.join(''));
		
			$('td.ns1blankspaceMostLikely').click(function(event)
			{
				ns1blankspace.projectTask.search.send(event.target.id, {source: 1});
			});
		}
	},

	search: 	
	{			
		send: function (sXHTMLElementId, oParam)
		{
			var aSearch = sXHTMLElementId.split('-');
			var sElementId = aSearch[0];
			var sSearchContext = aSearch[1];
			var iMinimumLength = 3;
			var iSource = ns1blankspace.data.searchSource.text;
			var sSearchText;
			var iMaximumColumns = 1;
			var iRows = 10;
			
			if (oParam != undefined)
			{
				if (oParam.source != undefined) {iSource = oParam.source}
				if (oParam.searchText != undefined) {sSearchText = oParam.searchText}
				if (oParam.rows != undefined) {iRows = oParam.rows}
				if (oParam.searchContext != undefined) {sSearchContext = oParam.searchContext}
				if (oParam.minimumLength != undefined) {iMinimumLength = oParam.minimumLength}
				if (oParam.maximumColumns != undefined) {iMaximumColumns = oParam.maximumColumns}
			}
				
			if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
			{
				$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
				
				ns1blankspace.objectContext = sSearchContext;
			
				var oSearch = new AdvancedSearch();
				oSearch.method = 'PROJECT_TASK_SEARCH';
				oSearch.addField('reference,title,description,type,typetext,project,projecttext,startdate,taskbyuser,taskbyusertext,priority,prioritytext,status,statustext' +
								',duration,percentagecomplete,enddate,actualenddate,criticaldate,milestone,' +
								ns1blankspace.option.auditFields);
				oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
				oSearch.getResults(function(data)
				{
					if (data.status == 'OK')
					{
						ns1blankspace.projectTask.show(oParam, data);
					}
					else {ns1blankspace.status.error(data.error.erronotes)};
				});	
			}
			else
			{
				if (iSource == undefined)
				{
					iSource = ns1blankspace.data.searchSource.text;
				}	
				
				if (sSearchText == undefined)
				{
					sSearchText = $('#ns1blankspaceViewControlSearch').val();
				}	
				
				if (iSource == ns1blankspace.data.searchSource.browse)
				{
					iMinimumLength = 1;
					iMaximumColumns = 4;
					sSearchText = aSearch[1];
					if (sSearchText == '#') {sSearchText = '[0-9]'}
					sElementId = 'ns1blankspaceViewControlBrowse';
				}
				
				if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
				{		
					ns1blankspace.search.start();

					var oSearch = new AdvancedSearch();
					oSearch.method = 'PROJECT_TASK_SEARCH';
					oSearch.addField('reference,title');
					oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);

					ns1blankspace.search.advanced.addFilters(oSearch);

					oSearch.getResults(function(data) 
					{
						if (data.status == 'OK')
						{
							ns1blankspace.projectTask.search.process(oParam, data);
						}
						else {ns1blankspace.status.error(data.error.erronotes)};
					});
				}
			}
		},

		process: function (oParam, oResponse)
		{
			var iColumn = 0;
			var aHTML = [];
			var	iMaximumColumns = 1;
				
			if (oResponse.data.rows.length == 0)
			{
				$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
			}
			else
			{
				aHTML.push('<table class="ns1blankspaceSearchMedium">');
					
				$.each(oResponse.data.rows, function()
				{
					iColumn = iColumn + 1;
					
					if (iColumn == 1)
					{
						aHTML.push('<tr class="ns1blankspaceSearch">');
					}
					
					aHTML.push('<td class="ns1blankspaceSearch" id="reference' +
									'-' + this.id + '">' + this.reference.formatXHTML() + '</td>' +
								'<td class="ns1blankspaceSearch" id="title' +
									'-' + this.id + '">' + this.title.formatXHTML() + '</td>');
					
					if (iColumn == iMaximumColumns)
					{
						aHTML.push('</tr>');
						iColumn = 0;
					}	
				});
		    	
				aHTML.push('</table>');

				$(ns1blankspace.xhtml.searchContainer).html(
					ns1blankspace.render.init(
					{
						html: aHTML.join(''),
						more: (oResponse.morerows == "true"),
						header: false
					}) 
				);		
				
				$('td.ns1blankspaceSearch').click(function(event)
				{
					$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
					$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
					ns1blankspace.projectTask.search.send(event.target.id, {source: 1});
				});

				ns1blankspace.render.bind(
				{
					columns: 'reference-column-title',
					more: oResponse.moreid,
					startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
					functionSearch: ns1blankspace.projectTask.search.send
				});   
			}	
					
		}
	},

	layout: function ()
	{
		var aHTML = [];

		aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
		
		aHTML.push('<table class="ns1blankspaceControl">');
		
		if (ns1blankspace.objectContext == -1)
		{
			aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">' +
							'Details</td></tr>');		

			aHTML.push('<tr><td id="ns1blankspaceControlDescription" class="ns1blankspaceControl">' +
							'Description</td></tr>');

			aHTML.push('<tr><td id="ns1blankspaceControlScheduling" class="ns1blankspaceControl">' +
							'Scheduling</td></tr>');

			aHTML.push('</table>');		
		}
		else
		{
			aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
							'Summary</td></tr>');

			aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
							'Details</td></tr>');

			aHTML.push('</table>');		
		
			aHTML.push('<table class="ns1blankspaceControl">');

			aHTML.push('<tr><td id="ns1blankspaceControlDescription" class="ns1blankspaceControl">' +
							'Description</td></tr>');

			aHTML.push('<tr><td id="ns1blankspaceControlScheduling" class="ns1blankspaceControl">' +
							'Scheduling</td></tr>');

			aHTML.push('</table>');		
		
			aHTML.push('<table class="ns1blankspaceControl">');
		
			aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">' +
							'Actions</td></tr>');
						
			aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
							'Attachments</td></tr>');
		}	
		
		aHTML.push('</table>');					
					
		$('#ns1blankspaceControl').html(aHTML.join(''));
		
		var aHTML = [];

		aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainDescription" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainScheduling" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
				
		$('#ns1blankspaceMain').html(aHTML.join(''));

		$('#ns1blankspaceControlSummary').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
			ns1blankspace.projectTask.summary();
		});
		
		$('#ns1blankspaceControlDetails').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
			ns1blankspace.projectTask.details();
		});

		$('#ns1blankspaceControlDescription').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainDescription'});
			ns1blankspace.projectTask.description();
		});

		$('#ns1blankspaceControlScheduling').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainScheduling'});
			ns1blankspace.projectTasks.scheduling();
		});

		$('#ns1blankspaceControlActions').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainActions', refresh: true});
			
			ns1blankspace.actions.show({xhtmlElementID: 'ns1blankspaceMainActions'});
		});
		
		$('#ns1blankspaceControlAttachments').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
			ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});
		});
	},

	show: function (oParam, oResponse)
	{
		ns1blankspace.app.clean();
		ns1blankspace.projectTask.layout();
		
		var aHTML = [];
		
		if (oResponse.data.rows.length == 0)
		{
			ns1blankspace.objectContextData = undefined;
			
			aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this project task.</td></tr></table>');
					
			$('#ns1blankspaceMain').html(aHTML.join(''));
		}
		else
		{
			ns1blankspace.objectContextData = oResponse.data.rows[0];
		
			$('#ns1blankspaceControlContext').html(ns1blankspace.objectContextData.reference);
			$('#ns1blankspaceViewControlAction').button({disabled: false});
			$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
			
			ns1blankspace.history.view(
			{
				newDestination: 'ns1blankspace.projectTask.init({id: ' + ns1blankspace.objectContext + '})',
				move: false
			});
			
			ns1blankspace.history.control({functionDefault: 'ns1blankspace.projectTask.summary()'});
		}	
	},	
		
	summary: function ()
	{
		var aHTML = [];
		
		if (ns1blankspace.objectContextData == undefined)
		{
			aHTML.push('<table><tr><td valign="top">Sorry can\'t find this project task.</td></tr></table>');
					
			$('#ns1blankspaceMainSummary').html(aHTML.join(''));
		}
		else
		{
			aHTML.push('<table class="ns1blankspace">' +
						'<tr class="ns1blankspaceRow">' +
						'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
						'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:100px;"></td>' +
						'</tr>' +
						'</table>');				
			
			$('#ns1blankspaceMainSummary').html(aHTML.join(''));

			aHTML.push('<table class="ns1blankspace">');
			
			aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Project</td></tr>' +
						'<tr><td id="ns1blankspaceSummaryProject" class="ns1blankspaceSummary">' +
						ns1blankspace.objectContextData.projecttext +
						'</td></tr>');

			if (ns1blankspace.objectContextData.title != '')
			{
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Title</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryTitle" class="ns1blankspaceSummary">' +
							ns1blankspace.objectContextData.title +
							'</td></tr>');
			}	

			if (ns1blankspace.objectContextData.type != '')
			{
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Task Type</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryTaskType" class="ns1blankspaceSummary">' +
							ns1blankspace.objectContextData.typetext +
							'</td></tr>');	
			}

			if (ns1blankspace.objectContextData.status != '')
			{
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Status</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryStatus" class="ns1blankspaceSummary">' +
							ns1blankspace.objectContextData.statustext +
							'</td></tr>');
			}											
			
			if (ns1blankspace.objectContextData.priority != '')
			{
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Priority</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryPriority" class="ns1blankspaceSummary">' +
							ns1blankspace.objectContextData.prioritytext +
							'</td></tr>');
			}											
			
			aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Last Updated</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryLastUpdated" class="ns1blankspaceSummary">' +
							Date.parse(ns1blankspace.objectContextData.modifieddate).toString("dd MMM yyyy") +
							'</td></tr>');	

			aHTML.push('</table>');					
			
			$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));
		}	
	},

	details: function ()
	{
		var aHTML = [];
		var dToday = new Date();
		
		if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
		{
			$('#ns1blankspaceMainDetails').attr('data-loading', '');
			
			aHTML.push('<table class="ns1blankspaceContainer">' +
							'<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
							'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
							'</tr>' + 
							'</table>');					
			
			$('#ns1blankspaceMainDetails').html(aHTML.join(''));
			
			var aHTML = [];
			
			aHTML.push('<table class="ns1blankspace">');		

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Project' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceSelect">' +
							'<input id="ns1blankspaceDetailsProject" class="ns1blankspaceSelect"' +
								' data-method="PROJECT_SEARCH"' +
								' data-columns="reference-pipe-description"' +
								' data-methodFilter="reference-TEXT_IS_LIKE|description-TEXT_IS_LIKE">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Reference' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsReference" class="ns1blankspaceText">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Title' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsTitle" class="ns1blankspaceText">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Task Type' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceSelect">' +
							'<input id="ns1blankspaceDetailsType" class="ns1blankspaceSelect"' +
								' data-method="SETUP_PROJECT_TASK_TYPE_SEARCH">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Task By' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceSelect">' +
							'<input id="ns1blankspaceDetailsTaskBy" class="ns1blankspaceSelect"' +
								' data-method="SETUP_USER_SEARCH"' +
								' data-columns="username"' +
								' data-methodFilter="username-TEXT_IS_LIKE|contactpersontext--TEXT_IS_LIKE">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Start Date' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceDate">' +
							'<input id="ns1blankspaceDetailsStartDate" class="ns1blankspaceDate">' +
							'</td></tr>');	

			aHTML.push('</table>');					
			
			$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
			
			$('input.ns1blankspaceDate').datepicker({ dateFormat: 'dd M yy' });
			
			var aHTML = [];
				
			aHTML.push('<table class="ns1blankspaceColumn2">');
			
			aHTML.push('<tr><td class="ns1blankspaceCaption">' +
							'Status' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Not Started' +
							'<br /><input type="radio" id="radioStatus6" name="radioStatus" value="6"/>Not Assigned' +
							'<br /><input type="radio" id="radioStatus2" name="radioStatus" value="2"/>In Progress' +
							'<br /><input type="radio" id="radioStatus7" name="radioStatus" value="7"/>To Be Checked' +
							'<br /><input type="radio" id="radioStatus5" name="radioStatus" value="5"/>On Hold' +
							'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>Cancelled' +
							'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Completed' +
							'</td></tr>');
			
			aHTML.push('<tr><td class="ns1blankspaceCaption">' +
							'Priority' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioPriority0" name="radioPriority" value="0"/>Critical' +
							'<br /><input type="radio" id="radioPriority1" name="radioPriority" value="1"/>Urgent' +
							'<br /><input type="radio" id="radioPriority2" name="radioPriority" value="2"/>Routine' +
							'<br /><input type="radio" id="radioPriority3" name="radioPriority" value="3"/>Non Critical' +
							'<br /><input type="radio" id="radioPriority4" name="radioPriority" value="4"/>Unassigned' +
							'</td></tr>');
			
			aHTML.push('</table>');					
				
			$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

			if (ns1blankspace.objectContextData != undefined)
			{
				$('#ns1blankspaceDetailsProject').val(ns1blankspace.objectContextData.projecttext.formatXHTML());
				$('#ns1blankspaceDetailsProject').attr('data-id', ns1blankspace.objectContextData.project);
				$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference.formatXHTML());
				$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title.formatXHTML());
				$('#ns1blankspaceDetailsType').val(ns1blankspace.objectContextData.typetext.formatXHTML());
				$('#ns1blankspaceDetailsType').attr('data-id', ns1blankspace.objectContextData.type);
				$('#ns1blankspaceDetailsTaskBy').val(ns1blankspace.objectContextData.taskbyusertext.formatXHTML());
				$('#ns1blankspaceDetailsTaskBy').attr('data-id', ns1blankspace.objectContextData.taskbyuser);
				$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
				$('[name="radioPriority"][value="' + ns1blankspace.objectContextData.priority + '"]').attr('checked', true);
				$('#ns1blankspaceDetailsStartDate').val(ns1blankspace.objectContextData.startdate);
			}
			else
			{
				$('[name="radioStatus"][value="1"]').attr('checked', true);
				$('[name="radioPriority"][value="2"]').attr('checked', true);
				$('#ns1blankspaceDetailsStartDate').val(dToday.toString('dd MMM yyyy'));
				$('#ns1blankspaceDetailsTaskBy').val(ns1blankspace.user.logonName);
				$('#ns1blankspaceDetailsTaskBy').attr('data-id', ns1blankspace.user.id);
			}
		}	
	},

	description: function ()
	{
		var aHTML = [];
		
		if ($('#ns1blankspaceMainDescription').attr('data-loading') == '1')
		{
			$('#ns1blankspaceMainDescription').attr('data-loading', '');
			
			aHTML.push('<table class="ns1blankspaceContainer">' +
							'<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceDescriptionColumn1" class="ns1blankspaceColumn1"></td>' +
							'<td id="ns1blankspaceDescriptionColumn2" class="ns1blankspaceColumn2"></td>' +
							'</tr>' + 
							'</table>');								
			
			$('#ns1blankspaceMainDescription').html(aHTML.join(''));
			
			var aHTML = [];
		
			aHTML.push('<table id="ns1blankspaceDescriptionColumn1" class="ns1blankspace">');
					
			aHTML.push('<tr class="ns1blankspaceTextMulti">' +
							'<td class="ns1blankspaceTextMulti">' +
							'<textarea id="ns1blankspaceDescription" rows="30" cols="50" class="ns1blankspaceTextMulti ns1blankspaceTextMultiLarge"></textarea>' +
							'</td></tr>');
							
			aHTML.push('</table>');					
			
			$('#ns1blankspaceDescriptionColumn1').html(aHTML.join(''));
			
			if (ns1blankspace.objectContextData != undefined)
			{
				$('#ns1blankspaceDescription').val(unescape(ns1blankspace.objectContextData.description.formatXHTML()));
			}
		}	
	},

	scheduling: function ()
	{
		var aHTML = [];

		if ($('#ns1blankspaceMainScheduling').attr('data-loading') == '1')
		{
			$('#ns1blankspaceMainScheduling').attr('data-loading', '');
			
			aHTML.push('<table class="ns1blankspaceContainer">' +
							'<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceSchedulingColumn1" class="ns1blankspaceColumn1"></td>' +
							'<td id="ns1blankspaceSchedulingColumn2" class="ns1blankspaceColumn2"></td>' +
							'</tr>' + 
							'</table>');					
			
			$('#ns1blankspaceMainScheduling').html(aHTML.join(''));
			
			var aHTML = [];
			
			aHTML.push('<table class="ns1blankspace">');		

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Duration' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceSchedulingDuration" class="ns1blankspaceText">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Scheduled End Date' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceDate">' +
							'<input id="ns1blankspaceSchedulingEndDate" class="ns1blankspaceDate">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Actual End Date' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceDate">' +
							'<input id="ns1blankspaceSchedulingActualEndDate" class="ns1blankspaceDate">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Critical End Date' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceDate">' +
							'<input id="ns1blankspaceSchedulingCriticalEndDate" class="ns1blankspaceDate">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Percent Complete' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceSchedulingPercentComplete" class="ns1blankspaceText">' +
							'</td></tr>');	

			aHTML.push('</table>');					
			
			$('#ns1blankspaceSchedulingColumn1').html(aHTML.join(''));
			
			$('input.ns1blankspaceDate').datepicker({ dateFormat: 'dd M yy' });
			
			var aHTML = [];
				
			aHTML.push('<table class="ns1blankspaceColumn2">');
			
			aHTML.push('<tr><td class="ns1blankspaceCaption">' +
							'Milestone?' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioMilestone1" name="radioMilestone" value="Y"/>Yes' +
							'<br /><input type="radio" id="radioMilestone2" name="radioMilestone" value="N"/>No' +
							'</td></tr>');

			aHTML.push('</table>');					
				
			$('#ns1blankspaceSchedulingColumn2').html(aHTML.join(''));

			if (ns1blankspace.objectContextData != undefined)
			{
				$('#ns1blankspaceSchedulingDuration').val(ns1blankspace.objectContextData.duration.formatXHTML());
				$('#ns1blankspaceSchedulingEndDate').val(ns1blankspace.objectContextData.enddate);
				$('#ns1blankspaceSchedulingActualEndDate').val(ns1blankspace.objectContextData.actualenddate.formatXHTML());
				$('#ns1blankspaceSchedulingCriticalEndDate').val(ns1blankspace.objectContextData.criticaldate.formatXHTML());
				$('#ns1blankspaceSchedulingPercentComplete').val(ns1blankspace.objectContextData.percentagecomplete.formatXHTML());
				$('[name="radioMilestone"][value="' + ns1blankspace.objectContextData.milestone + '"]').attr('checked', true);
			}
			else
			{
				$('[name="radioMilestone"][value="N"]').attr('checked', true);
			}
		}	
	},

	save: 		
	{
		send: function ()
		{
			var oData = (ns1blankspace.objectContext == -1) ? {} : {id: ns1blankspace.objectContext};
				
			if ($('#ns1blankspaceMainDetails').html() != '')
			{
				oData.project = $('#ns1blankspaceDetailsProject').attr('data-id');
				oData.reference = $('#ns1blankspaceDetailsReference').val();
				oData.startdate = $('#ns1blankspaceDetailsStartDate').val();
				oData.title = $('#ns1blankspaceDetailsTitle').val();
				oData.type = $('#ns1blankspaceDetailsType').attr('data-id');
				oData.taskbyuser = ($('#ns1blankspaceDetailsTaskBy').attr('data-id') == '') ? ns1blankspace.user.id : $('#ns1blankspaceDetailsTaskBy').attr('data-id');
				oData.status = $('input[name="radioStatus"]:checked').val();
				oData.priority = $('input[name="radioPriority"]:checked').val();
			}
			
			if ($('#ns1blankspaceMainDescription').html() != '')
			{
				oData.description = $('#ns1blankspaceDescription').val();
			}
			
			if ($('#ns1blankspaceMainScheduling').html() != '')
			{
				oData.duration = $('#ns1blankspaceSchedulingDuration').val();
				oData.enddate = $('#ns1blankspaceSchedulingEndDate').val();
				oData.actualenddate = $('#ns1blankspaceSchedulingActualEndDate').val();
				oData.criticaldate = $('#ns1blankspaceSchedulingCriticalEndDate').val();
				oData.percentagecomplete = $('#ns1blankspaceSchedulingPercentComplete').val();
				oData.milestone = $('input[name="radioMilestone"]:checked').val();
			}
			
			$.ajax(
			{
				type: 'POST',
				url: ns1blankspace.util.endpointURI('PROJECT_TASK_MANAGE'),
				data: oData,
				dataType: 'json',
				success: ns1blankspace.projectTask.save.process
			});
		},

		process: function (oResponse)
		{
			if (oResponse.status == 'OK')
			{
				var bNew = false;
				ns1blankspace.status.message('Project task saved');
				if (ns1blankspace.objectContext == -1) {bNew = true}
				ns1blankspace.objectContext = oResponse.id;	
				ns1blankspace.inputDetected = false;
				if (bNew) {ns1blankspace.projectTask.search.send('-' + ns1blankspace.objectContext, {source: 1})}

			}
			else
			{
				ns1blankspace.status.error(oResponse.error.errornotes);
			}
		}
	}
}								