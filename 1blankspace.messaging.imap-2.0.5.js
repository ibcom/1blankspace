
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
				columns: 'reference,sentdate,contactbusinesstext',
				methodFilter: 'reference-TEXT_IS_LIKE|contactbusinesstext-TEXT_IS_LIKE'
			},
			{
				id: 2,
				caption: 'Expense',
				method: 'FINANCIAL_EXPENSE_SEARCH',
				columns: 'reference,sentdate,contactbusinesstext',
				methodFilter: 'reference-TEXT_IS_LIKE|contactbusinesstext-TEXT_IS_LIKE'
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
			}
		]
	},

	init: 		function (oParam)
	{
		var bShowHome = true
		
		if (oParam != undefined)
		{
			if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
		}

		ns1blankspace.app.reset();

		ns1blankspace.object = 39;
		ns1blankspace.objectParentName = 'messaging';
		ns1blankspace.objectName = 'imap';
		ns1blankspace.viewName = 'Email';
		
		ns1blankspace.messaging.autoCheck = true;
		ns1blankspace.messaging.fullRefresh = false;
		ns1blankspace.messaging.imap.emailAccounts = [];
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
		ns1blankspace.messaging.imap.data.fromEmail = ns1blankspace.user.email;

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

			if (ns1blankspace.messaging.imap.emailAccount.folders == undefined)
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

						$.each(ns1blankspace.messaging.imap.emailAccount.folders, function (i, v)
						{
							if ($.grep(ns1blankspace.messaging.imap.folders.data.names.deleted, function(a) {return a == v.title}).length != 0)
							{
								ns1blankspace.messaging.imap.emailAccount.deletedFolder = v.id;
							}

							if ($.grep(ns1blankspace.messaging.imap.folders.data.names.archived, function(a) {return a == v.title}).length != 0)
							{
								ns1blankspace.messaging.imap.emailAccount.archivedFolder = v.id;
							}

							if ($.grep(ns1blankspace.messaging.imap.folders.data.names.inbox, function(a) {return a == v.title}).length != 0)
							{
								ns1blankspace.messaging.imap.emailAccount.inboxFolder = v.id;
							}
						});

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
						
					$.ajax(
					{
						type: 'POST',
						url: '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_CHECK',
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


	check:		function (oParam, oResponse)
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
					ns1blankspace.status.message('Checking for new emails...', {timeout: false});
				}	

				$.ajax(
				{
					type: 'POST',
					url: '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_CHECK',
					data: oData,
					dataType: 'json',
					success: function(data) {ns1blankspace.messaging.imap.check(oParam, data)}
				});
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
		}

		$('#ns1blankspaceMessagingIMAPInboxCheck').button(
		{
			disabled: ns1blankspace.messaging.checking
		});
	},	


	home:		function (oParam, oResponse)
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
				oSearch.addField('type,port,sslport,email,title,footer');
				oSearch.addFilter('type', 'EQUAL_TO', '5');
				//oSearch.addFilter('user', 'EQUAL_TO', ns1blankspace.user.id);
				oSearch.addCustomOption('hasaccess', 'Y');
				oSearch.getResults(function(data) {ns1blankspace.messaging.imap.home(oParam, data)});
			}
			else
			{
				var aHTML = [];
							
				aHTML.push('<table>');
				aHTML.push('<tr><td><div id="ns1blankspaceViewMessagingEmailLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');
				aHTML.push('</table>');		
				
				ns1blankspace.messaging.imap.emailAccounts.length = 0;
				ns1blankspace.messaging.imap.account = ns1blankspace.messaging.imap.data.defaultAccount;

				if (oResponse.data.rows.length != 0)
				{
					aHTML.push('<table style="padding-top:0px; padding-bottom:5px; border-left-width:10px; border-left-style:solid; border-left-color:transparent;" id="ns1blankspaceMessagingIMAPAccounts" class="ns1blankspaceControl">');
					
					$.each(oResponse.data.rows, function(index)
					{
						if (this.type == 5)
						{	
							ns1blankspace.messaging.imap.emailAccounts.push(
							{
								id: this.id,
								footer: (this.footer).formatXHTML(),
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
											'class="ns1blankspaceControl"' +
											' title="' + this.email + '"><div style="float:left; position:relative; top:3px;"></div>' +
											sDescription +
											'<br /><span class="ns1blankspaceSubNote">' + aDescription[1] + '</span>' + 
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

					//aHTML.push('<tr><td id="ns1blankspaceMessaging-Drafts" ' +
					//					'class="ns1blankspaceControl">' +
					//					'Drafts</td></tr>');

					aHTML.push('<tr><td id="ns1blankspaceMessaging-Sent" ' +
										'class="ns1blankspaceControl">' +
										'Sent Emails</td></tr>');

					aHTML.push('</table>');
					
					aHTML.push('<div id="ns1blankspaceMessagingMessageControlContainer"></div>');
				}
				else
				{
					aHTML.push('<table><tr><td class="ns1blankspaceNothing">No accounts set up.</td></tr></table>');
				}
				
				$('#ns1blankspaceControl').html(aHTML.join(''));	
			
				$('td.ns1blankspaceControl').click(function(event)
				{
					var sID = this.id
					var aID = sID.split('-');

					if (aID[1] == 'Sent')
					{	
						ns1blankspace.show({selector: '#ns1blankspaceMainActionsSent'});
						ns1blankspace.messaging.imap.actions.show({xhtmlElementID: 'ns1blankspaceMainActionsSent', type: 5});
					}

					else if (aID[1] == 'Drafts')
					{	
						ns1blankspace.show({selector: '#ns1blankspaceMainDrafts'});
						ns1blankspace.messaging.imap.actions.show({xhtmlElementID: 'ns1blankspaceMainDrafts', type: 5});
					}
					
					else
					{	
						ns1blankspace.show({selector: '#ns1blankspaceMainInbox'});
						$('.ns1blankspaceInboxMarker').removeClass('ns1blankspaceInboxMarker ui-icon ui-icon-mail-closed');
						$(this).children('div').addClass('ns1blankspaceInboxMarker ui-icon ui-icon-mail-closed');

						ns1blankspace.app.context({inContext: false, action: true, actionOptions: true});

						if (ns1blankspace.messaging.imap.account != aID[1])
						{
							ns1blankspace.messaging.imap.data.fromEmail = $(this).attr('title');

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
	},

	inbox: 		
	{				
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

				if (bDeleted) {oSearch.addFilter('folder', 'EQUAL_TO', ns1blankspace.messaging.imap.emailAccount.deletedFolder)}
				
				oSearch.addSummaryField('count(*) cachecount');
				oSearch.sort('date', 'desc')
				oSearch.rows = ns1blankspace.messaging.defaultRows;
				oSearch.getResults(function(data) {ns1blankspace.messaging.imap.inbox.show(oParam, data)});
			}
			else
			{
				//ns1blankspace.status.message('Refreshed @ ' + Date.now().toString("h:mm tt"));

				ns1blankspace.messaging.emailCount = oResponse.summary.cachecount;
					
				if (bRebuild)
				{
					ns1blankspace.status.message('Checking for new emails...', {timeout: false});
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
			
			aHTML.push('<tr id="ns1blankspaceMessagingInbox_id-' + sID + '" class="ns1blankspaceRow' + sClass + '" data-cached="' + oRow.detailscached + '">');
			
			aHTML.push('<td id="ns1blankspaceMessagingInbox_from-' + sID + 
								'" style="cursor: pointer;" class="ns1blankspaceRow ns1blankspaceRowSelect' + sClass + '"' +
								' title="' + oRow.from + '" style="padding-right:5px;" data-cached="' + oRow.detailscached + '">' +
								oRow.fromname + '</td>');
								
			aHTML.push('<td id="ns1blankspaceMessagingInbox_subject-' + sID + 
								'" style="cursor: pointer; padding-right:5px;" class="ns1blankspaceRow ns1blankspaceMainRowSelect' + sClass + '">' +
								oRow.subject + '</td>');
			
			aHTML.push('<td id="ns1blankspaceMessagingInbox_date-' + sID + '" class="ns1blankspaceRow" style="width:85px; text-align:right;" >' +
									sDate + '<br /><span class="ns1blankspaceSub">' + sTime + '</span></td>');
			
			aHTML.push('<td class="ns1blankspaceRow" style="width:70px;text-align:right;">');

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
			
			aHTML.push('</td></tr>');
			
			return aHTML.join('');
		},

		bind:		function (oParam)
		{
			var sXHTMLContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlContainerID', {"default": 'ns1blankspaceRenderPage_IMAPInbox-0'}).value;

			$('#' + sXHTMLContainerID + ' td.ns1blankspaceRowSelect').click(function()
			{
				$('td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
				$('#' + this.id).parent().find('td').removeClass('ns1blankspaceNotSeen');
				ns1blankspace.messaging.imap.search.send(this.id);
			});
				
			$('#' + sXHTMLContainerID + ' span.ns1blankspaceRowRemove').button(
			{
				text: false,
				label: "Delete",
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
				label: "Reply",
				icons:
				{
					 primary: "ui-icon-arrowreturnthick-1-w"
				}
			})
			.click(function()
			{
				$('td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
				$('#' + this.id).parent().find('td').removeClass('ns1blankspaceBold');
				ns1blankspace.messaging.imap.search.send(this.id, {reply: true});
			})
			.css('width', '15px')
			.css('height', '20px');
				
			$('#' + sXHTMLContainerID + ' span.ns1blankspaceRowSave').button({
				text: false,
				label: "Save, Reply All, Forward",
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
		},

		remove: 	function (sXHTMLElementID, oParam)
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
					destinationFolder: ns1blankspace.messaging.imap.emailAccount[(bArchive?'archivedFolder':'deletedFolder')]
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
							if (ns1blankspace.messaging.showRemoved)
							{
								$('#' + sXHTMLElementID).button({disabled: true});
							}
							else
							{
								$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
							}
						}

						ns1blankspace.status.message('');
					}
				});

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

		markAsRead: function (sXHTMLElementID)
		{
			var aSearch = sXHTMLElementID.split('-');
			var sElementID = aSearch[0];
			var sSearchContext = aSearch[1];
			
			$('#ns1blankspaceControlDelete').html('Delete');

			$('#ns1blankspaceControlDelete').click(function(event)
			{
				ns1blankspace.messaging.imap.message.remove();
			});

			if ($('#' + sXHTMLElementID).parent().hasClass('ns1blankspaceNotSeen'))	
			{			
				$('#' + sXHTMLElementID).parent().removeClass('ns1blankspaceNotSeen');
				$('#' + sXHTMLElementID).parent().children().removeClass('ns1blankspaceNotSeen')

				var oData =
				{
					flags: '(\\SEEN)',
					account: ns1blankspace.messaging.imap.account,
					id: sSearchContext
				}	
						
				$.ajax(
				{
					type: 'POST',
					url: '/rpc/messaging/?method=MESSAGING_EMAIL_CACHE_MANAGE',
					data: oData,
					dataType: 'json',
					success: function(data)
					{
						ns1blankspace.messaging.emailRead.push(sSearchContext);
					}
				});
			}		
		},

		save: 		
		{
			show:		function (oParam)
			{
				var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
				var sCacheID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
				var bInbox = ns1blankspace.util.getParam(oParam, 'inbox', {"default": true}).value;
				var iLeftOffset = ns1blankspace.util.getParam(oParam, 'leftOffset', {"default": -290}).value;
				var iTopOffset = ns1blankspace.util.getParam(oParam, 'topOffset', {"default": 4}).value;
				
				$(ns1blankspace.xhtml.container).attr('data-initiator', sXHTMLElementID)
							
				ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: iLeftOffset, topOffset: iTopOffset});
				
				var aHTML = [];
					
				aHTML.push('<table id="ns1blankspaceMessageSaveContainer" class="ns1blankspaceDropDown" style="width:320px; margin-top:0px">');

				if (bInbox)
				{	
					aHTML.push('<tr><td style="text-align:right; padding-bottom:10px; border-bottom-style:solid; border-width: 1px; border-color:#D0D0D0;" colspan=2 id="ns1blankspaceMessageContainerColumn1">' +
								'<div style="margin-right:4px;" id="ns1blankspaceMessageMarkAsRead" class="ns1blankspaceAction">Mark as Read</div>' +
								'<div style="margin-right:4px;" id="ns1blankspaceMessageReplyAll" class="ns1blankspaceAction">Reply All</div>' +
								'<div style="margin-right:4px;" id="ns1blankspaceMessageForward" class="ns1blankspaceAction">Forward</div>' +
								'</td></tr>');
				}

				aHTML.push('<tr><td id="ns1blankspaceMessageSaveContainerColumn1"></td>' +
								'<td id="ns1blankspaceMessageSaveContainerColumn2" style="width:75px;"></td></tr>' +
								'</table>');					
			
				$(ns1blankspace.xhtml.container).html(aHTML.join(''))

				$('#ns1blankspaceMessageMarkAsRead').button(
				{
					label: 'Mark as read'
				})
				.click(function()
				{
					ns1blankspace.app.options.hide();
					sXHTMLElementID = sXHTMLElementID.replace('_save', '_from');
					ns1blankspace.messaging.imap.inbox.markAsRead(sXHTMLElementID);
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
					ns1blankspace.app.options.hide();
					$('td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
					$('#' + sXHTMLElementID).parent().find('td').removeClass('ns1blankspaceBold');
					ns1blankspace.messaging.imap.search.send(sXHTMLElementID, {replyAll: true});
					
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
					ns1blankspace.app.options.hide();
					$('td.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
					$('#' + sXHTMLElementID).parent().find('td').removeClass('ns1blankspaceBold');
					ns1blankspace.messaging.imap.search.send(sXHTMLElementID, {forward: true});
				});

				var aHTML = [];
					
				aHTML.push('<table>');
				
				aHTML.push('<tr><td class="ns1blankspaceAction">' +
								'<input type="checkbox" checked="checked" id="ns1blankspaceMessageSaveContacts" /> Create contacts' +
								'</td></tr>');

				aHTML.push('<tr><td class="ns1blankspaceAction">' +
								'<input type="checkbox" checked="checked" id="ns1blankspaceMessageSaveAttachments" /> Save attachments' +
								'</td></tr>');

				aHTML.push('<tr><td class="ns1blankspaceAction">' +
								'<input type="checkbox" id="ns1blankspaceMessageSavePrivate" /> Set as private' +
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

				aHTML.push('<tr><td style="padding-left:20px;">' +
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

				$('#ns1blankspaceMessageSave').button(
				{
					label: 'Save'
				})
				.click(function()
				{
					ns1blankspace.status.working('Saving...');
					$(ns1blankspace.xhtml.container).hide();
					ns1blankspace.messaging.imap.inbox.save.send(oParam);
					ns1blankspace.show({selector: '#ns1blankspaceMainInbox'});
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
					}
					else
					{
						if (aSearchFilters && aSearchFilters.length > 0)
						{
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

			send:		function (oParam)
			{
				var sCacheID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
				var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;
				var bInbox = ns1blankspace.util.getParam(oParam, 'inbox', {"default": true}).value;

				$('#' + sXHTMLElementID).parent().parent().css('opacity', '0.5');
				$('#' + sXHTMLElementID).parent().parent().children().removeClass('ns1blankspaceRowSelect');

				var oData =
				{
					account: ns1blankspace.messaging.imap.account,
					id: sCacheID,
					autocreatecontacts: ($('#ns1blankspaceMessageSaveContacts').prop('checked')?'Y':'N'),
					saveattachments: ($('#ns1blankspaceMessageSaveAttachments').prop('checked')?'Y':'N'),
					private: ($('#ns1blankspaceMessageSavePrivate').prop('checked')?'Y':'N')
				}

				if ($('#ns1blankspaceMessageSaveObject').prop('checked'))
				{
					oData.object = $('#ns1blankspaceMessageSaveObjectContext').attr('data-object');
					oData.objectContext = $('#ns1blankspaceMessageSaveObjectContext').attr('data-id');
				}
				
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_CACHE_ACTION_CREATE'),
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

								sXHTMLElementID = 'ns1blankspaceMessagingInbox_save-' + sCacheID;
								oParam = ns1blankspace.util.setParam(oParam, 'confirmed', true);
								oParam = ns1blankspace.util.setParam(oParam, 'archive', true);
								ns1blankspace.messaging.imap.inbox.remove(sXHTMLElementID, oParam);
							}
							else
							{	
								oParam.action = data.action;
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
		send:		function (sXHTMLElementID, oParam)
		{
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
					oSearch.addField('subject');
					oSearch.addFilter('account', 'EQUAL_TO', iAccount);
					oSearch.addFilter('subject', 'TEXT_IS_LIKE', sSearchText);

					ns1blankspace.search.advanced.addFilters(oSearch);

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
				aHTML.push('<table class="ns1blankspaceSearchMedium">');
					
				$.each(oResponse.data.rows, function()
				{
					aHTML.push('<tr class="ns1blankspaceSearch">');
					aHTML.push('<td class="ns1blankspaceSearch" id="' +
									'-' + this.id + '">' +
									this.subject + '</td>');
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
			//ns1blankspace.messaging.imap.summary();
		});

		$('#ns1blankspaceControlReply').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});

			var bShow = true;

			if ($('#ns1blankspaceMainEdit').attr('data-objectcontext') != undefined)
			{
				bShow = confirm('You are currently editing a message.  Do you want to replace it with this message instead?')
			}	

			if (bShow)
			{	
				ns1blankspace.messaging.imap.message.edit.show({reply: true});
			}	
		});
		
		$('#ns1blankspaceControlReplyAll').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});

			var bShow = true;

			if ($('#ns1blankspaceMainEdit').attr('data-objectcontext') != undefined)
			{
				bShow = confirm('You are currently editing a message.  Do you want to replace it with this message instead?')
			}	

			if (bShow)
			{	
				ns1blankspace.messaging.imap.message.edit.show({replyAll: true});
			}
		});

		$('#ns1blankspaceControlForward').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});

			var bShow = true;

			if ($('#ns1blankspaceMainEdit').attr('data-objectcontext') != undefined)
			{
				bShow = confirm('You are currently editing a message.  Do you want to replace it with this message instead?')
			}	

			if (bShow)
			{	
				ns1blankspace.messaging.imap.message.edit.show({forward: true});
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

	show: 		function (oParam, oResponse)
	{
		var bReply = ns1blankspace.util.getParam(oParam, 'reply', {"default": false}).value;
		var bReplyAll = ns1blankspace.util.getParam(oParam, 'replyAll', {"default": false}).value;
		var bForward = ns1blankspace.util.getParam(oParam, 'forward', {"default": false}).value;
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
			ns1blankspace.objectContextData.sourcetypetext = 'EMAIL'; //*ACTION
									
			if (bReply || bReplyAll || bForward)
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

		var aHTML = [];
		
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

			var oDate = Date.parse(ns1blankspace.objectContextData.date);

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
				
			aHTML.push('<table id="ns1blankspaceMessagingEmailAttachmentsContainer" class="ns1blankspaceHeader" style="margin-bottom:13px;border-style: solid;border-width:0px 0px 1px 0px;border-color: #f3f3f3;>');
			aHTML.push('<tr class="ns1blankspaceHeader">' +
									'<td style="width:20px; background-color:#ffffff;padding:4px; ">&nbsp;</td>' +
									'<td id="ns1blankspaceMessagingEmailAttachments" style="padding:4px; font-size: 0.875em;"></td></tr>');
			aHTML.push('</table>');
			
			aHTML.push(ns1blankspace.xhtml.loading);
			
			aHTML.push('<div class="ns1blankspaceMessageContainer" id="ns1blankspaceMessageFrameContainer"><iframe class="ns1blankspaceMessageContainer" name="ifMessage" ' +
								'id="ifMessage" frameborder="0" border="0" scrolling="no"></iframe></div>');
							
			//$('div.ns1blankspaceMessageContainer').remove();
							
			$('#ns1blankspaceMainSummary').html(aHTML.join(''));

			if (ns1blankspace.objectContextData.sourcetypetext == 'EMAIL')
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
						ns1blankspace.messaging.imap.inbox.save.show(
						{
							inbox: false,
							leftOffset: -302,
							topOffset: 11,
							xhtmlElementID: this.id,
							messageID: ns1blankspace.objectContextData.messageid
						});
					}	
				})
				.css('width', '15px')
				.css('height', '20px');
			}	
			
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
						var oSearch = new AdvancedSearch();
						oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
						oSearch.addField('messageid,to,cc,from,fromname,subject,date,' +
											'message,hasattachments,attachments,imapflags,detailscached');
						oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.imap.account);
						oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
						oSearch.getResults(function(oResponse) 
							{
								ns1blankspace.objectContextData = oResponse.data.rows[0];
								ns1blankspace.objectContextData.sourcetypetext = 'EMAIL';
								ns1blankspace.messaging.imap.message.attachments();
								ns1blankspace.messaging.imap.message.contents.show();
							});

						ns1blankspace.messaging.imap.inbox.markAsRead('ns1blankspaceMessagingInbox_from-' + ns1blankspace.objectContext);		
					}
				});
			}	
		}	
	},

	message: 	
	{
		contents: 	{
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
												$('#ifMessage').height($('#ifMessage', top.document).contents().find('html').height());
												$('#ifMessage').width($('#ifMessage', top.document).contents().find('html').width());

												$('#ns1blankspaceMessageFrameContainer').height($('#ifMessage', top.document).contents().find('html').height());
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

		attachments:
					function ()
					{
						if (ns1blankspace.objectContextData.hasattachments == 'Y')
						{
							var aHTML = [];
							
							var sAttachments = ns1blankspace.objectContextData.attachments;
							
							if (sAttachments != 'undefined')
							{	
								if (sAttachments.indexOf("/download/") == -1)
								{					
									var aAttachments = sAttachments.split('#')
									sAttachments = '';
								
									$.each(aAttachments, function(iIndex) 
									{
										var aAttachment = this.split('|');
										
										var sLink = ns1blankspace.util.endpointURI('MESSAGING_EMAIL_ATTACHMENT_DOWNLOAD');
										sLink += '&attachmentindex=' + (iIndex);
										sLink += '&account=' + ns1blankspace.util.fs(ns1blankspace.messaging.imap.account);
										sLink += '&messageid=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.messageid);
										
										sAttachments +=	'<a href="' + sLink + '" target="_blank">' + aAttachment[0] + '</a>; ';
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
										sAttachments +=	'<a href="' + aAttachment[1] + '" target="_blank">' + aAttachment[0] + '</a>; ';
									});	
													
									aHTML.push(sAttachments);
								}
							}
						
							$('#ns1blankspaceMessagingEmailAttachments').html(aHTML.join());
						}
						else
						{
							$('#ns1blankspaceMessagingEmailAttachments').html('<span class="ns1blankspaceSub">No attachments</span>');
						}
					},
									
		edit: 		{
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
										var bForward = false;
										var bNewEmail = false;
										var sMessage = '';
										var sSubject = '';
										var iSource = 1;
										var iContactPersonTo;
										var sEmailTo;
										
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
											if (oParam.forward != undefined) {bForward = oParam.forward}
											if (oParam.newEmail != undefined) {bNewEmail = oParam.newEmail}
											if (oParam.message != undefined) {sMessage = oParam.message}
											if (oParam.subject != undefined) {sSubject = oParam.subject}
											if (oParam.contactPersonTo != undefined) {iContactPersonTo = oParam.contactPersonTo}
											if (oParam.source != undefined) {iSource = oParam.source}
											if (oParam.emailTo != undefined) {sEmailTo = oParam.emailTo}	
										}

										if (bNewEmail)
										{
											ns1blankspace.objectContext = '';
											ns1blankspace.objectContextData = undefined;
		
											$.ajax(
											{
												type: 'POST',
												url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_DRAFT') + '&new=1',
												dataType: 'json',
												async: false
											});
										}
										
										$('td.ns1blankspaceMessageSelect').not('td.ns1blankspaceHighlight').remove();

										$('#ns1blankspaceMainEdit').attr('data-objectcontext', ns1blankspace.objectContext);

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
										.click(function() {
										
											if (oParam === undefined)
											{
												oParam = {};
											}

											oParam.subject = $('#ns1blankspaceMessagingEditMessageSubject').not('.ns1blankspaceWatermark').val();
											oParam.message = tinyMCE.get('ns1blankspaceMessagingEditMessageText' + ns1blankspace.counter.editor).getContent();
											oParam.contactPersonTo = $('#ns1blankspaceEditMessageTo').attr('data-id');
											oParam.to = $('#ns1blankspaceEditMessageTo').val();
											oParam.cc = $('#ns1blankspaceEditMessageCc').val();
											oParam.bcc = $('#ns1blankspaceEditMessageBcc').val();
											
											ns1blankspace.messaging.imap.message.send(oParam);
										});

										$('#ns1blankspaceViewControlAction').button({disabled: false});

										var aHTML = [];
										
										aHTML.push('<table>');
										
										if (bShowTo)
										{
											aHTML.push('<tr><td class="ns1blankspace">');
											
												aHTML.push('<table class="ns1blankspace">');
										
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

													aHTML.push('></td></tr>');				

													aHTML.push('<tr><td style="padding:0px; padding-top:1px;">' +
																'<textarea id="ns1blankspaceEditMessageTo" style="height:65px; width:249px;" rows="3" cols="20" class="ns1blankspaceTextMulti"></textarea>' +
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
																'</td></tr>');

													aHTML.push('</table></div>');

													aHTML.push('<div id="ns1blankspaceRecipientTypeContainer-Bcc" style="display:none;" class="ns1blankspaceRecipientTypeContainer">');

													aHTML.push('<table cellpadding=0 class="ns1blankspace">');
												
													aHTML.push('<tr><td style="padding:0px;">' +
																'<input id="ns1blankspaceEditMessageBccContact" class="ns1blankspaceSelectContactEmail ns1blankspaceWatermark ns1blankspaceText"' +
																	' data-setelementid="ns1blankspaceEditMessageBcc" value="search for contact" style="width:250px; margin-bottom:1px; padding-top:3px; margin-top:0px;"');
																
													if (iContactBusiness != undefined)
													{
														aHTML.push(' data-contactbusiness="' + iContactBusiness + '"');
													}

													aHTML.push('></td></tr>');				

													aHTML.push('<tr><td style="padding:0px; padding-top:1px;">' +
																'<textarea id="ns1blankspaceEditMessageBcc" style="height:65px; width:249px;" rows="3" cols="20" class="ns1blankspaceTextMulti"></textarea>' +
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
																
												aHTML.push('<tr><td class="ns1blankspace" style="padding-left:0px; padding-right:6px;">' +
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
										.click(function() {
										
											ns1blankspace.messaging.imap.message.edit.attach.show(oParam);
										})
										.css('width', '20px')
										.css('height', '23px')
										.css('font-size', '0.75em');
											
										if (ns1blankspace.objectContextData != undefined && iSource == 1)
										{
											var sTo = '';
										
											var aHTML = [];

											aHTML.push('<br />');
													
											if (ns1blankspace.objectContextData != undefined)
											{
												ns1blankspace.messaging.imap.message.edit.contents(oParam);

												var sSubject = (ns1blankspace.objectContextData.subject).formatXHTML();		

												if (bForward)
												{
													if (sSubject.toLowerCase().indexOf('fw:') == -1) {sSubject = 'Fw: ' + sSubject}
													$('#ns1blankspaceMessagingEditMessageSubject').val(sSubject)
												}
												else
												{
													if (sSubject.toLowerCase().indexOf('re:') == -1) {sSubject = 'Re: ' + sSubject}
													$('#ns1blankspaceMessagingEditMessageSubject').val(sSubject)
												}	
												
												$('#ns1blankspaceMessagingEditMessageSubject').removeClass('ns1blankspaceWatermark');
												
												if (bForward)
												{
													ns1blankspace.objectContextData.to = '';
													$('#ns1blankspaceEditMessageTo').val('');
												}
												else	
												{
													if (ns1blankspace.objectContextData.from != '')
													{
														var sFrom = ns1blankspace.objectContextData.from;
													}
										
													if (ns1blankspace.objectContextData.to != '' && bReplyAll)
													{		
														var aToDetails;
														var sToEmail;	

														sTo = ns1blankspace.objectContextData.to;
														var aTo = sTo.split('#');
														sTo = '';
													
														$.each(aTo, function(i)
														{
															aToDetails = (this).split('|');
															sToEmail = aToDetails[1];
															
															if (sToEmail != ns1blankspace.messaging.imap.data.fromEmail && sToEmail != sFrom)
															{	
																sTo += sToEmail + '; ';
															}
																	
														});	
													}
										
													sTo = sFrom + '; ' + sTo;
												}	
										
												$('#ns1blankspaceEditMessageTo').val(sTo)
									
												if (ns1blankspace.objectContextData.attachments != '' && bForward && ns1blankspace.messaging.action == -1)
												{
													if (ns1blankspace.objectContextData.sourcetypetext == "EMAIL")
													{
														var sParam = ns1blankspace.util.endpointURI('MESSAGING_EMAIL_ATTACHMENT_MANAGE') + '&rf=TEXT&new=1';
														var sData = 'account=' + ns1blankspace.messaging.imap.account;
														sData += '&id=' + ns1blankspace.util.fs(ns1blankspace.objectContextData.messageid);
														
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
																ns1blankspace.messaging.imap.message.edit.attach.process();
															}
														});
													}
													
													if (ns1blankspace.objectContextData.sourcetypetext == "ACTION")
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
													ns1blankspace.messaging.imap.message.edit.attach.process();
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
													var oSearch = new AdvancedSearch();
													oSearch.method = 'MESSAGING_EMAIL_CACHE_SEARCH';
													oSearch.addField('messageid,to,cc,from,fromname,subject,date,' +
																		'message,hasattachments,attachments,imapflags,detailscached');
													oSearch.addFilter('account', 'EQUAL_TO', ns1blankspace.messaging.imap.account);
													oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.objectContext);
													oSearch.rows = 1;
													oSearch.getResults(function(oResponse)
													{
														ns1blankspace.objectContextData = oResponse.data.rows[0];
														ns1blankspace.objectContextData.sourcetypetext = 'EMAIL';
														ns1blankspace.messaging.imap.message.edit.contents(oParam);
													});
												}
											});
										}	
										else
										{
											var aHTML = [];

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
											
											var oDate = new Date.parse(ns1blankspace.objectContextData.date);
											sDate = oDate.toString("ddd, dd MMM yyyy h:mm tt") 
									
											aHTML.push('<tr><td><strong>Sent:</strong> ' + sDate + '</td></tr>');	
											aHTML.push('<tr><td><strong>Subject:</strong> ' + ns1blankspace.objectContextData.subject + '</td></tr>');	
											aHTML.push('</table>');
											
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

						attach: 	{
										show:		function (oParam, oResponse)
													{
														sXHTMLElementID = "ns1blankspaceEditMessageAttach";
														
														if (!$('#ns1blankspaceEditMessageAttach').attr('checked'))
														{
															$(ns1blankspace.xhtml.container).hide()
														}
														else
														{	
															if (oResponse == undefined)
															{					
																$.ajax(
																{
																	type: 'POST',
																	url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_DRAFT'),
																	dataType: 'json',
																	success: function(data) 
																	{
																		ns1blankspace.messaging.imap.message.edit.attach.show(oParam, data)
																	}
																});
															}
															else
															{															
																var aHTML = [];
																
																ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID, leftOffset: 28, topOffset: -36})
															
																ns1blankspace.messaging.action = oResponse.id;
															
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
																						objectContext: oResponse.id,
																						label: '',
																						showUpload: true,
																						maxFiles: 5
																					}));
																				
																aHTML.push('<div class="ns1blankspaceSubNote">If you need to send more files; upload these files and then attach more.</div>');

																aHTML.push('</div>');

																aHTML.push('<div id="ns1blankspaceMessageEditAttach-existing" class="ns1blankspaceMessageEditAttach">');

																aHTML.push('<tr class="ns1blankspace">' +
																				'<td class="ns1blankspaceRadio">' +
																				'<input type="checkbox" id="ns1blankspaceMessageEditAttachObject" />' +
																				'<select id="ns1blankspaceMessageEditAttachObjectValue" style="width:138px;">');

																$.each(ns1blankspace.messaging.imap.data.objects, function(i, v)
																{
																	aHTML.push('<option value="' + v.id + '" data-method="' + v.method + '"' +
																				(v.columns?' data-columns="' + v.columns + '"':'') +
																				(v.methodFilter?' data-methodfilter="' + v.methodFilter + '"':'') + '>' +
																				v.caption + '</option>');
																});
																			
																aHTML.push('</select>' +
																				'</td></tr>');

																aHTML.push('<tr><td style="padding-left:20px;">' +
																				'<input id="ns1blankspaceMessageEditAttachObjectContext" style="padding:3px;">' +
																				'</td></tr>');

																aHTML.push('</div>' + 
																				'</td></tr>');

																aHTML.push('<tr><td class="ns1blankspaceSubNote">If you need to send more files; upload these files and then attach more.</td></tr>');

																aHTML.push('</table>');			

																$(ns1blankspace.xhtml.container).html(aHTML.join(''));
																
																$('#ns1blankspaceUpload').button(
																{
																	label: "Upload"
																})
																.click(function()
																{
																	 ns1blankspace.attachments.upload.process({functionPostUpdate: ns1blankspace.messaging.imap.message.edit.attach.process});
																});

																$('#ns1blankspaceAttachMethod').buttonset();

																$('#ns1blankspaceAttachMethod :radio').click(function()
																{
																	$('div.ns1blankspaceMessageEditAttach').hide();

																	var aID = (this.id).split('-');
																	
																	$('#ns1blankspaceMessageEditAttach-' + aID[1]).show();
																});
															}					
														}	
													},

										process: 	function (oParam, oResponse)
													{	
														var aHTML = [];
														
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
																var oSearch = new AdvancedSearch();
																oSearch.method = 'CORE_ATTACHMENT_SEARCH';
																oSearch.addField('filename,description,download,modifieddate,attachment');
																oSearch.addFilter('object', 'EQUAL_TO', 17);
																oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.messaging.action);
															
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

		send:		function (oParam)
					{
						var fFunctionPostSend;
						var sXHTMLElementID = 'ns1blankspaceViewControlAction';
						var bSendNow = ns1blankspace.util.getParam(oParam, 'sendNow', {"default": false}).value;;
		
						//if (oParam.object == undefined) {oParam.object = ns1blankspace.object}
						//if (oParam.objectContext == undefined) {oParam.objectContext = ns1blankspace.objectContext}
						
						if (oParam != undefined)
						{
							if (oParam.functionPostSend != undefined) {fFunctionPostSend = oParam.functionPostSend}
							if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
						}	
						
						if ($('#ns1blankspaceMainEdit:visible').length == 0)
						{
							ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});
							$('.ns1blankspaceControl').removeClass('ns1blankspaceHighlight');
							var sContext = 'Reply';
							if (ns1blankspace.util.getParam(oParam, 'replyAll', {"default": false}).value) {sContext = 'ReplyAll'}
							if (ns1blankspace.util.getParam(oParam, 'forward', {"default": false}).value) {sContext = 'Forward'}
							$('#ns1blankspaceControl' + sContext).addClass('ns1blankspaceHighlight');

							ns1blankspace.status.error('Check & press Send')
						}
						else
						{
							if (!bSendNow)
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
									else
									{
										$(ns1blankspace.xhtml.container).attr('data-initiator', sXHTMLElementID)
										ns1blankspace.container.position({xhtmlElementID: 'ns1blankspaceViewControlAction', leftOffset: -2, topOffset: 6});
			
										var aHTML = [];

										aHTML.push('<table id="ns1blankspaceMessageSaveContainer" class="ns1blankspaceDropDown" style="width:325px; margin-top:0px"><tr><td>');

										aHTML.push('<div style="margin-bottom:6px;"><table>');

										if (oParam.subject == undefined)
										{
											aHTML.push('<tr><td class="ns1blankspaceSubNote" style="padding-bottom:8px;">' +
														'As there is no subject on this email, it might get caught by a SPAM filter and never get received.</td></tr>');
										}	

										aHTML.push('<tr><td class="ns1blankspaceRadio">' +
														'<input type="checkbox" checked="checked" id="ns1blankspaceMessageSendSave" /> Save this email</td></tr>');

										aHTML.push('</table></div>');

										aHTML.push('<div id="ns1blankspaceMessageSendSaveObject"><table>');

										aHTML.push('<tr class="ns1blankspace">' +
													'<td class="ns1blankspaceRadio" style="padding-left:2px;">' +
													'<select id="ns1blankspaceMessageSendSaveObjectValue" style="width:100%;">');

										$.each(ns1blankspace.messaging.imap.data.objects, function(i, v)
										{
											aHTML.push('<option value="' + v.id + '" data-method="' + v.method + '"' +
														(v.columns?' data-columns="' + v.columns + '"':'') +
														(v.methodFilter?' data-methodfilter="' + v.methodFilter + '"':'') + '>' +
														v.caption + '</option>');
										});
													
										aHTML.push('</select>' +
													'</td></tr>');

										aHTML.push('<tr><td style="padding-left:2px;">' +
													'<input id="ns1blankspaceMessageSendSaveObjectContext" style="padding:3px; width:96%">' +
													'</td></tr>');

										aHTML.push('<tr><td style="padding-left:2px; padding-top:4px;" id="ns1blankspaceMessageSendSaveObjectContextSearch"></td></tr>');

										aHTML.push('</table></div>');

										aHTML.push('<div style="margin-top:16px; margin-bottom:6px;" id="ns1blankspaceMessageEditSendNow" class="ns1blankspaceAction">Send Now</div>');

										aHTML.push('</td></<tr></table>');

										$(ns1blankspace.xhtml.container).html(aHTML.join(''));

										$('#ns1blankspaceMessageSendSave').click(function()
										{
											$('#ns1blankspaceMessageSendSaveObject').toggle();
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

											if ($('input[name="radioMessageSendObjectContext"]:checked').length != 0)
											{
												oParam = ns1blankspace.util.setParam(oParam, 'object', $('#ns1blankspaceMessageSendSaveObjectValue').val());
												oParam = ns1blankspace.util.setParam(oParam, 'objectContext', $('input[name="radioMessageSendObjectContext"]:checked').val());
											}

											ns1blankspace.messaging.imap.message.send(oParam);
										});
									}	
								}	
							}
							else
							{	
								var oData =
								{
									subject: (oParam.subject == undefined ?'' : oParam.subject),
									message: (oParam.message == undefined ?' ' : oParam.message),
									to: (oParam.to==undefined ? '' : oParam.to),
									fromemail: ns1blankspace.messaging.imap.data.fromEmail
								}

								if (oParam.cc) {oData.cc = oParam.cc}
								if (oParam.bcc) {oData.bcc = oParam.bcc}
								if (oParam.contactPersonTo) {oData.id = oParam.contactPersonTo}	
								if (oParam.priority) {oData.priority = oParam.priority}
								if (oParam.object) {oData.saveagainstobject = oParam.object}
								if (oParam.objectContext) {oData.saveagainstobjectcontext = oParam.objectContext}
								if (oParam.save) {oData.save = (oParam.save?'Y':'N')}					

								if (oData.to == '')
								{
									ns1blankspace.status.error('No one to send to');
								}	
								else
								{	
									ns1blankspace.messaging.imap.data.lastEmail = oData;
									$('#ns1blankspaceViewControlAction').button({disabled: true});
									ns1blankspace.status.working('Sending...');
									ns1blankspace.show({selector: '#ns1blankspaceMainInbox'});

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
												ns1blankspace.status.message('Email has been sent');
												$('#ns1blankspaceMessagingMessageControlContainer').html('');
												ns1blankspace.messaging.imap.data.lastEmail = undefined;
												$('#ns1blankspaceMainEdit').html('');
												$('#ns1blankspaceMainEdit').attr('data-objectcontext', undefined); 
												
												if (fFunctionPostSend != undefined)
												{
													fFunctionPostSend()
												}
											}
											else
											{
												ns1blankspace.status.error('Email could not be sent')
											}	
										}
									});
								}
							}	
						}	
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
				}
				else
				{
					if (aSearchFilters && aSearchFilters.length > 0)
					{
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

				aHTML.push('<table class="ns1blankspace" style="font-size:0.875em;" id="ns1blankspaceMessageSendSaveObjectContextSearchResults">');
				
				$.each(oResponse.data.rows, function(i, v) 
				{ 
					var sText = '';
					$.each(aColumns, function(j, k)
					{	
						sText += '<div ' + (j!=0?'class="ns1blankspaceSub"':'') + '>' + v[k] + '</div>';
					});

					aHTML.push('<tr><td id="ns1blankspaceItem_title-' + v.id +'" class="ns1blankspaceRow" style="width:5px; margin-right:0px;">' +
									'<input type="radio" id="radioMessageSendObjectContext' + v.id + '" name="radioMessageSendObjectContext" value="' + v.id + '"/>' +
									'</td><td class="ns1blankspaceRow">' + sText + '</td></tr>');	
				});
				
				aHTML.push('</table>');

				$('#ns1blankspaceMessageSendSaveObjectContextSearch').html(aHTML.join(''))
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
						}

						ns1blankspace.status.message('Deleted');
					}
				});

			}	
		},			
	},

	save: 		
	{
		send: 		function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{			
				var sData = 'rf=TEXT';
				
				if ($('#ns1blankspaceMainEdit').html() != '')
				{
					sData += '&subject=' + ns1blankspace.util.fs($('#ns1blankspaceMessagingSendMessageSubject').val());
					sData += '&message=' + ns1blankspace.util.fs(tinyMCE.get('ns1blankspaceMessagingSendMessage').getContent()); //???
				}
				
				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('MESSAGING_EMAIL_DRAFT'),
					data: sData,
					dataType: 'text',
					success: function(data) 
					{
						ns1blankspace.messaging.imap.save.send(oParam, data)
					}
				});
				
			}
			else
			{	
				/* if (oResponse.status == 'OK')
				{
					ns1blankspaceStatus('Draft saved');
					//if (ns1blankspace.objectContext == -1) {var bNew = true}
					//ns1blankspace.objectContext = oResponse.id;	
					//if (bNew) {ns1blankspaceMessagingSearch('-' + ns1blankspace.objectContext)}
				}
				else
				{
					ns1blankspaceStatus(oResponse.error.errornotes);
					ns1blankspaceConfirm( {html: [oResponse.error.errornotes]
											   , title: 'Save error!'});
				} */
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
		
		ns1blankspace.show({selector: '#' + sXHTMLElementID});
		oParam.newEmail = true;
		ns1blankspace.messaging.imap.message.edit.show(oParam);
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
		show: 		function (oParam, oResponse)
		{
			var sXHTMLElementID = 'ns1blankspaceMainActionsSent';
			
			var iType = 5 //Email Sent

			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'ACTION_SEARCH';
				oSearch.addField('actionreference,actiontypetext,duedate,contactpersontext');
				oSearch.rf = 'json';
				oSearch.addFilter('actiontype', 'EQUAL_TO', iType);
				oSearch.addFilter('actionby', 'EQUAL_TO', ns1blankspace.user.id);
				oSearch.sort('duedate', 'desc');
				oSearch.getResults(function(data) {ns1blankspace.messaging.imap.actions.show(oParam, data)}); 
			}
			else
			{
				var aHTML = [];
					
				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<table><tr><td class="ns1blankspaceNothing">No sent email.</td></tr></table>');
				}
				else
				{
					aHTML.push('<table>');
		
					$.each(oResponse.data.rows, function() 
					{
						aHTML.push(ns1blankspace.messaging.imap.actions.row(this));
					});
		    	
					aHTML.push('</table>');

					ns1blankspace.render.page.show(
					{
						xhtmlElementID: 'ns1blankspaceMainActionsSent',
						xhtmlContext: 'ActionsSent',
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

		row: 		function (oRow)
		{
			var aHTML = [];

			aHTML.push('<tr>');

			aHTML.push('<td id="ns1blankspaceAction_subject-' + oRow.id + '" class="ns1blankspaceRow ns1blankspaceRowSelect">' +
							oRow.actionreference + '</td>');

			aHTML.push('<td id="ns1blankspaceAction_contactperson-' + oRow.id + '" class="ns1blankspaceRow">' +
							oRow.contactpersontext + '</td>');

			aHTML.push('<td id="ns1blankspaceAction_date-' + oRow.id + '" class="ns1blankspaceRow">' +
							oRow.duedate + '</td>');
			
			aHTML.push('</tr>');

			return aHTML.join('');
		},	

		bind: 		function (oParam)
		{
			var sXHTMLContainerID = ns1blankspace.util.getParam(oParam, 'xhtmlContainerID').value;

			$('#' + sXHTMLContainerID + ' td.ns1blankspaceRowSelect').click(function()
			{
				ns1blankspace.messaging.imap.actions.search.send({xhtmlElementID: this.id});
			});
		},			

		search: 	
		{				
			send:		function (oParam, oResponse)
			{
				var aHTML = [];
				var sXHTMLElementID;
				var sTargetXHTMLElementID = 'ns1blankspaceMainSummary';
				var bSetContext = true;

				if (oParam != undefined)
				{
					if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					if (oParam.targetXHTMLElementID != undefined) {sTargetXHTMLElementID = oParam.targetXHTMLElementID}
					if (oParam.setContext != undefined) {bSetContext = oParam.setContext}
				}	

				var aSearch = sXHTMLElementID.split('-');
				var sElementId = aSearch[0];
				var sSearchContext = aSearch[1];

				oParam.action = sSearchContext;
				
				if (bSetContext) {ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});};
				
				if (oResponse == undefined)
				{
					ns1blankspace.messaging.action = -1;
					
					var oSearch = new AdvancedSearch();
					oSearch.method = 'ACTION_SEARCH';
					oSearch.addField('actionreference,duedatetime,text');
					oSearch.rf = 'json';
					oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
					//oSearch.addFilter('actiontype', 'EQUAL_TO', 5);				
					oSearch.getResults(function(data) {ns1blankspace.messaging.imap.actions.search.send(oParam, data)});
				}
				else
				{
					if (bSetContext) {ns1blankspace.objectContextData = oResponse.data.rows[0]};
					
					if (oResponse.data.rows.length == 0)
					{
						$('#ns1blankspaceMainSummary').html('<table><tr><td class="ns1blankspaceNothing">Can\'t find the message.</td></tr></table>');
					}
					else
					{
						var oRow = oResponse.data.rows[0];
						
						ns1blankspace.objectContextData.id = sSearchContext;
						ns1blankspace.objectContextData.subject = oRow.actionreference;
						ns1blankspace.objectContextData.date = oRow.duedatetime;
						ns1blankspace.objectContextData.message = oRow.text;
						ns1blankspace.objectContextData.detailscached = 'Y';
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'ACTION_EMAIL_RECIPIENT_SEARCH';
						oSearch.addField('type,email,name');
						oSearch.rf = 'json';
						oSearch.addFilter('action', 'EQUAL_TO', sSearchContext);		
						oSearch.getResults(function(oResponse)
						{
							var aTo = [];
							var aCC = [];
							
							$.each(oResponse.data.rows, function(index)
							{	
								if (this.type == 1) {ns1blankspace.objectContextData.from = this.email; ns1blankspace.objectContextData.fromname = this.name;}
								if (this.type == 2) {aTo.push(this.name); aTo.push(this.email)}
								if (this.type == 3) {aCC.push(this.name); aCC.push(this.email)}
							});
							
							ns1blankspace.objectContextData.to = aTo.join('|');
							ns1blankspace.objectContextData.cc = aCC.join('|');

							ns1blankspace.messaging.imap.actions.search.attachments(oParam)
						});
					}
				}
			},

			attachments: 	function (oParam, oResponse)
			{
				if (oResponse == undefined)
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'CORE_ATTACHMENT_SEARCH';
					oSearch.addField('filename,attachment,download');
					oSearch.addFilter('object', 'EQUAL_TO', 17);
					oSearch.addFilter('objectcontext', 'EQUAL_TO', oParam.action);
					oSearch.getResults(function(data) {ns1blankspace.messaging.imap.actions.search.attachments(oParam, data)});
				}
				else
				{
					ns1blankspace.objectContextData.attachments = '';
					ns1blankspace.objectContextData.hasattachments = 'N';

					if (oResponse.data.rows.length > 0)
					{
						ns1blankspace.objectContextData.hasattachments = 'Y';

						var aAttachments = [];
						$.each(oResponse.data.rows, function (i, v)
						{
							aAttachments.push(v.filename + '|' + v.download);
						});

						ns1blankspace.objectContextData.attachments = aAttachments.join('#');
					}

					ns1blankspace.messaging.imap.actions.search.process(oParam)
				}
			},
								
			process:		function (oParam)
			{	
				var aHTML = [];
				
				var sXHTMLElementID;
				var sTargetXHTMLElementID = 'ns1blankspaceMainSummary';
				var bReply = false;

				if (oParam != undefined)
				{
					if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
					if (oParam.targetXHTMLElementID != undefined) {sTargetXHTMLElementID = oParam.targetXHTMLElementID}
					if (oParam.setContext != undefined) {bSetContext = oParam.setContext}
				}	
				
				ns1blankspace.messaging.imap.layout(oParam);
				
				ns1blankspace.objectContextData.sourcetypetext = 'ACTION';
										
				if (bReply)
				{
					ns1blankspace.show({selector: '#ns1blankspaceMainEdit'});
					ns1blankspace.messaging.imap.message.edit.show(oParam)
				}
				else
				{
					ns1blankspace.messaging.imap.summary();
				}	
			}
		}
	}				
}								