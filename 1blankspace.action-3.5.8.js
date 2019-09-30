/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.action = 
{
	data: 	
	{
		blobField: 'description'
	},

	init: function (oParam)
	{
		ns1blankspace.app.reset();
		
		ns1blankspace.objectContext = -1;
		ns1blankspace.object = 17;
		ns1blankspace.objectParentName = undefined;
		ns1blankspace.objectName = 'action';
		ns1blankspace.objectContextData = undefined;
		ns1blankspace.objectContext = -1;
		ns1blankspace.viewName = 'Actions';

		var bShowHome = true
		var bNew = false
		
		if (ns1blankspace.action === undefined) {ns1blankspace.action = {}}

		ns1blankspace.action.today = new Date();
		ns1blankspace.action.currentMonth = (ns1blankspace.action.today).getMonth() + 1;
		ns1blankspace.action.currentYear = (ns1blankspace.action.today).getFullYear();
		ns1blankspace.action.contactperson;
		ns1blankspace.action.contactbusiness;
		ns1blankspace.action.contactpersontext;
		ns1blankspace.action.contactbusinesstext;
		ns1blankspace.action.calendarUsers = [];
		ns1blankspace.action.user = ns1blankspace.user.id;
		ns1blankspace.action.calendarParam = '';

		if (oParam != undefined)
		{
			if (oParam.showHome != undefined) {bShowHome = oParam.showHome}
			if (oParam.showNew != undefined) {bNew = oParam.showNew}
			if (oParam.contactPerson != undefined) {ns1blankspace.action.contactperson = oParam.contactPerson}
			if (oParam.contactBusiness != undefined) {ns1blankspace.action.contactbusiness = oParam.contactBusiness}
			if (oParam.contactPersonText != undefined) {ns1blankspace.action.contactpersontext = oParam.contactPersonText}
			if (oParam.contactBusinessText != undefined) {ns1blankspace.action.contactbusinesstext = oParam.contactBusinessText}
		}
				
		ns1blankspace.app.set(oParam);
	},

	home: function (oParam, oResponse)
	{
		var bCalendar = false;
		
		if (oParam != undefined)
		{
			if (oParam.calendar != undefined) {bCalendar = oParam.calendar}
		}	
		
		var aHTML = [];

		aHTML.push('<table>');

		aHTML.push('<tr><td><div id="ns1blankspaceViewActionLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

		

		aHTML.push('<tr class="ns1blankspaceControl">' +
						'<td id="ns1blankspaceControlNext10" style="padding-top:8px;" class="ns1blankspaceControl">Coming Up</td>' +
						'</tr>');

		aHTML.push('<tr class="ns1blankspaceControl">' +
						'<td id="ns1blankspaceControlToDo" class="ns1blankspaceControl">To Do</td>' +
						'</tr>');
	
		aHTML.push('<tr class="ns1blankspaceControl">' +
						'<td id="ns1blankspaceControlCalendar" style="padding-top:18px;" class="ns1blankspaceControl">Calendar</td>' +
						'</tr>');

		aHTML.push('<tr class="ns1blankspaceControl">' +
						'<td id="ns1blankspaceControlRecent" style="padding-top:18px;" class="ns1blankspaceControl"><div>Recent</div>' +
							'<div class="ns1blankspaceSubNote">Recently added or updated actions</td>' +
						'</tr>');
		
		aHTML.push('</table>');	

		$('#ns1blankspaceControl').html(aHTML.join(''));

		$('#ns1blankspaceControlCalendaShowUsers').click(function()
		{
			ns1blankspace.action.calendar.users()
		});

		$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

		$('#ns1blankspaceMain').html(ns1blankspace.xhtml.loading);
	
		var aHTML = [];

		aHTML.push('<div id="ns1blankspaceMainRecent" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainCalendar" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainNext10" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainToDo" class="ns1blankspaceControlMain"></div>');
		
		$('#ns1blankspaceMain').html(aHTML.join(''));
		
		$('#ns1blankspaceControlCalendar').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainCalendar'});
			ns1blankspace.action.calendar.show();
		});
		
		$('#ns1blankspaceControlNext10').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainNext10'});
			ns1blankspace.action.next10();
		});

		$('#ns1blankspaceControlToDo').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainNext10'});
			ns1blankspace.action.next10({status:2, future:false});
		});
			
		if (bCalendar)
		{
			$('#ns1blankspaceControlCalendar').addClass('ns1blankspaceHighlight');
			ns1blankspace.show({selector: '#ns1blankspaceMainCalendar'});
			ns1blankspace.action.calendar.show();
		}
		else
		{
			$('#ns1blankspaceControlNext10').addClass('ns1blankspaceHighlight');
			ns1blankspace.show({selector: '#ns1blankspaceMainNext10'});
			ns1blankspace.action.next10();
		}

		$('#ns1blankspaceControlRecent').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainRecent'});
			ns1blankspace.action.recent();
		});
	},

	search: 	
	{
		send: function (sXHTMLElementID, oParam)
		{
			var aSearch = sXHTMLElementID.split('-');
			var sElementId = aSearch[0];
			var sSearchContext = aSearch[1];
			var iMinimumLength = 0;
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
			
			if (sSearchContext != undefined  && iSource != ns1blankspace.data.searchSource.browse)
			{
				$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
				
				ns1blankspace.objectContext = sSearchContext;
				
				var oSearch = new AdvancedSearch();
				oSearch.method = 'ACTION_SEARCH';
				oSearch.addField('actiontype,contactperson,actionby,actionbytext,action.actionby.contactperson,' +
									'action.actionby.contactperson.email,action.actionby.contactperson.firstname,action.actionby.contactperson.surname,' +
									'actiontype,actiontypetext,billingstatus,billingstatustext,lock,' +
									'completed,completedtime,contactbusiness,contactbusinesstext,contactperson,' +
									'contactpersontext,date,description,duedate,duedatetime,object,objectcontext,' +
									'objecttext,priority,private,prioritytext,status,statustext,subject,text,totaltimehrs,totaltimemin,' +
									'action.actiontype.backgroundcolour,action.actiontype.textcolour');
				oSearch.addField(ns1blankspace.option.auditFields);
				oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);	
				oSearch.getResults(function(data) {ns1blankspace.action.show(oParam, data)});
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
					var sFirstName = (sSearchText.split(' ').length == 2) ? sSearchText.split(' ').shift() : sSearchText;
					var sSurname = (sSearchText.split(' ').length == 2) ? sSearchText.split(' ').pop() : sSearchText;


					var oSearch = new AdvancedSearch();
					oSearch.method = 'ACTION_SEARCH';
					oSearch.addField('subject,date,contactbusinesstext,contactpersontext');
					
					oSearch.addBracket('(');
					oSearch.addFilter('subject', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('action.description', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addBracket('(');
					oSearch.addFilter('action.contactperson.firstname', 'TEXT_IS_LIKE', sFirstName);
					oSearch.addOperator((sFirstName == sSurname) ? 'or' : 'and');
					oSearch.addFilter('action.contactperson.surname', 'TEXT_IS_LIKE', sSurname);
					oSearch.addBracket(')');
					oSearch.addBracket(')');

					ns1blankspace.search.advanced.addFilters(oSearch);
					oSearch.rows = ns1blankspace.option.defaultRowsSmall;

					oSearch.sort('subject', 'asc');

					oSearch.getResults(function(data) {ns1blankspace.action.search.process(oParam, data)});
				}
			}	
		},

		process: function (oParam, oResponse)
		{
			var iColumn = 0;
			var	iMaximumColumns = 1;
			var aHTML = [];
			var sContact;
			
			ns1blankspace.search.stop();
				
			if (oResponse.data.rows.length == 0)
			{
				$(ns1blankspace.xhtml.container).hide();
			}
			else
			{		
				aHTML.push('<table class="ns1blankspaceSearchMedium" style="width:520px;">');
					
				$.each(oResponse.data.rows, function()
				{	
					aHTML.push(ns1blankspace.action.search.row(oParam, this));
				});
		    	
				aHTML.push('</table>');

				$(ns1blankspace.xhtml.searchContainer).html(
					ns1blankspace.render.init(
					{
						html: aHTML.join(''),
						more: (oResponse.morerows == "true"),
						header: false,
						width: 520
					}) 
				);
				
				$('td.ns1blankspaceSearch').click(function(event)
				{
					$(ns1blankspace.xhtml.dropDownContainer).html('&nbsp;');
					$(ns1blankspace.xhtml.dropDownContainer).hide(ns1blankspace.option.hideSpeedOptions)
					ns1blankspace.action.search.send(event.target.id, {source: 1});
				});

				ns1blankspace.render.bind(
				{
					more: oResponse.moreid,
					startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
					functionSearch: ns1blankspace.action.search.send,
					functionRow: ns1blankspace.action.search.row,
					width: 520
				}); 
			}			
		},

		row: function (oParam, oRow)
		{
			var aHTML = [];
			var sContact;
						
			aHTML.push('<tr class="ns1blankspaceSearch">');
		
			aHTML.push('<td class="ns1blankspaceSearch" id="' +
							'search-' + oRow.id + '">' +
							oRow.subject.formatXHTML() +
							'</td>');

			aHTML.push('<td class="ns1blankspaceSearch" id="' +
							'searchContact-' + oRow.id + '">' +
							ns1blankspace.util.fd(oRow.date) +
							'</td>');

			if (oRow.contactbusinesstext != '')
			{
				sContact = oRow.contactbusinesstext;
			}
			else
			{
				sContact = oRow.contactpersontext;
			}	
			
			aHTML.push('<td class="ns1blankspaceSearch ns1blankspaceSearchSub" id="' +
							'searchContact-' + oRow.id + '">' +
							sContact +
							'</td>');	

			aHTML.push('</tr>');
			
			return aHTML.join('')
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

			if (ns1blankspace.option.showActionText)
			{
				aHTML.push('<tr><td id="ns1blankspaceControlText" class="ns1blankspaceControl">' +
								'Text (Long)</td></tr>');
			}
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

			if (ns1blankspace.option.showActionText)
			{
				aHTML.push('<tr><td id="ns1blankspaceControlText" class="ns1blankspaceControl">' +
								'Text</td></tr>');
			}

			aHTML.push('</table>');					
		
			aHTML.push('<table class="ns1blankspaceControl">');

			aHTML.push('<tr><td id="ns1blankspaceControlReminders" class="ns1blankspaceControl">' +
							'Reminders</td></tr>');

			aHTML.push('</table>');					
		
			aHTML.push('<table class="ns1blankspaceControl">');
							
			aHTML.push('<tr><td id="ns1blankspaceControlAttachments" class="ns1blankspaceControl">' +
							'Attachments</td></tr>');
		}
					
		aHTML.push('</table>');						
				
		$('#ns1blankspaceControl').html(aHTML.join(''));
		
		var aHTML = [];

		aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainDetails" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainDescription" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainText" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainReminders" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
			
		$('#ns1blankspaceMain').html(aHTML.join(''));

		$('#ns1blankspaceControlSummary').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
			ns1blankspace.action.summary();
		});

		$('#ns1blankspaceControlDetails').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
			ns1blankspace.action.details();
		});
		
		$('#ns1blankspaceControlDescription').click(function(event)
		{
			// v2.0.2 Removed refresh - unable to click Save when on Descriptin tab
			ns1blankspace.show({selector: '#ns1blankspaceMainDescription'});		
			ns1blankspace.action.description();
		});

		$('#ns1blankspaceControlText').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainText'});		
			ns1blankspace.action.text();
		});

		$('#ns1blankspaceControlReminders').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainReminders', refresh: true});
			ns1blankspace.action.reminders.show({xhtmlElementID: 'ns1blankspaceMainReminders'});
		});

		$('#ns1blankspaceControlAttachments').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainAttachments', refresh: true});
			ns1blankspace.attachments.show({xhtmlElementID: 'ns1blankspaceMainAttachments'});
		});
	},

	show: function (oParam, oResponse)
	{
		$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
		ns1blankspace.action.layout();
		
		var aHTML = [];
		var h = -1;
		
		if (oResponse.data.rows.length == 0)
		{
			ns1blankspace.objectContextData = undefined;
			
			aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this action.</td></tr></table>');
					
			$('#ns1blankspaceMain').html(aHTML.join(''));
		}
		else
		{
			ns1blankspace.objectContextData = oResponse.data.rows[0];
			
			var iMessageActionID;
			
			if (ns1blankspace.objectContextData.actiontype == ns1blankspace.data.actionTypes.emailSent.id 
				|| ns1blankspace.objectContextData.actiontype == ns1blankspace.data.actionTypes.emailReceived.id
				|| ns1blankspace.objectContextData.actiontype == ns1blankspace.data.actionTypes.bulkEmail.id)
			{
				if (ns1blankspace.objectContextData.actiontype == ns1blankspace.data.actionTypes.bulkEmail.id)
				{
					iMessageActionID = ns1blankspace.objectContextData.objectcontext;
				}
				else
				{
					iMessageActionID = ns1blankspace.objectContextData.id;
				}
			}

			if (ns1blankspace.objectContextData.actiontype == ns1blankspace.data.actionTypes.fileNote.id && ns1blankspace.objectContextData.object == 17)
					{iMessageActionID = ns1blankspace.objectContextData.objectcontext}
					
			if (iMessageActionID != undefined)
			{
				ns1blankspace.messaging.imap.init({autoShow: false, action: 2});
				ns1blankspace.messaging.imap.actions.search.send(
				{
					xhtmlElementID: '-' + iMessageActionID
				});	
			}
			else
			{
				ns1blankspace.app.context({inContext: false, new: false, action: true, actionOptions: true});
					
				var sHTML = ns1blankspace.objectContextData.subject.formatXHTML();
					
				oDate = moment(ns1blankspace.objectContextData.duedatetime, ns1blankspace.option.dateFormats);
				
				if (oDate.isValid())
				{
					sHTML = sHTML + '<br /><span id="ns1blankspaceControlContext_date" class="ns1blankspaceSub">' + oDate.format('DD MMM YYYY') + '</span>';

					if (oDate.hours() != 0 || oDate.minutes() != 0)
					{
						sHTML = sHTML + '<br /><span id="ns1blankspaceControlContext_time" class="ns1blankspaceSub">' + oDate.format('h:mm A') + '</span>';
					}	
				}
				
				$('#ns1blankspaceControlContext').html(sHTML);
						
				ns1blankspace.history.view(
				{
					newDestination: 'ns1blankspace.action.init({id: ' + ns1blankspace.objectContext + '})',
					move: false
				});
				
				ns1blankspace.history.control({functionDefault: 'ns1blankspace.action.summary()'});		
			}
			
			//if (ns1blankspace.objectContext != -1) {ns1blankspace.action.summary()}		v2.0.1 Was displaying 'Can't find the action' while searching
		}	
	},	
		
	summary: function ()
	{
		var aHTML = [];

		if (ns1blankspace.objectContextData == undefined)
		{
			aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the action.</td></tr></table>');
					
			$('#ns1blankspaceMainSummary').html(aHTML.join(''));
		}
		else
		{
			aHTML.push('<table class="ns1blankspaceMain">' +
							'<tr class="ns1blankspaceRow">' +
							'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
							'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2" style="width:350px;"></td>' +
							'</tr>' +
							'</table>');				
			
			$('#ns1blankspaceMainSummary').html(aHTML.join(''));
			
			var aHTML = [];

			aHTML.push('<table class="ns1blankspace">');
		
			if (ns1blankspace.objectContextData.contactbusinesstext != '')
			{
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Business</td></tr>' +
								'<tr><td id="ns1blankspaceSummaryBusiness" data-id="' + ns1blankspace.objectContextData.contactbusiness + '" data-object="contactBusiness" class="ns1blankspaceSummary ns1blankspaceViewLink">' +
								ns1blankspace.objectContextData.contactbusinesstext +
								'</td></tr>');
			}
			
			if (ns1blankspace.objectContextData.contactpersontext != '')
			{
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Person</td></tr>' +
								'<tr><td id="ns1blankspaceSummaryPerson" data-id="' + ns1blankspace.objectContextData.contactperson + '" data-object="contactPerson" class="ns1blankspaceSummary ns1blankspaceViewLink">' +
								ns1blankspace.objectContextData.contactpersontext +
								'</td></tr>');
			}
		
			if (ns1blankspace.objectContextData.duedatetime != '')
			{
				var oDate = new Date(ns1blankspace.objectContextData.duedatetime);
					
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Date</td></tr>' +
								'<tr><td id="ns1blankspaceSummaryDate" class="ns1blankspaceSummary">' +
								oDate.toString("ddd, dd MMM yyyy") +
								'</td></tr>');
			
				if (oDate.getHours() != 0 || oDate.getMinutes() != 0)
				{
					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Time</td></tr>' +
								'<tr><td id="ns1blankspaceSummaryTime" class="ns1blankspaceSummary">' +
								oDate.toString("h:mm tt") +
								'</td></tr>');
				}					
			
			}

			if (false && ns1blankspace.objectContextData.actiontypetext != '')
			{
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Type</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryType" class="ns1blankspaceSummary">' +
							ns1blankspace.objectContextData.actiontypetext +
							'</td></tr>');
			}		
			
			if (ns1blankspace.objectContextData.statustext != '')
			{
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Status</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryStatus" class="ns1blankspaceSummary">' +
							ns1blankspace.objectContextData.statustext +
							'');

				if (ns1blankspace.objectContextData.completed != '' && ns1blankspace.objectContextData.statustext == 'Completed')
				{
					aHTML.push(' (' +
							ns1blankspace.objectContextData.completed +
							')');
				}

				aHTML.push('</td></tr>');
			}

			if (ns1blankspace.objectContextData.prioritytext != '')
			{
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Priority</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryPriority" class="ns1blankspaceSummary">' +
							ns1blankspace.objectContextData.prioritytext +
							'</td></tr>');
			}		

			aHTML.push('</table>');		

			$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

			if (ns1blankspace.objectContextData.description != '' ||
				(ns1blankspace.objectContextData.text != '' && ns1blankspace.option.showActionText) ||
				ns1blankspace.objectContextData.actiontypetext != '')
			{

				var aHTML = [];

				aHTML.push('<table class="ns1blankspaceColumn2">');

				if (ns1blankspace.objectContextData.actiontypetext != '')
				{
					
					var sColour = ns1blankspace.objectContextData['action.actiontype.textcolour'];
					if (sColour == '') {sColour = '#FFFFFF'}

					var sBackgroundColour = ns1blankspace.objectContextData['action.actiontype.backgroundcolour'];
					if (sBackgroundColour == '') {sBackgroundColour = '#B8B8B8'}

					aHTML.push('<tr><td id="ns1blankspaceSummaryActionType" class="ns1blankspaceSummary"' +
									'style="padding:8px; text-align:center; font-size:0.875em; border-radius:4px; font-weight:bold; color:' + sColour + '; ' +
										'background-color:' + sBackgroundColour + ';"' +
									'>' +
									ns1blankspace.objectContextData.actiontypetext +
									'</td></tr>');
				}

				if (ns1blankspace.objectContextData.description != '')
				{
					aHTML.push('<tr><td id="ns1blankspaceSummaryDescription" class="ns1blankspaceSummary ns1blankspaceSub" style="font-size: 0.875em; padding-top:18px;">' +
									ns1blankspace.util.toBR(ns1blankspace.objectContextData.description.formatXHTML()) +
									'</td></tr>');
				}

				if (ns1blankspace.objectContextData.text != '' && ns1blankspace.option.showActionText)
				{
					aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Text</td></tr>' +
									'<tr><td id="ns1blankspaceSummaryText" class="ns1blankspaceSummary ns1blankspaceSub" style="font-size: 0.875em;">' +
									ns1blankspace.objectContextData.text.formatXHTML() +
									'</td></tr>');
				}

				aHTML.push('</table>');		

				$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));
			}
		}
	},
	
	details: function ()
	{
		var aHTML = [];
	
		if ($('#ns1blankspaceMainDetails').attr('data-loading') == '1')
		{
			$('#ns1blankspaceMainDetails').attr('data-loading', '');
					
			aHTML.push('<table class="ns1blankspaceContainer">');
			aHTML.push('<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceDetailsColumn1" class="ns1blankspaceColumn1"></td>' +
							'<td id="ns1blankspaceDetailsColumn2" class="ns1blankspaceColumn2"></td>' +
							'</tr>');
			aHTML.push('</table>');					
			
			$('#ns1blankspaceMainDetails').html(aHTML.join(''));

			var aHTML = [];
			
			aHTML.push('<table class="ns1blankspace">');
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Subject' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsSubject" class="ns1blankspaceText">' +
							'</td></tr>');			
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Date' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceDate">' +
							'<input id="ns1blankspaceDetailsDate" class="ns1blankspaceDate">' +
							'</td></tr>');		
				
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Type' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceSelect">' +
							'<input id="ns1blankspaceDetailsType" class="ns1blankspaceSelect"' +
									' data-method="SETUP_ACTION_TYPE_SEARCH"' +
									' data-cache="true">' +
							'</td></tr>');		
									
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Action By' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceSelect">' +
							'<input id="ns1blankspaceDetailsActionBy" class="ns1blankspaceSelect"' +
									' data-method="SETUP_USER_SEARCH"' +
									' data-columns="username-space-hyphen-space-user.contactperson.firstname-space-user.contactperson.surname"' +
									' data-search="firstname-TEXT_IS_LIKE|surname-TEXT_IS_LIKE|username-TEXT_IS_LIKE"' +
									' data-click="ns1blankspace.action.actionByPostClick">' +
							'</td></tr>');	
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Business' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsBusiness" class="ns1blankspaceSelect"' +
								' data-method="CONTACT_BUSINESS_SEARCH"' +
								' data-columns="tradename">' +
							'</td></tr>');	
				
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Person' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsPerson" class="ns1blankspaceSelect"' +
								' data-method="CONTACT_PERSON_SEARCH"' +
								' data-columns="firstname-space-surname"' +
								' data-parent="ns1blankspaceDetailsBusiness"' +
								' data-parent-search-id="contactbusiness"' +
								' data-parent-search-text="tradename">' +
							'</td></tr>');							
					
			aHTML.push('</table>');					
			
			$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
			
			/*$('input.ns1blankspaceDate').datetimepicker({ 
				dateFormat: 'dd M yy',
				timeFormat: 'h:mm TT',
				stepMinute: 5,
				ampm: true
				});*/

			ns1blankspace.util.initDatePicker(
			{
				select: 'input.ns1blankspaceDate',
				time: true
			});
			
			var aHTML = [];
				
			aHTML.push('<table class="ns1blankspaceColumn2">');
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Status' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioStatus2" name="radioStatus" value="2"/>Not Started' +
								'<br /><input type="radio" id="radioStatus4" name="radioStatus" value="4"/>In Progress' +
								'<br /><input type="radio" id="radioStatus3" name="radioStatus" value="3"/>Cancelled' +
								'<br /><input type="radio" id="radioStatus1" name="radioStatus" value="1"/>Completed' +
							'</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Duration (Minutes)' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceDate">' +
							'<input id="ns1blankspaceDetailsDurationMinutes" class="ns1blankspaceText" style="width:120px;">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Priority' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioPriority" name="radioPriority" value=""/><i>Not Set</i>' +
								'<br /><input type="radio" id="radioBillingPriority1" name="radioPriority" value="1"/>Low' +
								'<br /><input type="radio" id="radioPriority2" name="radioPriority" value="2"/>Medium' +
								'<br /><input type="radio" id="radioPriority3" name="radioPriority" value="3"/>High' +		
								'<br /><input type="radio" id="radioPriority4" name="radioPriority" value="4"/>Critical' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Billing' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioBillingStatus3" name="radioBillingStatus" value="3"/>Not sure' +
								'<br  /><input type="radio" id="radioBillingStatus2" name="radioBillingStatus" value="2"/>Don\'t bill' +
								'<br /><input type="radio" id="radioBillingStatus1" name="radioBillingStatus" value="1"/>Billable' +		
								'<br /><input type="radio" id="radioBillingStatus4" name="radioBillingStatus" value="4"/>Approved for billing' +
								'<br /><input type="radio" id="radioBillingStatus5" name="radioBillingStatus" value="5"/>Has been billed' +
							'</td></tr>');

			aHTML.push('</table>');					
				
			$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

			if (ns1blankspace.objectContextData != undefined)
			{
				$('#ns1blankspaceDetailsSubject').val(ns1blankspace.objectContextData.subject.formatXHTML());
				
				var sDate = moment(ns1blankspace.objectContextData.duedatetime, ns1blankspace.option.dateFormats).format('DD MMM YYYY h:mm a');
				$('#ns1blankspaceDetailsDate').val(sDate);
				
				$('#ns1blankspaceDetailsType').attr("data-id", ns1blankspace.objectContextData.actiontype);
				$('#ns1blankspaceDetailsType').val(ns1blankspace.objectContextData.actiontypetext);
				$('#ns1blankspaceDetailsActionBy')
					.attr("data-id", ns1blankspace.objectContextData.actionby)
					.val(ns1blankspace.objectContextData.actionbytext.formatXHTML() + ' - ' +
								ns1blankspace.objectContextData['action.actionby.contactperson.firstname'].formatXHTML() + 
								' ' + ns1blankspace.objectContextData['action.actionby.contactperson.surname'].formatXHTML())
					.attr('data-contactperson', ns1blankspace.objectContextData['action.actionby.contactperson'])
					.attr('data-email', ns1blankspace.objectContextData['action.actionby.contactperson.email'])
					.attr('data-contactpersontext', ns1blankspace.objectContextData['action.actionby.contactperson.firstname'].formatXHTML() + 
								' ' + ns1blankspace.objectContextData['action.actionby.contactperson.surname'].formatXHTML());

				$('[name="radioStatus"][value="' + ns1blankspace.objectContextData.status + '"]').attr('checked', true);
				$('[name="radioBillingStatus"][value="' + ns1blankspace.objectContextData.billingstatus + '"]').attr('checked', true);
				$('[name="radioPriority"][value="' + ns1blankspace.objectContextData.priority + '"]').attr('checked', true);
				
				$('#ns1blankspaceDetailsBusiness').attr("data-id", ns1blankspace.objectContextData.contactbusiness);
				$('#ns1blankspaceDetailsBusiness').val(ns1blankspace.objectContextData.contactbusinesstext.formatXHTML());
				
				$('#ns1blankspaceDetailsPerson').attr("data-id", ns1blankspace.objectContextData.contactperson);
				$('#ns1blankspaceDetailsPerson').val(ns1blankspace.objectContextData.contactpersontext.formatXHTML());

				$('#ns1blankspaceDetailsDurationMinutes').val(ns1blankspace.objectContextData.totaltimemin);
			}
			else
			{
				$('#ns1blankspaceDetailsDate').val(moment().format('DD MMM YYYY h:mm a'));

				$('[name="radioStatus"][value="1"]').attr('checked', true);
				$('[name="radioBillingStatus"][value="3"]').attr('checked', true);
				
				if (ns1blankspace.data.contactbusiness != undefined)
				{$('#ns1blankspaceDetailsBusiness').attr("data-id", ns1blankspace.action.contactbusiness);}
				
				if (ns1blankspace.data.contactbusinesstext != undefined)
				{$('#ns1blankspaceDetailsBusiness').val(ns1blankspace.action.contactbusinesstext.formatXHTML());}
				
				if (ns1blankspace.data.contactperson != undefined)
				{$('#ns1blankspaceDetailsPerson').attr("data-id", ns1blankspace.action.contactperson);}
				
				if (ns1blankspace.data.contactpersontext != undefined)
				{$('#ns1blankspaceDetailsPerson').val(ns1blankspace.action.contactpersontext.formatXHTML());}

				$('#ns1blankspaceDetailsActionBy').attr("data-id", ns1blankspace.user.id);
				$('#ns1blankspaceDetailsActionBy').val(ns1blankspace.user.logonName.formatXHTML());
			}
		}	
	},

	actionByPostClick: function()
	{
		// Get id and name of user's contactperson record
		if ($('#ns1blankspaceDetailsActionBy').attr('data-id'))
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'SETUP_USER_SEARCH';
			oSearch.addField('user.contactperson,user.contactperson.firstname,user.contactperson.surname,user.contactperson.email');
			oSearch.addFilter('id', 'EQUAL_TO', $('#ns1blankspaceDetailsActionBy').attr('data-id'));
			oSearch.getResults(function(oResponse)
			{
				if (oResponse.status == 'OK' && oResponse.data.rows.length > 0)
				{
					var oRow = oResponse.data.rows[0];
					$('#ns1blankspaceDetailsActionBy')
						.attr('data-contactperson', oRow['user.contactperson'])
						.attr('data-contactpersontext', oRow['user.contactperson.firstname'].formatXHTML() + 
									' ' + oRow['user.contactperson.surname'].formatXHTML())
						.attr('data-email', oRow['user.contactperson.email'].formatXHTML());
				}
			});
		}
	},

	description: function ()
	{	
		var aHTML = [];
		
		if ($('#ns1blankspaceMainDescription').attr('data-loading') == '1')
		{
			$('#ns1blankspaceMainDescription').attr('data-loading', '');
				
			aHTML.push('<table class="ns1blankspaceContainer">');
			aHTML.push('<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceDescriptionColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
							'<td id="ns1blankspaceDescriptionColumn2" class="ns1blankspaceColumn2" width="100px"></td>' +
							'</tr>');
			aHTML.push('</table>');					
			
			$('#ns1blankspaceMainDescription').html(aHTML.join(''));
			
			var aHTML = [];
			
			aHTML.push('<table class="interfaceMain">');
					
			aHTML.push('<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceTextMulti">' +
							'<textarea rows="50" cols="150" style="height: 400px" id="ns1blankspaceDescription" class="ns1blankspaceTextMulti ns1blankspaceTextMultiLarge"></textarea>' +
							'</td></tr>');
							
			aHTML.push('</table>');					
			
			$('#ns1blankspaceDescriptionColumn1').html(aHTML.join(''));
			
			if (ns1blankspace.objectContextData != undefined)
			{
				$('#ns1blankspaceDescription').val(unescape(ns1blankspace.objectContextData.description).formatXHTML());
			}
		}	
	},

	text: function ()
	{	// v2.0.4b Allow users to edit Text field
		var aHTML = [];
		
		if ($('#ns1blankspaceMainText').attr('data-loading') == '1')
		{
			ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;
			$('#ns1blankspaceMainText').attr('data-loading', '');
				
			aHTML.push('<table class="ns1blankspaceContainer">' +
						'<tr class="ns1blankspaceContainer">' +
						'<td class="ns1blankspaceCaption">Format</td>' +
						'<td class="ns1blankspaceText">' +
							'<input type="radio" id="radioShowHTML" name="radioShowType" value="HTML"/>HTML' +
							'&nbsp;&nbsp;<input type="radio" id="radioShowText" name="radioShowType" value="TEXT"/>Text' +
						'</td>' +
						'<td id="ns1blankspaceTextColumn2" class="ns1blankspaceColumn2Action" style="width:50px;"></td></tr>' +
						'<tr class="ns1blankspaceContainer">' +
						'<td colspan="3" id="ns1blankspaceTextColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
						'</tr>' + 
						'</table>');		
			
			$('#ns1blankspaceMainText').html(aHTML.join(''));
			
			// Default format to Text
			$('[name="radioShowType"][value="TEXT"]').attr('checked', true);

			// Bind click of document type
			$('[name="radioShowType"]').click(function()
			{
				if ($('input[name="radioShowType"]:checked').val() == 'HTML')
				{
					ns1blankspace.format.editor.init(
					{
						selector: '#ns1blankspaceText' + ns1blankspace.counter.editor
					});
				}
				else
				{
					tinyMCE.execCommand('mceRemoveControl', false, 'ns1blankspaceText' + ns1blankspace.counter.editor);
				}
			});
			

			var aHTML = [];
			
			aHTML.push('<table class="ns1blankspace">');
					
			aHTML.push('<tr class="ns1blankspaceMainTextMulti">' +
							'<td class="ns1blankspaceMainTextMulti" style="height:600px;">' +
							'<textarea rows="10" cols="60" name="ns1blankspaceText" style="height:500px;"' + 
							' id="ns1blankspaceText' + ns1blankspace.counter.editor +
							'" class="ns1blankspaceTextMultiLarge tinymceAdvanced"></textarea>' +
							'</td></tr>');
							
			aHTML.push('</table>');					
			
			$('#ns1blankspaceTextColumn1').html(aHTML.join(''));

			if (ns1blankspace.objectContextData != undefined)
			{
				$('#ns1blankspaceText' + ns1blankspace.counter.editor).val(unescape(ns1blankspace.objectContextData.text).formatXHTML());
			}
		}	
	},

	reminders: 
	{	// v2.0.4 Added Reminders
		show: function(oParam)
		{	// Show list of reminders linked to the action

			if (oParam == undefined) {oParam = {}}
			var aHTML = [];
			var iObject = ns1blankspace.util.getParam(oParam, 'object', {'default': ns1blankspace.object}).value;
			var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext', {'default': ns1blankspace.objectContext}).value;
			var sXHTMLElementContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {'default': 'ns1blankspaceMainReminders'}).value;
			var bShowAdd = ns1blankspace.util.getParam(oParam, 'showAdd', {'default': true}).value;
			var oActions = ns1blankspace.util.getParam(oParam, 'actions', {'default': {add: true}}).value;
			var oContext = ns1blankspace.util.getParam(oParam, 'context', {'default': {inContext: false}}).value;
			var sXHTMLElementID = 'ns1blankspaceRemindersColumn1';
			var bShowDescription = ns1blankspace.util.getParam(oParam, 'showAdd', {'default': false}).value;
			var iMoreID = ns1blankspace.util.getParam(oParam, 'moreID').value;
			var iRows = ns1blankspace.util.getParam(oParam, 'rows', {'default': ns1blankspace.option.defaultRows}).value;

			if (!$('#ns1blankspaceRemindersColumn1').is('*')
				|| (ns1blankspace.objectContextData && ns1blankspace.objectContextData.reminders == undefined))
			{
				aHTML.push('<table id="ns1blankspace" class="ns1blankspace">' +
							'<tr>' +
							'<td id="ns1blankspaceRemindersColumn1" class="ns1blankspaceColumn1Flexible">' +
							ns1blankspace.xhtml.loading +
							'</td>' +
							'<td id="ns1blankspaceRemindersColumn2" class="ns1blankspaceColumn2" style="display:none;">' +
							'</td>' +
							'</tr><table>');
											
				$('#' + sXHTMLElementContainerID).html(aHTML.join(''));
				aHTML = [];
			}

			if (ns1blankspace.objectContextData && ns1blankspace.objectContextData.reminders == undefined)
			{
				oParam.onComplete = ns1blankspace.action.reminders.show;
				ns1blankspace.action.reminders.search(oParam);
			}
			else if (ns1blankspace.objectContextData == undefined)
			{
				$('#ns1blankspaceRemindersColumn1').html('Please create a new Action before adding a reminder.');
			}
			else
			{
				if (!$('#ns1blankspaceReminderEditColumn1').is('*'))
				{
					if (oActions.add)
					{
						if (ns1blankspace.app.context) {ns1blankspace.app.context(oContext)};

						aHTML.push('<table class="ns1blankspaceColumn2">');
						
						aHTML.push('<tr><td class="ns1blankspaceAction">' +
										'<span id="ns1blankspaceRemindersAdd">Add</span>' +
										'</td></tr>');
												
						aHTML.push('</table>');					
						
						$('#ns1blankspaceRemindersColumn2').html(aHTML.join('')).show();
						
						$('#ns1blankspaceRemindersAdd').button(
						{
							label: "Add"
						})
						.click(function()
						{
							// Sets default send to person as ActionBy user
							oParam.rowID = 0;
							if ($('#ns1blankspaceDetailsActionBy').attr('data-contactperson')) {oParam.sendTo = $('#ns1blankspaceDetailsActionBy').attr('data-contactperson');}
							if ($('#ns1blankspaceDetailsActionBy').attr('data-contactpersontext')) {oParam.sendToText = $('#ns1blankspaceDetailsActionBy').attr('data-contactpersontext')};
							if ($('#ns1blankspaceDetailsDate').val()) {oParam.sendAtDate = $('#ns1blankspaceDetailsDate').val()};
							ns1blankspace.action.reminders.edit(oParam);
						});
					}

					aHTML = [];
					aHTML.push('<table id="ns1blankspaceReminders" class="ns1blankspace">');
				
					aHTML.push('<tr class="ns1blankspaceCaption">');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">Reminder Due</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">Reminder Type</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">Recipient</td>');

					if (bShowDescription)
					{
						aHTML.push('<td class="ns1blankspaceHeaderCaption">Notes</td>');
					}

					aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
					aHTML.push('</tr>');

					if (ns1blankspace.objectContextData.reminders.length === 0)
					{
						aHTML.push('<tr><td colspan="' + (bShowDescription ? 5 : 4) + '" class="ns1blankspaceNothing">No reminders.</td>' +
										'</tr>');
						
						$('#ns1blankspaceRemindersColumn1').html(aHTML.join(''));
						$('#ns1blankspaceRemindersColumn1').show(ns1blankspace.option.showSpeed);
					}
					else
					{
						$.each(ns1blankspace.objectContextData.reminders, function()
						{	
							aHTML.push(ns1blankspace.action.reminders.row(this, oParam));
						});
				    	
						aHTML.push('</table>');
						
						$.extend(true, oParam, 
						{
							xhtmlElementID: sXHTMLElementID,
							xhtmlContext: 'ReminderEdit',
							xhtml: aHTML.join(''),
							showMore: (iMoreID != undefined ? true : false),
							more: iMoreID,
							rows: iRows,
							functionShowRow: ns1blankspace.action.reminders.row,
							functionOnNewPage: ns1blankspace.action.reminders.bind,
						});
						ns1blankspace.render.page.show(oParam); 
					}
				}				
			}
		},

		search: function(oParam)
		{	// Search for reminders 
			if (oParam == undefined) {oParam = {}}
			var iObject = ns1blankspace.util.getParam(oParam, 'object', {'default': ns1blankspace.object}).value;
			var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext', {'default': ns1blankspace.objectContext}).value;
			if (oParam.reminderSearchStep == undefined) {oParam.reminderSearchStep = 1}

			// Find we find the ReminderTemplate if not already found
			if (oParam.reminderSearchStep == 1)
			{
				oParam.reminderSearchStep = 2;	
				oParam.onComplete = ns1blankspace.action.reminders.search;
				oParam.template = 'action';
				ns1blankspace.util.initTemplate(oParam);
			}

			else if (oParam.reminderSearchStep == 2)
			{
				delete(oParam.reminderSearchStep);
				var oSearch = new AdvancedSearch();
				oSearch.method = 'MESSAGING_OBJECT_ALERT_SEARCH';
				oSearch.addField('*');
				oSearch.addFilter('object', 'EQUAL_TO', iObject); 		// Action
				oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
				oSearch.sort('createddate', 'desc');
				oSearch.getResults(function(oResponse)
				{
					if (oResponse.status == 'OK')
					{
						ns1blankspace.objectContextData.reminders = oResponse.data.rows;
						oParam.moreID = (oResponse.morerows == "true" ? oResponse.moreid : undefined);
						oParam.rows = (oResponse.morerows == "true" ? oResponse.rows : undefined);

						ns1blankspace.action.reminders.show(oParam);
					}
					else
					{
						ns1blankspace.status.error('Error finding reminders: ' + oResponse.error.errornotes);
					}
				});
			}
		},

		row: function(oRow)
		{	// Construct each row to display in list of reminders
			var aHTML = [];
			var dSendAt = new Date(ns1blankspace.objectContextData.duedatetime);
			dSendAt = (oRow['alert.senddate'] != '')
						? new Date(oRow['alert.senddate'])
						: dSendAt.add(
						  {
						  	days: (-1 * parseInt(oRow['alert.senddays'])), 
						  	hours: (-1 * parseInt(oRow['alert.sendhours'])),
						  	minutes: (-1 * parseInt(oRow['alert.sendminutes']))
						  });

			if ($.grep(ns1blankspace.objectContextData.reminders, function(x) {return x.id == oRow.id}).length == 0)
			{
				ns1blankspace.objectContextData.reminders.push(oRow);	
			}

			aHTML.push('<tr data-rowID="' + oRow['alert.id'] + '">');

			aHTML.push('<td id="ns1blankspaceReminderDue_' + oRow['alert.id'] + '" class="ns1blankspaceRow ns1blankspaceRecipientEdit">' +
									dSendAt.toString('dd MMM yyyy HH:mm') + '</td>');

			aHTML.push('<td id="ns1blankspaceReminderType_' + oRow['alert.id'] + '" class="ns1blankspaceRow ns1blankspaceRecipientEdit">' +
									oRow['alert.deliverytypetext'] + '</td>');

			aHTML.push('<td id="ns1blankspaceReminderRecipient_' + oRow['alert.id'] + '" class="ns1blankspaceRow ns1blankspaceRecipientEdit">' +
									oRow['alert.recipientcontactpersontext'] + '</td>');

			aHTML.push('<td id="ns1blankspaceRecipientActions_' + oRow['alert.id'] + '">' +
							'<span class="ns1blankspaceRecipientRemove" id="ns1blankspaceRecipientRemove_' + oRow['alert.id'] + '" data-id="' + oRow['alert.id'] + '"></span>' +
						'</td>');

			return aHTML.join('');
		},

		bind: function(oParam)
		{	// Bind each row - click on columns to edit, click on Remove action to delete
			var sXHTMLContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlContainerID', {"default": 'ns1blankspaceRenderPage_Action-0'}).value;
			sXHTMLContainerID = ($('#' + sXHTMLContainerID).is('*') ? sXHTMLContainerID : oParam.xhtmlElementID);
			
			// Bind remove buttons
			$('#' + sXHTMLContainerID + ' .ns1blankspaceRecipientRemove')
			.button(
			{
				text: false,
				label: "Add",
				icons: {primary: 'ui-icon-close'}
			})
			.css('height', '20px')
			.css('width', '20px') 
			.on('click', function()
			{
				ns1blankspace.remove(
				{
					xhtmlElementID: this.id,
					method: 'MESSAGING_OBJECT_ALERT_MANAGE',
					parentLevel: 2,
					ifNoneMessage: 'No reminders.'
				});
			});

			// Bind Edit (on click of the row)
			$('#' + sXHTMLContainerID + ' .ns1blankspaceRecipientEdit')
			.css('cursor', 'pointer')
			.on('click', function()
			{
				oParam.parentRowElement = $(this).parent();
				ns1blankspace.action.reminders.edit(oParam);
			});
		},

		edit: function(oParam)
		{	// Allow user to edit details of the reminder
			var oEditRowElement = ns1blankspace.util.getParam(oParam, 'parentRowElement', {'default': $('td.ns1blankspaceHeaderCaption:visible').first().parent()}).value;
			var iRowID = ns1blankspace.util.getParam(oParam, 'rowID', {'default': $(oEditRowElement).attr('data-rowid')}).value;
			var oReminder = $.grep(ns1blankspace.objectContextData.reminders, function(x) {return x['alert.id'] == iRowID}).shift();
			var sSendTo = ns1blankspace.util.getParam(oParam, 'sendTo', {'default': ns1blankspace.objectContextData['action.actionby.contactperson']}).value;
			var sSendToText = ns1blankspace.util.getParam(oParam, 'sendToText', 
							{'default': ns1blankspace.objectContextData['action.actionby.contactperson.firstname'].formatXHTML() + ' ' + ns1blankspace.objectContextData['action.actionby.contactperson.surname'].formatXHTML()}).value;
			var sSendAtDate = ($('#ns1blankspaceDetailsDate').is('*') ? $('#ns1blankspaceDetailsDate').val() : ns1blankspace.objectContextData.duedatetime);
			var aHTML = [];

			if ($('#ns1blankspaceReminderEditContainer-' + iRowID).is('*'))
			{	
				$('#ns1blankspaceReminderEditContainer-' + iRowID).parent().remove();
			}
			else
			{
				ns1blankspace.action.reminders.editCheckCacheData();

				aHTML.push('<tr class="ns1blankspaceRow">' +
								'<td colspan="' + $(oEditRowElement).children().length + '"' +
									' id="ns1blankspaceReminderEditContainer-' + iRowID + '">' +
								'</td></tr>');
				$(oEditRowElement).after(aHTML.join(''));

				aHTML = [];

				aHTML.push('<table class="ns1blankspaceSearchMedium" style="width: 100%;">' +
								'<tr><td id="ns1blankspaceReminderEditColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
								'<td id="ns1blankspaceReminderEditColumn2" class="ns1blankspaceColumn2" style="width:100px;"></td></tr>' +
							'</table>');

				$('#ns1blankspaceReminderEditContainer-' + iRowID).html(aHTML.join('')); 

				aHTML = [];

				aHTML.push('<table class="ns1blankspaceColumn2">');
				
				aHTML.push('<tr><td>' +
								'<span id="ns1blankspaceReminderEditSave" class="ns1blankspaceAction">Save</span>' +
							'<td></tr>');
				

				aHTML.push('<tr><td>' +
								'<span id="ns1blankspaceReminderEditCancel" class="ns1blankspaceAction">Cancel</span>' +
							'<td></tr>');

				aHTML.push('</table>');						

				$('#ns1blankspaceReminderEditColumn2').html(aHTML.join(''));

				$('#ns1blankspaceReminderEditCancel').button(
				{
					label: 'Cancel',
				})
				.click(function()
				{
					$('#ns1blankspaceReminderEditContainer-' + iRowID).parent().parent().remove();
				})
				.css('width', '75px');

				$('#ns1blankspaceReminderEditSave').button(
				{
					label: 'Save',
				})
				.click(function()
				{
					var oData = 
					{
						id: iRowID,
						subject: $('#ns1blankspaceReminderEditSubject').val(),
						deliverytype: $('input[name="radioDeliveryType"]:checked').val(),
						document: $('#ns1blankspaceReminderEditDocument').attr('data-id'),
						recipienttype: '2',		/* specifc person */
						recipientcontactperson: $('#ns1blankspaceReminderEditRecipient').attr('data-id'),
						object: '17',
						objectcontext: ns1blankspace.objectContext,
						senddate: '',
						senddays: '',
						sendhours: '',
						sendminutes: ''
					}

					if ($('.ns1blankspaceReminderSendAt').is(':visible'))
					{
						oData.senddate = $('#ns1blankspaceReminderEditSendAt').val();
					}
					else
					{
						$.extend(true, oData,
						{
							senddays: $('#ns1blankspaceReminderEditSendBeforeDays').attr('data-id'),
							sendhours: $('#ns1blankspaceReminderEditSendBeforeHours').attr('data-id'),
							sendminutes: $('#ns1blankspaceReminderEditSendBeforeMinutes').attr('data-id'),
						});
					}

					ns1blankspace.action.reminders.save(oParam, oData);
				})
				.css('width', '75px');

				aHTML = [];

				aHTML.push('<table class="ns1blankspace">');

				aHTML.push('<tr><td class="ns1blankspaceCaption">Reminder Type</td></tr>' + 
							'<tr><td class="ns1blankspaceText">' +
								'<input type="radio" id="radioDeliveryType1" name="radioDeliveryType" value="1">Email' +
								'&nbsp;&nbsp;<input type="radio" id="radioDeliveryType2" name="radioDeliveryType" value="2">SMS' +
							'</td></tr>');

				aHTML.push('<tr class="ns1blankspaceReminderSubject"><td class="ns1blankspaceCaption">Email Subject</td></tr>' + 
							'<tr class="ns1blankspaceReminderSubject"><td class="ns1blankspaceText">' +
								'<input class="ns1blankspaceText" id="ns1blankspaceReminderEditSubject">' +
							'</td></tr>');

				aHTML.push('<tr><td class="ns1blankspaceCaption">Send Reminder To</td></tr>' + 
							'<tr><td class="ns1blankspaceSelect">' +
								'<input class="ns1blankspaceSelect" id="ns1blankspaceReminderEditRecipient"' +
									' data-method="CONTACT_PERSON_SEARCH"' +
									' data-methodFilter="firstname-TEXT_IS_LIKE|surname-TEXT_IS_LIKE|email-IS_NOT_NULL-|email-TEXT_IS_LIKE-@"' +
									' data-columns="firstname-space-surname"' +
									' data-mandatory="1" data-caption="Send Reminder To"' +
								'>' +
							'</td></tr>');

				aHTML.push('<tr><td class="ns1blankspaceCaption">Template</td></tr>' + 
							'<tr><td class="ns1blankspaceSelect">' +
								'<input class="ns1blankspaceSelect" id="ns1blankspaceReminderEditDocument"' +
									' data-method="DOCUMENT_SEARCH"' +
									' data-methodFilter="title-TEXT_IS_LIKE|summary-TEXT_IS_LIKE|type-EQUAL_TO-10|object-EQUAL_TO-17"' +
									' data-mandatory="1" data-caption="Template Document"' +
								'>' +
							'</td></tr>');

				aHTML.push('<tr><td>&nbsp;</td></tr>');

				aHTML.push('<tr><td class="ns1blankspaceCaption">' +
								'<input type="radio" id="radioReminderSendOption-1" value="1" name="radioReminderSendOption">&nbsp;' +
								'Send At</td></tr>');
				aHTML.push('<tr class="ns1blankspaceReminderSendAt"><td><table class="ns1blankspace">');

				aHTML.push('<tr><td class="ns1blankspaceSelect">Date / Time</td></tr>' +
							'<tr><td class="ns1blankspaceDate">' +
								'<input class="ns1blankspaceDate" id="ns1blankspaceReminderEditSendAt">' +
							'</td></tr>');
				aHTML.push('</table></td></tr>');

				aHTML.push('<tr><td style="padding-top:10px; padding-bottom: 10px; font-weight: bold;">Or...</td></tr>');

				aHTML.push('<tr><td class="ns1blankspaceCaption">' +
								'<input type="radio" id="radioReminderSendOption-2" value="2" name="radioReminderSendOption">&nbsp;' +
								'Send Time Prior</td></tr>');

				aHTML.push('<tr class="ns1blankspaceReminderSendTimePrior"><td><table class="ns1blankspace">');

				aHTML.push('<tr><td class="ns1blankspaceSelect">Days:&nbsp;' +
								'<input class="ns1blankspaceSelect" id="ns1blankspaceReminderEditSendBeforeDays"' +
									 ' data-cache="true"' +
									 ' data-method="REMINDER_DAYS_SEARCH">' +
							'</td></tr>' +
							'<tr><td class="ns1blankspaceSelect">Hours:&nbsp;' +
								'<input class="ns1blankspaceSelect" id="ns1blankspaceReminderEditSendBeforeHours"' +
									 ' data-cache="true"' +
									 ' data-method="REMINDER_HOURS_SEARCH">' +
							'</td></tr>' +
							'<tr><td class="ns1blankspaceSelect">Minutes:&nbsp;' +
								'<input class="ns1blankspaceSelect" id="ns1blankspaceReminderEditSendBeforeMinutes"' +
									 ' data-cache="true"' +
									 ' data-method="REMINDER_MINUTES_SEARCH">' +
							'</td></tr>'
							);
 				aHTML.push('</table></td></tr>');

				aHTML.push('</table>');

				$('#ns1blankspaceReminderEditColumn1').html(aHTML.join(''));

				ns1blankspace.util.initDatePicker(
				{
					select: 'input.ns1blankspaceDate',
					time: true
				});

				$('[name="radioReminderSendOption"]').on('click', function()
				{
					if ($(this).val() == '1')
					{
						$('.ns1blankspaceReminderSendAt').show();	
						$('.ns1blankspaceReminderSendTimePrior').hide();
					}
					else
					{
						$('.ns1blankspaceReminderSendAt').hide();	
						$('.ns1blankspaceReminderSendTimePrior').show();	
					}
				});

				if (iRowID == 0 || oReminder['alert.senddate'] != '')
				{
					$('#radioReminderSendOption-1').click();
				}
				else
				{
					$('#radioReminderSendOption-2').click();	
				}

				$('[name="radioDeliveryType"]').on('click', function()
				{
					if ($(this).val() == '1')
					{
						$('.ns1blankspaceReminderSubject').show();	
					}
					else
					{
						$('.ns1blankspaceReminderSubject').hide();	
					}
				});

				if (oReminder != undefined)
				{
					$('#ns1blankspaceReminderEditSubject').val(oReminder['alert.subject'].formatXHTML());
					$('[name="radioDeliveryType"][value="' + oReminder['alert.deliverytype'] + '"]').attr('checked', true);
					$('#ns1blankspaceReminderEditRecipient').attr('data-id', oReminder['alert.recipientcontactperson']);
					$('#ns1blankspaceReminderEditDocument').val(oReminder['alert.documenttext']);
					$('#ns1blankspaceReminderEditDocument').attr('data-id', oReminder['alert.document']);
					$('#ns1blankspaceReminderEditRecipient').val(oReminder['alert.recipientcontactpersontext']);
					$('#ns1blankspaceReminderEditSendAt').val(oReminder['alert.senddate']);
					$('#ns1blankspaceReminderEditSendBeforeDays').val(oReminder['alert.senddays']);
					$('#ns1blankspaceReminderEditSendBeforeDays').attr('data-id', oReminder['alert.senddays']);
					$('#ns1blankspaceReminderEditSendBeforeHours').val(oReminder['alert.sendhours']);
					$('#ns1blankspaceReminderEditSendBeforeHours').attr('data-id', oReminder['alert.sendhours']);
					$('#ns1blankspaceReminderEditSendBeforeMinutes').val(oReminder['alert.sendminutes']);
					$('#ns1blankspaceReminderEditSendBeforeMinutes').attr('data-id', oReminder['alert.sendminutes']);
				}
				else
				{
					if (ns1blankspace.xhtml.templates.document && ns1blankspace.xhtml.templates.document.action)
					{
						$('#ns1blankspaceReminderEditDocument').val('ACTION TEMPLATE');
						$('#ns1blankspaceReminderEditDocument').attr('data-id', ns1blankspace.xhtml.templates.document.action);
					}
					$('[name="radioDeliveryType"][value="1"]').attr('checked', true);
					$('#ns1blankspaceReminderEditRecipient').attr('data-id', sSendTo);
					$('#ns1blankspaceReminderEditRecipient').val(sSendToText);
					$('#ns1blankspaceReminderEditSendAt').val(((sSendAtDate == undefined) ?  moment().format('DD MMM YYYY h:mm a') : sSendAtDate));
					$('#ns1blankspaceReminderEditSendBeforeDays').val('0');
					$('#ns1blankspaceReminderEditSendBeforeDays').attr('data-id', '0');
					$('#ns1blankspaceReminderEditSendBeforeHours').val('0');
					$('#ns1blankspaceReminderEditSendBeforeHours').attr('data-id', '0');
					$('#ns1blankspaceReminderEditSendBeforeMinutes').val('0');
					$('#ns1blankspaceReminderEditSendBeforeMinutes').attr('data-id', '0');
				}
			}
		},

		editCheckCacheData: function()
		{
			if ($.grep(ns1blankspace.data.search, function(x) {return x.method == 'REMINDER_DAYS_SEARCH'}).length == 0)
			{
				ns1blankspace.data.search.push(
				{
					method: 'REMINDER_DAYS_SEARCH',
					rows: 
					[
						{id: '0', title: '0'},
						{id: '1', title: '1'},
						{id: '2', title: '2'},
						{id: '3', title: '3'},
						{id: '4', title: '4'},
						{id: '5', title: '5'},
						{id: '6', title: '6'},
						{id: '7', title: '7'}
					]
				});
			}

			if ($.grep(ns1blankspace.data.search, function(x) {return x.method == 'REMINDER_HOURS_SEARCH'}).length == 0)
			{
				ns1blankspace.data.search.push(
				{
					method: 'REMINDER_HOURS_SEARCH',
					rows: 
					[
						{id: '0', title: '0'},
						{id: '1', title: '1'},
						{id: '2', title: '2'},
						{id: '3', title: '3'},
						{id: '4', title: '4'},
						{id: '5', title: '5'},
						{id: '6', title: '6'},
						{id: '7', title: '7'},
						{id: '8', title: '8'},
						{id: '9', title: '9'},
						{id: '10', title: '10'},
						{id: '11', title: '11'},
						{id: '12', title: '12'},
						{id: '13', title: '13'},
						{id: '14', title: '14'},
						{id: '15', title: '15'},
						{id: '16', title: '16'},
						{id: '17', title: '17'},
						{id: '18', title: '18'},
						{id: '19', title: '19'},
						{id: '20', title: '20'},
						{id: '21', title: '21'},
						{id: '22', title: '22'},
						{id: '23', title: '23'}
					]
				});
			}

			if ($.grep(ns1blankspace.data.search, function(x) {return x.method == 'REMINDER_MINUTES_SEARCH'}).length == 0)
			{
				ns1blankspace.data.search.push(
				{
					method: 'REMINDER_MINUTES_SEARCH',
					rows: 
					[
						{id: '0', title: '0'},
						{id: '5', title: '5'},
						{id: '10', title: '10'},
						{id: '15', title: '15'},
						{id: '20', title: '20'},
						{id: '25', title: '25'},
						{id: '30', title: '30'},
						{id: '35', title: '35'},
						{id: '40', title: '40'},
						{id: '45', title: '45'},
						{id: '50', title: '50'},
						{id: '55', title: '55'}
					]
				});
			}
		},

		validate: function()
		{
			var bValid = true;

			$.each($('#ns1blankspaceReminderEditColumn1 input[data-mandatory]'), function()
			{
				if ($(this).val() === ''
					|| ($(this).hasClass('ns1blankspaceSelect') && $(this).attr('data-id') == undefined))
				{
					bValid = false;
					ns1blankspace.status.message($(this).attr('data-caption') + ' is mandatory.');
					return false;
				}
			});

			// Reminder Type is a mandatory radio control
			if (bValid && $('input[name="radioDeliveryType"]:checked').val() === undefined) {

				bValid = false;
				ns1blankspace.status.message('Please choose a Reminder Type.');
				return;
			}

			if (bValid && $('.ns1blankspaceReminderEditSendAt').is(':visible'))
			{
				if ($('#ns1blankspaceReminderEditSendAt').val() == '')
				{
					ns1blankspace.status.error('Date / Time Sent At must be specified.');
					bValid = false
				}
			}
			else if (bValid && $('.ns1blankspaceReminderSendTimePrior').is(':visible'))
			{
				if ($('#ns1blankspaceReminderEditSendBeforeDays').val() != '0' && $('#ns1blankspaceReminderEditSendBeforeDays').attr('data-id') == undefined)
				{
					ns1blankspace.status.error('You must choose Days from the list.');
					bValid = false
				}
				else if ($('#ns1blankspaceReminderEditSendBeforeHours').val() != '0' && $('#ns1blankspaceReminderEditSendBeforeHours').attr('data-id') == undefined)
				{
					ns1blankspace.status.error('You must choose Hours from the list.');
					bValid = false
				}
				else if ($('#ns1blankspaceReminderEditSendBeforeMinutes').val() != '0' && $('#ns1blankspaceReminderEditSendBeforeMinutes').attr('data-id') == undefined)
				{
					ns1blankspace.status.error('You must choose Minutes from the list.');
					bValid = false
				}
			}

			return bValid;
		},

		save: function(oParam, oData)
		{	// Save reminder
			// If id is 0, then it's new so don't pass
			var iID = oData.id; 
			ns1blankspace.okToSave = ns1blankspace.action.reminders.validate();

			if (ns1blankspace.okToSave)
			{
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('MESSAGING_OBJECT_ALERT_MANAGE'),
					data: oData,
					success: function(oResponse)
					{
						if (oResponse.status == 'OK')
						{
							ns1blankspace.inputDetected = false;
							delete(ns1blankspace.objectContextData.reminders);
							ns1blankspace.action.reminders.show(oParam);
						}
						else
						{
							ns1blankspace.status.error('Error saving Reminder: ' + oResponse.error.errornotes);
						}
					}
				});
			}
		}
	},

	save: 		
	{			
		send: function (oParam, oResponse)
		{
			var iType = ns1blankspace.data.actionTypes.meeting;
			ns1blankspace.okToSave = true;
			
			if (oResponse == undefined)
			{
				if (oParam != undefined)
				{
					if (oParam.type != undefined) {iType = oParam.type}
					if (oParam.object == undefined) {oParam.object = ns1blankspace.object}
					if (oParam.objectContext == undefined) {oParam.objectContext = ns1blankspace.objectContext}
					if (oParam.actionBy == undefined) {oParam.actionBy = ns1blankspace.user.id}

					var sData = 'object=' + ns1blankspace.util.fs(oParam.object);
					sData += '&objectcontext=' + ns1blankspace.util.fs(oParam.objectContext);
					sData += '&subject=' + ns1blankspace.util.fs(oParam.subject);
					sData += '&description=' + ns1blankspace.util.fs(oParam.description);
					sData += '&priority=' + ns1blankspace.util.fs(oParam.priority);
					sData += '&status=' + ns1blankspace.util.fs(oParam.status);
					sData += '&actiontype=' + ns1blankspace.util.fs(iType);
					sData += '&date=' + ns1blankspace.util.fs(oParam.date);
					sData += '&enddate=' + ns1blankspace.util.fs(oParam.endDate);
					sData += '&actionby=' + ns1blankspace.util.fs(oParam.actionBy);
					sData += '&contactbusiness=' + ns1blankspace.util.fs(oParam.contactBusiness);
					sData += '&contactperson=' + ns1blankspace.util.fs(oParam.contactPerson);
					
					sData += (oParam.otherData == undefined ? '' : oParam.otherData)
				}	
				else	  
				{
					if (ns1blankspace.objectContext != -1)
					{
						var sData = 'id=' + ns1blankspace.objectContext;
					}
					else
					{
						var sData = 'id=';
					}
					
					if ($('#ns1blankspaceMainDetails').html() != '')
					{
						if ($('#ns1blankspaceDetailsActionBy').attr("data-id") == undefined) {$('#ns1blankspaceDetailsActionBy').attr("data-id", ns1blankspace.user.id)}
						sData += '&subject=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsSubject').val());
						sData += '&type=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsType').attr('data-id'));
						sData += '&date=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDate').val());
						sData += '&contactbusiness=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsBusiness').attr("data-id"));
						sData += '&contactperson=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsPerson').attr("data-id"));
						sData += '&actionby=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsActionBy').attr("data-id"));
						sData += '&status=' + ns1blankspace.util.fs($('input[name="radioStatus"]:checked').val());
						sData += '&billingstatus=' + ns1blankspace.util.fs($('input[name="radioBillingStatus"]:checked').val());
						sData += '&priority=' + ns1blankspace.util.fs($('input[name="radioPriority"]:checked').val());	
						sData += '&totaltimemin=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDurationMinutes').val());

						if ($('input[name="radioStatus"]:checked').val() == 1)
						{
							sData += '&completed=' + ns1blankspace.util.fs($('#ns1blankspaceDetailsDate').val());
						}	
					}
					
					var oParam = {};
					if ($('#ns1blankspaceMainDescription').html() != '' && $('#ns1blankspaceMainDescription').html() != undefined)
					{
						oParam.description = $('#ns1blankspaceDescription').val();
					}
					if ($('#ns1blankspaceMainText').html() != '' && $('#ns1blankspaceMainText').html() != undefined)
					{
						oParam.text = $('#ns1blankspaceText' + ns1blankspace.counter.editor).val();
					}
				}
				  
				// v2.0.4b If description is more than 6000 characters, then put it into text field (if text not passed)
				if (oParam.description || oParam.text)
				{
					if (ns1blankspace.util.fs(oParam.description).length > 6000 && (oParam.text == '' || oParam.text == undefined))
					{
						oParam.text = oParam.description;
						sData += '&description='; 		// blank out the descripton otherwise it won't be "moved"
					}
					else if (oParam.text && ns1blankspace.util.fs(oParam.description).length > 6000)
					{
						ns1blankspace.status.error('The description is longer than 6000 characters. Either remove some text or move to the Text field to avoid data being lost.');
						ns1blankspace.okToSave = false;
					}
					else 	// description is less than 6000 chars
					{
						sData += '&description=' + ns1blankspace.util.fs(oParam.description);
					}
				}

				if (oParam.text)
				{
					sData += '&text=' + ns1blankspace.util.fs(oParam.text);
				}
				
				if (ns1blankspace.okToSave)
				{
					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
						data: sData,
						dataType: 'json',
						success: function(data) {ns1blankspace.action.save.process(oParam, data);}
					});
				}
			}
		},	

		process: function (oParam, oResponse)
		{

			if (oResponse.status == 'OK')
			{
				ns1blankspace.status.message('Saved');
				ns1blankspace.objectContext = oResponse.id;	
				ns1blankspace.inputDetected = false;
			
				var dStartDate = new Date;
				var dEndDate = dStartDate;
				var sTitle = '';
				var sCalendarXHTMLElementID;
				
				if (oParam != undefined)
				{
					if (oParam.date != undefined) {sStartDate = oParam.date}
					if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
					if (oParam.title != undefined) {sTitle = oParam.title}
					if (oParam.calendarXHTMLElementID != undefined) {sCalendarXHTMLElementID = oParam.calendarXHTMLElementID}
				}	
			
				if (sCalendarXHTMLElementID != undefined)
				{
					$('#' + sCalendarXHTMLElementID).fullCalendar('renderEvent',
					{
						id: ns1blankspace.objectContext,
						title: sTitle,
						start: sStartDate, 
						end: sEndDate, 
						allDay: false},
						true
					);
				}
				
				ns1blankspace.inputDetected = false;
				ns1blankspace.action.search.send('-' + ns1blankspace.objectContext, {source: 1});
			}
			else
			{
				ns1blankspace.status.error(oResponse.error.errornotes);
			}
		}
	},

	calendar: 	
	{
		users: function (oParam, oResponse)
		{
			var bIncludeDisabled = ns1blankspace.util.getParam(oParam, 'includeDisabled', {default: false});

			if (oResponse == undefined && ns1blankspace.action.data.users == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_USER_SEARCH';
				oSearch.rows = 9999;
				oSearch.addField('username,disabled,user.contactperson.firstname,user.contactperson.surname');

				if (!bIncludeDisabled)
				{
					oSearch.addFilter('disabled', 'EQUAL_TO', 'N');
				}

				oSearch.getResults(function(data) {ns1blankspace.action.calendar.users(oParam, data)});
			}
			else
			{
				if (ns1blankspace.action.data.users == undefined && oResponse != undefined)
				{
					ns1blankspace.action.data.users = oResponse.data.rows;
				}

				var aHTML = [];

				aHTML.push('<div class="ns1blankspaceViewControlContainer row" style="font-size:0.75em; width:400px; padding:10px;">')

				aHTML.push('<div class="col-sm-12 ns1blankspaceMainCalendarControlUsers" style="word-break:break-word; padding:4px; cursor:pointer;" ' +
							'data-user="' + ns1blankspace.action.user + '">' +
							'Me</div>');

				$.each(ns1blankspace.action.data.users, function(u, user)
				{
					if (user.id != ns1blankspace.action.user)
					{
						aHTML.push('<div class="col-sm-6 ns1blankspaceMainCalendarControlUsers" style="word-break:break-word; padding:4px; cursor:pointer;" ' +
							'data-user="' + user.id + '">' +
							user['user.contactperson.firstname'] + ' ' +
							user['user.contactperson.surname'] +
							'</div>');
					}
				});

				aHTML.push('</div>');

				ns1blankspace.container.show(
				{
					xhtmlElementID: 'ns1blankspaceMainCalendarControlUsers',
					xhtml: aHTML.join(''),
					topOffset: 0
				});	

				$('div.ns1blankspaceMainCalendarControlUsers').click(function (event)
				{
					var iUser = $(this).attr('data-user');

					ns1blankspace.container.hide(
					{
						xhtmlElementID: 'ns1blankspaceMainCalendarControlUsers'
					});

					ns1blankspace.action.calendar.show(
					{
						user: iUser,
						username: $(this).html()
					});
				});
			}
		},

		actionTypes: function (oParam, oResponse)
		{
			var bOnlyShowInCalendar = ns1blankspace.util.getParam(oParam, 'onlyShowInCalendar', {default: false}).value;

			if (oResponse == undefined && ns1blankspace.action.data.actionTypes == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_ACTION_TYPE_SEARCH';
				oSearch.rows = 9999;
				oSearch.addField('title,showincalendar,backgroundColour,textcolour');

				if (bOnlyShowInCalendar)
				{
					oSearch.addFilter('showincalendar', 'EQUAL_TO', 'Y');
				}

				oSearch.sort('title', 'asc');

				oSearch.getResults(function(data) {ns1blankspace.action.calendar.actionTypes(oParam, data)});
			}
			else
			{
				if (ns1blankspace.action.data.actionTypes == undefined && oResponse != undefined)
				{
					ns1blankspace.action.data.actionTypes = oResponse.data.rows;
				}
				
				var sSearchText = $('#ns1blankspaceActionCalendarActionType').val();
				var aHTML = [];

				var actionTypes = _.filter(ns1blankspace.action.data.actionTypes, function (actionType)
				{
					return _.includes(_.lowerCase(actionType.title), _.lowerCase(sSearchText))
				});
					
				aHTML.push('<table style="width: 100%;" cellspacing=4>');

				$(actionTypes).each(function()
				{
					aHTML.push('<tr>' +
									'<td id="ns1blankspaceActionCalendarActionType-' + this.id + '" data-id="' + this.id + '" class="ns1blankspaceRowSelect">' +
									this.title +
									'</td></tr>');
				});		
									
				aHTML.push('</table>');
					
				$('#ns1blankspaceActionCalendarActionTypeResults').html(aHTML.join(''));

				$('#ns1blankspaceActionCalendarActionTypeResults td.ns1blankspaceRowSelect').click(function(event)
				{
					$('#ns1blankspaceActionCalendarActionType').val($(this).html());
					$('#ns1blankspaceActionCalendarActionType').attr('data-id', $(this).attr('data-id'));
					$('#ns1blankspaceActionCalendarActionTypeResults').html('');
				});
			}
		},

		person: function (oParam, oResponse)
		{
			var iContactBusiness = ns1blankspace.util.getParam(oParam, 'contactBusiness').value;
			if (iContactBusiness == undefined)
			{
				iContactBusiness = $('#ns1blankspaceActionCalendarBusiness').attr('data-id');
			}

			if (iContactBusiness == '') {iContactBusiness = undefined}

			if (oResponse == undefined)
			{
				var sSearchText = $('#ns1blankspaceActionCalendarPerson').val()

				var oSearch = new AdvancedSearch();
				oSearch.method = 'CONTACT_PERSON_SEARCH';
				oSearch.addField('firstname,surname,email');
				
				var aSearchText = sSearchText.split(' ');

				if (aSearchText.length > 1)
				{
					oSearch.addFilter('firstname', 'TEXT_STARTS_WITH', aSearchText[0]);
					oSearch.addFilter('surname', 'TEXT_STARTS_WITH', aSearchText[1]);
				}
				else
				{
					oSearch.addBracket('(');
					oSearch.addFilter('firstname', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('surname', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addBracket(')');
				}

				if (iContactBusiness != undefined)
				{
					oSearch.addFilter('contactbusiness', 'EQUAL_TO', iContactBusiness);
				}

				oSearch.sort('firstname', 'asc');

				oSearch.getResults(function(data) {ns1blankspace.action.calendar.person(oParam, data)});
			}
			else
			{
				var aHTML = [];

				aHTML.push('<table style="width: 100%;" cellspacing=4>');

				$(oResponse.data.rows).each(function()
				{
					aHTML.push('<tr>' +
									'<td id="ns1blankspaceActionCalendarPerson-' + this.id + '" data-id="' + this.id + '" class="ns1blankspaceRowSelect">' +
									this.firstname + ' ' + this.surname +
									'</td></tr>');
				});		
									
				aHTML.push('</table>');
					
				$('#ns1blankspaceActionCalendarPersonResults').html(aHTML.join(''));

				$('#ns1blankspaceActionCalendarPersonResults td.ns1blankspaceRowSelect').click(function(event)
				{
					$('#ns1blankspaceActionCalendarPerson').val($(this).html());
					$('#ns1blankspaceActionCalendarPerson').attr('data-id', $(this).attr('data-id'));
					$('#ns1blankspaceActionCalendarPersonResults').html('');
				});
			}
		},

		business: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var sSearchText = $('#ns1blankspaceActionCalendarBusiness').val();

				var oSearch = new AdvancedSearch();
				oSearch.method = 'CONTACT_BUSINESS_SEARCH';
				oSearch.addField('tradename,legalname');
				oSearch.addFilter('quicksearch', 'TEXT_IS_LIKE', sSearchText);
				oSearch.sort('tradename', 'asc');
				oSearch.getResults(function(data) {ns1blankspace.action.calendar.business(oParam, data)});
			}
			else
			{
				var aHTML = [];
					
				aHTML.push('<table style="width: 100%;" cellspacing=4>');

				$(oResponse.data.rows).each(function()
				{
					aHTML.push('<tr>' +
									'<td id="ns1blankspaceActionCalendarPerson-' + this.id + '" data-id="' + this.id + '" class="ns1blankspaceRowSelect">' +
									(this.tradename!=''?this.tradename:this.legalname) +
									'</td></tr>');
				});		
									
				aHTML.push('</table>');
					
				$('#ns1blankspaceActionCalendarBusinessResults').html(aHTML.join(''));

				$('#ns1blankspaceActionCalendarBusinessResults td.ns1blankspaceRowSelect').click(function(event)
				{
					$('#ns1blankspaceActionCalendarBusiness').val($(this).html());
					$('#ns1blankspaceActionCalendarBusiness').attr('data-id', $(this).attr('data-id'));
					$('#ns1blankspaceActionCalendarBusinessResults').html('');
				});
			}
		},

		show: function (oParam)
		{	
			var sXHTMLElementID = 'ns1blankspaceMainCalendar';		
			var bEventFetch = true;
			var iSourceObject = 17;
			var bAdvanced = true;
			var iUser;
			var sUsername = 'Me';

			if (ns1blankspace.action.data.username != undefined)
			{
				sUsername = ns1blankspace.action.data.username;
			}
			
			if (oParam != undefined)
			{
				if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
				if (oParam.eventFetch != undefined) {bEventFetch = oParam.eventFetch}
				if (oParam.sourceObject != undefined) {iSourceObject = oParam.sourceObject}
				if (oParam.user != undefined) {iUser = oParam.user}
				if (oParam.username != undefined) {sUsername = oParam.username}
			}
			
			$('#' + sXHTMLElementID).html('');
			
			if (iUser != undefined)
			{
				ns1blankspace.action.data.user = iUser;
				ns1blankspace.action.data.username = sUsername;
				ns1blankspace.action.data.calendarUsers = [iUser];
			}
			else
			{
				if (ns1blankspace.action.data.calendarUsers == undefined) {ns1blankspace.action.data.calendarUsers = []}

				if (ns1blankspace.action.data.calendarUsers.length == 0 && bEventFetch)
				{
					if (ns1blankspace.action.data.user != undefined)
					{
						ns1blankspace.action.data.calendarUsers.push(ns1blankspace.action.data.user);
					}
					else
					{	
						ns1blankspace.action.data.user = ns1blankspace.user.id;
						ns1blankspace.action.data.calendarUsers.push(ns1blankspace.user.id);
					}	
				}	
			}
			
			$(ns1blankspace.xhtml.container).hide(0);

			$('#' + sXHTMLElementID).html('');
			
			$('#' + sXHTMLElementID).css('font-size', '0.825em');

			$('#' + sXHTMLElementID).fullCalendar('destroy');

			$('#' + sXHTMLElementID).fullCalendar(
			{
				themeSystem: 'bootstrap3',
				theme: true,
				defaultView: 'agendaWeek',
				customButtons:
				{
			    	usersButton:
			    	{
				      text: sUsername,
				      click: function()
				      {
				        ns1blankspace.action.calendar.users();
				      }
				   }
			   },
				header:
				{
					left: 'usersButton, prev,next',
					center: 'title',
					right: 'today month,agendaWeek,agendaDay,listMonth'
				},
				
				views:
				{
					month:
					{
						titleFormat: 'MMMM YYYY',
						columnHeaderFormat: 'ddd D/M'
					},
					week:
					{
						titleFormat: 'MMMM YYYY',
						columnHeaderFormat: 'ddd D/M',
						minTime: '00:00:00',
						scrollTime: '07:00:00'
						
					},
					day:
					{
						titleFormat: 'MMMM YYYY',
						columnHeaderFormat: 'ddd D/M'
					}
				},

				weekNumberCalculation: 'local',
				firstDay: 1,
				timeFormat: 'h(:mm)a',
				editable: true,
				droppable: true,
				selectable: true,
				allDaySlot: false,				
				selectHelper: true,
				unselectCancel: '#ns1blankspaceActionDialogEdit *',
				
				drop: function(date, allDay) 
				{ 
					var originalEventObject = $(this).data('eventObject');
					var copiedEventObject = $.extend({}, originalEventObject);

					copiedEventObject.start = date;
					copiedEventObject.allDay = allDay;
					
					ns1blankspace.action.dialog.show(
					{
						startDate: date
					});
					
				},	
				
				select: function(startDate, endDate, allDay, jsEvent, view )
				{
					ns1blankspace.action.dialog.show(
					{
						startDate: startDate,
						endDate: endDate
					});
				},
						
				eventClick: function(calEvent, jsEvent, view) 
				{
					if (calEvent.editable ? calEvent.editable : true)
					{
						ns1blankspace.action.dialog.show(
						{
							actionID: calEvent.id,
							startDate: calEvent.start,
							endDate: calEvent.end,
							calEvent: calEvent
						});
					};		
				},
				
				dayClick: function(date, allDay, jsEvent, view) 
				{
				    if (allDay) 
					{
						//alert('Clicked on the entire day: ' + date);
					}
					else
					{
						
					}
				},
				
				eventDrop: function(event, delta, revertFunc, jsEvent, ui, view) 
				{
					if (event.sequence > 1 || event.hoursremaining > 0) 
					{
						alert('You can not drag a multi-day event. Click on the event and edit the date and time as required.');
						revertFunc();
					}
					else
					{
						ns1blankspace.status.message('Saving');

						var oData =
						{
							id: event.id,
							duedate: moment(event.start, ns1blankspace.option.dateFormats).format('DD MMM YYYY HH:mm:ss')
						}	
							
						$.ajax(
						{
							type: 'POST',
							url: '/rpc/action/?rf=JSON&method=ACTION_MANAGE',
							data: oData,
							dataType: 'json',
							success: function (oResponse)
							{
								if (oResponse.status == 'OK')
								{
									ns1blankspace.status.message('Saved');
								}
								else
								{
									ns1blankspace.status.error('Could not save');
									revertFunc();
								}
							}
						});
					}
				},
				
				eventMouseover: function( event, jsEvent, view ) 
				{
					if (event.contactbusinesstext !== undefined)
					{	
						ns1blankspace.status.message(event.contactbusinesstext);
					}	
				},
				
				eventMouseout: function( event, jsEvent, view ) 
				{
					ns1blankspace.status.message('');
				},
								
				eventResize: function(event, delta, revertFunc, jsEvent, ui, view) 
				{
					if (event.sequence > 1 || event.hoursremaining > 0) 
					{
						alert('You can not resize a multi-day event. Click on the event and edit the date and time as required.');
						revertFunc();
					}
					else
					{
						var iDeltaTimeMin = numeral(delta._milliseconds).value() / 60000;
						var iTotalTimeMin = numeral(event.totaltimemin).value();

						ns1blankspace.status.message('Saving');

						var oData =
						{
							id: event.id,
							totaltimemin: iTotalTimeMin + iDeltaTimeMin
						}	
							
						$.ajax(
						{
							type: 'POST',
							url: '/rpc/action/?rf=JSON&method=ACTION_MANAGE',
							data: oData,
							dataType: 'json',
							success: function (oResponse)
							{
								if (oResponse.status == 'OK')
								{
									ns1blankspace.status.message('Saved');
								}
								else
								{
									ns1blankspace.status.error('Could not save');
									revertFunc();
								}
							}
						});
					}	
				},

				viewDisplay: function(view) 
				{
					ns1blankspace.action.calendar.unavailable();	
				}
			});

			$('button.fc-usersButton-button').html('<span style="font-weight:600">' + sUsername + '</span>' +
						' <span class="caret"></span>');

			$('button.fc-usersButton-button').attr('id', 'ns1blankspaceMainCalendarControlUsers');
			
			$.each(ns1blankspace.action.data.calendarUsers, function(u, user) 
			{ 
				$('#' + sXHTMLElementID).fullCalendar('addEventSource', 
				{
					events: function(start, end, timezone, callback)
					{
						if (_.isObject(ns1blankspace.action.calendarParam))
						{
							$.extend(oData, ns1blankspace.action.calendarParam, true)
						}

						var oSearch = new AdvancedSearch();
						oSearch.method = 'ACTION_SEARCH';

						oSearch.addField('contactperson,actionby,actionbytext,actionreference,actiontype,actiontypetext,billingstatus,' +
											'billingstatustext,completed,completedtime,contactbusiness,contactbusinesstext,contactperson,' +
											'contactpersontext,date,description,duedate,duedatetime,object,objectcontext,objecttext,' +
											'priority,prioritytext,status,statustext,subject,text,totaltimehrs,totaltimemin,' +
											'action.actiontype.textcolour,action.actiontype.backgroundcolour');
					
						oSearch.addFilter('actionby', 'EQUAL_TO', user);
						oSearch.addFilter('duedate', 'GREATER_THAN_OR_EQUAL_TO', start.format('DD MMM YYYY') + ' 00:00:00');
						oSearch.addFilter('duedate', 'LESS_THAN_OR_EQUAL_TO', end.format('DD MMM YYYY') + ' 23:59:59');
						oSearch.addFilter('action.actiontype.showincalendar', 'EQUAL_TO', 'Y');

						oSearch.rows = 9999;
						oSearch.getResults(function(oResponse)
						{
							var events = [];

							$.each(oResponse.data.rows, function(r, row)
							{
								var sTitle = row.subject;

								if (row.contactbusinesstext != '')
								{
									sTitle = sTitle + ' - ' + row.contactbusinesstext
								}

								if (row.contactpersontext != '')
								{
									sTitle = sTitle + ' - ' + row.contactpersontext
								}

								row.start = moment(row.duedatetime, ns1blankspace.option.dateFormats).format('YYYY-MM-DD HH:mm:ss');
								row.end = moment(row.duedatetime, ns1blankspace.option.dateFormats).add(row.totaltimemin, 'm').format('YYYY-MM-DD HH:mm:ss');
								row.editable = (row.status == 2 || row.status == 4);
								row.title = sTitle;
								row.user = user;

								if (row['action.actiontype.textcolour'] != '')
								{
									row.textColor = row['action.actiontype.textcolour']
								}

								if (row['action.actiontype.backgroundcolour'] != '')
								{
									row.color = row['action.actiontype.backgroundcolour'] 
								}

								events.push(row);
							});

							callback(events);
						});
					}
				})
			});
		},

		unavailable: function ()
		{
			var aDays = [];
			var iStartHour = 0;
			var iEndHour = 24;
			var sNotAvailableDayClasses = aDays.join(' ')
			var bAvailable = true;

			if (ns1blankspace.action.calendarUsers.length > 0) 
			{ 
				$.ajax(
				{
					type: 'GET',
					url: ns1blankspace.util.endpointURI('SETUP_USER_SEARCH'),
					data: 'profile=445-446-447&users=' + ns1blankspace.action.calendarUsers.toString('-'),
					dataType: 'json',
					success: function (data) 
					{
						$(data.profile445).each(function()
						{
							var aDaysTmp = $(this).split(',')
							
							$.each(aDaysTmp, function() 
							{
								if ($.inArray(this, aDays) == -1)
								{
									aDays.push(String(this))
								}	
							});	
						});

						$(data.profile446).each(function()
						{
							if (parseInt(this) > iStartHour) {iStartHour = parseInt(this)}
						});

						$(data.profile447).each(function()
						{
							if (parseInt(this) < iEndHour) {iEndHour = parseInt(this)}
						});
						
						$('td.ui-widget-content').each(function()
						{ 
							var aClass = ($(this).attr('class')).split(' ');
							
							bAvailable = true;				
							
							$.each(aClass, function() 
							{ 
								if ($.inArray((this).replace('fc-',''), aDays) != -1)
								{
									bAvailable = false;
								}	
							});
						 
							if (!bAvailable)
							{  
								$(this).css({ 'background':'none', 'background-color' : '#E0E0E0' });
							} 
						});  
		 
						$('.fc-agenda-axis').each(function()
						{
							var sTime = $.trim(($(this).text()).toLowerCase());
							
							if (sTime != '')
							{
								bAvailable = true;	
								var sTimeHour = sTime;
								sTimeHour = sTimeHour.replace('am', '');
								sTimeHour = sTimeHour.replace('pm', '');
								var iTimeHour = parseInt(sTimeHour);
								if (sTime.indexOf('pm') > 0 && iTimeHour < 12) {iTimeHour += 12}
								if (iTimeHour < iStartHour) {bAvailable = false}
								if (iTimeHour >= iEndHour) {bAvailable = false}
							}
							
							if (!bAvailable)
							{
								$(this).parent().css('background-color','#E0E0E0');
							}	
						});
					}
				});
			}
		}
	},				

	dialog: 	
	{
		show: function (oParam, oResponse)
		{
			var iActionID = -1;
			var dStartDate = new Date();
			var dEndDate = dStartDate;
			var oCalEvent;
			
			if (oParam != undefined)
			{
				if (oParam.actionID != undefined) {iActionID = oParam.actionID};
				if (oParam.startDate != undefined) {dStartDate = oParam.startDate};
				if (oParam.endDate != undefined) {dEndDate = oParam.endDate};
				if (oParam.calEvent != undefined) {oCalEvent = oParam.calEvent};
			}	

			dStartDate = moment(dStartDate, ns1blankspace.option.dateFormats).format('DD MMM YYYY h:mm a');

			dEndDate = moment(dEndDate, ns1blankspace.option.dateFormats).format('DD MMM YYYY h:mm a');

			if (iActionID != -1 && oResponse == undefined)
			{
				ns1blankspace.status.working();

				var oSearch = new AdvancedSearch();
				oSearch.method = 'ACTION_SEARCH';
				oSearch.addField('subject,description,actionby,contactperson,contactpersontext,contactbusiness,contactbusinesstext,date,actiontype,actiontypetext,' +
										'action.contactperson.mobile,action.contactperson.workphone,action.contactperson.homephone');
				oSearch.addFilter('id', 'EQUAL_TO', iActionID);
				oSearch.getResults(function(data) {ns1blankspace.action.dialog.show(oParam, data)});
			}
			else
			{
				ns1blankspace.status.message('');

				var aHTML = [];
				
				aHTML.push('<table id="ns1blankspaceActionDialogEdit" class="ns1blankspaceViewControlContainer" style="margin-bottom:0px; width:500px; font-size:0.875em;">' +
									'<tr><td style="width:50%;">');
				
					aHTML.push('<table>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Subject</td></tr>' +
									'<tr><td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceActionCalendarSubject" class="ns1blankspaceText">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Business' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceActionCalendarBusiness" class="ns1blankspaceText"' + //Select
										' data-method="CONTACT_BUSINESS_SEARCH"' +
										' data-columns="tradename">' +
									'<div id="ns1blankspaceActionCalendarBusinessResults"></div>' +
									'</td></tr>');	
						
					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Person' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceActionCalendarPerson" class="ns1blankspaceText"' + //Select
										' data-method="CONTACT_PERSON_SEARCH"' +
										' data-columns="firstname-space-surname"' +
										' data-parent="ns1blankspaceActionCalendarBusiness"' +
										' data-parent-search-id="contactbusiness"' +
										' data-parent-search-text="tradename">' +
									'<div id="ns1blankspaceActionCalendarPersonContact" class="ns1blankspaceSubNote" style="cursor:pointer;"></div>' +
									'<div id="ns1blankspaceActionCalendarPersonResults"></div>' +
									'</td></tr>');

					aHTML.push('</table>');

				aHTML.push('</td><td>');

					aHTML.push('<table>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Start</td></tr>' +
									'<tr><td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceActionCalendarStart" class="ns1blankspaceDate">');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'End</td></tr>' +
									'<tr><td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceActionCalendarEnd" class="ns1blankspaceDate">');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Type' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceSelect">' +
									'<input id="ns1blankspaceActionCalendarActionType" class="ns1blankspaceText"' + //Select
											' data-method="SETUP_ACTION_TYPE_SEARCH"' +
											' data-cache="true">' +
									'<div id="ns1blankspaceActionCalendarActionTypeResults"></div>' +
									'</td></tr>');

					aHTML.push('</table>');

				aHTML.push('</td></tr><tr><td colspan=2>');

				aHTML.push('<table>');	

					aHTML.push('<tr><td class="ns1blankspaceText">' +
									'<textarea rows="5" cols="35" id="ns1blankspaceActionCalendarDescription"' +
									' class="ns1blankspaceTextMultiSmall" style="height:100px;"></textarea>' +
									'</td></tr>');
				
				aHTML.push('<tr><td style="text-align:left; padding:4px;">');

				if (iActionID != -1)
				{
					aHTML.push('<span id="ns1blankspaceActionCalendarMore" class="ns1blankspaceAction">More</span>');
				}
					
				aHTML.push('<span id="ns1blankspaceActionCalendarCancel" class="ns1blankspaceAction" style="margin-right:6px; float:right;">Cancel</span>');
				aHTML.push('<span id="ns1blankspaceActionCalendarSave" class="ns1blankspaceAction" style="margin-right:3px; float:right;">Save</span>' +
								'<td></tr>');

				aHTML.push('</table>');	

				aHTML.push('</td></tr></table>');					
	
				var oElement = $('#ns1blankspaceMain')
				
				$('#ns1blankspaceMultiUseDialog').html('');
				$('#ns1blankspaceMultiUseDialog').show();
				$('#ns1blankspaceMultiUseDialog').offset({ top: $(oElement).offset().top - 18 , left: $(oElement).offset().left - 140 });
				$('#ns1blankspaceMultiUseDialog').html(aHTML.join(''));

				$('#ns1blankspaceActionCalendarActionType').keyup(function(event)
				{
					if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
			        ns1blankspace.timer.delayCurrent = setTimeout("ns1blankspace.action.calendar.actionTypes()", ns1blankspace.option.typingWait);
				});

				$('#ns1blankspaceActionCalendarBusiness').keyup(function(event)
				{
					if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
			        ns1blankspace.timer.delayCurrent = setTimeout("ns1blankspace.action.calendar.business()", ns1blankspace.option.typingWait);
				});

				$('#ns1blankspaceActionCalendarPerson').keyup(function(event)
				{
					if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
			        ns1blankspace.timer.delayCurrent = setTimeout("ns1blankspace.action.calendar.person()", ns1blankspace.option.typingWait);
				});

				ns1blankspace.util.initDatePicker(
				{
					select: 'input.ns1blankspaceDate',
					time: true
				});
				
				$('#ns1blankspaceActionCalendarCancel').button(
				{
					label: 'Cancel'
				})
				.click(function()
				{
					$('#ns1blankspaceMultiUseDialog').slideUp(500);
					$('#ns1blankspaceMultiUseDialog').html('');
				});

				$('#ns1blankspaceActionCalendarMore').button(
				{
					label: 'More'
				})
				.click(function()
				{
					$('#ns1blankspaceMultiUseDialog').slideUp(500);
					$('#ns1blankspaceMultiUseDialog').html('');
					ns1blankspace.action.init({id: iActionID})
				});

				$('#ns1blankspaceActionCalendarSave').button(
				{
					label: 'Save'
				})
				.click(function()
				{
					ns1blankspace.action.dialog.save(
					{
						id: iActionID,
						date: $('#ns1blankspaceActionCalendarStart').val(),
						endDate: $('#ns1blankspaceActionCalendarEnd').val(),
						subject: $('#ns1blankspaceActionCalendarSubject').val(),
						description: $('#ns1blankspaceActionCalendarDescription').val(),
						priority: ($('#ns1blankspaceActionCalendarHighPriority').attr('checked')?3:2),
						calendarXHTMLElementID: 'ns1blankspaceMainCalendar',
						contactPerson: $('#ns1blankspaceActionCalendarPerson').attr('data-id'),
						contactPersonText: $('#ns1blankspaceActionCalendarPerson').val(),
						contactBusiness: $('#ns1blankspaceActionCalendarBusiness').attr('data-id'),
						contactBusinessText: $('#ns1blankspaceActionCalendarBusiness').val(),
						actionType: $('#ns1blankspaceActionCalendarActionType').attr('data-id'), 
						calEvent: oCalEvent
					});
					
					$('#ns1blankspaceMultiUseDialog').slideUp(500);
					$('#ns1blankspaceMultiUseDialog').html('');
				});

				if (oResponse != undefined)
				{	
					if (oResponse.data.rows.length != 0)
					{	
						var oRow = oResponse.data.rows[0];
						$('#ns1blankspaceActionCalendarSubject').val(oRow.subject.formatXHTML());
						$('#ns1blankspaceActionCalendarDescription').val(oRow.description.formatXHTML());
						$('#ns1blankspaceActionCalendarBusiness').attr('data-id', oRow.contactbusiness);
						$('#ns1blankspaceActionCalendarBusiness').val(oRow.contactbusinesstext.formatXHTML());
						$('#ns1blankspaceActionCalendarPerson').attr('data-id', oRow.contactperson);
						$('#ns1blankspaceActionCalendarPerson').val(oRow.contactpersontext.formatXHTML());
						$('#ns1blankspaceActionCalendarStart').val(dStartDate);
						$('#ns1blankspaceActionCalendarEnd').val(dEndDate);
						$('#ns1blankspaceActionCalendarActionType').attr('data-id', oRow.actiontype);
						$('#ns1blankspaceActionCalendarActionType').val(oRow.actiontypetext.formatXHTML());

						$('#ns1blankspaceActionCalendarPersonContact').html('');

						if (oRow.contactperson != '')
						{
							var aContact = [];

							if (oRow['action.contactperson.mobile'] != '') {aContact.push(oRow['action.contactperson.mobile'])}
							if (oRow['action.contactperson.homephone'] != '') {aContact.push(oRow['action.contactperson.homephone'])}
							if (oRow['action.contactperson.workphone'] != '') {aContact.push(oRow['action.contactperson.workphone'])}

							if (aContact.length == 0)
							{
								aContact.push('...');
							}

							$('#ns1blankspaceActionCalendarPersonContact').html(aContact.join(', '))

							$('#ns1blankspaceActionCalendarPersonContact').attr('data-id', oRow.contactperson)

							$('#ns1blankspaceActionCalendarPersonContact')
							.click(function()
							{
								if ($('#ns1blankspaceActionCalendarPersonContact').attr('data-id') != '')
								{
									var iContactPerson = $('#ns1blankspaceActionCalendarPersonContact').attr('data-id');
									$('#ns1blankspaceMultiUseDialog').slideUp(500);
									$('#ns1blankspaceMultiUseDialog').html('');
									ns1blankspace.contactPerson.init({id: iContactPerson})
								}
							});
						}
					}	
				}
				else
				{
					$('#ns1blankspaceActionCalendarStart').val(dStartDate);
					$('#ns1blankspaceActionCalendarEnd').val(dEndDate);
				}
			}
		},

		save: function (oParam, oResponse)
		{	
			var oData = {};
			var iType = ns1blankspace.data.actionTypes.meeting.id;
			var bAsync = true;
			var iHours;
			var sEndDate;
			var iActionBy = ns1blankspace.action.data.user;
			var oCalEvent;
			var sContactBusinessText = '';
			
			if (oParam != undefined)
			{
				if (oParam.type != undefined) {iType = oParam.type}
				if (oParam.async != undefined) {bAsync = oParam.async}
				if (oParam.hours != undefined) {iHours = oParam.hours}
				if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
				if (oParam.actionBy != undefined) {iActionBy = oParam.actionBy}
				if (oParam.calEvent != undefined) {oCalEvent = oParam.calEvent};
				if (oParam.contactBusinessText != undefined) {sContactBusinessText = oParam.contactBusinessText};
				if (oParam.actionType != undefined) {iType = oParam.actionType};
			}	
				
			if (oResponse == undefined)
			{
				if (oParam.id != -1) {oData.id = oParam.id}
				oData.object = oParam.object;
				oData.objectcontext = oParam.objectContext;
				oData.subject = oParam.subject;
				oData.description = oParam.description;
				oData.priority = oParam.priority;
				oData.status = oParam.status;
				oData.actiontype = iType;
				oData.date = oParam.date;
				oData.actionby = iActionBy;
				oData.contactbusiness = oParam.contactBusiness;
				oData.contactperson = oParam.contactPerson;
				
				if (iHours != undefined)
				{
					oData.totaltimehours = iHours;
				}
				
				if (sEndDate != undefined)
				{
					oData.enddate = sEndDate;
				}
															  
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
					data: oData,
					dataType: 'json',
					async: bAsync,
					success: function(data) {ns1blankspace.action.dialog.save(oParam, data);}
				});
			}
			else	
			{
				if (oResponse.status == 'OK')
				{
					ns1blankspace.status.message('Saved');
					ns1blankspace.inputDetected = false;

					var iActionID = oResponse.id;	
				
					var dStartDate = new Date;
					var dEndDate = dStartDate;
					var sTitle = '';
					var sXHTMLElementID = 'ns1blankspaceMainCalendar';
					
					if (oParam != undefined)
					{
						if (oParam.date != undefined) {sStartDate = oParam.date}
						if (oParam.endDate != undefined) {sEndDate = oParam.endDate}
						if (oParam.subject != undefined) {sTitle = oParam.subject}
						if (oParam.xhtmlElementID != undefined) { sXHTMLElementID = oParam.xhtmlElementID}
					}	
					
					if (sXHTMLElementID != undefined)
					{
						if (sContactBusinessText != '')
						{
							sTitle = sTitle + ' - ' + sContactBusinessText
						}

						if (oCalEvent !== undefined)
						{
							oCalEvent.title = sTitle;
							oCalEvent.start = sStartDate;
							oCalEvent.end = sEndDate;
								
							$('#' + sXHTMLElementID).fullCalendar('updateEvent', oCalEvent);
						}	
						else
						{	
							$('#' + sXHTMLElementID).fullCalendar('renderEvent',
							{
								id: iActionID,
								title: sTitle,
								start: sStartDate, 
								end: sEndDate, 
								allDay: false
							});
						}	
					}
				}
				else
				{
					ns1blankspace.status.error(oResponse.error.errornotes);
				}
			}
		},					

		quickNote:	function (iObject, iObjectContext)
		{
			var aHTML = [];
			
			aHTML.push('<table id="ns1blankspace">');
			
			aHTML.push('<tr><td class="ns1blankspaceCaption">' +
								'Note<td></tr>' +
								'<tr><td class="ns1blankspaceTextMulti">' +
								'<textarea rows="10" cols="35" id="ns1blankspaceActionNoteDescription" class="ns1blankspaceTextMulti"></textarea>' +
								'</td></tr>');
								
			aHTML.push('<tr><td class="ns1blankspaceCheck">' +
								'<input type="checkbox" id="ns1blankspaceActionNoteDescription"/>&nbsp;High Priority?<td></tr>');
								
			aHTML.push('</table>');						
			
			$('#ns1blankspaceMultiUseDialog').html(aHTML.join(''));
			
			$('#ns1blankspaceMultiUseDialog').dialog(
				{
					width: 300,
					resizable: false,
					modal: true,
					title: 'Add Note',
					buttons: 
					{
						"Cancel": 	function() 
									{
										$(this).dialog( "close" );
									},
						"Add Note": function() 
									{
										ns1blankspace.action.dialog.save(
										{
											reference: '',
											description: $('#ns1blankspaceActionNoteDescription').val(),
											type: ns1blankspace.data.actionType.fileNote,
											priority: ($('#ns1blankspaceActionNoteDescription').attr('checked') ? 3 : 2)
										});

										$(this).dialog("close");
									}
					}
				});
		}
	},

	next10: 	function (oParam, oResponse)
	{	
		var sXHTMLElementID = 'ns1blankspaceMainNext10';
		var sDate;
		var oDate;
		var iStatus = ns1blankspace.util.getParam(oParam, 'status').value;
		var bFuture = ns1blankspace.util.getParam(oParam, 'future', {"default": true}).value;

		if (oParam != undefined)
		{
			if (oParam.xhtmlElementID != undefined)
			{
				sXHTMLElementID = oParam.xhtmlElementID;
			}	
		}	
		
		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'ACTION_SEARCH';
			oSearch.addField('contactperson,actionby,actionbytext,actionreference,actiontype,actiontypetext,billingstatus,' +
								'billingstatustext,completed,completedtime,contactbusiness,contactbusinesstext,contactperson,' +
								'contactpersontext,date,description,duedate,duedatetime,object,objectcontext,objecttext,' +
								'priority,prioritytext,status,statustext,subject,text,totaltimehrs,totaltimemin');
			oSearch.addFilter('actionby', 'EQUAL_TO', ns1blankspace.user.id);

			if (iStatus != undefined)
			{
				oSearch.addFilter('status', 'EQUAL_TO', iStatus);
			}
			else
			{
				oSearch.addFilter('status', 'NOT_EQUAL_TO', 1);
			}

			if (bFuture) {oSearch.addFilter('duedate', 'GREATER_THAN_OR_EQUAL_TO', 'hour', '0', 'start_of_today')};

			oSearch.rows = 100;
			oSearch.sort('duedate', 'asc');
			oSearch.getResults(function(data) {ns1blankspace.action.next10(oParam, data)});
		}
		else
		{
			var aHTML = [];
		
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table class="ns1blankspace"><tr><td class="ns1blankspaceNothing">Nothing scheduled.</td></tr></table>');
				
				$('#' + sXHTMLElementID).html(aHTML.join(''));
				$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
			}
			else
			{
				aHTML.push('<table>');
				
				$.each(oResponse.data.rows, function()
				{
					aHTML.push('<tr>');
										
					aHTML.push('<td id="ns1blankspaceAction_reference-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
										this.subject + '</td>');
					
					sDate = this.duedatetime;

					if (sDate != '')
					{
						oDate = moment(this.duedatetime, ns1blankspace.option.dateFormats);
						if (oDate.isValid())
						{
							if (oDate.hours() == 0 && oDate.minutes() == 0)
							{
								sDate = oDate.format('DD MMM YYYY')
							}
							else
							{
								sDate = oDate.format('DD MMM YYYY h:mm A')
							}	
						}
					}

					aHTML.push('<td id="ns1blankspaceAction_date-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRow">' +
										sDate + '</td>');
						
					aHTML.push('<td id="ns1blankspaceAction_contact-' + this.contactperson + '" class="ns1blankspaceRow ns1blankspaceRowSelectContact">' +
									this.contactpersontext + '</td>');
										
					aHTML.push('<td id="ns1blankspaceAction_options-' + this.id + '" class="ns1blankspaceRow" style="width:70px;">');
					aHTML.push('<div id="ns1blankspaceActionComplete_' + this.id + '" class="ns1blankspaceActionComplete"></div>')
					aHTML.push('<div id="ns1blankspaceActionPriorityContainer_' + this.id + '" style="float:left;">');

					if (_.isNull(numeral(this.priority).value()) || numeral(this.priority).value() != 4)
					{
						aHTML.push('<div style="margin-right:2px;" id="ns1blankspaceActionPriority_' + this.id + '"' +
										' class=" ns1blankspaceActionPriority"' +
										' data-priority="' + this.priority + '"></div>');
					}
					else
					{
						aHTML.push('<div style="margin:0px; margin-right:3px; padding:2px; color:white; background-color:red; width:20px; float:left; text-align:center;">!</div>')
					}

					aHTML.push('</div></td></tr>');
				});
				
				aHTML.push('</table>');

				$('#' + sXHTMLElementID).html(aHTML.join(''));
				$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
				
				$('td.ns1blankspaceRowSelect').click(function(event)
				{
					ns1blankspace.action.search.send(event.target.id, {source: 1});
				});
				
				$('td.ns1blankspaceRowSelectContact').click(function(event)
				{
					ns1blankspace.contactPerson.search.init();
					ns1blankspace.contactPerson.search.send(event.target.id, {source: 1});
				});

				$('div.ns1blankspaceActionComplete')
				.button(
				{
					text: false,
					icons: {primary: 'ui-icon-check'}
				})
				.css('width', '15px')
				.on('click', function()
				{
					var oElement = this;
					var sID = oElement.id.split('_').pop();
					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
						data: 'id=' + sID + '&status=1',
						success: function(oResponse)
						{
							if (oResponse.status === 'OK')
							{
								ns1blankspace.status.message('Marked as completed')
								$(oElement).parent().parent().remove();
							}
							else
							{
								ns1blankspace.status.error('Unable to complete: ' + oResponse.error.errornotes);
							}
						}
					})
				});	

				$('div.ns1blankspaceActionPriority')
				.button(
				{
					text: false,
					icons: {primary: 'ui-icon-notice'}
				})
				.css('height', '20px')
				.css('width', '20px')
				.on('click', function()
				{
					var oElement = this;
					var sID = oElement.id.split('_').pop();
					var iPriority = $(oElement).attr('data-priority');
					var iNewPriority =  '4';

					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
						data: 'id=' + sID + '&priority=' + iNewPriority,
						success: function(oResponse)
						{
							if (oResponse.status === 'OK')
							{
								ns1blankspace.status.message('Flagged as critical');
								$('#ns1blankspaceActionPriorityContainer_' + sID).html(
									'<div style="margin:0px; margin-right:3px; padding:2px; color:white; background-color:red; width:25px; float:left; text-align:center;">!</div>')
							}
							else
							{
								ns1blankspace.status.error('Unable to set Priority: ' + oResponse.error.errornotes);
							}
						}
					})
				});	
				
			}
		}	
	},

	recent: 	function (oParam, oResponse)
	{	
		var sXHTMLElementID = 'ns1blankspaceMainRecent';
		var sDate;
		var oDate;

		if (oParam != undefined)
		{
			if (oParam.xhtmlElementID != undefined)
			{
				sXHTMLElementID = oParam.xhtmlElementID;
			}	
		}	
		
		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'ACTION_SEARCH';
			oSearch.addField('contactperson,actionby,actionbytext,actionreference,actiontype,actiontypetext,billingstatus,' +
								'billingstatustext,completed,completedtime,contactbusiness,contactbusinesstext,contactperson,' +
								'contactpersontext,date,description,duedate,duedatetime,object,objectcontext,objecttext,' +
								'priority,prioritytext,status,statustext,subject,text,totaltimehrs,totaltimemin');
			oSearch.addFilter('actionby', 'EQUAL_TO', ns1blankspace.user.id);

			oSearch.rows = 100;
			oSearch.sort('modifieddate', 'desc');
			oSearch.getResults(function(data) {ns1blankspace.action.recent(oParam, data)});
		}
		else
		{
			var aHTML = [];
		
			if (oResponse.data.rows.length == 0)
			{
				aHTML.push('<table class="ns1blankspace"><tr><td class="ns1blankspaceNothing">No recently updated actions.</td></tr></table>');
				
				$('#' + sXHTMLElementID).html(aHTML.join(''));
				$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
			}
			else
			{
				aHTML.push('<table>');
				
				$.each(oResponse.data.rows, function()
				{
					aHTML.push('<tr>');
										
					aHTML.push('<td id="ns1blankspaceAction_reference-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
										this.subject + '</td>');
					
					sDate = this.duedatetime;

					if (sDate != '')
					{
						oDate = moment(this.duedatetime, ns1blankspace.option.dateFormats);
						if (oDate.isValid())
						{
							if (oDate.hours() == 0 && oDate.minutes() == 0)
							{
								sDate = oDate.format('DD MMM YYYY')
							}
							else
							{
								sDate = oDate.format('DD MMM YYYY h:mm A')
							}	
						}
					}

					aHTML.push('<td id="ns1blankspaceAction_date-' + this.id + '" class="ns1blankspaceRow ns1blankspaceRow">' +
										sDate + '</td>');
						
					aHTML.push('<td id="ns1blankspaceAction_contact-' + this.contactperson + '" class="ns1blankspaceRow ns1blankspaceRowSelectContact">' +
									this.contactpersontext + '</td>');
										
					aHTML.push('<td id="ns1blankspaceAction_options-' + this.id + '" class="ns1blankspaceRow" style="width:70px;">');
					aHTML.push('<div id="ns1blankspaceActionComplete_' + this.id + '" class="ns1blankspaceActionComplete"></div>')
					aHTML.push('<div id="ns1blankspaceActionPriorityContainer_' + this.id + '" style="float:left;">');

					if (_.isNull(numeral(this.priority).value()) || numeral(this.priority).value() != 4)
					{
						aHTML.push('<div style="margin-right:2px;" id="ns1blankspaceActionPriority_' + this.id + '"' +
										' class=" ns1blankspaceActionPriority"' +
										' data-priority="' + this.priority + '"></div>');
					}
					else
					{
						aHTML.push('<div style="margin:0px; margin-right:3px; padding:2px; color:white; background-color:red; width:25px; float:left; text-align:center;">!</div>')
					}

					aHTML.push('</div></td></tr>');
				});
				
				aHTML.push('</table>');

				$('#' + sXHTMLElementID).html(aHTML.join(''));
				$('#' + sXHTMLElementID).show(ns1blankspace.option.showSpeed);
				
				$('td.ns1blankspaceRowSelect').click(function(event)
				{
					ns1blankspace.action.search.send(event.target.id, {source: 1});
				});
				
				$('td.ns1blankspaceRowSelectContact').click(function(event)
				{
					ns1blankspace.contactPerson.search.init();
					ns1blankspace.contactPerson.search.send(event.target.id, {source: 1});
				});

				$('div.ns1blankspaceActionComplete')
				.button(
				{
					text: false,
					icons: {primary: 'ui-icon-check'}
				})
				.css('width', '15px')
				.on('click', function()
				{
					var oElement = this;
					var sID = oElement.id.split('_').pop();
					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
						data: 'id=' + sID + '&status=1',
						success: function(oResponse)
						{
							if (oResponse.status === 'OK')
							{
								ns1blankspace.status.message('Marked as completed')
								$(oElement).parent().parent().remove();
							}
							else
							{
								ns1blankspace.status.error('Unable to complete: ' + oResponse.error.errornotes);
							}
						}
					})
				});	

				$('div.ns1blankspaceActionPriority')
				.button(
				{
					text: false,
					icons: {primary: 'ui-icon-notice'}
				})
				.css('height', '20px')
				.css('width', '20px')
				.on('click', function()
				{
					var oElement = this;
					var sID = oElement.id.split('_').pop();
					var iPriority = $(oElement).attr('data-priority');
					var iNewPriority =  '4';

					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
						data: 'id=' + sID + '&priority=' + iNewPriority,
						success: function(oResponse)
						{
							if (oResponse.status === 'OK')
							{
								ns1blankspace.status.message('Flagged as critical');
								$('#ns1blankspaceActionPriorityContainer_' + sID).html(
									'<div style="margin:0px; margin-right:3px; padding:2px; color:white; background-color:red; width:20px; float:left; text-align:center;">!</div>')
							}
							else
							{
								ns1blankspace.status.error('Unable to set Priority: ' + oResponse.error.errornotes);
							}
						}
					})
				});	
				
			}
		}	
	}
}
