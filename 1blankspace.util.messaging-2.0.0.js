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
				ns1blankspace.util.messaging._icsToJSON({id: oResponse.data.rows[0].id})
			}
		}
	},

	_icsToJSON: function (oParam, oResponse)
	{
		var sReturn;

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
					console.log(oICS)
					
					for (var key in oICS)
					{
						if (data.hasOwnProperty(k))
						{
							var ev = data[k]
							console.log("Conference",
							ev.summary,
							'is in',
							ev.location,
							'on the', ev.start.getDate(), 'of', months[ev.start.getMonth()]);
						}
					}


					var oReturn =
					{
						title: oICS.summary,
						start: moment(oICS.summary).format('DD MMM YYYY')
					}
					console.log(oReturn)
				}
			}	
		}
		else
		{
			sReturn = 'No ical object (https://libraries.io/npm/ical)'
		}

		return sReturn
	}
}	