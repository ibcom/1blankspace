/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */
 
ns1blankspace.order = 
{
	init: function (oParam)
	{
		var bShowHome = true
		
		if (oParam != undefined)
		{
			if (oParam.showHome != undefined) {bShowHome = oParam.showHome}	
		}

		ns1blankspace.app.reset();

		ns1blankspace.object = 43;
		ns1blankspace.objectParentName = undefined;
		ns1blankspace.objectName = 'order';
		ns1blankspace.objectContextData = undefined;
		ns1blankspace.objectContext = -1;
		ns1blankspace.viewName = 'Orders';
		ns1blankspace.objectMethod = 'PRODUCT_ORDER';
						
		ns1blankspace.app.set(oParam);
	},

	home:		
	{
		show:	function (oResponse)
		{	
			$('#ns1blankspaceMain').html(ns1blankspace.xhtml.loading);
			$(ns1blankspace.xhtml.container).hide(ns1blankspace.option.hideSpeedOptions);

			var aHTML = [];
			
			aHTML.push('<table class="ns1blankspaceMain">');
			aHTML.push('<tr class="ns1blankspaceMain">' +
							'<td id="ns1blankspaceMostLikely" class="ins1blankspaceMain">' +
							ns1blankspace.xhtml.loading +
							'</td>' +
							'</tr>');
			aHTML.push('</table>');					
			
			$('#ns1blankspaceMain').html(aHTML.join(''));
			
			var aHTML = [];
						
			aHTML.push('<table>');

			aHTML.push('<tr><td><div id="ns1blankspaceViewOrderLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

			aHTML.push('<tr class="ns1blankspaceControl">' +
							'<td id="ns1blankspaceControlRecent" class="ns1blankspaceControl ns1blankspaceHighlight" style="padding-top:15px;">' +
							'Recent</td></tr>');			
					
			aHTML.push('<tr class="ns1blankspaceControl">' +
							'<td id="ns1blankspaceControlStatus-2" class="ns1blankspaceControl orderStatus">' +
							'To&nbsp;Be&nbsp;Submitted</td></tr>');	

			aHTML.push('<tr class="ns1blankspaceControl">' +
							'<td id="ns1blankspaceControlStatus-7" class="ns1blankspaceControl orderStatus">' +
							'Processing</td></tr>');

			aHTML.push('<tr class="ns1blankspaceControl">' +
							'<td id="ns1blankspaceControlStatus-1" class="ns1blankspaceControl orderStatus">' +
							'Completed</td></tr>');
						
			aHTML.push('</table>');		
			
			$('#ns1blankspaceControl').html(aHTML.join(''));	

			ns1blankspace.order.home.recent();
			
			$('#ns1blankspaceControlRecent').click(function(event)
			{
				ns1blankspace.order.home.recent();
			});
			
			$('td.orderStatus').click(function(event)
			{
				var sID = this.id;
				var aID = sID.split('-');
				ns1blankspace.order.home.status.show({status: aID[1]});
			});
		},

		recent:		function (oResponse)
		{
			if (oResponse == undefined)
			{
				$('#ns1blankspaceMain').html(ns1blankspace.xhtml.loading);

				var oSearch = new AdvancedSearch();
				oSearch.method = 'PRODUCT_ORDER_SEARCH';
				oSearch.addField('reference,orderbybusinesstext,orderbypersontext,orderdate,statustext');
				oSearch.rows = 50;
				oSearch.sort('orderdate', 'desc');
				oSearch.getResults(ns1blankspace.order.home.recent);
			}
			else
			{
				var aHTML = [];
				
				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<table><tr><td class="ns1blankspaceNothing">Click New to create an order.</td></tr></table>');
				}
				else
				{
					aHTML.push('<div class="ns1blankspaceCaption" style="padding-left:8px;">RECENT</div>');

					aHTML.push('<table class="ns1blankspaceContainer table">');
				
					$.each(oResponse.data.rows, function()
					{
						aHTML.push('<tr class="ns1blankspaceMainRow">');
						
						aHTML.push('<td id="ns1blankspaceMostLikely_title-' + this.id + 
												'" class="ns1blankspaceMostLikely" style="width:100px;" >' +
												this.reference + '</td>');
						
						aHTML.push('<td id="ns1blankspaceMostLikely_orderdate-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:100px;">' +
												this.orderdate.replace(' 00:00:00', '') + '</td>');
												
						aHTML.push('<td id="ns1blankspaceMostLikely_status-' + this.id + '" class="ns1blankspaceMostLikelySub" style="width:100px;">' +
												this.statustext + '</td>');
												
						var sContact = this.orderbybusinesstext;
						if (sContact == '') {sContact = this.orderbypersontext}
												
						aHTML.push('<td id="ns1blankspaceMostLikely_contact-' + this.id + '" class="ns1blankspaceMostLikelySub">' +
												sContact + '</td>');
												
						aHTML.push('</tr>');
					});
					
					aHTML.push('</table>');
				}
				
				$('#ns1blankspaceMain').html(aHTML.join(''));
			
				$('td.ns1blankspaceMostLikely').click(function(event)
				{
					ns1blankspace.order.search.send(event.target.id, {source: 1});
				});
			}
		},

		status:		
		{
			show: function (oParam, oResponse)
			{
				var iStatus = 1;
				
				if (oParam != undefined)
				{
					if (oParam.status != undefined) {iStatus = oParam.status}	
				}
					
				if (oResponse == undefined)
				{
					$('#ns1blankspaceMain').html(ns1blankspace.xhtml.loading);

					var oSearch = new AdvancedSearch();
					oSearch.method = 'PRODUCT_ORDER_SEARCH';
					oSearch.addField('reference,orderbybusinesstext,orderbypersontext,orderdate');
					oSearch.addFilter('status', 'EQUAL_TO', iStatus);
					oSearch.rows = 30;
					oSearch.sort('orderdate', 'desc');
					oSearch.getResults(function(data) {ns1blankspace.order.home.status.show(oParam, data)});
				}
				else
				{
					var aHTML = [];

					if (oResponse.data.rows.length == 0)
					{
						aHTML.push('<table><tr><td class="ns1blankspaceNothing">No orders, click New to create an order.</td></tr></table>');
					}
					else
					{		
						var sStatus = 'TO BE SUBMITTED';
						if (iStatus == 7) {sStatus = 'PROCESSING'}
						if (iStatus == 1) {sStatus = 'COMPLETED'}

						aHTML.push('<div class="ns1blankspaceCaption" style="padding-left:8px;">' + sStatus + '</div>');

						aHTML.push('<table class="ns1blankspaceContainer table">');
						
						$.each(oResponse.data.rows, function()
						{
							aHTML.push(ns1blankspace.order.home.status.row(this));
						});
						
						aHTML.push('</table>');
					}
					
					$('#ns1blankspaceMain').html(aHTML.join(''));
				
					ns1blankspace.render.page.show(
					{
						xhtmlElementID: 'ns1blankspaceMain',
						xhtmlContext: 'OrderStatus',
						xhtml: aHTML.join(''),
						showMore: (oResponse.morerows == "true"),
						more: oResponse.moreid,
						rows: 30,
						functionShowRow: ns1blankspace.order.home.status.row,
						functionNewPage: 'ns1blankspace.order.home.status.bind()',
						type: 'json',
						headerRow: false,
						bodyClass: 'table'
					}); 
								
					ns1blankspace.order.home.status.bind();
				}
			},

			row:		function (oRow)
			{
				var aHTML = [];

				aHTML.push('<td id="ns1blankspaceMostLikely_title-' + oRow.id + 
									'" class="ns1blankspaceMostLikely" style="width:100px;" >' +
									oRow.reference + '</td>');
			
				aHTML.push('<td id="ns1blankspaceMostLikely_orderdate-' + oRow.id + '" class="ns1blankspaceMostLikelySub" style="width:100px;">' +
									oRow.orderdate.replace(' 00:00:00', '') + '</td>');
									
				var sContact = oRow.orderbybusinesstext;
				if (sContact == '') {sContact = oRow.orderbypersontext}
										
				aHTML.push('<td id="ns1blankspaceMostLikely_contact-' + oRow.id + '" class="ns1blankspaceMostLikelySub">' +
									sContact + '</td>');

				aHTML.push('</tr>');

				return aHTML.join('');
			},

			bind:		function ()
			{
				$('td.ns1blankspaceMostLikely').click(function(event)
				{
					ns1blankspace.order.search.send(event.target.id, {source: 1});
				});
			}	
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
			
			if (sSearchContext != undefined  && iSource != ns1blankspace.data.searchSource.browse)
			{
				$('#ns1blankspaceControl').html(ns1blankspace.xhtml.loading);
				
				ns1blankspace.objectContext = sSearchContext;
				
				var oSearch = new AdvancedSearch();
				oSearch.method = 'PRODUCT_ORDER_SEARCH';
				
				oSearch.addField('reference,orderbybusinesstext,orderbybusiness,orderbypersontext,orderbyperson,billtobusinesstext,billtobusiness,billtoperson,' +
									'salespersontext,salesperson,projecttext,project,areatext,area,' +
									'purchaseorder,orderdate,deliverydate,statustext,status,processingstatustext,processingstatus,sourcetext,source,' +
									'notes,streetaddresscombined,streetaddress1,streetaddress2,streetsuburb,streetstate,streetpostcode,streetcountry,' +
									'mailingaddresscombined,mailingaddress1,mailingaddress2,mailingsuburb,mailingstate,mailingpostcode,mailingcountry,' +
									'order.orderitem.totalcost,' +
									'createdusertext,createduser,createddate,modifiedusertext,modifieduser,modifieddate');
				oSearch.rf = 'json';
				oSearch.addFilter('id', 'EQUAL_TO', sSearchContext);
				oSearch.addSummaryField('sum(order.OrderItem.TotalCost) totalcost');
				oSearch.getResults(function(data){ns1blankspace.order.show(oParam, data)});	
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
					oSearch.method = 'PRODUCT_ORDER_SEARCH';
					oSearch.addField('reference,orderbybusinesstext,orderbypersontext');
					oSearch.addBracket('(');
					oSearch.addFilter('reference', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('orderbybusinesstext', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addOperator('or');
					oSearch.addFilter('orderbypersontext', 'TEXT_IS_LIKE', sSearchText);
					oSearch.addBracket(')');
					oSearch.sort('orderdate', 'desc');

					ns1blankspace.search.advanced.addFilters(oSearch);

					oSearch.getResults(function(data) {ns1blankspace.order.search.process(oParam, data)});
				}
			};	
		},

		process:	function (oParam, oResponse)
		{
			var iColumn = 0;
			var	iMaximumColumns = 1;
			var aHTML = [];

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
					aHTML.push(ns1blankspace.order.search.row(this));
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
					ns1blankspace.order.search.send(event.target.id, {source: 1});
				});

				ns1blankspace.render.bind(
				{
					functionRow: ns1blankspace.order.search.row,
					more: oResponse.moreid,
					rows: oResponse.rows,
					startRow: parseInt(oResponse.startrow) + parseInt(oResponse.rows),
					functionSearch: ns1blankspace.order.search.send
				});   
			}			
		},

		row: function(oRow)
		{
			// v2.0.4 Moved to separate function
			var aHTML = [];
			var sContact = '';

			aHTML.push('<tr class="ns1blankspaceSearch">');

			aHTML.push('<td class="ns1blankspaceSearch" id="' +
							'-' + oRow.id + '">' +
							oRow.reference +
							'</td>');
			
			sContact = (oRow.orderbybusinesstext != '') ? oRow.orderbybusinesstext : sContact = oRow.orderbypersontext;
			
			aHTML.push('<td class="ns1blankspaceSearchSub" id="' +
							'searchContact-' + oRow.id + '">' +
							sContact.formatXHTML() +
							'</td>');

			aHTML.push('</tr>');
			return aHTML.join('');
		}
	},

	layout: 	function ()
	{
		var aHTML = [];

		aHTML.push('<div id="ns1blankspaceControlContext" class="ns1blankspaceControlContext"></div>');
		
		aHTML.push('<table class="ns1blankspaceControl">');
		
		if (ns1blankspace.objectContext == -1)
		{
			aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl ns1blankspaceHighlight">' +
							'Details</td></tr>');

			aHTML.push('<tr><td id="ns1blankspaceControlAddress" class="ns1blankspaceControl">' +
							'Address</td></tr>');						
		}
		else
		{
			aHTML.push('<tr><td id="ns1blankspaceControlSummary" class="ns1blankspaceControl ns1blankspaceHighlight">' +
							'Summary</td></tr>');

			aHTML.push('<tr><td id="ns1blankspaceControlDetails" class="ns1blankspaceControl">' +
							'Details</td></tr>');

			aHTML.push('<tr><td id="ns1blankspaceControlAddress" class="ns1blankspaceControl">' +
							'Address</td></tr>');						

			aHTML.push('</table>');					

			aHTML.push('<table class="ns1blankspaceControl">');

			aHTML.push('<tr><td id="ns1blankspaceControlProducts" class="ns1blankspaceControl">' +
							'Items</td></tr>');

			aHTML.push('</table>');					

			aHTML.push('<table class="ns1blankspaceControl">');

			aHTML.push('<tr><td id="ns1blankspaceControlInvoices" class="ns1blankspaceControl">' +
							'Invoices</td></tr>');

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
		aHTML.push('<div id="ns1blankspaceMainAddress" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainProducts" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainInvoices" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainActions" class="ns1blankspaceControlMain"></div>');
		aHTML.push('<div id="ns1blankspaceMainAttachments" class="ns1blankspaceControlMain"></div>');		

		$('#ns1blankspaceMain').html(aHTML.join(''));

		$('#ns1blankspaceControlSummary').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainSummary'});
			ns1blankspace.order.summary();
		});
		
		$('#ns1blankspaceControlDetails').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainDetails'});
			ns1blankspace.order.details();
		});
		
		$('#ns1blankspaceControlAddress').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainAddress'});
			ns1blankspace.order.address();
		});
		
		$('#ns1blankspaceControlProducts').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainProducts'});
			ns1blankspace.order.items.show();
		});

		$('#ns1blankspaceControlInvoices').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainInvoices'});
			ns1blankspace.order.invoices.show();
		});

		$('#ns1blankspaceControlActions').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainActions'});
			ns1blankspace.actions.show();
		});

		$('#ns1blankspaceControlAttachments').click(function(event)
		{
			ns1blankspace.show({selector: '#ns1blankspaceMainAttachments'});
			ns1blankspace.attachments.show();
		});
	},

	show:		function (oParam, oResponse)
	{
		ns1blankspace.app.clean();
		ns1blankspace.order.layout();
		
		var aHTML = [];
		
		if (oResponse.data.rows.length == 0)
		{
			ns1blankspace.objectContextData = undefined;
			
			aHTML.push('<table><tr><td class="ns1blankspaceNothing">Sorry can\'t find this order.</td></tr></table>');
					
			$('#ns1blankspaceMain').html(aHTML.join(''));
		}
		else
		{
			ns1blankspace.objectContextData = oResponse.data.rows[0];
			
			aHTML.push(ns1blankspace.objectContextData.reference);

			if (ns1blankspace.objectContextData.orderdate != '')
			{
				var oDate = Date.parse(ns1blankspace.objectContextData.orderdate);
				aHTML.push('<br /><span id="ns1blankspaceControlContext_orderDate" class="ns1blankspaceSub">' + oDate.toString("dd MMM yyyy") + '</span>');
			}

			aHTML.push('<br />' + ns1blankspace.objectContextData.orderbybusinesstext.formatXHTML());

			$('#ns1blankspaceControlContext').html(aHTML.join(''));
			$('#ns1blankspaceViewControlAction').button({disabled: false});
			$('#ns1blankspaceViewControlActionOptions').button({disabled: false});
			
			ns1blankspace.history.view(
			{
				newDestination: 'ns1blankspace.order.init({id: ' + ns1blankspace.objectContext + '})',
				move: false
			});
			
			ns1blankspace.history.control({functionDefault: 'ns1blankspace.order.summary()'});
		}
	},		
		
	summary:	function ()
	{
		var aHTML = [];
		
		if (ns1blankspace.objectContextData == undefined)
		{
			aHTML.push('<table><tr><td valign="top">Sorry can\'t find this order.</td></tr></table>');
					
			$('#ns1blankspaceMainSummary').html(aHTML.join(''));
		}
		else
		{
			aHTML.push('<table class="ns1blankspaceMain">' +
						'<tr class="ns1blankspaceRow">' +
						'<td id="ns1blankspaceSummaryColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
						'<td id="ns1blankspaceSummaryColumn2" class="ns1blankspaceColumn2Action" style="width:200px;"></td>' +
						'</tr>' +
						'</table>');				
			
			$('#ns1blankspaceMainSummary').html(aHTML.join(''));

			var aHTML = [];

			aHTML.push('<table class="ns1blankspace">');

			if (ns1blankspace.objectContextData.orderdate != '')
			{	
				var oDate = Date.parse(ns1blankspace.objectContextData.orderdate);

				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Order Date</td></tr>' +
								'<tr><td id="ns1blankspaceSummaryOrderDate" class="ns1blankspaceSummary">' +
								oDate.toString("ddd, dd MMM yyyy") +
								'</td></tr>');
			}	

			if (ns1blankspace.objectContextData.orderbybusinesstext != '')
			{	
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Business</td></tr>' +
								'<tr><td id="ns1blankspaceSummaryOrderByBusiness" data-id="' + ns1blankspace.objectContextData.orderbybusiness + '" data-object="contactBusiness" class="ns1blankspaceSummary ns1blankspaceViewLink">' +
								ns1blankspace.objectContextData.orderbybusinesstext +
								'</td></tr>');
			}

			if (ns1blankspace.objectContextData.orderbypersontext != '')
			{	
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Person</td></tr>' +
								'<tr><td id="ns1blankspaceSummaryOrderByPerson" data-id="' + ns1blankspace.objectContextData.orderbyperson + '" data-object="contactPerson" class="ns1blankspaceSummary ns1blankspaceViewLink">' +
								ns1blankspace.objectContextData.orderbypersontext +
								'</td></tr>');
			}

			if (ns1blankspace.objectContextData.deliverydate != '')
			{				
				var oDate = Date.parse(ns1blankspace.objectContextData.deliverydate);
				
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Delivery Date</td></tr>' +
							'<tr><td id="ns1blankspaceSummaryDeliveryDate" class="ns1blankspaceSummary">' +
							oDate.toString("ddd, dd MMM yyyy") +
							'</td></tr>');
			}					
				
			if (ns1blankspace.objectContextData.streetaddress1 != '')
			{				
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Deliver To</td></tr>' +
								'<tr><td class="ns1blankspaceSummary">' +
								ns1blankspace.objectContextData.streetaddresscombined);
								
				if (ns1blankspace.objectContextData.streetsuburb != '')
				{				
					aHTML.push('<br />' + ns1blankspace.objectContextData.streetsuburb);
				}
								
				if (ns1blankspace.objectContextData.streetstate != '')
				{				
					aHTML.push('<br />' + ns1blankspace.objectContextData.streetstate);		
				}
				
				aHTML.push('</td></tr>');							
			}

			if (ns1blankspace.objectContextData.notes != '')
			{	
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption">Notes</td></tr>' +
								'<tr><td id="ns1blankspaceSummaryNotes" class="ns1blankspaceSummary">' +
									ns1blankspace.util.toBR(ns1blankspace.objectContextData.notes.formatXHTML()) +
									'</td></tr>');
			}	
						
			aHTML.push('</table>');					
			
			$('#ns1blankspaceSummaryColumn1').html(aHTML.join(''));

			var aHTML = [];
			
			aHTML.push('<table class="ns1blankspaceColumn2">');
			
			if (ns1blankspace.objectContextData.statustext != '')
			{	
				aHTML.push('<tr><td class="ns1blankspaceSummaryCaption" style="padding-bottom:10px;">' +
							ns1blankspace.objectContextData.statustext +
							'</td></tr>');				
			}
			
			if (ns1blankspace.objectContextData.status == 7)
			{	
				aHTML.push('<tr><td>' +
							'<span id="ns1blankspaceOrderAction-7" class="orderAction" style="font-size:0.75em;">Unsubmit</span>' +
							'</td></tr>');
							
				aHTML.push('<tr><td>' +
							'<span id="ns1blankspaceOrderAction-8" class="orderAction" style="font-size:0.75em;">Finalise</span>' +
							'</td></tr>');			
			}
			
			if (ns1blankspace.objectContextData.status == 2)
			{	
				aHTML.push('<tr><td>' +
							'<span id="ns1blankspaceOrderAction-2" class="orderAction" style="font-size:0.75em;">Submit</span>' +
							'</td></tr>');
			}
							
			aHTML.push('</table>');					
			
			$('#ns1blankspaceSummaryColumn2').html(aHTML.join(''));	
			
			$('span.orderAction').button(
			{
				
			})
			.click(function() {
				
				var sID = this.id;
				var aID = sID.split('-');
				var iAction = aID[1];
				
				$.ajax(
				{
					type: 'GET',
					url: ns1blankspace.util.endpointURI('PRODUCT_ORDER_MANAGE'),
					data: 'action=' + iAction + '&id=' + ns1blankspace.objectContext,
					dataType: 'json',
					success: function(oResponse)
					{
						ns1blankspace.inputDetected = false;
						ns1blankspace.order.search.send('-' + ns1blankspace.objectContext)
					}
				});
			})
			.css('width', '100px');						
		}	
	},

	details:	function ()
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
							'Reference' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsReference" class="ns1blankspaceText">' +
							'</td></tr>');			

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Order Date' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceDate">' +
							'<input id="ns1blankspaceDetailsOrderDate" class="ns1blankspaceDate">' +
							'</td></tr>');			

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Business' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceSelect">' +
							'<input id="ns1blankspaceDetailsOrderByBusiness" class="ns1blankspaceSelect"' +
								' data-method="CONTACT_BUSINESS_SEARCH"' +
								' data-columns="tradename">' +
							'</td></tr>');	
				
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Person' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceSelect">' +
							'<input id="ns1blankspaceDetailsOrderByPerson" class="ns1blankspaceSelect"' +
								' data-method="CONTACT_PERSON_SEARCH"' +
								' data-columns="firstname-space-surname"' +
								' data-parent="ns1blankspaceDetailsOrderByBusiness"' +
								' data-parent-search-id="contactbusiness"' +
								' data-parent-search-text="tradename">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Purchase Order' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceDetailsPurchaseOrder" class="ns1blankspaceText">' +
							'</td></tr>');		

			aHTML.push('</table>');					
			
			$('#ns1blankspaceDetailsColumn1').html(aHTML.join(''));
			
			ns1blankspace.util.initDatePicker({select: 'input.ns1blankspaceDate'});
			
			var aHTML = [];

			aHTML.push('<table class="ns1blankspace">');
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Source' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceRadio">' +
							'<input type="radio" id="radioSource1" name="radioSource" value="1"/>Manually Entered' +
							'&nbsp;&nbsp;<input type="radio" id="radioSource2" name="radioSource" value="2"/>Web Order' +
							'</td></tr>');		
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Notes' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<textarea id="ns1blankspaceDetailsNotes" class="ns1blankspaceTextMulti" style="width:350px; height:300px;" rows="5" cols="35"></textarea>' +
							'</td></tr>');
			
			aHTML.push('</table>');					
				
			$('#ns1blankspaceDetailsColumn2').html(aHTML.join(''));

			if (ns1blankspace.objectContextData != undefined)
			{
				$('#ns1blankspaceDetailsReference').val(ns1blankspace.objectContextData.reference.formatXHTML());
				$('#ns1blankspaceDetailsOrderDate').val(ns1blankspace.util.fd(ns1blankspace.objectContextData.orderdate));
				$('#ns1blankspaceDetailsOrderByBusiness').attr('data-id', ns1blankspace.objectContextData.orderbybusiness);
				$('#ns1blankspaceDetailsOrderByBusiness').val(ns1blankspace.objectContextData.orderbybusinesstext.formatXHTML());
				$('#ns1blankspaceDetailsOrderByPerson').attr('data-id', ns1blankspace.objectContextData.orderbyperson);
				$('#ns1blankspaceDetailsOrderByPerson').val(ns1blankspace.objectContextData.orderbypersontext.formatXHTML());	
				$('[name="radioSource"][value="' + ns1blankspace.objectContextData.source + '"]').attr('checked', true);
				$('#ns1blankspaceDetailsPurchaseOrder').val(ns1blankspace.objectContextData.purchaseorder.formatXHTML());
				$('#ns1blankspaceDetailsNotes').val(ns1blankspace.objectContextData.notes.formatXHTML());	
			}
			else
			{
				$('[name="radioSource"][value="1"]').attr('checked', true);
				$('#ns1blankspaceDetailsOrderDate').val(Date.today().toString("dd MMM yyyy"));
			}
		}	
	},

	address:	function ()
	{
		var aHTML = [];

		if ($('#ns1blankspaceMainAddress').attr('data-loading') == '1')
		{
			$('#ns1blankspaceMainAddress').attr('data-loading', '');
			
			aHTML.push('<table class="ns1blankspaceContainer">' +
							'<tr class="ns1blankspaceContainer">' +
							'<td id="ns1blankspaceAddressColumn1" class="ns1blankspaceColumn1"></td>' +
							'<td id="ns1blankspaceAddressColumn2" class="ns1blankspaceColumn2"></td>' +
							'</tr>' + 
							'</table>');					
			
			$('#ns1blankspaceMainAddress').html(aHTML.join(''));
	
			var aHTML = [];

			aHTML.push('<table class="ns1blankspace">');
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Delivery' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAddressStreetAddress1" class="ns1blankspaceText">' +
							'</td></tr>');			
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAddressStreetAddress2" class="ns1blankspaceText">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Suburb' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAddressStreetSuburb" class="ns1blankspaceText ns1blankspaceSelectAddress">' +
							'</td></tr>');
		
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'State' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAddressStreetState" class="ns1blankspaceText">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Post Code' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAddressStreetPostCode" class="ns1blankspaceText">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Country' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAddressStreetCountry" class="ns1blankspaceText">' +
							'</td></tr>');	
			
			aHTML.push('<tr><td class="ns1blankspaceAction">' +
							'<span id="ns1blankspaceContactCopyToMailingAddress">Copy to Billing Address</span>' +
							'</td></tr>');
							
			aHTML.push('</table>');					
			
			$('#ns1blankspaceAddressColumn1').html(aHTML.join(''));

			var aHTML = [];
			
			aHTML.push('<table class="ns1blankspaceColumn2">');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Billing' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAddressMailingAddress1" class="ns1blankspaceText">' +
							'</td></tr>');			
			
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAddressMailingAddress2" class="ns1blankspaceText">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Suburb' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAddressMailingSuburb" class="ns1blankspaceText ns1blankspaceSelectAddress">' +
							'</td></tr>');
		
			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'State' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAddressMailingState" class="ns1blankspaceText">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Post Code' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAddressMailingPostCode" class="ns1blankspaceText">' +
							'</td></tr>');

			aHTML.push('<tr class="ns1blankspaceCaption">' +
							'<td class="ns1blankspaceCaption">' +
							'Country' +
							'</td></tr>' +
							'<tr class="ns1blankspace">' +
							'<td class="ns1blankspaceText">' +
							'<input id="ns1blankspaceAddressMailingCountry" class="ns1blankspaceText">' +
							'</td></tr>');	

			aHTML.push('</table>');					
			
			$('#ns1blankspaceAddressColumn2').html(aHTML.join(''));
			
			$('#ns1blankspaceContactCopyToMailingAddress').button(
			{
				label: "Copy to Billing Address"
			})
			.click(function()
			{
				$('#ns1blankspaceAddressMailingAddress1').val($('#ns1blankspaceAddressStreetAddress1').val());
				$('#ns1blankspaceAddressMailingAddress2').val($('#ns1blankspaceAddressStreetAddress2').val());
				$('#ns1blankspaceAddressMailingSuburb').val($('#ns1blankspaceAddressStreetSuburb').val());
				$('#ns1blankspaceAddressMailingState').val($('#ns1blankspaceAddressStreetState').val());
				$('#ns1blankspaceAddressMailingPostCode').val($('#ns1blankspaceAddressStreetPostCode').val());
				$('#ns1blankspaceAddressMailingCountry').val($('#ns1blankspaceAddressStreetCountry').val());
			})

			if (ns1blankspace.objectContextData != undefined)
			{
				$('#ns1blankspaceAddressStreetAddress1').val((ns1blankspace.objectContextData.streetaddress1).formatXHTML());
				$('#ns1blankspaceAddressStreetAddress2').val((ns1blankspace.objectContextData.streetaddress2).formatXHTML());
				$('#ns1blankspaceAddressStreetSuburb').val((ns1blankspace.objectContextData.streetsuburb).formatXHTML());
				$('#ns1blankspaceAddressStreetState').val((ns1blankspace.objectContextData.streetstate).formatXHTML());
				$('#ns1blankspaceAddressStreetPostCode').val((ns1blankspace.objectContextData.streetpostcode).formatXHTML());
				$('#ns1blankspaceAddressStreetCountry').val((ns1blankspace.objectContextData.streetcountry).formatXHTML());
				$('#ns1blankspaceAddressMailingAddress1').val((ns1blankspace.objectContextData.mailingaddress1).formatXHTML());
				$('#ns1blankspaceAddressMailingAddress2').val((ns1blankspace.objectContextData.mailingaddress2).formatXHTML());
				$('#ns1blankspaceAddressMailingSuburb').val((ns1blankspace.objectContextData.mailingsuburb).formatXHTML());
				$('#ns1blankspaceAddressMailingState').val((ns1blankspace.objectContextData.mailingstate).formatXHTML());
				$('#ns1blankspaceAddressMailingPostCode').val((ns1blankspace.objectContextData.mailingpostcode).formatXHTML());
				$('#ns1blankspaceAddressMailingCountry').val((ns1blankspace.objectContextData.mailingcountry).formatXHTML());
			}
		}	
	},

	items: 		
	{
		show:		function (oParam, oResponse)
		{
			var sXHTMLElementID = 'ns1blankspaceMainProducts';
			
			if (oParam != undefined)
			{
				if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
			}

			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'PRODUCT_ORDER_ITEM_SEARCH';
				oSearch.addField('product,producttext,quantity,totalcost,totaltax,invoicedescription,unitcost,orderitem.product.unittypetext');
				oSearch.addFilter('order', 'EQUAL_TO', ns1blankspace.objectContext);
				oSearch.sort('producttext', 'desc');
				oSearch.getResults(function(data){ns1blankspace.order.items.show(oParam, data)});
			}
			else
			{
				var aHTML = [];
				
				aHTML.push('<table class="ns1blankspaceContainer">' +
								'<tr class="ns1blankspaceContainer">' +
								'<td id="ns1blankspaceItemsColumn1" class="ns1blankspaceColumn1Flexible"></td>' +
								'<td id="ns1blankspaceItemsColumn2" class="ns1blankspaceColumn2" style="width:300px;"></td>' +
								'</tr>' + 
								'</table>');

				$('#' + sXHTMLElementID).html(aHTML.join(''));
				
				var aHTML = [];
				
				aHTML.push('<table class="ns1blankspaceColumn2">');
				
				if (ns1blankspace.objectContextData.status == 2)
				{
					aHTML.push('<tr><td>' +
								'<span id="ns1blankspaceOrderItemsAdd" class="ns1blankspaceAction">Add</span>' +
								'</td></tr>');
				}
				else
				{
					aHTML.push('<tr><td class="ns1blankspaceSub">' +
								'The order has been submitted, so items can not be added or removed.' +
								'</td></tr>');
				}				
								
				aHTML.push('</table>');					
				
				$('#ns1blankspaceItemsColumn2').html(aHTML.join(''));
				
				$('#ns1blankspaceOrderItemsAdd').button(
				{
					label: "Add"
				})
				.click(function()
				{
					ns1blankspace.order.items.edit()
				});
				
				var aHTML = [];

				if (oResponse.data.rows.length == 0)	
				{
					aHTML.push('<table><tr><td class="ns1blankspaceNothing">No items.</td></tr></table>');

					$('#ns1blankspaceItemsColumn1').html(aHTML.join(''));		
				}
				else
				{
					aHTML.push('<table id="ns1blankspaceOrderItems" class="ns1blankspaceContainer">');
					aHTML.push('<tr class="ns1blankspaceCaption">');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">Product</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Quantity</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Price</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
					aHTML.push('</tr>');
					
					$.each(oResponse.data.rows, function() 
					{ 
						aHTML.push(ns1blankspace.order.items.row(this));
					});
					
					aHTML.push('</table>');

					ns1blankspace.render.page.show(
					{
						xhtmlElementID: 'ns1blankspaceItemsColumn1',
						xhtmlContext: 'OrderItems',
						xhtml: aHTML.join(''),
						showMore: (oResponse.morerows == "true"),
						more: oResponse.moreid,
						rows: ns1blankspace.option.defaultRows,
						functionShowRow: ns1blankspace.order.items.row,
						functionNewPage: 'ns1blankspace.order.items.bind()',
						functionOnNewPage: ns1blankspace.order.items.bind,
						type: 'json'
					});
				}
			}	
		},	

		row:		function (oRow)
		{
			var aHTML = [];

			aHTML.push('<tr class="ns1blankspaceRow">');
			
			aHTML.push('<td id="ns1blankspaceOrderItems_title-' + oRow.id + '" class="ns1blankspaceRow">' +
									oRow.producttext);

			if (oRow.invoicedescription !== '')
			{
				aHTML.push('<br /><div class="ns1blankspaceSubNote">' + oRow.invoicedescription + '</span>');	
			}	

			aHTML.push('</td>');	
									
			aHTML.push('<td id="ns1blankspaceOrderItems_quantity-' + oRow.id + '" class="ns1blankspaceRow"' +
									' style="text-align:right;">' +
									oRow.quantity + '</td>');						
										
			aHTML.push('<td id="ns1blankspaceOrderItems_price-' + oRow.id + '" class="ns1blankspaceRow"' +
									' style="text-align:right;">' +
									oRow.totalcost + '</td>');					
								
			aHTML.push('<td style="width:60px;text-align:right;" class="ns1blankspaceRow">');	
			aHTML.push('<span id="ns1blankspaceOrderItems_remove-' + oRow.id + '" class=" ns1blankspaceRow ns1blankspaceRowRemove"></span>');

			aHTML.push('<span id="ns1blankspaceRowItem_options_edit-' + oRow.id + '" class="ns1blankspaceItemEdit"' +
							' data-quantity="' + oRow.quantity + '"' +
							' data-product="' + oRow.product + '"' +
							' data-producttext="' + oRow.producttext + '"' +
							' data-description="' + oRow.invoicedescription + '"' +
							' data-totalcost="' + oRow.totalcost + '"' +
							' data-totaltax="' + oRow.totaltax + '"' +
							' data-unitcost="' + oRow.unitcost + '"' +
							' data-unittype=' + oRow['orderitem.product.unittypetext'] +
							'></span>');

			aHTML.push('</td>');
																			
			aHTML.push('</tr>');	
			
			return aHTML.join('');
		},

		bind:		function (oParam)
		{
			$('.ns1blankspaceRowView').button(
			{
				text: false,
				icons:
				{
					primary: "ui-icons"
				}
			})
			.click(function()
			{
				alert("View product");
			})
			.css('width', '15px')
			.css('height', '17px');
			
			if (ns1blankspace.objectContextData.status == 2)
			{
				$('.ns1blankspaceRowRemove').button(
				{
					text: false,
					icons:
					{
						primary: "ui-icon-close"
					}
				})
				.click(function()
				{
					ns1blankspace.order.items.remove({xhtmlElementID: this.id});
				})
				.css('width', '15px')
				.css('height', '17px');

				$('.ns1blankspaceItemEdit').button(
				{
					text: false,
					icons:
					{
						primary: "ui-icon-pencil"
					}
				})
				.click(function()
				{
					oParam = ns1blankspace.util.setParam(oParam, 'xhtmlElementID', this.id);
					oParam = ns1blankspace.util.setParam(oParam, 'step', 1);
					ns1blankspace.order.items.edit(oParam);
				})
				.css('width', '15px')
				.css('height', '17px');
			}	
		},

		remove:		function (oParam, oResponse)
		{
			var sXHTMLElementID;

			if (oParam != undefined)
			{
				if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
			}
			
			var aXHTMLElementID = sXHTMLElementID.split('-');
			var sID = aXHTMLElementID[1];
			
			if (oResponse == undefined)
			{	
				ns1blankspace.status.working('Removing...');

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('PRODUCT_ORDER_ITEM_MANAGE'),
					data: 'remove=1&id=' + ns1blankspace.util.fs(sID),
					dataType: 'json',
					success: function(data){ns1blankspace.order.items.remove(oParam, data)}
				});
			}	
			else
			{
				if (oResponse.status == 'OK')
				{
					ns1blankspace.status.message('Removed');
					$('#' + sXHTMLElementID).parent().parent().fadeOut(500);
				}
				else
				{
					ns1blankspace.status.error(oResponse.error.errornotes);
				}
			}	
		},

		edit:		function (oParam, oResponse)
		{
			var iStep = ns1blankspace.util.getParam(oParam, 'step', {"default": 1}).value;
			var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;

			if (oResponse == undefined)
			{
				if (iStep == 1)
				{
					var aHTML = [];

					aHTML.push('<table class="ns1blankspaceContainer">');

					aHTML.push('<tr class="ns1blankspaceContainer">' +
									'<td id="ns1blankspaceItemEditColumn1"></td>' +
									'<td id="ns1blankspaceItemEditColumn2" style="width:50px;"></td>' +
									'</tr>');

					aHTML.push('</table>');					
					
					$('#ns1blankspaceItemsColumn2').html(aHTML.join(''));

					var aHTML = [];
			
					aHTML.push('<table class="ns1blankspaceColumn2a">' +
									'<tr><td><span id="ns1blankspaceItemEditSave" class="ns1blankspaceAction">' +
									'Save</span></td></tr>' +
									'<tr><td><span id="ns1blankspaceItemEditCancel" class="ns1blankspaceAction">' +
									'Cancel</span></td></tr>' +
									'</table>');					
					
					$('#ns1blankspaceItemEditColumn2').html(aHTML.join(''));
					
					$('#ns1blankspaceItemEditSave').button(
					{
						text: "Save"
					})
					.click(function()
					{
						ns1blankspace.order.items.save(oParam);
					})
					.css('width', '65px');

					$('#ns1blankspaceItemEditCancel').button(
					{
						text: "Cancel"
					})
					.click(function()
					{
						ns1blankspace.order.items.show()
					})
					.css('width', '65px');

					var aHTML = [];
							
					aHTML.push('<table class="ns1blankspaceColumn2" style="width:200px;">');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Product' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceItemsProductReference" class="ns1blankspaceText">' +
									'</td></tr>');		
																		
					aHTML.push('<tr><td style="margin-top:15px;" id="ns1blankspaceItemsProductSearchResults">' +
									'<span class="ns1blankspaceSub" style="font-size:0.75em;">Press <i>enter</i> to see all<br />or just start typing.</span>' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Quantity' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceItemsProductQuantity" class="ns1blankspaceText">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									ns1blankspace.option.taxVATCaption + ' Type' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceSelect" id="ns1blankspaceItemsProductTaxType">' +
									ns1blankspace.xhtml.loadingSmall +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Unit Price' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceItemsProductUnitPrice" class="ns1blankspaceText" style="width:50%;">' +
									'&nbsp;<span id="ns1blankspaceItemsProductUnitType"' +
										' class="ns1blankspaceHeader" style="line-height:25px; height:25px;"</span>' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Total Price' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceItemsProductTotalPrice" class="ns1blankspaceText">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Total ' +ns1blankspace.option.taxVATCaption +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceText">' +
									'<input id="ns1blankspaceItemsProductTotalTax" class="ns1blankspaceText">' +
									'</td></tr>');

					aHTML.push('<tr class="ns1blankspaceCaption">' +
									'<td class="ns1blankspaceCaption">' +
									'Description' +
									'</td></tr>' +
									'<tr class="ns1blankspace">' +
									'<td class="ns1blankspaceTextMulti">' +
									'<textarea id="ns1blankspaceItemsProductDescription" class="ns1blankspaceTextMulti" style="height:70px; width:100%;" rows="3" cols="35" ></textarea>' +
									'</td></tr>');	
													
					aHTML.push('</table>');		
					
					$('#ns1blankspaceItemEditColumn1').html(aHTML.join(''));

					var iTaxType = 1;
					if (iID !== undefined)
					{
						$('#ns1blankspaceItemsProductReference').val(ns1blankspace.util.getData(oParam, 'data-producttext').value.formatXHTML());
						$('#ns1blankspaceItemsProductReference').attr('data-id', ns1blankspace.util.getData(oParam, 'data-product').value);
						$('#ns1blankspaceItemsProductQuantity').val(ns1blankspace.util.getData(oParam, 'data-quantity').value);
						$('#ns1blankspaceItemsProductUnitPrice').val(ns1blankspace.util.getData(oParam, 'data-unitcost').value.formatXHTML());
						$('#ns1blankspaceItemsProductTotalPrice').val(ns1blankspace.util.getData(oParam, 'data-totalcost').value.formatXHTML());
						$('#ns1blankspaceItemsProductTotalTax').val(ns1blankspace.util.getData(oParam, 'data-totaltax').value.formatXHTML());
						$('#ns1blankspaceItemsProductDescription').val(ns1blankspace.util.getData(oParam, 'data-description').value.formatXHTML());
						$('#ns1blankspaceItemsProductUnitType').html(ns1blankspace.util.getData(oParam, 'data-unittype').value.formatXHTML())
					}	

					ns1blankspace.financial.util.tax.codes(
					{
						xhtmlElementID: 'ns1blankspaceItemsProductTaxType',
						id: iTaxType
					});

					$('#ns1blankspaceItemsProductReference').keyup(function(e)
					{
						oParam = ns1blankspace.util.setParam(oParam, 'step', 2);

						if (e.which == 13)
					    {
					        ns1blankspace.order.items.edit(oParam);
					    }
					    else
					    {
							if (ns1blankspace.timer.delayCurrent != 0) {clearTimeout(ns1blankspace.timer.delayCurrent)};
				        	ns1blankspace.timer.delayCurrent = setTimeout('ns1blankspace.order.items.edit(' + JSON.stringify(oParam) + ')', ns1blankspace.option.typingWait);
				        }	
					});

					$('#ns1blankspaceItemsProductSearch').button(
					{
						label: "Search"
					})
					.click(function()
					{
						ns1blankspace.order.items.edit($.extend(true, oParam, {step: 2}))
					})
						
					$('#ns1blankspaceItemsProductReference').keypress(function(e)
					{
					    if (e.which == 13)
					    {
					        ns1blankspace.order.items.edit($.extend(true, oParam, {step: 2}))
					    }
					});

					$('#ns1blankspaceItemsProductReference').focus();
				}

				if (iStep == 2)
				{
					$('#ns1blankspaceItemsProductSearchResults').html(ns1blankspace.xhtml.loadingSmall);
					
					var oSearch = new AdvancedSearch();
					oSearch.method = 'PRODUCT_SEARCH';
					oSearch.addField('reference,title,currentretailprice,customerordertaxtype,unittypetext');
					oSearch.addFilter('title', 'TEXT_IS_LIKE', $('#ns1blankspaceItemsProductReference').val());
					oSearch.addFilter('status', 'EQUAL_TO', '1');		// Available Now
					oSearch.sort('title', 'asc');
					oSearch.getResults(function(data){ns1blankspace.order.items.edit($.extend(true, oParam, {step:3}), data)});
				}
			}
			else
			{
				var aHTML = [];

				if (oResponse.data.rows.length == 0)	
				{
					aHTML.push('<table><tr><td class="ns1blankspaceNothing">No products.</td></tr></table>');

					$('#ns1blankspaceItemsProductSearchResults').html(aHTML.join(''));		
				}
				else
				{	
					aHTML.push('<table id="ns1blankspaceOrderItems">');
					
					$.each(oResponse.data.rows, function() 
					{ 
						var sProductDesc = ((ns1blankspace.option.showProductCodes)
												? (this.reference != '' ? this.reference.formatXHTML() + ' - ' : '')
												: '') +
											this.title.formatXHTML();

						aHTML.push('<tr class="ns1blankspaceRow">');	
									
						aHTML.push('<td id="ns1blankspaceOrderItems_title-' + this.id + '"' +
										' class="ns1blankspaceRow ns1blankspaceRowSelect"' +
										' data-unitprice="' + this.currentretailprice + '"' +
										' data-taxtype="' + this.customerordertaxtype + '"' +
										' data-unittype="' + this.unittypetext + '">' +
										sProductDesc + 
									'</td>');
																								
						aHTML.push('</tr>');
					});
					
					aHTML.push('</table>');

					$('#ns1blankspaceItemsProductSearchResults').html(aHTML.join(''))
					
					$('#ns1blankspaceOrderItems td.ns1blankspaceRowSelect')
					.click(function()
					{
						var sID = this.id;
						var aID = sID.split('-');

						$('#ns1blankspaceItemsProductReference').attr('data-id', aID[1]);
						$('#ns1blankspaceItemsProductReference').val($(this).html().formatXHTML());
						$('#ns1blankspaceItemsProductDescription').val($(this).html().formatXHTML());
						$('#ns1blankspaceItemsProductUnitPrice').val($(this).attr('data-unitprice'));
						$('#ns1blankspaceItemsProductUnitType').val($(this).attr('data-unittypetext'));
						$('[name="ns1blankspaceItemsProductTaxType"][value="' + $(this).attr('data-taxtype') + '"]').attr('checked', true);
						$('#ns1blankspaceItemsProductSearchResults').html('');
						$('#ns1blankspaceItemsProductQuantity').focus();
					});
				}
			}	
		},

		save: function(oParam)
		{
			var iID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID', {index: 1}).value;
			var iProduct = $('#ns1blankspaceItemsProductReference').attr('data-id');
			var iQuantity = $('#ns1blankspaceItemsProductQuantity').val();
			var iUnitPrice = $('#ns1blankspaceItemsProductUnitPrice').val().replace(/,/g, '');
			var iTotal = $('#ns1blankspaceItemsProductTotalPrice').val().replace(/,/g, '');
			var iTotalTax = $('#ns1blankspaceItemsProductTotalTax').val().replace(/,/g, '');
			var sInvoiceDescription = $('#ns1blankspaceItemsProductDescription').val();
			ns1blankspace.okTosave = false;
			if (iQuantity == '') {iQuantity = 1};
			
			if (iProduct == undefined)
			{
				ns1blankspace.status.error('Need to select product');
			}
			else if (iUnitPrice == '')
			{
				ns1blankspace.status.error('Please enter the Unit Price');
			}
			else if (isNaN(iUnitPrice))
			{
				ns1blankspace.status.error('Please enter a valid unit price. It may contain only numbers and a decimal point.')
			}
			else if (iTotal != '' && isNaN(iTotal))
			{
				ns1blankspace.status.error('Please enter a valid total price. It may contain only numbers and a decimal point.')
			}
			else if (iTotalTax != '' && isNaN(iTotalTax))
			{
				ns1blankspace.status.error('Please enter a valid total tax. It may contain only numbers and a decimal point.')
			}
			else 
			{
				iUnitPrice = iUnitPrice.parseCurrency();
				//iTotal = iTotal.parseCurrency();
				//iTotalTax = iTotalTax.parseCurrency();
				if (sInvoiceDescription == '' || sInvoiceDescription == $('#ns1blankspaceItemsProductReference').val())
				{
					sInvoiceDescription = $('#ns1blankspaceItemsProductReference').val();
				}
				ns1blankspace.okToSave = true;
			}

			if (ns1blankspace.okToSave)
			{	
				ns1blankspace.status.working('Saving');
				ns1blankspace.inputDetected = false;

				var oData = 
				{
					order: ns1blankspace.objectContext,
					product: iProduct,
					quantity: iQuantity,
					unitprice: iUnitPrice,
					invoicedescription: sInvoiceDescription
				}	
				if (iTotal != '') {oData.totalcost = iTotal;}
				if (iTotalTax != '') {oData.totalcost = iTotalTax;}
				
				if (iID !== undefined) {oData.id = iID}

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('PRODUCT_ORDER_ITEM_MANAGE'),
					data: oData,
					dataType: 'json',
					async: false,
					success: function(oResponse)
					{
						ns1blankspace.status.message('Saved');
						ns1blankspace.order.items.show();
					}
				});
			}
		},

	},

	save: 		
	{		
		validate: function(oParam)
		{

			if (oParam.onComplete)
			{
				ns1blankspace.util.onComplete(oParam);
			}
		},

		send: function (oParam)
		{
			oParam = oParam || {};

			if (oParam.orderSaveStep == undefined) {oParam.orderSaveStep = 1}

			if (oParam.orderSaveStep == 1)
			{
				ns1blankspace.status.working();
				ns1blankspace.okToSave = true;
				oParam.orderSaveStep = 2;
				oParam.onComplete = ns1blankspace.order.save.send;
				ns1blankspace.order.save.validate(oParam);
			}

			else if (oParam.orderSaveStep == 2)
			{
				var oData = {};
					
				if ($('#ns1blankspaceMainDetails').html() != '')
				{
					oData.reference = $('#ns1blankspaceDetailsReference').val();
					oData.orderdate = $('#ns1blankspaceDetailsOrderDate').val();
					oData.orderbybusiness = $('#ns1blankspaceDetailsOrderByBusiness').attr("data-id");
					oData.orderbyperson = $('#ns1blankspaceDetailsOrderByPerson').attr("data-id");
					oData.purchaseorder = $('#ns1blankspaceDetailsPurchaseOrder').val();
					oData.source = $('input[name="radioSource"]:checked').val();
					oData.notes = $('#ns1blankspaceDetailsNotes').val();
				}
					
				if ($('#ns1blankspaceMainAddress').html() != '')
				{
					oData.streetaddress1 = $('#ns1blankspaceAddressStreetAddress1').val();
					oData.streetaddress2 = $('#ns1blankspaceAddressStreetAddress2').val();
					oData.streetsuburb = $('#ns1blankspaceAddressStreetSuburb').val();
					oData.streetstate = $('#ns1blankspaceAddressStreetState').val();
					oData.streetpostcode = $('#ns1blankspaceAddressStreetPostCode').val();
					oData.streetcountry = $('#ns1blankspaceAddressStreetCountry').val();
					
					oData.mailingaddress1 = $('#ns1blankspaceAddressMailingAddress1').val();
					oData.mailingaddress2 = $('#ns1blankspaceAddressMailingAddress2').val();
					oData.mailingsuburb = $('#ns1blankspaceAddressMailingSuburb').val();
					oData.mailingstate = $('#ns1blankspaceAddressMailingState').val();
					oData.mailingpostcode = $('#ns1blankspaceAddressMailingPostCode').val();
					oData.mailingcountry = $('#ns1blankspaceAddressMailingCountry').val();
				}
				
				if (Object.keys(oData).length > 0)
				{
					oData.id = (ns1blankspace.objectContext == -1) ? '':ns1blankspace.objectContext;
					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI('PRODUCT_ORDER_MANAGE'),
						data: oData,
						dataType: 'json',
						success: ns1blankspace.order.save.process
					});
				}
			}
		},

		process:	function (oResponse)
		{
			if (oResponse.status == 'OK')
			{
				ns1blankspace.status.message('Saved');
				if (ns1blankspace.objectContext == -1) {var bNew = true}
				ns1blankspace.objectContext = oResponse.id;

				if (bNew)
				{
					ns1blankspace.inputDetected = false;
					ns1blankspace.order.search.send('-' + ns1blankspace.objectContext, {source: 1});
				}	
			}
			else
			{
				ns1blankspace.status.error(oResponse.error.errornotes);
			}
		}
	},

	deliveries: 
	{
		show:		function (oParam, oResponse)
		{
			var sXHTMLElementID = 'ns1blankspaceMainDelivery';
			
			if (oParam != undefined)
			{
				if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
			}

			if (oResponse == undefined)
			{
				var aHTML = [];
			
				aHTML.push('<table class="ns1blankspaceContainer">' +
								'<tr class="ns1blankspaceContainer">' +
								'<td id="ns1blankspaceDeliveryColumn1" class="ns1blankspaceColumn1"></td>' +
								'<td id="ns1blankspaceDeliveryColumn2" class="ns1blankspaceColumn2"></td>' +
								'</tr>' + 
								'</table>');
				
				$('#' + sXHTMLElementID).html(aHTML.join(''));
				
				$('#ns1blankspaceOrderDeliveryAdd').button(
				{
					label: "Add"
				})
				.click(function() {
					ns1blankspaceOrderDeliveryPick();
				})
				.css('width', '75px')
				
				var oSearch = new AdvancedSearch();
				oSearch.method = 'PRODUCT_ORDER_DELIVERY_SEARCH';
				oSearch.addField('reference,deliverydate,notes');
				oSearch.addFilter('order', 'EQUAL_TO', ns1blankspace.objectContext);
				oSearch.getResults(function(data) {ns1blankspace.order.deliveries.show(oParam, data)});	
			}
			else
			{	
				var aHTML = [];
					
				if (oResponse.data.rows.length == 0)	
				{
					aHTML.push('<table><tr><td class="ns1blankspaceNothing">No deliveries.</td></tr></table>');

					$('#ns1blankspaceDeliveryColumn1').html(aHTML.join(''));		
				}
				else
				{
				
					aHTML.push('<table class="ns1blankspaceContainer">');
					aHTML.push('<tr class="ns1blankspaceCaption">');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">Date</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">Notes</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
					aHTML.push('</tr>');
						
					$.each(oResponse.data.rows, function() 
					{
						aHTML.push(ns1blankspace.order.deliveries.row(this));
					});
					
					aHTML.push('</table>');

					ns1blankspace.render.page.show(
					{
						xhtmlElementID: 'ns1blankspaceDeliveryColumn1',
						xhtmlContext: 'OrderDelivery',
						xhtml: aHTML.join(''),
						showMore: (oResponse.morerows == "true"),
						more: oResponse.moreid,
						rows: ns1blankspace.option.defaultRows,
						functionShowRow: ns1blankspace.order.deliveries.row,
						type: 'json'
					}); 	
				
				}
			}	
		},

		row:		function (oRow)
		{
			var aHTML = [];

			aHTML.push('<tr class="ns1blankspaceRow">');
									
			aHTML.push('<td id="ns1blankspaceOrderDelivery_deliverydate-' + oRow.id + '" class="ns1blankspaceRow">' +
									oRow.deliverydate + '</td>');						
										
			aHTML.push('<td id="ns1blankspaceOrderDelivery_notes-' + oRow.id + '" class="ns1blankspaceRow">' +
									oRow.notes + '</td>');	
																
			aHTML.push('<td id="ns1blankspaceOrderDelivery-' + oRow.id + '" class="ns1blankspaceRowSelect">&nbsp;</td>');
									
			aHTML.push('</tr>');	
			
			return aHTML.join('');
		}
	},
				
	pick: 		
	{
		show:		function (oParam, oResponse)
		{
			var sXHTMLElementID = 'ns1blankspaceMainDeliveryPick';
			
			if (oParam != undefined)
			{
				if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
			}

			if (oResponse == undefined)
			{
				var aHTML = [];
				
				aHTML.push('<table class="ns1blankspaceContainer">' +
								'<tr class="ns1blankspaceContainer">' +
								'<td id="ns1blankspaceDeliveryPickColumn1" class="ns1blankspaceColumn1"></td>' +
								'<td id="ns1blankspaceDeliveryPickColumn2" class="ns1blankspaceColumn2" style="width: 100px;"></td>' +
								'</tr>' + 
								'</table>');		
				
				$('#' + sXHTMLElementID).html(aHTML.join(''));
				
				var oSearch = new AdvancedSearch();
				oSearch.method = 'PRODUCT_ORDER_DELIVERY_ITEM_SEARCH';
				oSearch.addField('producttext,quantity');
				oSearch.addFilter('order', 'EQUAL_TO', ns1blankspace.objectContext);
				oSearch.getResults(function(data) {ns1blankspace.order.pick(oParam, data)});	
			}
			else
			{	
				var aHTML = [];
				
				aHTML.push('<table class="ns1blankspaceMainColumn2">');
				
				aHTML.push('<tr><td class="ns1blankspaceMainAction">' +
								'<span id="ns1blankspaceOrderPickPrint">Print</span>' +
								'</td></tr>');
								
				aHTML.push('</table>');					
				
				$('#ns1blankspaceDeliveryPickColumn2').html(aHTML.join(''));
				
				$('#ns1blankspaceOrderPickPrint').button(
				{
					label: "Print"
				})
				.click(function() {
					alert("Show delivery docket");
				})
				.css('width', '75px')
				
				var aHTML = [];
					
				if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<table><tr><td class="ns1blankspaceNothing">Nothing to pick.</td></tr></table>');

					$('#ns1blankspaceDeliveryPickColumn1').html(aHTML.join(''));	
				}
				else
				{
					aHTML.push('<table id="ns1blankspaceOrderPick" class="ns1blankspaceContainer">');
					aHTML.push('<tr class="ns1blankspaceCaption">');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">Product</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Quantity Ordered</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Already Delivered</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">This street</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
					aHTML.push('</tr>');
						
					$.each(oResponse.data.rows, function() 
					{ 
						aHTML.push(ns1blankspace.order.pick.row(this));
					});
					
					aHTML.push('</table>');

					ns1blankspace.render.page.show(
					{
						xhtmlElementID: 'ns1blankspaceDeliveryPickColumn1',
						xhtmlContext: 'OrderDeliveryPick',
						xhtml: aHTML.join(''),
						showMore: (oResponse.morerows == "true"),
						more: oResponse.moreid,
						rows: ns1blankspace.option.defaultRows,
						functionShowRow: ns1blankspace.order.pick.row,
						type: 'json'
					}); 	
				}
			}	
		},	

		row:		function (oRow)
		{
			var aHTML = [];
			
			aHTML.push('<tr class="ns1blankspaceRow">');
									
			aHTML.push('<td id="ns1blankspaceDeliveryPick_title-' + oRow.id + '" class="ns1blankspaceRow">' +
									oRow.producttext + '</td>');
									
			aHTML.push('<td id="ns1blankspaceDeliveryPick_units-' + oRow.id + '" class="ns1blankspaceRow"' +
									' style="text-align:right;">' +
									oRow.quantity + '</td>');						
										
			aHTML.push('<td id="ns1blankspaceDeliveryPick_price-' + oRow.id + '" class="ns1blankspaceRow"' +
									' style="text-align:right;"></td>');	

			aHTML.push('<td id="ns1blankspaceDeliveryPick_totalprice-' + oRow.id + '" class="ns1blankspaceRow"' +
									' style="text-align:right;"></td>');						
																
			aHTML.push('<td id="ns1blankspaceDeliveryPick-' + oRow.id + '" class="ns1blankspaceRowSelect">&nbsp;</td>');
									
			aHTML.push('</tr>');	
			
			return aHTML.join('');
		}
	},
				
	invoices: 	
	{
		show:		function (oParam, oResponse)
		{
			var sXHTMLElementID = 'ns1blankspaceMainInvoices';
			
			if (oParam != undefined)
			{
				if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
			}

			if (oResponse == undefined)
			{
				var aHTML = [];
				
				aHTML.push('<table class="ns1blankspaceContainer">' +
								'<tr class="ns1blankspaceContainer">' +
								'<td id="ns1blankspaceInvoicesColumn1" class="ns1blankspaceColumn1Flexible">' +
								ns1blankspace.xhtml.loading + '</td>' +
								'<td id="ns1blankspaceInvoicesColumn2" class="ns1blankspaceColumn2" style="width: 100px;"></td>' +
								'</tr>' + 
								'</table>');
							
				$('#' + sXHTMLElementID).html(aHTML.join(''));
				
				$('#ns1blankspaceOrderInvoicesAdd').button(
				{
					label: "Add"
				})
				.click(function() {
					alert("Add Invoice");
				})
				.css('width', '75px')
				
				var oSearch = new AdvancedSearch();
				oSearch.method = 'PRODUCT_ORDER_DELIVERY_SEARCH';
				oSearch.addField('reference');
				oSearch.addFilter('order', 'EQUAL_TO', ns1blankspace.objectContext);
				oSearch.getResults(function(oResponse)
				{	
					var aID = [];
					
					if (oResponse.data.rows.length == 0)
					{
						$('#ns1blankspaceInvoicesColumn1').html('<table style="margin-top:15px; margin-bottom:15px;">' +
									'<tr><td class="ns1blankspaceNothing">No invoices for this order.<br /><br />');
					}	
					else
					{	
						$.each(oResponse.data.rows, function() 
						{
							aID.push(this.id);
						});
						
						var oSearch = new AdvancedSearch();
						oSearch.method = 'FINANCIAL_INVOICE_SEARCH';
						oSearch.addField('contactbusinesssenttotext,contactbusinesssentto,contactpersonsenttotext,contactpersonsentto,' +
											'projecttext,project,areatext,area,' +
											'reference,purchaseorder,sentdate,duedate,description,amount,tax,sent');

						oSearch.addFilter('object', 'EQUAL_TO', 51);
						oSearch.addFilter('objectcontext', 'IN_LIST', aID.join(','));
						oSearch.addOperator('or');
						oSearch.addFilter('object', 'EQUAL_TO', ns1blankspace.object);
						oSearch.addFilter('objectcontext', 'EQUAL_TO', ns1blankspace.objectContext);
					
						oSearch.getResults(function(data) {ns1blankspace.order.invoices.show(oParam, data)});
					}	
				});	
			}
			else
			{	
				var aHTML = [];
					
				if (oResponse.data.rows.length == 0)	
				{
					aHTML.push('<table style="margin-top:15px; margin-bottom:15px;">' +
									'<tr><td class="ns1blankspaceNothing">No invoices for this order.<br /><br />');
					
					if (ns1blankspace.objectContextData.status == 2)
					{
						aHTML.push('Click <strong>submit</strong> and then <strong>finalise</strong> in the summary section to create the invoice.</td>');
					}
					else
					{
						aHTML.push('Click <strong>finalise</strong> in the summary section to create the invoice.</td>');
					}
						
					aHTML.push('</tr>');

					aHTML.push('</table>');

					$('#ns1blankspaceInvoicesColumn1').html(aHTML.join(''));		
				}
				else
				{
					aHTML.push('<table id="ns1blankspaceOrderInvoices" class="ns1blankspaceContainer">');
					aHTML.push('<tr class="ns1blankspaceCaption">');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">Reference</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Date</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption" style="text-align:right;">Amount</td>');
					aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
					aHTML.push('</tr>');
						
					$.each(oResponse.data.rows, function() 
					{
						aHTML.push(ns1blankspace.order.invoices.row(this));
					});
					
					aHTML.push('</table>');

					ns1blankspace.render.page.show(
					{
						xhtmlElementID: 'ns1blankspaceInvoicesColumn1',
						xhtmlContext: 'OrderInvoices',
						xhtml: aHTML.join(''),
						showMore: (oResponse.morerows == "true"),
						more: oResponse.moreid,
						rows: ns1blankspace.option.defaultRows,
						functionShowRow: ns1blankspace.order.invoices.row,
						functionNewPage: 'ns1blankspace.order.invoices.bind()',
						type: 'json'
					}); 	
				
					ns1blankspace.order.invoices.bind();
				}
			}	
		},

		row:		function (oRow)
		{
			var aHTML = [];
		
			aHTML.push('<tr class="ns1blankspaceRow">');
									
			aHTML.push('<td id="ns1blankspaceOrderInvoices_title-' + oRow.id + '" class="ns1blankspaceRow">' +
									oRow.reference + '</td>');
									
			aHTML.push('<td id="ns1blankspaceOrderInvoices_quantity-' + oRow.id + '" class="ns1blankspaceRow"' +
									' style="text-align:right;">' +
									oRow.sentdate + '</td>');						
										
			aHTML.push('<td id="ns1blankspaceOrderInvoices_price-' + oRow.id + '" class="ns1blankspaceRow"' +
									' style="text-align:right;">' +
									oRow.amount + '</td>');	
																
			aHTML.push('<td style="width:30px;text-align:right;" class="ns1blankspaceRow">' + 
							'<span id="ns1blankspaceOrderInvoices_view-' + oRow.id + '" class="ns1blankspaceRowView"></span></td>');
																			
			aHTML.push('</tr>');							
			
			return aHTML.join('');
		},

		bind:		function ()
		{
			$('#ns1blankspaceOrderInvoices span.ns1blankspaceRowView').button( {
						text: false,
						icons: {
							primary: "ui-icon-play"
						}
			})
			.click(function() {
				var sID = this.id;
				var aID = sID.split('-');
					
				ns1blankspace.financial.invoice.init({id: aID[1]});
			})
			.css('width', '15px')
			.css('height', '17px');
		}
	}
}								