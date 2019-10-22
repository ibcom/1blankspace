/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */

/* Still need...
 - ability to send to another advisor 
 */
 
ns1blankspace.supportIssue = 
{
	data: 		
	{
		mode:
		{
			options:
			{
				byMe: 1,
				forMe: 2
			}
		},
		status:
		{	/* prod values for selected Status Values */
			notAssigned: '6',
			completed: '3',
			onHold: '5',
			discontinued: '4'
		},
		type:
		{
			label1: 'Help Required',
			label2: 'Suggestion',
			label3: 'General Comment',
			toolTip:
			{
				'1': '',
				'2': '',
				'3': ''
			}
		},
		severity:
		{
			toolTip: 
			{
				'1': '',
				'2': '',
				'3': '',
				'4': '',
				'5': ''
			}
		}
	},

	init: 		function (oParam)
	{
		if (oParam === undefined) {oParam = {}}

		ns1blankspace.app.reset();

		ns1blankspace.supportIssue.getUsers();
		ns1blankspace.supportIssue.getStatusValues({});
		ns1blankspace.supportIssue.getSpaceSupportContacts({});

		ns1blankspace.object = 8;
		ns1blankspace.objectName = 'supportIssue';
		ns1blankspace.objectContextData = undefined;
		ns1blankspace.objectContext = -1;
		ns1blankspace.objectMethod = 'SUPPORT_ISSUE';
		ns1blankspace.viewName = 'Support Issues';

		ns1blankspace.supportIssue.data.title = ns1blankspace.util.getParam(oParam, 'title').value;
		ns1blankspace.supportIssue.data.description = ns1blankspace.util.getParam(oParam, 'description').value;
		ns1blankspace.supportIssue.data.issueForwarded = ns1blankspace.util.getParam(oParam, 'issueForwarded', {'default': false}).value;
		ns1blankspace.supportIssue.data.sourceIssueID = ns1blankspace.util.getParam(oParam, 'sourceIssueID').value;
		ns1blankspace.supportIssue.data.sourceIssueTechNotes = ns1blankspace.util.getParam(oParam, 'sourceIssueTechNotes').value;

		if (ns1blankspace.supportIssue.data.mode.value === undefined)
		{
			ns1blankspace.supportIssue.data.mode.value = ns1blankspace.util.getParam(oParam, 'mode', {"default": 1}).value;
		}	
				
		if (ns1blankspace.supportIssue.data.extendElements == undefined && ns1blankspace.extend.structure)
		{
			ns1blankspace.supportIssue.data.extendElements = $.grep(ns1blankspace.extend.structure, function(x) {return x.object == '8'}).shift();
			if (ns1blankspace.supportIssue.data.extendElements)
			{
				ns1blankspace.supportIssue.data.extendElements = ns1blankspace.supportIssue.data.extendElements.elements;
			}
			else {ns1blankspace.supportIssue.data.extendElements = []}
		}

		oParam.bind = ns1blankspace.supportIssue.bind;

		oParam.xhtml = '<table id="ns1blankspaceOptions" class="ns1blankspaceViewControlContainer">' +	
								'<tr class="ns1blankspaceOptions">' +
								'<td id="ns1blankspaceControlActionOptionsRemove" class="ns1blankspaceViewControl">' +
								'Delete' +
								'</td></tr>' +
								'<tr class="ns1blankspaceOptions">' +
								'<td id="ns1blankspaceControlActionOptionsAlert" class="ns1blankspaceViewControl">' +
								'Send Email Alert' +
								'</td></tr>' +
								'</table>';
				
		ns1blankspace.app.set(oParam);
	},

	bind: 		function (oParam)
	{
		$('#ns1blankspaceControlActionOptionsRemove')
		.click(function() 
		{
			ns1blankspace.app.options.remove(oParam)
		});

		$('#ns1blankspaceControlActionOptionsAlert')
		.click(function() 
		{
			$(ns1blankspace.xhtml.container).hide();
			ns1blankspace.supportIssue.alert.init(oParam);
		});
	},			

	home: function (oParam, oResponse)
	{
		var sSortColumn = ns1blankspace.util.getParam(oParam, 'sortColumn', {'default': 'reference'}).value;
		var sSortDirection = ns1blankspace.util.getParam(oParam, 'sortDirection', {'default': 'desc'}).value;
		
		if (oParam)
		{ 	if (oParam.issueHomeStep === undefined) {oParam.issueHomeStep = 1}}
		else
		{ 	oParam = {issueHomeStep: 1}}

		if (oResponse == undefined)
		{
			if (oParam.issueHomeStep == 1)
			{
				oParam.onComplete = ns1blankspace.supportIssue.home;
				oParam.issueHomeStep = 2;
				ns1blankspace.supportIssue.getStatusValues(oParam);
			}

			else if (oParam.issueHomeStep == 2)
			{
				oParam.onComplete = ns1blankspace.supportIssue.home;
				oParam.issueHomeStep = 3;
				ns1blankspace.supportIssue.getSpaceSupportContacts(oParam);
			}

			else if (oParam.issueHomeStep == 3)
			{
				$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

				if (false && ns1blankspace.supportIssue.data.mode.value === undefined)
				{
					ns1blankspace.supportIssue.data.mode.value = ns1blankspace.util.getParam(oParam, 'mode', {"default": 1}).value;
				}	

				var aHTML = [];
							
				aHTML.push('<table class="ns1blankspaceMain">');
				aHTML.push('<tr class="ns1blankspaceMain">' +
								'<td id="ns1blankspaceMostLikely" class="ns1blankspaceMain">' +
								ns1blankspace.xhtml.loading +
								'</td>' +
								'<td id="ns1blankspaceHomeAction" style="width:150px;"></td>' +
								'</tr>');
				aHTML.push('</table>');					
				
				$('#ns1blankspaceMain').html(aHTML.join(''));

				var aHTML = [];

				aHTML.push('<table class="ns1blankspaceColumn2">');

				/// v2.0.1 Only applies to systemAdmin users
				if (ns1blankspace.user.systemAdmin)
				{
					if (ns1blankspace.option.helpURI !== undefined)
					{ 
						aHTML.push('<tr><td style="font-size:0.875em; width:110px;">' +
									'<a href="' + ns1blankspace.option.helpURI + '" target="_blank"' +
									'>Get help from the community</a>' +
									'</td></tr>');	
					}

					aHTML.push('<tr><td style="padding-top:20px;" class="ns1blankspaceHeader">' +
									'DEBUGGING' +
									'</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceSupportDebugLogShowContainer">' +
									'<span id="ns1blankspaceSupportDebugLogShow" class="ns1blankspaceAction" style="width:20px; height:20px;"></span>' +
									'<span id="ns1blankspaceSupportDebugLogClear" class="ns1blankspaceAction" style="margin-left:4px; width:20px; height:20px;"></span>' +
									'</td></tr>');

					$('#ns1blankspaceHomeAction').css('width', '150px')
				}
				else
				{
					$('#ns1blankspaceHomeAction').css('width', '5px')
				}

				aHTML.push('</table>');

				if (ns1blankspace.option.helpNotes !== undefined)
				{ 
					aHTML.push(ns1blankspace.option.helpNotes);	
				}						

				$('#ns1blankspaceHomeAction').html(aHTML.join(''));

				$('#ns1blankspaceSupportDebugLogShow').button(
				{	
					text: false,
					label: 'Show',
					icons:
					{
						primary: "ui-icon-clipboard"
					}
				})
				.click(function()
				{
					ns1blankspace.supportIssue.debug.show();
				});

				$('#ns1blankspaceSupportDebugLogClear').button(
				{	
					text: false,
					label: 'Clear',
					icons:
					{
						primary: "ui-icon-close"
					}
				})
				.click(function()
				{
					ns1blankspace.supportIssue.debug.clear();
					ns1blankspace.supportIssue.debug.show();
				});

				var aHTML = [];
							
				aHTML.push('<table><tr><td><div id="ns1blankspaceViewHelpLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

				aHTML.push('<tr><td class="ns1blankspaceSub" style="padding-top:10px; font-size:0.875em; border-bottom-style:solid; border-width: 0px; border-color: #D0D0D0;">BY ME</td></tr>')

				aHTML.push('<tr class="ns1blankspaceControl">' +
								'<td id="ns1blankspaceControl-1" class="ns1blankspaceControl ns1blankspaceMyIssues">' +
								'Recent</td></tr>');

				aHTML.push('<tr class="ns1blankspaceControl">' +
								'<td id="ns1blankspaceControlMyIssuesByStatus" class="ns1blankspaceControl">' +
								'By Status</td></tr>');
						
				aHTML.push('<tr><td>&nbsp;</td></tr>');
										
				aHTML.push('<tr><td class="ns1blankspaceSub" style="font-size:0.875em; border-bottom-style:solid; border-width: 0px; border-color: #D0D0D0;">FOR ME</td></tr>')
		
				aHTML.push('<tr class="ns1blankspaceControl">' +
								'<td id="ns1blankspaceControl-2" class="ns1blankspaceControl ns1blankspaceMyIssues">' +
								'Recent</td></tr>');

				aHTML.push('<tr class="ns1blankspaceControl">' +
								'<td id="ns1blankspaceControlIssuesByStatus" class="ns1blankspaceControl">' +
								'By Status</td></tr>');	
					
				if (ns1blankspace.supportIssue.data.acceptsSupportIssues == true)
				{
					aHTML.push('<tr><td>&nbsp;</td></tr>');	
				
					aHTML.push('<tr><td class="ns1blankspaceSub" style="font-size:0.875em; border-bottom-style:solid; border-width: 0px; border-color: #D0D0D0;">SETUP</td></tr>')

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlStatusList" class="ns1blankspaceControl">' +
									'Status Values</td></tr>');	

					aHTML.push('<tr class="ns1blankspaceControl">' +
									'<td id="ns1blankspaceControlVersionList" class="ns1blankspaceControl">' +
									'Versions</td></tr>');	
				}

				aHTML.push('</table>');	
				
				$('#ns1blankspaceControl').html(aHTML.join(''));

				$('td.ns1blankspaceMyIssues').click(function(event)
				{
					ns1blankspace.supportIssue.data.mode.value = (this.id).split('-').pop();
					ns1blankspace.supportIssue.home({supportIssueStep: 4});
				});

				$('#ns1blankspaceControl-' + ns1blankspace.supportIssue.data.mode.value).addClass("ns1blankspaceHighlight");

				$('#ns1blankspaceControlMyIssuesByStatus').on('click', function()
				{
					oParam.xhtmlElementID = 'ns1blankspaceMostLikely';
					oParam.label = 'My Issues by Status';
					oParam.xhtmlContext = 'IssuesByStatus';
					
					oParam.method = 'SUPPORT_ISSUE_SEARCH';
					oParam.filters =
					[
						{name: 'Status', title: 'Status', values: ns1blankspace.supportIssue.data.statusValues, field: 'status'},
					];

					oParam.customOptions = [{field: 'showmyloggedissues', value: 'Y'}];

					oParam.columns = [
										{title: 'Reference', name: 'Reference', field: 'reference'},
										{title: 'Lodged Date', name: 'LodgedDate', field: 'lodgeddate'},
										{title: 'Status', name: 'Status', field: 'statustext'},
										{title: 'Title', name: 'Title', field: 'title'},
									 ];

					oParam.sortColumn = 'reference';
					oParam.sortDirection = 'desc';
					oParam.functionSearch = ns1blankspace.supportIssue.issuesByStatus.search;
					oParam.functionShow = ns1blankspace.supportIssue.issuesByStatus.show;
					oParam.functionShowRow = ns1blankspace.supportIssue.issuesByStatus.row;
					oParam.functionBind = ns1blankspace.supportIssue.issuesByStatus.bind;
					
					ns1blankspace.supportIssue.data.mode.value = ns1blankspace.supportIssue.data.mode.options.byMe;

					ns1blankspace.show({selector: '#ns1blankspaceMostLikely', refresh: true});
					ns1blankspace.supportIssue.issuesByStatus.show(oParam);
				});

				$('#ns1blankspaceControlIssuesByStatus').on('click', function()
				{
					oParam.xhtmlElementID = 'ns1blankspaceMostLikely';
					oParam.label = 'Issues for Me by Status';
					oParam.xhtmlContext = 'IssuesByStatus';
					
					oParam.method = 'SUPPORT_ISSUE_SEARCH';
					oParam.filters = [
										{name: 'Status', title: 'Status', values: ns1blankspace.supportIssue.data.statusValues, field: 'status'}
									 ];

					oParam.customOptions = [{field: 'showmyloggedissues', value: 'N'}];

					oParam.columns = [
										{title: 'Reference', name: 'Reference', field: 'reference'},
										{title: 'Customer', name: 'Customer', field: 'contactbusinesstext'},
										{title: 'Lodged Date', name: 'LodgedDate', field: 'lodgeddate'},
										{title: 'Status', name: 'Status', field: 'statustext'},
										{title: 'Title', name: 'Title', field: 'title'},
									 ];

					oParam.sortColumn = 'reference';
					oParam.sortDirection = 'desc';
					oParam.functionSearch = ns1blankspace.supportIssue.issuesByStatus.search;
					oParam.functionShow = ns1blankspace.supportIssue.issuesByStatus.show;
					oParam.functionShowRow = ns1blankspace.supportIssue.issuesByStatus.row;
					oParam.functionBind = ns1blankspace.supportIssue.issuesByStatus.bind;
					
					ns1blankspace.supportIssue.data.mode.value = ns1blankspace.supportIssue.data.mode.options.forMe;
					
					ns1blankspace.show({selector: '#ns1blankspaceMostLikely', refresh: true});
					ns1blankspace.supportIssue.issuesByStatus.show(oParam);
				});

				$('#ns1blankspaceControlStatusList').on('click', function()
				{
					ns1blankspace.supportIssue.codes.show(
					{
						type: 'STATUS',
						object: 268,
						fields: [{name: 'customeravailable', label: 'Customer can change?'}] 
					});
				});

				$('#ns1blankspaceControlVersionList').on('click', function()
				{
					ns1blankspace.supportIssue.codes.show(
					{
						type: 'VERSION',
						object: 352,
						showNotes: true 
					});
				});

				oParam.issueHomeStep = 4;
				ns1blankspace.supportIssue.home(oParam);
			}
			else if (oParam.issueHomeStep == 4)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SUPPORT_ISSUE_SEARCH';		
				oSearch.addField('completeddate,contactbusiness,contactbusinesstext,contactperson,contactpersontext,' +
								'description,email,lodgeddate,name,phone,processingtype,processingtypetext,reference,' +
								'severity,severitytext,solution,status,statustext,technicalnotes,title,' +
								'totaltime,type,typetext,user,usercontactemail,usertext');
				
				if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe)
				{
					oSearch.addCustomOption('showmyloggedissues', 'Y');
				}	

				// v2.0.1 Filters out COmpleted & Discontinued
				//oSearch.addFilter('status', 'NOT_IN_LIST', '3.4');

				oSearch.rows = 50;
				oSearch.sort('createddate', 'desc');
				//oSearch.sort(sSortColumn, sSortDirection);
				
				oSearch.getResults(function(data) {ns1blankspace.supportIssue.home(oParam, data)});
			}
		}
		else
		{
			var aHTML = [];
			
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table>' +
								'<tr><td class="ns1blankspaceNothing">' +
				 				(ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe
								? 'Click New to create a support issue.'
								: 'No Support Issues logged.' )+ 
								'</td></tr>' +
								'</table>');
			}
			else
			{
				aHTML.push('<table class="ns1blankspace">');
				aHTML.push('<tr>' + 
								'<td class="ns1blankspaceHeaderCaption ns1blankspaceHeaderSort"' +
									' data-column="reference"' +
									' data-sortdirection="' + ((sSortColumn == "reference") ? ((sSortDirection === 'asc') ? "desc" : "asc") : 'asc') + '"' + 
									'>Reference</td>' +
								'<td class="ns1blankspaceHeaderCaption ns1blankspaceHeaderSort"' +
									' data-column="lodgeddate"' +
									' data-sortdirection="' + ((sSortColumn == "lodgeddate") ? ((sSortDirection === 'asc') ? "desc" : "asc") : 'asc') + '"' +
									'>Date</td>' +
								'<td class="ns1blankspaceHeaderCaption ns1blankspaceHeaderSort"' +
									' data-column="statustext"' +
									' data-sortdirection="' + ((sSortColumn == "statustext") ? ((sSortDirection === 'asc') ? "desc" : "asc") : 'asc') + '"' +
									'>Status</td>' +
								'<td class="ns1blankspaceHeaderCaption ns1blankspaceHeaderSort"' +
									' data-column="title"' +
									' data-sortdirection="' + ((sSortColumn == "title") ? ((sSortDirection === 'asc') ? "desc" : "asc") : 'asc') + '"' +
									'>Title</td>' +
							'</tr>');

				$.each(oResponse.data.rows, function()
				{
					aHTML.push('<tr class="ns1blankspaceRow">');

					aHTML.push('<td id="ns1blankspaceMostLikely_Reference-' + this.id + '" class="ns1blankspaceRow ns1blankspaceMostLikely" style="width:50px;">' +
											this.reference + '</td>');
					
					aHTML.push('<td id="ns1blankspaceMostLikely_Date-' + this.id + '" class="ns1blankspaceRow" style="width:100px;">' +
											ns1blankspace.util.fd(this.lodgeddate) + '</td>');

					aHTML.push('<td id="ns1blankspaceMostLikely_Status-' + this.id + '" class="ns1blankspaceRow" style="width:100px;">' +
											this.statustext + '</td>');

					aHTML.push('<td id="ns1blankspaceMostLikely_Title-' + this.id + '" class="ns1blankspaceRow">' +
											this.title + '</td>');
					
					aHTML.push('</tr>');
				});
				
				aHTML.push('</table>');			
			}
			
			$('#ns1blankspaceMostLikely').html(aHTML.join(''));
		
			$('td.ns1blankspaceMostLikely').click(function(event)
			{
				ns1blankspace.supportIssue.search.send(event.target.id, {source: 1});
			});

			$('.ns1blankspaceHeaderSort')
				.css('cursor', 'pointer')
				.click(function()
				{
					oParam.sortColumn = $(this).attr('data-column');
					oParam.sortDirection = $(this).attr('data-sortdirection');

					ns1blankspace.supportIssue.home(oParam);
				});
		}
	},

	search: 	
	{
		send: 		function (sXHTMLElementID, oParam)
		{
			var aSearch = sXHTMLElementID.split('-');
			var sElementID = aSearch[0];
			var sSearchContext = aSearch[1];
			var iMinimumLength = 0;
			var iSource = ns1blankspace.data.searchSource.text;
			var sSearchText;
			var iMaximumColumns = 1;

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
				oSearch.method = 'SUPPORT_ISSUE_SEARCH';		
				oSearch.addField('completeddate,contactbusiness,contactbusinesstext,contactperson,contactpersontext,' +
								'description,email,lodgeddate,name,phone,processingtype,processingtypetext,reference,' +
								'severity,severitytext,solution,status,statustext,technicalnotes,title,version,versiontext,' +
								'totaltime,type,typetext,user,usercontactemail,usertext,quotedhours,quotedamount,quoteapproved,' +
								'sourcespace,sourcespacetext');

				oSearch.addField(ns1blankspace.option.auditFields);

				oSearch.addField(ns1blankspace.extend.elements());

				if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe)
				{
					oSearch.addCustomOption('showmyloggedissues', 'Y');
				}

				oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
				
				oSearch.getResults(function(data) {ns1blankspace.supportIssue.show(oParam, data)});
			}
			else
			{
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
					oSearch.method = 'SUPPORT_ISSUE_SEARCH';		
					oSearch.addField('completeddate,contactbusiness,contactbusinesstext,contactperson,contactpersontext,' +
									'description,email,lodgeddate,name,phone,processingtype,processingtypetext,reference,' +
									'severity,severitytext,solution,status,statustext,technicalnotes,title,' +
									'totaltime,type,typetext,user,usercontactemail,usertext');
					
					if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe)
					{
						oSearch.addCustomOption('showmyloggedissues', 'Y');
					}	

					oSearch.addBracket('(');
					oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('title', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('description', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addBracket(')');

					ns1blankspace.search.advanced.addFilters(oSearch);

					oSearch.sort('reference', 'desc');
					
					oSearch.getResults(function(data) {ns1blankspace.supportIssue.search.process(oParam, data)});
				}
			};	
		},

		process:	function (oParam, oResponse)
		{
			var iColumn = 0;
			var aHTML = [];
			var	iMaximumColumns = 1;

			ns1blankspace.search.stop();

			if (oResponse.data.rows.length == 0)
			{
				$(ns1blankspace.xhtml.searchContainer).html('<table class="ns1blankspaceSearchMedium"><tr><td class="ns1blankspaceSubNote">Nothing to show</td></tr></table>');
			}
			else
			{	
				aHTML.push('<table class="ns1blankspaceSearchMedium">');
				
				var sClass = '';

				$.each(oResponse.data.rows, function()
				{	
					iColumn = iColumn + 1;

					if (iColumn == 1)
					{
						aHTML.push('<tr class="ns1blankspaceSearch">');
					}
					
					if (this.status == 3 ||  this.status == 4 || this.status == 5)
					{	sClass = " ns1blankspaceInactive";	}

					aHTML.push('<td class="ns1blankspaceSearch' + sClass + '" id="ns1blankspaceSearch-' +
									this.id + '">' +
									this.reference + 
									'</td>');

					aHTML.push('<td class="ns1blankspaceSearch' + sClass + '" id="ns1blankspaceSearch-' +
									this.id + '">' +
									this.title + '</td>');

					aHTML.push('<td class="ns1blankspaceSearch' + sClass + '" id="ns1blankspaceSearch-' +
									this.id + '">' +
									this.statustext + '</td>');

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
					ns1blankspace.supportIssue.search.send(event.target.id, {source: 1});
				});

				ns1blankspace.render.bind(
				{
					columns: 'reference-column-title-column-statustext',
					more: oResponse.moreid,
					rows: 20,
					width: 250,
					functionClass: ns1blankspace.supportIssue.search['class'],
					startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
					functionSearch: ns1blankspace.supportIssue.search.send
				});   
			}	
		},

		"class":		function (oRow)
		{
			var sClass = '';
			
			if (oRow.status = 3 ||  oRow.status == 4 || oRow.status == 5)	
			{
				sClass = ' ns1blankspaceInactive';
			}
			
			return sClass;
		}
	},			

	layout:		function ()
	{
		// v2.0.6 Added Conversations
		var aHTML = [];

		aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
		
		aHTML.push('<table class="ns1blankspaceControl">');
		
		if (ns1blankspace.objectContext == -1)
		{
			aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">' +
							'Details</td></tr>');		
		}
		else
		{
			if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.forMe)
			{
				aHTML.push('<tr><td id="ns1blankspaceControlForMe" class="ns1blankspaceSub" + style="padding-top:0px; padding-bottom: 14px;">' +
								'FOR ME</td></tr>');
			}

			aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
							'Summary</td></tr>');

			aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
							'Details</td></tr>');


			if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.forMe)
			{
				aHTML.push('</table>');

				aHTML.push('<table class="ns1blankspaceControl">');

				aHTML.push('<tr><td id="ns1blankspaceControlSolution" class="ns1blankspaceControl">' +
							'Solution</td></tr>');

				aHTML.push('<tr><td id="ns1blankspaceControlAlert" class="ns1blankspaceControl">' +
							'Alerts</td></tr>');
			}	

			aHTML.push('</table>');

			aHTML.push('<table class="ns1blankspaceControl">');

			aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
							'Attachments</td></tr>');

			aHTML.push('<tr><td id="ns1blankspaceControlActions" class="ns1blankspaceControl">' +
							'Actions</td></tr>');

			aHTML.push('<tr><td id="ns1blankspaceControlConversations" class="ns1blankspaceControl">' +
							'Conversations</td></tr>');
		}	
		
		aHTML.push('</table>');					
					
		$('#ns1blankspaceControl').html(aHTML.join(''));
		
		var aHTML = [];

		aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainSolution" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainAlert" class="ns1blankspaceControlMain"></div>');					
		aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainConversations" class="ns1blankspaceControlMain"></div>');
				
		$('#ns1blankspaceMain').html(aHTML.join(''));

		$('#ns1blankspaceControlSummary').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
			ns1blankspace.supportIssue.summary();
		});
		
		$('#ns1blankspaceControlDetails').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
			ns1blankspace.supportIssue.details();
		});

		$('#ns1blankspaceControlSolution').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainSolution'});
			ns1blankspace.supportIssue.solution();
		});

		$('#ns1blankspaceControlAlert').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainAlert', context: {action: true}}); 
			ns1blankspace.supportIssue.alert.init();
		});

		$('#ns1blankspaceControlAttachments').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
			// v2.0.5 If viewing customer support issues, need to call local attachments function to pick up customer's attachments
			if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.forMe)
			{
				ns1blankspace.supportIssue.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});
			}
			else
			{
				ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});	
			}
		});

		$('#ns1blankspaceControlActions').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainActions', refresh: true});
			ns1blankspace.actions.show({xhtmlElementID: 'ns1blankspaceMainActions', actions: {add: true}});
		});

		$('#ns1blankspaceControlConversations').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainConversations', refresh: true});
			ns1blankspace.messaging.conversation.linkedToObject.search(
			{
				xhtmlElementID: 'ns1blankspaceMainConversations', 
				conversationData:
				{
					object: ns1blankspace.object,
					objectContext: ns1blankspace.objectContext,
					title: "Support Issue " + ns1blankspace.objectContextData.reference,
					description: ns1blankspace.objectContextData.title
				}
			});
		});
	},

	show:		function (oParam, oResponse)
	{
		ns1blankspace.app.clean();
		ns1blankspace.supportIssue.layout();
		
		var aHTML = [];
		
		if (oResponse.data.rows.length == 0)
		{
			ns1blankspace.objectContextData = undefined;
			
			aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this support issue.</td></tr></table>');
					
			$('#ns1blankspaceMain').html(aHTML.join(''));
		}
		else
		{
			ns1blankspace.objectContextData = oResponse.data.rows[0];
		
			$('#ns1blankspaceControlContext').html('<div>' + ns1blankspace.objectContextData.reference + '</div>' +
					'<div class="ns1blankspaceSub">' + ns1blankspace.objectContextData.sourcespacetext + '</div>');

			$('#ns1blankspaceViewControlAction').button({disabled: false});
			$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
			
			ns1blankspace.history.view(
			{
				newDestination: 'ns1blankspace.supportIssue.init({id: ' + ns1blankspace.objectContext + ', mode: ' + ns1blankspace.supportIssue.data.mode.value + '})',
				move: false
			});
			
			ns1blankspace.history.control({functionDefault: 'ns1blankspace.supportIssue.summary()'});

			ns1blankspace.util.onComplete(oParam);
		}	
	},	

	codes:
	{
		search: function(oParam)
		{
			oParam = oParam || {};
			var aFields = ns1blankspace.util.getParam(oParam, "fields").value;
			var sType = ns1blankspace.util.getParam(oParam, "type", {"default": "STATUS", set: true}).value;

			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_SUPPORT_ISSUE_' + sType + '_SEARCH';
			oSearch.addField('title' + (oParam.showNotes == true ? ',notes' : ''));
			if (aFields)
			{
				oSearch.addField($.map(aFields, function(x) {return x.name}).join(','));
			}
			//oSearch.addField(ns1blankspace.extend.elements({object: oParam.object}));
			oSearch.rows = 50;
			oSearch.getResults(function(oResponse)
			{
				if (oResponse.status == 'OK')
				{
					oParam.response = oResponse;
					if (oParam.onComplete)
					{
						ns1blankspace.util.onComplete(oParam);
					}
				}
			});
		},

		show: function(oParam)
		{
			var aHTML = [];
			var sType = ns1blankspace.util.getParam(oParam, "type", {"default": "STATUS", set: true}).value;
			var iObject = ns1blankspace.util.getParam(oParam, "object", {"default": 268, set: true}).value;
			var sSortColumn = ns1blankspace.util.getParam(oParam, "sortColumn", {"default": "title", set: true}).value;;
			var sSortDirection = ns1blankspace.util.getParam(oParam, "sortDirection", {"default": "asc", set: true}).value;
			var oResponse = ns1blankspace.util.getParam(oParam, "response").value;
			var aColumns = [{name: 'title', label: sType.substr(0,1).toUpperCase() + sType.substr(1).toLowerCase()}];
			var fOnComplete = ns1blankspace.util.getParam(oParam, "onComplete", {"default": ns1blankspace.supportIssue.codes.show, set: true}).value;
			var bShowNotes = ns1blankspace.util.getParam(oParam, "showNotes").value;
			var aFields = ns1blankspace.util.getParam(oParam, "fields").value;

			if (bShowNotes) {aColumns.push({name: 'notes', label: 'Notes'})}

			if (oResponse)
			{
				ns1blankspace.supportIssue.data[sType] = oResponse.data.rows;

				// Get labels of any structure elements 
				/*$.each($.grep(ns1blankspace.extend.structure, function(x) {return x.object == iObject}), function(i, structure)
				{
					$.each(structure.elements, function()
					{
						aColumns.push({name: this.alias.toLowerCase(), label: this.caption});
					});
				});*/

				if (aFields)
				{
					aColumns = aColumns.concat(aFields);
				}

				oParam.columns = aColumns;

				aHTML.push('<table id="ns1blankspaceCode" class="ns1blankspace">');
				
				aHTML.push('<tr class="ns1blankspaceCaption">');

				// Add in the column headers with sorting if applicable
				$.each(aColumns, function()
				{
					aHTML.push('<td class="ns1blankspaceHeaderCaption' + ((sSortColumn != '') ? ' ns1blankspaceHeaderSort' : '') + '"' +
								' style="color:#B8B8B8; padding:4px; vertical-align:top;"' +
								' data-column="' + this.name + '"' +
								' data-sortdirection="' + ((sSortColumn == this.label) ? sSortDirection : 'asc') + '">' +
									this.label + 
								'</td>');
				});

				aHTML.push('<td class="ns1blankspaceHeaderCaption"><span id="ns1blankspaceSupportIssueCodeAdd"></span></td>');

				aHTML.push('</tr>');

				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<tr><td colspan="' + (aColumns.length + 1) + '" class="ns1blankspaceNothing">No records</td></tr>');
					aHTML.push('</table>');

					$('#ns1blankspaceMostLikely').html(aHTML.join(''));
					oParam.xhtmlContext = 'Code';
					ns1blankspace.supportIssue.codes.bind(oParam);
				}
				else
				{
					$.each(oResponse.data.rows, function() 	
					{
						aHTML.push(ns1blankspace.supportIssue.codes.row(this, oParam));
					});
					
					aHTML.push('</table>');

					$.extend(oParam,
					{
						xhtmlElementID: 'ns1blankspaceMostLikely',
						xhtmlContext: 'Code',
						xhtml: aHTML.join(''),
						showMore: (oResponse.morerows == 'true'),
						more: oResponse.moreid,
						rows: 20,
						functionShowRow: ns1blankspace.supportIssue.codes.row,
						functionOnNewPage: ns1blankspace.supportIssue.codes.newPage
					}); 	
					ns1blankspace.render.page.show(oParam);
				}
			}
			else
			{
				ns1blankspace.supportIssue.codes.search(oParam);
			}
		},

		row: function(row, oParam)
		{
			var aHTML = [];

			aHTML.push('<tr id="ns1blankspaceCodeRow-' + row.id + '">');

			// v2.0.8 Added formatXHTML and now hides notes if specified (so can show only partially)
			$.each(oParam.columns, function()
			{
				aHTML.push('<td class="ns1blankspaceRow" id="ns1blankspaceCode_title-' + row.id + '"' +
								(this.name == 'notes' 
									? '><div class="ns1blankspaceCodeNotes" style="display:none; overflow:hidden;">' 
									: '>') +
								row[this.name].formatXHTML().replace(/\r?\n|\r/g, "<br />") +
								(this.name == 'notes' ? '</div>': '') +
							'</td>')
			});
			
			aHTML.push('</tr>');

			return aHTML.join('');
		},

		bind: function(oParam)
		{
			var oContainer = $('.ns1blankspaceRenderPage_' + oParam.xhtmlContext).is('*')
								? $('.ns1blankspaceRenderPage_' + oParam.xhtmlContext + ':visible').first()
								: document;

			// When user clicks on the row, show edit box
			$('#' + $(oContainer).attr('id') + ' td.ns1blankspaceRow')
				.css('cursor', 'pointer')
				.on('click', function()
				{
					oParam.xhtmlElement = this;
					oParam.mode = 'edit';
					ns1blankspace.supportIssue.codes.edit(oParam);
				});

			$('#ns1blankspaceSupportIssueCodeAdd', oContainer)
				.button({
					icons: {primary: 'ui-icon-plus'}
				})
				.css('height', '25px')
				.css('width', '28px')
				.off('click')
				.on('click', function()
				{
					oParam.xhtmlElement = $(this).parent();
					oParam.mode = 'add';
					ns1blankspace.supportIssue.codes.edit(oParam);
				});
		},

		newPage: function(oParam)
		{	// Show that part of the notes that is up to the height of the rest of the row

			$.each($('.ns1blankspaceRenderPage:visible .ns1blankspaceCodeNotes'), function()
			{
				$(this)
					.height($(this).parent().height() - 1)
					.css('display','block');
			});

			ns1blankspace.supportIssue.codes.bind(oParam);
		},

		edit: function(oParam)
		{
			var oAppendElement = $(oParam.xhtmlElement).parent();
			var iMode = (oParam.mode == 'add') ? 1 : 2;
			var bContinue = true;
			var iCodeID = (iMode == 2 && $(oParam.xhtmlElement).attr('id').split('-').length > 1) 
							? $(oParam.xhtmlElement).attr('id').split('-').pop() 
							: undefined;
			var aColumns = oParam.columns || [];

			// Determine if we need to create the edit container
			if ($('#ns1blankspaceManage' + oParam.xhtmlContext).is('*'))
			{
				if ($('#ns1blankspaceManage' + oParam.xhtmlContext).attr('data-id') == undefined)
				{	
					if (iMode == 2)
					{	// We were adding and now we've decided to view an existing one
						bContinue = false; 		// Has to be false otherwise it falls through to next step before user has responded.
						ns1blankspace.container.confirm({
							html: 'You are currently part-way through adding a new record. Do you want to discard this record or keep editing it?',
							title: 'Just checking...',
							buttons:
							[
								{
									label: 'Discard',
									text: 'Discard',
									icons: {primary: 'ui-icon-check'},
									click: function()
									{
										bContinue = false;
										$('#ns1blankspaceManage' + oParam.xhtmlContext).remove();
										$(this).dialog('destroy');
										ns1blankspace.supportIssue.codes.edit(oParam);
									}
								},
								{
									label: 'Keep editing',
									text: 'Keep editing',
									icons: {primary: 'ui-icon-close'},
									click: function()
									{
										bContinue = false;
										$(this).dialog('destroy');
									}
								}
							]
						});
					}
					else if (iMode == 1) 
					{	// We were adding and now have clicked Add again (as a toggle) - remove the row (essentially cancel)
						$('#ns1blankspaceManage' + oParam.xhtmlContext).remove();
					}
				}
				else 
				{	// User has clicked back on an editable row - remove and render new one if applicable
					if (iMode == 1) {bContinue = true}
					else {bContinue = ($('#ns1blankspaceManage' + oParam.xhtmlContext).attr('data-id') != iCodeID)}
					$('#ns1blankspaceManage' + oParam.xhtmlContext).remove();
				}
			}


			// Now render the edit page
			if (bContinue)
			{
				var aHTML = [];

				aHTML.push('<tr id="ns1blankspaceManage' + oParam.xhtmlContext + '"' +
								(iCodeID ? ' data-id="' + iCodeID + '"' : '') + '>' +
											'<td id="ns1blankspaceManage' + oParam.xhtmlContext + 'Container"' +
											' colspan="' + $(oAppendElement).children().length + '">' +
											'<div style="background-color: #F3F3F3; padding:5px; margin-bottom:12px; border: 1px solid #D0D0D0">');

				aHTML.push('<table class="ns1blankspaceContainer"><tr class="ns1blankspaceContainer">');

				aHTML.push('<td id="ns1blankspaceManageCodesRow1" class="ns1blankspaceColumn1" style="width:80%;"></td></tr>' +
							'<tr><td id="ns1blankspaceManageCodesRow2" class="ns1blankspaceColumn1"></td>' +
							'</tr>');

				aHTML.push('</table>');
				aHTML.push('</div></td></tr>');

				$(oAppendElement).after(aHTML.join(''));

				// Row 1 contains the header & the Save button
				aHTML = [];

				aHTML.push('<table class="ns1blankspace"><tr>');
				aHTML.push('<td class="ns1blankspaceHeaderCaption"><strong>Code Values</strong></td>');
				aHTML.push('<td style="text-align: right;" class="ns1blankspaceHeaderCaption">' +
								'<span id="ns1blankspaceManageCodesSave" class="ns1blankspaceAction"' +
								((iCodeID) ? ' data-id="' + iCodeID + '"' : '') +
								'>&nbsp;</span>');
				aHTML.push('</td></tr></table>');

				$('#ns1blankspaceManageCodesRow1').html(aHTML.join(''));

				// Row 2 contains input fields
				aHTML = [];

				aHTML.push('<table class="ns1blankspace">');

				$.each(aColumns, function()
				{
					var sInputType = this.type || 'Text';
					aHTML.push('<tr>' +
									'<td class="ns1blankspaceCaption">' + this.label + '</td>' +
								'</tr><tr><td class="ns1blankspaceText">');
					if (oParam.showNotes == true && this.name == 'notes')
					{
						aHTML.push('<textarea class="ns1blankspaceTextMulti" id="ns1blankspaceManageCodes' + this.name + '"' +
									' rows="10" cols="35" style="width:100%;"></textarea>');
					}
					else
					{
						aHTML.push('<input class="ns1blankspaceText" id="ns1blankspaceManageCodes' + this.name + '">');
					}

					aHTML.push('</td></tr>');
				});
				aHTML.push('</table>');

				$('#ns1blankspaceManageCodesRow2').html(aHTML.join(''));

				if (iCodeID)
				{
					var oRow = $.grep(ns1blankspace.supportIssue.data[oParam.type], function(x) {return x.id == iCodeID}).shift();
					$.each(aColumns, function()
					{
						$('#ns1blankspaceManageCodes' + this.name).val(oRow[this.name].formatXHTML());
					});
				}

				if (ns1blankspace.user.systemAdmin)
				{
					$('#ns1blankspaceManageCodesSave')
						.button(
						{
							label: 'Save',
							icons: {primary: 'ui-icon-disk'}
						})
						.click(function(event) 
						{
							$.extend(true, oParam,
							{
								onComplete: ns1blankspace.supportIssue.codes.show, 
								refresh: true, 
								id: $(this).attr('data-id')
							});
							ns1blankspace.supportIssue.codes.save(oParam);
						});
				}
				else
				{
					$('#ns1blankspaceManage' + oParam.xhtmlContext + ' input').attr('disabled', true).addClass('ns1blankspaceDisabled');
				}

			}			
		},

		save: function(oParam)
		{
			var oData = {};
			var aColumns = oParam.columns || [];

			if (oParam.id) {oData.id = oParam.id}

			$.each(aColumns, function()
			{
				oData[this.name] = $('#ns1blankspaceManageCodes' + this.name).val();
			});

			if (Object.keys(oData).length > 1)
			{
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('SETUP_SUPPORT_ISSUE_' + oParam.type + '_MANAGE'),
					data: oData,
					success: function(oResponse)
					{
						if (oResponse.status == 'OK')
						{
							ns1blankspace.inputDetected = false;
							if (oParam.onComplete)
							{
								ns1blankspace.util.onComplete(oParam);
							}
						}
						else
						{
							ns1blankspace.status.error('Unable to save ' + oParam.type.toLowerCase() + ': ' + oResponse.error.errornotes);
						}
					}
				});
				ns1blankspace.inputDetected = false;
			}
		}
	},

	summary:	function ()
	{
		var aHTML = [];
		
		if (ns1blankspace.objectContextData == undefined)
		{
			aHTML.push('<table><tr><td valign="top">Sorry can\'t find this Support Issue.</td></tr></table>');
					
			$('#ns1blankspaceMain').html(aHTML.join(''));
		}
		else
		{
			aHTML.push('<table class="ns1blankspaceMain">' +
						'<tr class="ns1blankspaceRow">' +
						'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Large"></td>' +
						'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:150px;"></td>' +
						'</tr>' +
						'</table>');				
			
			$('#ns1blankspaceMainSummary').html(aHTML.join(''));

			aHTML = [];

			aHTML.push('<table class="ns1blankspace">');
			
			if (ns1blankspace.objectContextData.subject != '')
			{
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Date Lodged</td></tr>' +
								'<tr><td id="ns1blankspaceSummaryDateCreated" class="ns1blankspaceSummary">' +
								ns1blankspace.objectContextData.createddate +
								'</td></tr>');

				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Status</td></tr>' +
								'<tr><td id="ns1blankspaceSummaryStatus" class="ns1blankspaceSummary">' +
								ns1blankspace.objectContextData.statustext +
								'</td></tr>');

				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Subject</td></tr>' +
								'<tr><td id="ns1blankspaceSummarySubject" class="ns1blankspaceSummary">' +
								ns1blankspace.objectContextData.title.formatXHTML() +
								'</td></tr>');	

				if (ns1blankspace.objectContextData.description != '')
				{
					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Description</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary">' +
									ns1blankspace.objectContextData.description.replace(/\r?\n|\r/g, "<br />").formatXHTML() +
									'</td></tr>');
				}											

				if (ns1blankspace.objectContextData.solution != '')
				{
					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Solution</td></tr>' +
									'<tr><td id="ns1blankspaceSummarySolution" class="ns1blankspaceSummary">' +
									ns1blankspace.objectContextData.solution.replace(/\r?\n|\r/g, "<br />").formatXHTML() +
									'</td></tr>');
				}		
			}

			aHTML.push('</table>');								

			$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

			aHTML = [];

			// Column 2 needs buttons to Reopen when Completed, plus change Status to each value that the user is permitted to change it to
			// Only required when data.mode.value = byMe and existing record
			if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe
					&& ns1blankspace.objectContext != -1)
			{
				aHTML.push('<table class="ns1blankspace"');
				
				if (ns1blankspace.objectContextData.status == ns1blankspace.supportIssue.data.status.completed)
				{
					aHTML.push('<tr><td>' +
									'<span id="ns1blankspaceSummary-' + ns1blankspace.supportIssue.data.status.notAssigned + '"' +
										' class="ns1blankspaceAction ns1blankspaceChangeStatus"' +
										' data-status="' + ns1blankspace.supportIssue.data.status.notAssigned +'">Reopen' +
								'</span></td></tr>');

					aHTML.push('<tr><td>&nbsp;</td></tr>');
				}

				if (ns1blankspace.supportIssue.data.statusValues != undefined)
				{
					var aUpdateStatus = $.grep(ns1blankspace.supportIssue.data.statusValues, function(x) 
											{return x.customeravailable == 'Y' && x.id != ns1blankspace.objectContextData.status});
					if (aUpdateStatus.length > 0)
					{
						aHTML.push('<tr><td class="ns1blankspaceCaption" style="font-size:0.825em;">Change Status to...</td></tr>');
						
						$.each(aUpdateStatus, function()
						{
							aHTML.push('<tr><td><span id="ns1blankspaceSummary" class="ns1blankspaceAction ns1blankspaceChangeStatus"' +
											' data-status="' + this.id +'">' + this.title.formatXHTML() + 
										'</span></td></tr>');
						});
					}
				}

				aHTML.push('</table>');
			}

			// If Customer issue, then allow user to send to another advisor
			if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.forMe
					&& ns1blankspace.objectContext != -1)
			{
				aHTML.push('<table class="ns1blankspace"');
				
				aHTML.push('<tr><td>' +
								'<span id="ns1blankspaceSummary-' + ns1blankspace.supportIssue.data.status.notAssigned + '"' +
									' class="ns1blankspaceAction ns1blankspaceForward">Send to another Advisor' +
							'</span></td></tr>');

				aHTML.push('<tr><td>&nbsp;</td></tr>');
			}

			$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));

			$('.ns1blankspaceChangeStatus')
				.button()
				.css('font-size', '0.75em')
				.css('width', '100%')
				.on('click', function()
				{
					ns1blankspace.supportIssue.save.send({status: $(this).attr('data-status')});
				});

			$('.ns1blankspaceForward')
				.button()
				.css('font-size', '0.75em')
				.css('width', '100%')
				.on('click', function()
				{
					ns1blankspace.supportIssue.forward();
				});
		}	
	},

	details: 	function ()
	{
		var aHTML = [];

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
							'Subject' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsTitle" class="ns1blankspaceText" data-column="title">' +
							'</td></tr>');	

			if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe)
			{
				aHTML.push('<tr class="ns1blankspaceCaption">' +
								'<td class="ns1blankspaceCaption">' +
								'Sen' + (ns1blankspace.objectContext == -1 ? 'd' : 't') + ' To' +
								'</td></tr>' +
								'<tr class="ns1blankspace">' +
								'<td id="ns1blankspaceDetailsUser" class="ns1blankspaceRadio">' +
								ns1blankspace.xhtml.loadingSmall +
								'</td></tr>');	
			}
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Description' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<textarea id="ns1blankspaceDetailsDescription" data-column="description"' +
								' style="width: 100%;" rows="10" cols="35" class="ns1blankspaceTextMulti"></textarea>' +
							'</td></tr>');

			// Now add structure elements to be updated here
			$.each(ns1blankspace.supportIssue.data.extendElements, function()
			{
				aHTML.push('<tr class="ns1blankspaceCaption">' +
								'<td class="ns1blankspaceCaption">' +
								this.title +
								'</td></tr>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceText">' +
								'<' + (this.datatype == '1' ? 'textarea rows="5" cols="35" style="width:100%;"' : 'input') + 
									' id="ns1blankspaceDetails' + this.alias + '"' +
									' class="ns1blankspace' +
										(this.datatype == '2' 
											? 'Select' 
											: (this.datatype == '3' 
												? 'Date' 
												: (this.datatype == '1' 
													? 'TextMulti' 
													: 'Text'))) + '"' +
									' data-column="' + this.alias + '"' +
									(this.datatype == '2' 
										? ' data-method="SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH"' +
										  ' data-methodFilter="title-TEXT_IS_LIKE|element-EQUAL_TO-' + this.id + '"'
										: '') +
									'>' +
									(this.datatype == '1' ? '</textarea>' : '') +
								'</td></tr>');	
			});

			if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.forMe)
			{
				if (ns1blankspace.objectContext == -1)
				{
					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Space' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceSelect">' +
									'<input class="ns1blankspaceSelect" id="ns1blankspaceDetailsSourceSpace"' +
										' data-method="CORE_SPACE_SEARCH"' +
										' data-methodFilter="spacetext-TEXT_IS_LIKE"' +
										' data-columns="spacetext"' + 
										' data-column="contactbusiness">' +
									'</td></tr>');	

				}

				aHTML.push('<tr class="ns1blankspaceCaption">' +
								'<td class="ns1blankspaceCaption">' +
								'Business' +
								'</td></tr>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceSelect">' +
								'<input class="ns1blankspaceSelect" id="ns1blankspaceDetailsCustomerBusiness"' +
									' data-method="CONTACT_BUSINESS_SEARCH"' +
									' data-methodFilter="tradename-TEXT_IS_LIKE|legalname-TEXT_IS_LIKE"' +
									' data-columns="tradename"' + 
									' data-column="contactbusiness">' +
								'</td></tr>');	

				aHTML.push('<tr class="ns1blankspaceCaption">' +
								'<td class="ns1blankspaceCaption">' +
								'Contact' +
								'</td></tr>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceSelect">' +
								'<input class="ns1blankspaceSelect" id="ns1blankspaceDetailsCustomerPerson"' +
									' data-parent="ns1blankspaceDetailsCustomerBusiness"' + 
									' data-parent-search-id="contactbusiness"' +
									' data-method="CONTACT_PERSON_SEARCH"' +
									' data-methodFilter="firstname-TEXT_IS_LIKE|surname-TEXT_IS_LIKE"' +
									' data-columns="firstname-space-surname"' +
									' data-column="contactperson">' +
								'</td></tr>');	
			}
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Contact Name' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsName" class="ns1blankspaceText" data-column="name">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Email' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsEmail" class="ns1blankspaceText" data-column="email">' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Phone' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsPhone" class="ns1blankspaceText" data-column="phone">' +
							'</td></tr>');	

			aHTML.push('</table>');					

			$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));

			ns1blankspace.supportIssue.getUsers();

			var aHTML = [];
			
			aHTML.push('<table class="ns1blankspaceMain">');

			aHTML.push('<tr><td class="ns1blankspaceCaption">' +
							'Type' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioType1" name="radioType" data-column="type" value="1"/>' + ns1blankspace.supportIssue.data.type.label1 +
							'<br /><input type="radio" id="radioType2" name="radioType" data-column="type" value="2"/>' + ns1blankspace.supportIssue.data.type.label2 +
							'<br /><input type="radio" id="radioType3" name="radioType" data-column="type" value="3"/>' + ns1blankspace.supportIssue.data.type.label3 +
							'</td></tr>');

			aHTML.push('<tr><td class="ns1blankspaceCaption">' +
							'Severity' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioSeverity0" name="radioSeverity" value="0"/>Critical' +
							'<br /><input type="radio" id="radioSeverity1" name="radioSeverity" data-column="severity" value="1"/>Urgent' +
							'<br /><input type="radio" id="radioSeverity2" name="radioSeverity" data-column="severity" value="2"/>Routine' +
							'<br /><input type="radio" id="radioSeverity3" name="radioSeverity" data-column="severity" value="3"/>Non-Critical' +
							'<br /><input type="radio" id="radioSeverity4" name="radioSeverity" data-column="severity" value="4"/>Not Sure' +
							'</td></tr>');

			if (ns1blankspace.objectContext != -1)
			{
				aHTML.push('<tr class="ns1blankspaceCaption">' +
								'<td class="ns1blankspaceCaption">' +
								'Status' +
								'</td></tr>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceText">' +
								'<input id="ns1blankspaceDetailsStatus" class="ns1blankspaceSelect" data-column="status"' +
									' data-method="SETUP_SUPPORT_ISSUE_STATUS_SEARCH"' +
									(ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe
									? ' data-methodFilter="customeravailable-EQUAL_TO-Y"'
									: '') + 
									'>' +
								'</td></tr>');	

				aHTML.push('<tr><td class="ns1blankspaceCaption">' +
								'Quoted Hours' +
								'</td></tr>' +
								'<tr><td class="ns1blankspaceText">' +
								'<input class="ns1blankspaceText ns1blankspaceDisabledIfByMe" id="ns1blankspaceDetailsQuotedHours" data-column="quotedhours">' +
								'</td></tr>');

				aHTML.push('<tr><td class="ns1blankspaceCaption">' +
								'Quoted Amount' +
								'</td></tr>' +
								'<tr><td class="ns1blankspaceText">' +
								'<input class="ns1blankspaceText ns1blankspaceDisabledIfByMe" id="ns1blankspaceDetailsQuotedAmount" data-column="quotedamount">' +
								'</td></tr>');

				aHTML.push('<tr><td class="ns1blankspaceCaption">' +
								'Quote Approved?' +
								'</td></tr>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceRadio">' +
								'<input type="radio" id="radioApprovedY" name="radioApproved" data-column="quoteapproved" value="Y"/>Yes' +
								'&nbsp;&nbsp;<input type="radio" id="radioApprovedN" name="radioApproved" data-column="quoteapproved" value="N"/>No' +
								'</td></tr>');

				aHTML.push('<tr class="ns1blankspaceCaption">' +
								'<td class="ns1blankspaceCaption">' +
								'Version' +
								'</td></tr>' +
								'<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceText">' +
								'<input id="ns1blankspaceDetailsVersionNumber" class="ns1blankspaceSelect ns1blankspaceDisabledIfByMe"' +
									' data-method="SETUP_SUPPORT_ISSUE_VERSION_SEARCH" data-column="version">' +
								'</td></tr>');	
			}

			aHTML.push('</table>');					

			$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

			$('.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy'});

			if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe)
			{
				$('.ns1blankspaceDisabledIfByMe').attr('disabled', true).addClass('ns1blankspaceDisabled');
				if (ns1blankspace.objectContextData && ns1blankspace.objectContextData.status == ns1blankspace.supportIssue.data.status.completed)
				{
					$('#ns1blankspaceMainDetails input,textarea').attr('disabled', true).addClass('ns1blankspaceDisabled');
				}
			}

			$('[name="radioType"]').each(function(i, element)
			{
				ns1blankspace.supportIssue.toolTip(element, {column: 'type'});
			});

			$('[name="radioSeverity"]').each(function(i, element)
			{
				ns1blankspace.supportIssue.toolTip(element, {column: 'severity'});
			});

			if (ns1blankspace.objectContextData != undefined)
			{	
				$('#ns1blankspaceDetailsTitle').val(ns1blankspace.objectContextData.title.formatXHTML());
				$('#ns1blankspaceDetailsDescription').val(ns1blankspace.objectContextData.description.formatXHTML());
				$('#ns1blankspaceDetailsName').val(ns1blankspace.objectContextData.name.formatXHTML());
				$('#ns1blankspaceDetailsSourceSpace').val(ns1blankspace.objectContextData.sourcespacetext.formatXHTML());
				$('#ns1blankspaceDetailsSourceSpace').attr('data-id', ns1blankspace.objectContextData.sourcespace.formatXHTML());
				$('#ns1blankspaceDetailsCustomerBusiness').val(ns1blankspace.objectContextData.contactbusinesstext.formatXHTML());
				$('#ns1blankspaceDetailsCustomerBusiness').attr('data-id', ns1blankspace.objectContextData.contactbusiness.formatXHTML());
				$('#ns1blankspaceDetailsCustomerPerson').val(ns1blankspace.objectContextData.contactpersontext.formatXHTML());
				$('#ns1blankspaceDetailsCustomerPerson').attr('data-id', ns1blankspace.objectContextData.contactperson.formatXHTML());
				$('#ns1blankspaceDetailsEmail').val(ns1blankspace.objectContextData.email.formatXHTML());
				$('#ns1blankspaceDetailsPhone').val(ns1blankspace.objectContextData.phone.formatXHTML());
				$('#ns1blankspaceDetailsStatus').val(ns1blankspace.objectContextData.statustext.formatXHTML());
				$('#ns1blankspaceDetailsStatus').attr('data-id', ns1blankspace.objectContextData.status.formatXHTML());
				$('#ns1blankspaceDetailsQuotedHours').val(ns1blankspace.objectContextData.quotedhours.formatXHTML());
				$('#ns1blankspaceDetailsQuotedAmount').val(ns1blankspace.objectContextData.quotedamount.formatXHTML());
				$('#ns1blankspaceDetailsVersionNumber').val(ns1blankspace.objectContextData.versiontext.formatXHTML());
				$('#ns1blankspaceDetailsVersionNumber').attr('data-id', ns1blankspace.objectContextData.version.formatXHTML());

				$('[name="radioType"][value="' + ns1blankspace.objectContextData.type + '"]').attr('checked', true);
				$('[name="radioSeverity"][value="' + ns1blankspace.objectContextData.severity + '"]').attr('checked', true);
				$('[name="radioUser"][value="' + ns1blankspace.objectContextData.user + '"]').attr('checked', true);
				$('[name="radioApproved"][value="' + ns1blankspace.objectContextData.quoteapproved + '"]').attr('checked', true);

				$.each(ns1blankspace.supportIssue.data.extendElements, function()
				{
					if (this.datatype == '2')
					{
						$('#ns1blankspaceDetails' + this.alias).attr('data-id', ns1blankspace.objectContextData[this.alias.toLowerCase()]);
						$('#ns1blankspaceDetails' + this.alias).val(ns1blankspace.objectContextData[this.alias.toLowerCase() + 'text']);
					}
					else
					{
						$('#ns1blankspaceDetails' + this.alias).val(ns1blankspace.objectContextData[this.alias.toLowerCase()]);
					}
				});
			}
			else
			{
				$('[name="radioType"][value="' + (ns1blankspace.supportIssue.data.defaultType ? ns1blankspace.supportIssue.data.defaultType : '1') + '"]').attr('checked', true);
				$('[name="radioSeverity"][value="' + (ns1blankspace.supportIssue.data.defaultSeverity ? ns1blankspace.supportIssue.data.defaultSeverity : '0') + '"]').attr('checked', true);
				if (ns1blankspace.supportIssue.data.defaultUser)
				{
					$('[name="radioUser"][value="' + ns1blankspace.supportIssue.data.defaultUser + '"]').attr('checked', true);
				}
				else
				{
					$('[name="radioUser"]').first().attr('checked', true);
				}

				if (ns1blankspace.supportIssue.data.title)
				{
					$('#ns1blankspaceDetailsTitle').val(ns1blankspace.supportIssue.data.title.formatXHTML());
				}
				if (ns1blankspace.supportIssue.data.description)
				{
					$('#ns1blankspaceDetailsDescription').val(ns1blankspace.supportIssue.data.description.formatXHTML());
				}

				ns1blankspace.supportIssue.getContact();
			}

		}	
	},

	toolTip: function(element, oParam)
	{
		var sColumn = ns1blankspace.util.getParam(oParam, 'column').value;

		$(element).hover(
			function()
			{
				if (ns1blankspace.supportIssue.data[sColumn].toolTip[$(element).val()] != '')
				{		
					$('#ns1blankspaceToolTip')
						.html(ns1blankspace.supportIssue.data[sColumn].toolTip[$(element).val()])
						.show(ns1blankspace.option.showSpeedOptions)
						.offset({ top: $(element).offset().top, 
							left: ($(element).offset().left-10) - $('#ns1blankspaceToolTip').width()});
				}
				else
				{
					$('#ns1blankspaceToolTip').hide(ns1blankspace.option.hideSpeedOptions).html('');
				}
			},
			function()
			{
				$('#ns1blankspaceToolTip').hide(ns1blankspace.option.hideSpeedOptions).html('');
			}
		);
	},

	solution: 	function ()
	{
		var aHTML = [];

		if ($('#ns1blankspaceMainSolution').attr('data-loading') == '1')
		{
			$('#ns1blankspaceMainSolution').attr('data-loading', '');
			
			aHTML.push('<table class="ns1blankspaceContainer">' +
							'<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceSolutionColumn1" class="ns1blankspaceColumn1"></td>' +
							'<td id="ns1blankspaceSolutionColumn2" class="ns1blankspaceColumn2"></td>' +
							'</tr>' + 
							'</table>');					
			
			$('#ns1blankspaceMainSolution').html(aHTML.join(''));
			
			var aHTML = [];
			
			aHTML.push('<table class="ns1blankspace">');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Solution (shared with user)' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<textarea id="ns1blankspaceSolutionSolution" style="width: 100%;" rows="10" cols="35" class="ns1blankspaceTextMulti"></textarea>' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Internal technical notes' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<textarea id="ns1blankspaceSolutionTechnicalNotes" style="width: 100%;" rows="10" cols="35" class="ns1blankspaceTextMulti"></textarea>' +
							'</td></tr>');	

			aHTML.push('</table>');					

			$('#ns1blankspaceSolutionColumn1').html(aHTML.join(''));

			var aHTML = [];
			
			aHTML.push('<table class="ns1blankspaceMain">');

			aHTML.push('<tr><td class="ns1blankspaceCaption">' +
							'Processing Type' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioProcessingType5" name="radioProcessingType" value="5"/>Not sure' +
							'<br /><input type="radio" id="radioProcessingType2" name="radioProcessingType" value="2"/>Internet issue' +
							'<br /><input type="radio" id="radioProcessingType3" name="radioProcessingType" value="3"/>Fault' +
							'<br /><input type="radio" id="radioProcessingType3" name="radioProcessingType" value="4"/>Suggestion' +
							'</td></tr>')

			aHTML.push('</table>');					

			$('#ns1blankspaceSolutionColumn2').html(aHTML.join(''));

			if (ns1blankspace.objectContextData != undefined)
			{
				$('#ns1blankspaceSolutionSolution').val(ns1blankspace.objectContextData.solution.formatXHTML());
				$('#ns1blankspaceSolutionTechnicalNotes').val(ns1blankspace.objectContextData.technicalnotes.formatXHTML());
				$('[name="radioProcessingType"][value="' + ns1blankspace.objectContextData.processingtype + '"]').attr('checked', true);
			}
			else
			{
				$('[name="radioProcessingType"][value="5"]').attr('checked', true);
			}
		}	
	},

	attachments:
	{
		show: function (oParam)
		{
			var sXHTMLElementID = 'ns1blankspaceMainAttachments';
			var iObject = ns1blankspace.object;
			var iObjectContext = ns1blankspace.objectContext;
			var bShowAdd = true;
			var iAttachmentType;
			var oActions = {add: true};
			var sHelpNotes;
			var oContext = {inContext: false};

			var sSortBy = ns1blankspace.util.getParam(oParam, 'sortBy', {"default": 'supportissue.attachment.filename'}).value;
			var sSortDirection = ns1blankspace.util.getParam(oParam, 'sortDirection', {"default": 'asc'}).value;
			
			if (oParam != undefined)
			{
				if (oParam.object != undefined) {iObject = oParam.object}
				if (oParam.objectContext != undefined) {iObjectContext = oParam.objectContext}
				if (oParam.objectName != undefined) {sObjectName = oParam.objectName}
				if (oParam.showAdd != undefined) {bShowAdd = oParam.showAdd}
				if (oParam.attachmentType != undefined ) {iAttachmentType = oParam.attachmentType}
				if (oParam.xhtmlElementID != undefined ) {sXHTMLElementID = oParam.xhtmlElementID}
				if (oParam.actions != undefined) {oActions = oParam.actions}
				if (oParam.helpNotes != undefined) {sHelpNotes = oParam.helpNotes}
				if (oParam.context != undefined) {oContext = oParam.context}
			}
			
			if (oActions.add)
			{
				if (ns1blankspace.app.context) {ns1blankspace.app.context(oContext)};

				var aHTML = [];
							
				aHTML.push('<table>' +
							'<tr>' +
							'<td id="ns1blankspaceAttachmentsColumn1" class="ns1blankspaceColumn1Flexible">' +
							ns1blankspace.xhtml.loading + '</td>' +
							'<td id="ns1blankspaceAttachmentsColumn2" class="ns1blankspaceColumn2" style="width:100px;"></td></tr>' +
							'</table>');					
					
				$('#' + sXHTMLElementID).html(aHTML.join(''));

				oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', 'ns1blankspaceAttachmentsColumn1');
				
				var aHTML = [];
				
				aHTML.push('<table class="ns1blankspaceColumn2">');
				
				aHTML.push('<tr><td class="ns1blankspaceAction">' +
								'<span id="ns1blankspaceAttachmentsAdd">Add</span>' +
								'</td></tr>');

				if (sHelpNotes != undefined)
				{
					aHTML.push('<tr><td class="ns1blankspaceAction">' +
								'<hr />' +
								'</td></tr>');
								
					aHTML.push('<tr><td id="ns1blankspaceAttachmentsAddHelpNotes" class="ns1blankspaceAction" style="font-size:0.75em;color:#404040;">' +
								sHelpNotes +
								'</td></tr>');
				}
				
				aHTML.push('</table>');					
				
				$('#ns1blankspaceAttachmentsColumn2').html(aHTML.join(''));
			
				$('#ns1blankspaceAttachmentsAdd').button(
				{
					label: "Add"
				})
				.click(function()
				{
					 ns1blankspace.attachments.add(oParam);
				});

				sXHTMLElementID = 'ns1blankspaceAttachmentsColumn1';
			}
			
			if (iObjectContext != -1)
			{	
				// To pick up attachments from the customer's space, we get attchments from the support_issue subsearch
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SUPPORT_ISSUE_SEARCH';
				oSearch.addField('supportissue.attachment.type,supportissue.attachment.filename,supportissue.attachment.title,' +
									'supportissue.attachment.description,supportissue.attachment.download,supportissue.attachment.modifieddate,' +
									'supportissue.attachment.attachment,supportissue.attachment.bucket,supportissue.attachment.createddate,' +
									'supportissue.attachment.createdusertext,supportissue.attachment.id');
				oSearch.addFilter('id', 'EQUAL_TO', iObjectContext)
				oSearch.addField('supportissue.attachment.id', 'IS_NOT_NULL');
				oSearch.rows = ns1blankspace.option.defaultRows;
				
				if (iAttachmentType != undefined)
				{
					oSearch.addFilter('supportissue.attachment.type', 'EQUAL_TO', iAttachmentType);
				}
				
				oSearch.sort(sSortBy, sSortDirection);
				oSearch.getResults(function(data) 
				{
					if (data.status == 'OK')
					{
						data.data.rows = $.map(data.data.rows, function(x)
						{
							var y = {};
							$.each(Object.keys(x), function()
							{
								y[this.replace('supportissue.attachment.', '')] = x[this];
							});
							return y;
						});
					}
					oParam.functionSearch = ns1blankspace.supportIssue.attachments.show;
					oParam.functionPostUpdate = ns1blankspace.supportIssue.attachments.show;
					ns1blankspace.attachments.process(data, oParam)
				});
			}
		}
	},

	forward: function()
	{
		// Create a new suport issue with the details as supplied from the current support issue
		var oParam = {
			title: ns1blankspace.objectContextData.title,
			description: ns1blankspace.objectContextData.description
		};

		oParam.description = oParam.description + '\r\n\r\n' + 
							'[Originally from ' + ns1blankspace.objectContextData.contactbusinesstext + ']\r\n' + 
							'Logged by: ' + ns1blankspace.objectContextData.contactpersontext + '.  ' +
							(ns1blankspace.objectContextData.sourcespacetext ? 'Site: ' + ns1blankspace.objectContextData.sourcespacetext : '') + '\r\n\r\n' +
							ns1blankspace.user.contactBusinessText + ' issue ' + ns1blankspace.objectContextData.reference;
		oParam.issueForwarded = true;
		oParam.sourceIssueID = ns1blankspace.objectContext;
		oParam.sourceIssueTechNotes = ns1blankspace.objectContextData.technicalnotes;
		oParam['new'] = true;
		ns1blankspace.supportIssue.data.mode.value = ns1blankspace.util.getParam(oParam, 'mode', {"default": 1}).value;

		ns1blankspace.supportIssue.init(oParam)
	},

	save: 		
	{
		send:	function (oParam)
		{
			oParam = oParam || {};
			var oData = {}

			ns1blankspace.status.working();

			// If user has clicked button from Summary then just save this
			if (oParam.status != undefined)
			{
				oData.status = oParam.status;
			}
			else
			{
				if ($('#ns1blankspaceMainDetails').html() != '')
				{
					// Only save values that have changed to prevent unnecessary alerts going to support advisor
					$.each($('#ns1blankspaceMainDetails [data-column]'), function()
					{
						var sCol = $(this).attr('data-column');
						var sOrgVal = (ns1blankspace.objectContext == -1) ? "" : ns1blankspace.objectContextData[sCol].formatXHTML();
						
						if ($(this).hasClass('ns1blankspaceSelect'))
						{	
							if (ns1blankspace.objectContext == -1
								|| sOrgVal != $(this).attr('data-id'))
							{	oData[sCol] = $(this).attr('data-id');}
						}
						else if ($(this).attr('type') == 'radio')
						{
							if ($(this).prop('checked'))
							{
								if (ns1blankspace.objectContext == -1
									|| sOrgVal != $(this).val() && $(this).val() != undefined)
								{	oData[sCol] = $(this).val();}
							}
						}
						else if ($(this).is("textarea"))
						{
							if (ns1blankspace.objectContext == -1
								|| sOrgVal.replace(/\r?\n|\r/g, "") != $(this).val().replace(/\r?\n|\r/g, ""))
							{	oData[sCol] = $(this).val();}
						}
						else
						{
							if (ns1blankspace.objectContext == -1
								|| sOrgVal != $(this).val())
							{	oData[sCol] = $(this).val();}
						}
					});
								
				}

				// Update Date Completed 
				if ($('#ns1blankspaceDetailsStatus').val() == 'Completed' && ns1blankspace.objectContextData.statustext != 'Completed')
				{
					oData.completeddate = (new Date()).toString('dd MMM yyyy');
				}
				else if (ns1blankspace.objectContext != -1 
					&& $('#ns1blankspaceDetailsStatus').val() != 'Completed' && ns1blankspace.objectContextData.statustext == 'Completed')
				{
					oData.completeddate = '';
				}
				
				if ($('#ns1blankspaceMainSolution').html() != '')
				{
					oData.solution = $('#ns1blankspaceSolutionSolution').val();
					oData.technicalnotes = $('#ns1blankspaceSolutionTechnicalNotes').val();
				}	
			}

			if (!ns1blankspace.util.isEmpty(oData))
			{									
				if (ns1blankspace.objectContext != -1)
				{
					oData.id = ns1blankspace.objectContext;
				} 
				oData.datareturn = 'reference';
		
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('SUPPORT_ISSUE_MANAGE'),
					data: oData,
					dataType: 'json',
					success: function (data) {ns1blankspace.supportIssue.save.process(data, oData)}
				});
				
			}
			else
			{
				ns1blankspace.status.message('Nothing to save!');
			}	
				
		},

		process:	function (oResponse, oData)
		{
			if (oResponse.status == 'OK')
			{
				ns1blankspace.status.message('Saved');

				var bNew = (ns1blankspace.objectContext == -1)
				ns1blankspace.objectContext = oResponse.id;	
				ns1blankspace.inputDetected = false;

				if (ns1blankspace.supportIssue.data.issueForwarded)
				{
					ns1blankspace.supportIssue.save.updateSourceIssue(
					{
						loggedWith: $('[name="radioUser"]:checked').val(), 
						reference: oResponse.data.rows[0].reference
					});
				}

				ns1blankspace.supportIssue.init(
				{
					id: ns1blankspace.objectContext,
					onComplete: ns1blankspace.supportIssue.alert.init,
					onCompleteWhenCan: ns1blankspace.supportIssue.init
				});
			}
			else
			{
				ns1blankspace.status.error(oResponse.error.errornotes);
			}
		},

		updateSourceIssue: function(oParam)
		{
			if (ns1blankspace.supportIssue.data.sourceIssueID)
			{
				var oUser = $.grep(ns1blankspace.supportIssue.data.users, function(x) {return x.id == oParam.loggedWith}).shift();
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('SUPPORT_ISSUE_MANAGE'),
					data: 
					{
						id: ns1blankspace.supportIssue.data.sourceIssueID, 
						technicalnotes:  'Logged with ' + oUser.contactfirstname.formatXHTML() + ' ' + oUser.contactsurname.formatXHTML() + 
										' ' + oParam.reference + 
										(ns1blankspace.supportIssue.data.sourceIssueTechNotes ? '\r\n\r\n' + ns1blankspace.supportIssue.data.sourceIssueTechNotes.formatXHTML() : '')
								
					},
					success: function(data)
					{
						delete(ns1blankspace.supportIssue.data.sourceIssueID);
						delete(ns1blankspace.supportIssue.data.issueForwarded);
						delete(ns1blankspace.supportIssue.data.sourceIssueTechNotes);
						if (data.status != 'OK')
						{
							ns1blankspace.status.error('Unable to update source issue with new Issue number: ' + data.error.errornotes);
						}
					}
				});
			}
		}
	},				

	getUsers:	function (oParam, oResponse)
	{
		var sXHTMLElementID = 'ns1blankspaceDetailsUser';

		if (oParam != undefined)
		{
			if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		}

		if (oResponse == undefined)
		{
			$.ajax(
			{
				type: 'GET',
				url: ns1blankspace.util.endpointURI('SUPPORT_ISSUE_USER_SEARCH') + '&acceptsupport=Y',
				dataType: 'json',
				async: false,
				success: function(data){ns1blankspace.supportIssue.getUsers(oParam, data)}
			});
		}
		else
		{
			var aHTML = [];

			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table>' +
								'<tr><td class="ns1blankspaceNothing">No users to log issue against!</td></tr>' +
								'</table>');
			}
			else
			{		
				$.each(oResponse.data.rows, function()
				{
					// v2.0.1 If new issue, show entire list for user to choose from. Otherwise, show them who they chose
					if (ns1blankspace.objectContext == -1)
					{
						aHTML.push('<input type="radio" id="radioUser' + this.id + '"' +
										' name="radioUser" value="' + this.id + '"' +
										' data-email="' + this.email + '" data-column="user">' +
										this.contactfirstname + ' ' + this.contactsurname + '<br />');
					}
					else if (this.id == ns1blankspace.objectContextData.user)
					{
						aHTML.push(this.contactfirstname.formatXHTML() + ' ' + this.contactsurname.formatXHTML());
					}
				});

			}

			ns1blankspace.supportIssue.data.users = oResponse.data.rows;

			$('#' + sXHTMLElementID).html(aHTML.join(''));
		}	
	},	

	getContact:	function (oParam, oResponse)
	{
		var sXHTMLElementNameID = 'ns1blankspaceDetailsName';
		var sXHTMLElementEmailID = 'ns1blankspaceDetailsEmail';
		var sXHTMLElementPhoneID = 'ns1blankspaceDetailsPhone';

		if (oParam != undefined)
		{
			if (oParam.xhtmlElementNameID != undefined) {sXHTMLElementNameID = oParam.xhtmlElementNameID}
			if (oParam.xhtmlElementEmailID != undefined) {sXHTMLElementEmailID = oParam.xhtmlElementEmailID}
		}

		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_USER_SEARCH';
			oSearch.addField('user.contactperson.firstname,user.contactperson.surname,user.contactperson.email,user.contactperson.workphone,' +
								'user.contactperson.mobile,user.contactbusiness.phonenumber');
			oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.user.id);
			oSearch.getResults(function(oResponse)
			{
				if (oResponse.status == 'OK')
				{
					ns1blankspace.supportIssue.getContact(oParam, oResponse);
				}
			})	
		}
		else
		{
			if (oResponse.data.rows.length > 0)
			{
				var sPhone = oResponse.data.rows[0]['user.contactperson.workphone'];
				sPhone = sPhone || oResponse.data.rows[0]['user.contactperson.mobile'];
				sPhone = sPhone || oResponse.data.rows[0]['user.contactbusiness.phonenumber'];

				$('#' + sXHTMLElementNameID).val(oResponse.data.rows[0]['user.contactperson.firstname'].formatXHTML() + ' ' + oResponse.data.rows[0]['user.contactperson.surname'].formatXHTML());
				$('#' + sXHTMLElementEmailID).val(oResponse.data.rows[0]['user.contactperson.email'].formatXHTML());
				$('#' + sXHTMLElementPhoneID).val(sPhone.formatXHTML());
			}
		}	
	},

	alert: 		
	{
		init: 		function (oParam)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainAlert'});

			if (ns1blankspace.inputDetected)
			{
				$('#ns1blankspaceMainAlert').html('<span class="ns1blankspaceSub">You need to save the issue<br />before sending the alert.</span>');
			}
			else
			{
				ns1blankspace.supportIssue.alert.show(oParam);
			}
		},

		show: 		function (oParam)
		{
			if (oParam === undefined) {oParam = {}}
			ns1blankspace.inputDetected = false;
		
			if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe)
			{
				ns1blankspace.supportIssue.alert.send(oParam)
			}
			else
			{
				// We've been into messaging.imap namespace - revert objectContextData back
				if (ns1blankspace.objectContextData == undefined)
				{
					ns1blankspace.objectContextData = ns1blankspace.sourceObjectContextData;
					ns1blankspace.objectContext = ns1blankspace.sourceObjectContext;
					delete(ns1blankspace.sourceObjectContext);
					delete(ns1blankspace.sourceObjectContextData);
				}

				$('#ns1blankspaceMainAlert').html('<table class="ns1blankspaceMain">' +
							'<tr class="ns1blankspaceRow">' +
							'<td id="ns1blankspaceAlert1" class="ns1blankspaceColumn"></td>' +
							'<td id="ns1blankspaceAlert2" class="ns1blankspaceColumn2" style="width:50px;"></td>' +
							'</tr>' +
							'</table>');				

				var aHTML = [];

				aHTML.push('<table class="ns1blankspaceColumn">');
												
				aHTML.push('<tr><td class="ns1blankspaceSub">Send an email alert about this update to ' + ns1blankspace.objectContextData.email + '?</td></tr>');

				aHTML.push('<tr class="ns1blankspace">' +
								'<td id="ns1blankspaceDetailsUser" class="ns1blankspaceRadio">' +
								'<input type="radio" id="radioLink1" class="radioLink" name="radioLink" value="1"/>Use "classic" back link<br />' +
								'<input type="radio" id="radioLink2" class="radioLink" name="radioLink" value="2"/>Use current back link (' + window.location.href.split('#').shift() + ')<br />' +
								'<input type="radio" id="radioLink3" class="radioLink" name="radioLink" value="3"/>Use custom back link' +
								'</td></tr>');	

				aHTML.push('<tr id="ns1blankspaceAlertCustomLinkRow" style="display:none;">' +
								'<td class="ns1blankspaceRadio">' +
								'<input class="ns1blankspaceText radioLink" id="ns1blankspaceAlertCustomLink">' +
							'</td></tr>');

				aHTML.push('<tr id="ns1blankspaceAlertModifyRow"><td class="ns1blankspaceRadio" style="padding-top:15px;">' +
							'<input type="checkbox" id="ns1blankspaceAlertModify">Modify alert recipients / content</td></tr>');

				aHTML.push('</table>');

				$('#ns1blankspaceAlert1').html(aHTML.join(''));

				$('#radioLink2').prop('checked', true);
				var aHTML = [];

				aHTML.push('<table class="ns1blankspaceColumn2">');
												
				aHTML.push('<tr><td>' +
								'<span id="ns1blankspaceAlertSend" class="ns1blankspaceAction" style="width:75px;">' +
								'Send</span></td></tr>');

				aHTML.push('</table>');

				$('#ns1blankspaceAlert2').html(aHTML.join(''));

				// Determine which backlink to use
				$('[name="radioLink"]')
				.on('click', function()
				{
					// Check if "Custom" has been clicked. If so, allow user to add custom link value
					if ($('[name="radioLink"]:checked').val() == '3')
					{
						if ($('#ns1blankspaceAlertCustomLink').is(':visible'))
						{
							if ($('#ns1blankspaceAlertCustomLink').val() == "")
							{
								ns1blankspace.status.error("Please enter the custom link value");
								$('#ns1blankspaceAlertCustomLink').focus();
							}
						}
						else 
						{
							$('#ns1blankspaceAlertCustomLinkRow').show();
							if ($('#ns1blankspaceAlertCustomLink').val() == "")
							{
								$('#ns1blankspaceAlertCustomLink').val(document.location.href);
								$('#ns1blankspaceAlertCustomLink').focus();
							}
						}
					}
					else
					{
						$('#ns1blankspaceAlertCustomLinkRow').hide();
					}
				});

				// v2.0.1 Allows user to send 'traditional' email but with pre-populated recipient, message and subject
				$('#ns1blankspaceAlertModify')
				.on('click', function()
				{
					if ($(this).prop('checked'))
					{
						$('.radioLink').attr('disabled', true);

						$('#ns1blankspaceAlertModifyRow').after('<tr id="ns1blankspaceSupportAlertEmailRow">' +
																	'<td id="ns1blankspaceSupportAlertEmail">' +
																'</td></tr>');
						$("#ns1blankspaceAlertSend").off('click');
						ns1blankspace.supportIssue.alert.customAlert();
					}
					else
					{
						$('.radioLink').attr('disabled', false);
						if (ns1blankspace.objectContextData == undefined)
						{
							ns1blankspace.objectContextData = ns1blankspace.sourceObjectContextData;
							ns1blankspace.objectContext = ns1blankspace.sourceObjectContext;
							delete(ns1blankspace.sourceObjectContext);
							delete(ns1blankspace.sourceObjectContextData);
						}
						delete(ns1blankspace.messaging.imap.data.message);
						$('#ns1blankspaceSupportAlertEmailRow').remove();
						$("#ns1blankspaceAlertSend").on('click', ns1blankspace.supportIssue.alert.bindSend);
					}
				});

				$('#ns1blankspaceAlertSend').button(
				{
					label: 'Send'
				})
				.click(ns1blankspace.supportIssue.alert.bindSend);
			}	
		},

		bindSend: function(oParam)
		{
			oParam = oParam || {};
			oParam.classic = ($('#ns1blankspaceAlertClassic:checked').length == 0);
			oParam.onComplete = ns1blankspace.supportIssue.init;
			ns1blankspace.supportIssue.alert.send(oParam);
		},

		customAlert: function(oParam)
		{
			oParam = oParam || {};
			oParam.customAlertStep = oParam.customAlertStep || 1;

			if (oParam.customAlertStep == 1)
			{
				oParam.customAlertStep = 2;
				oParam.onComplete = ns1blankspace.supportIssue.alert.customAlert;
				ns1blankspace.messaging.imap.initVariables();
				ns1blankspace.messaging.imap.initAccounts(oParam);
			}
			else
			{
				var oData = ns1blankspace.supportIssue.alert.composeAlert();
				ns1blankspace.sourceObjectContextData = ns1blankspace.objectContextData;
				ns1blankspace.sourceObjectContext = ns1blankspace.objectContext;

				ns1blankspace.messaging.imap.data.message = oData;
				ns1blankspace.messaging.imap["new"](
				{
					xhtmlParentElementID: "ns1blankspaceMainAlert", 
					xhtmlElementID: "ns1blankspaceSupportAlertEmail",
					xhtmlSendElementID: "ns1blankspaceAlertSend",
					functionPostSend: ns1blankspace.supportIssue.init,
					dialog: true
				});
			}
		},

		composeAlert: function(oParam)
		{
			var sIssueText = ns1blankspace.util.getParam(oParam, 'issueText').value;
			var sSolutionText = ns1blankspace.util.getParam(oParam, 'solutionText').value;
			var sLinkUser = window.location.href.split('#').shift();
			var sLinkSupport = sLinkUser;

			if ($('[name="radioLink"]:checked').val() == "1")		// Classic
			{
				sLinkUser = 'https://secure.mydigitalspacelive.com/support/issueproperties.asp?select=';
			}
			else if ($('[name="radioLink"]:checked').val() == "3")		// Custom
			{
				sLinkUser = $('#ns1blankspaceAlertCustomLink').val();
			}
			sLinkUser += '#/supportIssue/';

			//noreply@mydigitalstucture.com

			var aUser = $.grep(ns1blankspace.supportIssue.data.users, function (a) {return a.id == ns1blankspace.objectContextData.user}).shift();
			var sTo = (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.forMe)
				? ns1blankspace.objectContextData.email
				: (aUser != undefined ? aUser.email : ns1blankspace.objectContextData.usercontactemail);

			if (sIssueText == undefined) {sIssueText = ns1blankspace.objectContextData.description.replace(/\r?\n|\r/g, "<br />")}
			if (sSolutionText == undefined) {sSolutionText = ns1blankspace.objectContextData.solution.replace(/\r?\n|\r/g, "<br />")}

			var oData = 
			{
				subject: 'Support Issue ' + ns1blankspace.objectContextData.reference + ': ' + ns1blankspace.objectContextData['title'].formatXHTML(),
				to: sTo,
				contactPerson: ns1blankspace.objectContextData.contactperson
			}

			var aMessage = [];

			if (ns1blankspace.supportIssue.data.mode.value == ns1blankspace.supportIssue.data.mode.options.byMe)
			{
				//USER TO SUPPORT
				aMessage.push('<p><strong>Issue:</strong></p><p>' + sIssueText + '</p>', 
								'<a href="' + sLinkSupport + ns1blankspace.objectContext +'">View Issue</a>');
				aMessage.push('<strong>Severity:</strong> ' + ns1blankspace.objectContextData['severitytext']);
				aMessage.push('<strong>Type:</strong> ' + ns1blankspace.objectContextData['typetext']);
				aMessage.push('<strong>Status:</strong> ' + ns1blankspace.objectContextData['statustext']);
				if (ns1blankspace.objectContextData.quoteapproved == 'Y')
				{
					aMessage.push('<strong>Quote is:</strong> Approved');
				}
				if (ns1blankspace.objectContextData.version != '')
				{
					aMessage.push('<strong>Version:</strong> ' + ns1blankspace.objectContextData['versiontext']);
				}
				$.each(ns1blankspace.supportIssue.data.extendElements, function()
				{
					if (ns1blankspace.objectContextData[this.alias.toLowerCase()] != '')
					{
						aMessage.push('<strong>' + this.title.formatXHTML() + ':</strong> ' + 
							ns1blankspace.objectContextData[this.alias.toLowerCase()]);
					}
				});
			}
			else
			{
				//SUPPORT TO USER
				aMessage.push('<p><strong>Issue:</strong></p><p>' + sIssueText + '</p>', 
							  '<p><strong>Solution:</strong></p><p>' + sSolutionText + '</p>',
							  '<a href="' + sLinkUser + ns1blankspace.objectContext +'">View Issue</a>');
				aMessage.push('<strong>Status:</strong> ' + ns1blankspace.objectContextData['statustext']);
				if (ns1blankspace.objectContextData.quotedhours != '0.00')
				{
					aMessage.push('<strong>Quoted Hours:</strong> ' + ns1blankspace.objectContextData['quotedhours']);
				}
				if (ns1blankspace.objectContextData.quotedhours != '0.00')
				{
					aMessage.push('<strong>Quoted Amount:</strong> $' + ns1blankspace.objectContextData['quotedamount']);
				}
			}	

			oData.message = aMessage.join('<br /><br />');

			return oData;
		},

		send: 		function (oParam, oResponse)
		{
			if (oResponse === undefined)
			{	
				var oData = ns1blankspace.supportIssue.alert.composeAlert();
				$('#ns1blankspaceMainAlert').html(ns1blankspace.xhtml.loadingSmall + ' Sending alert');
				if (oData.to)
				{
					oData.saveagainstobject = 8;
					oData.saveagainstobjectcontext = ns1blankspace.objectContext;
					
					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND'),
						data: oData,
						dataType: 'json',
						success: function (data) 
						{
							if (data.response = "OK")
							{
								ns1blankspace.supportIssue.alert.send(oParam, data);
							}
							else
							{
								ns1blankspace.status.error('Error senidng: ' + data.error.errornotes);
							}
						}
					});
				}
				else
				{
					ns1blankspace.status.error('No one to email');
				}	
			}
			else
			{
				ns1blankspace.status.message('Alert sent');
				
				if (oParam.addAction)
				{
					var aText = [];
					$.each(ns1blankspace.supportIssue.data.extendElements, function()
					{
						if (ns1blankspace.objectContextData[this.alias.toLowerCase()] != '')
						{
							aText.push('<strong>' + this.title.formatXHTML() + ':</strong> ' + 
								ns1blankspace.objectContextData[this.alias.toLowerCase()]);
						}
					});

					if (aText.length > 0)
					{
						aText.unshift('<strong>Extra information for Support Issue ' + ns1blankspace.objectContextData.reference + ':');
						var oData = 
						{
							actiontype: '4',
							status: '1',
							duedate: dToday.toString('dd MMM yyyy'),
							description: aText.join('<br /><br />'),
							object: '8',
							objectcontext: ns1blankspace.objectContext
						};

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
							data: oData,
							success: function(oResponse)
							{
								ns1blankspace.util.onComplete(oParam)
							}
						});
					}
					else {ns1blankspace.util.onComplete(oParam)}
				}
				else
				{
					ns1blankspace.util.onComplete(oParam);
				}
			}	
		}			
	},

	issuesByStatus: 
	{
		search: function(oParam)
		{
			var aFields = ns1blankspace.util.getParam(oParam, 'columns', {'default': []}).value;
			var aSearchFilters = ns1blankspace.util.getParam(oParam, 'searchFilters', {'default': []}).value;
			var aFilters = ns1blankspace.util.getParam(oParam, 'filters', {'default': []}).value;
			var aCustomOptions = ns1blankspace.util.getParam(oParam, 'customOptions', {'default': []}).value;
			var sSortColumn = ns1blankspace.util.getParam(oParam, 'sortColumn', {'default': ''}).value;
			var sSortDirection = ns1blankspace.util.getParam(oParam, 'sortDirection').value;
			var sMethod = ns1blankspace.util.getParam(oParam, 'method').value;
			var fFunctionShow = ns1blankspace.util.getParam(oParam, 'functionShow').value;
			var sFields;

			ns1blankspace.status.working();
			if (sMethod != undefined && fFunctionShow != undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = sMethod;

				// Process the field list
				if (aFields.length > 0)
				{
					sFields = $.map($.grep(aFields, function(x) {return x.field}), function(y) {return y.field}).join(',');
				}

				if (sFields != undefined && sFields != '')
				{
					oSearch.addField(sFields);
		
					// Process the filters
					if (aSearchFilters.length > 0)
					{
						$.each(aSearchFilters, function()
						{
							oSearch.addFilter(this.name, this.comparison, this.value1, this.value2, this.value3, this.applyToSubSearchJoin);
						});
					}

					// Process the user filters
					$.each(aFilters, function()
					{
						var oThisFilter = this;
						var aValues = [];
						$.each($('.ns1blankspace' + oThisFilter.name + '.ns1blankspaceSelected'), function()
						{
							aValues.push(this.id.split('_').pop());
						});

						if (aValues.length > 0)
						{
							oSearch.addFilter(oThisFilter.field, 'IN_LIST', aValues.join(','));
						}
					});

					// Process the sort 
					if (sSortColumn != '')
					{
						oSearch.sort(sSortColumn, sSortDirection);
					}

					if (aCustomOptions.length > 0)
					{
						$.each(aCustomOptions, function()
						{
							oSearch.addCustomOption(this.field, this.value);
						});
					}
					oSearch.rows = 200;
					oSearch.getResults(function(oResponse)
					{
						ns1blankspace.status.clear();

						if (oResponse.status === 'OK')
						{
							fFunctionShow(oParam, oResponse);
						}
						else
						{
							ns1blankspace.status.error(oResponse.error.errornotes);
						}
					});
				}
			}
			else
			{
				ns1blankspace.status.error('Method and Show function not passed to search. Please contact support.');
				return;
			}
		},

		show: function(oParam, oResponse)
		{
			// Allows for generic display of list

			var dToday = new Date();
			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {'default': ''}).value;
			var sLabel = ns1blankspace.util.getParam(oParam, 'label', {'default': ''}).value;
			var sXHTMLContext = ns1blankspace.util.getParam(oParam, 'xhtmlContext', {'default': ''}).value;
			var sSortColumn = ns1blankspace.util.getParam(oParam, 'sortColumn', {'default': ''}).value;
			var sSortDirection = ns1blankspace.util.getParam(oParam, 'sortDirection').value;
			var aFilters = ns1blankspace.util.getParam(oParam, 'filters', {'default': []}).value;
			var aColumns = ns1blankspace.util.getParam(oParam, 'columns', {'default': []}).value;
			var fFunctionProcess = ns1blankspace.util.getParam(oParam, 'functionProcess').value;
			var fFunctionSearch = ns1blankspace.util.getParam(oParam, 'functionSearch').value;
			var fFunctionShow = ns1blankspace.util.getParam(oParam, 'functionShow').value;
			var fFunctionBind = ns1blankspace.util.getParam(oParam, 'functionBind').value;
			var fFunctionDelete = ns1blankspace.util.getParam(oParam, 'functionDelete').value;
			var fFunctionRow = ns1blankspace.util.getParam(oParam, 'functionShowRow').value;

			var aHTML = [];
			
			// First, let's construct the display and filtering areas
			if ($('#' + sXHTMLElementID).attr('data-loading') === '1') 
			{
				ns1blankspace.data.quickReport = {};

				$('#' + sXHTMLElementID).attr('data-loading', '');
				
				aHTML.push('<div id="ns1blankspace' + sXHTMLContext + 'BulkMain" class="ns1blankspaceControlMain">');
				aHTML.push('<table id="ns1blankspace' + sXHTMLContext + 'BulkContainer"><tr>');
				aHTML.push('<td id="ns1blankspace' + sXHTMLContext + 'BulkColumn1" class="ns1blankspaceColumn1Flexible"></td>');
				aHTML.push('</tr></table>');	
				aHTML.push('</div>');
				
				$('#' + sXHTMLElementID).html(aHTML.join(''));


				aHTML.push('<table id="ns1blankspace' + sXHTMLContext + '"><tr>');
				aHTML.push('<td id="ns1blankspace' + sXHTMLContext + 'Results" class="ns1blankspaceColumn1Flexible"></td>' +
						   '<td id="ns1blankspace' + sXHTMLContext + 'SearchRibbon" class="ns1blankspaceColumn2" style="width:10px;"></td>');
				if (aFilters.length > 0)
				{	aHTML.push('<td id="ns1blankspace' + sXHTMLContext + 'Filter" class="ns1blankspaceColumn2" style="width:210px;"></td>');	}

				aHTML.push('</tr></table>');

				$('#ns1blankspace' + sXHTMLContext + 'BulkColumn1').html(aHTML.join(''));

				// Search criteria bar 'handle' - allows user to get the search criteria div back into view
				aHTML = [];
				aHTML.push('<span id="ns1blankspace' + sXHTMLContext + 'SearchHandle" style="height:25px; display: none;"></span>');
				if (fFunctionProcess)
				
				{	aHTML.push('<span id="ns1blankspace' + sXHTMLContext + 'Process" style="height:25px"></span>');	}
				
				if (fFunctionDelete)
				{	aHTML.push('<span id="ns1blankspace' + sXHTMLContext + 'Delete" style="height:25px"></span>');	}
				$('#ns1blankspace' + sXHTMLContext + 'SearchRibbon').html(aHTML.join(''));

				aHTML = [];
				aHTML.push('<table class="ns1blankspaceColumn2" style="width:100px;">');

				aHTML.push('<tr><td id="ns1blankspace' + sXHTMLContext + 'Search" class="ns1blankspaceAction">Search</td></tr>');

				aHTML.push('<tr><td id="ns1blankspace' + sXHTMLContext + 'StatusMessage" style="color:red;font-size:0.75em;">&nbsp;</td></tr>');

				// Filtering area
				if (aFilters.length > 0)
				{
					$.each(aFilters, function()
					{
						var oFilter = this;
						aHTML.push('<tr><td class="ns1blankspaceHeaderCaption" style="font-size:1em;">' + oFilter.title + '</td></tr>');

						$.each(oFilter.values, function(index)
						{
							aHTML.push('<tr><td id="ns1blankspace' + oFilter.name + '_' + this.id + '" ' +
												'class="ns1blankspace' + oFilter.name + ' ns1blankspaceSelectable' + 
													((oFilter.selected === 'all' || (oFilter.selected === 'first' && index === 0)) ? ' ns1blankspaceSelected" data-selected="1"' : '"') +
												'>' + 
												this[(this.value != undefined) ? 'value' : 'title'].formatXHTML() + 
										'</td></tr>');
						});
						
						aHTML.push('<tr><td>&nbsp;</td></tr>');							
					});

					aHTML.push('</table>');

				}
				$('#ns1blankspace' + sXHTMLContext + 'Filter').html(aHTML.join(''));

				// Bind the Search Handle (hides the search criteria area)
				$('#ns1blankspace' + sXHTMLContext + 'SearchHandle')
					.button(
					{
						text: false,
						icons: {primary: 'ui-icon-arrowthickstop-1-w'}
					})
					.css('width', '14px')
					.css('height', '25px')
					.css('padding-top', '6px')
					.click(function() 
					{
						$('#ns1blankspace' + sXHTMLContext + 'SearchHandle').hide();
						$('#ns1blankspace' + sXHTMLContext + 'Filter').show('slide', {direction: 'left'}, 500);
					});

				// Bind the Process button
				if (fFunctionProcess)
				{
					$('#ns1blankspace' + sXHTMLContext + 'Process')
						.button({
							text: false,
							icons: { primary: 'ui-icon-check'}
						})
						.css('width', '14px')
						.css('height', '25px')
						.css('padding-top', '6px')
						.click(function() 
						{
							oParam.operation = 'Create';
							fFunctionProcess(oParam);
						});
					$('#ns1blankspace' + sXHTMLContext + 'Process').hide();
				}

				// Bind the Delete button
				if (fFunctionDelete)
				{
					$('#ns1blankspace' + sXHTMLContext + 'Delete')
						.button({
							text: false,
							icons: { primary: 'ui-icon-close'}
						})
						.css('width', '14px')
						.css('height', '25px')
						.css('padding-top', '6px')
						.click(function() 
						{
							oParam.operation = 'Delete';
							fFunctionProcess(oParam);
						});
					$('#ns1blankspace' + sXHTMLContext + 'Delete').hide();
				}

				// Bind Filter(s)
				$.each(aFilters, function()
				{
					var sName = this.name;
					if (this.maxSelect === 1)
					{
						$('.ns1blankspace' + sName).click(function() 
						{
							$('.ns1blankspace' + sName)
								.removeClass('ns1blankspaceSelected')
								.attr('data-selected','0');
							
							$(this)
								.addClass('ns1blankspaceSelected')
								.attr('data-selected', '1');
						});
					}
					else
					{
						$('.ns1blankspace' + sName).click(function() 
						{
							$(this)
								.attr('data-selected',(($(this).hasClass('ns1blankspaceSelected')) ? '0' : '1'))
								.toggleClass('ns1blankspaceSelected');
							
						});
					}

				});

				// Bind the Search button
				$('#ns1blankspace' + sXHTMLContext + 'Search')
					.button({
						label: "Search"
					})
					.click(function() 
					{
						ns1blankspace.okToSave = true;

						if (aFilters.length > 0)
						{
							$.each(aFilters, function()
							{
								if ($('.ns1blankspace' + this.name + '[data-selected="1"]').length === 0) 
								{
									$('#ns1blankspace' + sXHTMLContext + 'StatusMessage').html('Please choose at least one ' + this.title + '.');
									ns1blankspace.okToSave = false;
								}
								else
								{
									oParam['filter.' + this.name] = $.map($('.ns1blankspace' + this.name + '[data-selected="1"]'), function(x) {return $(x).attr('id').split('_').pop()});
								}
							});
						}

						if (ns1blankspace.okToSave) 
						{
							$('#ns1blankspace' + sXHTMLContext + 'Filter').hide(
							{duration: 200, complete: function() 
								{

								$('#ns1blankspace' + sXHTMLContext + 'SearchHandle').show();
								$('#ns1blankspace' + sXHTMLContext + 'Process').show();
								$('#ns1blankspace' + sXHTMLContext + 'Delete').show();
								$('#ns1blankspace' + sXHTMLContext + 'Results').html(ns1blankspace.xhtml.loading);
								oParam = ns1blankspace.util.setParam(oParam, "onComplete", fFunctionShow)

								fFunctionSearch(oParam);
								}
							});

						}
						else 
						{
							window.setTimeout('$("#ns1blankspace' + sXHTMLContext + 'StatusMessage").fadeOut(4000)', 7000);
						}
					});

				//$('#ns1blankspace' + sXHTMLContext + 'Search').click();
			}

			if (oResponse) 
			{	
				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<table class="ns1blankspaceHome">');
					aHTML.push('<tr><td class="ns1blankspaceNothing">No records</td></tr>');
					aHTML.push('</table>');

					$('#ns1blankspace' + sXHTMLContext + 'Results').html(aHTML.join(''));
				}
				else
				{
					aHTML.push('<table id="ns1blankspace' + sXHTMLContext + '" class="ns1blankspace">');
					
					aHTML.push('<tr class="ns1blankspaceCaption">');

					// Add in the column headers with sorting if applicable
					$.each($.grep(aColumns, function(x) {return x.hidden == undefined || x.hidden === false}), function()
					{
						aHTML.push('<td class="ns1blankspaceHeaderCaption' + ((sSortColumn != '') ? ' ns1blankspaceHeaderSort' : '') + '"' +
									' data-column="' + this.field + '"' +
									' data-sortdirection="' + ((sSortColumn == this.field) ? sSortDirection : 'asc') + '">' +
										this.title + 
									'</td>');
					});

					if (fFunctionProcess || fFunctionDelete)
					{
						aHTML.push('<td class="ns1blankspaceHeaderCaption ns1blankspaceMainRowOptionsSelect"' +
									' style="color:#B8B8B8; padding:4px; vertical-align:top;">' + 
									'<input type="checkbox" id="ns1blankspace' + sXHTMLContext + 'CheckAll"' +
										' class="ns1blankspace' + sXHTMLContext + '" checked="false">' +
									'</td>');
					}

					aHTML.push('</tr>');

					ns1blankspace.data.quickReport.params = oParam;
					
					$.each(oResponse.data.rows, function() 	
					{
						aHTML.push(fFunctionRow(this, oParam));
					});
					
					aHTML.push('</table>');

					ns1blankspace.render.page.show(
					{
						xhtmlElementID: 'ns1blankspace' + sXHTMLContext + 'Results',
						xhtmlContext: sXHTMLContext,
						xhtml: aHTML.join(''),
						showMore: (oResponse.morerows == 'true'),
						more: oResponse.moreid,
						rows: 20,
						functionShowRow: ns1blankspace.supportIssue.issuesByStatus.row,
						functionOnNewPage: fFunctionBind,
						type: 'json'
					}); 	
					
					//fFunctionBind();
				}
			}
		},

		row: function(oRow, oParam)
		{
			var aColumns = ns1blankspace.util.getParam(oParam, 'columns').value;
			var sXHTMLContext = ns1blankspace.util.getParam(oParam, 'xhtmlContext').value;
			var sGroupAtColumn = ns1blankspace.util.getParam(oParam, 'groupAtColumn').value;
			var sGroupAtValue = ns1blankspace.util.getParam(oParam, 'groupAtValue').value;
			var aHTML = [];
			
			// Determine if we need to repeat the header for the GroupAt. No need to add sorting here as only required on top header
			if (sGroupAtColumn && sGroupAtValue && sGroupAtValue != oRow[sGroupAtColumn])
			{
				aHTML.push('<tr><td colspan="' + $.grep(aColumns, function(x) {return x.hidden == undefined || x.hidden === false}).length + '">&nbsp;</td></tr>');

				aHTML.push('<tr class="ns1blankspaceCaption">');
				$.each($.grep(aColumns, function(x) {return x.hidden == undefined || x.hidden === false}), function()
				{
					aHTML.push('<td class="ns1blankspaceHeaderCaption"' +
									' style="color:#B8B8B8; padding:4px; vertical-align:top;"' +
									'>' +
									this.title + 
								'</td>');
				});
				aHTML.push('</tr>');
			}

			if (sGroupAtColumn)
			{
				ns1blankspace.data.quickReport.groupAtValue = oRow[sGroupAtColumn];
			}

			aHTML.push('<tr id="ns1blankspace' + sXHTMLContext + 'Include_row-' + oRow.id + '" class="ns1blankspaceRow">');

			$.each($.grep(aColumns, function(x) {return x.hidden == undefined || x.hidden === false}), function()
			{
				var sValue;
				if (this.functionCalculate != undefined)
				{
					sValue = this.functionCalculate(oRow);
				}
				else {sValue = oRow[this.field]}

				aHTML.push('<td id="ns1blankspace' + sXHTMLContext + '_' + this.name + '-' + oRow.id + '"' +
								' class="ns1blankspaceRow' + ((this.elementEditClass) ? ' ' + this.elementEditClass : '') + '">' +
										sValue + 
							'</td>');
			});
						

			if (oParam.functionProcess || oParam.functionDelete)
			{
				aHTML.push('<td id="ns1blankspace' + sXHTMLContext + '-' + oRow.id + '"' +
							' class="ns1blankspaceMainRowOptionsInclude"' +
							' style="color:#B8B8B8; padding:4px; vertical-align:top;">' + 
							'<input type="checkbox" id="ns1blankspace' + sXHTMLContext + 'Include-' + oRow.id + '"' +
							' class="ns1blankspace' + sXHTMLContext + 'Include" ' +
							' checked="false"');

				$.each(aColumns, function()
				{
					var sValue;
					if (this.functionCalculate != undefined)
					{
						sValue = this.functionCalculate(oRow);
					}
					else {sValue = oRow[this.field]}

					aHTML.push(' data-' + this.name + '="' + sValue + '"');
				});
			
				aHTML.push('</td>');
			}

			return aHTML.join('');
		},

		bind: function(oParam)
		{
			var sXHTMLContext = ns1blankspace.util.getParam(oParam, 'xhtmlContext').value;
			var fFunctionSearch = ns1blankspace.util.getParam(ns1blankspace.data.quickReport.params, 'functionSearch').value;
			
			$('.ns1blankspaceRow')
				.css('cursor', 'pointer')
				.on('click', function()
				{
					ns1blankspace.supportIssue.search.send('-' + this.id.split('-').pop());
				});

			$('.ns1blankspaceHeaderSort')
				.css('cursor', 'pointer')
				.click(function()
				{
					delete(ns1blankspace.data.quickReport.params.groupAtValue);

					ns1blankspace.data.quickReport.params.sortColumn = $(this).attr('data-column');
					ns1blankspace.data.quickReport.params.sortDirection = ($(this).attr('data-sortdirection') == 'desc') ? 'asc' : 'desc';
					$(this).attr('data-sortdirection', ns1blankspace.data.quickReport.params.sortDirection);

					if (fFunctionSearch != undefined)
					{
						fFunctionSearch(ns1blankspace.data.quickReport.params);
					}
				});
		}
	},

	getStatusValues: function(oParam)
	{
		if (ns1blankspace.supportIssue.data.statusValues === undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_SUPPORT_ISSUE_STATUS_SEARCH';
			oSearch.addField('id,title,customeravailable');
			oSearch.getResults(function(oResponse)
			{
				if (oResponse.status === 'OK')
				{
					ns1blankspace.supportIssue.data.statusValues = oResponse.data.rows;
					if (oParam.onComplete)
					{
						ns1blankspace.util.onComplete(oParam);
					}
				}
				else
				{
					ns1blankspace.status.error('There was an error finding Status values: ' + oResponse.error.errornotes);
				}
			});
		}
		else
		{
			if (oParam.onComplete)
			{
				ns1blankspace.util.onComplete(oParam);
			}
		}
	},

	getSpaceSupportContacts: function(oParam)
	{
		if (ns1blankspace.supportIssue.data.acceptsSupportIssues == undefined)
		{

			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_USER_SEARCH';
			oSearch.addField('supportcontactlist,disabled,contactperson,contactpersontext,contactbusinesstext');
			oSearch.addFilter('disabled', 'EQUAL_TO', 'N');
			oSearch.addFilter('supportcontactlist', 'EQUAL_TO', 'Y');
			oSearch.addFilter('contactbusiness', 'EQUAL_TO', ns1blankspace.user.contactBusiness);
			oSearch.addFilter('contactperson', 'EQUAL_TO', ns1blankspace.user.contactPerson);
			oSearch.rows = 1;
			oSearch.getResults(function(oResponse)
			{
				if (oResponse.status == 'OK')
				{
					ns1blankspace.supportIssue.data.acceptsSupportIssues = (oResponse.data.rows.length > 0);
				}
				else
				{
					ns1blankspace.status.error('Erro finding space\'s support contacts: ' + oResponse.error.errornotes);
				}
				if (oParam.onComplete)
				{
					ns1blankspace.util.onComplete(oParam);
				}
			});
		}
		else
		{
			if (oParam.onComplete)
			{
				ns1blankspace.util.onComplete(oParam);
			}
		}
	},

	debug: 		
	{
		show: 		function()
		{
			var oErrors = ns1blankspace.util.local.cache.search({key: '1blankspace-debug.json', persist: true});
			var aHTML = [];

				if (oErrors == undefined)
				{
					oErrors = []
				}

				aHTML.push('<div class="ns1blankspaceNothing">');

				if (oErrors.length == 0)
				{
					aHTML.push('Nothing to show');
				}	
				else
				{	
					aHTML.push('Time,URI,Instance,Service Fault ID,Status Code,Status<br />');

	  			$.each(oErrors, function(i,v)
	  			{
		  			aHTML.push(
		  				v.time + ',' +
		  				v.uri + ',' +
		  				v.instance + ',' +
		  				v.fault + ',' +
		  				v.statusCode + ',' +
		  				v.status + '<br />'
		  			);
	  			});
	  		}

	  		aHTML.push('</div>');

				$('#ns1blankspaceMostLikely').html(aHTML.join(''));
		},

		clear: 		function()
		{
			ns1blankspace.util.local.cache.save({key: '1blankspace-debug.json', persist: true, data: []});
		}			
	}					
}					
