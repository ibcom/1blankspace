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
					if (sIDs != undefined && sIDs != '')
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

_.assign(ns1blankspace.util.contact.bulk,
{
	attachments:
	{
		data: {},

		getActions: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var sIDs = ns1blankspace.util.getParam(oParam, 'IDs').value;

				if (sIDs != undefined)
				{
					//only works if no private=Y actions.
					
					var oSearch = new AdvancedSearch();
					oSearch.method = 'ACTION_SEARCH';		
					oSearch.addField('id');
					//oSearch.addFilter('object', 'EQUAL_TO', 17);
					//oSearch.addFilter('objectcontext', 'IN_LIST', sIDs);

					oSearch.rows = 999999;				
					oSearch.getResults(function(data)
					{
						ns1blankspace.util.contact.bulk.attachments.getActions(oParam, data)
					});
				}
				else
				{
					ns1blankspace.status.error('No IDs');
				}
			}
			else
			{
				ns1blankspace.util.contact.bulk.attachments.data.getActions = oResponse.data.rows;

				console.log('Actions got')

				//oParam = ns1blankspace.util.setParam(oParam, 'type', 'ACTION');
				//oParam = ns1blankspace.util.setParam(oParam, 'IDs', $.map(ns1blankspace.util.contact.bulk.attachments.data.getActions, function (d) {return d.id}).join(','));
				//ns1blankspace.util.contact.bulk.attachments.remove.init(oParam);
			}
		},

		getAttachments: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var sIDs = ns1blankspace.util.getParam(oParam, 'IDs').value;

				if (sIDs != undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'CORE_ATTACHMENT_SEARCH';		
					oSearch.addField('id,objectcontext');
					oSearch.addFilter('object', 'EQUAL_TO', 17);
					oSearch.addFilter('id', 'EQUAL_TO', 122064);
					oSearch.rows = 999;				
					oSearch.getResults(function(data)
					{
						ns1blankspace.util.contact.bulk.attachments.getAttachments(oParam, data)
					});
				}
				else
				{
					ns1blankspace.status.error('No IDs');
				}
			}
			else
			{
				ns1blankspace.util.contact.bulk.attachments.data.getAttachments = oResponse.data.rows;

				console.log('Attachments got')

				oParam = ns1blankspace.util.setParam(oParam, 'type', 'ACTION');
				//oParam = ns1blankspace.util.setParam(oParam, 'IDs', $.map(ns1blankspace.util.contact.bulk.attachments.data.getAttachments, function (d) {return d.id}).join(','));
				//ns1blankspace.util.contact.bulk.attachments.remove.init(oParam);
			}
		},

		checkAttachments: function ()
		{
			/*$.each(ns1blankspace.util.contact.bulk.attachments.data.getAttachments, function (a, attachment)
			{
				attachment.hasAction = !_.isEmpty(_.find(ns1blankspace.util.contact.bulk.attachments.data.getActions,
							function (action) {return action.id == attachment.objectcontext}))
			});*/

			var aActionIDs = _.map(ns1blankspace.util.contact.bulk.attachments.data.getActions, 'id');
			var aAttachmentObjectContexts = _.map(ns1blankspace.util.contact.bulk.attachments.data.getAttachments, 'objectcontext');
			var aAttachmentIDs = _.map(ns1blankspace.util.contact.bulk.attachments.data.getAttachments, 'id');

			console.log('Mapped')
			console.log(aActionIDs.length)
			console.log(aAttachmentObjectContexts.length)

		/*	ns1blankspace.util.contact.bulk.attachments.data.checkAttachmentIDs =
				_.filter(aAttachmentIDs, function (attachmentID)
				{
					return _.includes(aActionIDs, attachmentID)
				});*/

			var oActionLookup = {};
		
			for (var j in aActionIDs)
			{
			   oActionLookup[aActionIDs[j]] = aActionIDs[j];
			}

			var oAttachmentLookup = {};
		
			for (var j in aAttachmentObjectContexts)
			{
			   oAttachmentLookup[aAttachmentObjectContexts[j]] = ns1blankspace.util.contact.bulk.attachments.data.getAttachments[j];
			}

			ns1blankspace.util.contact.bulk.attachments.data.getActionsLookup = oActionLookup;
			ns1blankspace.util.contact.bulk.attachments.data.getAttachmentsLookup = oAttachmentLookup;

			console.log('Look up created')

			console.log('Attachments with missing action:')

			for (var i in aAttachmentObjectContexts)
			{
			    if (typeof oActionLookup[aAttachmentObjectContexts[i]] == 'undefined')
			    {
			        console.log('action-id:' + aAttachmentObjectContexts[i]);
			        console.log('attachment-id:' + aAttachmentIDs[i])
			    } 
			}	

			console.log('Checked')
			ns1blankspace.status.message('Check done!')
		},

		remove:
		{
			init: function (oParam, oResponse)
			{
				var sIDs = ns1blankspace.util.getParam(oParam, 'IDs').value;
				var sType = ns1blankspace.util.getParam(oParam, 'type', {"default": 'PERSON' }).value;
				var sFields = ns1blankspace.util.getParam(oParam, 'fields', {"default": 'filename,attachment' }).value;
				var bLinkedToActions = ns1blankspace.util.getParam(oParam, 'linkedToActions', {"default": false}).value;

				var sObject = 32;

				if (sType.toUpperCase() == 'BUSINESS') {sObject = 12}
				if (sType.toUpperCase() == 'ACTION') {sObject = 17} 
				
				if (oResponse == undefined)
				{
					if (sIDs != undefined && sIDs != '')
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CORE_ATTACHMENT_SEARCH';		
						oSearch.addField('id,' + sFields);
						oSearch.addFilter('object', 'EQUAL_TO', sObject);
						oSearch.addFilter('objectcontext', 'IN_LIST', sIDs);
						oSearch.rows = 9999;				
						oSearch.getResults(function(data)
						{
							ns1blankspace.util.contact.bulk.attachments.remove.init(oParam, data)
						});
					}
					else
					{
						ns1blankspace.status.error('No IDs');
					}
				}
				else
				{
					ns1blankspace.util.contact.bulk.attachments.data.morerows = oResponse.morerows;
					ns1blankspace.util.contact.bulk.attachments.data.more = oResponse.moreid;
					ns1blankspace.util.contact.bulk.attachments.data.attachments = oResponse.data.rows;
					ns1blankspace.util.contact.bulk.attachments.remove.show(oParam);
				}
			},

			show: function (oParam, oResponse)
			{
				var bSaveToFile = ns1blankspace.util.getParam(oParam, 'saveToFile', {"default": true}).value;
				var aFile = [];

				aFile.push('Attachments to be removed: ' + ns1blankspace.util.contact.bulk.attachments.data.attachments.length)
				aFile.push('\r\n');

				console.log('Attachments to be removed: ' + ns1blankspace.util.contact.bulk.attachments.data.attachments.length);
				console.log('More Rows: ' + ns1blankspace.util.contact.bulk.attachments.data.morerows);
				console.log('More: ' + ns1blankspace.util.contact.bulk.attachments.data.more);

				$.each(ns1blankspace.util.contact.bulk.attachments.data.attachments, function (a, attachment)
				{
					console.log(attachment['attachment'] + '/' + attachment['id'] + ': ' + attachment['filename']);
					aFile.push(attachment['attachment'] + '/' + attachment['id'] + ': ' + attachment['filename'])
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
				
				if (iMore == ns1blankspace.util.contact.bulk.attachments.data.more)
				{
					ns1blankspace.util.contact.bulk.attachments.remove.process(oParam)
				}
				else
				{
					ns1blankspace.status.error('Check failed');
				}
			},

			process: function (oParam, oResponse)
			{
				var iAttachmentRemoveIndex = ns1blankspace.util.getParam(oParam, 'attachmentRemoveIndex', {"default": 0}).value;
				var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

				if (iAttachmentRemoveIndex < ns1blankspace.util.contact.bulk.attachments.data.attachments.length)
				{
					ns1blankspace.status.working((iAttachmentRemoveIndex + 1) + ' of ' + ns1blankspace.util.contact.bulk.attachments.data.attachments.length);

					if (sXHTMLElementID != undefined)
					{
						$('#' + sXHTMLElementID).html('Removing ' + (iAttachmentRemoveIndex + 1) + ' of ' + ns1blankspace.util.contact.bulk.attachments.data.attachments.length)
					}
					
					var oData =
					{
						remove: 1,
						id: ns1blankspace.util.contact.bulk.attachments.data.attachments[iAttachmentRemoveIndex].attachment
					}

					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('CORE_ATTACHMENT_MANAGE'),
						data: oData,
						global: false,
						dataType: 'json',
						success: function(data)
						{
							iAttachmentRemoveIndex = iAttachmentRemoveIndex + 1;
							oParam = ns1blankspace.util.setParam(oParam, 'attachmentRemoveIndex', iAttachmentRemoveIndex);
							ns1blankspace.util.contact.bulk.attachments.remove.process(oParam, data)
						}
					});
				}
				else
				{
					ns1blankspace.status.message(ns1blankspace.util.contact.bulk.attachments.data.attachments.length + ' attachment(s) removed');

					if (sXHTMLElementID != undefined)
					{
						$('#' + sXHTMLElementID).html(ns1blankspace.util.contact.bulk.attachments.data.attachments.length + ' attachment(s) removed')
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
});

_.assign(ns1blankspace.util.contact.bulk,
{
	actions:
	{
		data: {},

		remove:
		{
			init: function (oParam, oResponse)
			{
				var sIDs = ns1blankspace.util.getParam(oParam, 'IDs').value;
				var sType = ns1blankspace.util.getParam(oParam, 'type', {"default": 'PERSON' }).value;
				var sFields = ns1blankspace.util.getParam(oParam, 'fields', {"default": 'subject' }).value;

				var sObject = 32;

				if (sType.toUpperCase() == 'BUSINESS') {sObject = 12} 
				
				if (oResponse == undefined)
				{
					if (sIDs != undefined && sIDs != '')
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'ACTION_SEARCH';		
						oSearch.addField('id,' + sFields);
						oSearch.addFilter('contact' + sType.toLowerCase(), 'IN_LIST', sIDs);
						oSearch.rows = 9999;				
						oSearch.getResults(function(data)
						{
							ns1blankspace.util.contact.bulk.actions.remove.init(oParam, data)
						});
					}
					else
					{
						ns1blankspace.status.error('No IDs');
					}
				}
				else
				{
					ns1blankspace.util.contact.bulk.actions.data.morerows = oResponse.morerows;
					ns1blankspace.util.contact.bulk.actions.data.more = oResponse.moreid;
					ns1blankspace.util.contact.bulk.actions.data.actions = oResponse.data.rows;
					ns1blankspace.util.contact.bulk.actions.remove.show(oParam);
				}
			},

			show: function (oParam, oResponse)
			{
				var bSaveToFile = ns1blankspace.util.getParam(oParam, 'saveToFile', {"default": true}).value;
				var aFile = [];
				var aIDs = [];

				aFile.push('Actions to be removed: ' + ns1blankspace.util.contact.bulk.actions.data.actions.length)
				aFile.push('\r\n');

				console.log('Actions to be removed: ' + ns1blankspace.util.contact.bulk.actions.data.actions.length);
				console.log('More Rows: ' + ns1blankspace.util.contact.bulk.actions.data.morerows);
				console.log('More: ' + ns1blankspace.util.contact.bulk.actions.data.more);

				$.each(ns1blankspace.util.contact.bulk.actions.data.actions, function (a, action)
				{
					console.log(action['id'] + ': ' + action['subject']);
					aFile.push(action['id'] + ': ' + action['subject']);
					aIDs.push(action['id']);
					aFile.push('\r\n');
				});

				console.log('Action IDs:');
				console.log(aIDs.join(','));

				if (bSaveToFile)
				{
					oParam.data = aFile.join('');
					ns1blankspace.setup.file["export"].saveToFile(oParam);
				}
			},			

			check: function (oParam, oResponse)
			{
				var iMore = ns1blankspace.util.getParam(oParam, 'more').value;
				
				if (iMore == ns1blankspace.util.contact.bulk.actions.data.more)
				{
					ns1blankspace.util.contact.bulk.actions.remove.process(oParam)
				}
				else
				{
					ns1blankspace.status.error('Check failed');
				}
			},

			process: function (oParam, oResponse)
			{
				var iActionRemoveIndex = ns1blankspace.util.getParam(oParam, 'actionRemoveIndex', {"default": 0}).value;
				var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

				if (iActionRemoveIndex < ns1blankspace.util.contact.bulk.actions.data.actions.length)
				{
					ns1blankspace.status.working((iActionRemoveIndex + 1) + ' of ' + ns1blankspace.util.contact.bulk.actions.data.actions.length);

					if (sXHTMLElementID != undefined)
					{
						$('#' + sXHTMLElementID).html('Removing ' + (iActionRemoveIndex + 1) + ' of ' + ns1blankspace.util.contact.bulk.actions.data.actions.length)
					}
					
					var oData =
					{
						remove: 1,
						id: ns1blankspace.util.contact.bulk.actions.data.actions[iActionRemoveIndex].id
					}

					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
						data: oData,
						global: false,
						dataType: 'json',
						success: function(data)
						{
							iActionRemoveIndex = iActionRemoveIndex + 1;
							oParam = ns1blankspace.util.setParam(oParam, 'actionRemoveIndex', iActionRemoveIndex);
							ns1blankspace.util.contact.bulk.actions.remove.process(oParam, data)
						}
					});
				}
				else
				{
					ns1blankspace.status.message(ns1blankspace.util.contact.bulk.actions.data.actions.length + ' action(s) removed');

					if (sXHTMLElementID != undefined)
					{
						$('#' + sXHTMLElementID).html(ns1blankspace.util.contact.bulk.actions.data.actions.length + ' action(s) removed')
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
});				