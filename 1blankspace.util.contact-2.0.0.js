/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.contact =
{
	bulk:
	{
		data: {},

		remove:
		{
			init: function (oParam, oResponse)
			{
				var sIDs = ns1blankspace.util.getParam(oParam, 'IDs').value;
				var sType = ns1blankspace.util.getParam(oParam, 'type', {"default": 'PERSON' }).value;
				var sFields = ns1blankspace.util.getParam(oParam, 'fields', {"default": 'firstname,surname' }).value;
				
				if (oResponse == undefined)
				{
					if (sIDs != undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CONTACT_' + sType + '_SEARCH';		
						oSearch.addField('id,' + sFields);
						oSearch.addFilter('id', 'IN_LIST', sIDs)
						oSearch.rows = 9999;				
						oSearch.getResults(function(data)
						{
							ns1blankspace.util.contact.bulk.remove.init(oParam, data)
						});
					}
					else
					{
						ns1blankspace.status.error('No IDs');
					}
				}
				else
				{
					ns1blankspace.util.contact.bulk.data.morerows = oResponse.morerows;
					ns1blankspace.util.contact.bulk.data.more = oResponse.moreid;
					ns1blankspace.util.contact.bulk.data.contacts = oResponse.data.rows;
					ns1blankspace.util.contact.bulk.remove.show(oParam);
				}
			},

			show: function (oParam, oResponse)
			{
				var bSaveToFile = ns1blankspace.util.getParam(oParam, 'saveToFile', {"default": true}).value;
				var aFile = [];

				aFile.push('Contacts to be removed: ' + ns1blankspace.util.contact.bulk.data.contacts.length)
				aFile.push('\r\n');

				console.log('Contacts to be removed: ' + ns1blankspace.util.contact.bulk.data.contacts.length);
				console.log('More Rows: ' + ns1blankspace.util.contact.bulk.data.morerows);
				console.log('More: ' + ns1blankspace.util.contact.bulk.data.more);

				$.each(ns1blankspace.util.contact.bulk.data.contacts, function (c, contact)
				{
					console.log(contact['id'] + ': ' + contact['firstname'] + ' ' + contact['surname']);
					aFile.push(contact['id'] + ': ' + contact['firstname'] + ' ' + contact['surname'])
					aFile.push('\r\n');
				});

				if (bSaveToFile)
				{
					oParam.data = aFile.join('');
					ns1blankspace.setup.file["export"].saveToFile(oParam);
				}
			},			

			check: function (oParam, oResponse)
			{
				var iMore = ns1blankspace.util.getParam(oParam, 'more').value;
				
				if (iMore == ns1blankspace.util.contact.bulk.data.more)
				{
					ns1blankspace.util.contact.bulk.remove.process(oParam)
				}
				else
				{
					ns1blankspace.status.error('Check failed');
				}
			},

			process: function (oParam, oResponse)
			{
				var iContactRemoveIndex = ns1blankspace.util.getParam(oParam, 'contactRemoveIndex', {"default": 0}).value;
				var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

				if (iContactRemoveIndex < ns1blankspace.util.contact.bulk.data.contacts.length)
				{
					ns1blankspace.status.working((iContactRemoveIndex + 1) + ' of ' + ns1blankspace.util.contact.bulk.data.contacts.length);
					if (sXHTMLElementID != undefined)
					{
						$('#' + sXHTMLElementID).html('Removing ' + (iContactRemoveIndex + 1) + ' of ' + ns1blankspace.util.contact.bulk.data.contacts.length)
					}
					
					var oData =
					{
						remove: 1,
						id: ns1blankspace.util.contact.bulk.data.contacts[iContactRemoveIndex].id
					}

					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('CONTACT_PERSON_MANAGE'),
						data: oData,
						global: false,
						dataType: 'json',
						success: function(data)
						{
							iContactRemoveIndex = iContactRemoveIndex + 1;
							oParam = ns1blankspace.util.setParam(oParam, 'contactRemoveIndex', iContactRemoveIndex);
							ns1blankspace.util.contact.bulk.remove.process(oParam, data)
						}
					});
				}
				else
				{
					ns1blankspace.status.message(ns1blankspace.util.contact.bulk.data.contacts.length + ' contact(s) removed');

					if (sXHTMLElementID != undefined)
					{
						$('#' + sXHTMLElementID).html(ns1blankspace.util.contact.bulk.data.contacts.length + ' contact(s) removed')
					}

					var fOnProcessingComplete = ns1blankspace.util.getParam(oParam, 'onProcessingComplete').value;
					if (fOnProcessingComplete != undefined)
					{
						fOnProcessingComplete(oParam)
					}
				}
			}
		}	
	}
}	