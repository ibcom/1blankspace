/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

if (ns1blankspace.messaging === undefined) {ns1blankspace.messaging = {}}

ns1blankspace.messaging.imap = 
{
	data: 		
	{
		fromEmail: '',
		signatureFrom: 'ACCOUNT',
		objects:
		[
			{
				id: 1,
				caption: 'Project',
				method: 'PROJECT_SEARCH',
				columns: 'reference,description',
				methodFilter: 'reference-TEXT_IS_LIKE|description-TEXT_IS_LIKE'
			},
			{
				id: 5,
				caption: 'Invoice',
				method: 'FINANCIAL_INVOICE_SEARCH',
				columns: 'reference,sentdate,contactbusinesssenttotext,contactpersonsenttotext',
				methodFilter: 'reference-TEXT_IS_LIKE|invoice.contactbusinesssentto.tradename-TEXT_IS_LIKE|invoice.contactpersonsentto.surname-TEXT_IS_LIKE'
			},
			{
				id: 2,
				caption: 'Expense',
				method: 'FINANCIAL_EXPENSE_SEARCH',
				columns: 'reference,sentdate,contactbusinesspaidtotext',
				methodFilter: 'reference-TEXT_IS_LIKE|expense.contactbusinesspaidto.tradename-TEXT_IS_LIKE|expense.contactpersonpaidto.surname-TEXT_IS_LIKE'
			},
			{
				id: 32,
				caption: 'Person',
				method: 'CONTACT_PERSON_SEARCH',
				columns: 'firstname,surname',
				methodFilter: 'firstname-TEXT_IS_LIKE|surname-TEXT_IS_LIKE'
			},
			{
				id: 12,
				caption: 'Business',
				method: 'CONTACT_BUSINESS_SEARCH',
				columns: 'tradename',
				methodFilter: 'tradename-TEXT_IS_LIKE|legalname-TEXT_IS_LIKE'
			},
			{
				id:-32,
				caption: 'Selected Recipients'
			}
		]
	},

	init: function (oParam)
	{
		var bShowHome = true
		
		if (oParam != undefined)
		{
			if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
		}

		ns1blankspace.app.reset();

		ns1blankspace.object = 260; //39
		ns1blankspace.objectParentName = 'messaging';
		ns1blankspace.objectName = 'imap';
		ns1blankspace.viewName = 'Email';
		
		ns1blankspace.messaging.autoCheck = true;
		ns1blankspace.messaging.fullRefresh = false;
		ns1blankspace.messaging.imap.emailAccounts = [];
		ns1blankspace.messaging.imap.emailAccount = {};
		ns1blankspace.messaging.defaultRows = 25;
		ns1blankspace.messaging.imap.account = -1;
		ns1blankspace.messaging.emailRead = [];
		ns1blankspace.messaging.emailRemoved = [];
		ns1blankspace.messaging.showRemoved = false;
		ns1blankspace.messaging.emailInbox = [];
		ns1blankspace.messaging.emailInboxXHTML = [];
		ns1blankspace.messaging.emailCount = 0;
		ns1blankspace.messaging.emailLastPage = 1;
		ns1blankspace.messaging.emailLastPagination;
		ns1blankspace.messaging.emailNewCount;
		ns1blankspace.messaging.action = -1;

		//if (ns1blankspace.option.messagingSaveDraft === undefined) {ns1blankspace.option.messagingSaveDraft = 300000}		//v2.0.6 How often to save email while typing (5 mins default)
		if (ns1blankspace.option.messagingSaveDraft === undefined) {ns1blankspace.option.messagingSaveDraft = 60000}		//v2.0.6 How often to save email while typing (5 mins default)

		if (ns1blankspace.messaging.checking === undefined) {ns1blankspace.messaging.checking = false;} 

		if (ns1blankspace.option.richTextEditing)
		{
			ns1blankspace.format.editor.init();			
		}
		
		var aHTML = [];
		
		aHTML.push('<div id="ns1blankspaceMainInbox" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainSummary" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainEdit" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainRecycle" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainActionsSent" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainDrafts" class="ns1blankspaceControlMain"></div>');
		
		$('#ns1blankspaceMain').html(aHTML.join(''));
		
		ns1blankspace.messaging.imap.emailAccounts.length = 0;
		ns1blankspace.messaging.imap.data.fromEmail = '';

		ns1blankspace.app.set(oParam);

		$('#ns1blankspaceViewControlNew').unbind('click');
		$('#ns1blankspaceViewControlNew').click(function(event)
		{
			ns1blankspace.messaging.imap["new"]();
		});

		ns1blankspace.app.context({inContext: false, action: true, actionOptions: true});
	},


	folders:
	{
		data:
		{
			names:
			{
				deleted: ['Trash', 'Deleted'],
				archived: ['All Mail', 'Archive'],
				inbox: ['Inbox', 'INBOX']
			}	
		},

		init:	function (oParam, oResponse)
		{		
			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

			if (sXHTMLElementID != undefined)
			{
				var aXHTMLElementID = sXHTMLElementID.split('-');
				ns1blankspace.messaging.imap.account = aXHTMLElementID[1];
			}

			ns1blankspace.messaging.imap.emailAccount = $.grep(ns1blankspace.messaging.imap.emailAccounts, function (a) {return a.id == ns1blankspace.messaging.imap.account})[0];

			if (ns1blankspace.messaging.imap.emailAccount && ns1blankspace.messaging.imap.emailAccount.folders == undefined)
			{	
				if (oResponse == undefined)
				{	
					var oSearch = new AdvancedSearch();
					oSearch.method = 'MESSAGING_EMAIL_CACHE_FOLDER_SEARCH';
					oSearch.addField('title');
					oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.imap.account);
					oSearch.getResults(function(data) {ns1blankspace.messaging.imap.folders.init(oParam, data)});
				}
				else
				{
					if (oResponse.status == 'OK')
					{	
						ns1blankspace.messaging.imap.emailAccount.folders = oResponse.data.rows;

						// v2.0.6 Case insensitive search and finds text within instead of equal to
						$.each(ns1blankspace.messaging.imap.emailAccount.folders, function (i, v)
						{
							if ($.grep(ns1blankspace.messaging.imap.folders.data.names.deleted, function(a) {return v.title.toLowerCase().indexOf(a.toLowerCase()) > -1}).length != 0)
							{
								ns1blankspace.messaging.imap.emailAccount.deletedFolder = v.id;
							}

							if ($.grep(ns1blankspace.messaging.imap.folders.data.names.archived, function(a) {return v.title.toLowerCase().indexOf(a.toLowerCase()) > -1}).length != 0)
							{
								ns1blankspace.messaging.imap.emailAccount.archivedFolder = v.id;
							}

							if ($.grep(ns1blankspace.messaging.imap.folders.data.names.inbox, function(a) {return v.title.toLowerCase().indexOf(a.toLowerCase()) > -1}).length != 0)
							{
								ns1blankspace.messaging.imap.emailAccount.inboxFolder = v.id;
							}
						});
						//  v2.0.6f SUP022568 Set checking to false when change accounts so it correctly checks for new emails
						ns1blankspace.messaging.checking = false;

						ns1blankspace.util.onComplete(oParam);
					}
					else
					{
						//ns1blankspace.status.error('Can not connect to email service.');
					}	
				}
			}
			else
			{
				ns1blankspace.util.onComplete(oParam);
			}	
		},

		set: 	function (oParam, oResponse)
		{
				var oAccount = $.grep(ns1blankspace.messaging.imap.emailAccounts, function (a) {return a.id == ns1blankspace.messaging.imap.account});

				ns1blankspace.messaging.imap.emailAccount.deletedFolder = undefined;

				if (oAccount.length == 1)
				{
					ns1blankspace.messaging.imap.emailAccount.deletedFolder = oAccount[0].deletedFolder;
				}
		},

		folder:
		{
			show: 	function (oParam)
			{
				if (ns1blankspace.messaging.imap.emailAccount.deletedFolder == undefined)
				{
					ns1blankspace.messaging.imap.folders.init(oParam);
				}
				else
				{
					ns1blankspace.util.onComplete(oParam);
				}
			},

			check:	function (oParam, oResponse)
			{		
				var bDeleted = ns1blankspace.util.getParam(oParam, 'deleted', {'default': false}).value;
				var bArchived = ns1blankspace.util.getParam(oParam, 'archived', {'default': false}).value;
				var iAccount = ns1blankspace.util.getParam(oParam, 'account', {'default': ns1blankspace.messaging.imap.account}).value;
				var bFullRefresh = ns1blankspace.util.getParam(oParam, 'fullRefresh', {'default': ns1blankspace.messaging.fullRefresh}).value;
				
				if (oResponse == undefined)
				{	
					oParam = ns1blankspace.util.setParam(oParam, 'account', iAccount)

					var oData =
					{
						account: iAccount
					}

					if (bFullRefresh) {oData.fullrefresh = 1}

					if (bDeleted)
					{
						oData.folder = ns1blankspace.messaging.imap.emailAccount[(bArchived?'archivedFolder':'deletedFolder')];
						ns1blankspace.status.message('Getting ' + (bArchived?'archived':'deleted') + ' emails...', {timeout: false});
					}
						
					var sURL = '';

					if (ns1blankspace.option.messagingCheckURL != undefined)
					{
						oData.sid = ns1blankspace.session.sid;
						oData.logonkey = ns1blankspace.session.logonkey;
						sURL = ns1blankspace.option.messagingCheckURL;
					}

					$.ajax(
					{
						type: 'POST',
						url: sURL + '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_CHECK',
						data: oData,
						dataType: 'json',
						success: function(data) {ns1blankspace.messaging.imap.folders.folder.check(oParam, data)}
					});
						
				}
				else
				{

					//ns1blankspace.status.clear();

					if (oResponse.status == 'OK' && (iAccount == ns1blankspace.messaging.imap.account))
					{	
						ns1blankspace.util.onComplete(oParam)
					}
					else
					{
						//ns1blankspace.status.error('Can not connect to email service.');
					}	
				}
			},
		},

		refresh: function (oParam)
		{
			var oData = {account: ns1blankspace.messaging.imap.account}

			$.ajax(
			{
				type: 'POST',
				url: '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_REFRESH_FOLDERS',
				data: oData,
				dataType: 'json',
				success: function(data) {ns1blankspace.messaging.imap.init()}
			});
		}
	},		


	check: function (oParam, oResponse)
	{		
		var bDeleted = ns1blankspace.util.getParam(oParam, 'deleted', {'default': false}).value;
		var bArchived = ns1blankspace.util.getParam(oParam, 'archived', {'default': false}).value;
		var iAccount = ns1blankspace.util.getParam(oParam, 'account', {'default': ns1blankspace.messaging.imap.account}).value;

		if (oResponse == undefined)
		{	
			if (!ns1blankspace.messaging.checking)
			{
				ns1blankspace.messaging.checking = true;

				oParam = ns1blankspace.util.setParam(oParam, 'account', iAccount)

				var oData =
				{
					account: iAccount
				}

				if (ns1blankspace.messaging.fullRefresh) {oData.fullrefresh = 1}

				if (bDeleted)
				{
					oData.folder = ns1blankspace.messaging.imap.emailAccount[(bArchived?'archivedFolder':'deletedFolder')];
					ns1blankspace.status.message('Getting ' + (bArchived?'archived':'deleted') + ' emails...', {timeout: false});
				}
				else
				{
					if (ns1blankspace.option.messagingShowChecking) {ns1blankspace.status.working('Checking for new emails...', {timeout: false})}
				}	

				var sURL = '';

				if (ns1blankspace.option.messagingCheckURL != undefined)
				{
					oData.sid = ns1blankspace.session.sid;
					oData.logonkey = ns1blankspace.session.logonkey;
					sURL = ns1blankspace.option.messagingCheckURL;
				}

				$.ajax(
				{
					type: 'POST',
					url: sURL + '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_CHECK',
					data: oData,
					dataType: 'json',
					success: function(data) {ns1blankspace.messaging.imap.check(oParam, data)}
				});
			}
			else
			{
				
			}	
		}
		else
		{
			ns1blankspace.messaging.checking = false;

			ns1blankspace.status.clear();

			if (oResponse.status == 'OK' && (iAccount == ns1blankspace.messaging.imap.account))
			{	
				ns1blankspace.status.clear({duration: 2000});

				if (ns1blankspace.messaging.emailNewCount == undefined) {ns1blankspace.messaging.emailNewCount = 0}

				if (oResponse.fullrefresh != 'Y') {ns1blankspace.messaging.emailNewCount += oResponse.newrows};
				
				if (ns1blankspace.messaging.emailNewCount != undefined)
				{
					if (ns1blankspace.messaging.emailNewCount != 0)
					{	
						$('#ns1blankspaceMessagingIMAPInboxRefresh').button(
						{
							label: 'Show New Emails (' + ns1blankspace.messaging.emailNewCount + ')',
							disabled: false
						});
					
						ns1blankspace.util.app.option({title: '(' + ns1blankspace.messaging.emailNewCount + ') ' + ns1blankspace.messaging.imap.emailAccount.email});
					}
					else
					{
						ns1blankspace.util.app.option({title: ns1blankspace.messaging.imap.emailAccount.email});

						$('#ns1blankspaceMessagingIMAPInboxRefresh').button(
						{
							label: 'No New Emails',
							disabled: true
						});
					}
				}	
			}
			else
			{
				//ns1blankspace.status.error('Can not connect to email service.');
			}

			ns1blankspace.messaging.imap.inbox.cacheCheck()
		}

		$('#ns1blankspaceMessagingIMAPInboxCheck').button(
		{
			disabled: ns1blankspace.messaging.checking
		});
	},	


	home: function (oParam, oResponse)
	{
		var bAutoShow = true;

		if (oParam != undefined)
		{
			if (oParam.autoShow != undefined) {bAutoShow = oParam.autoShow}
		}	
		
		$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
		
		// 1 = Compose New
		// 2 = Do nothing

		var iAction = ns1blankspace.util.getParam(oParam, 'action').value;
		var sNamespace = ns1blankspace.util.getParam(oParam, 'namespace').value;

		if (iAction == 1)
		{
			ns1blankspace.messaging.imap.message.edit.show(oParam)
		}

		if (sNamespace !== undefined)
		{
			ns1blankspace.util.execute(sNamespace, oParam);
		}	

		if (ns1blankspace.messaging.imap.emailAccounts.length == 0)
		{
			if (oResponse == undefined)
			{
				var aHTML = [];
		
				$('#ns1blankspaceViewportControl').html(ns1blankspace.xhtml.loading);
				
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_MESSAGING_ACCOUNT_SEARCH';
				oSearch.addField('type,port,sslport,email,title,footer,server');
				oSearch.addFilter('type', 'EQUAL_TO', '5');
				oSearch.addFilter('AccountName', 'IS_NOT_NULL');
				//oSearch.addFilter('user', 'EQUAL_TO', ns1blankspace.user.id);
				oSearch.addCustomOption('hasaccess', 'Y');
				oSearch.getResults(function(oResponse) 
				{
					// v2.0.6a Can have signature on either messaging Account or ContactPerson record as configured via ns1blanksapce.messaging.impa.data.signatureFrom
					if (oResponse.status === 'OK')
					{
						if (ns1blankspace.messaging.imap.data.signatureFrom.toUpperCase() === 'CONTACTPERSON' && ns1blankspace.user.emailSignature === undefined)
						{
							// We need to find the signature
							var oSearch = new AdvancedSearch();
							oSearch.method = 'CONTACT_PERSON_SEARCH';
							oSearch.addField('signature');
							oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.user.contactPerson);
							oSearch.rows = 1;
							oSearch.getResults(function(data)
							{
								var sSignature;
								if (data.status === 'OK' && data.data.rows.length > 0)
								{
									sSignature = data.data.rows[0].signature;
									ns1blankspace.user.emailSignature = sSignature;
									oResponse.data.rows = $.map(oResponse.data.rows, function(x) {x.footer = sSignature; return x});
								}
								
								if (sSignature = "")
								{
									ns1blankspace.status.message('Email signature has not been configured. Please update via People form.')
								}
								else if (sSignature === undefined)
								{
									ns1blankspace.status.error('Error finding email signature: ' + data.error.errornotes);
								}
								ns1blankspace.messaging.imap.home(oParam, oResponse);
							});
						}
						else if (ns1blankspace.user.emailSignature != undefined)
						{
							oResponse.data.rows = $.map(oResponse.data.rows, function(x) {x.footer = ns1blankspace.user.emailSignature; return x});
							ns1blankspace.messaging.imap.home(oParam, oResponse);
						}
						else
						{
							ns1blankspace.messaging.imap.home(oParam, oResponse);
						}
					}
				});
			}
			else
			{
				var aHTML = [];
							
				aHTML.push('<table>');
				aHTML.push('<tr><td><div id="ns1blankspaceViewMessagingEmailLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
				aHTML.push('</table>');		
				
				ns1blankspace.messaging.imap.emailAccounts.length = 0;
				
				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<table><tr><td class="ns1blankspaceNothing">No accounts set up.</td></tr></table>');
					$('#ns1blankspaceControl').html(aHTML.join(''));	
				}
				else
				{
					ns1blankspace.messaging.imap.account = ns1blankspace.messaging.imap.data.defaultAccount;

					aHTML.push('<table style="padding-top:0px; padding-bottom:5px; border-left-width:10px; border-left-style:solid; border-left-color:transparent;" id="ns1blankspaceMessagingIMAPAccounts" class="ns1blankspaceControl">');
					
					$.each(oResponse.data.rows, function(index)
					{
						if (this.type == 5)
						{	
							ns1blankspace.messaging.imap.emailAccounts.push(
							{
								id: this.id,
								footer: ns1blankspace.util.toBR((this.footer).formatXHTML()),
								email: this.email
							})		
							
							if (ns1blankspace.messaging.imap.data.defaultAccount === undefined) 
							{
								ns1blankspace.messaging.imap.account = this.id;
								ns1blankspace.messaging.imap.data.defaultAccount = this.id;
							}
							else
							{
								ns1blankspace.messaging.imap.account = undefined;
							}
							
							var sDescription = this.email;
							var aDescription = sDescription.split("@");
								
							if (aDescription.length > 0) {sDescription = aDescription[0]}	
							
							aHTML.push('<tr><td id="ns1blankspaceMessaging-' + this.id + '" ' +
											'class="ns1blankspaceControl" style="padding-top:8px;"' +
											' title="' + this.server + '" data-server="' + this.server + '"><div style="float:left; position:relative; top:3px;" class="ns1blankspaceInboxMarker"></div><div>' +
											sDescription +
											'</div><div style="font-size:0.625em;" class="ns1blankspaceSubNote">@' + aDescription[1] + '</div>' + 
											'</td></tr>');
								
							if (ns1blankspace.option.messagingEmailShowCount)
							{	
								aHTML.push('<tr><td id="ns1blankspaceMessagingCount-' + this.id + '" ' +
												' class="ns1blankspaceControl ns1blankspaceSub">' +
												this.count + ' emails<br />' +
												'</td></tr>');		
							}
						}		
					});
					
					aHTML.push('</table>');

					aHTML.push('<table class="ns1blankspaceControl" style="padding-top:10px; margin-top:12px; border-top-style:solid; border-top-width: 1px; border-top-color:#D0D0D0;">');

					aHTML.push('<tr><td id="ns1blankspaceMessaging-Drafts" ' +
										'class="ns1blankspaceControl">' +
										'Drafts</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceMessaging-Sent" ' +
										'class="ns1blankspaceControl">' +
										'Sent</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceMessaging-Saved" ' +
										'class="ns1blankspaceControl">' +
										'Saved</td></tr>');

					aHTML.push('</table>');
					
					aHTML.push('<div id="ns1blankspaceMessagingMessageControlContainer"></div>');
					aHTML.push('<div id="ns1blankspaceMessagingMessageControlServer" style="margin-top:16px;"></div>');
								
					$('#ns1blankspaceControl').html(aHTML.join(''));	
				
					$('td.ns1blankspaceControl').click(function(event)
					{
						$('#ns1blankspaceMessagingMessageControlServer').html('');
						var sID = this.id.split('-').pop();

						if (sID == 'Sent')
						{	
							ns1blankspace.show({selector: '#ns1blankspaceMainActionsSent'});
							ns1blankspace.messaging.imap.actions.show({xhtmlElementID: 'ns1blankspaceMainActionsSent', type: 5, sent: 'Y', xhtmlContext: 'ActionsSent'});
						}
						else if (sID == 'Saved')
						{	
							ns1blankspace.show({selector: '#ns1blankspaceMainActionsSent'});
							ns1blankspace.messaging.imap.actions.show({xhtmlElementID: 'ns1blankspaceMainActionsSent', type: 9, xhtmlContext: 'ActionsSaved'});
						}
						else if (sID == 'ToDo')
						{	
							ns1blankspace.show({selector: '#ns1blankspaceMainActionsSent'});
							ns1blankspace.messaging.imap.actions.show({xhtmlElementID: 'ns1blankspaceMainActionsSent', type: 9, status: 2, xhtmlContext: 'ActionsToDo'});
						}
						else if (sID == 'Drafts')
						{	
							ns1blankspace.show({selector: '#ns1blankspaceMainDrafts'});
							ns1blankspace.messaging.imap.actions.show({xhtmlElementID: 'ns1blankspaceMainDrafts', type: 5, sent: 'N', xhtmlContext: 'Drafts'});
						}
						else
						{	
							ns1blankspace.show({selector: '#ns1blankspaceMainInbox'});
							$('.ns1blankspaceInboxMarker').removeClass('ui-icon ui-icon-mail-closed');
							$(this).children('div.ns1blankspaceInboxMarker').addClass('ui-icon ui-icon-mail-closed');

							var sServerURL = $(this).attr('data-server');
							var sMailURL;
							if (_.includes(sServerURL, 'gmail')) {sMailURL = 'gmail.com'}
							if (_.includes(sServerURL, 'outlook')) {sMailURL = 'outlook.com'}

							if (sMailURL != undefined)
							{
								$('#ns1blankspaceMessagingMessageControlServer').html(
									'<a href="https://' + sMailURL + '" target="_blank"><div class="ns1blankspaceSubNote">' + sMailURL + '</div></a>');
							}

							ns1blankspace.app.context({inContext: false, action: true, actionOptions: true});

							if (ns1blankspace.messaging.imap.account != sID)
							{
								ns1blankspace.messaging.imap.data.fromEmail = $(this).attr('email');

								ns1blankspace.messaging.imap.folders.init(
								{
									xhtmlElementID: this.id, source: 1, newOnly: false, repaginate: true,
									onComplete: ns1blankspace.messaging.imap.inbox.show
								});
							}	
						}	
					});

					if (iAction != 1 && iAction != 2)
					{	
						ns1blankspace.show({selector: '#ns1blankspaceMainInbox', context: {inContext: false, action: true, actionOptions: true}});

						if (ns1blankspace.messaging.imap.account != undefined && bAutoShow)
						{
							$('#ns1blankspaceMessaging-' + ns1blankspace.messaging.imap.account).addClass('ns1blankspaceHighlight');
							ns1blankspace.messaging.imap.inbox.show({xhtmlElementID: '-' + ns1blankspace.messaging.imap.account, source: 1, newOnly: false, refreshInbox: true, repaginate: true})
						}
						else
						{
							$('#ns1blankspaceMainInbox').html('<span class="ns1blankspaceSub" style="font-size:0.875em;">Select an email inbox<br />or click <b>New</b> to send an email.</span>');
						}
					}
				}	
			}
		}	
	},

	inbox: 		
	{				
		checkForEditing: function(oParam)
		{
			var fFunctionDiscard = ns1blankspace.util.getParam(oParam, 'functionDiscard').value;
			var aButtons = [];
			var sText = '';
			var sEditorContent = (tinyMCE.get('ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor) != undefined
							? tinyMCE.get('ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor).getContent().replace('<p><br /><br /></p>', '')
							: '');

			// We want the user to be able to see the email they were editing when they're asked 
			ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});
			sText += $('#ns1blankspaceEditMessageTo').val() +
					 ($('#ns1blankspaceEditMessageCC').is('*') ? $('#ns1blankspaceEditMessageCC').val() : '') +
					 ($('#ns1blankspaceEditMessageBCC').is('*') ? $('#ns1blankspaceEditMessageBCC').val() : '') +
					 ($('#ns1blankspaceMessagingEditMessageSubject').not('.ns1blankspaceWatermark').is('*') ? $('#ns1blankspaceMessagingEditMessageSubject').not('.ns1blankspaceWatermark').val() : '') +
					 sEditorContent;
			
			// If the message in the editor is blank, then just discard it
			if (sText != '')
			{
				ns1blankspace.container.confirm(
				{
					title: 'Warning! Potential loss of work!', 
					html: '<br />You are already editing a message.<br />', 
					buttons:  
					[
						{text: "Continue editing",
							click: function() 
							{
								$(this).dialog('close');
								ns1blankspace.messaging.imap.message.edit.show({continueEditing: true});
							}
						},
						{text: "Discard & delete Draft", 
							click: function() 
							{
								$(this).dialog('close');
								oParam.action = $('#ns1blankspaceMainEdit').attr('data-objectcontext');
								$('#ns1blankspaceMainEdit').removeAttr('data-objectcontext');
								ns1blankspace.messaging.action = -1;
								ns1blankspace.inputDetected = false;
								ns1blankspace.messaging.imap.inbox.discardMessage(oParam);
							}
						},
						{text: "Discard & keep Draft",
							click: function() 
							{
								$(this).dialog('close');
								$('#ns1blankspaceMainEdit').removeAttr('data-objectcontext');
								ns1blankspace.messaging.action = -1;
								ns1blankspace.inputDetected = false;
								fFunctionDiscard(oParam);
							}
						}
					]
				});
			}
			else
			{
				oParam.action = $('#ns1blankspaceMainEdit').attr('data-objectcontext');
				$('#ns1blankspaceMainEdit').removeAttr('data-objectcontext');
				ns1blankspace.messaging.action = -1;
				ns1blankspace.messaging.imap.inbox.discardMessage(oParam);
			}
		},

		discardMessage: function(oParam)
		{
			// If we have a saved draft, remove it first
			var fFunctionDiscard = ns1blankspace.util.getParam(oParam, 'functionDiscard').value;

			if (oParam.action && oParam.action != -1)
			{
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
					data: 'remove=1&id=' + oParam.action,
					success: function(oResponse)
					{
						if (oResponse.status === 'OK')
						{
							ns1blankspace.status.message('Draft removed');
						}
						fFunctionDiscard(oParam);
					}
				})
			}
			else
			{
				delete(oParam.action);
				fFunctionDiscard(oParam);
			}
		},

		cacheCheck: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
				oSearch.addField('messageid');
				oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.imap.account);
				oSearch.addFilter('messageid', 'GREATER_THAN', ns1blankspace.messaging.imap.data.maxMessageID);
				oSearch.addSummaryField('count(*) cachecount');
				oSearch.rows = 0;
				oSearch.getResults(function(data) {ns1blankspace.messaging.imap.inbox.cacheCheck(oParam, data)});
			}
			else
			{
				ns1blankspace.messaging.emailNewCount = oResponse.summary.cachecount;
				
				if (ns1blankspace.messaging.emailNewCount != 0)
				{	
					$('#ns1blankspaceMessagingIMAPInboxRefresh').button(
					{
						label: 'Show New Emails (' + ns1blankspace.messaging.emailNewCount + ')',
						disabled: false
					});
				
					ns1blankspace.util.app.option({title: '(' + ns1blankspace.messaging.emailNewCount + ') ' + ns1blankspace.messaging.imap.emailAccount.email});
				}
				else
				{
					ns1blankspace.util.app.option({title: ns1blankspace.messaging.imap.emailAccount.email});

					$('#ns1blankspaceMessagingIMAPInboxRefresh').button(
					{
						label: 'No New Emails',
						disabled: true
					});
				}
			}
		},

		show:		function (oParam, oResponse)
		{
			var sXHTMLElementID;
			var bNew;
			var iStart;
			var bRefresh = false;
			var bRebuild = true;
			var bDeleted = ns1blankspace.util.getParam(oParam, 'deleted', {'default': false}).value;
			
			if (oParam != undefined)
			{
				if (oParam.source != undefined) {iSource = oParam.source}
				if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
				if (oParam.newOnly != undefined) {bNew = oParam.newOnly}
				if (oParam.start != undefined) {iStart = oParam.start}
				if (oParam.refreshInbox != undefined) {bRefresh = oParam.refreshInbox}
				if (oParam.rebuild != undefined) {bRebuild = oParam.rebuild}
			}
			else
			{
				oParam = {};
			}	
			
			if (iStart == undefined && bNew == undefined) {bNew = true}
			
			$('#ns1blankspaceMessagingEmailViewport').html(''); //???

			ns1blankspace.app.context({inContext: false, action: true, actionOptions: true});
			
			if (sXHTMLElementID != undefined)
			{
				ns1blankspace.messaging.imap.account = undefined;

				var aXHTMLElementID = sXHTMLElementID.split('-');
				
				if (ns1blankspace.messaging.imap.account != aXHTMLElementID[1] || bDeleted) 
				{
					bRefresh = true;
					oParam.refreshInbox = true;
				}

				ns1blankspace.messaging.imap.account = aXHTMLElementID[1];
			}	
			
			if (bRefresh)
			{
				ns1blankspace.messaging.emailNewCount = 0;
				oParam = ns1blankspace.util.setParam(oParam, 'refresh', false);
				$('#ns1blankspaceMessagingIMAPInboxRefresh').button(
				{
					label: 'No New Emails',
					disabled: true
				});

				//ns1blankspace.util.app.option({title: })
			}
			
			if (bRebuild)
			{
				ns1blankspace.util.app.option({title: ns1blankspace.messaging.imap.emailAccount.email});
				ns1blankspace.messaging.emailNewCount = 0;
				ns1blankspace.messaging.emailLastPagination = undefined;
				ns1blankspace.messaging.emailLastPage = 1;
				
				var aHTML = [];
				
				aHTML.push('<table id="ns1blankspaceMessagingIMAPHeaderContainer" class="ns1blankspaceContainer">');
				aHTML.push('<tr><td style="height:20px;" id="ns1blankspaceMessagingIMAPHeader">' + ns1blankspace.xhtml.loading + '</td></tr>');
				aHTML.push('<tr><td id="ns1blankspaceMessagingIMAPInboxContainer"></td></tr>');
				aHTML.push('</table>');

				$('#ns1blankspaceMainInbox').html(aHTML.join(''));
				
				if (ns1blankspace.timer.messaging != 0) {clearInterval(ns1blankspace.timer.messaging)};
				if (ns1blankspace.messaging.autoCheck && !bDeleted) {ns1blankspace.timer.messaging = setInterval("ns1blankspace.messaging.imap.check()", ns1blankspace.option.messagingCheckForNew)};
			}	

			if (bDeleted)
			{
				$('#ns1blankspaceMessagingIMAPInboxShowDeleted').unbind('click');

				$('#ns1blankspaceMessagingIMAPInboxShowDeleted').button(
				{
						label: 'Show Inbox',
						disabled: false
				})
				.click(function(event)
				{
					ns1blankspace.messaging.imap.inbox.show(
					{
						xhtmlElementID: '-' + ns1blankspace.messaging.imap.account, source: 1, newOnly: false, repaginate: true
					});
				});
			}	
				
			if (oResponse == undefined && bRefresh
				&& ns1blankspace.messaging.imap.account != undefined)
			{	
				var oSearch = new AdvancedSearch();
				oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
				oSearch.addField('messageid,to,cc,from,fromname,subject,date,' +
											'hasattachments,attachments,imapflags,detailscached');
				oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.imap.account);

				// 2.0.6 If we have a deleted folder we don't want to see the deleted items in the inbox, but do want them if we're viewing deleted items
				oSearch.addFilter('folder', ((!bDeleted) ? 'NOT_' : '') + 'EQUAL_TO', ns1blankspace.messaging.imap.emailAccount.deletedFolder);

				oSearch.addSummaryField('count(*) cachecount');
				oSearch.addSummaryField('max(messageid) maxmessageid');
				oSearch.sort('date', 'desc')
				oSearch.rows = ns1blankspace.messaging.defaultRows;
				oSearch.getResults(function(data) {ns1blankspace.messaging.imap.inbox.show(oParam, data)});
			}
			else
			{
				//ns1blankspace.status.message('Refreshed @ ' + Date.now().toString("h:mm tt"));

				ns1blankspace.messaging.emailCount = oResponse.summary.cachecount;
				ns1blankspace.messaging.imap.data.maxMessageID = oResponse.summary.maxmessageid;
					
				if (bRebuild)
				{
					if (ns1blankspace.option.messagingShowChecking) {ns1blankspace.status.working('Checking for new emails...', {timeout: false})}
					
					if (!bDeleted)
					{	ns1blankspace.messaging.imap.check();	}

					var aHTML = [];
					
					aHTML.push('<table class="ns1blankspace" style=>');
					aHTML.push('<tr>');

					aHTML.push('<td class="ns1blankspaceHeader">' +
									'<span id="ns1blankspaceMessagingIMAPInboxCount" class="ns1blankspaceSub">' +
										ns1blankspace.messaging.emailCount + ' emails</span>' +
										'</td>');
					
					aHTML.push('<td class="ns1blankspaceHeader" style="text-align:right;">' +
									'<span id="ns1blankspaceMessagingIMAPInboxShowDeleted" class="ns1blankspaceAction" style="margin-right:4px;">' +
										'Show Deleted</span>' +
									'<span id="ns1blankspaceMessagingIMAPInboxCheck" class="ns1blankspaceAction" style="margin-right:4px;">' +
										'Check</span>' +	
									'<span id="ns1blankspaceMessagingIMAPInboxRefresh" class="ns1blankspaceAction" style="margin-right:4px;">' +
										'Refresh</span></td>');

					aHTML.push('</tr>');
					aHTML.push('</table>');
					
					$('#ns1blankspaceMessagingIMAPHeader').html(aHTML.join(''));

					$('#ns1blankspaceMessagingIMAPInboxRefresh').button(
					{
							label: 'No New Emails',
							disabled: true
					})
					.click(function(event)
					{
						ns1blankspace.messaging.imap.inbox.show({xhtmlElementID: '-' + ns1blankspace.messaging.imap.account, source: 1, newOnly: false, refreshInbox: true, rebuild: false});
					});

					$('#ns1blankspaceMessagingIMAPInboxShowDeleted').button(
					{
							label: 'Show Deleted'
					})
					.click(function(event)
					{
						$('#ns1blankspaceMessagingIMAPInboxShowDeleted').button(
						{
							disabled: true
						});

						$('#ns1blankspaceMessagingIMAPInboxContainer').html(ns1blankspace.xhtml.loading);
						$('#ns1blankspaceMessagingIMAPInboxCount').html('<span class="padding-top:4px;">DELETED EMAILS</span>');

						ns1blankspace.messaging.imap.folders.folder.check(
						{
							xhtmlElementID: '-' + ns1blankspace.messaging.imap.account, source: 1, deleted: true, refreshInbox: true, rebuild: false, fullRefresh: true,
							onComplete: ns1blankspace.messaging.imap.inbox.show
						});
					});

					$('#ns1blankspaceMessagingIMAPInboxCheck').button(
					{
							label: 'Check',
							disabled: ns1blankspace.messaging.checking
					})
					.click(function(event)
					{
						ns1blankspace.messaging.imap.check();
					});
				}

				var aHTML = [];
				
				aHTML.push('<table id="ns1blankspaceMessagingIMAPInbox" class="ns1blankspaceMessagingIMAPInbox">');
				
				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<tr><td class="ns1blankspaceNothing">No emails.</td></tr>')
				}	

				$.each(oResponse.data.rows, function()
				{
					aHTML.push(ns1blankspace.messaging.imap.inbox.row(this, oParam));
				});
				
				aHTML.push('</table>');
				
				ns1blankspace.render.page.show(
				{
					xhtmlElementID: 'ns1blankspaceMessagingIMAPInboxContainer',
					xhtmlContext: 'IMAPInbox',
					xhtml: aHTML.join(''),
					showMore: (oResponse.morerows == "true"),
					more: oResponse.moreid,
					rows: ns1blankspace.messaging.defaultRows,
					functionShowRow: ns1blankspace.messaging.imap.inbox.row,
					functionOnNewPage: ns1blankspace.messaging.imap.inbox.bind,
					headerRow: false,
					bodyClass: 'ns1blankspaceMessagingIMAPInbox'
				}); 	
			}
		},

		row:	function (oRow, oParam)
		{	
			var aHTML = [];
			var bDeleted = ns1blankspace.util.getParam(oParam, 'deleted', {'default': false}).value;
			
			var sID = oRow.id;
			
			var sDate = '';
			var sTime = '';
			var sFrom;

			var oDate = Date.parseExact(oRow.date, "d MMM yyyy H:mm:ss");

			if (oDate != null)
			{ 
				var sDate = oDate.toString("d MMM yyyy");
				var sTime = oDate.toString("h:mm tt");
			}
				
			var sClass = '';
			
			if ((oRow.imapflags.toUpperCase()).indexOf('\\SEEN') == -1)
			{
				sClass = " ns1blankspaceNotSeen"
			}
			if ((oRow.imapflags.toUpperCase()).indexOf('\\DELETED') > -1)
			{
				sClass = " ns1blankspaceDeleted"
			}
			
			aHTML.push('<tr id="ns1blankspaceMessagingInbox_id-' + sID + '" class="ns1blankspaceRow' + sClass + '" data-cached="' + oRow.detailscached + '">');
			
			
			if (oRow.fromname == oRow.from)
			{
				sFrom = oRow.fromname
			}
			else
			{
				sFrom = '<div>' + oRow.fromname + '</div>' +
							'<div class="ns1blankspaceSubNote">' + oRow.from + '</div>'
			}

			aHTML.push('<td id="ns1blankspaceMessagingInbox_from-' + sID + 
								'" style="cursor: pointer;" class="ns1blankspaceRow ns1blankspaceRowSelect' + sClass + '"' +
								' title="' + oRow.from + '" style="padding-right:5px;" data-cached="' + oRow.detailscached + '">' +
								sFrom + '</td>');
								
			aHTML.push('<td id="ns1blankspaceMessagingInbox_subject-' + sID + 
								'" style="cursor: pointer; padding-right:5px;" class="ns1blankspaceRow ns1blankspaceMainRowSelect' + sClass + '">' +
								oRow.subject + '</td>');
			
			aHTML.push('<td id="ns1blankspaceMessagingInbox_date-' + sID + '" class="ns1blankspaceRow ns1blankspaceMainRowSelect" style="width:85px; text-align:right;" >' +
									sDate + '<br /><span class="ns1blankspaceSub">' + sTime + '</span></td>');
			
			aHTML.push('<td class="ns1blankspaceRow" style="width:90px;text-align:right;">');

			aHTML.push('<span id="ns1blankspaceMessagingInbox_reply-' + sID + '" class="ns1blankspaceRowReply" data-cached="' + oRow.detailscached + '"></span>');
			
			if (bDeleted)
			{
				aHTML.push('<span style="width: 23px;" id="ns1blankspaceMessagingInbox_delete-' + sID +
								'" class="ns1blankspaceRowRecover"></span>');
			}
			else
			{
				aHTML.push('<span id="ns1blankspaceMessagingInbox_remove-' + sID + '" class="ns1blankspaceRowRemove"></span>');
			}
			
			aHTML.push('<span id="ns1blankspaceMessagingInbox_save-' + sID + '" class="ns1blankspaceRowSave" data-messageid="' + oRow.messageid + '"></span>');

			aHTML.push('<span id="ns1blankspaceMessagingInbox_open-' + sID + '" class="ns1blankspaceRowOpen" data-messageid="' + oRow.messageid + '"></span>');
			
			aHTML.push('</td></tr>');
			
			return aHTML.join('');
		},

		bind: function (oParam)
		{
			var sXHTMLContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlContainerID', {"default": 'ns1blankspaceRenderPage_IMAPInbox-0'}).value;

			$('#' + sXHTMLContainerID + ' td.ns1blankspaceRowSelect:not(.ns1blankspaceDeleted)').click(function()
			{
				$('td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
				$('#' + this.id).parent().find('td').removeClass('ns1blankspaceNotSeen');
				ns1blankspace.messaging.imap.search.send(this.id);
			});
				
			$('#' + sXHTMLContainerID + ' span.ns1blankspaceRowRemove').button(
			{
				text: false,
				icons:
				{
					 primary: "ui-icon-close"
				}
			})
			.click(function()
			{
				ns1blankspace.messaging.imap.inbox.remove(this.id);
			})
			.css('width', '15px')
			.css('height', '20px');
			
			$('#' + sXHTMLContainerID + ' span.ns1blankspaceRowRemovedDisabled').button(
			{
				text: false,
				disabled: true,
				icons:
				{
					 primary: "ui-icon-close"
				}
			})
			.css('width', '15px')
			.css('height', '20px');
				
			$('#' + sXHTMLContainerID + ' span.ns1blankspaceRowReply').button(
			{
				text: false,
				icons:
				{
					 primary: "ui-icon-arrowreturnthick-1-w"
				}
			})
			.click(function()
			{
				var oParam = {xhtmlElementID: this.id, reply: true, newEmail: true};

				$('td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
				$('#' + this.id).parent().find('td').removeClass('ns1blankspaceBold');

				// v2.0.6 Now checks to see if already editing
				if ($('#ns1blankspaceMainEdit').attr('data-objectcontext') != undefined)
				{
					oParam.functionDiscard = ns1blankspace.messaging.imap.search.send;
					ns1blankspace.messaging.imap.inbox.checkForEditing(oParam);
				}
				else
				{	
					ns1blankspace.messaging.imap.search.send(oParam);
				}
			})
			.css('width', '15px')
			.css('height', '20px');
				
			$('#' + sXHTMLContainerID + ' span.ns1blankspaceRowSave').button({
				text: false,
				icons:
				{
					 primary: "ui-icon-triangle-1-s"
				}
			})
			.click(function() {
			
				if ($(ns1blankspace.xhtml.container).attr('data-initiator') == this.id)
				{
					$(ns1blankspace.xhtml.container).slideUp(500);
					$(ns1blankspace.xhtml.container).attr('data-initiator', '');
				}
				else
				{
					ns1blankspace.messaging.imap.inbox.save.show(
					{
						xhtmlElementID: this.id,
						messageID: $(this).attr('data-messageid')
					});
				}	
			})
			.css('width', '15px')
			.css('height', '20px');

			$('#' + sXHTMLContainerID + ' span.ns1blankspaceRowRecover').button(
			{
				text: false,
				label: "Recover",
				icons:
				{
					 primary: "ui-icon-refresh"
				}
			})
			.click(function()
			{
				ns1blankspace.messaging.imap.inbox.recover(this.id);
			})
			.css('width', '15px')
			.css('height', '20px');

			$('#' + sXHTMLContainerID + ' span.ns1blankspaceRowOpen').button(
			{
				text: false,
				icons:
				{
					 primary: "ui-icon-newwin"
				}
			})
			.click(function()
			{
				$('#' + this.id).parent().find('td').removeClass('ns1blankspaceNotSeen');
				this.id = this.id.split('-').pop();
				window.open(document.location.origin + '/#/messaging.imap/' + this.id);
			})
			.css('width', '15px')
			.css('height', '20px');
		},

		remove: function (sXHTMLElementID, oParam)
		{
			var aSearch = sXHTMLElementID.split('-');
			var sElementID = aSearch[0];
			var sSearchContext = aSearch[1];
			var bConfirmed = ns1blankspace.util.getParam(oParam, 'confirmed', {"default": false}).value;
			var bArchive = ns1blankspace.util.getParam(oParam, 'archive', {"default": false}).value;

			if (!bConfirmed)
			{
				if ($(ns1blankspace.xhtml.container).attr('data-initiator') == sXHTMLElementID)
				{
					$(ns1blankspace.xhtml.container).slideUp(500);
					$(ns1blankspace.xhtml.container).attr('data-initiator', '');
				}
				else
				{	
					$(ns1blankspace.xhtml.container).attr('data-initiator', sXHTMLElementID)

					ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: -94, topOffset: -20});

					var aHTML = [];
									
					aHTML.push('<div style="margin-right:4px;" id="ns1blankspaceMessageRemove" class="ns1blankspaceAction">Delete</div>');

					$(ns1blankspace.xhtml.container).html(aHTML.join(''));

					$('#ns1blankspaceMessageRemove').button(
					{
						label: 'Delete'
					})
					.click(function()
					{
						ns1blankspace.app.options.hide();
						oParam = ns1blankspace.util.setParam(oParam, 'confirmed', true);
						ns1blankspace.messaging.imap.inbox.remove(sXHTMLElementID, oParam);
					})
					.css('width', '70px')
					.css('height', '25px');
				}
			}	
			else
			{	
				ns1blankspace.status.working('Removing...');

				$('#' + sXHTMLElementID).parent().parent().css('opacity', '0.5');
				$('#' + sXHTMLElementID).parent().parent().children().removeClass('ns1blankspaceRowSelect');
				
				oData = 
				{
					id: sSearchContext,
					destinationfolder: ns1blankspace.messaging.imap.emailAccount[(bArchive && ns1blankspace.messaging.imap.emailAccount.archivedFolder ? 'archivedFolder':'deletedFolder')]
				}

				// v 2.0.6 Must have a destination folder to save to otherwise call fails. If none, we delete and remove from view as per ns1blankspace.messaging.showRemoved
				// Also added error handling

				if (ns1blankspace.messaging.showRemoved)
				{
					$('#' + sXHTMLElementID).button({disabled: true});
				}
				else
				{
					$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
				}

				if (oData.destinationfolder)
				{
					$.ajax(
					{
						type: 'POST',
						url: '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_MOVE_FOLDER',
						data: oData,
						dataType: 'json',
						success: function(data)
						{
							if (data.status == 'OK')
							{	
								// if (ns1blankspace.messaging.showRemoved)
								// {
								// 	$('#' + sXHTMLElementID).button({disabled: true});
								// }
								// else
								// {
								// 	$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
								// }

								ns1blankspace.status.message('');
							}
							else
							{
								ns1blankspace.status.error('Unable to delete email: ' + oResponse.error.errornotes);
							}
						}
					});
				}
				else
				{
					oData.remove = '1';
					$.ajax(
					{
						type: 'POST',
						url: '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_MANAGE',
						data: oData,
						dataType: 'json',
						success: function(data)
						{
							if (data.status == 'OK')
							{	
								// if (ns1blankspace.messaging.showRemoved)
								// {
								// 	$('#' + sXHTMLElementID).button({disabled: true});
								// }
								// else
								// {
								// 	$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
								// }

								ns1blankspace.status.message('');
							}
							else
							{
								ns1blankspace.status.error('Unable to delete email: ' + oResponse.error.errornotes);
							}
						}
					});
				}
			}	
		},

		recover: 	function (sXHTMLElementID, oParam)
		{
			var aSearch = sXHTMLElementID.split('-');
			var sElementID = aSearch[0];
			var sSearchContext = aSearch[1];
			var bConfirmed = ns1blankspace.util.getParam(oParam, 'confirmed', {"default": false}).value;
			var bArchive = ns1blankspace.util.getParam(oParam, 'archive', {"default": false}).value;

			if (!bConfirmed)
			{
				if ($(ns1blankspace.xhtml.container).attr('data-initiator') == sXHTMLElementID)
				{
					$(ns1blankspace.xhtml.container).slideUp(500);
					$(ns1blankspace.xhtml.container).attr('data-initiator', '');
				}
				else
				{	
					$(ns1blankspace.xhtml.container).attr('data-initiator', sXHTMLElementID)

					ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: -196, topOffset: -20});

					var aHTML = [];
									
					aHTML.push('<div style="margin-right:4px;" id="ns1blankspaceMessageRecover" class="ns1blankspaceAction">Recover</div>');

					$(ns1blankspace.xhtml.container).html(aHTML.join(''));

					$('#ns1blankspaceMessageRecover').button(
					{
						label: 'Recover to the Inbox'
					})
					.click(function()
					{
						ns1blankspace.app.options.hide();
						oParam = ns1blankspace.util.setParam(oParam, 'confirmed', true);
						ns1blankspace.messaging.imap.inbox.recover(sXHTMLElementID, oParam);
					})
					.css('width', '170px')
					.css('height', '25px');
				}
			}	
			else
			{	
				ns1blankspace.status.working('Recovering...');

				$('#' + sXHTMLElementID).parent().parent().css('opacity', '0.5');
				$('#' + sXHTMLElementID).parent().parent().children().removeClass('ns1blankspaceRowSelect');
				
				oData = 
				{
					id: sSearchContext,
					destinationFolder: ns1blankspace.messaging.imap.emailAccount.inboxFolder
				}

				$.ajax(
				{
					type: 'POST',
					url: '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_MOVE_FOLDER',
					data: oData,
					dataType: 'json',
					success: function(data)
					{
						if (data.status == 'OK')
						{	
							$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
						}

						ns1blankspace.status.message('');
					}
				});

			}	
		},

		markReadUnread: function (oParam)
		{
			// v2.0.6 added Unread support
			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
			var bRead = ns1blankspace.util.getParam(oParam, 'read').value;
			var sID = sXHTMLElementID.split('-').pop();

			if (!bRead)		// Mark as Read
			{			
				$('#' + sXHTMLElementID).parent().removeClass('ns1blankspaceNotSeen');
				$('#' + sXHTMLElementID).parent().children().removeClass('ns1blankspaceNotSeen')

				var oData =
				{
					flags: '\\SEEN',
					account: ns1blankspace.messaging.imap.account,
					id: sID
				}	
						
			}	
			else 		// Mark as Unread
			{
				$('#' + sXHTMLElementID).parent().addClass('ns1blankspaceNotSeen');
				$('#' + sXHTMLElementID).parent().children().addClass('ns1blankspaceNotSeen')

				var oData =
				{
					flags: '',
					account: ns1blankspace.messaging.imap.account,
					id: sID
				}	
			}	

			$.ajax(
			{
				type: 'POST',
				url: '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_MANAGE',
				data: oData,
				dataType: 'json',
				success: function(oResponse)
				{
					if (oResponse.status == 'OK')
					{
						if (!bRead)
						{
							ns1blankspace.messaging.emailRead.push(sID);
						}
						else
						{
							var iIndex = ns1blankspace.messaging.emailRead.indexOf(sID);
							if (iIndex > -1) {ns1blankspace.messaging.emailRead.splice(iIndex, 1);}
						}
					}
				}
			});
		},

		save: 		
		{
			show:		function (oParam)
			{
				// v2.0.6 added Mark as Unread support

				var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
				var sCacheID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
				var bInbox = ns1blankspace.util.getParam(oParam, 'inbox', {"default": true}).value;
				var iLeftOffset = ns1blankspace.util.getParam(oParam, 'leftOffset', {"default": -290}).value;
				var iTopOffset = ns1blankspace.util.getParam(oParam, 'topOffset', {"default": 4}).value;
				var bRead = !$('#ns1blankspaceMessagingInbox_subject-' + sXHTMLElementID.split('-').pop()).hasClass('ns1blankspaceNotSeen');
				var iActionID = ns1blankspace.util.getParam(oParam, 'actionID').value;
				var iMessageID = ns1blankspace.util.getParam(oParam, 'messageID').value;
				
				$(ns1blankspace.xhtml.container).attr('data-initiator', sXHTMLElementID)
							
				ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: iLeftOffset, topOffset: iTopOffset});
				
				var aHTML = [];
					
				aHTML.push('<table id="ns1blankspaceMessageSaveContainer" class="ns1blankspaceDropDown" style="width:320px; margin-top:0px; opacity:1.0;">');

				if (bInbox)
				{	
					aHTML.push('<tr><td style="text-align:right; padding-bottom:10px; border-bottom-style:solid; border-width: 1px; border-color:#D0D0D0;" colspan=2 id="ns1blankspaceMessageContainerColumn1">' +
								'<div style="margin-right:4px;" id="ns1blankspaceMessageMarkReadUnread" class="ns1blankspaceAction">Mark as ' + ((bRead) ? 'un': '') + 'read</div>' +
								'<div style="margin-right:4px;" id="ns1blankspaceMessageReplyAll" class="ns1blankspaceAction">Reply All</div>' +
								'<div style="margin-right:4px;" id="ns1blankspaceMessageForward" class="ns1blankspaceAction">Forward</div>' +
								'</td></tr>');
				}

				aHTML.push('<tr><td id="ns1blankspaceMessageSaveContainerColumn1"></td>' +
								'<td id="ns1blankspaceMessageSaveContainerColumn2" style="width:75px;"></td></tr>' +
								'</table>');					
			
				$(ns1blankspace.xhtml.container).html(aHTML.join(''))

				$('#ns1blankspaceMessageMarkReadUnread').button(
				{
					label: 'Mark as ' + ((bRead) ? 'un': '') + 'read'
				})
				.click(function()
				{
					ns1blankspace.app.options.hide();
					sXHTMLElementID = sXHTMLElementID.replace('_save', '_from');
					ns1blankspace.messaging.imap.inbox.markReadUnread({xhtmlElementID: sXHTMLElementID, read: bRead});
				});

				$('#ns1blankspaceMessageReplyAll').button(
				{
					label: 'All',
					icons:
					{
						 primary: "ui-icon-arrowreturnthick-1-w"
					}
				})
				.click(function()
				{
					var oParam = {xhtmlElementID: sXHTMLElementID, replyAll: true, newEmail: true};

					ns1blankspace.app.options.hide();
					$('td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
					$('#' + sXHTMLElementID).parent().find('td').removeClass('ns1blankspaceBold');
	
					// v2.0.6 Now checks to see if already editing
					if ($('#ns1blankspaceMainEdit').attr('data-objectcontext') != undefined)
					{
						oParam.functionDiscard = ns1blankspace.messaging.imap.search.send;
						ns1blankspace.messaging.imap.inbox.checkForEditing(oParam);
					}
					else
					{	
						ns1blankspace.messaging.imap.search.send(oParam);
					}
					
				});

				$('#ns1blankspaceMessageForward').button(
				{
					text: false,
					label: 'Forward',
					icons:
					{
						 primary: "ui-icon-arrow-1-e"
					}
				})
				.click(function()
				{
					var oParam = {xhtmlElementID: sXHTMLElementID, forward: true, newEmail: true};

					ns1blankspace.app.options.hide();
					$('td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
					$('#' + sXHTMLElementID).parent().find('td').removeClass('ns1blankspaceBold');
	
					// v2.0.6 Now checks to see if already editing
					if ($('#ns1blankspaceMainEdit').attr('data-objectcontext') != undefined)
					{
						oParam.functionDiscard = ns1blankspace.messaging.imap.search.send;
						ns1blankspace.messaging.imap.inbox.checkForEditing(oParam);
					}
					else
					{	
						ns1blankspace.messaging.imap.search.send(oParam);
					}
				});

				var aHTML = [];
				var sFromName = (bInbox ? $('#ns1blankspaceMessagingInbox_from-' + sCacheID).html() : ns1blankspace.objectContextData.fromname);
				var sFrom = (bInbox ? $('#ns1blankspaceMessagingInbox_from-' + sCacheID).attr('title') : ns1blankspace.objectContextData.from);
					
				aHTML.push('<table>');
				
				// If a CACHE message, allow user to save contacts, attachments, etc
				if (iMessageID)
				{
					aHTML.push('<tr><td class="ns1blankspace" style="font-size: 0.875em;">' +
									'<input type="checkbox" checked="checked" id="ns1blankspaceMessageSaveContacts"/> Create contacts' +
									'</td></tr>');

					aHTML.push('<tr id="ns1blankspaceMessageSaveContactNameLabel" style="display:' + (sFromName != sFrom ? 'none' : 'block') + ';">' +
									'<td style="padding-left:25px;" class="ns1blankspaceCaption">' +
									'Contact Name</td></tr>');

					aHTML.push('<tr id="ns1blankspaceMessageSaveContactNameValue" style="display:' + (sFromName != sFrom ? 'none' : 'block') + ';">' +
									'<td id="ns1blankspaceMessageSaveContactNameValueCell" style="font-size:0.75em;padding-left:25px;padding-bottom:8px;">' +
										ns1blankspace.xhtml.loadingSmall +
									'</td></tr>');

					aHTML.push('<tr><td class="ns1blankspace" style="font-size: 0.875em;">' +
									'<input type="checkbox" checked="checked" id="ns1blankspaceMessageSaveAttachments"/> Save attachments' +
									'</td></tr>');
				}

				aHTML.push('<tr><td class="ns1blankspace" style="font-size: 0.875em;">' +
								'<input type="checkbox" id="ns1blankspaceMessageSavePrivate"/> Set as private' +
								'</td></tr>');

				aHTML.push('<tr><td style="padding-left:25px;style="font-size: 0.875em;"" class="ns1blankspaceCaption">' +
								'Subject</td></tr>');

				aHTML.push('<tr><td style="padding-left:25px;">' +
								'<input id="ns1blankspaceMessageSaveSubject" class="ns1blankspaceText">' +
								'</td></tr>');

				aHTML.push('<tr class="ns1blankspace">' +
								'<td class="ns1blankspaceRadio">' +
								'<input type="checkbox" id="ns1blankspaceMessageSaveObject" />' +
								'<select id="ns1blankspaceMessageSaveObjectValue" style="width:138px;">');


				$.each(ns1blankspace.messaging.imap.data.objects, function(i, v)
				{
					aHTML.push('<option value="' + v.id + '" data-method="' + v.method + '"' +
								(v.columns?' data-columns="' + v.columns + '"':'') +
								(v.methodFilter?' data-methodfilter="' + v.methodFilter + '"':'') + '>' +
								v.caption + '</option>');
				});
							
				aHTML.push('</select>' +
								'</td></tr>');

				aHTML.push('<tr><td style="padding-left:25px;">' +
								'<input id="ns1blankspaceMessageSaveObjectContext" style="padding:3px;">' +
								'</td></tr>');

				aHTML.push('<tr><td style="padding-left:20px; padding-top:4px;" id="ns1blankspaceMessageSaveObjectContextSearch"></td></tr>');

				aHTML.push('</table>');					
			
				$('#ns1blankspaceMessageSaveContainerColumn1').html(aHTML.join(''));

				$('#ns1blankspaceMessageSaveObjectContext').keyup(function ()
				{
					if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
						ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.messaging.imap.inbox.save.search()', ns1blankspace.option.typingWait);
				});

				var aHTML = [];

				aHTML.push('<table>');
				
				aHTML.push('<tr><td>' +
								'<span id="ns1blankspaceMessageSave" class="ns1blankspaceAction">Save</span>' +
								'</td></tr>');

				aHTML.push('<tr><td style="padding-top:10px;">' +
								'<span id="ns1blankspaceMessageToDo" class="ns1blankspaceAction">Save as To Do</span>' +
								'</td></tr>');
				
				aHTML.push('</table>');					
			
				$('#ns1blankspaceMessageSaveContainerColumn2').html(aHTML.join(''));

				// v2.0.6b Check if contact with current email address already exists if no name passed but only for CACHE emails
				if (iMessageID && sFromName === sFrom)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'CONTACT_PERSON_SEARCH';
					oSearch.addField('firstname,surname,email,contactbusinesstext');
					oSearch.addFilter('email', 'EQUAL_TO', sFrom);
					oSearch.addBracket('(');
					oSearch.addFilter('firstname', 'IS_NOT_NULL');
					oSearch.addOperator('or');
					oSearch.addFilter('surname', 'IS_NOT_NULL');
					oSearch.addBracket(')');
					oSearch.getResults(function(oResponse)
					{
						if (oResponse.status == 'OK')
						{
							// If we have a name, then put it into ns1blankspaceMessageSaveContactNameValueCell
							if (oResponse.data.rows.length > 0)
							{
								$('#ns1blankspaceMessageSaveContactNameValueCell').html(oResponse.data.rows[0].firstname.formatXHTML() + ' ' +
																						oResponse.data.rows[0].surname.formatXHTML() +
																				(oResponse.data.rows[0].contactbusinesstext != "" 
																					? ' of ' + oResponse.data.rows[0].contactbusinesstext.formatXHTML()
																					: ''));
							}
							// No name - ask user to add it
							else
							{
								$('#ns1blankspaceMessageSaveContactNameValueCell').html('<input id="ns1blankspaceMessageSaveContactName" class="ns1blankspaceText">');
							}
						}
						else
						{
							$('#ns1blankspaceMessageSaveContactNameValueCell').html('Error finding contact name: ' + oResponse.error.errornotes);
						}
					})

				}

				// v2.0.6b Added ability to save different subject
				$('#ns1blankspaceMessageSaveSubject').val((bInbox) 
															? $('#ns1blankspaceMessagingInbox_subject-' + sCacheID).html()
															: ns1blankspace.objectContextData.subject.formatXHTML());

				// v2.0.6b If Create Contacts is ticked and fromname & from are the same, allow user to enter contact name
				$('#ns1blankspaceMessageSaveContacts').on('click', function()
				{
					if ($('#ns1blankspaceMessageSaveContacts').attr('checked') === 'checked')
					{
						if (!$('#ns1blankspaceMessageSaveContactNameLabel').is(':visible'))
						{
							$('#ns1blankspaceMessageSaveContactNameLabel').show();
							$('#ns1blankspaceMessageSaveContactNameValue').show();
						}
					}
					else
					{
						if ($('#ns1blankspaceMessageSaveContactNameLabel').is(':visible'))
						{
							$('#ns1blankspaceMessageSaveContactNameLabel').hide();
							$('#ns1blankspaceMessageSaveContactNameValue').hide();
						}
					}
				});

				$('#ns1blankspaceMessageSave').button(
				{
					label: 'Save'
				})
				.click(function()
				{
					// v2.0.6b If fromname is identical to the email address (because sender didn't add name info) and we're creating contacts, make sure user has entered a name
					ns1blankspace.okToSave = true;
					var bCreateContact = false;

					if ($('#ns1blankspaceMessageSaveContactNameValueCell').is(':visible') && $('#ns1blankspaceMessageSaveContactNameValueCell').html() === ns1blankspace.xhtml.loadingSmall)
					{
						ns1blankspace.status.message('Please wait until app completes searching for a contact.')
					}
					else
					{
						sFromName = ($('#ns1blankspaceMessageSaveContactName').is('*')) ? sFromName : $('#ns1blankspaceMessageSaveContactNameValueCell').html();
						if (sFromName === sFrom && $('#ns1blankspaceMessageSaveContacts').attr('checked') === 'checked' && $('#ns1blankspaceMessageSaveContactName').is('*'))
						{
							if ($('#ns1blankspaceMessageSaveContactName').val() === '')
							{
								ns1blankspace.okToSave = false;
								ns1blankspace.status.message('You must enter a Contact Name if you are saving contacts');
							}
							// Here we call to contactSave function prior to calling Save
							else
							{
								sFromName = $('#ns1blankspaceMessageSaveContactName').val();
								bCreateContact = true;
							}
						}

						if (ns1blankspace.okToSave)
						{
							ns1blankspace.status.working('Saving...');
							$(ns1blankspace.xhtml.container).hide();
							ns1blankspace.show({selector: '#ns1blankspaceMainInbox'});

							if (bCreateContact)
							{
								oParam.onComplete = ns1blankspace.messaging.imap.inbox.save.send;
								oParam.saveFromName = sFromName;
								oParam.saveFrom = sFrom;
								ns1blankspace.messaging.imap.inbox.save.createContact(oParam);
							}
							else
							{
								ns1blankspace.messaging.imap.inbox.save.send(oParam);
							}
						}
					}
				})
				.css('width', '75px');
			
				$('#ns1blankspaceMessageToDo').button(
				{
					label: "Save as<br />To Do"
				})
				.click(function()
				{
					ns1blankspace.status.working('Saving as To Do...');
					oParam.onComplete = ns1blankspace.messaging.imap.inbox.save.todo;
					ns1blankspace.messaging.imap.inbox.save.send(oParam);
					ns1blankspace.show({selector: '#ns1blankspaceMainInbox'});
				})
				.css('width', '75px');
			},

			search: 	function (oParam, oResponse)
			{
				var iObject = $('#ns1blankspaceMessageSaveObjectValue :selected').val();
				var sColumns = $('#ns1blankspaceMessageSaveObjectValue :selected').attr('data-columns');
				if (sColumns === undefined) {sColumns = 'reference'}

				if (oResponse === undefined)
				{	
					$('#ns1blankspaceMessageSaveObjectContextSearch').html(ns1blankspace.xhtml.loadingSmall);

					var sMethod = $('#ns1blankspaceMessageSaveObjectValue :selected').attr('data-method');
					var sSearchText = $('#ns1blankspaceMessageSaveObjectContext').val();
					var aSearchFilters = $('#ns1blankspaceMessageSaveObjectValue :selected').attr('data-methodFilter');
					aSearchFilters = (aSearchFilters) ? aSearchFilters.split('|') : undefined;

					var oSearch = new AdvancedSearch();
					oSearch.method = sMethod;
					oSearch.addField(sColumns);
					
					if (iObject == 32)
					{	
						var aSearchText = sSearchText.split(' ');

						oSearch.addBracket("(")		//2.0.6 added brackets
						if (aSearchText.length > 1)
						{
							oSearch.addFilter('firstname', 'TEXT_STARTS_WITH', aSearchText[0]);
							oSearch.addFilter('surname', 'TEXT_STARTS_WITH', aSearchText[1]);
						}
						else
						{
							oSearch.addFilter('firstname', 'TEXT_IS_LIKE', sSearchText);
							oSearch.addOperator('or');
							oSearch.addFilter('surname', 'TEXT_IS_LIKE', sSearchText);
						}	
						oSearch.addBracket(")")
					}
					else
					{
						if (aSearchFilters && aSearchFilters.length > 0)
						{
							oSearch.addBracket("(")		//2.0.6 added brackets
							$.each(aSearchFilters, function(i, t)
							{
								var aFilterOptions = t.split('-');
								oSearch.addFilter(aFilterOptions[0], 
										((aFilterOptions.length > 1) ? aFilterOptions[1] : undefined), 
										((aFilterOptions.length === 2) ? sSearchText : undefined));
								if (aSearchFilters.length > (i + 1))
								{
									oSearch.addOperator('or')
								}
							});
							oSearch.addBracket(")")
						}
						else
						{
							oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
						}
					}	
					
					oSearch.rows = 15;
					oSearch.rf = 'json';
					oSearch.getResults(function(data) {ns1blankspace.messaging.imap.inbox.save.search(oParam, data)});
				}
				else
				{
					var aHTML = [];
					
					var aColumns = sColumns.split(',');

					aHTML.push('<table class="ns1blankspace" style="font-size:0.875em;" id="ns1blankspaceMessageSaveObjectContextSearchResults">');
					
					$.each(oResponse.data.rows, function(i, v) 
					{ 
						var sText = '';
						$.each(aColumns, function(j, k)
						{	
							sText += v[k] + ' ';
						});

						aHTML.push('<tr><td id="ns1blankspaceItem_title-' + v.id +'" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
										sText + '</td></tr>');	
					});
					
					aHTML.push('</table>');

					$('#ns1blankspaceMessageSaveObjectContextSearch').html(aHTML.join(''))
					
					$('#ns1blankspaceMessageSaveObjectContextSearchResults td.ns1blankspaceRowSelect')
					.click(function()
					{
						var sID = this.id;
						var aID = sID.split('-');

						$('#ns1blankspaceMessageSaveObjectContext').attr('data-id', aID[1]);
						$('#ns1blankspaceMessageSaveObjectContext').attr('data-object', iObject);
						$('#ns1blankspaceMessageSaveObjectContext').val($(this).html());
						$('#ns1blankspaceMessageSaveObjectContextSearch').html('');
						$('#ns1blankspaceMessageSaveObject').prop('checked', true);
					});
				}
			},		

			createContact: function(oParam)
			{
				var sFirstName;
				var sSurname;
				var aFromName = oParam.saveFromName.split(' ');
				var oData = {};
				
				if (oParam.createContactStep === undefined) {oParam.createContactStep = 1}

				// First see if a contact with this email address exists as we only create if it doesn't
				if (oParam.createContactStep == 1)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'CONTACT_PERSON_SEARCH';
					oSearch.addField('email,firstname,surname');
					oSearch.addFilter('email', 'EQUAL_TO', oParam.saveFrom);
					oSearch.rows = 1;
					oSearch.getResults(function(oResponse)
					{
						if (oResponse.status == 'OK')
						{
							if (oResponse.data.rows.length > 0)
							{
								// If any contacts with this email don't have a name, update them with the name passed
								oParam.contactsWithNoName = $.grep(oResponse.data.rows, function(x) {return x.firstname + x.surname === ''});
								oParam.createContactStep = (oParam.contactsWithNoName.length > 0) ? 2 : 3;
							}
							else 
							{
								oParam.contactsWithNoName = [{id: '', email: oParam.saveFrom, firstname: '', surname: ''}];
								oParam.createContactStep = 2;
							}
						}
						else
						{
							ns1blankspace.status.error('Error searching for contact: ' + oResponse.error.errornotes);
							oParam.createContactStep = 3;
							delete(oParam.onComplete);

						}
						ns1blankspace.messaging.imap.inbox.save.createContact(oParam);
					});
				}

				// Create the contact record
				else if (oParam.createContactStep === 2)
				{
					if (oParam.createContactIndex == undefined) {oParam.createContactIndex = 0}

					sSurname = aFromName.pop();
					sFirstName = (aFromName.length === 0) ? '' : aFromName.join(' ');
					oData.firstname = sFirstName;
					oData.surname = sSurname;

					if (oParam.createContactIndex < oParam.contactsWithNoName.length)
					{
						oData.email = oParam.contactsWithNoName[oParam.createContactIndex].email;
						if (oParam.contactsWithNoName[oParam.createContactIndex].id != '')
						{
							oData.id = oParam.contactsWithNoName[oParam.createContactIndex].id;
						}

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('CONTACT_PERSON_MANAGE'),
							data: oData,
							success: function(oResponse)
							{
								oParam.createContactIndex += 1;
								if (oResponse.status != 'OK')
								{
									ns1blankspace.status.error('Error ' + (oData.id === undefined ? 'creat' : 'updat') + ' ing contact: ' + oResponse.error.errornotes);
									delete(oParam.onComplete);

								}
								ns1blankspace.messaging.imap.inbox.save.createContact(oParam);
							}
						});
					}
					else
					{
						oParam.createContactStep = 3;
						delete(oParam.createContactIndex);
						delete(oParam.contactsWithNoName);
						ns1blankspace.messaging.imap.inbox.save.createContact(oParam);
					}
				}

				// Call the save method to save the email
				else if (oParam.createContactStep === 3)
				{
					delete(oParam.createContactStep);
					delete(oParam.saveFromName);
					delete(oParam.saveFrom);
					if (oParam.onComplete)
					{	ns1blankspace.util.onComplete(oParam);}
				}

			},

			send:		function (oParam)
			{
				// v2.0.6c Different behaviour if we're saving and already saved action to a CACHE email
				var sCacheID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
				var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
				var bInbox = ns1blankspace.util.getParam(oParam, 'inbox', {"default": true}).value;
				var iActionID = ns1blankspace.util.getParam(oParam, 'actionID').value;
				var sMethod = (iActionID) ? 'ACTION_MANAGE' : 'MESSAGING_EMAIL_CACHE_ACTION_CREATE';

				$('#' + sXHTMLElementID).parent().parent().css('opacity', '0.5');
				$('#' + sXHTMLElementID).parent().parent().children().removeClass('ns1blankspaceRowSelect');

				if (iActionID)
				{	// We're saving an already saved action
					var oData =
					{
						id: iActionID,
						private: ($('#ns1blankspaceMessageSavePrivate').prop('checked')?'Y':'N'),
						subject: $('#ns1blankspaceMessageSaveSubject').val()
					}
				}
				else
				{	// We're saving from the CACHE
					var oData =
					{
						account: ns1blankspace.messaging.imap.account,
						id: sCacheID,
						autocreatecontacts: ($('#ns1blankspaceMessageSaveContacts').prop('checked')?'Y':'N'),
						saveattachments: ($('#ns1blankspaceMessageSaveAttachments').prop('checked')?'Y':'N'),
						private: ($('#ns1blankspaceMessageSavePrivate').prop('checked')?'Y':'N'),
						subject: $('#ns1blankspaceMessageSaveSubject').val()
					}
				}

				if ($('#ns1blankspaceMessageSaveObject').prop('checked'))
				{
					oData.object = $('#ns1blankspaceMessageSaveObjectContext').attr('data-object');
					oData.objectcontext = $('#ns1blankspaceMessageSaveObjectContext').attr('data-id');
					if (oData.object == '12') {oData.contactbusiness = oData.objectContext}		// v2.0.6 also saves against business / person if we have this info
					if (oData.object == '32') {oData.contactperson = oData.objectContext}
				}
				
				
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI(sMethod),
					data: oData,
					dataType: 'json',
					success: function(data)
					{
						if (data.status == 'OK')
						{
							if (ns1blankspace.util.getParam(oParam, 'onComplete').value === undefined)
							{	
								ns1blankspace.status.message('Saved')
								$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

								if (iActionID == undefined)
								{
									sXHTMLElementID = 'ns1blankspaceMessagingInbox_save-' + sCacheID;
									oParam = ns1blankspace.util.setParam(oParam, 'confirmed', true);
									oParam = ns1blankspace.util.setParam(oParam, 'archive', true);
									ns1blankspace.messaging.imap.inbox.remove(sXHTMLElementID, oParam);
								}
							}
							else
							{	
								oParam.action = (iActionID) ? data.id : data.action;
								ns1blankspace.util.onComplete(oParam);
							}	
						}	
					}
				});	
			},

			todo: 		function (oParam)
			{
				var iID = ns1blankspace.util.getParam(oParam, 'action').value;
				var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
				var sCacheID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;

				if (iID !== undefined)
				{
					var oData =
					{
						id: iID,
						status: 2
					}

					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
						data: oData,
						dataType: 'json',
						success: function(data)
						{
							if (data.status == 'OK')
							{	
								ns1blankspace.status.message('Saved as To Do')
								$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);
								sXHTMLElementID = 'ns1blankspaceMessagingInbox_save-' + sCacheID;
								oParam = ns1blankspace.util.setParam(oParam, 'confirmed', true);
								oParam = ns1blankspace.util.setParam(oParam, 'archive', true);
								ns1blankspace.messaging.imap.inbox.remove(sXHTMLElementID, oParam);
							}	
						}
					});
				}
			},				
		}						
	},

	search: 	
	{
		send: function (sXHTMLElementID, oParam)
		{
			if ($.type(sXHTMLElementID) === "object") 
			{
				oParam = sXHTMLElementID;
				if (oParam.xhtmlElementID) {sXHTMLElementID = oParam.xhtmlElementID; delete(oParam.xhtmlElementID);}
			}

			if ($('#ns1blankspaceViewMessagingEmailLarge').length == 0)
			{
				ns1blankspace.messaging.imap.home()
			}

			var aSearch = sXHTMLElementID.split('-');
			var sElementID = aSearch[0];
			var sSearchContext = aSearch[1];
			var iMinimumLength = 0;
			var iSource = ns1blankspace.data.searchSource.text;
			var sSearchText;
			var iMaximumColumns = 1;
			var iRows = 10;
			var iAccount = (ns1blankspace.messaging.imap.account!=undefined?ns1blankspace.messaging.imap.account:ns1blankspace.messaging.imap.data.defaultAccount);
			
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
				ns1blankspace.show({selector: '#ns1blankspaceMainSummary', refresh: true});
				
				ns1blankspace.objectContext = sSearchContext;
				ns1blankspace.messaging.action = -1;

				var oSearch = new AdvancedSearch();
				oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
				oSearch.addField('messageid,to,cc,from,fromname,subject,date,' +
									'message,hasattachments,attachments,imapflags,detailscached');
				oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
				oSearch.rows = 1;
				oSearch.getResults(function(data) {ns1blankspace.messaging.imap.show(oParam, data)});	
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
					sElementID = 'ns1blankspaceViewControlBrowse';
				}
				
				if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
				{
					ns1blankspace.search.start();

					var oSearch = new AdvancedSearch();
					oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';

					oSearch.addField('subject,from,fromname,date');

					if (ns1blankspace.search.advanced.filtersAreSet())
					{
						ns1blankspace.search.advanced.addFilters(oSearch);
					}
					else
					{	
						oSearch.addFilter('account', 'EQUAL_TO', iAccount);
						oSearch.addBracket('(')
						oSearch.addFilter('subject', 'TEXT_IS_LIKE', sSearchText);
						oSearch.addOperator('or');
						oSearch.addFilter('message', 'TEXT_IS_LIKE', sSearchText);
						oSearch.addOperator('or');
						oSearch.addFilter('from', 'TEXT_IS_LIKE', sSearchText);
						oSearch.addOperator('or');
						oSearch.addFilter('fromname', 'TEXT_IS_LIKE', sSearchText);
						oSearch.addBracket(')');
					}

					oSearch.rows = iRows;
					oSearch.getResults(function(data) {ns1blankspace.messaging.imap.search.process(oParam, data)});
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
				var sFrom;
				var sDate = '';
				var sTime = '';

				aHTML.push('<table class="ns1blankspaceSearchMedium" style="width:520px;">');
					
				$.each(oResponse.data.rows, function(r, oRow)
				{
					aHTML.push('<tr class="ns1blankspaceSearch">');

					var oDate = Date.parseExact(this.date, "d MMM yyyy H:mm:ss");

					if (oDate != null)
					{ 
						var sDate = oDate.toString("d MMM yyyy");
						var sTime = oDate.toString("h:mm tt");
					}

					if (this.fromname == this.from)
					{
						sFrom = this.fromname
					}
					else
					{
						sFrom = '<div>' + this.fromname + '</div>' +
									'<div class="ns1blankspaceSubNote">' + this.from + '</div>'
					}

					aHTML.push('<td class="ns1blankspaceSearch" id="' +
									'-' + this.id + '">' +
									sFrom + '</td>');

					aHTML.push('<td class="ns1blankspaceSearch" id="' +
									'-' + this.id + '">' +
									this.subject + '</td>');

					aHTML.push('<td class="ns1blankspaceSearch" style="width:85px;" id="' +
									'-' + this.id + '">' +
									sDate + '<br /><span class="ns1blankspaceSub">' + sTime + '</span></td>');

					aHTML.push('</tr>');
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
					ns1blankspace.messaging.imap.search.send(this.id);
				});
			}	
		}
	},
						
	layout: 	function (oParam)
	{
		var aHTML = [];
		
		var bReply = ns1blankspace.util.getParam(oParam, 'reply', {"default": false}).value;
		var bReplyAll = ns1blankspace.util.getParam(oParam, 'replyAll', {"default": false}).value;
		var bForward = ns1blankspace.util.getParam(oParam, 'forward', {"default": false}).value;
			
		$('td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');

		aHTML.push('<table class="ns1blankspaceControl" style="padding-top:5px; margin-top:13px; border-top-style:solid; border-top-width: 1px; border-top-color:#D0D0D0;">');

		var bSelect = !(bReply || bReplyAll || bForward)
		
		if (bReply || bReplyAll || bForward) 
		{
			aHTML.push('<tr class="ns1blankspaceControl">' +
						'<td id="ns1blankspaceControlSummary" class="ns1blankspaceControl" style="padding-top:15px;">' +
						'Message</td>' +
						'</tr>');
		}
		else
		{
			aHTML.push('<tr class="ns1blankspaceControl">' +
						'<td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight" style="padding-top:15px;">' +
						'Message</td>' +
						'</tr>');
		}
		
		if (bReply || bSelect)
		{	
			aHTML.push('<tr class="ns1blankspaceControl">' +
						'<td id="ns1blankspaceControlReply" class="ns1blankspaceControl ns1blankspaceMessageSelect' + (bReply?' ns1blankspaceHighlight':'') + '">' +
						'Reply</td>' +
						'</tr>');
		}	

		if (bReplyAll || bSelect)
		{	
			aHTML.push('<tr class="ns1blankspaceControl">' +
						'<td id="ns1blankspaceControlReplyAll" class="ns1blankspaceControl ns1blankspaceMessageSelect' + (bReplyAll?' ns1blankspaceHighlight':'') + '">' +
						'Reply All</td>' +
						'</tr>');	
		}

		if (bForward || bSelect)
		{	
			aHTML.push('<tr class="ns1blankspaceControl">' +
						'<td id="ns1blankspaceControlForward" class="ns1blankspaceControl ns1blankspaceMessageSelect' + (bForward?' ns1blankspaceHighlight':'') + '">' +
						'Forward</td>' +
						'</tr>');
		}	
			
		aHTML.push('<tr class="ns1blankspaceControl">' +
							'<td id="ns1blankspaceControlDelete" class="ns1blankspaceControl ns1blankspaceMessageSelect" style="padding-top:18px;">' +
								'</td></tr>');
											
		aHTML.push('</table>');					
					
		$('#ns1blankspaceMessagingMessageControlContainer').html(aHTML.join(''));
		
		var aHTML = [];
		
		$('#ns1blankspaceControlSummary').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
			$(this).attr('data-messageid', ns1blankspace.objectContextData.messageid);
			//ns1blankspace.messaging.imap.summary();
		});

		$('#ns1blankspaceControlReply').click(function(event)
		{
			var oParam = {reply: true, newEmail: true};
			ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});

			// v2.0.6 Now calls checkForEditing
			if ((!bSelect && $('#ns1blankspaceMainEdit').attr('data-objectcontext') != undefined)
				|| (bSelect && ns1blankspace.objectContextData.messageid && $('#ns1blankspaceControlSummary').attr('data-messageid') 
					&& $('#ns1blankspaceControlSummary').attr('data-messageid') != ns1blankspace.objectContextData.messageid)
				)
			{
				oParam.functionDiscard = ns1blankspace.messaging.imap.message.edit.show;
				ns1blankspace.messaging.imap.inbox.checkForEditing(oParam);
			}	

			else
			{	
				ns1blankspace.messaging.imap.message.edit.show(oParam);
			}	
		});
		
		$('#ns1blankspaceControlReplyAll').click(function(event)
		{
			var oParam = {replyAll: true, newEmail: true};
			ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});

			// v2.0.6 Now calls checkForEditing
			if ((!bSelect && $('#ns1blankspaceMainEdit').attr('data-objectcontext') != undefined)
				|| (bSelect && ns1blankspace.objectContextData.messageid && $('#ns1blankspaceControlSummary').attr('data-messageid') 
					&& $('#ns1blankspaceControlSummary').attr('data-messageid') != ns1blankspace.objectContextData.messageid)
				)
			{
				oParam.functionDiscard = ns1blankspace.messaging.imap.message.edit.show;
				ns1blankspace.messaging.imap.inbox.checkForEditing(oParam);
			}	
			else
			{	
				ns1blankspace.messaging.imap.message.edit.show(oParam);
			}
		});

		$('#ns1blankspaceControlForward').click(function(event)
		{
			var oParam = {forward: true, newEmail: true};
			ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});

			// v2.0.6 Now calls checkForEditing
			if ((!bSelect && $('#ns1blankspaceMainEdit').attr('data-objectcontext') != undefined)
				|| (bSelect && ns1blankspace.objectContextData.messageid && $('#ns1blankspaceControlSummary').attr('data-messageid') 
					&& $('#ns1blankspaceControlSummary').attr('data-messageid') != ns1blankspace.objectContextData.messageid)
				)
			{
				oParam.functionDiscard = ns1blankspace.messaging.imap.message.edit.show;
				ns1blankspace.messaging.imap.inbox.checkForEditing(oParam);
			}	
			else
			{	
				ns1blankspace.messaging.imap.message.edit.show(oParam);
			}
		});
	
		$('#ns1blankspaceControlActions').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainActions'});
			ns1blankspace.messaging.imap.actions();
		});
	
		$('#ns1blankspaceControlAttachments').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainAttachments'});
			ns1blankspace.messaging.imap.attachments();
		});
	},

	show: function (oParam, oResponse)
	{
		var bReply = ns1blankspace.util.getParam(oParam, 'reply', {"default": false}).value;
		var bReplyAll = ns1blankspace.util.getParam(oParam, 'replyAll', {"default": false}).value;
		var bForward = ns1blankspace.util.getParam(oParam, 'forward', {"default": false}).value;
		var bDraft = ns1blankspace.util.getParam(oParam, 'draft', {"default": false}).value;
		var aHTML = [];
		var sHTML = '';
	
		ns1blankspace.app.clean();
		ns1blankspace.messaging.imap.layout(oParam);
		
		if (oResponse.data.rows.length == 0)
		{
			ns1blankspace.objectContextData = undefined;
		
			aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find the email.</td></tr></table>');
					
			$('#ns1blankspaceMainSummary').html(aHTML.join(''));
		}
		else
		{
			ns1blankspace.objectContextData = oResponse.data.rows[0];
			ns1blankspace.objectContextData.sourcetypetext = 'EMAIL'; 
									
			if (bReply || bReplyAll || bForward || bDraft)		// v2.0.6 Added draft support
			{
				ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});
				ns1blankspace.messaging.imap.message.edit.show(oParam)
			}
			else
			{
				ns1blankspace.messaging.imap.summary();
			}		
		}	
	},		
	
	summary:	function ()
	{
		ns1blankspace.status.message('');
		ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});

		var aHTML = [];

		$('#ns1blankspaceMainEdit').removeAttr('data-objectcontext');
		
		if (ns1blankspace.objectContextData == undefined)
		{
			aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this email message.</td></tr></table>');

			$('#ns1blankspaceMainSummary').html(aHTML.join(''));
		}
		else
		{
			aHTML.push('<table id="ns1blankspaceMessagingEmailContainer" class="ns1blankspace">');
		
			aHTML.push('<tr class="ns1blankspaceHeader">' +
							'<td id="ns1blankspaceMessagingEmailSubject" colspan=2 class="ns1blankspaceHeaderCaption" style="text-align:left; font-weight:bold; color:#000000;">' +
							ns1blankspace.objectContextData.subject + '</td>');
			
			aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">' +
						'<span class="ns1blankspaceMessagingEmailOptions" id="ns1blankspaceMessagingEmailOptions-' + ns1blankspace.objectContext + '"></span></td>');

			aHTML.push('</tr>');
			
			var sFrom = ns1blankspace.objectContextData.fromname;
			if (sFrom != ns1blankspace.objectContextData.from) {sFrom += ' (' + ns1blankspace.objectContextData.from + ')'}

			aHTML.push('<tr class="ns1blankspaceHeader">' +
							'<td id="ns1blankspaceMessagingEmailFromEmail" style="padding-bottom:10px;font-size:0.875em;">' +
							sFrom + '</td>');

			// 2.0.6e SUP022564 changed from date.parse to parseExact
			var oDate = Date.parseExact(ns1blankspace.objectContextData.date, "d MMM yyyy H:mm:ss");

			var sDate = '';

			if (oDate != null)
			{
				sDate = oDate.toString("ddd, dd MMM yyyy h:mm tt");
			}	

			aHTML.push('<td id="ns1blankspaceMessagingEmailDate" class="ns1blankspaceSub" style="text-align:right; width:175px; padding-bottom:10px; font-size:0.875em;">' +
							sDate + '</td>');
			
			aHTML.push('</tr>');
			
			aHTML.push('</table>');
			
			if (ns1blankspace.objectContextData.to != '')
			{
				aHTML.push('<table id="ns1blankspaceMessagingEmailToContainer" class="ns1blankspaceHeader" style="border-style: solid; border-width: 1px 0px 1px 0px ;border-color: #f3f3f3;">');
				aHTML.push('<tr class="ns1blankspaceHeader">' +
								'<td id="ns1blankspaceMessagingEmailToCaption" style="text-align:center; width:20px;background-color:#CCCCCC; color:#FFFFFF; padding:4px;">To</td>' +
								'<td id="ns1blankspaceMessagingEmailTo" style="padding:4px;" class="ns1blankspaceSub">');
								
				var sTo = (ns1blankspace.objectContextData.to).formatXHTML();
				var aTo = sTo.split('#')
				sTo = '';
			
				$.each(aTo, function(i)
				{	
					var aEmail = this.split('|');
					var aEmailTmp = aEmail[1].split('&gt;');
					sTo += '<span title="' + aEmail[0] + '">' + aEmailTmp[0] + '</span>; '
				});				
								
				aHTML.push(sTo);

				aHTML.push('</td></tr>');
				aHTML.push('</table>');
			}
			
			if (ns1blankspace.objectContextData.cc != '')
			{
				aHTML.push('<table id="ns1blankspaceMessagingEmailCCContainer" class="ns1blankspaceHeader" style="border-style: solid; border-width: 1px 0px 1px 0px ;border-color: #f3f3f3;">');
				aHTML.push('<tr class="ns1blankspaceHeader">' +
								'<td id="ns1blankspaceMessagingEmailCCCaption" style="text-align:center; width:20px;background-color:#CCCCCC; color:#FFFFFF; padding:4px;">Cc</td>' +
								'<td id="ns1blankspaceMessagingEmailCC" style="padding:4px;" class="ns1blankspaceSub">');
								
				var sCC = (ns1blankspace.objectContextData.cc).formatXHTML();
				var aCC = sCC.split('#')
				sCC = '';
			
				$.each(aCC, function(i)
				{
					var aEmail = this.split('|');
					var aEmailTmp = aEmail[1].split('&gt;')
					sCC += '<span title="' + aEmail[0] + '">' + aEmailTmp[0] + '</span>; '
				});				
								
				aHTML.push(sCC);

				aHTML.push('</td></tr>');
				aHTML.push('</table>');
			}
				
			// v2.0.6b Added bcc
			if (ns1blankspace.objectContextData.bcc != '' && ns1blankspace.objectContextData.bcc != undefined)
			{
				aHTML.push('<table id="ns1blankspaceMessagingEmailBCCContainer" class="ns1blankspaceHeader" style="border-style: solid; border-width: 1px 0px 1px 0px ;border-color: #f3f3f3;">');
				aHTML.push('<tr class="ns1blankspaceHeader">' +
								'<td id="ns1blankspaceMessagingEmailBCCCaption" style="text-align:center; width:20px;background-color:#CCCCCC; color:#FFFFFF; padding:4px;">Bcc</td>' +
								'<td id="ns1blankspaceMessagingEmailBCC" style="padding:4px;" class="ns1blankspaceSub">');
								
				var sBCC = (ns1blankspace.objectContextData.bcc).formatXHTML();
				var aBCC = sBCC.split('#')
				sBCC = '';
			
				$.each(aBCC, function(i)
				{
					var aEmail = this.split('|');
					var aEmailTmp = aEmail[1].split('&gt;')
					sBCC += '<span title="' + aEmail[0] + '">' + aEmailTmp[0] + '</span>; '
				});				
								
				aHTML.push(sBCC);

				aHTML.push('</td></tr>');
				aHTML.push('</table>');
			}
				
			aHTML.push('<table id="ns1blankspaceMessagingEmailAttachmentsContainer" class="ns1blankspaceHeader" style="margin-bottom:13px;border-style: solid;border-width:0px 0px 1px 0px;border-color: #f3f3f3;>');
			aHTML.push('<tr class="ns1blankspaceHeader">' +
									'<td style="width:20px; background-color:#ffffff;padding:4px; ">&nbsp;</td>' +
									'<td id="ns1blankspaceMessagingEmailAttachments" style="padding:4px; font-size: 0.875em;"></td></tr>');
			aHTML.push('</table>');
			
			aHTML.push(ns1blankspace.xhtml.loading);
			
			aHTML.push('<div class="ns1blankspaceMessageContainer" id="ns1blankspaceMessageFrameContainer"><iframe class="ns1blankspaceMessageContainer" name="ifMessage" ' +
								'id="ifMessage" frameborder="0" border="0" scrolling="auto" sandbox="allow-same-origin"' +
								' style="min-height:' + $('#ns1blankspaceControl').height() + 'px;"></iframe></div>');
							
			$('#ns1blankspaceMainSummary').html(aHTML.join(''));

			// ToDo - add "ACTION" to this condition once remainder is tested
			if (ns1blankspace.objectContextData.sourcetypetext == 'EMAIL' || ns1blankspace.objectContextData.sourcetypetext == 'ACTION')
			{	
				$('span.ns1blankspaceMessagingEmailOptions').button(
				{
					text: false,
					label: "Save, To Do",
					icons:
					{
						 primary: "ui-icon-triangle-1-s"
					}
				})
				.click(function()
				{
					if ($(ns1blankspace.xhtml.container).attr('data-initiator') == this.id)
					{
						$(ns1blankspace.xhtml.container).slideUp(500);
						$(ns1blankspace.xhtml.container).attr('data-initiator', '');
					}
					else
					{
						// v2.0.6c Can now re-save the email against a different contact
						ns1blankspace.messaging.imap.inbox.save.show(
						{
							inbox: false,
							leftOffset: -302,
							topOffset: 11,
							xhtmlElementID: this.id,
							messageID: (ns1blankspace.objectContextData.sourcetypetext == 'EMAIL') ? ns1blankspace.objectContextData.messageid : undefined,
							actionID: (ns1blankspace.objectContextData.sourcetypetext == 'ACTION') ? ns1blankspace.objectContextData.id : undefined
						});
					}	
				})
				.css('width', '15px')
				.css('height', '20px');
			}	
			
			// v2.0.6c Moved from markReadUnread()
			$('#ns1blankspaceControlDelete').html('Delete');

			$('#ns1blankspaceControlDelete').click(function(event)
			{
				ns1blankspace.messaging.imap.message.remove();
			});

			if (ns1blankspace.objectContextData.detailscached == 'Y')
			{
				ns1blankspace.messaging.imap.message.attachments();
				ns1blankspace.messaging.imap.message.contents.show();
			}
			else
			{						
				$.ajax(
				{
					type: 'POST',
					url: '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_GET_DETAILS',
					data: 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
					dataType: 'json',
					success: function(data) 
					{
						ns1blankspace.objectContextData.detailscached = 'Y';
						ns1blankspace.objectContextData.message = data.message;
						ns1blankspace.objectContextData.attachments = data.attachmentlist;		// v2.0.6 changed from attachmentslist
						ns1blankspace.objectContextData.hasattachments = (parseInt(data.attachmentcount) > 0) ? 'Y' : 'N';	//v2.0.6 was returning boolean
						ns1blankspace.objectContextData.sourcetypetext = 'EMAIL';

						ns1blankspace.messaging.imap.message.attachments();
						ns1blankspace.messaging.imap.message.contents.show();
						ns1blankspace.messaging.imap.inbox.markReadUnread({xhtmlElementID: 'ns1blankspaceMessagingInbox_from-' + ns1blankspace.objectContext});		
					}
				});
			}	
		}	
	},

	message: 	
	{
		contents: 	
		{
			clear: 		function()
			{
				$('#ns1blankspaceMainEdit').html('');
				$('#ns1blankspaceViewControlAction').button({disabled: true});
			},

			show:		function (bShow)
			{
				if (bShow === undefined)
				{
					bShow = false;

					if ($.browser.chrome || $.browser.safari || $.browser.webkit)
					{
						bShow = true
					}
				}

				if (!bShow)
				{
					setTimeout("ns1blankspace.messaging.imap.message.contents.show(true)", 200);
				}
				else
				{	
					var sHTML = ns1blankspace.objectContextData.message;
					sHTML = (sHTML).formatXHTML();

					while ($('#ifMessage').length == 0) {}

					$('.ns1blankspaceLoading').remove()
						
					$('#ifMessage').contents().find('html').html(sHTML);
					
					if ($.browser.msie)
					{
						setTimeout("ns1blankspace.messaging.imap.message.contents.setHeight()", 100);
					}
					else
					{	
						// v2.0.6b Adds 10% to height & width to show entire message
						//$('#ifMessage').minHeight($('#ns1blankspaceControl').height());
						$('#ifMessage').height($('#ifMessage', top.document).contents().find('html').height() * 1.1);
						$('#ifMessage').width($('#ifMessage', top.document).contents().find('html').width() * 1.1);

						$('#ns1blankspaceMessageFrameContainer').height($('#ifMessage', top.document).contents().find('html').height() * 1.1);
						$('#ns1blankspaceMessageFrameContainer').width($('#ifMessage', top.document).contents().find('html').width());
					}
				}	
			},

			setHeight:	function (iframe)
			{
				iframe = document.getElementById('ifMessage');
					
			    if (iframe)
			    {
			        iframe.height = iframe.contentDocument.documentElement.scrollHeight;
			    }
			}
		},				

		attachments: function ()
		{
			if (ns1blankspace.objectContextData.hasattachments == 'Y')
			{
				var aHTML = [];
				var aICSAttachmentID = [];

				var sAttachments = ns1blankspace.objectContextData.attachments;
				
				aHTML.push('<div>');

				if (sAttachments != 'undefined')
				{	
					if (sAttachments.indexOf('/download/') == -1)
					{					
						var aAttachments = sAttachments.split('#')
						sAttachments = '';
					
						$.each(aAttachments, function(iIndex) 
						{
							var aAttachment = this.split('|');
							// v2.0.6b changed to _CACHE_ search
							var sLink = '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_ATTACHMENT_DOWNLOAD';
							sLink += '&id=' + aAttachment[1];
							//sLink += '&attachmentindex=' + (iIndex);
							//sLink += '&account=' + ns1blankspace.util.fs(ns1blankspace.messaging.imap.account);
							//sLink += '&messageid=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.messageid);
							
							sAttachments += '<a href="' + sLink + '" data-index="' + aAttachment[2] + '" data-filename="' + aAttachment[0] + '" target="_blank">' + aAttachment[0] + '</a>; ';

							if ((aAttachment[0]).indexOf('.ics') != -1 || (aAttachment[0]).indexOf('.dat') != -1)
							{
								aICSAttachmentID.push(aAttachment[1])
							}
						});	
										
						aHTML.push(sAttachments);
					}
					else
					{								
						var sAttachments = ns1blankspace.objectContextData.attachments;
						var aAttachments = sAttachments.split('#')
						sAttachments = '';
					
						$.each(aAttachments, function(iIndex) 
						{
							var aAttachment = this.split('|');
							sAttachments +=	'<a href="' + aAttachment[1] + '" target="_blank">' + aAttachment[0] + '</a>, ';
						});	
										
						aHTML.push(sAttachments);
					}
				}

				aHTML.push('</div>');

				if (aICSAttachmentID.length != 0)
				{
					aHTML.push('<div id="ns1blankspaceMessagingIMAPMessageICS" style="text-align:center;"></div>');
				}
			
				$('#ns1blankspaceMessagingEmailAttachments').html(aHTML.join(''));

				if (aICSAttachmentID.length != 0)
				{
					ns1blankspace.util.messaging.icsToJSON(
					{
						attachment: aICSAttachmentID[0],
						xhtmlElementID: 'ns1blankspaceMessagingIMAPMessageICS'
					})
				}
			}
			else
			{
				$('#ns1blankspaceMessagingEmailAttachments').html('<span class="ns1blankspaceSub">No attachments</span>');
			}
		},
									
		edit: 		
		{
			show: 		function (oParam)
			{

				var iObject = ns1blankspace.object;
				var iObjectContext = ns1blankspace.objectContext;
				var bShowTo = true;
				var bShowPriority = false;
				var bShowAll = false;
				var sXHTMLElementID = 'ns1blankspaceMainEdit';
				var bDialog = false;
				var iContactBusiness;
				var bReplyAll = false;
				var bReply = false;
				var bForward = false;
				var bNewEmail = false;
				var sMessage = '';
				var sSubject = '';
				var iSource = 1;
				var iContactPersonTo;
				var sEmailTo;
				var sData = '';
				var sFrom = '';
				
				if (oParam != undefined)
				{
					if (oParam.object != undefined) {iObject = oParam.object}
					if (oParam.objectContext != undefined) {iObject = oParam.objectContext}
					if (oParam.showTo != undefined) {bShowTo = oParam.showTo}
					if (oParam.showPriority != undefined) {bShowPriority = oParam.showPriority}
					if (oParam.showAll != undefined) {bShowAll = oParam.showAll}
					if (oParam.dialog != undefined) {bDialog = oParam.dialog}
					if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					if (oParam.contactBusiness != undefined) {iContactBusiness = oParam.contactBusiness}
					if (oParam.replyAll != undefined) {bReplyAll = oParam.replyAll}
					if (oParam.reply != undefined) {bReply = oParam.reply}
					if (oParam.forward != undefined) {bForward = oParam.forward}
					if (oParam.newEmail != undefined) {bNewEmail = oParam.newEmail}
					if (oParam.message != undefined) {sMessage = oParam.message}
					if (oParam.subject != undefined) {sSubject = oParam.subject}
					if (oParam.contactPersonTo != undefined) {iContactPersonTo = oParam.contactPersonTo}
					if (oParam.source != undefined) {iSource = oParam.source}
					if (oParam.emailTo != undefined) {sEmailTo = oParam.emailTo}	
				}

				$('td.ns1blankspaceMessageSelect').not('td.ns1blankspaceHighlight').remove();

				ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});

				// v2.0.6 Handle where user wants to return to message they were editing
				if (oParam.continueEditing != true)
				{
					if (bNewEmail)
					{
						if (!bForward && !bReply && !bReplyAll)
						{
							ns1blankspace.objectContext = undefined;
							ns1blankspace.objectContextData = undefined;
						}
						// 2.0.6 Changed from MESSAGING_EMAIL_DRAFT as was causing saved action to not have an actiontype
						// 2.0.6 Only use CACHE_FORWARD for forwarded emails, not actions
						// v2.0.6a Use for ALL ACTION types and also when doing anything other than forwarding from a non-action
						if (ns1blankspace.objectContextData === undefined
							|| (ns1blankspace.objectContextData.sourcetypetext === 'ACTION') 
							|| (ns1blankspace.objectContextData.sourcetypetext != 'ACTION' && !bForward))
						{
							// v2.0.6 copy attachments when forwarding from action
							sData = '&send=N' +
									(bForward ? '&copyattachmentsfromobject=17&copyattachmentsfromobjectcontext=' + ns1blankspace.objectContextData.id : '');
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND'),
								data: sData,
								dataType: 'json',
								success: function(oResponse)
								{
									if (oResponse.status === 'OK')
									{
										ns1blankspace.messaging.action = oResponse.id;
									}
								}
							});
						}
						//	Forwarding from the cache - we need to use MESSAGING_EMAIL_CACHE_FORWARD so it picks up the attachments
						else
						{
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_CACHE_FORWARD') + '&id=' + ns1blankspace.objectContextData.id,
								dataType: 'json',
								success: function(oResponse)
								{
									if (oResponse.status === 'OK')
									{
										ns1blankspace.messaging.action = oResponse.action;
										ns1blankspace.objectContextData.attachmentcount = oResponse.attachmentcount;
									}
								}
							});
						}
					}

					$('#ns1blankspaceMainEdit').attr('data-objectcontext', ns1blankspace.messaging.action);
					
					// v2.0.6a If forwarding / replying to existing email, we need to set the current Fromname accordingly. Must be in the valid list of email accounts tho
					if (ns1blankspace.objectContextData && ns1blankspace.objectContextData.fromname != '' && ns1blankspace.objectContextData.fromname != undefined)
					{
						sFrom = $.map($.grep(ns1blankspace.messaging.imap.emailAccounts, function(x) {return x.id == ns1blankspace.messaging.imap.account}),
												function(y) {return y.email}).shift();

						// If not a valid email account for this user, set fromemail to blank
						if ($.grep(ns1blankspace.messaging.imap.emailAccounts, function(x) {return x.email === sFrom}).length == 0)
						{
							ns1blankspace.messaging.imap.data.fromEmail = '';
						}
						else
						{
							ns1blankspace.messaging.imap.data.fromEmail = sFrom;	
						}
					}
					else
					{
						ns1blankspace.messaging.imap.data.fromEmail = $.map($.grep(ns1blankspace.messaging.imap.emailAccounts, function(x) {return x.id == ns1blankspace.messaging.imap.account}),
												function(y) {return y.email}).shift();
					}
					if (ns1blankspace.messaging.imap.data.fromEmail === undefined) {ns1blankspace.messaging.imap.data.fromEmail = ''}

					var aHTML = [];
									
					aHTML.push('<table id="ns1blankspaceMessagingSendMessageContainer">' +
								'<tr class="ns1blankspace">' +
								'<td id="ns1blankspaceSendMessageColumn1" class="ns1blankspaceColumn1">' +
								ns1blankspace.xhtml.loading +
								'</td>' +	
								'</tr>' +
								'</table>');					
									
					$('#' + sXHTMLElementID).html(aHTML.join(''));
					
					$('#ns1blankspaceViewControlAction').unbind('click');
					
					$('#ns1blankspaceViewControlAction').button(
					{
						label: "Send"
					})
					.click(function() 
					{
						delete(oParam.draft);
						ns1blankspace.messaging.imap.message.edit.clickSend(oParam);
					});

					$('#ns1blankspaceViewControlAction').button({disabled: false});

					var aHTML = [];
					
					aHTML.push('<table>');
					
					if (bShowTo)
					{
						aHTML.push('<tr><td style="font-size:0.875em;">');
						
							// v2.0.6 added From address
							aHTML.push('<table class="ns1blankspace">');				
										
							aHTML.push('<tr>');
								aHTML.push('<td class="ns1blankspaceCaption" style="font-size:0.875em; width:58px; padding-top:0px;">From</td>');
								aHTML.push('<td class="ns1blankspaceHighlight" style="font-size:0.875em; cursor:pointer; font-weight: normal;" colspan="2" id="ns1blankspaceSenderEmail" data-accountid="' + ns1blankspace.messaging.imap.account + '">' +
											((ns1blankspace.messaging.imap.data.fromEmail != '' )
											 ? ns1blankspace.messaging.imap.data.fromEmail
											 : 'Choose an email account to send from') +
									'</td>');
							aHTML.push('</tr></table>');
							aHTML.push('</td></tr>');
							
							aHTML.push('<tr><td style="font-size:0.875em;">');	
								
								aHTML.push('<table class="ns1blankspace">');				
											
								aHTML.push('<tr><td id="ns1blankspaceRecipientTypeColumn1" style="width:32px;">');

								aHTML.push('<div id="ns1blankspaceRecipientType" style="font-size:0.8745em;">');											
								
								aHTML.push('<input type="radio" id="ns1blankspaceRecipientType-To" name="radioRecipientType" checked="checked" />' +
												'<label for="ns1blankspaceRecipientType-To" style="width: 100%;  margin-bottom:1px;">' +
												'To <span id="ns1blankspaceRecipientTypeCount-To" style="vertical-align: super; font-size: 0.6em; color:#ffffff;"></span></label>');

								aHTML.push('<input type="radio" id="ns1blankspaceRecipientType-Cc" name="radioRecipientType" />' +
												'<label for="ns1blankspaceRecipientType-Cc" style="width: 100%; margin-bottom:1px;">' +
												'Cc <span id="ns1blankspaceRecipientTypeCount-Cc" style="vertical-align: super; font-size: 0.6em; color:#ffffff;"></span></label>');

								aHTML.push('<input type="radio" id="ns1blankspaceRecipientType-Bcc" name="radioRecipientType" />' +
												'<label for="ns1blankspaceRecipientType-Bcc" style="width: 100%;  margin-bottom:1px;">' +
												'Bcc <span id="ns1blankspaceRecipientTypeCount-Bcc" style="vertical-align: super; font-size: 0.6em; color:#ffffff;"></span></label>');
								
								aHTML.push('</div>');

								aHTML.push('</td><td id="ns1blankspaceRecipientTypeColumn2">');

								aHTML.push('<div id="ns1blankspaceRecipientTypeContainer-To" class="ns1blankspaceRecipientTypeContainer">');

								aHTML.push('<table cellpadding=0 class="ns1blankspace">');				
										
								aHTML.push('<tr><td style="padding:0px;">' +
											'<input id="ns1blankspaceEditMessageToContact" class="ns1blankspaceSelectContactEmail ns1blankspaceWatermark"' +
												' data-setelementid="ns1blankspaceEditMessageTo" value="search for contact" style="width:250px; margin-bottom:1px; padding-top:3px; margin-top:0px;"');
											
								if (iContactBusiness != undefined)
								{
									aHTML.push(' data-contactbusiness="' + iContactBusiness + '"')
								}

								aHTML.push('>');

								//Send-to-group

								aHTML.push('</td></tr>');				

								aHTML.push('<tr><td style="padding:0px; padding-top:1px;">' +
											'<textarea id="ns1blankspaceEditMessageTo" style="height:65px; width:249px;" rows="3" cols="20" class="ns1blankspaceTextMulti"></textarea>' +
											' <span id="ns1blankspaceEditMessageToContact-group-To" class="ns1blankspaceEditMessageContactGroupSearch"></span>' +
											'</td></tr>');

								aHTML.push('</table></div>');

								aHTML.push('<div id="ns1blankspaceRecipientTypeContainer-Cc" style="display:none;" class="ns1blankspaceRecipientTypeContainer">');

								aHTML.push('<table cellpadding=0 class="ns1blankspace">');	
								
								aHTML.push('<tr><td style="padding:0px;">' +
												'<input id="ns1blankspaceEditMessageCcContact" class="ns1blankspaceSelectContactEmail ns1blankspaceWatermark ns1blankspaceText"' +
												' data-setelementid="ns1blankspaceEditMessageCc" value="search for contact" style="width:250px; margin-bottom:1px; padding-top:3px; margin-top:0px;"');
											
								if (iContactBusiness != undefined)
								{
									aHTML.push(' data-contactbusiness="' + iContactBusiness + '"')
								}

								aHTML.push('></td></tr>');				

								aHTML.push('<tr><td style="padding:0px; padding-top:1px;">' +
											'<textarea id="ns1blankspaceEditMessageCc" style="height:65px; width:249px;" rows="3" cols="20" class="ns1blankspaceTextMulti"></textarea>' +
											' <span id="ns1blankspaceEditMessageToContact-group-Cc" class="ns1blankspaceEditMessageContactGroupSearch"></span>' +
											'</td></tr>');

								aHTML.push('</table></div>');

								aHTML.push('<div id="ns1blankspaceRecipientTypeContainer-Bcc" style="display:none;" class="ns1blankspaceRecipientTypeContainer">');

								aHTML.push('<table cellpadding=0 class="ns1blankspace">');
							
								aHTML.push('<tr><td style="padding:0px;">' +
											'<input id="ns1blankspaceEditMessageBccContact" class="ns1blankspaceSelectContactEmail ns1blankspaceWatermark ns1blankspaceText"' +
												' data-setelementid="ns1blankspaceEditMessageBcc" value="search for contact"' +
												' style="width:250px; margin-bottom:1px; padding-top:3px; margin-top:0px;"');
											
								if (iContactBusiness != undefined)
								{
									aHTML.push(' data-contactbusiness="' + iContactBusiness + '"');
								}

								aHTML.push('></td></tr>');				

								aHTML.push('<tr><td style="padding:0px; padding-top:1px;">' +
											'<textarea id="ns1blankspaceEditMessageBcc" style="height:65px; width:249px;" rows="3" cols="20" class="ns1blankspaceTextMulti"></textarea>' +
												' <span id="ns1blankspaceEditMessageToContact-group-Bcc" class="ns1blankspaceEditMessageContactGroupSearch"></span>' +
											'</td></tr>');
							
								aHTML.push('</table>');				
								
							aHTML.push('</td>');	

							aHTML.push('<td style="width:310px;">');	

								aHTML.push('<table>');				
											
								aHTML.push('<td style="width:30px; padding-top: 0px;>');
							
								aHTML.push('<div id="ns1blankspaceEditMessageAttachContainer" style="font-size:0.875em;">' +
												'<input type="checkbox" id="ns1blankspaceEditMessageAttach" class="ns1blankspaceAction"/>' +
												'<label style="font-size:0.875em;" for="ns1blankspaceEditMessageAttach">&nbsp;</label>' +
												'</div>');
							
								aHTML.push('</td>');				

								aHTML.push('<td style="height:90px" id="ns1blankspaceActionsEditEmailAttachments" class="ns1blankspaceBorder">' +
											'</td></tr>');
							
								aHTML.push('</table>');				
																		
							aHTML.push('</td></tr>');				
								
							aHTML.push('</table>');					
								
						aHTML.push('</td></tr>');				
					}
					
					aHTML.push('<tr><td>');
					
						aHTML.push('<table>');				
											
							aHTML.push('<tr><td class="ns1blankspace" style="padding-left:0px; padding-right:0px;">' +
										'<input id="ns1blankspaceMessagingEditMessageSubject" class="ns1blankspaceText ns1blankspaceWatermark" style="font-size:0.75em;"' +
											' value="subject">' +
										'</td>');	
							
							if (bShowPriority)
							{
								aHTML.push('<td style="width:150px; text-align:right;" class="ns1blankspaceRight">' +
												'&nbsp; <input type="checkbox" id="ns1blankspaceMessagingEditdMessageHighPriority"/>&nbsp;High Priority?<td>');
							}
						
							aHTML.push('</tr>');				
								
						aHTML.push('</table>');				
					
					aHTML.push('</td></tr>');

					ns1blankspace.counter.editor++

					aHTML.push('<tr><td class="ns1blankspace">' +
										'<textarea rows="10" cols="35" id="ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor + '" class="ns1blankspaceTextMultiLarge"></textarea>' +
										'</td></tr>');
					
					aHTML.push('</table>');						
					
					$('#ns1blankspaceSendMessageColumn1').html(aHTML.join(''));

					ns1blankspace.messaging.imap.templates();

					$('.ns1blankspaceEditMessageContactGroupSearch').button(
					{
						text: false,
						label: "Select contact group",
						icons:
						{
							 primary: "ui-icon-contact"
						}
					})
					.click(function()
					{
						ns1blankspace.messaging.imap.message.edit.groupSearch.show({xhtmlElementID: this.id});
					})
					.css('width', '15px')
					.css('height', '20px');


					if (sEmailTo !== undefined)
					{	
						$('#ns1blankspaceEditMessageTo').val(sEmailTo);
					}
					
					if (iContactPersonTo !== undefined)
					{	
						$('#ns1blankspaceEditMessageTo').attr('data-id', iContactPersonTo)
					}
						
					$('#ns1blankspaceRecipientType').buttonset().css('font-size', '0.75em');

					$('#ns1blankspaceRecipientType :radio').click(function()
					{
						$('div.ns1blankspaceRecipientTypeContainer').hide();

						var aID = (this.id).split('-');
						$('#ns1blankspaceRecipientTypeContainer-' + aID[1]).show();
					});
				
					$('#ns1blankspaceEditMessageAttach').button(
					{
						text: false,
						icons:	{
									primary: "ui-icon-paperclip"
								}
					})
					.click(function() 
					{
						ns1blankspace.messaging.imap.message.edit.attach.show(oParam);
					})
					.css('width', '20px')
					.css('height', '23px')
					.css('font-size', '0.75em');
						
					// v2.0.6 Bind function used to choose From email address
					$('#ns1blankspaceSenderEmail')
					.click(function()
					{
						if ($(ns1blankspace.xhtml.container).is(':visible')) 
						{
							$(ns1blankspace.xhtml.container).hide();
							$(ns1blankspace.xhtml.container).html(''); 

						}
						else 
						{
							var aHTML = [];

							$.each(ns1blankspace.messaging.imap.emailAccounts, function() 
							{
								aHTML.push('<tr id="ns1blankspaceSendEmailRow_' + this.id + '">');
								aHTML.push('<td id="ns1blankspaceSendEmailAddress_' + this.id + '" class="ns1blankspaceSearch">' + this.email + '<td>');
								aHTML.push('</tr>');
							});

							aHTML.unshift('<table class="ns1blankspaceSearchMedium">');
							aHTML.push('</table>');

							ns1blankspace.container.position({xhtmlElementID: 'ns1blankspaceSenderEmail', topOffset: 10, setWidth: true});
							$(ns1blankspace.xhtml.container).show();
							$(ns1blankspace.xhtml.container).html(aHTML.join(''));

							$('td.ns1blankspaceSearch').click(function() 
							{
								var sEmailId = this.id.split('_').pop();

								$(ns1blankspace.xhtml.container).hide();
								$(ns1blankspace.xhtml.container).html('');
								if (sEmailId != undefined) 
								{
									ns1blankspace.messaging.imap.data.fromEmail = $(this).html();
									$('#ns1blankspaceSenderEmail')
										.html($(this).html())
										.attr('data-accountid', sEmailId);
								}
							});	
						}
					});

					if (ns1blankspace.objectContextData != undefined && iSource == 1)
					{
						var sTo = '';
						var sCC;
					
						var aHTML = [];

						aHTML.push('<br />');
								
						if (ns1blankspace.objectContextData != undefined)
						{
							ns1blankspace.messaging.imap.message.edit.contents(oParam);

							var sSubject = (ns1blankspace.objectContextData.subject).formatXHTML();		

							if (bForward)
							{
								if (sSubject.toLowerCase().substr(0,3) != 'fw:') {sSubject = 'Fw: ' + sSubject}
								$('#ns1blankspaceMessagingEditMessageSubject').val(sSubject)
							}
							else if (oParam.draft != true)
							{
								if (sSubject.toLowerCase().substr(0,3) != 're:') {sSubject = 'Re: ' + sSubject}
								$('#ns1blankspaceMessagingEditMessageSubject').val(sSubject)
							}	
							else if (oParam.draft === true)			// v2.0.6 Handle draft email
							{
								$('#ns1blankspaceMessagingEditMessageSubject').val(sSubject);
							}
							
							$('#ns1blankspaceMessagingEditMessageSubject').removeClass('ns1blankspaceWatermark');
							
							if (bForward)
							{
								ns1blankspace.objectContextData.to = '';
								$('#ns1blankspaceEditMessageTo').val('');
							}
							else if (oParam.draft != true)	
							{
								var sSourceFrom = (ns1blankspace.objectContextData && ns1blankspace.objectContextData.from != '') ? ns1blankspace.objectContextData.from : '';
					
								if (ns1blankspace.objectContextData.to != '' && bReplyAll)
								{		
									var sToEmail;	
									var aTo = ns1blankspace.objectContextData.to.split('#');
									sTo = '';
								
									$.each(aTo, function(i)
									{
										sToEmail = (this).split('|').pop();
										
										// Make sure we don't reply to ourselves
										if (sToEmail != ns1blankspace.messaging.imap.data.fromEmail)
										{	
											sTo += sToEmail + '; ';
										}
										// If email was to self, then reply to the sender (sSourceFrom) in TO
										else if (sToEmail == ns1blankspace.messaging.imap.data.fromEmail)
										{
											sTo += sSourceFrom += '; ';
										}
									});	
								}

								if (sTo == '') {sTo = sSourceFrom + '; '}		// we need to send it back to the sender just in case no-one to send to
					
								// v2.0.6 Was not including cc'd recipients when replyAll
								if (ns1blankspace.objectContextData.cc != '' && bReplyAll)
								{		
									var sCCEmail;	
									var aCC = ns1blankspace.objectContextData.cc.split('#');
									sCC = '';
								
									$.each(aCC, function(i)
									{
										sCCEmail = (this).split('|').pop();
										
										// Make sure we don't reply to ourselves
										if (sCCEmail != ns1blankspace.messaging.imap.data.fromEmail)
										{	
											sCC += sCCEmail + '; ';
										}
									});	
								}

								// v2.0.6e sSourceFrom had '; ' after the email address
								if ($.inArray(sSourceFrom.split('; ').shift(), (sTo + sCC).split('; ')) == -1 && sSourceFrom != ns1blankspace.messaging.imap.data.fromEmail) 
								{	// Send it back to sender in CC if not already done
									sCC += sSourceFrom + '; ';
								}	
					
							}	
							else if (oParam.draft === true)			// v2.0.6 Handle draft email
							{
								var aToDetails;
								var sToEmail;	
								var sBCC = '';
								sTo = '';
							
								if (ns1blankspace.objectContextData.to != '')
								{
									$.each(ns1blankspace.objectContextData.to.split('#'), function(i)
									{
										aToDetails = (this).split('|');
										sToEmail = aToDetails[1];
										sTo += sToEmail + '; ';
									});	
								}

								if (ns1blankspace.objectContextData.cc != '')
								{
									sCC = '';
									$.each(ns1blankspace.objectContextData.cc.split('#'), function(i)
									{
										aToDetails = (this).split('|');
										sToEmail = aToDetails[1];
										sCC += sToEmail + '; ';
									});	
								}

								if (ns1blankspace.objectContextData.bcc != '')
								{
									$.each(ns1blankspace.objectContextData.bcc.split('#'), function(i)
									{
										aToDetails = (this).split('|');
										sToEmail = aToDetails[1];
										sBCC += sToEmail + '; ';
									});	
								}

								$('#ns1blankspaceEditMessageBcc').val(sBCC)
							}		

							$('#ns1blankspaceEditMessageTo').val(sTo)
							if (sCC)
							{
								$('#ns1blankspaceEditMessageCc').val(sCC)
							}
				
							if (ns1blankspace.objectContextData.attachments != '' && bForward && ns1blankspace.messaging.action == -1)
							{
								if (ns1blankspace.objectContextData.sourcetypetext == "EMAIL")
								{
									$('#ns1blankspaceActionsEditEmailAttachments').html(ns1blankspace.xhtml.loadingSmall);

									var oData = {id: ns1blankspace.objectContextData.id};
									
									$.ajax(
									{
										type: 'POST',
										url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_CACHE_FORWARD'),
										data: oData,
										dataType: 'json',
										success: function(data) 
										{
											ns1blankspace.messaging.action = data.action;
											ns1blankspace.messaging.imap.message.edit.attach.process();
										}
									});
								}
								
								// We don't want to copy the action for a draft as it's already been created with attacments
								if (ns1blankspace.objectContextData.sourcetypetext == "ACTION" && oParam.draft != true)
								{
									var sParam = ns1blankspace.util.endpointURI('MESSAGING_EMAIL_DRAFT_MANAGE') + '&new=1&rf=TEXT';
									var sData = 'copyaction=' + ns1blankspace.objectContextData.id;
									
									$.ajax(
									{
										type: 'POST',
										url: sParam,
										data: sData,
										dataType: 'text',
										success: function(data) 
										{
											var aReturn = data.split('|');
											ns1blankspace.messaging.action = aReturn[2];
											ns1blankspace.messaging.imap.edit.attachments();
										}
									});
								}
								
							}	
							else
							{
								ns1blankspace.messaging.imap.message.edit.attach.process({forward: bForward});
							}			
						}
						
						if (iSource == 2)  //???
						{
							var sFooter = '<br /><br />';
							
							$.each(ns1blankspace.messaging.imap.emailAccounts, function() 
							{ 
								if (this.id == ns1blankspace.messaging.imap.account)
								{
									sFooter += this.footer + '<br />';
								}
							});
							
							$('#ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor).val(sFooter + sMessage)
						}
						
						if (iSource == 3)  //????
						{
							$('#ns1blankspaceMessagingEditMessageSubject').val(sSubject)
							$('#ns1blankspaceMessagingEditMessageSubject').removeClass('ns1blankspaceWatermark');
							$('#ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor).val(sMessage)
						}
					}
					else
					{
						var sFooter = '<br /><br />';
							
						$.each(ns1blankspace.messaging.imap.emailAccounts, function() 
						{ 
							if (this.id == (ns1blankspace.messaging.imap.account != undefined?ns1blankspace.messaging.imap.account:ns1blankspace.messaging.imap.data.defaultAccount))
							{
								sFooter += this.footer;
							}
						});
						
						$('#ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor).val(sFooter)

						if (ns1blankspace.option.richTextEditing)
						{
							//tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor);
							tinyMCE.EditorManager.execCommand('mceAddEditor', false, 'ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor);
						}
					}
	
					// v2.0.6c if replying, we need to search for recipients to see if they're in the system and add their personids
					if (bReply || bReplyAll)
					{
						ns1blankspace.messaging.imap.message.edit.recipientSearch();
					}

					if (ns1blankspace.timer.messagingSave != 0) {clearInterval(ns1blankspace.timer.messagingSave)};
				    ns1blankspace.timer.messagingSave = setInterval("ns1blankspace.messaging.imap.message.edit.clickSend({draft: true})", ns1blankspace.option.messagingSaveDraft);
				}

				delete(oParam.continueEditing);
			},

			groupSearch:
			{
				show: function(oParam, oResponse)
				{
					var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
					var sType = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 2}).value;

					if ($(ns1blankspace.xhtml.container).attr('data-initiator') == sXHTMLElementID)
					{
						$(ns1blankspace.xhtml.container).slideUp(500);
						$(ns1blankspace.xhtml.container).attr('data-initiator', '');
					}
					else
					{
						if (oResponse == undefined)
						{
							var oSearch = new AdvancedSearch();
							oSearch.method = 'CONTACT_PERSON_GROUP_SEARCH';
							oSearch.addField('group, grouptext, count(id) grouptextcount');
							oSearch.rows = 1000;
							oSearch.sort('grouptext', 'asc');
							oSearch.getResults(function(data) {ns1blankspace.messaging.imap.message.edit.groupSearch.show(oParam, data)});
						}
						else
						{
							$(ns1blankspace.xhtml.container).attr('data-initiator', sXHTMLElementID)
							
							ns1blankspace.container.position(
							{
								xhtmlElementID: sXHTMLElementID,
								topOffset: -21,
								leftOffset: 21
							});

							var aHTML = [];
							var aGroups = $.grep(oResponse.data.rows, function (row)
							{
								return (numeral(row.grouptextcount).value() <= 100 && row.grouptext != '')
							});

							var aGroupsLarge = $.grep(oResponse.data.rows, function (row)
							{
								return (numeral(row.grouptextcount).value() > 100 && row.grouptext != '')
							});
			
							if (aGroups.length == 0)
							{	
								aHTML.push('<table class="ns1blankspaceSearchMedium">' + 
												'<tr><td class="ns1blankspaceNothing">No groups.</td></tr>' + 
												'</table>');

								$(ns1blankspace.xhtml.container).html(aHTML.join(''));
								$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);

								$(ns1blankspace.xhtml.container).html(aHTML.join(''));
								$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
							}
							else
							{
								aHTML.push('<table class="ns1blankspaceSearchMedium" style="font-size:0.875em;">');
								
								$.each(aGroups, function()
								{	
									aHTML.push('<tr class="ns1blankspaceRow">' +
														'<td id="ns1blankspaceGroupsAdd_title-' + this.group + '-' + sType + '" class="ns1blankspaceRowSelect ns1blankspaceImapGroupsAddRowSelect">' +
														this.grouptext +
														' <span class="ns1blankspaceSub" style="color:#c0c0c0;">(' + this.grouptextcount + ')</span></td></tr>');
								});
								
								aHTML.push('</table>');

								if (aGroupsLarge.length > 0)
								{
									aHTML.push('<table class="ns1blankspaceSearchMedium" style="font-size:0.875em;">' +
													'<tr><td class="ns1blankspaceSub">You have ' + ns1blankspace.util.toWords({number: aGroupsLarge.length}) +
													' group(s) that have over one hundred contacts in them.  Due to restraints on email systems (to deal with SPAM)' +
													' you need to use the <a href="https://app-next.lab.ibcom.biz/#/news" target="_blank">news</a>' +
													' system to send the emails.</td></tr></table>');
								}

								$(ns1blankspace.xhtml.container).html(aHTML.join(''));
								$(ns1blankspace.xhtml.container).show(ns1blankspace.option.showSpeedOptions);
								
								$('td.ns1blankspaceImapGroupsAddRowSelect').click(function(event)
								{
									ns1blankspace.messaging.imap.message.edit.groupSearch.select({xhtmlElementID: event.target.id});
								});
							}
						}
					}
				},

				select: function(oParam, oResponse)
				{
					var sID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
					var sType = 'To';

					if ($('#ns1blankspaceEditMessageCc:visible').length != 0) {sType = 'Cc'}
					if ($('#ns1blankspaceEditMessageBcc:visible').length != 0) {sType = 'Bcc'}

					if (oResponse == undefined)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = 'CONTACT_PERSON_GROUP_SEARCH';
						oSearch.addField('contactperson,contactpersontext,group,grouptext,persongroup.contactperson.email');
						oSearch.addFilter('group', 'EQUAL_TO', sID);

						if (ns1blankspace.messaging.imap.data.fromEmail != '')
						{
							oSearch.addFilter('persongroup.contactperson.email', 'NOT_EQUAL_TO', ns1blankspace.messaging.imap.data.fromEmail);
						}
						
						oSearch.rows = 999;
						oSearch.sort('grouptext', 'asc');
						oSearch.getResults(function(data)
						{
							ns1blankspace.messaging.imap.message.edit.groupSearch.select(oParam, data)
						});
					}
					else
					{
						var aGroupContacts = oResponse.data.rows;
						var aContactEmails = $.grep(aGroupContacts, function (row) {return row['persongroup.contactperson.email'] != ''});
						aContactEmails = $.map(aContactEmails, function (row) {return row['persongroup.contactperson.email']});
						var iContactsNoEmail = (aGroupContacts.length - aContactEmails.length);

						if (iContactsNoEmail == 1)
						{
							ns1blankspace.status.error('One contact doesn\'t have an email')
						}
						else if (iContactsNoEmail != 0)
						{
							ns1blankspace.status.error(_.upperFirst(ns1blankspace.util.toWords({number: aGroupContacts.length - aContactEmails.length})) +
								' contacts don\'t have emails')
						}
						
						if (aContactEmails.length > 0)
						{
							var oMessageEmails = $('#ns1blankspaceEditMessage' + sType);
							var sEmails = oMessageEmails.val();
							var sValues = oMessageEmails.attr('data-values');

							var sGroupEmails = aContactEmails.join(';');
							if (sEmails == '')
							{
								oMessageEmails.val(sGroupEmails);
								oMessageEmails.attr('data-values', sGroupEmails);
							}
							else
							{
								oMessageEmails.val(sEmails + '; ' + sGroupEmails);
								oMessageEmails.attr('data-values', sEmails + ';' + sGroupEmails);
							}	
						}
					}
					
				}
			},

			recipientSearch: function()
			{
				// Searches for the recipients and adds contactperson ids to the email addresses
				var aRecipientsTo = $('#ns1blankspaceEditMessageTo').val().replace(/ /g, '').split(';');
				var aRecipientsCc = $('#ns1blankspaceEditMessageCc').val().replace(/ /g, '').split(';');
				var aRecipientsBcc = $('#ns1blankspaceEditMessageBcc').val().replace(/ /g, '').split(';');

				var aSearchIDs = aRecipientsTo.concat(aRecipientsCc, aRecipientsBcc);
				aSearchIDs = $.grep(aSearchIDs, function(x) {return x != ''});
				var aContacts = [];

				if (aSearchIDs.length > 0)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'CONTACT_PERSON_SEARCH';
					oSearch.addField('email,contactbusinesstext,contactbusiness');
					oSearch.addFilter('email', 'IN_LIST', aSearchIDs.join(','));
					oSearch.sort('email', 'asc');
					oSearch.sort('id', 'asc');
					oSearch.rows = 500;
					oSearch.getResults(function(oResponse)
					{
						if (oResponse.status === 'OK')
						{
							// Get unique list of contactpersonids and emails first
							var sPreviousContact = '';
							$.each(oResponse.data.rows, function()
							{
								if (sPreviousContact != this.email);
								{
									aContacts.push(this);
								}

								sPreviousContact = this.email;
							});

							var aDataID = [];
							var aDataValues = [];
							if (aContacts.length > 0)
							{
								$.each(aRecipientsTo, function()
								{
									var sEmail = this.toString();
									var oThisContact = $.grep(aContacts, function(x) {return x.email == sEmail}).shift();
									if (oThisContact != undefined)
									{
										aDataID.push(oThisContact.id);
										aDataValues.push(oThisContact.email);
									}
								});
								$('#ns1blankspaceEditMessageTo').attr('data-id', aDataID.join('-'));
								$('#ns1blankspaceEditMessageTo').attr('data-values', aDataValues.join(';'));

								aDataID = [];
								aDataValues = [];
								$.each(aRecipientsCc, function()
								{
									var sEmail = this.toString();
									var oThisContact = $.grep(aContacts, function(x) {return x.email == sEmail}).shift();
									if (oThisContact != undefined)
									{
										aDataID.push(oThisContact.id);
										aDataValues.push(oThisContact.email);
									}
								});
								$('#ns1blankspaceEditMessageCc').attr('data-id', aDataID.join('-'));
								$('#ns1blankspaceEditMessageCc').attr('data-values', aDataValues.join(';'));

								aDataID = [];
								aDataValues = [];
								$.each(aRecipientsBcc, function()
								{
									var sEmail = this.toString();
									var oThisContact = $.grep(aContacts, function(x) {return x.email == sEmail}).shift();
									if (oThisContact != undefined)
									{
										aDataID.push(oThisContact.id);
										aDataValues.push(oThisContact.email);
									}
								});
								$('#ns1blankspaceEditMessageBcc').attr('data-id', aDataID.join('-'));
								$('#ns1blankspaceEditMessageBcc').attr('data-values', aDataValues.join(';'));
							}
						}
						else
						{
							ns1blankspace.status.error('Error finding recipients: ' + oResponse.error.errornotes);
						}
					});
				}
			},

			clickSend: function(oParam)
			{
				if (oParam === undefined) {oParam = {}}

				if (oParam.draft != true && ns1blankspace.messaging.imap.data.fromEmail == '')
				{
					ns1blankspace.status.error('Please choose a From email');
				}
				else
				{
					oParam.subject = $('#ns1blankspaceMessagingEditMessageSubject').not('.ns1blankspaceWatermark').val();
					oParam.message = tinyMCE.get('ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor).getContent();
					oParam.contactPersonTo = $('#ns1blankspaceEditMessageTo').attr('data-id');
					oParam.to = $('#ns1blankspaceEditMessageTo').val();
					oParam.cc = $('#ns1blankspaceEditMessageCc').val();
					oParam.bcc = $('#ns1blankspaceEditMessageBcc').val();
					
					ns1blankspace.messaging.imap.message.send(oParam);
				}
			},

			contents: 	function (oParam)
			{
				if (ns1blankspace.objectContextData.detailscached == 'N')
				{
					$('#ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor).val('loading...');

					$.ajax(
					{
						type: 'POST',
						url: '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_GET_DETAILS',
						data: 'id=' + ns1blankspace.util.fs(ns1blankspace.objectContext),
						dataType: 'json',
						success: function(data) 
						{
							ns1blankspace.objectContextData.detailscached = 'Y';
							ns1blankspace.objectContextData.message = data.message;
							ns1blankspace.objectContextData.attachments = data.attachmentlist;	// v2.0.6 changed from attachmentslist
							ns1blankspace.objectContextData.hasattachments = (parseInt(data.attachmentcount) > 0) ? 'Y' : 'N';		//v2.0.6 was returning boolean
							ns1blankspace.objectContextData.sourcetypetext = 'EMAIL';

							ns1blankspace.messaging.imap.message.edit.contents(oParam);
						}
					});
				}	
				else
				{
					var aHTML = [];

					// v2.0.6 Don't add original message details if we've retrieved a draft
					if (oParam.draft != true)
					{
						$.each(ns1blankspace.messaging.imap.emailAccounts, function() 
						{ 
							if (this.id == ns1blankspace.messaging.imap.account)
							{
								aHTML.push('<br />' + this.footer + '<br />');
							}
						});

						aHTML.push('<br />---- Original Message ----<br />');
						aHTML.push('<table style="background-color:#f5f5f5;width:100%;color:black;">');
						aHTML.push('<tr><td><strong>From:</strong> ' + ns1blankspace.objectContextData.from + '</td></tr>');
						
						aHTML.push('<tr><td><strong>To:</strong> ');	
						
						var sOrgTo = ns1blankspace.objectContextData.to;
						var aOrgTo = sOrgTo.split('|')
						
						sOrgTo = '';
				
						$.each(aOrgTo, function(i)
						{
							if (i % 2 !== 0) {sOrgTo += this + '; '}		
						});				
						
						aHTML.push(sOrgTo + '</td></tr>');
						
						var sOrgCc = ns1blankspace.objectContextData.cc;
						
						if (sOrgCc != '')
						{
							aHTML.push('<tr><td><strong>CC:</strong> ');	
							var aOrgCc = sOrgCc.split('|')
							sOrgCc = '';
					
							$.each(aOrgCc, function(i)
							{
								if (i % 2 !== 0) {sOrgCc += this + '; '}	
							});			
							
							aHTML.push(sOrgCc + '</td></tr>');
						}
						
						// 2.0.6e SUP022564 changed from date.parse to parseExact
						var oDate = new Date.parseExact(ns1blankspace.objectContextData.date, "d MMM yyyy H:mm:ss");
						sDate = oDate.toString("ddd, dd MMM yyyy h:mm tt") 
				
						aHTML.push('<tr><td><strong>Sent:</strong> ' + sDate + '</td></tr>');	
						aHTML.push('<tr><td><strong>Subject:</strong> ' + ns1blankspace.objectContextData.subject + '</td></tr>');	
						aHTML.push('</table>');
					}

					$('#ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor).val(aHTML.join('') + (ns1blankspace.objectContextData.message).formatXHTML());

					if (ns1blankspace.option.richTextEditing)
					{
						if (tinyMCE && tinyMCE.majorVersion === '4')
						{
							tinyMCE.EditorManager.execCommand('mceAddEditor', false, 'ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor);	
						}
						else
						{
							tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor);
						}
						
					}
				}	
			},		

			attach: 	
			{
				show:		function (oParam, oResponse)
				{
					sXHTMLElementID = "ns1blankspaceEditMessageAttach";
					
					if (!$('#ns1blankspaceEditMessageAttach').attr('checked'))
					{
						$(ns1blankspace.xhtml.container).hide()
					}
					else
					{	
						// v2.06 Only need to call this if we don't already have an action id (changed from MESSAGING_EMAIL_DRAFT)
						if (ns1blankspace.messaging.action == -1 && oResponse == undefined)
						{					
							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND') + '&send=N',
								dataType: 'json',
								success: function(oResponse) 
								{
									if (oResponse.status === 'OK')
									{
										ns1blankspace.messaging.action = oResponse.id;
										ns1blankspace.messaging.imap.message.edit.attach.show(oParam, oResponse)
									}
									else
									{
										ns1blankspace.status.error('An error has occurred');
									}
								}
							});
						}
						else
						{															
							var aHTML = [];
							
							ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: 28, topOffset: -36})
						
						
							aHTML.push('<table style="width:287px; padding-top:0px;" class="ns1blankspaceViewControlContainer">');

							aHTML.push('<tr><td>');

							aHTML.push('<div id="ns1blankspaceAttachMethod" style="font-size:0.875em;">');

							aHTML.push('<input type="radio" id="ns1blankspaceAttachMethod-upload" name="radioAttachMethod" checked="checked" />' +
											'<label for="ns1blankspaceAttachMethod-upload" style="width:100px; margin-right:2px; font-size:0.75em; width:75px;">' +
											'Upload</label>');

							aHTML.push('<input type="radio" id="ns1blankspaceAttachMethod-existing" name="radioAttachMethod" />' +
											'<label for="ns1blankspaceAttachMethod-existing" style="width:100px; margin-right:2px; font-size:0.75em; width:75px;">' +
											'Existing</label>');

							aHTML.push('</div>');

							aHTML.push('</td></tr>');

							aHTML.push('<tr><td id="ns1blankspaceMessageEditAttachContainer" class="ns1blankspace" style="padding:3px; background-color:#ffffff;">' +
											'<div id="ns1blankspaceMessageEditAttach-upload" class="ns1blankspaceMessageEditAttach">' + 
												ns1blankspace.attachments.upload.show(
												{
													object: 17,
													objectContext: ns1blankspace.messaging.action,
													label: '',
													showUpload: true,
													maxFiles: 1
												}));
											
							aHTML.push('</div>');

							aHTML.push('<div id="ns1blankspaceMessageEditAttach-existing" class="ns1blankspaceMessageEditAttach" style="display:none;">');

							aHTML.push('<table><tr class="ns1blankspace">' +
											'<td class="ns1blankspaceRadio">' +
											'<select id="ns1blankspaceMessageEditAttachObjectValue" style="width:75px; height:24px;">');

							$.each(ns1blankspace.messaging.imap.data.objects, function(i, v)
							{
								aHTML.push('<option value="' + v.id + '" data-method="' + v.method + '"' +
											(v.columns?' data-columns="' + v.columns + '"':'') +
											(v.methodFilter?' data-methodfilter="' + v.methodFilter + '"':'') + '>' +
											v.caption + '</option>');
							});
										
							aHTML.push('</select>' +
											' <input id="ns1blankspaceMessageEditAttachObjectContext" style="padding:3px;">' +
											'</td></tr>');

							aHTML.push('<tr><td style="padding-left:2px; padding-top:4px;" id="ns1blankspaceMessageEditAttachObjectContextSearch"></td></tr>');

							aHTML.push('</table></div>' + 
											'</td></tr>');

							aHTML.push('</table>');			

							$(ns1blankspace.xhtml.container).html(aHTML.join(''));
							
							$('#ns1blankspaceUpload').button(
							{
								label: "Attach"
							})
							.click(function()
							{
								ns1blankspace.attachments.upload.submit({functionPostUpdate: ns1blankspace.messaging.imap.message.edit.attach.process});
							
								 //ns1blankspace.attachments.upload.process({functionPostUpdate: ns1blankspace.messaging.imap.message.edit.attach.process});
							});

							$('#ns1blankspaceAttachMethod').buttonset();

							$('#ns1blankspaceAttachMethod :radio').click(function()
							{
								$('div.ns1blankspaceMessageEditAttach').hide();

								var aID = (this.id).split('-');
								
								$('#ns1blankspaceMessageEditAttach-' + aID[1]).show();
							});

							$('#ns1blankspaceMessageEditAttachObjectContext').keyup(function ()
							{
								if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
									ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.messaging.imap.message.edit.attach.object.search()', ns1blankspace.option.typingWait);
							});

							$(document).on('change', 'input.ns1blankspaceUpload', function()
							{
								if ($(this).val() != '')
								{
									var sID = this.id;
									var sIndex = sID.replace('oFile', '');
									var iLength = $('input.ns1blankspaceUpload').length;

									if (parseInt(sIndex) == (iLength - 1))
									{
										var iFileIndex = parseInt(sIndex) + 1;

										$('#maxfiles').val(iFileIndex);

										$('#ns1blankspaceUploadFile' + sIndex).after('<div id="ns1blankspaceUploadFile' + iFileIndex +
															'" class="ns1blankspaceUpload"><input class="ns1blankspaceUpload" type="file" name="oFile' + iFileIndex +
															'" id="oFile' + iFileIndex + '"></div>');

										var sFileType = $('#filetype' + sIndex).val();
										$('#filetype' + sIndex).after('<input type="hidden" name="filetype' + iFileIndex + '" id="filetype' + iFileIndex + '" value="' + sFileType + '">');
									}	
								}
							});	
						}					
					}	
				},

				object: 	
				{
					search: 	function (oParam, oResponse)
					{
						var iObject = $('#ns1blankspaceMessageEditAttachObjectValue :selected').val();
						var sColumns = $('#ns1blankspaceMessageEditAttachObjectValue :selected').attr('data-columns');
						if (sColumns === undefined) {sColumns = 'reference'}

						if (oResponse === undefined)
						{	
							oParam = ns1blankspace.util.setParam(oParam, 'object', iObject);

							$('#ns1blankspaceMessageEditAttachObjectContextSearch').html(ns1blankspace.xhtml.loadingSmall);

							var sMethod = $('#ns1blankspaceMessageEditAttachObjectValue :selected').attr('data-method');
							var sSearchText = $('#ns1blankspaceMessageEditAttachObjectContext').val();
							var aSearchFilters = $('#ns1blankspaceMessageEditAttachObjectValue :selected').attr('data-methodFilter');
							aSearchFilters = (aSearchFilters) ? aSearchFilters.split('|') : undefined;

							var oSearch = new AdvancedSearch();
							oSearch.method = sMethod;
							oSearch.addField(sColumns);
							
							if (iObject == 32)
							{	
								var aSearchText = sSearchText.split(' ');

								oSearch.addBracket("(")
								if (aSearchText.length > 1)
								{
									oSearch.addFilter('firstname', 'TEXT_STARTS_WITH', aSearchText[0]);
									oSearch.addFilter('surname', 'TEXT_STARTS_WITH', aSearchText[1]);
								}
								else
								{
									oSearch.addFilter('firstname', 'TEXT_IS_LIKE', sSearchText);
									oSearch.addOperator('or');
									oSearch.addFilter('surname', 'TEXT_IS_LIKE', sSearchText);
								}	
								oSearch.addBracket(")")
							}
							else
							{
								if (aSearchFilters && aSearchFilters.length > 0)
								{
									oSearch.addBracket("(")
									$.each(aSearchFilters, function(i, t)
									{
										var aFilterOptions = t.split('-');
										oSearch.addFilter(aFilterOptions[0], 
												((aFilterOptions.length > 1) ? aFilterOptions[1] : undefined), 
												((aFilterOptions.length === 2) ? sSearchText : undefined));
										if (aSearchFilters.length > (i + 1))
										{
											oSearch.addOperator('or')
										}
									});
									oSearch.addBracket(")")
								}
								else
								{
									oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
								}
							}	
							
							oSearch.rows = 15;
							oSearch.rf = 'json';
							oSearch.getResults(function(data) {ns1blankspace.messaging.imap.message.edit.attach.object.search(oParam, data)});
						}
						else
						{
							var aHTML = [];
							
							var aColumns = sColumns.split(',');

							aHTML.push('<table class="ns1blankspace" style="font-size:0.875em;" id="ns1blankspaceMessageEditAttachObjectContextSearchResults">');
							
							$.each(oResponse.data.rows, function(i, v) 
							{ 
								var sText = '';
								$.each(aColumns, function(j, k)
								{	
									sText += '<div ' + (j!=0?'class="ns1blankspaceSub"':'') + '>' + v[k] + '</div>';
								});

								aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceRowSelect"' +
											' id="ns1blankspaceMessageEditAttachObjectContext-' + v.id + '">' + sText + '</td></tr>');	
							});
							
							aHTML.push('</table>');

							$('#ns1blankspaceMessageEditAttachObjectContextSearch').html(aHTML.join(''));

							$('#ns1blankspaceMessageEditAttachObjectContextSearchResults td.ns1blankspaceRowSelect').click(function(event)
							{
								oParam = ns1blankspace.util.setParam(oParam, 'objectContext', (this.id).split('-')[1]);
								ns1blankspace.messaging.imap.message.edit.attach.object.attachments.search(oParam);
							});
						}
					},

					attachments:
					{
						search: 	function(oParam, oResponse)
						{
							var iObject = ns1blankspace.util.getParam(oParam, 'object').value;
							var iObjectContext = ns1blankspace.util.getParam(oParam, 'objectContext').value;

							if (oResponse == undefined)
							{
								$('#ns1blankspaceMessageEditAttachObjectContextSearch').html(ns1blankspace.xhtml.loadingSmall);

								var oSearch = new AdvancedSearch();
								oSearch.method = 'CORE_ATTACHMENT_SEARCH';
								oSearch.addField('filename,description,download,modifieddate,attachment');
								oSearch.addFilter('object', 'EQUAL_TO', iObject);
								oSearch.addFilter('objectcontext', 'EQUAL_TO', iObjectContext);
							
								oSearch.sort('filename', 'asc');
								oSearch.getResults(function(data) {ns1blankspace.messaging.imap.message.edit.attach.object.attachments.search(oParam, data)});
							}
							else
							{
								var aHTML = [];

								aHTML.push('<div><table class="ns1blankspace" style="font-size:0.875em;" id="ns1blankspaceMessageEditAttachObjectContextAttachmentsResults">');

								if (oResponse.data.rows.length == 0)
								{
									aHTML.push('<tr><td class="ns1blankspaceSub">No attachments.</td></tr>');
								}
								else
								{
									$.each(oResponse.data.rows, function (i, v)
									{
										aHTML.push('<tr><td class="ns1blankspaceRow">' +
														'<input type="checkbox" checked="checked" id="ns1blankspaceMessageEditAttachObjectContextAttachment-' + v.attachment + '" />' +
															v.filename + '</td></tr>');
									});	
								}

								aHTML.push('</table></div>');

								aHTML.push('<div id="ns1blankspaceMessageEditAttachObjectContextAttachmentSelect" class="ns1blankspaceAction" style="margin-top:8px;"></div>');

								$('#ns1blankspaceMessageEditAttachObjectContextSearch').html(aHTML.join(''));

								$('#ns1blankspaceMessageEditAttachObjectContextAttachmentSelect').button(
								{
									label: "Attach"
								})
								.click(function()
								{
									 ns1blankspace.messaging.imap.message.edit.attach.object.attachments.process();
								});
							}
						},

						process: 	function (oParam)
						{
							var aIDs = [];
							var oData = {};

							$('#ns1blankspaceMessageEditAttachObjectContextAttachmentsResults input:checked').each(function(i, v)
							{
								aIDs.push((v.id).split('-')[1]);
							});

							$(ns1blankspace.xhtml.container).hide();

							ns1blankspace.status.working('Attaching ...');

							$.each(aIDs, function (i, v)
							{
								oData.attachment = v;
								oData.object = 17;
								oData.objectContext = ns1blankspace.messaging.action;

								$.ajax(
								{
									type: 'POST',
									url: ns1blankspace.util.endpointURI('CORE_ATTACHMENT_LINK_MANAGE'),
									data: oData,
									dataType: 'json',
									success: function(data) 
									{
										if (data.status == 'OK')
										{	
											ns1blankspace.status.clear();
											ns1blankspace.messaging.imap.message.edit.attach.process();
										}
									}
								});
							});
						}			
					}			
				},								

				process: 	function (oParam, oResponse)
				{	
					var aHTML = [];
					var iAttachAction = ns1blankspace.messaging.action;
					var bForward = ns1blankspace.util.getParam(oParam, 'forward', {'default': false}).value;
					
					var sXHTMLElementID = "ns1blankspaceActionsEditEmailAttachments";
					
					if (oParam != undefined)
					{
						if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						if (oParam.action != undefined) {ns1blankspace.messaging.action = oParam.action}
					}
					
					$(ns1blankspace.xhtml.container).hide();

					$('#ns1blankspaceEditMessageAttach').attr('checked', false)
					$('#ns1blankspaceEditMessageAttach').button("refresh");
					
					if (ns1blankspace.messaging.action != -1)
					{
						if (oResponse == undefined)
						{
							//if (ns1blankspace.objectContextData.sourcetypetext === 'ACTION' && bForward && ns1blankspace.objectContextData.id != ns1blankspace.messaging.action)
							//{
							//	iAttachAction = (ns1blankspace.objectContextData.id) ? ns1blankspace.objectContextData.id : iAttachAction;
							//}
							$('#' + sXHTMLElementID).html(ns1blankspace.xhtml.loadingSmall);
							var oSearch = new AdvancedSearch();
							oSearch.method = 'CORE_ATTACHMENT_SEARCH';
							oSearch.addField('filename,description,download,modifieddate,attachment');
							oSearch.addFilter('object', 'EQUAL_TO', 17);
							oSearch.addFilter('objectcontext', 'EQUAL_TO', iAttachAction);
						
							oSearch.sort('filename', 'asc');
							oSearch.getResults(function(data) {ns1blankspace.messaging.imap.message.edit.attach.process(oParam, data)});
						}
						else
						{
							if (oResponse.data.rows.length == 0)
							{
								$('#' + sXHTMLElementID).html('');
							}
							else
							{
								aHTML.push('<table style="width:100%">');
							
								$.each(oResponse.data.rows, function()
								{
									aHTML.push('<tr class="ns1blankspaceAttachments">');
									aHTML.push('<td id="ns1blankspaceAttachment_filename-' + this.id + '" style="font-size:0.75em;color:black;font-weight:normal;width:100%" class="ns1blankspaceRow">' + this.filename + '</td>');
									aHTML.push('<td id="ns1blankspaceAttachmentAttachment_delete-' + this.attachment + '" style="width:20px;" class="ns1blankspaceRowRemove">&nbsp;</td>');
									aHTML.push('</tr>');
								});
								
								aHTML.push('</table>');

								$('#' + sXHTMLElementID).html(aHTML.join(''));
								
								$('.ns1blankspaceRowRemove').button({
									text: false,
									 icons: {
										 primary: "ui-icon-close"
									}
								})
								.click(function() {
									ns1blankspace.messaging.imap.message.edit.attach.remove(this.id)
								})
								.css('width', '15px')
								.css('height', '20px')
								
							}
						}
					}	
				},

				remove: 	function (sXHTMLElementId)
				{
					var aSearch = sXHTMLElementId.split('-');
					var sElementId = aSearch[0];
					var sSearchContext = aSearch[1];

					$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('CORE_ATTACHMENT_MANAGE'),
							data: 'remove=1&id=' + sSearchContext,
							dataType: 'text',
							success: function(data){$('#' + sXHTMLElementId).parent().fadeOut(500)}
						});	
				}
			}
		},

		multipleRecipients: 
		{
			choose: function()
			{
				var aDisplayEmails = [];
				var aHTML = [];

				$('#ns1blankspaceMessageSendSaveObjectContextRow').hide();

				$('#ns1blankspaceMessageSendSaveObjectContext').val('');

				// Now find the selected email addresses corresponding to saved contacts (we don't want manually typed ones as they have no contact record)
				for (var i = 1; i <= 3; i++)
				{
					var sElementID = '#ns1blankspaceEditMessage' + ((i == 1) ? 'To' : ((i == 2) ? 'Cc' : 'Bcc'));
					var aElementContacts = ($(sElementID).attr('data-id')) ? $(sElementID).attr('data-id').split('-') : [];
					var aElementEmails = ($(sElementID).attr('data-values')) ? $(sElementID).attr('data-values').split(';') : [];
					var aTextAreaEmails = $(sElementID).val().split(';');

					// Now populate aDisplayEmails with contactperson id and email of each email in textarea
					$.each(aTextAreaEmails, function()
					{
						if ($.inArray(this.toString(), aElementEmails) > -1)
						{
							aDisplayEmails.push({id: aElementContacts[$.inArray(this.toString(), aElementEmails)], email: this.toString()});
						}
					});
				}

				if (aDisplayEmails.length > 0)
				{
					aHTML.push('<table>');
					
					$.each(aDisplayEmails, function(index, row)
					{
						aHTML.push('<tr><td>' +
										'<input type="checkbox" checked="checked"' +
											' data-id="' + row.id + '" class="ns1blankspaceMessagingSaveRecipient"' +
											' data-value="' + row.email + '" checked="checked"' + 
											' id="ns1blankspaceMessagingSaveRecipientCheck-' + this.id + '" />' +
										'&nbsp;<span style="font-size:0.75em;">' + row.email + '</span>' +
									'</td></tr>');

						if (index === 0)		// We need to set this so that extra recipients are saved
						{
							$('#ns1blankspaceMessageSendSaveObject').prop('checked', true);
						}
					});

					aHTML.push('</table>');
				}
				else
				{
					aHTML.push('None of the recipients are saved as contacts in this space..')
				}

				$('#ns1blankspaceMessageSendSaveOptions').html(aHTML.join(''));
				$('#ns1blankspaceMessageSendSaveOptionsRow').show();
				$('.ns1blankspaceMessagingSaveRecipient').on('click', function()
				{
					if ($(this).prop('checked'))
					{
						if ($('#ns1blankspaceMessageSendSaveObjectContext').val() == '')
						{
							$('#ns1blankspaceMessageSendSaveObjectContext').attr('data-objectcontext', $(this).attr('data-id'));
							$('#ns1blankspaceMessageSendSaveObjectContext').attr('data-object', '32');
							$('#ns1blankspaceMessageSendSaveObjectContext').val($(this).attr('data-value'));
						}
					}
					else
					{
						if ($('#ns1blankspaceMessageSendSaveObjectContext').attr('data-objectcontext') === this.id)
						{
							$('#ns1blankspaceMessageSendSaveObjectContext').removeAttr('data-objectcontext');
							$('#ns1blankspaceMessageSendSaveObjectContext').removeAttr('data-object');
							$('#ns1blankspaceMessageSendSaveObjectContext').val('');
						}
					}
				});
			},

			save: function(oParam)
			{
				var fFunctionPostSend = ns1blankspace.util.getParam(oParam, 'functionPostSend').value;
				var aMultipleRecipients = ns1blankspace.util.getParam(oParam, 'multipleRecipients', {'default': []}).value;
				var oEmailData = ns1blankspace.util.getParam(oParam, 'data', {'default': {}}).value;
				var dToday = new Date();

				if (oParam.saveMultipleRecipientsStep === undefined) {oParam.saveMultipleRecipientsStep = 1}
				if (oParam.saveMultipleRecipientsIndex === undefined) {oParam.saveMultipleRecipientsIndex = 0}

				// Collate data and save action
				if (oParam.saveMultipleRecipientsStep === 1)
				{
					if (oParam.saveMultipleRecipientsIndex < aMultipleRecipients.length)
					{
						var oData = {};

						oData.object = '17';		// action
						oData.objectcontext = oParam.actionID;
						oData.contactperson = aMultipleRecipients[oParam.saveMultipleRecipientsIndex].toString();
						oData.contactbusiness = oEmailData.saveagainstcontactbusiness;
						oData.status = '1';
						oData.actiontype = '4';		// Set to file note
						oData.duedate = dToday.toString('dd MMM yyyy hh:mm:ss');
						oData.subject = 'Bulk email - ' + oEmailData.subject;
						oData.description = "This is a copy of a bulk eMail. To see the full eMail click on the 'View' button on the 'Other' line in the Relates To section of this action."

						ns1blankspace.status.message('Message has been sent - saving against recipients..');
						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('ACTION_MANAGE'),
							data: oData,
							success: function(oResponse)
							{
								if (oResponse.status === 'OK')
								{
									oParam.saveMultipleRecipientsIndex += 1;
									ns1blankspace.messaging.imap.message.multipleRecipients.save(oParam);
								}
								else
								{
									ns1blankspace.status.error('Unable to save against all recipients: ' + oResponse.error.errornotes)
								}
							}
						});
					}
					else
					{
						oParam.saveMultipleRecipientsStep = 2;
						ns1blankspace.messaging.imap.message.multipleRecipients.save(oParam);
					}
				}
				
				// Clean up and call back
				else if (oParam.saveMultipleRecipientsStep === 2)
				{
					delete(oParam.actionID);
					delete(oParam.multipleRecipients);
					delete(oParam.saveMultipleRecipientsStep);
					delete(oParam.saveMultipleRecipientsIndex);
					delete(oParam.data);
					fFunctionPostSend(oParam);
				}
			}
		},

		send:		function (oParam)
		{
			var fFunctionPostSend;
			var sXHTMLElementID = 'ns1blankspaceViewControlAction';
			var bSendNow = ns1blankspace.util.getParam(oParam, 'sendNow', {"default": false}).value;

			//if (oParam.object == undefined) {oParam.object = ns1blankspace.object}
			//if (oParam.objectContext == undefined) {oParam.objectContext = ns1blankspace.objectContext}
			
			if (oParam != undefined)
			{
				if (oParam.functionPostSend != undefined) {fFunctionPostSend = oParam.functionPostSend}
				if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
			}	
			
			if (oParam.draft != true && $('#ns1blankspaceMainEdit:visible').length == 0)
			{
				ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});
				$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
				var sContext = 'Reply';
				if (ns1blankspace.util.getParam(oParam, 'replyAll', {"default": false}).value) {sContext = 'ReplyAll'}
				if (ns1blankspace.util.getParam(oParam, 'forward', {"default": false}).value) {sContext = 'Forward'}
				$('#ns1blankspaceControl' + sContext).addClass('ns1blankspaceHighlight');

				ns1blankspace.status.error('Check & click Send')
			}
			else
			{
				if (oParam.draft != true && !bSendNow)
				{
					if ($(ns1blankspace.xhtml.container).attr('data-initiator') == sXHTMLElementID)
					{
						$(ns1blankspace.xhtml.container).slideUp(500);
						$(ns1blankspace.xhtml.container).attr('data-initiator', '');
					}
					else
					{	
						if (oParam.to == '' && oParam.contactPersonTo == undefined)
						{
							ns1blankspace.status.error('No one to send it to')
						}	
						else if (oParam.subject == undefined)		//v2.0.6 Was allowing no subject which was erroring in MESSAGING_EMAIL_SEND
						{
							ns1blankspace.status.error('You must have a subject to prevent SPAM filters from catching your email');
							//aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-bottom:8px;">' +
							//			'As there is no subject on this email, it might get caught by a SPAM filter and never get received.</td></tr>');
						}	

						else
						{
							$(ns1blankspace.xhtml.container).attr('data-initiator', sXHTMLElementID)
							ns1blankspace.container.position({xhtmlElementID: 'ns1blankspaceViewControlAction', leftOffset: -2, topOffset: 6});

							var aHTML = [];

							aHTML.push('<table id="ns1blankspaceMessageSaveContainer" class="ns1blankspaceDropDown" style="width:325px; margin-top:0px; opacity:1.0;"><tr><td>');

							aHTML.push('<div style="margin-bottom:6px;"><table>');

							aHTML.push('<tr><td class="ns1blankspaceRadio">' +
											'<input type="checkbox" checked="checked" id="ns1blankspaceMessageSendSave" /> Save this email</td></tr>');

							aHTML.push('</table></div>');

							aHTML.push('<div id="ns1blankspaceMessageSendSaveObject"><table>');

							aHTML.push('<tr class="ns1blankspace">' +
										'<td class="ns1blankspaceRadio" style="padding-left:2px;">' +
										'<select id="ns1blankspaceMessageSendSaveObjectValue" style="width:100%;">');

							aHTML.push('<option value="-1">Also save against ...</option>');

							$.each(ns1blankspace.messaging.imap.data.objects, function(i, v)
							{
								aHTML.push('<option value="' + v.id + '" data-method="' + v.method + '"' +
											(v.columns?' data-columns="' + v.columns + '"':'') +
											(v.methodFilter?' data-methodfilter="' + v.methodFilter + '"':'') + '>' +
											v.caption + '</option>');
							});
										
							aHTML.push('</select>' +
										'</td></tr>');

							aHTML.push('<tr id="ns1blankspaceMessageSendSaveObjectContextRow"><td style="padding-left:2px;">' +
										'<input id="ns1blankspaceMessageSendSaveObjectContext" style="padding:3px; width:96%">' +
										'</td></tr>');

							aHTML.push('<tr><td style="padding-left:2px; padding-top:4px;" id="ns1blankspaceMessageSendSaveObjectContextSearch"></td></tr>');

							aHTML.push('<tr id="ns1blankspaceMessageSendSaveOptionsRow" style="display:none;">' + 
									'<td style="padding-left:2px; padding-top:4px;" id="ns1blankspaceMessageSendSaveOptions"></td></tr>');

							aHTML.push('</table></div>');

							aHTML.push('<div style="margin-top:16px; margin-bottom:6px;" id="ns1blankspaceMessageEditSendNow" class="ns1blankspaceAction">Send Now</div>');

							aHTML.push('</td></<tr></table>');

							$(ns1blankspace.xhtml.container).html(aHTML.join(''));

							$('#ns1blankspaceMessageSendSave').click(function()
							{
								$('#ns1blankspaceMessageSendSaveObject').toggle();
							});	

							$('#ns1blankspaceMessageSendSaveObjectValue').change(function()
							{
								$('#ns1blankspaceMessageSendSaveObjectContext').attr('data-object', $('#ns1blankspaceMessageSendSaveObjectValue :selected').val());

								if ($(this).val() === '-32')		// We want to save against selected recipients
								{
									ns1blankspace.messaging.imap.message.multipleRecipients.choose();
								}
								else
								{
									$('#ns1blankspaceMessageSendSaveObjectContextRow').show();
									$('#ns1blankspaceMessageSendSaveOptions').html('');
									$('#ns1blankspaceMessageSendSaveOptionsRow').hide();

									$('#ns1blankspaceMessageSendSaveObjectContextSearch').html('');
								}
							});

							$('#ns1blankspaceMessageSendSaveObjectContext').keyup(function ()
							{
								if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
									ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.messaging.imap.message.object()', ns1blankspace.option.typingWait);
							});

							$('#ns1blankspaceMessageEditSendNow').button(
							{
								label: 'Send Now'
							})
							.click(function()
							{
								oParam = ns1blankspace.util.setParam(oParam, 'sendNow', true);
								oParam = ns1blankspace.util.setParam(oParam, 'save', $('#ns1blankspaceMessageSendSave').prop('checked'));

								if ($('#ns1blankspaceMessageSendSaveObject').prop('checked'))
								{
									oParam.object = $('#ns1blankspaceMessageSendSaveObjectContext').attr('data-object');
									oParam.objectContext = $('#ns1blankspaceMessageSendSaveObjectContext').attr('data-objectcontext');
									
									// v2.0.6b We're saving against multiple recipients
									if (oParam.object == '-32') 
									{
										// Get the list of recipients to save against and then change parameters so that action is first saved against no-one
										if ($('input.ns1blankspaceMessagingSaveRecipient:checked').length > 1)
										{
											oParam.multipleRecipients = $.map($('input.ns1blankspaceMessagingSaveRecipient:checked'), function(x) {return $(x).attr('data-id')});
											delete(oParam.objectContext);
											delete(oParam.object);
										}
										// There's only one selected, just save as normal
										else
										{
											oParam.object = '32';
											oParam.objectContext = $($('input.ns1blankspaceMessagingSaveRecipient:checked').first()).attr('data-objectcontext');
											//$('#ns1blankspaceMessageSendSaveObjectContext').val(row.email);
										}
									}	
									// v2.0.6 also saves again business / person if we have this info
									if (oParam.object == '12') {oParam.contactBusiness = oParam.objectContext}		
									if (oParam.object == '32') {oParam.contactPerson = oParam.objectContext}
								}

								ns1blankspace.messaging.imap.message.send(oParam);
							});
						}	
					}	
				}
				else
				{	
					// v2.0.6 Added send parameter, otherwise emails not being sent now that id is being used
					var oData =
					{
						subject: (oParam.subject == undefined ?'' : oParam.subject),
						message: (oParam.message == undefined ?' ' : oParam.message),
						to: (oParam.to == undefined ? '' : oParam.to),
						fromemail: ns1blankspace.messaging.imap.data.fromEmail,
						send: ((oParam.draft === true) ? 'N' : 'Y') 
					}

					if (oParam.cc) {oData.cc = oParam.cc}
					if (oParam.bcc) {oData.bcc = oParam.bcc}
					if (oParam.contactPersonTo) {oData.saveagainstcontactperson = oParam.contactPersonTo}	
					if (oParam.contactBusiness) {oData.saveagainstcontactbusiness = oParam.contactBusiness}
					if (oParam.contactPerson) {oData.saveagainstcontactperson = oParam.contactPerson}
					if (oData.saveagainstcontactperson)		// v2.0.6 this is sometimes passed as - delimited list of contactpersonids, which errors
					{ 
						oData.saveagainstcontactperson = oData.saveagainstcontactperson.split('-').shift()
					}		
					if (oParam.priority) {oData.priority = oParam.priority}
					if (oParam.object) {oData.saveagainstobject = oParam.object}
					if (oParam.object == '32' && oParam.contactPersonTo) {oData.saveagainstobjectcontext = oParam.contactPersonTo}	//v2.0.6d
					if (oParam.objectContext) 
					{
						oData.saveagainstobjectcontext = oParam.objectContext
					}

					// v2.0.6d SUP022302 Was giving error if one supplieed without the other
					if (oData.saveagainstobject && oData.saveagainstobjectcontext == undefined)
					{
						delete(oData.saveagainstobject);
					}
					// v2.0.6c Was saving regardless
					if (oParam.save) {oData.save = (oParam.save == true ? 'Y': 'N')}		
					if (ns1blankspace.messaging.action != -1) {oData.id = ns1blankspace.messaging.action}

					if (oParam.draft != true && oData.to == '')
					{
						ns1blankspace.status.error('No one to send to');
					}	
					else if (oParam.draft && (oData.subject === '' || $('#ns1blankspaceMainEdit:visible').length == 0))
					{
						// We don't do anything here - we dont save drafts without a subject and we don't save when the Edit div isn't visible
					}
					else
					{	
						ns1blankspace.messaging.imap.data.lastEmail = oData;
						$('#ns1blankspaceViewControlAction').button({disabled: true});
						ns1blankspace.status.working((oParam.draft === true) ? '' : 'Sending');

						$.ajax(
						{
							type: 'POST',
							url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND'),
							data: oData,
							dataType: 'json',
							success: function(data) 
							{
								if (data.status == 'OK')
								{	
									if (oParam.draft != true)
									{
										if ($('#ns1blankspaceMainInbox').is('*') && $('#ns1blankspaceMainInbox').html() != '')
										{
											ns1blankspace.show({selector: '#ns1blankspaceMainInbox'});		// v2.0.6 was doing this before confirming that message has been sent and losing the message
										}
										ns1blankspace.status.message('Email has been sent');
										$('#ns1blankspaceMessagingMessageControlContainer').html('');
										$(ns1blankspace.xhtml.container).attr('data-initiator', '');
										
										ns1blankspace.messaging.imap.data.lastEmail = undefined;
										ns1blankspace.inputDetected = false;
										$('#ns1blankspaceMainEdit').html('');
										$('#ns1blankspaceMainEdit').removeAttr('data-objectcontext'); 

										if (ns1blankspace.timer.messagingSave != 0) {clearInterval(ns1blankspace.timer.messagingSave)};
										
										// v2.0.6b Save against the multiple recipients
										if (oParam.multipleRecipients && oParam.multipleRecipients.length > 0)
										{
											oParam.data = oData;
											if (oParam.functionPostSend === undefined)
											{
												ns1blankspace.messaging.imap.emailAccounts = [];
												oParam.functionPostSend = ns1blankspace.messaging.imap.home;
												oParam.actionID = data.id;
											}
											ns1blankspace.messaging.imap.message.multipleRecipients.save(oParam);
										}
										else
										{
											if ($('#ns1blankspaceMainInbox').is('*') && $('#ns1blankspaceMainInbox').html() == '')
											{	// 2.0.6 default action when inbox not active
												ns1blankspace.messaging.imap.emailAccounts = [];
												ns1blankspace.messaging.imap.home();
											}
											else if (fFunctionPostSend != undefined)
											{	
												fFunctionPostSend();
											}
										}
									}
									else
									{
										$('#ns1blankspaceViewControlAction').button({disabled: false});
										ns1blankspace.messaging.action = data.id;
										ns1blankspace.status.message('Draft saved...')
										$('#ns1blankspaceMainEdit').attr('data-objectcontext', ns1blankspace.messaging.action);
									}
								}
								else
								{
									ns1blankspace.status.error('Email could not be ' + ((oParam.draft === true) ? 'saved' : 'sent'))
								}	
							}
						});
					}
				}	
			}	
		},

		saveAgainstRecipients: function(oParam)
		{

		},

		object: 	function (oParam, oResponse)
		{
			var iObject = $('#ns1blankspaceMessageSendSaveObjectValue :selected').val();
			var sColumns = $('#ns1blankspaceMessageSendSaveObjectValue :selected').attr('data-columns');
			if (sColumns === undefined) {sColumns = 'reference'}

			if (oResponse === undefined)
			{	
				$('#ns1blankspaceMessageSendSaveObjectContextSearch').html(ns1blankspace.xhtml.loadingSmall);

				var sMethod = $('#ns1blankspaceMessageSendSaveObjectValue :selected').attr('data-method');
				var sSearchText = $('#ns1blankspaceMessageSendSaveObjectContext').val();
				var aSearchFilters = $('#ns1blankspaceMessageSendSaveObjectValue :selected').attr('data-methodFilter');
				aSearchFilters = (aSearchFilters) ? aSearchFilters.split('|') : undefined;

				var oSearch = new AdvancedSearch();
				oSearch.method = sMethod;
				oSearch.addField(sColumns);
				
				if (iObject == 32)
				{	
					var aSearchText = sSearchText.split(' ');

					oSearch.addBracket("(")
					if (aSearchText.length > 1)
					{
						oSearch.addFilter('firstname', 'TEXT_STARTS_WITH', aSearchText[0]);
						oSearch.addFilter('surname', 'TEXT_STARTS_WITH', aSearchText[1]);
					}
					else
					{
						oSearch.addFilter('firstname', 'TEXT_IS_LIKE', sSearchText);
						oSearch.addOperator('or');
						oSearch.addFilter('surname', 'TEXT_IS_LIKE', sSearchText);
					}	
					oSearch.addBracket(")")
				}
				else
				{
					if (aSearchFilters && aSearchFilters.length > 0)
					{
						oSearch.addBracket("(")
						$.each(aSearchFilters, function(i, t)
						{
							var aFilterOptions = t.split('-');
							oSearch.addFilter(aFilterOptions[0], 
									((aFilterOptions.length > 1) ? aFilterOptions[1] : undefined), 
									((aFilterOptions.length === 2) ? sSearchText : undefined));
							if (aSearchFilters.length > (i + 1))
							{
								oSearch.addOperator('or')
							}
						});
						oSearch.addBracket(")")
					}
					else
					{
						oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
					}
				}	
				
				oSearch.rows = 15;
				oSearch.rf = 'json';
				oSearch.getResults(function(data) {ns1blankspace.messaging.imap.message.object(oParam, data)});
			}
			else
			{
				var aHTML = [];
				
				var aColumns = sColumns.split(',');

				// v2.0.6 Now displays selectble list of links instead of list of radio buttons - more consitent and easier to navigate
				aHTML.push('<table class="ns1blankspace" style="font-size:0.875em;" id="ns1blankspaceMessageSendSaveObjectContextSearchResults">');
				
				$.each(oResponse.data.rows, function(i, v) 
				{ 
					var sText = '';
					$.each(aColumns, function(j, k)
					{	
						sText += v[k] + ' ';
					});

					aHTML.push('<tr><td id="ns1blankspaceItem_title-' + v.id +'" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
									sText + '</td></tr>');	
				});
				
				aHTML.push('</table>');

				$('#ns1blankspaceMessageSendSaveObjectContextSearch').html(aHTML.join(''))
				
				$('#ns1blankspaceMessageSendSaveObjectContextSearchResults td.ns1blankspaceRowSelect')
				.click(function()
				{

					$('#ns1blankspaceMessageSendSaveObjectContext').attr('data-id', this.id.split('-').pop());
					$('#ns1blankspaceMessageSendSaveObjectContext').attr('data-objectcontext', this.id.split('-').pop());
					$('#ns1blankspaceMessageSendSaveObjectContext').attr('data-object', iObject);
					$('#ns1blankspaceMessageSendSaveObjectContext').val($(this).html());
					$('#ns1blankspaceMessageSendSaveObjectContextSearch').html('');
					$('#ns1blankspaceMessageSendSaveObject').prop('checked', true);
				});

			}
		},			

		remove: 	function (oParam)
		{	
			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {"default": 'ns1blankspaceControlDelete'}).value;
			var bConfirmed = ns1blankspace.util.getParam(oParam, 'confirmed', {"default": false}).value;

			if (!bConfirmed)
			{
				if ($(ns1blankspace.xhtml.container).attr('data-initiator') == sXHTMLElementID)
				{
					$(ns1blankspace.xhtml.container).slideUp(500);
					$(ns1blankspace.xhtml.container).attr('data-initiator', '');
				}
				else
				{	
					$(ns1blankspace.xhtml.container).attr('data-initiator', sXHTMLElementID)

					ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: 85, topOffset: 25});

					var aHTML = [];
									
					aHTML.push('<div style="margin-right:2px;" id="ns1blankspaceMessageRemove" class="ns1blankspaceAction">Delete</div>');

					$(ns1blankspace.xhtml.container).html(aHTML.join(''));

					$('#ns1blankspaceMessageRemove').button(
					{
						label: 'Delete Now'
					})
					.click(function()
					{
						ns1blankspace.app.options.hide();
						oParam = ns1blankspace.util.setParam(oParam, 'confirmed', true);
						ns1blankspace.messaging.imap.message.remove(oParam);
					})
					.css('width', '65px')
					.css('height', '45px');
				}
			}	
			else
			{	
				ns1blankspace.status.working('Deleting...');

				oData = 
				{
					id: ns1blankspace.objectContext,
					destinationfolder: ns1blankspace.messaging.imap.emailAccount.deletedFolder
				}

				// v 2.0.6 Must have a destination folder to save to otherwise call fails. If none, we just delete
				// Also added error handling
				if (oData.destinationfolder)
				{
					$.ajax(
					{
						type: 'POST',
						url: '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_MOVE_FOLDER',
						data: oData,
						dataType: 'json',
						success: function(data)
						{
							if (data.status == 'OK')
							{	
								ns1blankspace.show({selector: '#ns1blankspaceMainInbox'});
								$('#ns1blankspaceMessagingMessageControlContainer').html('');

								if (ns1blankspace.messaging.imap.account != undefined)
								{
									$('#ns1blankspaceMessaging-' + ns1blankspace.messaging.imap.account).addClass('ns1blankspaceHighlight');
									ns1blankspace.messaging.imap.inbox.show({xhtmlElementID: '-' + ns1blankspace.messaging.imap.account, source: 1, newOnly: false, refreshInbox: true, repaginate: true})
								}
								ns1blankspace.status.message('Deleted');
							}
							else
							{
								ns1blankspace.status.error('Unable to delete email: ' + oResponse.error.errornotes);
							}
						}
					});
				}
				else
				{
					oData.remove = '1';
					$.ajax(
					{
						type: 'POST',
						url: '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_MANAGE',
						data: oData,
						dataType: 'json',
						success: function(data)
						{
							if (data.status == 'OK')
							{	
								ns1blankspace.show({selector: '#ns1blankspaceMainInbox'});
								$('#ns1blankspaceMessagingMessageControlContainer').html('');

								if (ns1blankspace.messaging.imap.account != undefined)
								{
									$('#ns1blankspaceMessaging-' + ns1blankspace.messaging.imap.account).addClass('ns1blankspaceHighlight');
									ns1blankspace.messaging.imap.inbox.show({xhtmlElementID: '-' + ns1blankspace.messaging.imap.account, source: 1, newOnly: false, refreshInbox: true, repaginate: true})
								}
								ns1blankspace.status.message('Deleted');
							}
							else
							{
								ns1blankspace.status.error('Unable to delete email: ' + oResponse.error.errornotes);
							}
						}
					});
				}

			}	
		},			
	},

	save: 		
	{
		send: 		function (oParam, oResponse)
		{
			// Save draft emails
			if (oResponse == undefined)
			{			
				var oData = {send: 'N', id: (ns1blankspace.messaging.action != -1) ? ns1blankspace.messaging.action : undefined};
				
				if ($('#ns1blankspaceMainEdit').html() != '')
				{
					oData.subject =$('#ns1blankspaceMessagingSendMessageSubject').val();
					oData.message = tinyMCE.get('ns1blankspaceMessagingSendMessage').getContent(); //???
				}
				
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_SEND'),
					data: oData,
					dataType: 'JSON',
					success: function(data) 
					{
						ns1blankspace.messaging.imap.save.send(oParam, data)
					}
				});
				
			}
			else
			{	
				if (oResponse.status == 'OK')
				{
					ns1blankspace.status.message('Draft saved');
					//if (ns1blankspace.objectContext == -1) {var bNew = true}
					//ns1blankspace.objectContext = oResponse.id;	
					//if (bNew) {ns1blankspaceMessagingSearch('-' + ns1blankspace.objectContext)}
				}
				else
				{
					ns1blankspace.status.error(oResponse.error.errornotes);
				} 
			}
		}
	},

	attachments: function ()
	{
		var aHTML = [];
		
		if (ns1blankspace.objectContextData == undefined)
		{
			aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this email message.</td></tr></table>');
					
			$('#ns1blankspaceMainAttachments').html(aHTML.join(''));
		}
		else
		{
			var iAttachmentCount = ns1blankspace.objectContextData.attachmentcount;
			
			if (iAttachmentCount == 0)
			{
				aHTML.push('<table><tr><td class="ns1blankspaceNothing">No attachments.</td></tr></table>');

				$('#ns1blankspaceMainAttachments').html(aHTML.join(''));
			}
			else
			{
				var sAttachments = ns1blankspace.objectContextData.attachments;
				var aAttachments = sAttachments.split('#')

				aHTML.push('<table>');
			
				aHTML.push('<tr class="ns1blankspaceCaption">');
				aHTML.push('<td class="ns1blankspaceHeaderCaption">Filename</td>');
				aHTML.push('<td class="ns1blankspaceHeaderCaption">Size (kb)</td>');
				aHTML.push('</tr>');
			
				$.each(aAttachments, function(iIndex) 
				{
					if (this != '')
					{
						var sLink = ns1blankspace.util.endpointURI('MESSAGING_EMAIL_ATTACHMENT_DOWNLOAD');
						sLink += '&attachment=' + ns1blankspace.util.fs(iIndex);
						sLink += '&account=' + ns1blankspace.util.fs(ns1blankspace.messaging.imap.account);
						sLink += '&id=' + ns1blankspace.util.fs(ns1blankspace.objectContext);
						
						var aAttachment = this.split('|');
						sAttachments += '\r\n' + aAttachment[0];
					
						aHTML.push('<tr class="ns1blankspaceAttachments">');
						aHTML.push('<td id="ns1blankspaceMessagingAttachment_filename-' + (iIndex) + '" class="ns1blankspaceRow">' +
											'<a href="' + sLink + '" target="_blank">' + aAttachment[0] + '</a></td>');
						aHTML.push('<td id="ns1blankspaceMessagingAttachment_size-' + (iIndex) + '" class="ns1blankspaceRow">' + (aAttachment[1] / 1000).toFixed(2) + '</td>');
										
						aHTML.push('</tr>');
					}	
				});	
			   	
				aHTML.push('</table>');
				$('#ns1blankspaceMainAttachments').html(aHTML.join(''));
			}
		}	
	},

	templates: 	function (oParam)
	{
		if (ns1blankspace.format.templates.data[ns1blankspace.object] == undefined)
		{
			oParam = ns1blankspace.util.setParam(oParam, 'object', ns1blankspace.object);
			oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.messaging.imap.templates);
			ns1blankspace.format.templates.init(oParam);
		}
		else
		{	
			if (ns1blankspace.format.templates.data[ns1blankspace.object] != undefined)
			{
				if (ns1blankspace.format.templates.data[ns1blankspace.object].length != 0)
				{
					if ($('#ns1blankspaceMessageTemplatesSelect').length == 0)
					{
						$('#ns1blankspaceMessagingEditMessageSubject').css('width', ($('#ns1blankspaceMessagingEditMessageSubject').width() - 30) + 'px');
						$('#ns1blankspaceMessagingEditMessageSubject').after('<span style="margin-left:2px;" id="ns1blankspaceMessageTemplatesSelect"></span>');
					
						$('#ns1blankspaceMessageTemplatesSelect')
						.button(
						{
							text: false,
							icons:
							{
								primary: "ui-icon-triangle-1-s"
							}
						})
						.css('width', '14px')
						.css('height', '21px')
						.click(function ()
						{
							if ($(ns1blankspace.xhtml.container).attr('data-initiator') == 'ns1blankspaceMessageTemplatesSelect')
							{
								$(ns1blankspace.xhtml.container).slideUp(500);
								$(ns1blankspace.xhtml.container).attr('data-initiator', '');
							}
							else
							{
								ns1blankspace.container.position(
								{
									xhtmlElementID: 'ns1blankspaceMessageTemplatesSelect',
									topOffset: 0,
									leftOffset: -175
								});

								$vq.clear({queue: 'templates'});

								$vq.add('<div class="ns1blankspaceViewControlContainer" id="ns1blankspaceViewTemplateContainer" style="font-size:0.875em;">', {queue: 'templates'});

								$.each(ns1blankspace.format.templates.data[ns1blankspace.object], function (t, template)
								{
									$vq.add('<div class="ns1blankspaceRow ns1blankspaceRowSelect" style="border-width: 0px;"' +
												' id="ns1blankspaceViewTemplate-' + template.id + '">' + template.title + '</div>', {queue: 'templates'});
								});	

								$vq.add('</div>', {queue: 'templates'});

								$vq.render(ns1blankspace.xhtml.container, {queue: 'templates', show: true});

								$('#ns1blankspaceViewTemplateContainer .ns1blankspaceRowSelect').click(function ()
								{
									var sID = this.id.split('-')[1];

									var oTemplate = $.grep(ns1blankspace.format.templates.data[ns1blankspace.object], function (t) {return t.id == sID})[0];

									$('#ns1blankspaceMessagingEditMessageSubject').removeClass('ns1blankspaceWatermark');
									$('#ns1blankspaceMessagingEditMessageSubject').val(oTemplate.title);
									
									tinyMCE.get('ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor).setContent(oTemplate.xhtml);
								
									ns1blankspace.container.hide(
									{
										xhtmlElementID: 'ns1blankspaceMessageTemplatesSelect',
										fadeOutTime: 0
									});
								});
							}	
						});
					}	
				}	
			}	
		}
	},			
				
	"new": 		function (oParam, oResponse)
	{
		var sXHTMLElementID = 'ns1blankspaceMainEdit';

		if (oParam != undefined)
		{
			if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		}
		else
		{
			oParam = {}
		}
		oParam.newEmail = true;
		
		ns1blankspace.show({selector: '#' + sXHTMLElementID});

		// v2.0.6 Now checks to see if already editing
		if ($('#' + sXHTMLElementID).attr('data-objectcontext') != undefined)
		{
			oParam.functionDiscard = ns1blankspace.messaging.imap.message.edit.show;
			ns1blankspace.messaging.imap.inbox.checkForEditing(oParam);
		}	
		else
		{	
			ns1blankspace.messaging.imap.message.edit.show(oParam);
		}
	},

	drafts: 	function (oParam, oResponse)
	{
		var aHTML = [];
		
		var sXHTMLElementID = 'ns1blankspaceMainEdit';

		if (oParam != undefined)
		{
			if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
		}
		else
		{
			oParam = {}
		}
		
		ns1blankspace.show({selector: '#' + sXHTMLElementID});
		$('#' + sXHTMLElementID).html(ns1blankspace.xhtml.loading);
		
		if (oResponse == undefined)
		{
			var sParam = 'method=MESSAGING_EMAIL_DRAFT_SEARCH';

			$.ajax(
			{
				type: 'GET',
				url: '/ondemand/messaging/?' + sParam,
				dataType: 'json',
				success: function(data) {ns1blankspace.messaging.imap["new"](oParam, data)}
			});
		}	
		else	
		{		
			if (oResponse.data.rows.length == 0)
			{
				oParam.newEmail = true;
				ns1blankspace.messaging.imap.message.edit.show(oParam);
			}
			else
			{	
				aHTML.push('<table class="ns1blankspaceMain">' +
								'<tr class="ns1blankspaceRow">' +
								'<td id="ns1blankspaceNewColumn1" class="ns1blankspaceColumn1Large">' +
								ns1blankspace.xhtml.loading + '</td>' +
								'<td id="ns1blankspaceNewColumn2" class="ns1blankspaceColumn2Action" style="width:150px;"></td>' +
								'</tr>' +
								'</table>');	
		
				$('#' + sXHTMLElementID).html(aHTML.join(''));
			
				var aHTML = [];
				
				aHTML.push('<table class="ns1blankspaceColumn2">');
						
				aHTML.push('<tr><td >' +
								'<span id="ns1blankspaceMessagingNewBlank" class="ns1blankspaceAction">Create New</span>' +
								'</td></tr>');
								
				aHTML.push('</table>');					
			
				$('#ns1blankspaceNewColumn2').html(aHTML.join(''));
			
				$('#ns1blankspaceMessagingNewBlank').button(
				{
					label: "Blank"
				})
				.click(function()
				{
					oParam.newEmail = true;
					ns1blankspace.messaging.imap.message.edit.show(oParam);
				})
				.css('width', '75px')
			
				var aHTML = [];

				aHTML.push('<table style="width:100%">');
				aHTML.push('<tr><td class="ns1blankspaceCaption">Saved Drafts</td></tr>');
				
				aHTML.push('<table id="ns1blankspaceMessagingContainer" style="width:100%">');
			
				var sSubject;

				$.each(oResponse.data.rows, function() {
				
					sSubject = this.subject
					if (sSubject == '') {sSubject = 'No Subject'}
					
					aHTML.push('<tr><td id="ns1blankspaceMessagingNewDrafts_subject-' + this.id + 
									'"class="ns1blankspaceRow ns1blankspaceRowSelect">' + sSubject + '</td></tr>');				
				})
				
				aHTML.push('</table>');
				
				$('#ns1blankspaceNewColumn1').html(aHTML.join(''));
			
				$('#ns1blankspaceMessagingContainer td.ns1blankspaceRowSelect').click(function() {
				
					var sData = 'method=MESSAGING_EMAIL_DRAFT_SEARCH&getmessage=1';
					sID = this.id;
					aID = sID.split('-');
					sParam += '&id=' + aID[1];

					$.ajax(
					{
						type: 'GET',
						url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_DRAFT_SEARCH'),
						data: sData,
						dataType: 'json',
						success: function(oResponse) {
							oParam.message = oResponse.data.rows[0].message;
							oParam.subject = oResponse.data.rows[0].subject;
							oParam.source = 3;
							ns1blankspace.messaging.imap.edit.show(oParam);
						}
					});
				})
			}
		}	
	},

	actions: 	
	{
		show: function (oParam, oResponse)
		{
			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {'default': 'ns1blankspaceMainActionsSent'}).value;
			var sXHTMLContext = ns1blankspace.util.getParam(oParam, 'xhtmlContext', {'default': 'ActionsSent'}).value;
			var iType = ns1blankspace.util.getParam(oParam, 'type', {'default': 5}).value; 	//Email Sent
			var sSent = ns1blankspace.util.getParam(oParam, 'sent').value;
			var iStatus = ns1blankspace.util.getParam(oParam, 'status').value;

			if (oParam.xhtmlContext === undefined) {oParam.xhtmlContext = sXHTMLContext}
			if (oParam.xhtmlElementID === undefined) {oParam.xhtmlElementID = sXHTMLElementID}
			if (oParam.sent === undefined) {oParam.sent = sSent}

			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'ACTION_SEARCH';
				oSearch.addField('actionreference,subject,actiontypetext,duedatetime,contactpersontext');
				oSearch.rf = 'json';
				oSearch.addFilter('actiontype', 'EQUAL_TO', iType);
				oSearch.addFilter('actionby', 'EQUAL_TO', ns1blankspace.user.id);
				if (sSent != undefined) {oSearch.addFilter('emailsent', 'EQUAL_TO', sSent)};
				if (iStatus != undefined) {oSearch.addFilter('status', 'EQUAL_TO', iStatus)};
				oSearch.sort('duedate', 'desc');
				oSearch.rows = ns1blankspace.messaging.defaultRows;		// v2.0.6e Added
				oSearch.getResults(function(data) {ns1blankspace.messaging.imap.actions.show(oParam, data)}); 
			}
			else
			{
				var aHTML = [];
					
				if (oResponse.data.rows.length == 0)
				{
					$('#ns1blankspaceMessagingActionsSent').html('<table><tr><td class="ns1blankspaceNothing">No emails to show.</td></tr></table>');
				}
				else
				{
					aHTML.push('<table>');
		
					$.each(oResponse.data.rows, function() 
					{
						aHTML.push(ns1blankspace.messaging.imap.actions.row(this, oParam));
					});
		    	
					aHTML.push('</table>');

					ns1blankspace.render.page.show(
					{
						xhtmlElementID: sXHTMLElementID,
						xhtmlContext: sXHTMLContext,
						xhtml: aHTML.join(''),
						showMore: (oResponse.morerows == "true"),
						more: oResponse.moreid,
						rows: ns1blankspace.messaging.defaultRows,
						functionShowRow: ns1blankspace.messaging.imap.actions.row,
						functionOnNewPage: ns1blankspace.messaging.imap.actions.bind,
						headerRow: false,
						bodyClass: 'ns1blankspaceMessagingActionsSent'
					}); 	
				}
			}
		},

		row: 		function (oRow, oParam)
		{
			var sXHTMLContext = ns1blankspace.util.getParam(oParam, 'xhtmlContext', {'default': 'ActionsSent'}).value;
			var sSent = ns1blankspace.util.getParam(oParam, 'sent', {'default': 'Y'}).value;

			var aHTML = [];

			aHTML.push('<tr>');

			aHTML.push('<td id="ns1blankspace' + sXHTMLContext + '_subject-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect" data-sent="' + sSent + '">' +
							oRow.actionreference + '</td>');

			aHTML.push('<td id="ns1blankspace' + sXHTMLContext + '_contactperson-' + oRow.id + '" class="ns1blankspaceRow">' +
							oRow.contactpersontext + '</td>');

			aHTML.push('<td id="ns1blankspace' + sXHTMLContext + '_date-' + oRow.id + '" class="ns1blankspaceRow">' +
							oRow.duedatetime + '</td>');
			
			aHTML.push('<td id="ns1blankspace' + sXHTMLContext + '_options-' + oRow.id + '" class="ns1blankspaceRow" style="width:50px;">' +
							'<span id="ns1blankspace' + sXHTMLContext + '_optionRemove-' + oRow.id + '"' +
								' class="ns1blankspace' + sXHTMLContext + 'Remove" data-sent="' + sSent + '">&nbsp;</span>' +
						'</td>');
			
			aHTML.push('</tr>');

			return aHTML.join('');
		},	

		bind: 		function (oParam)
		{
			// v2.0.6e SUP022225 Was re-binding each page already viewed
			var sXHTMLContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlContainerID').value;
			if (sXHTMLContainerID === undefined) {sXHTMLContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value};
			var sXHTMLContext = ns1blankspace.util.getParam(oParam, 'xhtmlContext', {'default': 'ActionsSent'}).value;

			// v2.0.6 Bind delete
			$('#' + sXHTMLContainerID + ' span.ns1blankspace' + sXHTMLContext + 'Remove')
				.button(
				{
					icons: {primary: 'ui-icon-close'},
					text: false,
					label: 'Remove'
				})
				.css('width', '20px')
				.css('height', '20px')
				.click(function()
				{
					ns1blankspace.remove({id: this.id.split('-').pop(), xhtmlElementID: this.id, method: 'ACTION_MANAGE'});
				});

			// v2.0.6 Bind Open - Go to editing message for Drafts, otherwise go to actions
			$('#' + sXHTMLContainerID + ' td.ns1blankspaceRowSelect')
				.click(function()
				{
					ns1blankspace.messaging.imap.actions.search.send(
					{
						id: this.id.split('-').pop(), 
						source: 1,
						draft: $(this).attr('data-sent') === 'N'
					});
				});
		},			

		search: 	
		{				
			/* v2.0.6 Used to search for email details of an action or to search through saved emails*/
			send:		function (oParam, oResponse)
			{
				var aHTML = [];
				var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
				var sTargetXHTMLElementID = ns1blankspace.util.getParam(oParam, 'targetXHTMLElementID', {'default': 'ns1blankspaceMainSummary'});
				var bSetContext = ns1blankspace.util.getParam(oParam, 'setContext', {'default': true});
				var sID = ns1blankspace.util.getParam(oParam, 'id').value;
				var sSearchContext;
				var iSource = ns1blankspace.util.getParam(oParam, 'source').value;
				

				if (iSource === undefined) {iSource = ns1blankspace.data.searchSource.text;}

				if (sID != undefined) {sSearchContext = sID;}
				else {sSearchContext = sXHTMLElementID.split('-').pop();}

				oParam.action = sSearchContext;
				
				if (bSetContext) {ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});};
				
				// v2.0.6 We have an id - search for the action's email-specific details
				if (sSearchContext != undefined && iSource != ns1blankspace.data.searchSource.browse)
				{
					ns1blankspace.messaging.action = sID;
					ns1blankspace.objectContext = sID;
					ns1blankspace.objectContextData = undefined;
					
					var oSearch = new AdvancedSearch();
					oSearch.method = 'ACTION_SEARCH';
					oSearch.addField('subject,duedate,duedatetime,actiontype,actiontypetext,message,contactpersontext,createduser,createdusertext');
					oSearch.rf = 'json';
					oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
					oSearch.getResults(function(oResponse) 
					{
						if (oResponse.status === 'OK')
						{
							if (oResponse.data.rows.length > 0)
							{
								var oRow = oResponse.data.rows[0];
								ns1blankspace.objectContextData = {};
								ns1blankspace.objectContextData.id = oRow.id;
								ns1blankspace.objectContextData.subject = oRow.subject;
								ns1blankspace.objectContextData.message = oRow.message;
								ns1blankspace.objectContextData.date = oRow.duedatetime;	// v2.0.6c Was picking up duedatetime which isn't in results
								ns1blankspace.objectContextData.imapflags = '';
								ns1blankspace.objectContextData.actiontype = oRow.actiontype;
								ns1blankspace.objectContextData.detailscached = 'Y';
								ns1blankspace.objectContextData.sourcetypetext = 'ACTION';
								ns1blankspace.messaging.imap.actions.search.recipients(oParam, oResponse);
							}
							else
							{
								ns1blankspace.status.error('Cannot find message!');
							}
						}
						else
						{
							ns1blankspace.status.error('Error finding message details: ' + oResponse.error.errornotes);
						}
					});
				}
				// We're seaching via the viewport search
				else if (iSource == ns1blankspace.data.searchSource.browse)
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
						sElementId = 'ns1blankspaceViewBrowse';
					}
					
					if (sSearchText.length >= iMinimumLength || iSource == ns1blankspace.data.searchSource.browse)
					{
						ns1blankspace.container.position({xhtmlElementID: sElementId});
						ns1blankspace.search.start();
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'ACTION_SEARCH';
						oSearch.addField('actionreference,duedatetime,text');
						oSearch.rf = 'json';
						oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
						//oSearch.addFilter('actiontype', 'EQUAL_TO', 5);				
						oSearch.getResults(function(data) {ns1blankspace.messaging.imap.actions.search.send(oParam, data)});
					}
				}
				// default show the action (normally called from actions list)
				else if (oResponse != undefined)
				{
					if (bSetContext) {ns1blankspace.objectContextData = oResponse.data.rows[0]};
					
					if (oResponse.data.rows.length == 0)
					{
						$('#ns1blankspaceMainSummary').html('<table><tr><td class="ns1blankspaceNothing">Can\'t find the message.</td></tr></table>');
					}
					else
					{
						ns1blankspace.messaging.imap.actions.search.process(oParam);
					}
				}
			},

			recipients: function(oParam, oMessageResponse)
			{
				var iActionId = ns1blankspace.util.getParam(oParam, 'action').value;
				var aFrom = [];
				var aTo = [];
				var aCC = [];
				var aBCC = [];

				// Find recipients
				ns1blankspace.status.working('Retrieving email detail..');
				var oSearch = new AdvancedSearch();
				oSearch.method = 'ACTION_EMAIL_RECIPIENT_SEARCH';
				oSearch.addField('type,name,email');
				oSearch.addFilter('action', 'EQUAL_TO', iActionId);
				oSearch.rows = 50;
				oSearch.getResults(function(oResponse)
				{
					if (oResponse.status === 'OK')
					{
						ns1blankspace.objectContextData.from = '';
						ns1blankspace.objectContextData.to = '';
						ns1blankspace.objectContextData.cc = '';
						ns1blankspace.objectContextData.bcc = '';

						var aTo = [];
						var aCC = [];
						var aBCC = [];
						
						$.each(oResponse.data.rows, function(index)
						{	
							if (this.type == 1) {ns1blankspace.objectContextData.from = this.email; ns1blankspace.objectContextData.fromname = this.name;}
							if (this.type == 2) {aTo.push(this.name + '|' + this.email); }
							if (this.type == 3) {aCC.push(this.name + '|' + this.email)}
							if (this.type == 4) {aBCC.push(this.name + '|' + this.email)}
						});

						ns1blankspace.objectContextData.to = aTo.join('#');
						ns1blankspace.objectContextData.cc = aCC.join('#');
						ns1blankspace.objectContextData.bcc = aBCC.join('#');

						ns1blankspace.messaging.imap.actions.search.attachments(oParam, oMessageResponse);
					}
					else
					{
						ns1blankspace.status.error('Cannot find recipients: ' + oResponse.error.errornotes);
					}
				});
			},

			attachments: 	function (oParam, oMessageResponse)
			{
				var fFunctionShow = ns1blankspace.util.getParam(oParam, 'functionShow', {'default': ns1blankspace.messaging.imap.actions.search.process}).value;
				var aAttachments = [];

				var oSearch = new AdvancedSearch();
				oSearch.method = 'CORE_ATTACHMENT_SEARCH';
				oSearch.addField('filename,attachment,download');
				oSearch.addFilter('object', 'EQUAL_TO', 17);
				oSearch.addFilter('objectcontext', 'EQUAL_TO', oParam.action);
				oSearch.getResults(function(oResponse) 
				{
					ns1blankspace.objectContextData.attachments = '';
					ns1blankspace.objectContextData.hasattachments = 'N';

					if (oResponse.status === 'OK')
					{
						if (oResponse.data.rows.length > 0)
						{
							ns1blankspace.objectContextData.hasattachments = 'Y';

							$.each(oResponse.data.rows, function (i, v)
							{
								aAttachments.push(v.filename + '|' + v.download);
							});

							ns1blankspace.objectContextData.attachments = aAttachments.join('#');
						}

						ns1blankspace.status.clear();

						// We now have all the details so let's call the function to show the action as an email
						fFunctionShow(oParam, oMessageResponse);
					}
					else
					{
						ns1blankspace.status.error('Error finding attachments: ' + oResponse.error.errornotes);
					}
				});
			},
								
			process:		function (oParam)
			{	
				var aHTML = [];
				
				var sXHTMLElementID;
				var sTargetXHTMLElementID = 'ns1blankspaceMainSummary';
				var bReply = false;
				var bDraft = ns1blankspace.util.getParam(oParam, 'draft', {'default': false}).value;

				if (oParam != undefined)
				{
					if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					if (oParam.targetXHTMLElementID != undefined) {sTargetXHTMLElementID = oParam.targetXHTMLElementID}
					if (oParam.setContext != undefined) {bSetContext = oParam.setContext}
				}	
				
				ns1blankspace.messaging.imap.layout(oParam);

				// v2.0.6 If current account hasn't been defined, do it here based on from or to
				if (ns1blankspace.messaging.imap.account === undefined)
				{
					var sSource = (ns1blankspace.objectContextData.actiontype === '5') ? ns1blankspace.objectContextData.from : ns1blankspace.objectContextData.to;
					if (sSource)
					{
						$.each(sSource.split('#'), function()
						{
							var sEmail = this.split('|').pop();
							var aAccounts = $.map($.grep(ns1blankspace.messaging.imap.emailAccounts, function(x) {return x.email == sEmail}), function(y) {return y.id});
							if (aAccounts && aAccounts.length > 0)
							{
								ns1blankspace.messaging.imap.account = aAccounts.shift();
								return false;
							}
						});
					}
				}
				
				ns1blankspace.objectContextData.sourcetypetext = 'ACTION';
										
				if (bReply || bDraft)
				{
					// v2.0.6 Now checks to see if already editing
					if ($('#ns1blankspaceMainEdit').attr('data-objectcontext') != undefined)
					{
						oParam.functionDiscard = ns1blankspace.messaging.imap.message.edit.show;
						ns1blankspace.messaging.imap.inbox.checkForEditing(oParam);
					}
					else
					{	
						ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});
						ns1blankspace.messaging.imap.message.edit.show(oParam)
					}
				}
				else
				{
					ns1blankspace.messaging.imap.summary();
				}	
			}
		}
	},

	stopAutoCheck: function ()
	{	
		clearInterval(ns1blankspace.timer.messaging);
		ns1blankspace.messaging.autoCheck = false
	}			
}								