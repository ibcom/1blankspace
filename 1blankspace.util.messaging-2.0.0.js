/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.messaging =
{
	createAction: function (oParam, oResponse)
	{
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceMessagingIMAPMessageICS'}).value;
	
		if (sXHTMLElementID != undefined)
		{
			if (oResponse == undefined)
			{
				var oEventData = ('#' + sXHTMLElementID).data();
				var sEmail = oEventData.by.replace('mailto:', '');

				var oSearch = new AdvancedSearch();
				oSearch.method = 'CONTACT_PERSON_SEARCH';
				oSearch.addField('contactperson,contactbusiness');
				oSearch.addFilter('email', 'EQUAL_TO', sEmail);
				oSearch.getResults(function(oResponse)
				{
					ns1blankspace.util.messaging.createAction(oParam, oResponse)
				});
			}
			else
			{
				if (oResponse.data.rows.length != 0)
				{
					oParam = ns1blankspace.util.setParam(oParam, 'contactBusinessID', oResponse.data.rows[0].contactbusiness)
					oParam = ns1blankspace.util.setParam(oParam, 'contactPersonID', oResponse.data.rows[0].id)
				}

				ns1blankspace.util.messaging._createAction(oParam);
			}
		}			
	},

	_createAction: function (oParam, oResponse)
	{
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
		var iContactBusinessID = ns1blankspace.util.getParam(oParam, 'contactBusinessID').value;
		var iContactPersonID = ns1blankspace.util.getParam(oParam, 'contactPersonID').value;

		if (sXHTMLElementID != undefined)
		{
			if (oResponse == undefined)
			{
				var oEventData = ('#' + sXHTMLElementID).data();

				if (oEventData != undefined)
				{
					var oData =
					{
						subject: oEventData.subject,
						priority: 2,				
						type: 3,
						duedate: oEventData.start,
						contactbusiness: undefined,
						contactperson: undefined,
						actionby: ns1blankspace.user.id,
						status: 2,
						billingstatus: 3,
						totaltimemin: oEventData.totaltimemin,
						description: oEventData.description,
						object: 191,
						objectcontext: ns1blankspace.objectContext
					}

					console.log(oEventData);
					console.log(oData);

					/*$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
						data: oData,
						dataType: 'json',
						success: function(data) {ns1blankspace.util.messaging.createAction(oParam, data);}
					});*/
				}	
			}
			else
			{
				
			}		
		}
	},

	icsToJSON: function (oParam, oResponse)
	{
		var iAttachment = ns1blankspace.util.getParam(oParam, 'attachment').value;

		if (oResponse == undefined)
		{
			var oSearch = new AdvancedSearch();
			oSearch.method = 'CORE_ATTACHMENT_SEARCH';
			oSearch.addField('id');
			oSearch.addFilter('objectcontext', 'EQUAL_TO', iAttachment);
			oSearch.addFilter('object', 'EQUAL_TO', 361);
			oSearch.getResults(function(data) {ns1blankspace.util.messaging.icsToJSON(oParam, data)});
		}
		else
		{
			if (oResponse.data.rows.length != 0)
			{
				oParam = ns1blankspace.util.setParam(oParam, 'id', oResponse.data.rows[0].id)
				ns1blankspace.util.messaging._icsToJSON(oParam);
			}
		}
	},

	_icsToJSON: function (oParam, oResponse)
	{
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
		var oReturn;
		var iAttachment = ns1blankspace.util.getParam(oParam, 'attachment').value;

		if (window.ical != undefined)
		{
			var iID = ns1blankspace.util.getParam(oParam, 'id').value;

			if (oResponse == undefined)
			{
				var oData = {id: iID};

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('CORE_FILE_READ'),
					data: oData,
					dataType: 'json',
					success: function(oResponse)
					{
						ns1blankspace.util.messaging._icsToJSON(oParam, oResponse);
					}
				});
			}
			else
			{
				if (oResponse.status == 'OK')
				{
					var sICSData = oResponse.filedata;
					var oICS = ical.parseICS(sICSData);
					var aICS = [];

					for (var key in oICS)
					{
						if (oICS.hasOwnProperty(key))
						{
							aICS.push(oICS[key]);
						}
					}

					if (aICS.length == 1)
					{
						var duration = moment.duration(moment(aICS[0].end).diff(moment(aICS[0].start)));
						var minutes = duration.asMinutes();

						oReturn =
						{
							subject: aICS[0].summary,
							start: moment(aICS[0].start).format('DD MMM YYYY hh:mm a'),
							end: moment(aICS[0].end).format('DD MMM YYYY hh:mm a'),
							description: aICS[0].description.replace(/:~/g, ''),
							location: aICS[0].location,
							by: aICS[0].organizer.val,
							uid: aICS[0].uid,
							attendee: aICS[0].attendee,
							created: moment(aICS[0].created).format('DD MMM YYYY HH:mm:ss'),
							lastmodified: moment(aICS[0]['last-modified']).format('DD MMM YYYY HH:mm:ss'),
							status: aICS[0].status,
							totaltimemin: minutes
						}

						if (sXHTMLElementID != undefined)
						{
							$('#' + sXHTMLElementID).data(oReturn);

							var aAttendees = [];
							$.each(oReturn.attendee, function (a, attendee)
							{
								aAttendees.push(attendee.val.replace('mailto:', ''));
							})

							$('#' + sXHTMLElementID).html(
								'<div class="ns1blankspaceSub" style="border-style:solid; border-width:1px 0px 0px 0px; border-color:#f3f3f3; margin-top:4px;">' +
								'<div style="font-weight:500;">' + oReturn.subject + '</div>' +
								'<div>' + oReturn.start + (oReturn.start!=oReturn.end?' to ' + oReturn.end:'') + '</div>' +
								(oReturn.location!=''?'<div>(' + oReturn.location + ')</div>':'') +
								(aAttendees.length!=0?'<div>' + aAttendees.join(', ') + '</div>':'') +
								'<div>' + oReturn.status + '</div>' +
								'<div><a id="ns1blankspaceMessagingICSCreateAction" href=# data-id="' + iAttachment + '">Create as action</a></div>' + 
								'</div>');

							$('#ns1blankspaceMessagingICSCreateAction').click(function (event)
							{
								ns1blankspace.util.messaging.createAction()
							})
						}
					}
					else
					{
						oReturn = aICS;
					}
					
				}
			}	
		}
		else
		{
			oReturn = 'No ical object (https://libraries.io/npm/ical)'
		}

		return oReturn
	}
}	