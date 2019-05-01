/*!
 * Copyright 2010, ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed under the MIT license.
 * http://1blankspace.com/license
 * 01 FEB 2010
 */
 
/*!
Report parameter documentation:

	** For all possible columns that could be included in the report, the name values must all be unique. 
	** They can be made up names (ie: not representing actual table columns) but they MUST be unique.

	name: Name of the report - must be unique

	object: 	numeric - Object id of method used for search. Maps to values in CORE_OBJECT_SEARCH. 

	summary: 	A test description of the report

	objectName: prefix used by the related method. Eg: CONTACT_BUSINESS_SEARCH would have "contactbusiness" as the objectName

	method: 	name of the base method to be used in the search - include the _SEARCH part. 
				If using advanced search from viewport selector, it will list any reports where the method in the init function matches this (excluding the _SEARCH)

	returnParameters: list of prefixes and subsearches, comma delimited. Eg: for CONTACT_BUSINESS_SEARCH without sub-searches, just use "contactbusiness".
				If you want to include contactperson as a subsearch, use "contactbusiness,contactbusiness.contactperson"

	category: 	
	scriptOpen: [optional] function used to open the record to which the row relates. 
				Eg: ns1blankspace.contactbusiness.search.send (render.page.show will add the id) 

	windowOpen: [optional] has parameters used to open the record in a new window / tab
				eg: "/#/nsFreshcare-admin.audit/id:"  (render.page.show will add the id)

	scriptOnNewPage: script to run on displaying each page. Must be a function;

	scriptNewPage: as per scriptNewPage but can be a string or a function (for backward compatibility)

	scriptBind:  function used to bind the rows. Must be a function. If not defined, uses ns1blankspace.report.search.bind (which relies on scriptOpen & windowOpen)

	scriptReportSearch: function used to override the search - useful for fixed reports where several passes of the data are required to create the output such as summaries
				This function must produce results in a JSON table and have an id column at the least in every row. 
				Entire search result collection is to be put into ns1blankspace.report.data.resultRows and passed to report.search.send as oResponse where oResponse is as if returned from server
			 	  with oResponse.status set to 'OK', oResponse.summary.count set to total rows and oResponse.data.rows set to outputResults
				Report definition must have only fixedParameters (selectable Parameters are ignored) and can have customFilters and customExport format
				In your search Function, populate ns1blankspace.report.data.outputParameters (if different to fixedParameters.fields) and call ns1blankspace.report.search(oParam, oResponse) at end
				The feature DOES NOT work with scriptNewPage and assumes only one page of results

	scriptReportFilters: Fucntion that Optionally overwrites the selection criteria area. Must return html. Will still show customFilters if these are specified

	idColumn: 	specify this if the column that you would use to open the row (by passing it to functionSearch) is not the id of the method. 
				Eg: using CONTACT_PERSON_SEARCH but want to open business' record, use "contactperson.contactbusiness.id"

	rowsPerPage: overrides ns1blankspace.option.defaultRows
	
	showSort: 	true or false (default). Allows user to choose column to use to sort the output

	headerSortDisabled: true or false. By default, users can click on the header column name to sort the report results once displayed. Setting this to true will disable this feature
				default is false (so the header sort is active)

	removeMultiplesAt: If the output will return multiple rows but with the same id and you're only interested in the first of each of these, specify the column that's duplicated

	customExportFormat: {name: <name of export format>}. Export format as defined in ns1blankspace.setup.file["export"].formats
				Alternatively, can just specify in-line format. Most common is:
								{
									headers: 	// how to display headers in export
									{
										captionsAsHeaders: true,
										delimiter: ',',
										surroundWith: '"'
									},
									items: 		// how to display items in export
									{
										delimiter: ',',
										surroundWith: '"'
									}
								},


	customFilters: allows input of user value to be used in the report. Displays at top of report page
				Eg: Want to list all records with a created date this month, x years ago - allows user to specify the x years to be used in the report calculations
				{fields: [{
							name: "yearsago", 		// this becomes ns1blankspace.report.data.yearsago
							type: "Text",			// use this to add class to comparison value: eg: ns1blankspaceText or ns1blankspaceSelect or n1blankspaceDate
							caption: "Created how many years ago?",		// Use for UI
							mandatory: true,		// [optional] Self-explanatory - default is false
							"default": '10'}]		// [optional] Self-explanatory
							getParameters: 			// will use method from returnParamters
							useComparison: 			// will allow user to choose comparison as if they were selecting a filter normally
						}]
				}

	showFixedParameters: true (default) / false. Determines whether user sees the fixed parameter field list or not

	showUpdate: true / false. Override for ns1blankspace.report.showUpdate

	showExport: true / false. Override for ns1blankspace.report.showExport

	showEmail: 	true / false. Override for ns1blankspace.report.showEmail

	showSMS: 	true / false. Override for ns1blankspace.report.showSMS

	autoRun: 	true / false (default). If set to true, report will run automatically when the user clicks on report control

	summary: 	Summary description of report

	fixedParameters: object containing fields and filters that are included in every report.
		{
			fields: 
			[
				{
					groupTitle: text - allows grouping of fields into sections in the list. If using this, don't use any others to define the field
					name: fully prefixed column name. (eg: "contactperson.contactbusiness.abn")
					hidden: true / false (default)
					exportHeader: text containing column header in export (if using in-line customExportFormat)
					headerOnly: true / false (default) - used in conjuction with exportHeader. Useful when the column actually represents a calculated field
					processFunction: function used to calculate the value for this column
					processParameter: object containing any parameters tha need to be passed to processFunction
				}
			],
			filters:
			[
				{
					includeEval: [optional] function used to evaulate whether this filter should be included or not. Often depended on whether a column has been included in report. If so, set this to ns1blankspace.report.fieldIncluded
					includeParameters: [optional] object containing parameters to pass to includeEval. If using fieldIncluded, object is {fields: <comma separated list of column names>}
					name: <column name to filter>
					comparison: applicable comparison
					value1: [optional] <value 1 for comparison>
					value2: [optional] <value 2 for comparison>
					value3: [optional] <value 3 for comparison>
					applyToSubSearch: [optional] 'Y'
				}
			]
			sorts: These sorts are ALWAYS applied prior to applying any user-defined or selectableParameters sort
			[
				{
					name: column name to sort, 
					direction: asc / desc
				} 
			]
		}


	selectableParameters: object containing fields that user can choose to include or use as filters. 
		{
			fields:
			[
				{
					groupTitle: text - allows grouping of fields into sections in the list. If using this, don't use any others to define the field
					name: Must align to table columns. Must be unique across report
					caption: Caption if different to report dictionary
					columns: used if field has look-up - define the columns to be used in the search
					click: [string] used if field has look-up - define function to be called when user chooses an option
					method: used if field has look up but is not defined in returnParameters
					methodFilter: used if field has lookup - define filters to be applied to look-up
				}
			],
			sort: This sort is only applied if the user doesn't choose a specific order and if showSort is true - a user-selected sort overrides this sort.
			{	name: column name to sort, direction: 'asc'	}
		}

*/

if (ns1blankspace.report === undefined) {ns1blankspace.report = {}}

ns1blankspace.report = 
{
	data: {},

	config: {},

	reports: [],

	dictionary: [],

	showUpdate: true,
	showExport: true,
	showEmail: true,
	showSMS: true,

	initData: function (oParam)
	{
		var bAll = true;

		if (oParam != undefined)
		{
			if (oParam.all != undefined) {bAll = oParam.all}
		}
				
		ns1blankspace.report.showUpdate = true;
		ns1blankspace.report.showExport = true;
		ns1blankspace.report.showEmail = true;
		ns1blankspace.report.showSMS = true;

		ns1blankspace.report.reportGroups =
		[
			{id: 1, name: 'Contacts'},
			{id: 2, name: 'Actions & Projects'},
			{id: 3, name: 'Documents'},
			{id: 4, name: 'Products & Orders'},
			{id: 5, name: 'Financials'},
			{id: 6, name: 'Tax'},
			{id: 7, name: 'Support'},
		];

		ns1blankspace.report.reports =
		[
			/* Businesses  
			v2.0.2b Changed ScriptNewpage to ScriptOnNewPage
			*/
			{
				id: 10,
				name: "Businesses",
				object: 12,
				group: 1,
				objectName: "contactbusiness",
				method: "CONTACT_BUSINESS_SEARCH",
				returnParameters: 'contactbusiness,contactbusiness.contactperson',
				functionSearch: ns1blankspace.contactBusiness.search.send,
				scriptOnNewPage: ns1blankspace.report.search.bind,
				scriptOpen: 'ns1blankspace.contactBusiness.init({id: this.id})',
				windowOpen: '/#/contactBusiness/id:',
				showSort: true,
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* People 
			v2.0.2b Changed ScriptNewpage to ScriptOnNewPage
			*/
			{
				id: 20, 
				name: "People",
				group: 1,
				object: 32,
				objectName: "contactperson",
				method: "CONTACT_PERSON_SEARCH",
				returnParameters: 'contactperson,contactperson.contactbusiness',
				functionSearch: ns1blankspace.contactPerson.search.send,
				scriptOnNewPage: ns1blankspace.report.search.bind,
				scriptOpen: 'ns1blankspace.contactPerson.init({id: this.id})',
				windowOpen: '/#/contactPerson/id:',
				showSort: true,
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}								
			},
			/* Relationships */
			{
				id: 30,
				name: 'Relationships',
				group: 1,
				object: 225,
				objectName: 'relationship',
				method: 'CONTACT_RELATIONSHIP_SEARCH',
				returnParameters: 'relationship,' + 
								  'relationship.contactbusiness,' +
								  'relationship.contactperson',
				functionSearch: 'nsFreshcare.admin.relationships.search.send',
				scriptOpen: 'nsFreshcare.admin.relationships.init({id: this.id})',
				windowOpen: '/#/nsFreshcare-admin.relationships/id:',
				showSort: true,
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* Businesses Groups */
			{
				id: 40,
				name: "Business Groups",
				group: 1,
				objectName: "businessgroup",
				method: "CONTACT_BUSINESS_GROUP_SEARCH",
				returnParameters: 'businessgroup,businessgroup.contactbusiness',
				showSort: true,
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* Person Groups */
			{
				id: 50,
				name: "Person Groups",
				group: 1,
				object: 247,
				objectName: "persongroup",
				method: "CONTACT_PERSON_GROUP_SEARCH",
				returnParameters: 'persongroup,persongroup.contactperson,persongroup.contactperson.contactbusiness',
				showSort: true,
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* Opportunities */
			{
				id: 60,
				name: "Opportunities",
				group: 1,
				object: 35,
				objectName: "opportunity",
				method: "OPPORTUNITY_SEARCH",
				returnParameters: 'opportunity,opportunity.contactbusiness,opportunity.contactperson,',
				functionSearch: ns1blankspace.opportunity.search.send,
				scriptOpen: 'ns1blankspace.opportunity.init({id: this.id})',
				windowOpen: '/#/opportunity/id:'
			},
			/* Projects */
			{
				id: 70,
				name: "Projects",
				group: 2,
				object: 1,
				objectName: "project",
				method: "PROJECT_SEARCH",
				returnParameters: 'project,project.contactbusiness,project.contactperson,project.projectmanager,project.projecttask',
				functionSearch: ns1blankspace.project.search.send,
				scriptOpen: 'ns1blankspace.project.init({id: this.id})',
				windowOpen: '/#/project/id:',
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* Project Tasks */
			{
				id: 80,
				name: "Project Tasks",
				group: 2,
				object: 11,
				objectName: "projecttask",
				method: "PROJECT_TASK_SEARCH",
				returnParameters: 'projecttask,projecttask.project',
				functionSearch: ns1blankspace.projectTask.search.send,
				scriptOpen: 'ns1blankspace.projectTask.init({id: this.id})',
				windowOpen: '/#/projectTask/id:',
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* Actions */
			{
				id: 90,
				name: "Actions and Activities",
				group: 2,
				object: 17,
				objectName: "action",
				method: "ACTION_SEARCH",
				returnParameters: 'action,action.contactbusiness,action.contactperson',
				functionSearch: ns1blankspace.action.search.send,
				scriptOpen: 'ns1blankspace.action.init({id: this.id})',
				windowOpen: '/#/action/id:',
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				},
				fixedParameters:
				{
					filters:
					[
						{
							name: 'actiontype',
							comparison: 'NOT_IN_LIST',
							value1: '5,9,10,' + ns1blankspace.data.actionTypes.bulkEmail.id	/*emails & SMS */
						}
					]
				},
				selectableParameters:
				{
					fields:
					[
						{name: "action.contactbusinesstext"},
						{name: "action.contactpersontext"},
						{name: "action.objecttext"},
						{name: "action.actionreference", caption: "Reference"},
						{name: "action.actionbytext", caption: "Action By.."},
						{name: "action.actiontypetext", caption: "Type"},
						{name: "action.duedate", caption: "Action Date"},
						{name: "action.duedatetime", caption: "Action Date & Time"},
						{name: "action.completeddate", caption: "Completed Date"},
						{name: "action.completeddatetime", caption: "Completed Date & Time"},
						{name: "action.billingstatus", caption: "Billing Status"},
						{name: "action.totaltimehrs", caption: "Time (Hours)"},
						{name: "action.prioritytext", caption: "Priority"},
						{name: "action.statustext", caption: "Status"},
						{name: "action.description", caption: "Description"},
						{name: "action.createdusertext", caption:"Action created by"},
						{name: "action.createddate", caption:"Action created on"},
						{name: "action.modifiedusertext", caption:"Action modified by"},
						{name: "action.modifieddate", caption:"Action modified on"}
					]
				}
			},
			/* Actions - Emails */
			{
				id: 100,
				name: "Saved Emails and SMS",
				group: 2,
				object: 17,
				objectName: "action",
				method: "ACTION_SEARCH",
				returnParameters: 'action,action.contactbusiness,action.contactperson,action.recipient',
				functionSearch: ns1blankspace.action.search.send,
				scriptOpen: 'ns1blankspace.action.init({id: this.id})',
				windowOpen: '/#/action/id:',
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				},
				fixedParameters:
				{
					filters:
					[
						{
							name: 'actiontype',
							comparison: 'IN_LIST',
							value1: '5,9,10,' + ns1blankspace.data.actionTypes.bulkEmail.id	/*emails & SMS */
						}
					]
				},
				selectableParameters:
				{
					fields:
					[
						{name: "action.contactbusinesstext", caption: 'Saved to Business'},
						{name: "action.contactpersontext", caption: 'Saved To Person'},
						{name: "action.objecttext"},
						{name: "action.subject", caption: "Subject"},
						{name: "action.actionbytext", caption: "Sent By"},
						{name: "action.actiontypetext", caption: "Type"},
						{name: "action.duedatetime", caption: "Sent / Received Date"},
						{name: "action.recipient.contactbusinesstext"},
						{name: "action.recipient.contactpersontext"},
						{name: "action.recipient.email"},
						{name: "action.recipient.name"},
						{name: "action.recipient.typetext"},
						{name: "action.message", caption: "Message"},
					]
				}
			},
			/* Documents  14*/
			{
				id: 120,
				name: "Documents",
				group: 3,
				object: 14,
				objectName: "document",
				method: "DOCUMENT_SEARCH",
				returnParameters: 'document,document.user',
				functionSearch: ns1blankspace.document.search.send,
				scriptOpen: 'ns1blankspace.document.init({id: this.id})',
				windowOpen: '/#/document/id:',
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				},
				selectableParameters:
				{
					fields:
					[
						{name: "document.id"},
						{name: "document.title"},
						{name: "document.typetext"},
						{name: "document.statustext"},
						{name: "document.url"},
						{name: "document.summary"},
						{name: "document.createdusertext"},
						{name: "document.createddate"},
						{name: "document.modifiedusertext"},
						{name: "document.modifieddate"}
					]
				}
			},			
			/* Attachments 322*/
			{
				id: 120,
				name: "Attachments",
				summary: "Detailed list of attachments. Reference will be available if you select an 'Equal To' comparison for 'Linked To..'",
				group: 3,
				object: 322,
				objectName: "attachment",
				method: "CORE_ATTACHMENT_SEARCH",
				returnParameters: 'attachment,attachment.user',
				scriptOnNewPage: ns1blankspace.report.newPage.attachmentDetail,
				/*functionSearch: ns1blankspace.action.search.send,
				scriptOpen: 'ns1blankspace.action.init({id: this.id})',
				windowOpen: '/#/action/id:',*/
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				},
				fixedParameters:
				{
					fields:
					[
						{name: "attachment.objectcontext", hidden: true},
						{name: "attachment.download", hidden: true},
						{name: "attachment.object", hidden: true},
						{
							name: 'attachment.objectreference',
							headerOnly: true,
							processFunction: ns1blankspace.report.newPage.attachmentDetail,
							headerSortDisabled: true
						}
					]
				},
				selectableParameters:
				{
					fields:
					[
						{name: "attachment.objecttext"},
						{name: "attachment.typetext"},
						{name: "attachment.createdusertext"},
						{name: "attachment.filename"},
						{name: "attachment.createddate"},
						{name: "attachment.description"},
					]
				}
			},
			/* Products  
			v2.0.2b Changed ScriptNewpage to ScriptOnNewPage
			*/
			{
				id: 130,
				name: "Products",
				group: 4,
				object: 16,
				objectName: "product",
				method: "PRODUCT_SEARCH",
				returnParameters: 'product',
				functionSearch: ns1blankspace.product.search.send,
				scriptOnNewPage: ns1blankspace.report.search.bind,
				scriptOpen: 'ns1blankspace.product.init({id: this.id})',
				windowOpen: '/#/product/id:',
				showSort: true,
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* Orders  */
			{
				id: 140,
				name: "Orders",
				group: 4,
				object: 30,
				objectName: "order",
				method: "PRODUCT_ORDER_SEARCH",
				returnParameters: 'order,orderitem,orderitem.product',
				functionSearch: ns1blankspace.order.search.send,
				scriptOnNewPage: ns1blankspace.report.search.bind,
				scriptOpen: 'ns1blankspace.order.init({id: this.id})',
				windowOpen: '/#/order/id:',
				showSort: true,
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* Invoices  
			v2.0.2b Changed ScriptNewpage to ScriptOnNewPage
			*/
			{
				id: 150,
				name: "Invoices",
				group: 5,
				object: 5,
				objectName: "invoice",
				method: "FINANCIAL_INVOICE_SEARCH",
				returnParameters: 'invoice,invoice.lineitem,invoice.lineitem.financialaccount,invoice.invoicereceipt,invoice.contactbusinesssentto',
				functionSearch: ns1blankspace.financial.invoice.search.send,
				scriptOnNewPage: ns1blankspace.report.search.bind,
				scriptOpen: 'ns1blankspace.financial.invoice.init({id: this.id})',
				windowOpen: '/#/financial.invoice/id:',
				showSort: true,
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* Expenses */
			{
				id: 160,
				name: "Expenses",
				group: 5,
				object: 2,
				objectName: "expense",
				method: "FINANCIAL_EXPENSE_SEARCH",
				returnParameters: 'expense,expense.lineitem,expense.expensereceipt',	/*,expense.lineitem.financialaccount*/
				functionSearch: ns1blankspace.financial.expense.search.send,
				scriptOnNewPage: ns1blankspace.report.search.bind,
				scriptOpen: 'ns1blankspace.financial.expense.init({id: this.id})',
				windowOpen: '/#/financial.expense/id:',
				showSort: true,
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* Payments */
			{
				id: 170,
				name: "Payments",
				group: 5,
				object: 3,
				objectName: "payment",
				method: "FINANCIAL_PAYMENT_SEARCH",
				returnParameters: 'payment,payment.lineitem',	/*,payment.lineitem.financialaccount*/
				functionSearch: ns1blankspace.financial.payment.search.send,
				scriptOnNewPage: ns1blankspace.report.search.bind,
				scriptOpen: 'ns1blankspace.financial.payment.init({id: this.id})',
				windowOpen: '/#/financial.payment/id:',
				showSort: true,
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* Receipts */
			{
				id: 180,
				name: "Receipts",
				group: 5,
				object: 6,
				objectName: "receipt",
				method: "FINANCIAL_RECEIPT_SEARCH",
				returnParameters: 'receipt,receipt.lineitem',	/*,payment.lineitem.financialaccount*/
				functionSearch: ns1blankspace.financial.receipt.search.send,
				scriptOnNewPage: ns1blankspace.report.search.bind,
				scriptOpen: 'ns1blankspace.financial.receipt.init({id: this.id})',
				windowOpen: '/#/financial.receipt/id:',
				showSort: true,
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* Credit Notes */
			{
				id: 190,
				name: "Credits",
				group: 5,
				object: 69,
				objectName: "creditnote",
				method: "FINANCIAL_CREDIT_NOTE_SEARCH",
				returnParameters: 'creditnote,creditnote.lineitem,creditnote.contactbusiness,creditnote.contactperson',	
				functionSearch: ns1blankspace.financial.credit.search.send,
				scriptOnNewPage: ns1blankspace.report.search.bind,
				scriptOpen: 'ns1blankspace.financial.credit.init({id: this.id})',
				windowOpen: '/#/financial.credit/id:',
				showSort: true,
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				}
			},
			/* Support Issues By Me
			   v2.0.310 Added new Support Issue fields */
			{	
				id: 200,
				name: "My Support Issues",
				object: '8',
				objectText: 'support',
				objectName: 'supportissue',
				group: 7,
				summary: "This report shows all Support Issues Logged from this space...",
				returnParameters: 'supportissue',
				method: "SUPPORT_ISSUE_SEARCH",
				scriptOnNewPage: ns1blankspace.report.search.bind,
				windowOpen: '/#/ns1blankspace.supportissue/id:',
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				},
				customOptions:
				[
					{option: "showmyloggedissues", value: "Y"}
				],
				selectableParameters: 
				{
					fields:
					[
						{name: "supportissue.reference"},
						{name: "supportissue.title"},
						{name: "supportissue.usertext"},
						{name: "supportissue.description"},
						{name: "supportissue.name"},
						{name: "supportissue.email"},
						{name: "supportissue.phone"},
						{name: "supportissue.typetext"},
						{name: "supportissue.severitytext"},
						{name: "supportissue.statustext"},
						{name: "supportissue.lodgeddate"},
						{name: "supportissue.quotedamount"},
						{name: "supportissue.quotedhours"},
						{name: "supportissue.quoteapproved"},
						{name: "supportissue.versiontext"},
						{name: "supportissue.completeddate"},
						{name: "supportissue.processingtypetext"},
						{name: "supportissue.solution", caption: 'Solution / Notes'},
						{name: "supportissue.modifieddate"},
						{name: "supportissue.modifiedusertext"}
					]
				}		
			},
			/* Support Issues For Me
			   v2.0.310 Added new Support Issue fields */
			{	
				id: 210,
				name: "Customer Support Issues",
				object: '8',
				objectText: 'support',
				objectName: 'supportissue',
				group: 7,
				summary: "This report shows all Support Issues logged for me...",
				returnParameters: 'supportissue',
				method: "SUPPORT_ISSUE_SEARCH",
				scriptOnNewPage: ns1blankspace.report.search.bind,
				windowOpen: '/#/ns1blankspace.supportissue/id:',
				customExportFormat:
				{
					headers:
					{
						captionsAsHeaders: true,
						delimiter: ',',
						surroundWith: '"'
					},
					items:
					{
						delimiter: ',',
						surroundWith: '"'
					}
				},
				customOptions:
				[
					{option: "showmyloggedissues", value: "N"}
				],
				selectableParameters: 
				{
					fields:
					[
						{name: "supportissue.contactbusinesstext"},
						{name: "supportissue.contactpersontext"},
						{name: "supportissue.reference"},
						{name: "supportissue.title"},
						{name: "supportissue.usertext"},
						{name: "supportissue.description"},
						{name: "supportissue.name"},
						{name: "supportissue.email"},
						{name: "supportissue.phone"},
						{name: "supportissue.typetext"},
						{name: "supportissue.severitytext"},
						{name: "supportissue.statustext"},
						{name: "supportissue.lodgeddate"},
						{name: "supportissue.quotedamount"},
						{name: "supportissue.quotedhours"},
						{name: "supportissue.quoteapproved"},
						{name: "supportissue.versiontext"},
						{name: "supportissue.completeddate"},
						{name: "supportissue.processingtypetext"},
						{name: "supportissue.solution", caption: 'Solution / Notes'},
						{name: "supportissue.technicalnotes", caption: 'Technical Notes'},
						{name: "supportissue.modifieddate"},
						{name: "supportissue.modifiedusertext"}
					]
				}		
			}
		]		

		ns1blankspace.report.dictionary =
		[ 
			{name: "contactbusiness.tradename", caption: "Trading Name"},
			{name: "contactbusiness.legalname", caption: "Company Name"},
			{name: "contactbusiness.abn", caption: "ABN"},
			{name: "contactbusiness.webaddress", caption: "Website"},
			{name: "contactbusiness.phonenumber", caption: "Phone"},
			{name: "contactbusiness.faxnumber", caption: "Fax"},
			{name: "contactbusiness.customerstatustext", caption: "Customer Status"},
			{name: "contactbusiness.supplierstatustext", caption: "Supplier Status"},
			{name: "contactbusiness.industrytext", caption: "Industry"},
			{name: "contactbusiness.streetaddresscombined", caption: "Street Address"},
			{name: "contactbusiness.streetaddress1", caption: "Street Address 1"},
			{name: "contactbusiness.streetaddress2", caption: "Street Address 2"},
			{name: "contactbusiness.streetsuburb", caption: "Street Suburb"},
			{name: "contactbusiness.streetstate", caption: "Street State"},
			{name: "contactbusiness.streetpostcode", caption: "Street Postcode"},
			{name: "contactbusiness.streetcountry", caption: "Street Country"},
			{name: "contactbusiness.mailingaddresscombined", caption: "Mailing Address"},
			{name: "contactbusiness.mailingaddress1", caption: "Mailing Address 1"},
			{name: "contactbusiness.mailingaddress2", caption: "Mailing Address 2"},
			{name: "contactbusiness.mailingsuburb", caption: "Mailing Suburb"},
			{name: "contactbusiness.mailingstate", caption: "Mailing State"},
			{name: "contactbusiness.mailingpostcode", caption: "Mailing Postcode"},
			{name: "contactbusiness.mailingcountry", caption: "Mailing Country"},
			{name: "contactbusiness.notes", caption: "Notes"},
			{name: "contactbusiness.reference", caption: "Reference"},
			{name: "contactbusiness.areatext", caption: "Business Area"},
			{name: "contactbusiness.primarycontactpersontext", caption: "Primary Contact"},
			{name: "contactbusiness.businessgrouptext", caption: "Group"},
			{name: "contactbusiness.contactperson.firstname", caption: "Primary Contact First Name"},
			{name: "contactbusiness.contactperson.surname", caption: "Primary Contact Surname"},
			{name: "contactbusiness.contactperson.email", caption: "Primary Contact Email"},
			{name: "contactbusiness.createdusertext", caption: "Created By"},
			{name: "contactbusiness.createddate", caption: "Created Date"},
			{name: "contactbusiness.modifiedusertext", caption: "Last Modified By"},
			{name: "contactbusiness.modifieddate", caption: "Last Modified Date"},
			
			{name: "contactperson.surname", caption: "Surname"},
			{name: "contactperson.titletext", caption: "Title"},
			{name: "contactperson.gendertext", caption: "Gender"},
			{name: "contactperson.firstname", caption: "First Name"},
			{name: "contactperson.position", caption: "Position"},
			{name: "contactperson.workphone", caption: "Phone"},
			{name: "contactperson.fax", caption: "Fax"},
			{name: "contactperson.mobile", caption: "Mobile"},
			{name: "contactperson.email", caption: "Email"},
			{name: "contactperson.customerstatustext", caption: "Customer Status"},
			{name: "contactperson.supplierstatustext", caption: "Supplier Status"},
			{name: "contactperson.streetaddresscombined", caption: "Street Address"},
			{name: "contactperson.streetaddress1", caption: "Street Address 1"},
			{name: "contactperson.streetaddress2", caption: "Street Address 2"},
			{name: "contactperson.streetsuburb", caption: "Street Suburb"},
			{name: "contactperson.streetstate", caption: "Street State"},
			{name: "contactperson.streetpostcode", caption: "Street Postcode"},
			{name: "contactperson.streetcountry", caption: "Street Country"},
			{name: "contactperson.mailingtitle", caption: "Mailing Name"},
			{name: "contactperson.mailingaddresscombined", caption: "Mailing Address"},
			{name: "contactperson.mailingaddress1", caption: "Mailing Address 1"},
			{name: "contactperson.mailingaddress2", caption: "Mailing Address 2"},
			{name: "contactperson.mailingsuburb", caption: "Mailing Suburb"},
			{name: "contactperson.mailingstate", caption: "Mailing State"},
			{name: "contactperson.mailingpostcode", caption: "Mailing Postcode"},
			{name: "contactperson.mailingcountry", caption: "Mailing Country"},
			{name: "contactperson.persongrouptext", caption: "Group"},
			{name: "contactperson.primarycontactfortext", caption: "Primary Contact For"},
			{name: "contactperson.contactbusinesstext", caption: "Business Name"},
			{name: "contactperson.contactbusiness.tradename", caption: "Business Trading Name"},
			{name: "contactperson.contactbusiness.legalname", caption: "Business Legal Name"},
			{name: "contactperson.contactbusiness.mailingaddress1", caption: "Business Mailing Address 1"},
			{name: "contactperson.contactbusiness.mailingaddress2", caption: "Business Mailing Address 2"},
			{name: "contactperson.contactbusiness.mailingsuburb", caption: "Business Mailing Suburb"},
			{name: "contactperson.contactbusiness.mailingstate", caption: "Business Mailing State"},
			{name: "contactperson.contactbusiness.mailingpostcode", caption: "Business Mailing Postcode"},
			{name: "contactperson.contactbusiness.mailingcountry", caption: "Business Mailing Country"},
			{name: "contactperson.contactbusiness.streetaddress1", caption: "Business Street Address 1"},
			{name: "contactperson.contactbusiness.streetaddress2", caption: "Business Street Address 2"},
			{name: "contactperson.contactbusiness.streetsuburb", caption: "Business Street Suburb"},
			{name: "contactperson.contactbusiness.streetstate", caption: "Business Street State"},
			{name: "contactperson.contactbusiness.streetpostcode", caption: "Business Street Postcode"},
			{name: "contactperson.contactbusiness.streetcountry", caption: "Business Street Country"},
			{name: "contactperson.createdusertext", caption: "Created By"},
			{name: "contactperson.createddate", caption: "Created Date"},
			{name: "contactperson.modifiedusertext", caption: "Last Modified By"},
			{name: "contactperson.modifieddate", caption: "Last Modified Date"},
					
			{name: "relationship.contactbusinesstext", caption: 'Business'},
			{name: "relationship.contactpersontext", caption: 'Person'},
			{name: "relationship.typetext", caption: 'Is..'},
			{name: "relationship.othercontactbusinesstext", caption: 'For Business'},
			{name: "relationship.othercontactpersontext", caption: 'For Person'},
			{name: "relationship.description", caption: 'Description'},
			{name: "relationship.startdate", caption: 'Start Date'},
			{name: "relationship.enddate", caption: 'End Date'},


			{name: "opportunity.lodgeddate", caption: "Date Received"},
			{name: "opportunity.managerusertext", caption: "Managed By"},
			{name: "opportunity.sourcetext", caption: "Source of Contact"},
			{name: "opportunity.description", caption: "Description"},
			{name: "opportunity.statustext", caption: "Quote Status"},
			{name: "opportunity.phone", caption: "Business Phone"},
			{name: "opportunity.mobile", caption: "Mobile Phone"},
			{name: "opportunity.email", caption: "Contact Email"},
			{name: "opportunity.businessname", caption: "Business Name"},
			{name: "opportunity.firstname", caption: "First Name"},
			{name: "opportunity.surname", caption: "Surname"},
			{name: "opportunity.mailingaddress1", caption: "Mailing Address 1"},
			{name: "opportunity.mailingaddress2", caption: "Mailing Address 2"},
			{name: "opportunity.mailingsuburb", caption: "Mailing Address Suburb"},
			{name: "opportunity.mailingstate", caption: "Mailing State"},
			{name: "opportunity.mailingpostcode", caption: "Mailing  Postcode"},
			{name: "opportunity.mailingcountry", caption: "Mailing Country"},
			{name: "opportunity.contactbusiness.tradename", caption: "Business Trading Name"},
			{name: "opportunity.contactbusiness.legalname", caption: "Business Legal Name"},
			{name: "opportunity.contactperson.firstname", caption: "Business Contact First Name"},
			{name: "opportunity.contactperson.surname", caption: "Business Contact Surname"},
			{name: "opportunity.contactperson.firstname", caption: "Business Contact First Name"},
			{name: "opportunity.contactperson.phone", caption: "Business Phone"},
			{name: "opportunity.contactperson.mobile", caption: "Mobile Phone"},
			{name: "opportunity.contactperson.email", caption: "Contact Email"},
			{name: "opportunity.contactperson.streetaddresscomplete", caption: "Street Address (All)"},
			{name: "opportunity.contactperson.streetaddresscombined", caption: "Street Address"},
			{name: "opportunity.contactperson.streetaddress1", caption: "Street Address 1"},
			{name: "opportunity.contactperson.streetaddress2", caption: "Street Address 2"},
			{name: "opportunity.contactperson.streetsuburb", caption: "Street Address Suburb"},
			{name: "opportunity.contactperson.streetstate", caption: "Street Address State"},
			{name: "opportunity.contactperson.streetpostcode", caption: "Street Address Postcode"},
			{name: "opportunity.contactperson.mailingaddresscomplete", caption: "Mailing Address (All)"},
			{name: "opportunity.contactperson.mailingaddresscombined", caption: "Mailing Address"},
			{name: "opportunity.contactperson.mailingaddress1", caption: "Mailing Address 1"},
			{name: "opportunity.contactperson.mailingaddress2", caption: "Mailing Address 2"},
			{name: "opportunity.contactperson.mailingsuburb", caption: "Mailing Address Suburb"},
			{name: "opportunity.contactperson.mailingstate", caption: "Mailing Address State"},
			{name: "opportunity.contactperson.mailingpostcode", caption: "Mailing Address Postcode"},
			{name: "opportunity.createdusertext", caption: "Created By"},
			{name: "opportunity.createddate", caption: "Created Date"},
			{name: "opportunity.modifiedusertext", caption: "Last Modified By"},
			{name: "opportunity.modifieddate", caption: "Last Modified Date"},

			{name: "project.contactbusinesstext", caption: "Business"},
			{name: "project.contactpersontext", caption: "Person"},
			{name: "project.description", caption: "Description"},
			{name: "project.typetext", caption: "Project Type"},
			{name: "project.categorytext", caption: "Project Category"},
			{name: "project.styletext", caption: "Project Style"},
			{name: "project.statustext", caption: "Status"},
			{name: "project.startdate", caption: "Start Date"},
			{name: "project.enddate", caption: "End Date"},
			{name: "project.template", caption: "Template?"},
			{name: "project.contactbusinesstext", caption: "Business"},
			{name: "project.projectmanagertext", caption: "Project Manager"},
			{name: "project.percentagecomplete", caption: "% Complete"},
			{name: "project.totaltime", caption: "Total Time"},
			{name: "project.projecttask.reference", caption: "Task Reference"},
			{name: "project.projecttask.title", caption: "Task Title"},
			{name: "project.projecttask.prioritytext", caption: "Task Priority"},
			{name: "project.projecttask.statustext", caption: "Task Status"},
			{name: "project.projecttask.taskbyusertext", caption: "Task Owner"},
			{name: "project.createdusertext", caption: "Created By"},
			{name: "project.createddate", caption: "Created Date"},
			{name: "project.modifiedusertext", caption: "Last Modified By"},
			{name: "project.modifieddate", caption: "Last Modified Date"},

			{name: "projecttask.projecttext", caption: "Project Reference"},
			{name: "projecttask.project.description", caption: "Project Description"},
			{name: "projecttask.project.contactbusinesstext", caption: "Project Business"},
			{name: "projecttask.project.contactpersontext", caption: "Project Person"},
			{name: "projecttask.reference", caption: "Reference"},
			{name: "projecttask.title", caption: "Title"},
			{name: "projecttask.prioritytext", caption: "Priority"},
			{name: "projecttask.statustext", caption: "Status"},
			{name: "projecttask.taskbyusertext", caption: "Owner"},
			{name: "projecttask.startdate", caption: "Start Date"},
			{name: "projecttask.enddate", caption: "End Date"},
			{name: "projecttask.duration", caption: "Duration"},
			{name: "projecttask.actualenddate", caption: "Actual End"},
			{name: "projecttask.timespent", caption: "Time"},
			{name: "projecttask.dependsontasktext", caption: "Depends On.."},
			{name: "projecttask.milestone", caption: "Milestone?"},
			{name: "projecttask.description", caption: "Description"},

			{name: "product.reference", caption: "Reference"},
			{name: "product.title", caption: "Title"},
			{name: "product.typetext", caption: "Type"},
			{name: "product.description", caption: "Description"},
			{name: "product.categorytext", caption: "Category"},
			{name: "product.statustext", caption: "Status"},
			{name: "product.currentretailprice", caption: "Retail Price"},
			{name: "product.financialaccounttext", caption: "Financial Account"},
			{name: "product.unittypetext", caption: "Unit Type"},
			{name: "product.units", caption: "Units"},
			{name: "product.createdusertext", caption: "Created By"},
			{name: "product.createddate", caption: "Created Date"},
			{name: "product.modifiedusertext", caption: "Last Modified By"},
			{name: "product.modifieddate", caption: "Last Modified Date"},

			{name: "order.orderbybusinesstext", caption: "Order by Business"},
			{name: "order.orderbypersontext", caption:"Order by Person"},
			{name: "order.billtobusinesstext", caption:"Bill to Business"},
			{name: "order.billtopersontext", caption:"Bill to Person"},
			{name: "order.salespersontext", caption:"Sales Person"},
			{name: "order.projecttext", caption:"Project"},
			{name: "order.reference", caption:"Order number"},
			{name: "order.purchaseorder", caption:"Purchase Order Number"},
			{name: "order.orderdate", caption:"Date Ordered"},
			{name: "order.deliverydate", caption:"Delivery Date"},
			{name: "order.statustext", caption:"Order Status"},
			{name: "order.processingstatustext", caption:"Processing Status"},
			{name: "order.sourcetext", caption:"Source of Order"},
			{name: "order.notes", caption:"Notes"},
			{name: "order.streetaddress1", caption:"Delivery Address (Line 1)"},
			{name: "order.streetaddress2", caption:"Delivery Address (Line 2)"},
			{name: "order.streetsuburb", caption:"Delivery Suburb"},
			{name: "order.streetstate", caption:"Delivery State"},
			{name: "order.streetpostcode", caption:"Delivery Post Code"},
			{name: "order.streetpostcode", caption:"Delivery Country"},
			{name: "order.mailingaddress1", caption:"Billing Address (Line 1)"},
			{name: "order.mailingaddress2", caption:"Billing Address (Line 2)"},
			{name: "order.mailingsuburb", caption:"Billing Suburb"},
			{name: "order.mailingstate", caption:"Billing State"},
			{name: "order.mailingpostcode", caption:"Billing Post Code"},
			{name: "order.mailingpostcode", caption:"Billing Country"},
			{name: "order.orderitem.product.reference", caption:"Product Code"},
			{name: "order.orderitem.producttext", caption:"Product Name"},
			{name: "order.orderitem.pricetypetexttext", caption:"Price Type"},
			{name: "order.orderitem.quantity", caption:"Quantity"},
			{name: "order.orderitem.unitcost", caption:"Unit Cost"},
			{name: "order.orderitem.totalcost", caption:"Total Cost"},
			{name: "order.orderitem.totaltax", caption:"GST"},
			{name: "order.createdusertext", caption:"Order logged by"},
			{name: "order.createddate", caption:"Order logged on"},
			{name: "order.modifiedbyusertext", caption:"Order modified by"},
			{name: "order.modifieddate", caption:"Order modified on"},

			{name: "action.contactbusinesstext", caption: "Business"},
			{name: "action.contactpersontext", caption: "Person"},
			{name: "action.objecttext", caption: "Linked to.."},
			{name: "action.actionreference", caption: "Reference"},
			{name: "action.actionby", caption: "Action By.."},
			{name: "action.actiontypetext", caption: "Type"},
			{name: "action.duedate", caption: "Action Date"},
			{name: "action.duedatetime", caption: "Action Date & Time"},
			{name: "action.completeddate", caption: "Completed Date"},
			{name: "action.completeddatetime", caption: "Completed Date & Time"},
			{name: "action.billingstatustext", caption: "Billing Status"},
			{name: "action.totaltimehrs", caption: "Time (Hours)"},
			{name: "action.description", caption: "Description"},
			{name: "action.prioritytext", caption: "Priority"},
			{name: "action.statustext", caption: "Status"},
			{name: 'action.message', caption: "Message Text"},
			{name: 'action.recipient.contactbusinesstext', caption: "Recipient Business"},
			{name: 'action.recipient.contactpersontext', caption: "Recipient Person"},
			{name: 'action.recipient.typetext', caption: "Recipient Type"},
			{name: 'action.recipient.email', caption: "Recipient Email"},
			{name: 'action.recipient.name', caption: "Recipient Alias"},
			{name: "action.createdusertext", caption:"Action created by"},
			{name: "action.createddate", caption:"Action created on"},
			{name: "action.modifiedbyusertext", caption:"Action modified by"},
			{name: "action.modifieddate", caption:"Action modified on"},

			{name: 'attachment.objecttext', caption: "Linked To.."},
			{name: 'attachment.typetext', caption: "Attachment Type"},
			{name: 'attachment.createdusertext', caption: "Attached By User"},
			{name: 'attachment.createddate', caption: "Attached On"},
			{name: 'attachment.filename', caption: "File Name"},
			{name: 'attachment.description', caption: "Description"},
			{name: 'attachment.objectreference', caption: 'Reference'},

			{name: "document.id", caption: "Document ID"},
			{name: "document.title", caption: "Title"},
			{name: "document.typetext", caption: "Document Type"},
			{name: "document.statustext", caption: "Status"},
			{name: "document.url", caption: "URL"},
			{name: "document.summary", caption: "Summary"},
			{name: "document.createdusertext", caption: "Created By"},
			{name: "document.createddate", caption: "Created On"},
			{name: "document.modifiedusertext", caption: "Modified By"},
			{name: "document.modifieddate", caption: "Modified On"},

			{name: "supportissue.reference", caption: "Reference"},
			{name: "supportissue.title", caption: "Title"},
			{name: "supportissue.usertext", caption: "Sent To"},
			{name: "supportissue.description", caption: "Description"},
			{name: "supportissue.name", caption: "Logged By"},
			{name: "supportissue.email", caption: "Email"},
			{name: "supportissue.phone", caption: "Phone"},
			{name: "supportissue.typetext", caption: "Type"},
			{name: "supportissue.severitytext", caption: "Severity"},
			{name: "supportissue.statustext", caption: "Status"},
			{name: "supportissue.se2057", caption: "Estimated Hours"},
			{name: "supportissue.se2058text", caption: "Hours Approved"},
			{name: "supportissue.se2053", caption: "Version"},
			{name: "supportissue.se2056text", caption: "Sent to Advisor"},
			{name: "supportissue.lodgeddate", caption: "Date Lodged"},
			{name: "supportissue.quotedamount", caption: "Quoted Amount"},
			{name: "supportissue.quotedhours", caption: "Quoted Hours"},
			{name: "supportissue.quoteapproved", caption: "Quote Approved?"},
			{name: "supportissue.versiontext", caption: "Version Number"},
			{name: "supportissue.completeddate", caption: "Completed"},
			{name: "supportissue.processingtypetext", caption: "Processing Type"},
			{name: "supportissue.solution", caption: "Solution"},
			{name: "supportissue.technicalnotes", caption: "Technical Notes"},
			{name: "supportissue.contactbusinesstext", caption: "Space"},
			{name: "supportissue.contactpersontext", caption: "Contact"},
			{name: "supportissue.modifieddate", caption: "Last Updated"},
			{name: "supportissue.modifiedusertext", caption: "Last Updated by"},

			{name: "invoice.contactbusinesssenttotext", caption: "Business"},
			{name: "invoice.contactbusinesssentto.legalname", caption: "Legal Name"},
			{name: "invoice.contactpersonsenttotext", caption: "Person"},
			{name: "invoice.projecttext", caption: "Project"},
			{name: "invoice.reference", caption: "Invoice number"},
			{name: "invoice.sentdate", caption: "Sent Date"},
			{name: "invoice.duedate", caption: "Due Date"},
			{name: "invoice.description", caption: "Description"},
			{name: "invoice.amount", caption: "Amount"},
			{name: "invoice.tax", caption: "GST"},
			{name: "invoice.sent", caption: "Sent?"},
			{name: "invoice.outstandingamount", caption: "Amount Outstanding"},
			{name: "invoice.receiptamount", caption: "Amount Receipted"},
			{name: "invoice.creditamount", caption: "Amount Credited"},
			{name: "invoice.invoicereceipt.appliesdate", caption: "Receipt Date"},
			{name: "invoice.invoicereceipt.amount", caption: "Receipt Amount"},
			{name: "invoice.invoicecredit.amount", caption: "Credit Amount"},
			{name: "invoice.invoicecredit.appliesdate", caption: "Credit Date"},
			{name: "invoice.lineitem.description", caption: "Item Description"},
			{name: "invoice.lineitem.financialaccounttext", caption: "Item Account"},
			/*{name: "invoice.lineitem.financialaccount.typetext", caption: "Item Account Type"},*/
			{name: "invoice.lineitem.amount", caption: "Item Amount"},
			{name: "invoice.lineitem.tax", caption: "Item GST"},
			{name: "invoice.lineitem.taxtypeincomingtext", caption: "Item GST Type"},
			{name: "invoice.createdusertext", caption: "Created By"},
			{name: "invoice.createddate", caption: "Created Date"},
			{name: "invoice.modifiedusertext", caption: "Last Modified By"},
			{name: "invoice.modifieddate", caption: "Last Modified Date"},

			{name: "expense.contactbusinesspaidtotext", caption: "Business"},
			{name: "expense.contactpersonpaidtotext", caption: "Person"},
			{name: "expense.projecttext", caption: "Project"},
			{name: "expense.reference", caption: "Reference"},
			{name: "expense.accrueddate", caption: "Expense Date"},
			{name: "expense.description", caption: "Description"},
			{name: "expense.amount", caption: "Amount"},
			{name: "expense.tax", caption: "GST"},
			{name: "expense.paystatustext", caption: "Pay Status"},
			{name: "expense.bankaccounttext", caption: "Bank Account"},
			{name: "expense.paymentmethodtext", caption: "Payment Method"},
			{name: "expense.outstandingamount", caption: "Outstanding Amount"},
			{name: "expense.expensereceipt.appliesdate", caption: "Payment Date"},
			{name: "expense.expensereceipt.amount", caption: "Payment Amount"},
			{name: "expense.expensecredit.appliesdate", caption: "Credit Date"},
			{name: "expense.expensecredit.amount", caption: "Credit Amount"},
			{name: "expense.lineitem.description", caption: "Item Description"},
			{name: "expense.lineitem.financialaccounttext", caption: "Item Account"},
			/*{name: "expense.lineitem.financialaccount.typetext", caption: "Item Account Type"},*/
			{name: "expense.lineitem.amount", caption: "Item Amount"},
			{name: "expense.lineitem.tax", caption: "Item GST"},
			{name: "expense.lineitem.taxtypeexpensetext", caption: "Item GST Type"},
			{name: "expense.createdusertext", caption: "Created By"},
			{name: "expense.createddate", caption: "Created Date"},
			{name: "expense.modifiedusertext", caption: "Last Modified By"},
			{name: "expense.modifieddate", caption: "Last Modified Date"},

			{name: "payment.contactbusinesspaidtotext", caption: "Business"},
			{name: "payment.contactpersonpaidtotext", caption: "Person"},
			{name: "payment.projecttext", caption: "Project"},
			{name: "payment.reference", caption: "Reference"},
			{name: "payment.paiddate", caption: "Paid Date"},
			{name: "payment.description", caption: "Description"},
			{name: "payment.amount", caption: "Amount"},
			{name: "payment.tax", caption: "GST"},
			{name: "payment.paid", caption: "Paid?"},
			{name: "payment.paymentmethodtext", caption: "Payment Method"},
			{name: "payment.bankaccounttext", caption: "Bank Account"},
			{name: "payment.lineitem.description", caption: "Item Description"},
			{name: "payment.lineitem.financialaccounttext", caption: "Item Account"},
			/*{name: "payment.lineitem.financialaccount.typetext", caption: "Item Account Type"},*/
			{name: "payment.lineitem.amount", caption: "Item Amount"},
			{name: "payment.lineitem.tax", caption: "Item GST"},
			{name: "payment.lineitem.taxtypeexpensetext", caption: "Item GST Type"},
			{name: "payment.createdusertext", caption: "Created By"},
			{name: "payment.createddate", caption: "Created Date"},
			{name: "payment.modifiedusertext", caption: "Last Modified By"},
			{name: "payment.modifieddate", caption: "Last Modified Date"},

			{name: "receipt.contactbusinessreceivedfromtext", caption: "Business"},
			{name: "receipt.contactpersonreceivedfromtext", caption: "Person"},
			{name: "receipt.projecttext", caption: "Project"},
			{name: "receipt.reference", caption: "Reference"},
			{name: "receipt.receiveddate", caption: "Received Date"},
			{name: "receipt.description", caption: "Description"},
			{name: "receipt.amount", caption: "Amount"},
			{name: "receipt.tax", caption: "GST"},
			{name: "receipt.bankaccounttext", caption: "Bank Account"},
			{name: "receipt.lineitem.description", caption: "Item Description"},
			{name: "receipt.lineitem.financialaccounttext", caption: "Item Account"},
			/*{name: "receipt.lineitem.financialaccount.typetext", caption: "Item Account Type"},*/
			{name: "receipt.lineitem.amount", caption: "Item Amount"},
			{name: "receipt.lineitem.tax", caption: "Item GST"},
			{name: "receipt.lineitem.taxtype", caption: "Item GST Type"},
			{name: "receipt.createdusertext", caption: "Created By"},
			{name: "receipt.createddate", caption: "Created Date"},
			{name: "receipt.modifiedusertext", caption: "Last Modified By"},
			{name: "receipt.modifieddate", caption: "Last Modified Date"},

			{name: "creditnote.contactbusinesstext", caption: "Business"},
			{name: "creditnote.contactbusiness.legalname", caption: "Legal Name"},
			{name: "creditnote.contactpersontext", caption: "Person"},
			{name: "creditnote.projecttext", caption: "Project"},
			{name: "creditnote.reference", caption: "Reference"},
			{name: "creditnote.creditdate", caption: "Credit Date"},
			{name: "creditnote.typetext", caption: "Credit Type"},
			{name: "creditnote.reasontext", caption: "Reason"},
			{name: "creditnote.description", caption: "Description"},
			{name: "creditnote.amount", caption: "Amount"},
			{name: "creditnote.tax", caption: "GST"},
			{name: "creditnote.financialaccounttext", caption: "Financial Account"},
			/*{name: "creditnote.lineitem.financialaccount.typetext", caption: "Item Account Type"},*/
			{name: "creditnote..notes", caption: "Notes"},
			{name: "creditnote.createdusertext", caption: "Created By"},
			{name: "creditnote.createddate", caption: "Created Date"},
			{name: "creditnote.modifiedusertext", caption: "Last Modified By"},
			{name: "creditnote.modifieddate", caption: "Last Modified Date"},

			{name: "persongroup.grouptext", caption: "Group"},
			{name: "persongroup.contactperson.firstname", caption: "First Name"},
			{name: "persongroup.contactperson.surname", caption: "Surname"},
			{name: "persongroup.contactperson.email", caption: "Email"},
			{name: "persongroup.contactperson.customerstatus", caption: "Customer Status"},
			{name: "persongroup.contactperson.supplierstatus", caption: "Supplier Status"},

			{name: "businessgroup.grouptext", caption: "Group"},
			{name: "businessgroup.contactbusinesstext", caption: "Trading Name"},
			{name: "businessgroup.contactbusiness.legalname", caption: "Legal Name"},
			{name: "businessgroup.contactbusiness.abn", caption: "ABN"},
			{name: "businessgroup.contactbusiness.customerstatus", caption: "Customer Status"},
			{name: "businessgroup.contactbusiness.supplierstatus", caption: "Supplier Status"}
		];

		ns1blankspace.report.selectAttributes = 			
		[
			{
				name: "persongroup.contactpersontext", 
				columns: "firstname-space-surname"
			},
			{
				name: "businessgroup.contactbusinesstext", 
				columns: "tradename",
				methodFilter: 'tradename-TEXT_IS_LIKE|legalname-TEXT_IS_LIKE'
			},
			{	
				name: "supportissue.contactpersontext",
				columns: "contactperson.firstname-space-contactperson.surname",
				methodFilter: 'contactperson.firstname-TEXT_IS_LIKE|contactperson.surname-TEXT_IS_LIKE'
			},
			{
				name: "payment.contactbusinesspaidtotext", 
				columns: "tradename",
				methodFilter: 'tradename-TEXT_IS_LIKE|legalname-TEXT_IS_LIKE'
			},
			{
				name: "payment.contactpersonpaidtotext", 
				columns: "contactperson.firstname-space-contactperson.surname",
				methodFilter: 'contactperson.firstname-TEXT_IS_LIKE|contactperson.surname-TEXT_IS_LIKE'
			},
			{
				name: "supportissue.contactbusinesstext", 
				columns: "tradename"
			},
			{
				name: "contactbusiness.primarycontactpersontext",
				columns: "tradename"
			},
			{
				name: "contactperson.contactbusinesstext",
				columns: "tradename"
			},
			{
				name: "invoice.contactpersonsenttotext", 
				columns: "firstname-space-surname"
			},
			{
				name: "invoice.contactbusinesssenttotext",
				columns: "tradename"
			},
			{
				name: "contactbusiness.createdusertext",
				columns: "firstname-space-surname"
			},
			{
				name: "contactperson.createdusertext",
				columns: "username"
			},
			{
				name: "opportunity.createdusertext",
				columns: "username"
			},
			{
				name: "opportunity.managedbytext",
				columns: "firstname-space-surname"
			},
			{
				name: "products.createdusertext",
				columns: "username"
			},
			{
				name: "invoices.createdusertext",
				columns: "username"
			},
			{
				name: 'attachment.createdusertext', 
				columns: "username"
			},
			{	/* Added 2.0.2c */
				name: "action.actionbytext",
				columns: "user.contactperson.firstname-space-user.contactperson.surname",
				methodFilter: 'user.contactperson.firstname-TEXT_IS_LIKE|user.contactperson.surname-TEXT_IS_LIKE'
			},
			{
				name: "attachment.objecttext",
				method: "CORE_OBJECT_SEARCH",
				columns: "description",
				methodFilter: 'description-TEXT_IS_LIKE|id-IN_LIST-' + $.map(ns1blankspace.data.search[0].rows, function(x) {return x.id}).join(',')
			},
			{
				name: "action.objecttext",
				columns: 'description',
				methodFilter: 'description-TEXT_IS_LIKE'
			},
			{
				name: "action.createdusertext",
				columns: "username-space-hyphen-space-user.contactperson.firstname-space-user.contactperson.surname",
				methodFilter: 'username-TEXT_IS_LIKE|user.contactperson.firstname-TEXT_IS_LIKE|user.contactperson.surname-TEXT_IS_LIKE'
			},
			{
				name: "action.modifiedusertext",
				columns: "username-space-hyphen-space-user.contactperson.firstname-space-user.contactperson.surname",
				methodFilter: 'username-TEXT_IS_LIKE|user.contactperson.firstname-TEXT_IS_LIKE|user.contactperson.surname-TEXT_IS_LIKE'
			},
		];

		ns1blankspace.report.extendDictionary()
		// Now add other fields to reports above as defined in control file
		if (ns1blankspace.data.control && ns1blankspace.data.control.report && ns1blankspace.data.control.report.dictionary)
		{
			$.each(ns1blankspace.data.control.report.dictionary, function()
			{
				ns1blankspace.report.dictionary.push({name: this.name, caption: this.caption});
			});
		}

		if (!bAll)
		{
			var sMethod = ns1blankspace.objectMethod;;
			var sParentNamespace = ns1blankspace.objectParentName;
			var sNamespace = ns1blankspace.objectName;

			if (sMethod == undefined)
			{	
				if (sParentNamespace)
				{
					var sMethod = (sParentNamespace).toUpperCase() + '_' + (sNamespace).toUpperCase();
				}
				else
				{
					var sMethod = (sNamespace).toUpperCase();
				}
			}
				
			if (sMethod)
			{
				sMethod += '_SEARCH';

				ns1blankspace.report.reports = $.grep(ns1blankspace.report.reports, function (a) {return a.method == sMethod})
			}	
		}	

		// ToDo: Only add reports that they have access to
		/*$(ns1blankspace.views).each(function(i, k)
		{
			var oMethods = $.grep(ns1blankspace.user.methods, function (a) {return (a.accessmethodtext).indexOf(k.endpoint) != -1;})	
			if (oMethods.length == 0) {this.show = false};
		});*/

	},

	extendDictionary: function()
	{
		// Now extend dictionary if applicable
		if (ns1blankspace.objectExtended)
		{
			$.each(ns1blankspace.report.reports, function() {
				var iObject = this.object;
				var sObjectname = this.objectName;

				$($.grep(ns1blankspace.extend.structure, function (a) {return a.object == iObject;})).each(function(i,v)
				{
					$(v.elements).each(function(j,k)
					{
						// v2.0.310 Uses reference if alias not supplied
						var sCaption = (k.caption == "") ? k.title : k.caption;
						var sName = (k.alias || 'se' + k.reference).toLowerCase();
						if (k.datatype == 2) {	
							ns1blankspace.report.dictionary.push({name: sObjectname + '.' + sName + 'text', caption: sCaption});
						}	
						else {
							ns1blankspace.report.dictionary.push({name: sObjectname + '.' + sName, caption: sCaption});
						}
					});
				})	
			});
		}

	},

	init: function (oParam)
	{
		ns1blankspace.report.initData(oParam);

		var bAll = true;

		if (oParam != undefined)
		{
			if (oParam.all != undefined) {bAll = oParam.all}
		}

		ns1blankspace.app.reset();

		ns1blankspace.objectName = 'report';

		ns1blankspace.viewName = 'Search & Reporting';

		ns1blankspace.app.set(oParam);

		ns1blankspace.app.context({all: true, inContext: false})
	},

	home: function (oParam, oResponse)
	{
		
		var aHTML = [];
		var aGroups;
					
		aHTML.push('<table>');

		aHTML.push('<tr><td><div id="ns1blankspaceViewReportLarge" class="ns1blankspaceViewImageLarge"></div></td></tr>');

		aHTML.push('</table>');		
		
		aHTML.push('<table>');
		
		// Display the list of report names in the control section

		// v2.0.2 If ALL the reports have group specified, put each of them into a accordian list with headers supplied from reportGroups or viewGroups
		if ($.grep(ns1blankspace.report.reports, function(x) {return x.group != undefined}).length == ns1blankspace.report.reports.length)
		{

			aGroups = ns1blankspace.report.reportGroups;
			if (aGroups === undefined) 
			{aGroups = ns1blankspace.viewGroups}
			
			if (aGroups === undefined)
			{	// No groups defined - remove group from each report and call function again
				ns1blankspace.report.reports = $.map(ns1blankspace.report.reports, function(x) {delete x.group; return x});
				ns1blankspace.report.home(oParam);
			}
			else
			{	
				// Remove tableAdded variable in case it's been added before
				aGroups = $.map(aGroups, function(group) {delete(group.tableAdded); return group});

				// Limit list of groups to those used in reports and then construct accordion
				var aUsedGroups = $.grep(ns1blankspace.report.reports, function(report) {return report.group});
				aGroups = $.grep(aGroups, function(group) {return $.inArray(group.id, $.map(aUsedGroups, function(usedGroup) {return usedGroup.group})) > -1});

				aHTML.push('<tr><div id="ns1blankspaceReportGroups">');
				$.each(aGroups, function()
				{
					aHTML.push('<div id="ns1blankspaceReportGroupHeader_' + this.id + '"' + 
								'style="font-size:0.75em; padding:4px; background-image:none !important;">' + this.name + '</div>');
					aHTML.push('<div id="ns1blankspaceReportGroupContent_' + this.id + '" style="padding:0.5em; margin-top:0px; top:-1px;"></div>');
				});

				aHTML.push('</div></tr></table>');
				$('#ns1blankspaceControl').html(aHTML.join(''));
			}
		}

		// Now list the reports (add to accordion if applicable)
		$.each(ns1blankspace.report.reports, function()
		{
			var sName = (this.name).replace(/ /g,'')
			var iGroupId;

			if (aGroups)
			{
				aHTML = [];
				iGroupId = $.inArray(this.group, $.map(aGroups, function(x) {return x.id}));
				if (iGroupId > -1 && aGroups[iGroupId].tableAdded === undefined )
				{
					aHTML.push('<table id="ns1blankspaceReportGroupList_' + this.group + '">');
					aGroups[iGroupId].tableAdded = true;
				}
			}

			aHTML.push('<tr>' +
							'<td id="ns1blankspaceControl' + sName + '"' +
									' class="ns1blankspaceControl"' +
									((aGroups) ? ' style="font-size:0.75em;"' : '') + 
									' data-method="' + this.method + '">' + this.name + '</td>' +
							'</tr>');

			if (aGroups)
			{
				if (aHTML[0].substr(0,6) === '<table')
				{
					$('#ns1blankspaceReportGroupContent_' + this.group).html(aHTML.join(''));
				}
				else
				{
					$('#ns1blankspaceReportGroupList_' + this.group).children().last().after(aHTML.join(''));
				}
				
			}	
		});
		
		if (aGroups === undefined)
		{
			aHTML.push('</table>');		
			
			$('#ns1blankspaceControl').html(aHTML.join(''));	
		}
		else		
		{
			$('#ns1blankspaceReportGroups').accordion(
			{
				collapsible: true, 
				active: false, 
				/*heightStyle: 'content', */
				autoHeight: false,
				clearStyle: true,
				_icons: { "header": "ui-icon-plus", "activeHeader": "ui-icon-minus" },
				icons: { "header": "glyphicon glyphicon-triangle-right", "activeHeader": "glyphicon glyphicon-triangle-bottom" }
			});
		}

		// Bind each report in the control area
		$.each(ns1blankspace.report.reports, function()
		{
			var sName = (this.name).replace(/ /g,'');
			var oParam = $.extend({}, this);

			$('#ns1blankspaceControl' + sName).data('param', this);
			
			$('#ns1blankspaceControl' + sName).click(function(event)
			{
				ns1blankspace.show({selector: '#ns1blankspaceReport'});
				var sMethod = $(this).attr('data-method');
				// v2.0.305 SUP022991 Clear out any Passed data when user clicks on menu option
				delete(ns1blankspace.report.reports.passedData); 
				ns1blankspace.report.show.main($(this).data('param'));
			});				
		});
		
		// Now construct the report detail selection area
		var aHTML = [];
		
		aHTML.push('<div id="ns1blankspaceReport" class="ns1blankspaceMain"></div>');
		
		$('#ns1blankspaceMain').html(aHTML.join(''));
		
		if (ns1blankspace.report.reports.length == 1)		// go to the report if there's only one
		{
			ns1blankspace.show({selector: '#ns1blankspaceReport'});
			var sMethod = ns1blankspace.report.reports[0].method;
			ns1blankspace.report.show.main(ns1blankspace.report.reports[0]);
			$('td.ns1blankspaceControl:first').addClass('ns1blankspaceHighlight')
		}	
		else
		{	
			ns1blankspace.show({selector: '#ns1blankspaceReport'});
		
			var aHTML = [];
						
			aHTML.push('<table class="interfaceViewportMain"><tr>' +
							'<td class="ns1blankspaceSub">' +
							'Select a report' + ((aGroups) ? ' from the groups to the left' : '') + '.' + 
							'</td></tr></table>');					
			
			$('#ns1blankspaceReport').html(aHTML.join(''));
		}	
	},

	getCaption: function (oParam)
	{
		// Captions can exist in the report.dictionary or report.fixedParameters or report.selectableParameters. The last 2 take precedence over the dictionary
		var sName;
		var sReturn;
		var sDefaultReturn;
		var bOnlyIfExists = true
		
		if (oParam != undefined)
		{
			if (oParam.name != undefined) {sName = oParam.name}
			if (oParam.defaultReturn != undefined) {sDefaultReturn = oParam.defaultReturn}
			if (oParam.onlyIfExists != undefined) {bOnlyIfExists = oParam.onlyIfExists}
		}
		
		if (!bOnlyIfExists)
		{
			if (sDefaultReturn != undefined) {sReturn = sDefaultReturn}
			if (sReturn == undefined) {sReturn = sName}
		};
		
		$.each(ns1blankspace.report.dictionary, function()
		{
			if (this.name == sName)
			{
				sReturn = this.caption;
				return false;
			}
			else
			{
				return true;
			}	
		});

		return sReturn
	},

	show:		
	{
		main: function (oParam, oResponse)
		{
			var aHTML = [];
			var sCaption;
			var sName;
			var oSelectableParameters;
			var oFixedParameters = {};
			var bSearchAtTop = false;
			var bGetParameters = true;

			ns1blankspace.report.config = oParam;

			if (oParam != undefined)
			{
				if (oParam.selectableParameters != undefined) {oSelectableParameters = oParam.selectableParameters}
				if (oParam.fixedParameters != undefined) {oFixedParameters = oParam.fixedParameters}
				if (oParam.showFixedParameters === undefined) {oParam.showFixedParameters = true}
				if (oParam.showSort === undefined) {oParam.showSort = true}
				delete(oParam.response);
			}
			
			ns1blankspace.report.config.allParameters = [];
			ns1blankspace.report.config.showUpdate = (ns1blankspace.report.config.showUpdate == undefined) ? ns1blankspace.report.showUpdate : ns1blankspace.report.config.showUpdate;
			ns1blankspace.report.config.showExport = (ns1blankspace.report.config.showExport == undefined) ? ns1blankspace.report.showExport : ns1blankspace.report.config.showExport;
			ns1blankspace.report.config.showEmail = (ns1blankspace.report.config.showEmail == undefined) ? ns1blankspace.report.showEmail : ns1blankspace.report.config.showEmail;
			ns1blankspace.report.config.showSMS = (ns1blankspace.report.config.showSMS == undefined) ? ns1blankspace.report.showSMS : ns1blankspace.report.config.showSMS;
			
			// scriptOnNewPage - if undefined, set to scriptNewpage if it's a function. Otherwise if both are defined, wipe out scriptNewpage as can't have both
			if (ns1blankspace.report.config.scriptOnNewPage === undefined && ns1blankspace.report.config.scriptNewPage != undefined && $.type(ns1blankspace.report.config.scriptNewPage) === 'function')
			{
				ns1blankspace.report.config.scriptOnNewPage = ns1blankspace.report.config.scriptNewPage;
				delete(ns1blankspace.report.config.scriptNewPage);
			}
			else if (ns1blankspace.report.config.scriptOnNewPage && ns1blankspace.report.config.scriptNewPage)
			{
				delete(ns1blankspace.report.config.scriptNewPage);
			}

			// If we have no selectable fields, we need to put the search button at the top.
			bSearchAtTop = ((Object.keys(oFixedParameters).length == 0 || (oFixedParameters.fields && oFixedParameters.fields.length > 0)) 
							&& (oSelectableParameters === undefined || $.grep(oSelectableParameters, function(x) {return x.hidden == undefined || x.hidden == false}).length == 0)) 
			

			// If autoRun is true, then don't show the selection page, just run the report 
			if (ns1blankspace.report.config.autoRun == true)
			{
				ns1blankspace.report.show.outputDivs();
				ns1blankspace.report.show.headerTabs();
				aHTML.push(ns1blankspace.report.show.configurationHeader({searchAtTop: true}) + '</table>');
				$('#ns1blankspaceReportSearch').html(aHTML.join(''));

				ns1blankspace.report.search.send(oParam);
			}
			else
			{
				if (oResponse == undefined)
				{
					ns1blankspace.report.show.outputDivs();
				}
				
				// Get parameter list from server - but check first if this has a scriptReportSearch and if it has selectableParameters with hidden set to true
				bGetParameters = (oParam.scriptReportSearch === undefined 
									|| (oParam.scriptReportSearch 
										&& oParam.selectableParameters != undefined && oParam.selectableParameters.fields != undefined
										&& $.grep(oParam.selectableParameters.fields, function(x) {return x.hidden != undefined && x.hidden == true}).length > 0)
								);

				if (oResponse == undefined && ns1blankspace.report.config.method != undefined)
				{
					if (bGetParameters)
					{
						var oSearch = new AdvancedSearch();
						oSearch.method = ns1blankspace.report.config.method;
						if (oParam.category != undefined)
						{	
							oSearch.categoryID = oParam.category;
						}
						oSearch.returnParameters = ns1blankspace.report.config.returnParameters;
						oSearch.rf = 'json';
						oSearch.getResults(function(oResponse) 
						{
							if (oResponse.status === 'OK')
							{
								ns1blankspace.report.show.main(oParam, oResponse);
							}
							else
							{
								ns1blankspace.status.error(oResponse.error.errornotes);
								$('#ns1blankspaceReportSearch').html('Error getting report parameters. Please click on the report name to the left to try again.');
							}
						});
					}
					// We have a scriptReportSearch and none of the filters require returnParameters. Fake the oResponse and call back
					else if (oParam.scriptReportSearch)
					{
						ns1blankspace.report.show.main(oParam, {status: 'OK', data: {rows: []}});
					}
				}
				
				// Process parameter list to display available fields on the page
				else if (oResponse != undefined)
				{
					// This step involves:
					//		- making sure that the fields in the report definition are actually available
					//		- determining the data type and constructing the comparison accordingly
					//		- listing the fields for selection
					// The data we need for each field is (we put this into ns1blankspace.report.config.allParameters):
					//		- defined caption
					//		- data

					// Could have a) fixed parameters only, b) selectable parameters only, c) fixed plus selectable, d) dictionary

					// If the report has a scriptReportSearch, we only need to display the customFilters and the scriptReportFilters here, if any

					oParam.parameterResponse = oResponse;
					ns1blankspace.report.show.headerTabs();
					aHTML.push(ns1blankspace.report.show.configurationHeader({searchAtTop: bSearchAtTop}));

					// Get all of the parameters in a list first - making sure we have a caption for each one
					//if (oParam.showSort && ns1blankspace.report.config.fixedParameters.fields != undefined)
					if (ns1blankspace.report.config.fixedParameters && ns1blankspace.report.config.fixedParameters.fields)	
					{
						$.each(ns1blankspace.report.config.fixedParameters.fields, function(i, c)
						{
							if (this.groupTitle === undefined)
							{
								sCaption = this.caption;
								if (sCaption == undefined)
								{	
									sCaption = ns1blankspace.report.getCaption({name: this.name});
									if (sCaption == undefined) { sCaption = this.name;	}
								}

								this.caption = sCaption;
							}
							this.source = 1;		// Fixed Parameter list

							// make sure it doesn't exist already and then add this column to allParameters
							if (this.groupTitle || $.grep(ns1blankspace.report.config.allParameters, function(x) {return x.name === c.name}).length === 0)
							{
								ns1blankspace.report.config.allParameters.push(this);
							}
							
						});
					}
					
					if (ns1blankspace.report.config.selectableParameters && ns1blankspace.report.config.selectableParameters.fields)
					{
						$.each(ns1blankspace.report.config.selectableParameters.fields, function(i, c) 
						{ 
							if (this.groupTitle === undefined)
							{
								sCaption = this.caption;
								if (sCaption == undefined)
								{	
									sCaption = ns1blankspace.report.getCaption({name: this.name});
									if (sCaption == undefined) { sCaption = this.name;	}
								}
								this.caption = sCaption;
							}
							this.source = 2;		// Selectable Parameter list

							// make sure it doesn't exist already and then add this column to allParameters
							if (this.groupTitle || $.grep(ns1blankspace.report.config.allParameters, function(x) {return x.name === c.name}).length === 0)
							{
								ns1blankspace.report.config.allParameters.push(this);
							}
						});	
					}

					// Neither Fixed or Selectable parameter fields defined - use dictionary fields
					if (((oFixedParameters && oFixedParameters.fields === undefined) || oFixedParameters === undefined) 
						&& ((oSelectableParameters && oSelectableParameters.fields === undefined) || oSelectableParameters === undefined))
					{
						$.each(ns1blankspace.report.dictionary, function(i, c)
						{
							// Make sure this column hasn't already been added to the report
							if (this.groupTitle || $.grep(ns1blankspace.report.config.allParameters, function(x) {return x.name === c.name}).length === 0)
							{
								this.source = 3;		// Dictionary
								if (this.groupTitle === undefined)
								{
									if (this.caption === undefined) {this.caption = this.name}

									// Reduce the name to it's prefixes only then see if it has a match in returnparameters - if so, we want it in this report
									sName = this.name.split('.');
									sName.pop();
									sName = sName.join('.');
								}

								if (this.groupTitle || $.inArray(sName, ns1blankspace.report.config.returnParameters.split(',')) > -1)
								{
									ns1blankspace.report.config.allParameters.push(this);
								}
							}
						});
					}
					
					// Note which columns are structure elements where applicable (set source = 4 & set datatype, inputtype & reference)
					if (ns1blankspace.objectExtended)
					{
						// For each of the returnParameters, see if there are any se columns on these tables. 
						// If they're defined in allParameters, set source = 4
						$.each(ns1blankspace.report.config.returnParameters.split(','), function()
						{
							var sThisPrefix = this.toString();
							var sThisTable = this.split('.').pop();		// Only get the last part - this is what we're trying to match
							sThisTable = (sThisTable.indexOf('contactbusiness') > -1 ? 'contactbusiness' : sThisTable);
							sThisTable = (sThisTable.indexOf('contactperson') > -1 ? 'contactperson' : sThisTable);

							$($.grep(ns1blankspace.extend.structure, function (a) {return a['structureobjectlink.object.prefix'].toLowerCase() == sThisTable})).each(function(i,v)
							{
								// v2.0.310 Now uses alias or reference whichever is supplied.
								$(v.elements).each(function(j,k)
								{
									sName = sThisPrefix + '.' + (k.alias || 'se' + k.reference).toLowerCase();
									sName += (k.datatype == '2') ? 'text' : '';
									var sInputType = (k.datatype != '1') ? 'textbox' : 'select';
									var sDataType = (k.datatype != '3') ? 'text' : 'date';
									
									$.map(ns1blankspace.report.config.allParameters, function(x)
									{
										if (x.name === sName)
										{
											x.source = 4;
											x.reference = k.reference;
											x.datatype = sDataType;
											x.inputtype = sInputType;
											x.category = k.category;
											x.seID = k.id;
											x.alias = k.alias.toLowerCase() || 'se' + x.reference;
											return false;
										}
									});

								});
							});
						});
					}
					
					// Display the customFilters
					aHTML.push(ns1blankspace.report.show.customFilters({response: oResponse}));

					// v2.0.2b Display the selection criteria area - can be overridden by scriptReportFilters
					if ($.type(ns1blankspace.report.config.scriptReportFilters) === 'function')
					{
						aHTML.push(ns1blankspace.report.config.scriptReportFilters(oParam));
					}
					else
					{
						aHTML.push(ns1blankspace.report.show.selectionCriteria(oParam));
					}
					
					if (oParam.showSort)
					{
						// Populate ns1blankspace.data.search with values that can be sorted
						var oSortObject = {method: "REPORT_SORT_SEARCH",
													 xhtmlElementID: undefined, 
													 data: 
														{
															rows: $.map($.grep(ns1blankspace.report.config.allParameters, 
																			function(y) {return y.groupTitle === undefined && (y.hidden === undefined || !y.hidden)}), 
																	function(x, index) {x.title=x.caption; x.id=index; return x})
														},
													 rows: $.map($.grep(ns1blankspace.report.config.allParameters, 
																	function(y) {return y.groupTitle === undefined && (y.hidden === undefined || !y.hidden)}), 
															function(x, index) {x.title=x.caption; x.id=index; return x})
													};

						if ($.grep(ns1blankspace.data.search, function(x) {return x.method === 'REPORT_SORT_SEARCH'}).length > 0)
						{
							ns1blankspace.data.search = $.map(ns1blankspace.data.search, function(x) 
																						 {
																						 	return (x.method === 'REPORT_SORT_SEARCH')
																						 			? oSortObject
																						 			: x
																						 });
						}
						else
						{
							ns1blankspace.data.search.push(oSortObject);
						}
						ns1blankspace.report.config.allParameters = $.grep(ns1blankspace.report.config.allParameters, function(x) {return x.groupTitle === undefined});

						aHTML.push('<tr><td colspan=4 style="color:#B8B8B8;padding:6px;background-color:#F8F8F8;" class="ns1blankspaceSelect">Sort by&nbsp;&nbsp;' +
									 '<input id="ns1blankspaceReportSort" class="ns1blankspaceSelect" style="width:50%"' + 
										 ' data-cache="true"' +
										 ' data-method="REPORT_SORT_SEARCH">' +
									 '</td></tr>');
					}
					
					aHTML.push('</table>');			
					
					$('#ns1blankspaceReportSearch').html(aHTML.join(''));
					
					//Remove selction criteria header if no fields to select
					if ($('.ns1blankspaceReportInclude').length == 0)
					{
						$('#ns1blankspaceReportSelectionCriteriaHeader').hide();
					}

					// Set default values on any custom filters
					if (oParam.customFilters) 
					{	
						var aCustomFilters = $.grep(oParam.customFilters.fields, function(x) {return x["default"]});
						
						if (aCustomFilters != undefined)
						{
							$.each(aCustomFilters, function() 
							{
								$('#ns1blankspaceReport_input_custom_' + this.name).val(this["default"]);
							});
						}
					}

					$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy', changeYear: true});

					$('#spanReportSearch').button(
					{
						label: "Search"
					})
					.click(function() 
					{
						oParam.response = undefined;
						// Set userSort if applicable and user has chosen one
						if (ns1blankspace.report.config.showSort != undefined && ns1blankspace.report.config.showSort === true)
						{
							if ($('#ns1blankspaceReportSort').attr('data-id') != undefined)
							{
								var oSortObject = $.grep(ns1blankspace.data.search, function(x) {return x.method == 'REPORT_SORT_SEARCH'}).shift();
								ns1blankspace.report.config.userSort = {name: oSortObject.rows[$('#ns1blankspaceReportSort').attr('data-id')].name, 
																	   	direction: 'asc'};
							}
							else if (ns1blankspace.report.config.selectableParameters && ns1blankspace.report.config.selectableParameters.sort)
							{
								ns1blankspace.report.config.userSort = {name: ns1blankspace.report.config.selectableParameters.sort.name, 
																	   	direction: ((ns1blankspace.report.config.selectableParameters.sort.direction) 
																	   				? ns1blankspace.report.config.selectableParameters.sort.direction 
																	   				: 'asc')};
							}
						}

						$("#ns1blankspaceReportResults").html('<div style="margin:10px;" class="ns1blankspaceNothing">No results.</div>');
						$("#ns1blankspaceReportExport").html('<div style="margin:10px;" class="ns1blankspaceNothing">No data to export.</div>');
						$("#ns1blankspaceReportUpdate").html('<div style="margin:10px;" class="ns1blankspaceNothing">No data to update.</div>');
						$("#ns1blankspaceReportSend").html('<div style="margin:10px;" class="ns1blankspaceNothing">No results to email.</div>');
						$("#ns1blankspaceReportSMS").html('<div style="margin:10px;" class="ns1blankspaceNothing">Nothing to SMS.</div>');
						$("#radioReport-Search").removeAttr('checked');
						$("#radioReport-Results").attr('checked', 'checked');
						$("#ns1blankspaceReportHeaderOptions").buttonset('refresh');

						ns1blankspace.report.data = {};

						if (ns1blankspace.report.reports.passedData)
						{
							$.each(ns1blankspace.report.reports.passedData, function(key, value)
							{
								ns1blankspace.report.data[key] = value;
							});
						}

						if ($.type(ns1blankspace.report.config.scriptReportSearch) === 'function')
						{
							ns1blankspace.report.config.scriptReportSearch(oParam);	
						}
						else
						{
							ns1blankspace.report.search.send(oParam);
						}
					});	
					
					$('td.ns1blankspaceReportComparison').click(function(event)
					{
						ns1blankspace.report.showComparison(
							{
								xhtmlElementID: this.id, 
								filterComparisons: ($(this).attr('data-filtercomparisons')) ? $(this).attr('data-filtercomparisons').split(',') : undefined
							});
					});
					
					$('td.ns1blankspaceReportComparison').mouseenter(function(event)
					{
						if ($(this).text() == '')
						{
							$(this).text('Click to set comparison.');
							$(this).css('color', 'grey');
						}
					});
					
					$('td.ns1blankspaceReportComparison').mouseleave(function(event)
					{
						if ($(this).text() == 'Click to set comparison.')
						{
							$(this).text('');
							$(this).css('color', '');
						}	
					});	

					// v2.0.3b Added
					$('td.ns1blankspaceReportNoFiltering').hover(
					function()
					{
						if ($(this).text() == '')
						{
							$(this).text('Filtering not permitted.');
							$(this).css('color', 'grey');
						}
					},
					function()
					{
						if ($(this).text() == 'Filtering not permitted.')
						{
							$(this).text('');
							$(this).css('color', '');
						}	
					});

					$('#ns1blankspaceReportCheckAll').click(function() 
					{
						if ($('#ns1blankspaceReportCheckAll').attr('checked')) 
						{
							$('input.ns1blankspaceReportInclude').prop('checked', true);
						}
						else {
							$('input.ns1blankspaceReportInclude').prop('checked', false);
						}
					});

				}
				else
				{
					alert('Missing report configuration.');
				}
			}	
		},

		selectionCriteria: function(oParam)
		{
			// Now go thru all the parameters and list them on the page - they should be in the order required
			var bSelectableHeaderShown = false;
			var sName = "";
			var sCaption = "";
			var aHTML = [];
			var bSearchAtTop = ns1blankspace.util.getParam(oParam, 'searchAtTop', {'default': false}).value;
			var oResponse = oParam.parameterResponse;

			$.each(ns1blankspace.report.config.allParameters, function()
			{
				var oColumnOptions;
				var oColumnSelectAttributes;
				var bHidden = (this.hidden != undefined) ? this.hidden : false;

				// Display selection header (Include, Comparison)
				if (this.source != 1 && !bSelectableHeaderShown)
				{
					aHTML.push('<tr><td style="color:#B8B8B8; padding:4px; background-color:#F8F8F8; vertical-align:middle;">' +
										'<input type="checkbox" id="ns1blankspaceReportCheckAll"' +
												/*' class="ns1blankspaceReportInclude"*/ '>' +
									'</td>' +
									'<td style="color:#B8B8B8; padding:4px; background-color:#F8F8F8; vertical-align:middle;">Include</td>' +
									'<td style="color:#B8B8B8; padding:4px; background-color:#F8F8F8; vertical-align:middle;">Comparison' + 
										'<span style="font-size:0.75em;"><br />(Hover to see options)</span></td>' +
									'<td style="color:#B8B8B8; padding:4px; background-color:#F8F8F8; text-align:right;" colspan="2">' +
										((!bSearchAtTop) ? '<span id="spanReportSearch" class="ns1blankspaceAction">Search</span>' : '') +
									'</td></tr>');
					bSelectableHeaderShown = true;
				}

				// Just a grouping Label - display it
				if (this.groupTitle)
				{
					aHTML.push('<tr><td colspan=4 style="color:#B8B8B8;padding:2px;" class="ns1blankspaceRow">' +
									this.groupTitle +
									'</td></tr>');
				}

				// Everything except group Labels
				else 
				{
					sName = this.name;
					// v2.0.3c Cater for when custom search and no parameters
					oColumnOptions = (oResponse.data.parameters) ? $.grep(oResponse.data.parameters, function(x) {return x.name === sName}).shift() : [];
					oColumnSelectAttributes = $.grep(ns1blankspace.report.selectAttributes, function(x) {return x.name === sName}).shift();

					sName = (sName).replace(/\./g,'_');
					sCaption = this.caption;

					// Fixed Parameters and we want fixedParameters to display
					if (this.source === 1 && !bHidden 
							&& (ns1blankspace.report.config.showFixedParameters === undefined
								|| (ns1blankspace.report.config.showFixedParameters != undefined && ns1blankspace.report.config.showFixedParameters))
							)
					{
						aHTML.push('<tr><td colspan="5" class="ns1blankspaceRow ns1blankspaceReportParameterFixed ns1blankspaceSub">' +
										sCaption + '</td>' +
									'</tr>');
					}

					
					// Selectable parameters or dictionary
					else if ((this.source > 1) && !bHidden)
					{
						// We only show it if it's been found in the oResponse.data.parameters or if it's a structure element
						if (this.source === 4
							|| ((this.source == 2 || this.source === 3) && oColumnOptions != undefined))
						{
							oColumnOptions = (oColumnOptions === undefined) ? {}: oColumnOptions;

							var sSearchMethod = (this.source === 4 && this.datatype == 2) 
												? 'SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH' 
												: oColumnOptions.searchmethod;
							if (sSearchMethod === undefined) {sSearchMethod = ""}
							
							var sDataType = (this.source === 4) ? this.datatype : oColumnOptions.datatype;

							var sInputType = (this.source === 4) ? this.inputtype : oColumnOptions.inputtype;
							sInputType = (sSearchMethod != "" || oColumnSelectAttributes != undefined) ? 'select' : sInputType;

							var sSearchRelatedField = (this.source === 4 && this.datatype == 2) 
														? this.name.substr(0, this.name.length - 4) /* remove 'text' from the end */
														: oColumnOptions.searchrelatedfield;

							var sMoreAttributes = '';

							if (this.source === 4)
							{
								sMoreAttributes += ((sSearchMethod != '') ? ' data-methodFilter="id|EQUAL_TO|' + this.seId + '"' : '');	
							}
							else
							{
								// Values in the SelectAtributes list take precendence over selectAttributes
								if (this.addClass || this.methodFilter || this.rows || this.columns || this.click || this.selectClass)
								{
									sMoreAttributes += ((this.addClass) ? ' data-selectClass="' + this.addClass  + '"' : '');
									sMoreAttributes += ((this.selectClass) ? ' data-selectClass="' + this.selectClass  + '"' : '');
									sMoreAttributes += ((this.columns) ? ' data-columns="' + this.columns  + '"' : '');
									sMoreAttributes += ((this.click) ? ' data-click="' + this.click  + '"' : '');
									sMoreAttributes += ((this.methodFilter) ? ' data-methodFilter="' + this.methodFilter  + '"' : '');
								}
								else if (oColumnSelectAttributes)
								{
									sMoreAttributes += ((oColumnSelectAttributes.addClass) ? ' data-selectClass="' + oColumnSelectAttributes.addClass  + '"' : '');
									sMoreAttributes += ((oColumnSelectAttributes.selectClass) ? ' data-selectClass="' + oColumnSelectAttributes.selectClass  + '"' : '');
									sMoreAttributes += ((oColumnSelectAttributes.columns) ? ' data-columns="' + oColumnSelectAttributes.columns  + '"': '');
									sMoreAttributes += ((oColumnSelectAttributes.click) ? ' data-click="' + oColumnSelectAttributes.click  + '"' : '');
									sMoreAttributes += ((oColumnSelectAttributes.methodFilter) ? ' data-methodFilter="' + oColumnSelectAttributes.methodFilter  + '"' : '');
								}
							}

							aHTML.push('<tr><td style="width:15px;" id="ns1blankspaceReport_include_' + sName + '" class="ns1blankspaceRow">' +
										'<input type="checkbox" id="ns1blankspaceReportCheck_include-' + sName + '"' +
											' data-name="' + this.name + '"' +
											' class="ns1blankspaceReportInclude">' +
										'</td>');
						
							aHTML.push('<td style="width:200px;" id="ns1blankspaceReport_caption_' + sName + '" class="ns1blankspaceReport ns1blankspaceRow">' +
										sCaption +
										'</td>');
							
							aHTML.push('<td style="width:200px;cursor: pointer;"' +
												' id="ns1blankspaceReport_comparison-' + sName + '-' + sDataType + '"' +
												' data-dataType="' + sDataType + '"' +
												' data-name="' + this.name + '"' + 
												' data-searchMethod="' + sSearchMethod + '"' +
												' data-inputType="' + sInputType + '"' +
												' data-searchRelatedField="' + sSearchRelatedField + '"' +
												sMoreAttributes + 
												'  class="ns1blankspaceReportComparison ns1blankspaceRow"></td>');
												
							aHTML.push('<td id="ns1blankspaceReport_input-' + sName + '-' + sDataType + '" class="ns1blankspaceReport ns1blankspaceRow"></td>');
							
							aHTML.push('</tr>');
						}

						// v2.0.3b If Calculated field, allow user to choose it, but not filter
						else if (this.source != 1 && this.processFunction != undefined)
						{
							aHTML.push('<tr><td style="width:15px;" id="ns1blankspaceReport_include_' + sName + '" class="ns1blankspaceRow">' +
										'<input type="checkbox" id="ns1blankspaceReportCheck_include-' + sName + '"' +
											' data-name="' + this.name + '"' +
											' class="ns1blankspaceReportInclude">' +
										'</td>');
						
							aHTML.push('<td style="width:200px;" id="ns1blankspaceReport_caption_' + sName + '" class="ns1blankspaceReport ns1blankspaceRow">' +
										sCaption +
										'</td>');
							
							aHTML.push('<td style="width:200px;" class="ns1blankspaceReportNoFiltering ns1blankspaceRow"></td>');
												
							aHTML.push('<td class="ns1blankspaceReport ns1blankspaceRow"></td>');
							
							aHTML.push('</tr>');
						}
					}
				}
			});
			return aHTML.join('');
		},

		outputDivs: function()
		{
			var aHTML = [];
			aHTML.push('<div id="ns1blankspaceReportHeader">' + ns1blankspace.xhtml.loading + '</div>');
			aHTML.push('<div id="ns1blankspaceReportSearch"></div>');
			aHTML.push('<div style="display:none;" id="ns1blankspaceReportResults" class="ns1blankspaceReportContainer">' +
							'<div style="margin:10px;"class="ns1blankspaceSub ns1blankspaceReportOutput">Nothing to show.</div></div>');
			aHTML.push('<div style="display:none;" id="ns1blankspaceReportExport" class="ns1blankspaceReportContainer">' +
							'<div style="margin:10px;" class="ns1blankspaceSub ns1blankspaceReportOutput">Nothing to export.</div></div>');
			aHTML.push('<div style="display:none;" id="ns1blankspaceReportUpdate" class="ns1blankspaceReportContainer">' +
							'<div style="margin:10px;" class="ns1blankspaceSub ns1blankspaceReportOutput">Nothing to update.</div></div>');
			aHTML.push('<div style="display:none;" id="ns1blankspaceReportSend" class="ns1blankspaceReportContainer">' +
							'<div style="margin:10px;" class="ns1blankspaceSub ns1blankspaceReportOutput">Nothing to email.</div></div>');
			aHTML.push('<div style="display:none;" id="ns1blankspaceReportSMS" class="ns1blankspaceReportContainer">' +
							'<div style="margin:10px;" class="ns1blankspaceSub ns1blankspaceReportOutput">Nothing to SMS.</div></div>');
			$('#ns1blankspaceReport').html(aHTML.join(''));	
		},

		headerTabs: function()
		{
			var aHTML = [];

			aHTML.push('<table style="margin-bottom:0px;border-bottom-style:solid;border-width: 1px;border-color:#E8E8E8;" class="ns1blankspace">');
			aHTML.push('<tr><td><div id="ns1blankspaceReportHeaderOptions">'); 
			aHTML.push('<input id="radioReport-Search" name="radioOptions" type="radio" checked="checked"/><label class="ns1blankspaceReportOptions" for="radioReport-Search">Select</label>');
			aHTML.push('<input id="radioReport-Results" name="radioOptions" type="radio" /><label class="ns1blankspaceReportOptions" for="radioReport-Results">Results</label>');								
			if (ns1blankspace.report.config.showUpdate) 
			{
				aHTML.push('<input id="radioReport-Update" name="radioOptions" type="radio" /><label class="ns1blankspaceReportOptions" for="radioReport-Update">Update</label>');
			}	
			if (ns1blankspace.report.config.showExport) 
			{
				aHTML.push('<input id="radioReport-Export" name="radioOptions" type="radio" /><label class="ns1blankspaceReportOptions" for="radioReport-Export">Export</label>');
			}
			if (ns1blankspace.report.config.showEmail) 
			{
				aHTML.push('<input id="radioReport-Send" name="radioOptions" type="radio" /><label class="ns1blankspaceReportOptions" for="radioReport-Send">Email</label>');
			}
			if (ns1blankspace.report.config.showSMS) 
			{
				aHTML.push('<input id="radioReport-SMS" name="radioOptions" type="radio" /><label class="ns1blankspaceReportOptions" for="radioReport-SMS">SMS</label>');
			}
			aHTML.push('</div></td>');

			aHTML.push('<td style="vertical-alignment:bottom;padding-top:10px;text-align:right;font-size:0.75em;">&nbsp;</td>');
			aHTML.push('</table>'); 
			
			$('#ns1blankspaceReportHeader').html(aHTML.join(''));

			$('#ns1blankspaceReportHeaderOptions').buttonset().css('font-size', '0.75em');
			$('#ns1blankspaceReportHeaderOptions :radio').click(function() {
				
				var sShowID = $(this).attr('id');

				$('#ns1blankspaceReportHeaderOptions :radio').each(function()
				{	
					var sSuffix = $(this).attr('id').split('-')[1];

					if ($(this).attr('id') === sShowID)
					{
						$('#ns1blankspaceReport' + sSuffix).show();
					}
					else
					{
						$('#ns1blankspaceReport' + sSuffix).hide();
					}
				});
			});
		},

		configurationHeader: function(oParam)
		{
			var aHTML = [];
			var bSearchAtTop = (oParam && oParam.searchAtTop) ? oParam.searchAtTop : false;
		
			aHTML.push('<table class="ns1blankspace" style="margin-left:1px; font-size:0.875em;">');

			if (bSearchAtTop && ns1blankspace.report.config.summary === undefined) 
			{
				//MB
				//aHTML.push('<tr><td colspan="4"' +
				//				' class="ns1blankspaceSubNote" style="padding:4px; background-color:#EAEAEA; vertical-align:middle;border-bottom:2px solid #E8E8E8; border-collapse:collapse;">' +
				//				'</td>');
			}
			else if (ns1blankspace.report.config.summary != undefined)
			{
				aHTML.push('<tr><td colspan="' + ((bSearchAtTop) ? 4 : 5) + '"' +
								' class="ns1blankspaceSubNote" style="padding:6px; background-color:#EAEAEA; vertical-align:middle; border-bottom:2px solid #E8E8E8; border-collapse:collapse;">' +
									ns1blankspace.report.config.summary +
							'</td>');
			}	
			
			if (false && bSearchAtTop)  //MB
			{
				aHTML.push('<td style="color:#545454; padding:4px; background-color:#EAEAEA; vertical-align:middle; text-align:right;border-bottom:2px solid #E8E8E8; border-collapse:collapse;">' +
								'<span id="spanReportSearch" class="ns1blankspaceAction">Search</span>' + 
							'</td></tr>');
			}

			//aHTML.push('</table>');
				
			return aHTML.join('');	
		},

		customFilters: function(oParam)
		{
			var aHTML = [];
			var oResponse = (oParam && oParam.parameterResponse) ? oParam.parameterResponse : undefined;

			// First show any selectableParmeters that are hidden - as these are intended to show only for the purpose of filtering
			if (ns1blankspace.report.config.selectableParameters && ns1blankspace.report.config.selectableParameters.fields
				&& $.grep(ns1blankspace.report.config.selectableParameters.fields, function(x) {return x.hidden != undefined && x.hidden === true}).length > 0)
			{
				$.each($.grep(ns1blankspace.report.config.selectableParameters.fields, function(x) {return x.hidden != undefined && x.hidden === true}), function(i, oSelectableParameters)
				{
					// Supplied values (in oSelectableParameters) override all other values, followed by oColumnSelectAttributes, then oColumnOptions (from returnparameters)
					// We write the selections back to ns1blankspace.report.config.selectableParameters
					var sName = oSelectableParameters.name;
					var oColumnOptions = (oResponse && oResponse.data.parameters) 
											? $.grep(oResponse.data.parameters, function(x) {return x.name === oSelectableParameters.name}).shift() 
											: {};
					var oColumnSelectAttributes = (ns1blankspace.report.selectAttributes) 
													? $.grep(ns1blankspace.report.selectAttributes, function(x) {return x.name === sName}).shift() 
													: {};
					var oAllParameters = $.grep(ns1blankspace.report.config.allParameters, function(x) {return x.name === sName}).shift();
					var sCaption = oAllParameters.caption;
					var sSearchMethod;

					if (oColumnOptions === undefined) {oColumnOptions = {}}
					if (oColumnSelectAttributes === undefined) {oColumnSelectAttributes = {}}
					if (oAllParameters === undefined) {oAllParameters = {}}

					if (oSelectableParameters.searchmethod === undefined)
					{
						oSelectableParameters.searchmethod = (oColumnSelectAttributes.searchmethod) ? oColumnSelectAttributes.searchmethod : oColumnOptions.searchmethod;
						// Structure element
						if (oSelectableParameters.searchmethod === undefined && oAllParameters.source === 4 && oAllParameters.datatype == 2)
						{
							oSelectableParameters.searchmethod = 'SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH';
						}
						else if (oSelectableParameters.searchmethod === undefined)
						{
							oSelectableParameters.searchmethod = '';
						}
					}

					if (oSelectableParameters.datatype === undefined)
					{
						oSelectableParameters.datatype = (oColumnSelectAttributes.datatype) ? oColumnSelectAttributes.datatype : oColumnOptions.datatype;
					}

					if (oSelectableParameters.inputtype === undefined)
					{
						oSelectableParameters.inputtype = (oColumnSelectAttributes.inputtype) ? oColumnSelectAttributes.inputtype : oColumnOptions.inputtype;
					}

					if (oSelectableParameters.searchrelatedfield === undefined)
					{
						oSelectableParameters.searchrelatedfield = (oColumnSelectAttributes.searchrelatedfield) ? oColumnSelectAttributes.searchrelatedfield : oColumnOptions.searchrelatedfield;
					}

					if (oSelectableParameters.moreAttributes === undefined)
					{
						oSelectableParameters.moreAttributes = '';
						oSelectableParameters.moreAttributes += ((oColumnSelectAttributes.moreAttributes != undefined) ? oColumnSelectAttributes.moreAttributes : '');
						oSelectableParameters.moreAttributes += ((oColumnSelectAttributes.addClass) ? ' data-selectClass="' + oColumnSelectAttributes.addClass  + '"' : '');
						oSelectableParameters.moreAttributes += ((oColumnSelectAttributes.selectClass) ? ' data-selectClass="' + oColumnSelectAttributes.selectClass  + '"' : '');
						oSelectableParameters.moreAttributes += ((oColumnSelectAttributes.columns) ? ' data-columns="' + oColumnSelectAttributes.columns  + '"': '');
						oSelectableParameters.moreAttributes += ((oColumnSelectAttributes.click) ? ' data-click="' + oColumnSelectAttributes.click  + '"' : '');
						
						if (oSelectableParameters.searchmethod === 'SETUP_STRUCTURE_ELEMENT_OPTION_SEARCH' && oAllParameters.datatype == 2)
						{
						 	oSelectableParameters.moreAttributes += ' data-methodFilter="' +
						 											((oColumnSelectAttributes.methodFilter) ? oColumnSelectAttributes.methodFilter  + '|': '')  +
						 											'id|EQUAL_TO|' + this.seId + '"';
						}
						else
						{
							oSelectableParameters.moreAttributes += ((oColumnSelectAttributes.methodFilter) ? ' data-methodFilter="' + oColumnSelectAttributes.methodFilter  + '"' : '');
						}
						oSelectableParameters.moreAttributes = (oSelectableParameters.moreAttributes === '') ? undefined : oSelectableParameters.moreAttributes;
					}

					aHTML.push('<tr><td style="width:200px; color:#B8B8B8; padding:4px; background-color:#F8F8F8; vertical-align:middle;" colspan="2">' + 
									oSelectableParameters.caption + 
								'</td>');

					aHTML.push('<td style="width:200px;cursor: pointer; color:#B8B8B8; padding:4px; background-color:#F8F8F8;"' +
										' id="ns1blankspaceReport_comparison-' + oSelectableParameters.name.replace(/\./g, '_') + '-' + oSelectableParameters.datatype + '"' +
										' data-dataType="' + oSelectableParameters.datatype + '"' +
										' data-name="' + oSelectableParameters.name + '"' + 
										' data-searchMethod="' + oSelectableParameters.searchmethod + '"' +
										' data-inputType="' + oSelectableParameters.inputtype + '"' +
										' data-searchRelatedField="' + oSelectableParameters.searchrelatedfield + '"' +
										oSelectableParameters.moreAttributes + 
										'  class="ns1blankspaceReportComparison"></td>');
										
					aHTML.push('<td id="ns1blankspaceReport_input-' + oSelectableParameters.name.replace(/\./g, '_') + '-' + oSelectableParameters.datatype + '"' +
										' style="color:#B8B8B8; padding:4px; background-color:#F8F8F8; vertical-align:middle;"' +
										' class="ns1blankspaceReport"></td>');
					
				});
			}	
			
			if (ns1blankspace.report.config.customFilters && ns1blankspace.report.config.customFilters.fields)
			{
				$.each(ns1blankspace.report.config.customFilters.fields, function(i, y) 
				{
					var bMandatory = (this.mandatory != undefined) ? this.mandatory : false;
					
					aHTML.push('<tr><td style="width:200px; color:#B8B8B8; padding:4px; background-color:#F8F8F8; vertical-align:middle;" colspan="2">' + 
									this.caption + 
								'</td>');

					if (this.type == 'Check')
					{
						aHTML.push('<td style="color:#B8B8B8; padding:4px; background-color:#F8F8F8; vertical-align:middle;">' + 
											'<input type="checkbox" style="margin:0px;"' + 
											' nohide="true"' + 
											((this["default"] != undefined && this["default"]) ? ' checked="checked"' : '') + 
											' id="ns1blankspaceReport_input_custom_' + this.name.replace(/\./g, '_') + '"' +
										' class="ns1blankspace' + this.type + '">' +
										'</td>' +
									'<td style="color:#B8B8B8; padding:4px; background-color:#F8F8F8;"></td>' +
									'<tr>');
					}

					else
					{
						/*
						// ToDo: Allow users to choose comparison using standard filtering utility
						if (this.useComparison == true)
						{
							//  + '-' + sDataType
							aHTML.push('<td style="width:200px;cursor: pointer;color:#B8B8B8; padding:4px; background-color:#F8F8F8;"' +
												' id="ns1blankspaceReport_comparison_custom-' + this.name.replace(/\./g, '_') + '"' +
												' data-dataType="' + this.datatype + '"' +
												' data-name="' + this.name + '"' + 
												' data-searchMethod="' + this.method + '"' +
												' data-inputType="' + this.inputtype + '"' +
												' data-searchRelatedField="' + this.searchrelatedfield + '" ' +
												((this.moreAttributes) ? this.moreAttributes + ' style="width:200px"': '') + 
												'  class="ns1blankspaceReportComparison">[Select Comparison]</td>');
												
							//  + '-' + this.datatype
							aHTML.push('<td id="ns1blankspaceReport_input_custom_' + this.name.replace(/\./g, '_') + '"' +
												' style="color:#B8B8B8; padding:4px; background-color:#F8F8F8;"' + 
												' class="ns1blankspaceReport">' +
										'</td>');
							
							aHTML.push('</tr>');
						}
						else
						{*/
							if (this.multiSelect)
							{
								aHTML.push('<td style="width:200px;cursor: pointer; color:#B8B8B8; padding:4px; background-color:#F8F8F8;"' +
													' id="ns1blankspaceReport_comparison-' + this.name.replace(/\./g, '_') + '_text"' +
													' data-dataType="text"' +
													' data-name="' + this.name + '"' + 
													' data-searchMethod="' + this.method + '"' +
													(this.methodFilter ? ' data-methodFilter="' + this.methodFilter + '"' : '') +
													' data-multiSelect="true"' + 
													(this.methodColumns ? ' data-columns="' + this.methodColumns + '"' : '') + 
													' data-inputType="select"' +
													' data-searchRelatedField="' + this.name + '"' +
													' data-filtercomparisons="None,IN_LIST,NOT_IN_LIST"' + 
													' class="ns1blankspaceReportComparison"></td>');
										
								/*aHTML.push('<td style="color:#B8B8B8; padding:4px; background-color:#F8F8F8; vertical-align:middle;">' +
												'<input id="ns1blankspaceReport_input_custom_' + this.name.replace(/\./g, '_') + '"' +
													' class="ns1blankspace' + this.type + '"' +
													' data-mandatory="' + bMandatory + '"' +
													(this.type == 'Select'?' data-method="' + this.method + '"':'') +
													((this.type == 'Select' && this.methodColumns) ? ' data-columns="' + this.methodColumns + '"': '') +
													((this.type == 'Select' && this.methodFilter) ? ' data-methodFilter="' + this.methodFilter + '"': '') +
													((this.type == 'Select' && this.defaultID) ? ' data-id="' + this.defaultID + '"': '') +
													' value="' + ((this['default']) ? ($.type(this['default']) === 'function' ? this['default']() : this['default']) : '') + '"' + 
													'>' + 
											'</td><tr>');*/

								aHTML.push('<td id="ns1blankspaceReport_input-' + this.name.replace(/\./g, '_') + '_text"' +
													' style="color:#B8B8B8; padding:4px; background-color:#F8F8F8; vertical-align:middle;"' +
													' class="ns1blankspaceReport"></td>');
							}
							else
							{
								aHTML.push('<td style="width:200px; color:#B8B8B8; padding:4px; background-color:#F8F8F8"></td>');
								aHTML.push('<td style="color:#B8B8B8; padding:4px; background-color:#F8F8F8; vertical-align:middle;">' +
												'<input id="ns1blankspaceReport_input_custom_' + this.name.replace(/\./g, '_') + '"' +
													' class="ns1blankspace' + this.type + '"' +
													' data-mandatory="' + bMandatory + '"' +
													(this.type == 'Select'?' data-method="' + this.method + '"':'') +
													((this.type == 'Select' && this.methodColumns) ? ' data-columns="' + this.methodColumns + '"': '') +
													((this.type == 'Select' && this.methodFilter) ? ' data-methodFilter="' + this.methodFilter + '"': '') +
													((this.type == 'Select' && this.defaultID) ? ' data-id="' + this.defaultID + '"': '') +
													' value="' + ((this['default']) ? ($.type(this['default']) === 'function' ? this['default']() : this['default']) : '') + '"' + 
													'>' + 
											'</td><tr>');
							}
						//}

					}
				});
			}

			return aHTML.join('');
		}
	},

	showComparison: function (oParam)
	{ 
		var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value
		var aFilterComparisons = ns1blankspace.util.getParam(oParam, 'filterComparisons').value;
		var aComparisons = [];
		
		if (sXHTMLElementID != undefined)
		{
			var aID = sXHTMLElementID.split('-');
			
			var aHTML = [];
			aComparisons = ns1blankspace.advancedSearch.comparisonGet({dataType: sXHTMLElementID.split('-').pop(), returnFormat: 'xhtml'});
			if (aFilterComparisons)
			{
				aComparisons = $.grep(aComparisons, function(x) {return $.grep(aFilterComparisons, function(y) {return x.indexOf(y) > -1}).length > 0});
			}

			aHTML.push('<table class="ns1blankspaceSearchMedium">');
			aHTML.push(aComparisons.join(''));
			aHTML.push('</table>');		
			
			ns1blankspace.container.position({xhtmlElementID: sXHTMLElementID})		
			$(ns1blankspace.xhtml.container).html(aHTML.join(''))	
			
			$('td.interfaceMainReportComparisonType').click(function(event)
			{
				var sID = event.target.id;
				var sDataType = $('#' + sID).attr('data-dataType');
				var sInputType = $('#' + sXHTMLElementID).attr('data-inputType');
				
				var sHTML = $('#' + sID).html();
				if (sHTML == 'None') 
				{	sHTML = ''
					if ($('td.interfaceMultiple').length > 0)
					{
						$('tr.interfaceMultiple').hide();
					}
				};
				
				$('#' + sXHTMLElementID).html(sHTML);
				$('#' + sXHTMLElementID).attr('data-code', $('#' + sID).attr('data-code'));
				$('#' + sXHTMLElementID).attr('data-inputCount', $('#' + sID).attr('data-inputcount'));
				
				$(ns1blankspace.xhtml.container).hide();
				
				ns1blankspace.report.setInput(
					{
						xhtmlElementID: sXHTMLElementID.replace('_comparison', '_input'), 
						dataType: sDataType,
						inputType: sInputType,
						inputCount: $('#' + sID).attr('data-inputCount'),
						searchMethod: $('#' + sXHTMLElementID).attr('data-searchMethod'),
						selectClass: $('#' + sXHTMLElementID).attr('data-selectClass'),
						columns: $('#' + sXHTMLElementID).attr('data-columns'),
						comparisonID: sID,
						click: $('#' + sXHTMLElementID).attr('data-click'),
						methodFilter: $('#' + sXHTMLElementID).attr('data-methodFilter'),
						searchrelatedfield: $('#' + sXHTMLElementID).attr('data-searchrelatedfield')
					}
				);
			
			});
			
		}
	},

	setInput: 	function (oParam)
	{ 
		var sXHTMLElementID;
		var sDataType;
		var sInputType;
		var aHTML = [];
		var iInputCount = 0;
		
		if (oParam != undefined)
		{
			if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
			if (oParam.dataType != undefined) {sDataType = oParam.dataType}
			if (oParam.inputType != undefined) {sInputType = oParam.inputType}
			if (oParam.inputCount != undefined) {iInputCount = Number(oParam.inputCount)}
		}	
			
		if (sXHTMLElementID != undefined)
		{
			if (iInputCount == 0) 
			{
				$('#' + sXHTMLElementID).html('');
			}
			else
			{	
				var sXHTMLInputElementID = sXHTMLElementID.replace('_comparison', '_input');
			
				for (var i = 1; i <= iInputCount; i++) 
				{	
			
					if (i > 1) 
					{
						aHTML.push('<br />');
					}
					
					var sThisElementID = sXHTMLInputElementID;

					if (sInputType == 'textbox' || sInputType == 'textarea')
					{
						sThisElementID = sThisElementID.replace(/-/g, '_');
						sThisElementID = sThisElementID + '_' + i
						
						if (sDataType == 'text' || sDataType == 'numeric')
						{
							aHTML.push('<input id="' + sThisElementID +  '" class="ns1blankspaceText">');
						}	
						
						if (sDataType == 'date')
						{
							aHTML.push('<input id="' + sThisElementID + '" class="ns1blankspaceDate">');
						}	
					}
					
					if (sInputType == 'select')
					{
						if (oParam.searchMethod != undefined)
						{
							sThisElementID = sThisElementID.replace(/-/g, '_');
							sThisElementID = sThisElementID + '_' + i
							
							aHTML.push('<input id="' + sThisElementID + '"');
							aHTML.push(' data-method="' + oParam.searchMethod + '" ' +
										'class="') ;
							
							if (oParam.selectClass != undefined)
							{	aHTML.push(oParam.selectClass);	}
							else
							{	aHTML.push('ns1blankspaceSelect')}
							
							aHTML.push('"');

							if (oParam.click != undefined)
							{
								aHTML.push(' data-click="' + oParam.click + '"')
							}
							
							if (oParam.methodFilter != undefined)
							{
								aHTML.push(' data-methodFilter="' + oParam.methodFilter + '"')
							}
							
							if (oParam.columns != undefined)
							{	
								aHTML.push(' data-columns="' + oParam.columns + '"')	
							}
							
							if (oParam.comparisonID  && oParam.comparisonID.indexOf("IN_LIST") >= 0)
							{
								aHTML.push(' data-multiSelect="true"');
							}
							aHTML.push('>');
						}
						else
						{
							aHTML.push('Report configuration error! Please contact Support.<br />No searchMethod defined.');
						}	
					}	
				}
				
				$('#' + sXHTMLElementID).html(aHTML.join(''));
				$('input.ns1blankspaceDate').datepicker({dateFormat: 'dd M yy', changeYear: true});
				$('#' + sXHTMLInputElementID.replace(/-/g, '_') + '_1').focus();
			}	
		}	
	},

	search: 	
	{
		checkCustomFilters: function(oParam)
		{
			ns1blankspace.okToSave = true;
			if (oParam.customFilters && oParam.customFilters.fields) 
			{	
				ns1blankspace.okToSave = true;
				$.each(oParam.customFilters.fields, function() 
				{
					var bMandatory = ((this.mandatory != undefined) ? this.mandatory: false);

					if (bMandatory 
						&& ($('#ns1blankspaceReport_input_custom_' + this.name.replace(/\./g, '_')).val() === "" 
							|| $('#ns1blankspaceReport_input_custom_' + this.name.replace(/\./g, '_')).val() === undefined)
						) 
					{
						
						ns1blankspace.okToSave = false;
						ns1blankspace.status.error('You must choose a value for ' + this.caption + ".");
						return false;
					}
					else if (this.useComparison === undefined && !this.useComparison)
					{
						if (this.type == 'Text' || this.type === 'Date') 
						{
							ns1blankspace.report.data[this.name] = $('#ns1blankspaceReport_input_custom_' + this.name.replace(/\./g, '_')).val();
						}
						else if (this.type === 'Select')
						{
							// v2.0.2b Added multiselect capability
							if (this.multiSelect)
							{
								ns1blankspace.report.data[this.name] = $.map($('#ns1blankspaceReport_input_custom_' + this.name.replace(/\./g, '_') + '_SelectRows'),
																				function(x) {return x.split('-').pop()}).join('');
							}
							else
							{
								ns1blankspace.report.data[this.name] = $('#ns1blankspaceReport_input_custom_' + this.name.replace(/\./g, '_')).attr('data-id');
							}
						}
						else if (this.type === 'Check')
						{
							ns1blankspace.report.data[this.name] = ($('#ns1blankspaceReport_input_custom_' + this.name.replace(/\./g, '_')).attr('checked') === 'checked'
																	|| $('#ns1blankspaceReport_input_custom_' + this.name.replace(/\./g, '_')).attr('checked') === true);
						}
					}
					else
					{
						if (oSearchParameters)
						{
							if (oSearchParameters.filters === undefined)
							{
								oSearchParameters.filters = [];
							}
							oSearchParameters.filters.push(this);
						}
					}
				});

				if (!ns1blankspace.okToSave) 
				{
					return false;
				}
				// We have all of the filters populated - now process them if configured to do so
				else
				{
					if ($.grep(oParam.customFilters.fields, function(x) {return x.processFunction != undefined}).length > 0)
					{
						$.each($.grep(oParam.customFilters.fields, function(x) {return x.processFunction != undefined}), function()
						{
							var fProcessFunction = this.processFunction;
							fProcessFunction({name: this.name});
						});
					}
					else if (oParam.customFilters.processFunction != undefined)
					{
						oParam.customFilters.processFunction();
					}
				}
			}
		},

		send: function (oParam)
		{ 
			var sXHTMLElementID;
			var aHTML = [];
			var oOutputParameters = [];
			var oSearchParameters;
			var bContainsContactPerson = false;
			
			if (oParam != undefined)
			{
				if (oParam.xhtmlElementID != undefined) {sXHTMLElementID = oParam.xhtmlElementID}
				if (oParam.searchParameters != undefined) {oSearchParameters = oParam.searchParameters}
				if (oParam.searchParameters == undefined) {	oSearchParameters = oParam.fixedParameters }	
			}	
			
			// First check if any custom filters are mandatory and error if necessary, otherwise, add the value to ns1blankspace.report.data
			// v2.0.2c changed to call to checkCustomFilters
			ns1blankspace.report.search.checkCustomFilters(oParam)
			if (!ns1blankspace.okToSave)
			{
				return false;
			}

			if ($("input.ns1blankspaceReportInclude:checked").length == 0 
				&& (oSearchParameters == undefined || oSearchParameters.fields === undefined))
			{
				ns1blankspace.status.error('Nothing selected');
			}
			else
			{
				var sShowID = 'radioReport-Results';

				$('#ns1blankspaceReportHeaderOptions :radio').each(function() {
					
					var sSuffix = $(this).attr('id').split('-')[1];
					if ($(this).attr('id') === sShowID) {
						$('#ns1blankspaceReport' + sSuffix).show();
					}
					else {
						$('#ns1blankspaceReport' + sSuffix).hide();
					}
				});
				$('#ns1blankspaceReportResults').html(ns1blankspace.xhtml.loading);
			
				bContainsContactPerson = (ns1blankspace.report.config.object == 32)
				
				// Construct the search from the columns and filters selected by the user
				var oSearch = new AdvancedSearch();
			
				// Add in fixedParameters fields
				if (oSearchParameters && oSearchParameters.fields)
				{
					oOutputParameters = oSearchParameters.fields;
					//bContainsContactPerson = ($.grep(oSearchParameters.fields, function(x) {return $.inArray('contactperson', x.name.split('.')) > -1}).length > 0);
				}
				
				// Add in each of the columns chosen by the user
				$("input.ns1blankspaceReportInclude:checked").each(function() 
				{ 
					var sName = $(this).attr('data-name');
					if ($.inArray(sName, $.map(oOutputParameters, function(x) {return x.name})) == -1)
					{
						// Get all the details of this column from allParameters - but only look for the ones that aren't fixedParameters (source = 1)
						oOutputParameters.push($.grep(ns1blankspace.report.config.allParameters, function(x) {return sName === x.name && x.source != 1}).shift());
					}

					//if (bContainsContactPerson == false)
					//{
					//	bContainsContactPerson = ($.inArray('contactperson', sName.split('.')) > -1)
					//}	
				});	
				
				// If we don't have the id column in our list of fields, add it now
				if (oParam.idColumn != undefined && $.inArray(oParam.idColumn, $.map(oOutputParameters, function(x) {return x.name})) == -1)
				{
					if ($.grep(ns1blankspace.report.config.allParameters, function(x) {return oParam.idColumn === x.name && x.source != 1}).length > 0)
					{
						oOutputParameters.push($.grep(ns1blankspace.report.config.allParameters, function(x) {return oParam.idColumn === x.name && x.source != 1}).shift());
					}
					else
					{
						oOutputParameters.push({name: oParam.idColumn, hidden: true, source: 3});
					}
				}
				
				ns1blankspace.report.data.containsContactPerson = bContainsContactPerson;
				ns1blankspace.report.data.outputParameters = oOutputParameters;
				ns1blankspace.report.data.resultRows = [];

				oSearch.addField($.map($.grep(oOutputParameters, function(y) {return y.headerOnly == undefined || !y.headerOnly}), function(x) {return x.name}).join(','));
				oSearch.method = ns1blankspace.report.config.method;
				
				var aFilters = [];
				
				if (oSearchParameters && oSearchParameters.filters)
				{
					$.each(oSearchParameters.filters, function(i, t)
					{
						var bInclude = true;
						var oFilter = {};
						// v2.0.3a Now assigns applyToSubSearch to applyToSubSearchJoin to match with AdvancedSearch parameters
						oFilter.name = t.name;
						oFilter.comparison = t.comparison;
						oFilter.value1 = t.value1;
						oFilter.value2 = t.value2;
						oFilter.value3 = t.value3;
						oFilter.includeEval = t.includeEval;
						oFilter.includeParameters = t.includeParameters;
						oFilter.applyToSubSearchJoin = t.applyToSubSearch;
						oFilter.applyToSubSearch = t.applyToSubSearch;
						oFilter.bracketBefore = t.bracketBefore;
						oFilter.bracketAfter = t.bracketAfter;
						oFilter.operatorBefore = t.operatorBefore;
						oFilter.operatorAfter = t.operatorAfter;
						

						if (oFilter.includeEval != undefined)
						{
							if ($.type(oFilter.includeEval) === 'function')
							{
								bInclude = oFilter.includeEval((oFilter.includeParameters != undefined) ? oFilter.includeParameters : {});
							}
							else
							{
								bInclude = oFilter.includeEval;
							}
						}
						
						// Cater for customFilters - if valuex is an array, replace it with the customFilter value stored against ns1blankspace.report.data
						if (jQuery.type(oFilter.value1) === "array") 
						{
							oFilter.value1 = ns1blankspace.report.data[oFilter.value1[0]];
						}

						if (jQuery.type(oFilter.value2) === "array") 
						{
							oFilter.value2 = ns1blankspace.report.data[oFilter.value2[0]];
						}

						if (jQuery.type(oFilter.value3) === "array") 
						{
							oFilter.value3 = ns1blankspace.report.data[oFilter.value3[0]];
						}

						if (bInclude)
						{	aFilters.push(oFilter)	}
					});
				}
				
				$('td.ns1blankspaceReportComparison[data-code]').each(function() 
				{ 
					var sInputID  = this.id.replace('_comparison', '_input');
					sInputID = sInputID.replace(/-/g, '_');

					var sMultiSelectID = sInputID + '_1_SelectRows';
					
					var sName = $(this).attr('data-name');
					var sComparison = $(this).attr('data-code');
					
					if (sComparison != '')
					{
						var sInputType = $(this).attr('data-inputType');
						var sSearchRelatedField = $(this).attr('data-searchRelatedField');
						var aValues = ["","",""];
						
						// If comparison is not select or select but not IN_LIST  or if it is IN_LIST, user has typed values, not selected them.
						if ( sInputType != "select" || 
						    (sInputType == "select" && sComparison.indexOf("IN_LIST") == -1) ||
						    (sInputType == "select" && sComparison.indexOf("IN_LIST") > -1 && $('#' + sMultiSelectID).html() === undefined)
						   ) 
						{
							for (var i = 0; i < $(this).attr('data-inputCount'); i++)
							{
								var sThisInputID = sInputID + '_' + (i + 1);
								var sValue = '';
								if (sInputType == 'select')
								{
									if ($('#' + sThisInputID).attr('data-id') == undefined)
									{	// User has typed something so compare the text field
										sValue = $('#' + sThisInputID).val();
									}
									else	// User has selected an id - search on the id
									{	
										sValue = $('#' + sThisInputID).attr('data-id'); 
										sName = sSearchRelatedField.replace('_', '.');	
									}
								}
								else
								{
									sValue = $('#' + sThisInputID).val();
								}
								
								aValues[i] = sValue;
							}
						}
						else	// IN_LIST processing
						{
							var aValueList = [];
							
							$('.ns1blankspaceMultiSelect').each(function()
							{
								var aSearch = this.id.split("-");
								aValueList.push(aSearch[aSearch.length - 1]);
							});
							
							if (aValueList.length == 0)
							{
								ns1blankspace.status.message("You must choose at least one value when using " + sComparison + ".");
								return false;
							}
							else
							{	aValues[0] = aValueList.join(",");	}
							sName = sSearchRelatedField.replace('_', '.');	
						}
						
						aFilters.push(
						{
							name: sName,
							comparison: sComparison,
							value1: aValues[0],
							value2: aValues[1],
							value3: aValues[2]
						});
					}	
				});	
				
				$.each(aFilters, function()
				{
					if (this.bracketBefore != undefined)
					{	oSearch.addBracket(this.bracketBefore);	}
					if (this.operatorBefore != undefined)
					{	oSearch.addOperator(this.operatorBefore) }
					// v2.0.3a Added to prevent applyToSubSearch from being missed
					if (this.applyToSubSearch)
					{
						if (this.value2 == undefined) {this.value2 = ''}
						if (this.value3 == undefined) {this.value3 = ''}
					}
					
					oSearch.addFilter( this.name, this.comparison, this.value1, this.value2, this.value3, this.applyToSubSearch);
					
					if (this.bracketAfter != undefined)
					{	oSearch.addBracket(this.bracketAfter);	}
					if (this.operatorAfter != undefined)
					{	oSearch.addOperator(this.operatorAfter) }
				});
				
				// Add any pre-defined or chosen sort order. 
				// fixedParameters sorts are applied first (and alays), followed any user-selected sort
				if (ns1blankspace.report.config.fixedParameters && ns1blankspace.report.config.fixedParameters.sorts)
				{
					$.each(ns1blankspace.report.config.fixedParameters.sorts, function()
					{
						oSearch.sort(this.name, ((this.direction) ? this.direction : 'asc'));
					});
				}

				// The most recently chosen user-selected sort is stored on ns1blankspace.report.config.userSort
				if (ns1blankspace.report.config.userSort != undefined && ns1blankspace.report.config.userSort.name != undefined)
				{
					oSearch.sort(ns1blankspace.report.config.userSort.name, ((ns1blankspace.report.config.userSort.direction) ? ns1blankspace.report.config.userSort.direction : 'asc'));
				}
				
				// Add pre-defined custom options
				// ToDo: Allow user to supply value for customOption
				if (ns1blankspace.report.config.customOptions)
				{
					$.each(ns1blankspace.report.config.customOptions, function()
					{
						// v2.0.313 Added conditional customOPtions
						var bInclude = true;
						if (this.includeEval != undefined)
						{
							if ($.type(this.includeEval) === 'function')
							{
								bInclude = this.includeEval((this.includeParameters != undefined) ? this.includeParameters : {});
							}
							else
							{
								bInclude = this.includeEval;
							}

						}
						if (bInclude)
						{oSearch.addCustomOption(this.option, this.value);}
					});
				}

				oSearch.addSummaryField('count(*) count');
				oSearch.rows = (oParam.rowsPerPage && oParam.rowsPerPage > 0) ? oParam.rowsPerPage : ns1blankspace.option.defaultRows;
				oSearch.rf = 'json';
				oSearch.getResults(function(data){
					ns1blankspace.report.search.show(oParam, data)
				}) ;	
			}	
		},

		show: function(oParam, oResponse)
		{
			var aHTML = [];

			if (oResponse != undefined)
			{
				oOutputParameters = ns1blankspace.report.data.outputParameters;

				if (oResponse.status != 'OK')
				{
					aHTML.push('<table>');
					aHTML.push('<tr><td class="ns1blankspaceNothing" style="padding-top:10px;">An error has occurred.</td></tr></table>') ;

					$('#ns1blankspaceReportResults').html(aHTML.join(''));
					ns1blankspace.status.error(oResponse.error.errornotes);
				}
				else if (oResponse.data.rows.length == 0)
				{
					aHTML.push('<table>');
					aHTML.push('<tr><td class="ns1blankspaceNothing" style="padding-top:10px;">There are no records matching this criteria.</td></tr></table>') ;

					$('#ns1blankspaceReportResults').html(aHTML.join(''));
				}
				else
				{
					aHTML.push('<table class="ns1blankspaceMain" style="font-size:0.925em;">');

					var aColumns = [];
					
					aHTML.push('<tr class="ns1blankspaceHeaderCaption">');
					
					$.each(oOutputParameters, function()
					{		
						var sName = this.name;
						var sCaption = this.caption;
						var sDirection = '';
						var bHeaderSortDisabled = (this.headerSortDisabled === true || ns1blankspace.report.config.headerSortDisabled === true);

						if (ns1blankspace.report.config.userSort != undefined && ns1blankspace.report.config.userSort.name && ns1blankspace.report.config.userSort == sName)
						{
							sDirection = (ns1blankspace.report.config.userSort.direction) ? ns1blankspace.report.config.userSort.direction : 'asc';
						}
						else
						{
							sDirection = 'asc';
						}

						// v2.0.3b Allow notes to be shown on selection, but not in output
						if (sCaption && (sCaption.split('<br>').length > 1 || sCaption.split('<br />').length > 1))
						{
							sCaption = (sCaption.split('<br>').length > 1) ? Caption.split('<br>').shift() : sCaption.split('<br />').shift();
						}

						if (this.hidden === undefined 
							||(this.hidden != undefined && !this.hidden))
						{
							if (sName != oParam.idColumn)
							{	aHTML.push('<td class="ns1blankspaceHeaderCaption' + 
											((!bHeaderSortDisabled) 
												? ' ns1blankspaceHeaderSort" data-name="' + sName + '" data-direction="' + sDirection
												: '') + '">' +
												sCaption + '</td>');	}
							
							aColumns.push({name: sName, caption: sCaption});
						}
					});
					
					if (ns1blankspace.report.config.scriptOpen != undefined || ns1blankspace.report.config.windowOpen != undefined)
					{
						aHTML.push('<td class="ns1blankspaceHeaderCaption">&nbsp;</td>');
					}

					aHTML.push('</tr>');

					// If we're removing Multiples, we need to initialise previousMultiplesKey
					if (ns1blankspace.report.config.removeMultiplesAt && ns1blankspace.report.config.removeMultiplesAt != '')
					{
						ns1blankspace.report.data.previousMultipleKey = '';
					}
					else
					{
						delete(ns1blankspace.report.data.previousMultipleKey);
					}

					// Now construct the rows for the first page
					$.each(oResponse.data.rows, function(index) 
					{ 
						aHTML.push(ns1blankspace.report.search.row(this));
					});
					
					aHTML.push('</table>');
					
					ns1blankspace.report.data.count = Number(oResponse.summary.count);
					ns1blankspace.report.data.moreID = $(oResponse).attr('moreid');
					ns1blankspace.report.data.outputParameters = oOutputParameters;

					$('#radioReport-Update').unbind("click");
					$('#radioReport-Update').click(function()
					{
						ns1blankspace.report.update.show(oParam);
					});
					
					$('#radioReport-Export').unbind("click");
					$('#radioReport-Export').click(function()
					{
						delete(oParam.exportStep);
						ns1blankspace.report["export"](oParam);
					});	

					$('#radioReport-Send').unbind("click");
					$('#radioReport-Send').click(function()
					{
						ns1blankspace.report.email.show(oParam);
					});

					$('#radioReport-SMS').unbind("click");
					$('#radioReport-SMS').click(function()
					{
						ns1blankspace.report.sms.show(oParam);
					});	

					$.extend(true, oParam,
					{
						xhtmlElementID: 'ns1blankspaceReportResults',
						xhtmlContext: '',
						xhtml: aHTML.join(''),
						showMore: ($(oResponse).attr('morerows') == "true"),
						more: $(oResponse).attr('moreid'),
						rows: (ns1blankspace.report.config.rowsPerPage && ns1blankspace.report.config.rowsPerPage > 0) ? ns1blankspace.report.config.rowsPerPage : ns1blankspace.option.defaultRows,
						functionShowRow: ns1blankspace.report.search.row,
						functionOnNewPage: ((ns1blankspace.report.config.scriptOnNewPage) ? ns1blankspace.report.config.scriptOnNewPage :  ns1blankspace.report.search.bind),
						functionNewPage: ((ns1blankspace.report.config.scriptNewPage) ? ns1blankspace.report.config.scriptNewPage : undefined)
				   	});
					ns1blankspace.render.page.show(oParam); 	
					
					// v2.0.2d SUP022320 Remove unbind of select and selectWin classes 
				}
			}
		},

		bind: function(oParam)
		{
			if (ns1blankspace.report.config.scriptOpen != undefined)
			{
				$('.ns1blankspaceRowSelect')
				.button(
				{
					text: false,
					icons:
					{
						primary: "ui-icon-play"
					}
				})
				.click(function(event)
				{
					this.id = this.id.split('-').pop();
					if ($.type(ns1blankspace.report.config.scriptOpen) === 'function')
					{
						ns1blankspace.report.config.scriptOpen();
					}
					else if ($.type(ns1blankspace.report.config.scriptOpen) === 'string')
					{
						eval(ns1blankspace.report.config.scriptOpen);
					}
				})
				.css('width', '15px')
				.css('height', '20px')
			}	

			if (ns1blankspace.report.config.windowOpen != undefined)
			{
				$('.ns1blankspaceRowSelectWin')
				.button(
				{
					text: false,
					icons:
					{
						primary: "ui-icon-newwin"
					}
				})
				.click(function(event)
				{
					this.id = this.id.split('-').pop();
					if ($.type(ns1blankspace.report.config.windowOpen) === 'function')
					{
						ns1blankspace.report.config.windowOpen();
					}
					else if ($.type(ns1blankspace.report.config.windowOpen) === 'string' && ns1blankspace.report.config.windowOpen.substr(0,3) === '/#/')
					{
						window.open(document.location.origin + ns1blankspace.report.config.windowOpen + this.id);
					}
				})
				.css('width', '15px')
				.css('height', '20px')
			}								

			// Bind the headers if sorting by headers is enabled
			if (ns1blankspace.report.config.headerSortDisabled === undefined 
				|| (ns1blankspace.report.config.headerSortDisabled != undefined && ns1blankspace.report.config.headerSortDisabled === true))
			{
				$('.ns1blankspaceHeaderSort')
					.css('cursor', 'pointer')
					.click(function()
					{
						ns1blankspace.report.config.userSort = {};
						ns1blankspace.report.config.userSort.name = $(this).attr('data-name');
						ns1blankspace.report.config.userSort.direction = $(this).attr('data-direction');
						$(this).attr('data-direction', (($(this).attr('data-direction') === 'asc') ? 'desc' : 'asc'));
						ns1blankspace.report.search.send(ns1blankspace.report.config);
					});
			}					

			if (oParam && oParam.onComplete)		
			{
				ns1blankspace.util.onComplete(oParam);
			}
		},

		row:		function (oRow)
		{
			// v2.0.3b Needed to add 1 to page selcted instead of remove
			var aHTML = [];
			var bExport = (ns1blankspace.report.data.exporting === true); 
			var bContinue = true;
			var sOutput = '';
			var oOutputParameters =  ns1blankspace.report.data.outputParameters;
			var iPage = ($('.ns1blankspaceRenderHeaderPageSelected').first().html() != undefined)
						? Number($('.ns1blankspaceRenderHeaderPageSelected').first().html()) + 1
						: 1;

			if (ns1blankspace.report.config.removeMultiplesAt && ns1blankspace.report.data.previousMultipleKey != undefined)
			{
				if (ns1blankspace.report.data.previousMultipleKey === oRow[ns1blankspace.report.config.removeMultiplesAt])
				{
					bContinue = false;
				}
				ns1blankspace.report.data.previousMultipleKey = oRow[ns1blankspace.report.config.removeMultiplesAt];
			}
				
			if (bContinue)
			{
				// we're including this row in the output - add it to the resultRows array
				oRow.page = iPage;
				ns1blankspace.report.data.resultRows.push(oRow);
	
				var sIDColumn = (ns1blankspace.report.config.idColumn != undefined) ? ns1blankspace.report.config.idColumn : 'id';
				var aLastHTML = [];
				
				// v2.0.3 Added data-id attribute
				aHTML.push('<tr class="ns1blankspaceRow" data-id="' + oRow[sIDColumn] + '">');

				$.each(oOutputParameters, function()
				{
					var sValue = oRow[this.name];
					var sKey = this.name;
					var sDelimiter = ',';
					var sSurroundWith = '"';
					var fProcessFunction;
					var oProcessParameter;
					var sScriptNewPage;

					// Only bother to look at it if it's not hidden
					if (this.hidden === undefined || !this.hidden)
					{
						// Determine if specific delimiters and surroundWith have been defined
						// v2.0.309 Now used funciton.name instead of function.toString()
						if (bExport)
						{
							if (ns1blankspace.report.config.customExportFormat && ns1blankspace.report.config.customExportFormat.items)
							{
								if (ns1blankspace.report.config.customExportFormat.items.delimiter) {sDelimiter = ns1blankspace.report.config.customExportFormat.items.delimiter}
								if (ns1blankspace.report.config.customExportFormat.items.surroundWith) {sDelimiter = ns1blankspace.report.config.customExportFormat.items.surroundWith}
							}
						}

						// See if there's any processFunctions in the allParameters list
						if (ns1blankspace.report.config.allParameters)
						{	
							fProcessFunction = $.map($.grep(ns1blankspace.report.config.allParameters, function(x) {return x.name === sKey})
													, function(y) {return y.processFunction}).shift();
							oProcessParameter = $.map($.grep(ns1blankspace.report.config.allParameters, function(x) {return x.name === sKey})
													, function(y) {return y.processParameter}).shift();
						}

						sScriptNewPage = (ns1blankspace.report.config.scriptOnNewPage) ? ns1blankspace.report.config.scriptOnNewPage.name : undefined;
						if (sScriptNewPage === undefined && ns1blankspace.report.config.scriptNewPage) {sScriptNewPage = ns1blankspace.report.config.scriptNewPage.name}
						if (sScriptNewPage === '') {sScriptNewPage = undefined}

						if (fProcessFunction)
						{
							// If the processFunction is different to scriptNewPage, then evaluate, otherwise, set value to blank as we evaluate it later
							// v2.0.3c Was not evaluating if sScriptNewPage was undefined
							if (sScriptNewPage == undefined || (sScriptNewPage && fProcessFunction.name != sScriptNewPage))
							{	sValue = fProcessFunction(oRow, oProcessParameter);	}
							else
							{ sValue = ''}
						}
						
						
						aHTML.push('<td class="ns1blankspaceRow" ' + 
										 'id="' + sKey.replace(/\./g,'_') + '_' + oRow[sIDColumn] + '">' + 
									  sValue + '</td>');
						
						sOutput += sSurroundWith + sValue + sSurroundWith + sDelimiter;
					}
				});

				// Add in the columns for open and open in new window
				if (aLastHTML.length == 0)
				{
					aLastHTML.push('<td class="ns1blankspaceRow" style="text-align:right;">' + 
									'<span class="ns1blankspaceRowSelect id" id="id-' + oRow[sIDColumn] + '"></span>' + 
									'<span class="ns1blankspaceRowSelectWin id" id="wid-' + oRow[sIDColumn] + '"></span>' +
								 '</td>');

				}
				aHTML.push(aLastHTML.join(''));
				aHTML.push('</tr>'); 
				
			}

			if (bExport)
			{	return ((sOutput != '') ? sOutput.substr(0, sOutput.length - 1) + '%0D%0A' : '')	}
			else
			{	return aHTML.join('');	}
		}
	},

	mergeFields: function (oParam)
	{
		var sText = "";
		var aColumns = [];
		
		if (oParam != undefined)
		{
			if (oParam.columns != undefined) {aColumns = oParam.columns;}
			if (oParam.replace != undefined) {sText = oParam.replace;}
		}
		
		$.each(aColumns, function()
		{
			while (sText.indexOf("[[" + this.caption + "]]") >= 0)
			{
				sText = sText.replace("[[" + this.caption + "]]", "[[" + this.name + "]]")
			}
		});
		
		return sText;
	},

	newPageShow: function ()
	{
		// This function is called at the end of scriptNewPage or scriptOnNewPage and will put the values into the correct columns on the page
		// It assumes that the scriptNewPage function has added columns and values to the ns1blankspace.report.data.resultRows array that represent the missing data
		// The function DOES NOT call any methods - it just reads the data from the resultRows array and puts it on the page where applicable

		// We only need to update columns where the scriptnewpage is the same as the processFunction
		var oNewPageColumns = $.grep(ns1blankspace.report.config.allParameters, 
										function(x) 
										{
											var sScriptNewPage = (ns1blankspace.report.config.scriptOnNewPage) ? ns1blankspace.report.config.scriptOnNewPage.toString() : undefined;
											if (sScriptNewPage === undefined && ns1blankspace.report.config.scriptNewPage) {sScriptNewPage = ns1blankspace.report.config.scriptNewPage.toString()}
											if (sScriptNewPage === '') {sScriptNewPage = undefined}
												
											return x.processFunction != undefined && sScriptNewPage && sScriptNewPage === x.processFunction.toString(); 
										});
		// v2.0.3b Is undefined when only 1 pg of results
		var iPage = ($('.ns1blankspaceRenderHeaderPageSelected').first().html() ? Number($('.ns1blankspaceRenderHeaderPageSelected').first().html()) : 1);
		var sIDColumn = (ns1blankspace.report.config.idColumn) ? ns1blankspace.report.config.idColumn : 'id';

		// Loop through all of the results for the current page and populate the columns in oNewPageColumns
		$.each($.grep(ns1blankspace.report.data.resultRows, function(x) {return x.page === iPage}), function()
		{
			var oThisRow = this;

			$.each(oNewPageColumns, function()
			{
				var sXHTMLElementID = this.name.replace(/\./g, '_') + '_' + oThisRow[sIDColumn];
				if ($('#' + sXHTMLElementID).is('*') && oThisRow[this.name] != undefined)
				{
					$('#' + sXHTMLElementID).html(oThisRow[this.name].formatXHTML());	
				}

			});
		});

	},

	fieldIncluded: function (oParam)
	{
		// Checks if a field (or fields) is included in the report. Hyphen separated list
		// Formats for oParam.fields can be either the entire field name (ie: 'contactperson.contactbusiness.tradename') or
		// a wildcard (ie: contactperson.contactbusiness.*)

		var sFieldList = '';
		var aFields = [];
		var bIncluded = false;
		var aFieldsIncluded = $.map($("input.ns1blankspaceReportInclude:checked"), function(a) {return $(a).attr('data-name')});

		if (oParam) 
		{
			if (oParam.fields) {sFieldList = oParam.fields}
		}
		aFields = sFieldList.split('-');
		
		// Loop through list of fields to check and see if included. Account for wildcards
		$.each(aFields, function()
		{
			var sFieldToSearch = (this.indexOf('*') > -1) ? this.substr(0, this.length - 1) : this;
			if ($.grep(aFieldsIncluded, function(a) 
										{ return a.substr(0, sFieldToSearch.length) === sFieldToSearch.toString()}
				).length > 0)
			{	
				bIncluded = true;
				return false;
			}
			else
			{	return true;	}
		});
		
		return bIncluded;
	},

	customFilterValue: function(oParam)
	{
		// Performs an evaluation on a customFilterValue
		var sField = ns1blankspace.util.getParam(oParam, 'field').value;
		var sComparison = ns1blankspace.util.getParam(oParam, 'comparison', {'default': 'EQUAL_TO'}).value;
		var xValue = ns1blankspace.util.getParam(oParam, 'value').value;
		var xValue2 = ns1blankspace.util.getParam(oParam, 'value2').value;
		var bResult;

		if ($.type(ns1blankspace.report.data[sField]) === 'boolean')
		{
			bResult = (ns1blankspace.report.data[sField] === xValue)
		}
		else if ($.type(xValue) === 'date')
		{
			var dValue1 = xValue;
			var dValue2 = xValue2;
			var dField = new Date(ns1blankspace.report.data[sField]);
			if ($.type(xValue) === 'string') {dValue1 = new Date(xValue)} 
			if ($.type(xValue2) === 'string') {dValue2 = new Date(xValue2)} 

			if (sComparison === 'EQUAL_TO') {bResult = (dField == dValue1)}
			else if (sComparison === 'NOT_EQUAL_TO') {bResult = (dField != dValue1)}
			else if (sComparison === 'IS_NULL') {bResult = (ns1blankspace.report.data[sField] == '')}
			else if (sComparison === 'IS_NOT_NULL') {bResult = (ns1blankspace.report.data[sField] != '')}
			else if (sComparison === 'GREATER_THAN_OR_EQUAL_TO') {bResult = (dField >= dValue1)}
			else if (sComparison === 'LESS_THAN_OR_EQUAL_TO') {bResult = (dField <= dValue1)}
			else if (sComparison === 'GREATER_THAN') {bResult = (dField > dValue1)}
			else if (sComparison === 'LESS_THAN') {bResult = (dField < dValue1)}
			else if (sComparison === 'BETWEEN') {bResult = (dField >= dValue1 && dField <= dValue2)}
		}
		else 
		{
			if (sComparison === 'EQUAL_TO') {bResult = (ns1blankspace.report.data[sField] == xValue)}
			else if (sComparison === 'NOT_EQUAL_TO') {bResult = (ns1blankspace.report.data[sField] != xValue)}
			else if (sComparison === 'IS_NULL') {bResult = (ns1blankspace.report.data[sField] == '')}
			else if (sComparison === 'IS_NOT_NULL') {bResult = (ns1blankspace.report.data[sField] != '')}
			else if (sComparison === 'GREATER_THAN_OR_EQUAL_TO') {bResult = (ns1blankspace.report.data[sField] >= xValue)}
			else if (sComparison === 'LESS_THAN_OR_EQUAL_TO') {bResult = (ns1blankspace.report.data[sField] <= xValue)}
			else if (sComparison === 'GREATER_THAN') {bResult = (ns1blankspace.report.data[sField] > xValue)}
			else if (sComparison === 'LESS_THAN') {bResult = (ns1blankspace.report.data[sField] < xValue)}
			else if (sComparison === 'TEXT_IS_LIKE') {bResult = (xValue.indexOf(ns1blankspace.report.data[sField]) > -1)}
			else if (sComparison === 'TEXT_IS_NOT_LIKE') {bResult = (xValue.indexOf(ns1blankspace.report.data[sField]) == -1)}
			else if (sComparison === 'TEXT_STARTS_WITH') {bResult = (ns1blankspace.report.data[sField].substr(0,xValue.length).toLowerCase() === xValue.toLowerCase())}
			else if (sComparison === 'TEXT_STARTS_WITH') {bResult = (ns1blankspace.report.data[sField].substr(0,xValue.length).toLowerCase() === xValue.toLowerCase())}
		}

		return bResult;
	},

	"export":	function (oParam)
	{
		var iMoreID;
		var aHTML = [];
		var oExportParameters;

		var iStartRow = 0;
		var iRows = 100;
		var bMore = false;
		var iCount = 0;
		var iPage = 0;
		
		var sShowID = 'radioReport-Export';

		if (oParam)
		{
			if (oParam.exportStep === undefined) {oParam.exportStep = 0;}
			if (oParam.startRow != undefined) {iStartRow = Number(oParam.startRow)}
			if (oParam.page) {iPage = oParam.page}
		}
		else
		{
			ns1blankspace.status.error('No parameters passed to export. Cannot continue.')
		}

		iCount = (ns1blankspace.report.data.count) ? ns1blankspace.report.data.count : iCount;
		// v2.0.307 Improves performance if get all rows, except for if over 1000 rows - we then break it up into 1000 row chunks
		iRows = (ns1blankspace.report.data.count) ? ns1blankspace.report.data.count : iRows;		
		iRows = (iRows > 5000) ? 5000 : iRows;

		// Set up UI v2.0.307 Now shows the user how many rows there are prior to starting
		if (oParam.exportStep == 0)
		{
			aHTML = '<table style="margin:10px;" id="1blankspaceReportProgressList" class="ns1blankspace">' +
						'<tr><td colspan="3"></td></tr>' +
						'<tr id="ns1blankspaceReportExportCountRow"><td id="ns1blankspaceReportExportCount" class="ns1blankspaceSub">' +
								iCount + ' rows will be exported.' +
							'</td></tr>' +
						
							'<tr><td class="ns1blankspace"><span id="ns1blankspaceReportExportAction">' +
								'Continue</span>' +
							'</td></tr>' +
						'<tr><td colspan="3" id="ns1blankspaceReportExportProgress"></td>'
						'</table>';

			$('#ns1blankspaceReportExport').html(aHTML);

			$('#ns1blankspaceReportExportAction')
				.button(
				{
					label: 'Continue'
				})
				.css('font-size', '0.75em')
				.attr('data-action', 'go')
				.on('click', function()
				{
					if ($(this).attr('data-action') == 'go')
					{
						oParam.exportStep = 1;
						ns1blankspace.report.exportAction = 'go';
						$(this).attr('data-action', 'stop');
						$('#ns1blankspaceReportExportAction').button({label: 'Cancel'});
						if (ns1blankspace.supportAdmin)
						{
							$('#ns1blankspaceReportExportProgress').before('<tr><td colspan="3">Starting:' + Date() + '</td></tr>');
						}
						ns1blankspace.report['export'](oParam);
					}
					else
					{
						ns1blankspace.status.message('Cancelling report.. Please wait.');
						ns1blankspace.report.exportAction = 'stop';
						oParam.exportStep = 3;
						ns1blankspace.report["export"](oParam);
					}
				});

			$('#ns1blankspaceReportHeaderOptions :radio').each(function()
			{	
				var sSuffix = $(this).attr('id').split('-')[1];
				if ($(this).attr('id') === sShowID)
				{
					$('#ns1blankspaceReport' + sSuffix).show();
				}
				else {
					$('#ns1blankspaceReport' + sSuffix).hide();
				}
			});
		}

		// Start the export process
		else if (oParam.exportStep === 1)
		{
			ns1blankspace.status.working('Extracting data...');

			ns1blankspace.report.data.resultRows = (ns1blankspace.report.data.fullDataSet == true) ? ns1blankspace.report.data.resultRows : [];
			ns1blankspace.report.data.exporting = true;
			oExportParameters = oParam.customExportFormat;

			if (iCount != undefined && iCount != 0) 
			{
				$('#ns1blankspaceReportExportProgress').html(ns1blankspace.xhtml.loading);

				if (oExportParameters === undefined) 
				{

					iMoreID = ns1blankspace.report.data.moreID;
					var sParam = '&method=CORE_MORE_FILE_MANAGE&more=' + iMoreID;
					$.ajax({
						type: 'POST',
						url: '/rpc/core/?rf=json' + sParam,
						dataType: 'json',
						success: function(oResponse)
						{
							if (oResponse.status === 'OK')
							{
								oParam.exportLink = oResponse.link;
								oParam.exportStep = 10;
								ns1blankspace.report["export"](oParam);
							}
							else 
							{
								oParam.errorNotes = oResponse.error.errornotes;
								delete(ns1blankspace.report.data.exporting);
							}
						}
					});		
				}


				// This report is being exported with a custom export format - either auto-generated or pre-defined
				else 
				{
					var oFormat = {};
					var oHeader = [];
					var oItem = [];
					var oFooter = [];
					// v2.0.2a Also check if processFunction and headerOnly
					var aColumns = $.grep(oOutputParameters, function(y) 
									{return (y.hidden === undefined || y.hidden === false) 
										 && (y.headerOnly == undefined || y.headerOnly === false || (y.headerOnly == true && y.processFunction))});

					// First, determine if this report has a pre-defined format
					if (ns1blankspace.setup.file["export"].formats)
					{	
						oFormat = $.grep(ns1blankspace.setup.file["export"].formats, function(x) {return x.name === oParam.name}).shift();
						if (oFormat)
						{
							if (oFormat.header) {oHeader = oFormat.header}
							if (oFormat.item) {oItem = oFormat.item}
							if (oFormat.footer) {oFooter = oFormat.footer};
						}
						else
						{
							// Check that auto-generated format doesn't already exist - (prefix - 'REPORT_') and delete
							ns1blankspace.setup.file["export"].formats = $.grep(ns1blankspace.setup.file["export"].formats, function(x) {
									return x.name != 'REPORT_' + oParam.name;
								});
						}
					}

					// If captionsAsHeaders, push the report captions into the format
					if (oExportParameters.headers &&
						oExportParameters.headers.captionsAsHeaders === true)
					{
						var oFields = [];
						var sDelimiter = (oExportParameters.headers.delimiter) ? oExportParameters.headers.delimiter : '';
						var sSurroundWith = (oExportParameters.headers.surroundWith) ? oExportParameters.headers.surroundWith : '';
						var iColumn = 0;
						$.each(aColumns, function() 
						{
							var sCaption = this.caption;
							iColumn++;
							if (sCaption)
							{
								// v2.0.307 Allow notes to be shown on selection, but not in output
								if (sCaption.split('<br>').length > 1 || sCaption.split('<br />').length > 1)
								{
									sCaption = (sCaption.split('<br>').length > 1) ? Caption.split('<br>').shift() : sCaption.split('<br />').shift();
								}

								oFields.push({value: sSurroundWith + 
											 sCaption + 
											 ((iColumn === aColumns.length) ? sSurroundWith : sSurroundWith + sDelimiter)});
							}
						});
						oHeader = [{line: 1, fields: oFields}];
					}

					// Export has been defined. Remove the columns that haven't been included in the report
					if (oItem.length > 0)
					{
						if (oItem[0].fields) 
						{
							
							var oReportItem = $.grep(oItem[0].fields, function(x) {
															return $.grep(aColumns, function(y) {
																		return y.name == x.mapField || x.mapField === undefined})
														.length > 0});
							oItem[0].fields = oReportItem;
						}

					}
					
					// Create export format from fields selected
					else 
					{
						// v2.0.2a cater for custom export formats where items explicity defined via .item
						var sDelimiter = (oExportParameters.items && oExportParameters.items.delimiter) ? oExportParameters.items.delimiter : '';
						var oFields = [];
						var sSurroundWith = (oExportParameters.items && oExportParameters.items.delimiter) ? oExportParameters.items.surroundWith : '';
						var iColumn = 0;
						$.each(aColumns, function() 
						{
							var sName = this.name.toString();
							var fProcessFunction;
							var oProcessParameter;
							
							iColumn++;
							if (sName) 
							{	
								// v1.0.24 Remove id columns from export report
								if (oParam.idColumn === undefined || (oParam.idColumn && oParam.idColumn != sName))
								{
									oFields.push({value: sSurroundWith}); 
									
									// v2.0.1 Determine whether this is a calculated field and format accordingly
									if (ns1blankspace.report.config.fixedParameters && ns1blankspace.report.config.fixedParameters.fields)
									{	
										fProcessFunction = $.map($.grep(ns1blankspace.report.config.fixedParameters.fields, function(x) {return x.name === sName})
																, function(y) {return y.processFunction}).shift();
										oProcessParameter = $.map($.grep(ns1blankspace.report.config.fixedParameters.fields, function(x) {return x.name === sName})
																, function(y) {return y.processParameter}).shift();
									}
									if (fProcessFunction === undefined && ns1blankspace.report.config.selectableParameters && ns1blankspace.report.config.selectableParameters.fields)
									{	
										fProcessFunction = $.map($.grep(ns1blankspace.report.config.selectableParameters.fields, function(x) {return x.name === sName})
																, function(y) {return y.processFunction}).shift();
										oProcessParameter = $.map($.grep(ns1blankspace.report.config.selectableParameters.fields, function(x) {return x.name === sName})
																, function(y) {return y.processParameter}).shift();
									}

									// v2.0.2b Need to work out whether the processFunction is actually the same as the newPage function and if so, don't call it here
									var sScriptNewPage = (ns1blankspace.report.config.scriptOnNewPage) ? ns1blankspace.report.config.scriptOnNewPage.toString() : undefined;
									if (sScriptNewPage === undefined && ns1blankspace.report.config.scriptNewPage) {sScriptNewPage = ns1blankspace.report.config.scriptNewPage.toString()}
									if (sScriptNewPage === '') {sScriptNewPage = undefined}

									if (fProcessFunction)
									{
										if (sScriptNewPage && fProcessFunction.toString() != sScriptNewPage)
										{
											oFields.push({mapField: sName,
														  calculate: function(x)
											  				{
											  					return fProcessFunction(x, oProcessParameter);
											  				}
														  });
										}
										else
										{
											oFields.push({field: this.name})
										}
									}
									else
									{
										oFields.push({field: this.name}); 
									}
									oFields.push({value: ((iColumn === aColumns.length) ? sSurroundWith : sSurroundWith + sDelimiter)});
								}
							}
						});
						oItem = [{fields: oFields}];
					}

					// No need to auto-define footer - there isn't a pre-defined format to use. So now add back auto-generated report
					ns1blankspace.setup.file["export"].formats.push({name: 'REPORT_' + oParam.name, header: oHeader, item: oItem, footer: oFooter});

					oParam.exportStep = 2;
					ns1blankspace.report["export"](oParam);
				}
			}
			else
			{
				ns1blankspace.status.error('No rows to export');
				delete(ns1blankspace.report.data.exporting);
			}
			
		}

		// Call CORE_SEARCH_MORE in groups of iRows rows until we reach the total number of rows
		else if (oParam.exportStep === 2)
		{
			// Check to see if we already obtained all the data via a scriptReportSearch / Process
			if (ns1blankspace.report.data.fullDataSet == true)
			{
				if (ns1blankspace.report.data.resultRows.length == iCount)
				{
					oParam.exportStep = 3;
					ns1blankspace.report["export"](oParam);
				}
				else
				{
					ns1blankspace.status.error('There is a problem with the export data. Please contact support.');
					delete(ns1blankspace.report.data.exporting);
					delete(oParam.exportStep);
				}
			}
			// Now we need to get the entire data set using core_search_more
			else if (iStartRow <= iCount)
			{
				// v2.0.308 Allow user to cancel part-way through report
				if (ns1blankspace.report.exportAction == 'stop')
				{
					delete(ns1blankspace.report.exportAction);
					//oParam.exportStep = 3;
					//ns1blankspace.report["export"](oParam);
				}
				else
				{
					iRows = ((iStartRow + iRows > iCount) ? (iCount - iStartRow + 1) : iRows);
					var sParam = 'id=' + ns1blankspace.report.data.moreID +
								'&startrow=' + iStartRow +
								'&rows=' + iRows;
					ns1blankspace.status.working('Extracting rows ' + iStartRow + ' to ' + ((iStartRow + iRows > iCount) ? iCount : iStartRow + iRows) + ' of ' + iCount);

					$.ajax(
					{
						type: 'GET',
						/*url: ns1blankspace.util.endpointURI('CORE_SEARCH_MORE'),*/
						url: '/rpc/core/?method=CORE_SEARCH_MORE',
						data: sParam,
						rows: iRows,
						success: function(oResponse) 
						{
							if (oResponse.status === 'OK')
							{
								if (ns1blankspace.supportAdmin)
								{
									$('#ns1blankspaceReportExportProgress').before('<tr><td colspan="3">Found to row ' + 
											(iStartRow + iRows) + ' :' + Date() + '</td></tr>');
								}
								// add each row to ns1blankspace.report.data.resultRows
								oParam.page = iPage + 1;
								oParam.rows = 100;
								$.each(oResponse.data.rows, function()
								{
									this.page = oParam.page;
									ns1blankspace.report.data.resultRows.push(this);
								});

								if (oResponse.morerows === 'true')
								{
									oParam.startRow = iStartRow + iRows;
									oParam.exportStep = 2;
								}
								else
								{
									oParam.exportStep = 3;
								}

								if (ns1blankspace.report.config.scriptOnNewPage)
								{
									oParam.onComplete = ns1blankspace.report["export"];
									ns1blankspace.report.config.scriptOnNewPage(oParam);
								}
								else if (ns1blankspace.report.config.scriptNewPage)
								{
									oParam.onComplete = ns1blankspace.report["export"];
									eval(ns1blankspace.report.config.scriptOnNewPage);
								}
								else
								{
									ns1blankspace.report["export"](oParam);
								}
							}
							else
							{
								ns1blankspace.status.error(oResponse.error.errornotes);
								delete(ns1blankspace.report.data.exporting);
							}
						}
					});
				}				
			}
			else
			{
				oParam.exportStep = 3;
				ns1blankspace.report["export"](oParam);
			}

		}

		// Call custom export file creation
		else if (oParam.exportStep === 3)
		{
			var oExportParam = {};
			oParam.exportStep = 10;
			delete(oParam.startRow);
			$('#ns1blankspaceReportExportAction').remove();

			ns1blankspace.status.working('Creating file...');

			// v2.0.3g SUP021370 cater for removeMultiplesAt by removing duplicates before exporting
			if (ns1blankspace.report.removeMultiplesAt != undefined && ns1blankspace.report.removeMultiplesAt)
			{
				ns1blankspace.report.previousMultipleKey = '';
				oExportParam.items = $.grep(ns1blankspace.report.data.resultRows, function(x)
				{
					var bReturn = true;
					if (x[ns1blankspace.report.removeMultiplesAt] === ns1blankspace.report.previousMultipleKey)
					{	bReturn = false;	}
					ns1blankspace.report.previousMultipleKey = x[ns1blankspace.report.removeMultiplesAt];
					return bReturn;
				});		
			}
			else
			{
				oExportParam.items = ns1blankspace.report.data.resultRows;
			}

			oExportParam.totalRows = oExportParam.items.length;
			oExportParam.name = 'REPORT_' + oParam.name;
			oExportParam.saveToFile = true;
			oExportParam.fileName = oParam.name.replace(/ /g,'') + '_Report.csv';
			oExportParam.xhtmlElementID = 'ns1blankspaceReportExportProgress';
			oExportParam.summary = ns1blankspace.report.data.summary;		// v2.0.3c Added for custom export formats

			if (ns1blankspace.supportAdmin)
			{
				$('#ns1blankspaceReportExportProgress')
					.before('<tr><td colspan="3">Generating file:' + Date() + '</td></tr>');
			}

			var sFile = ns1blankspace.setup.file["export"].process(oExportParam);
		}

		// Display link or any errors             
		else if (oParam.exportStep === 10)
		{
			delete(oParam.exportStep);
			delete(oParam.startRow);

			if (oParam.exportLink != undefined && oParam.exportLink != '')
			{
				aHTML.push('<table style="margin: 10px; font-size:0.875em;">');
				aHTML.push('<tr>');
				aHTML.push('<td class="ns1blankspaceSub">File created with ' + ns1blankspace.report.data.count + ' rows.</td></tr>');
				aHTML.push('<tr>');
				aHTML.push('<td><a href="' + oParam.exportLink);
				aHTML.push('" target="_blank">Download the file</td></tr>');
				aHTML.push('</table>');
			}

			else
			{
				aHTML.push('<table class="ns1blankspace">');
				aHTML.push('<tr>');
				aHTML.push('<td class="ns1blankspaceSub">Error creating file' + 
								((oParam.errorNotes) ? ': ' + oParam.errorNotes : '') + 
							'</td></tr>');
				aHTML.push('</table>');

			}

			$('#ns1blankspaceReportExport').html(aHTML.join(''));
			delete(ns1blankspace.report.data.exporting);
			delete(oParam.exportStep);
		}

	},

	update:		
	{
		show: function (oParam, oResponse)
		{
			//var oResponse;
			var nCount;
			var sMoreID;
			var oParameters;
			var sExtraIDColumnBefore;
			var sIDColumn = 'id';

			if (oParam)
			{
				//if (oParam.response) { oResponse = oParam.response; }
				if (oParam.count) { nCount = oParam.count; }
				if (oParam.parameterList) {oParameters = oParam.parameterList.split(','); }
				if (oParam.moreID) {sMoreID = oParam.moreID; }
				if (oParam.idColumn) {sIDColumn = oParam.idColumn; }
				if (oParam.extraIDColumnBefore) {sExtraIDColumnBefore = oParam.extraIDColumnBefore; }
			}

			// if (oResponse == undefined)
			// {
			// 	oResponse = ns1blankspace.report.data.resultRows;
			// }

			// MB
			if (oParameters == undefined)
			{
			 	oParameters = $.map(oParam.allParameters, function (parameter) {return parameter.name});
			}

			var aHTML = [];

			//oResponse && oResponse.data.rows.length > 0

			if (ns1blankspace.report.data.moreID == undefined)
			{
				aHTML.push('<table class="ns1blankspace">');
				aHTML.push('<tr>');
				aHTML.push('<td class="ns1blankspaceSub">No results. No updates possible.</td></tr>');
				aHTML.push('</table>');

				$('#ns1blankspaceReportUpdate').html(aHTML.join(''));
			}
			else
			{
				if ($('#ns1blankspaceReportUpdateColumn1').html() == undefined )
				{
					aHTML.push('<table class="ns1blankspace">');
					aHTML.push('<tr><td id="ns1blankspaceReportUpdateColumn1"></td>' +
							   '<td id="ns1blankspaceReportUpdateColumn2" style="width:200px;"></td>' +
							   '</tr></table>');
				
					$('#ns1blankspaceReportUpdate').html(aHTML.join(''));

					aHTML = [];

					aHTML.push('<table class="ns1blankspace">');
					aHTML.push('<tr><td colspan=2 style="font-size:0.875em; color:#B8B8B8; padding:4px; background-color:#F8F8F8;">Include</td>' +
								'<td colspan=1 style="font-size:0.875em; color:#B8B8B8; padding:4px; background-color:#F8F8F8;">Update To</td></tr>');
				
					$.each(oParameters, function()
					{
						if (this == sExtraIDColumnBefore || this === sIDColumn)
						{}
						else 
						{		
							var sName = this.replace(/\./g, '_');
							var sCaption = $('#ns1blankspaceReport_caption_' + sName).html();
							var sSearchRelatedField = $('#ns1blankspaceReport_caption_' + sName).next().attr('data-searchRelatedField');
							var sInputType = $('#ns1blankspaceReport_caption_' + sName).next().attr('data-inputType');
							var sSearchMethod = $('#ns1blankspaceReport_caption_' + sName).next().attr('data-searchMethod');
							var sDataType = $('#ns1blankspaceReport_caption_' + sName).next().attr('data-dataType');
							var sInputTypeTitle = (sInputType) ? sInputType.substr(0,1).toUpperCase() + sInputType.substr(1) : 'Text';
							sInputTypeTitle = (sInputType === 'textbox') ? 'Text' : sInputTypeTitle;

							// we can't bulk update anything except lookup fields against SETUP
							if (sSearchMethod == '' || sSearchMethod.split('_')[0] == 'SETUP')
							{
								aHTML.push('<tr><td style="width:15px;" id="ns1blankspaceReportUpdate_include_' + sName + '" class="ns1blankspaceRow">' +
											'<input type="checkbox" id="ns1blankspaceReportUpdateCheck_include_' + sName + '"' +
												' data-name="' + sName + '"' +
												' class="ns1blankspaceReportUpdateInclude">' +
											'</td>');
							
								aHTML.push('<td style="width:200px;" id="ns1blankspaceReportUpdate_caption_' + sName + '" class="ns1blankspaceReport ns1blankspaceRow">' +
											sCaption + '</td>');
								
								aHTML.push('<td style="width:200px;" id="ns1blankspaceReportUpdate_value_' + sName + '"' +
													' class="ns1blankspaceRow ns1blankspace' + sInputTypeTitle  + '">');

								aHTML.push('<input id="ns1blankspaceReportUpdate_input_' + sName + '"' +
													' class="ns1blankspaceRow ns1blankspace' + sInputTypeTitle);

								if (sDataType == 'date')
								{
									aHTML.push(' hasDatepicker');
								}
								aHTML.push('"');

								if (sInputType === "select") {
									aHTML.push(' data-method="' + sSearchMethod + '"');
									aHTML.push(' data-searchRelatedField="' + sSearchRelatedField + '"');
								}
								aHTML.push('></td>');

								aHTML.push('</tr>');
							}
						}

					});
						
					aHTML.push('</table>');

					$('#ns1blankspaceReportUpdateColumn1').html(aHTML.join(''));

					aHTML = [];
					aHTML.push('<table style="font-size:0.875em;"><tr>');
					aHTML.push('<td style="color:#B8B8B8; padding:4px; x-background-color:#F8F8F8; text-align:right;">' +
								'<span id="ns1blankspaceReportUpdateProcess"></span></td></tr>');
					aHTML.push('<tr><td id="ns1blankspaceReportUpdateProgress">&nbsp;</td></tr>');
					aHTML.push('</table>');

					$('#ns1blankspaceReportUpdateColumn2').html(aHTML.join(''));

					$('#ns1blankspaceReportUpdateProcess').button(
					{
						label: 'Update'
					})
					.click(function()
					{ 
						ns1blankspace.util.setParam(oParam, 'step', 0);
						ns1blankspace.report.update.send(oParam);
					}).
					css('font-size', '0.75em');
				}
			}

			var sShowID = 'radioReport-Update';

			$('#ns1blankspaceReportHeaderOptions :radio').each(function()
			{	
				var sSuffix = $(this).attr('id').split('-')[1];

				if ($(this).attr('id') === sShowID)
				{
					$('#ns1blankspaceReport' + sSuffix).show();
				}
				else
				{
					$('#ns1blankspaceReport' + sSuffix).hide();
				}
			});
		},

		send: function (oParam)
		{
			var oResponse;
			var iMoreID;
			var sErrorText;
			var iStep = 0;
			var aUpdateColumns = [];
			var bUpdateData = true;
			
			//ns1blankspace.report.data = {};
			//ns1blankspace.report.data.rows = [];

			if (oParam)
			{
				oResponse = oParam.response;
				if (oParam.updateColumns) {aUpdateColumns = oParam.updateColumns;}
				if (oParam.step) {iStep = oParam.step; }
			}

			if ($("input.ns1blankspaceReportUpdateInclude:checked").length == 0)
			{
				ns1blankspace.status.error('Please choose at least one column to update.');
			}
			else
			{						
				var sTotal = ns1blankspace.report.data.count;

				if (iStep == 0)
				{
					if (confirm("You are about to update " + sTotal + ' records. Are you sure you want to continue?'))
					{ 
						if (ns1blankspace.report.data.count != ns1blankspace.report.data.resultRows.length)
						{
							var sData = 'id=' + ns1blankspace.report.data.moreID +
										'&startrow=0' +
										'&rows=' + ns1blankspace.report.data.count;

							ns1blankspace.status.working('Getting data');

							$.ajax(
							{
								type: 'POST',
								url: '/rpc/core/?method=CORE_SEARCH_MORE',
								data: sData,
								dataType: 'json',
								success: function(oResponse)
								{
									ns1blankspace.status.clear();
									ns1blankspace.report.data.resultRows = oResponse.data.rows;
									oParam.step = 1;
									ns1blankspace.report.update.send(oParam);
								}
							});	
						}
						else
						{
							oParam.step = 1;
							ns1blankspace.report.update.send(oParam);
						}
					}
				}

				if (iStep == 1)
				{
					$('#ns1blankspaceReportUpdateProgress').html('<span id="ns1blankspaceReportUpdateProgressCount">0</span>&nbsp;of ' + sTotal + ' records updated');

					$("input.ns1blankspaceReportUpdateInclude:checked").each(function()
					{
						var sInputXHMLElementID = $(this).attr('id').replace('Check_include_', '_input_');
						
						var sUpdateColumn = $('#' + sInputXHMLElementID).attr('data-searchrelatedfield');

						if (sUpdateColumn === undefined)
						{ 
							sUpdateColumn = $(this).attr('data-name').replace(/_/g, '.');
						}

						sUpdateColumn = sUpdateColumn.substr(sUpdateColumn.indexOf('.') + 1);

						var sUpdateValue = $('#' + sInputXHMLElementID).val();
						if ($('#' + sInputXHMLElementID).attr('data-id'))
						{
							sUpdateValue = $('#' + sInputXHMLElementID).attr('data-id');
						}
						
						aUpdateColumns.push({name: sUpdateColumn, value: sUpdateValue});
					});
					
					ns1blankspace.util.setParam(oParam, 'updateColumns', aUpdateColumns);
					delete oParam.step;
					delete oParam.processIndex;
					ns1blankspace.report.update.process(oParam)
				}
			}
		},

		process: function(oParam)
		{
			var sErrorText;

			var oData = {};
			var aUpdateColumns = [];
			var sRowID;
			var iProcessIndex = 0;
			var oRow;

			if (oParam)
			{
				if (oParam.updateColumns) {aUpdateColumns = oParam.updateColumns;}
				if (oParam.processIndex) {iProcessIndex = oParam.processIndex;}
			}

			if (aUpdateColumns.length > 0)
			{
				if (iProcessIndex < ns1blankspace.report.data.resultRows.length)
				{	
					ns1blankspace.status.working();

					oRow = ns1blankspace.report.data.resultRows[iProcessIndex];

					oData.id = oRow.id;

					$.each(aUpdateColumns, function()
					{
						oData[this.name] = this.value;
					});

					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI(ns1blankspace.report.config.method.replace('_SEARCH', '_MANAGE')),
						data: oData,
						dataType: 'json',
						success: function(oResponse)
						{
							if (oResponse.status == 'OK')
							{								
								$('#ns1blankspaceReportUpdateProgressCount').html(iProcessIndex + 1);
								oParam.processIndex = iProcessIndex + 1;
								ns1blankspace.report.update.process(oParam)
							}
							else
							{
								ns1blankspace.status.error('An error has ocuured.');
							}
						}
					});
				}
				else
				{
					ns1blankspace.status.message('Update complete')
				}
			}
			else
			{
				sErrorText = 'Parameters not passed to Update.';
			}
		}
	},		

	email:		
	{
		show: function (oParam)
		{
			var oResponse = ns1blankspace.report.data.resultRows;
			var bContainsContactPerson = ns1blankspace.report.data.containsContactPerson;
			var aColumns = [];

			if (oParam)
			{
				if (oParam.response) {oResponse = oParam.response;}
				if (oParam.columns) {aColumns = oParam.columns;}
			}

			if (oResponse && $('#ns1blankspaceReportSendColumn1').html() == undefined)
			{
				if (bContainsContactPerson)
				{	
					// Show editor and template fields, buttons for preview & Sending
					ns1blankspace.format.editor.init();

					for (edID in tinyMCE.editors) 
								tinyMCE.editors[edID].destroy(true);
							
					ns1blankspace.counter.editor = ns1blankspace.counter.editor + 1;	

					aHTML = [];
					aHTML.push('<table class="ns1blankspaceContainer"><tr>');
					aHTML.push('<td id="ns1blankspaceReportSendColumn1"></td>' +
							   '<td id="ns1blankspaceReportSendColumn2" style="width:100px;"></td>' +
							   '</tr></table>');
					
					$('#ns1blankspaceReportSend').html(aHTML.join(''));
					
					var aHTML = [];
					var oMCEBookmark;
				
					aHTML.push('<table style="font-size:0.875em;">');

					aHTML.push('<tr>' +
									'<td style="color:#B8B8B8; padding:6px; background-color:#F8F8F8;"class="ns1blankspaceSub">Send an email to contacts in results</td>' +
									'<td style="width:200px; color:#B8B8B8; padding:4px; background-color:#F8F8F8; text-align:right;">' +
									'<span id="ns1blankspaceReportSendPreview" class="ns1blankspaceAction">Preview</span>' +
									' <span id="ns1blankspaceReportSendEmail" class="ns1blankspaceAction">Email</span>' +
									'</td></tr>');

					aHTML.push('<tr><td colspan=2 id="ns1blankspaceReportSendColumn1Row1" style="padding-left:3px; padding-right:11px;">' +
								'<input id="ns1blankspaceReportSendSubject" class="ns1blankspaceText">');

					aHTML.push('</td></tr>');

					aHTML.push('<tr><td colspan=2 id="ns1blankspaceReportSendColumn1Row2">');
						aHTML.push('<table class="ns1blankspace">');
						aHTML.push('<tr><td>' +
									'<textarea rows="30" cols="50" id="ns1blankspaceReportSendText' +
										ns1blankspace.counter.editor + '" editorcount="' + ns1blankspace.counter.editor + '" class="ns1blankspaceTextMulti"></textarea>' +
									'</td></tr></table>');
							
					aHTML.push('</td></tr>');

					$('#ns1blankspaceReportSendColumn1').html(aHTML.join(''));

					tinyMCE.EditorManager.execCommand('mceAddEditor', false, 'ns1blankspaceReportSendText' + ns1blankspace.counter.editor);
							
					aHTML = [];

					aHTML.push('<table>');
					aHTML.push('<tr><td class="ns1blankspaceCaption" style="font-size:0.75em;">' +
								'Tags..</td></tr>');

					$.each(ns1blankspace.report.data.outputParameters, function()
					{
						aHTML.push('<tr><td class="ns1blankspaceRow ns1blankspaceRowSelect" style="font-size:0.75em;">');

						aHTML.push('<span id="spanInterfaceFormatTag_' + (this.caption).replace(/ /g,'-') + '"' +
								  		' class="ns1blankspaceFormatTags" ' +
								   		' data-caption="[[' + (this.caption) + ']]" style="cursor: pointer;">' + this.caption + '</span>');

						aHTML.push('</td></tr>');
					});
							
					aHTML.push('</table>');					
					
					$('#ns1blankspaceReportSendColumn2').html(aHTML.join(''));
				
					$('#ns1blankspaceReportSendPreview').button(
					{
						label: 'Preview'
					})
					.click(function()
					{
						var sText = ns1blankspace.report.mergeFields(
						{
							columns: ns1blankspace.report.data.outputParameters, 
							replace: tinyMCE.get(('ns1blankspaceReportSendText' + ns1blankspace.counter.editor)).getContent()
						});
						
						var aReportParam = 
						{
							preview: true,
							subject: $('#ns1blankspaceReportSendSubject').val(),
							row: ns1blankspace.report.data.resultRows[0],
							moreID: ns1blankspace.report.data.moreID, 
							parameters: ns1blankspace.report.data.outputParameters,
							object: ns1blankspace.report.config.object,
							text: sText
						}

						ns1blankspace.report.email.send(aReportParam);
					})
					.css('font-size', '0.75em');
			
					$('#ns1blankspaceReportSendEmail').button(
					{
						label: 'Send'
					})
					.click(function()
					{
						var sText = ns1blankspace.report.mergeFields(
						{
							columns: ns1blankspace.report.data.outputParameters, 
							replace: tinyMCE.get(('ns1blankspaceReportSendText' + ns1blankspace.counter.editor)).getContent()
						});

						ns1blankspace.report.email.send(
						{
							moreID: ns1blankspace.report.data.moreID,
							parameters: ns1blankspace.report.data.outputParameters,
							text: sText,
							subject: $('#ns1blankspaceReportSendSubject').val()
						});
					})
					.css('font-size', '0.75em');
					
					$('.ns1blankspaceFormatTags')
					.hover( function()
					{	
						var s = 1;
						oMCEBookmark = tinyMCE.get(('ns1blankspaceReportSendText' + ns1blankspace.counter.editor)).selection.getBookmark({type: 1, normalized: true});
						s = 2;
					})
					.click( function()
					{
						ns1blankspace.format.editor.addTag({xhtmlElementID: this.id,
													  editorID: 'ns1blankspaceReportSendText' + ns1blankspace.counter.editor, 
													  mceBookmark: oMCEBookmark})
					})
					
					tinyMCE.execCommand('mceAddControl', false, 'ns1blankspaceReportSendText' + ns1blankspace.counter.editor);
				}
				else
				{
					var sText = '';

					if (oResponse)
					{
						sText = 'To send bulk emails, you must include at least one field from the contact person.';
					}
					else
					{
						sText = 'No results to send.';
					}

					aHTML = [];
					aHTML.push('<table style="margin:10px; width:350px;"><tr>');
					aHTML.push('<td class="ns1blankspaceSub">' + sText + '</td>' +
							   	'</tr></table>');
					
					$('#ns1blankspaceReportSend').html(aHTML.join(''));
				}
			}

			var sShowID = 'radioReport-Send';

			$('#ns1blankspaceReportHeaderOptions :radio').each(function()
			{	
				var sSuffix = $(this).attr('id').split('-')[1];
				if ($(this).attr('id') === sShowID)
				{
					$('#ns1blankspaceReport' + sSuffix).show();
				}
				else
				{
					$('#ns1blankspaceReport' + sSuffix).hide();
				}
			});
		},

		preview: function (oParam)
		{
			var oRow;
			var iMoreID;
			var sText = "";
			var sParam = "";
			var oParameters = [];
			var sTags = "";
			var iObject;
			
			if (oParam != undefined)
			{
				if (oParam.row != undefined) {oRow = oParam.row}
				if (oParam.moreID != undefined) {iMoreID = oParam.moreID}		
				if (oParam.parameters != undefined) {oParameters = oParam.parameters}		
				if (oParam.text != undefined) {sText = oParam.text}		
				if (oParam.object != undefined) {iObject = oParam.object}		
			}
			else
			{
				ns1blankspace.status.error('Preview aborted.');
				return false;
			}
			
			if (false && iObject == 32)
			{
				sTags = oParameters.join('|');
			}
			else
			{
				var aTags = [];

				$.each(oParameters, function()
				{
					aTags.push(this.name);
				});

				if (aTags.length > 0)
				{
					sTags = aTags.join('|')
				}
			}
			
			var oData =
			{
				more: iMoreID,
				object: ns1blankspace.report.config.object,
				objectcontext: oRow.id,
				templatetext: sText,
				tags: sTags,
				rf: 'text'
			}	

			$.ajax(
			{
				type: 'POST',
				cache: false,
				url: ns1blankspace.util.endpointURI("CORE_MORE_APPLY_TEMPLATE"),
				data: oData,
				dataType: 'JSON',
				success: function(data)
				{
					if (data.substr(0,12) == "OK|RETURNED|")
					{	
						ns1blankspace.status.message(data.substring(12));	
						// ToDo: Add preview page
					}
				}
			});
		},

		send: function(oParam)
		{
			var iMoreID;
			var sText = "";
			var sParam = "";
			var oParameters = [];
			var sTags = "";
			var sEmail = "";
			var sSubject = "";
			var oRow;
			var bPreview = false;
			
			if (oParam != undefined)
			{
				if (oParam.moreID != undefined) {iMoreID = oParam.moreID}		
				if (oParam.parameters != undefined) {oParameters = oParam.parameters}		
				if (oParam.text != undefined) {sText = oParam.text}		
				if (oParam.subject != undefined) {sSubject = oParam.subject}		
				if (oParam.row != undefined) {oRow = oParam.row}	
				if (oParam.preview != undefined) {bPreview = oParam.preview}	
			}
			else
			{
				ns1blankspace.status.error('Can not preview');
				return false;
			}
			
			if (bPreview)
			{
				//Sending the preview to the current user

				var aTags = [];

				$.each(oParameters, function()
				{
					aTags.push(this.name);
				});

				if (aTags.length > 0)
				{
					sTags = aTags.reverse().join('|')
				}
			
				var oData =
				{
					more: iMoreID,
					object: ns1blankspace.report.config.object,
					objectcontext: oRow.id,
					templatetext: sText,
					tags: sTags
				}	

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI("CORE_MORE_APPLY_TEMPLATE"),
					data: oData,
					dataType: 'JSON',
					success: function(data)
					{
						if (data.status == "OK")
						{	
							sText = data.text;

							var oDataSend =
							{
								subject: sSubject,
								message: sText,
								to: ns1blankspace.user.email
							}		

							$.ajax(
							{
								type: 'POST',
								url: ns1blankspace.util.endpointURI("MESSAGING_EMAIL_SEND"),
								data: oDataSend,
								dataType: 'JSON',
								success: function(oResponse)
								{
									if (oResponse.status == 'OK')
									{
										ns1blankspace.status.message('Email sent to ' + ns1blankspace.user.email);
									}
									else
									{
										ns1blankspace.status.message('An error has occurred');
									}
								}
							});
						}
					}
				});
			}
			else
			{
				// Time to send the email to all of the report results
				if (confirm("Are you sure you want to send an email to all of the contacts in the search results?"))
				{
					var aTags = [];

					$.each(oParameters, function()
					{
						aTags.push(this.name);
					});

					if (aTags.length > 0)
					{
						sTags = aTags.reverse().join('|')
					}
					
					var oData =
					{
						more: ns1blankspace.report.data.moreID, 
						title: sSubject,
						status: 1, 
						type: 2,
						scheduletype: 9,
						schedulemaximumcount: 1, 
						responseactionfrom: ns1blankspace.user.email, 
						templatetext: sText, 
						caption: sTags,
						saveaction: 'Y'
					}		 

					$.ajax(
					{
						type: 'POST',
						url: ns1blankspace.util.endpointURI("SETUP_AUTOMATION_MANAGE"),
						data: oData,
						dataType: 'JSON',
						success: function(data)
						{
							ns1blankspace.status.message("Email(s) scheduled to be sent");
						}
					});
				}
				else
				{
					return false;
				}
			}
		}
	},
							
	sms: 		
	{
		show: function (oParam)
		{
			$('div.ns1blankspaceReportContainer').hide();
			$('#ns1blankspaceReportSMS').show();

			var bContainsContactPerson = ns1blankspace.report.data.containsContactPerson;

			var aHTML = [];

			if (!bContainsContactPerson)
			{	
				aHTML.push('<table style="margin:10px; width:350px;">' +
							'<tr><td class="ns1blankspaceSub">' +
							'To send bulk SMSs, you must include at least one field from the contact person.</td>' +
					   		'</tr></table>');
			
				$('#ns1blankspaceReportSMS').html(aHTML.join(''));
			}
			else
			{	
				aHTML.push('<table class="ns1blankspaceContainer">' +
							'<tr><td style="color:#B8B8B8; padding:4px; background-color:#F8F8F8; font-size:0.875em; vertical-align:middle;">' +
							'Enter your message and then click Send.</td>' +
							'<td style="color:#B8B8B8; padding:4px; background-color:#F8F8F8; text-align:right;">' +
							'<span id="ns1blankspaceReportSMSSend" class="ns1blankspaceAction">Send</span>' +
							'</td></tr>' +
							'<tr>' +
							'<td id="ns1blankspaceReportSMSColumn1"></td>' +
					  		'<td id="ns1blankspaceReportSMSColumn2" style="width:200px;"></td>' +
					   		'</tr></table>');
			
				$('#ns1blankspaceReportSMS').html(aHTML.join(''));

				var aHTML = [];

				aHTML.push('<table style="font-size:0.875em;">');

				aHTML.push('<tr><td>' +
								'<textarea rows="15" cols="50" id="ns1blankspaceReportSMSText"></textarea>' +
								'</td></tr>');
						
				aHTML.push('</td></tr></table>');

				$('#ns1blankspaceReportSMSColumn1').html(aHTML.join(''));

				$('#ns1blankspaceReportSMSSend').button(
				{
					label: 'Send'
				})
				.click(function()
				{
					ns1blankspace.report.sms.send(
					{
						text: $('#ns1blankspaceReportSMSText').val()
					});
				})
				.css('font-size', '0.75em');
			}	
		},

		send: function(oParam)
		{
			var sText = ns1blankspace.util.getParam(oParam, 'text').value;
		
			if (confirm("Are you sure you want to send an SMS to all of the Contacts in the report results?"))
			{										
				var oData = 
				{
					more: ns1blankspace.report.data.moreID,
					title: 'Send SMS',
					status: 1, 
					type: 3,
					scheduletype: 9,
					schedulemaximumcount: 1,
					responseactionfrom: '',
					templatetext: sText,
					saveaction: 'Y'
				}	

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI("SETUP_AUTOMATION_MANAGE"),
					data: oData,
					dataType: 'json',
					success: function(data)
					{
						ns1blankspace.status.message("SMS(s) scheduled to be sent.");
					}
				});
			}
		}
	},

	newPage:
	{
		attachmentDetail: function(oParam)
		{
			// We need to bind the File Name column if included in report so that the attachment opens when it's clicked 
			var aObjectIDs = (oParam.objectIDs) ? oParam.objectIDs : [];

			if (oParam.attachmentDetailStep == undefined) {oParam.attachmentDetailStep = 1}

			if (oParam.attachmentDetailStep == 1)
			{
				if (oParam.startRow == undefined) {oParam.startRow = 0}

				// Bind the filename but only if included in the report and we're NOT exporting
				if ($.grep(ns1blankspace.report.data.outputParameters, function(x) {return x.name == 'attachment.filename'}).length > 0 && oParam.exportStep == undefined)
				{
					$.each($('tr.ns1blankspaceRow:visible'), function(index, rowElement)
					{
						var iAttachmentID = $(rowElement).attr('data-id');
						var oAttachment = $.grep(ns1blankspace.report.data.resultRows, function(x) {return x.id === iAttachmentID}).shift();
						var sDownload = (oAttachment) ? oAttachment['attachment.download'] : '';
						var sFileName = $('#attachment_filename_' + iAttachmentID).html();
						aObjectIDs.push(oAttachment['attachment.objectcontext']);

						if (sDownload != '')
						{
							$('#attachment_filename_' + iAttachmentID).html('<a href="' + sDownload + '" class="ns1blankspaceNoUnloadWarn">' + sFileName + '</a>');
						}
					});
					oParam.objectIDs = aObjectIDs;
				}
				else
				{
					for (var i = oParam.startRow; i < (oParam.startRow + oParam.rows); i++)
					{
						aObjectIDs.push(ns1blankspace.report.data.resultRows[i]['attachment.objectcontext']);
					}
				}

				// Search for the linked object's method - but only if they've filtered Linked To..
				if (ns1blankspace.report.data.resultRows.length > 0 && $('#ns1blankspaceReport_comparison-attachment_objecttext-text').attr('data-code') == 'EQUAL_TO')
				{
					var oSearch = new AdvancedSearch();
					oSearch.method = 'CORE_OBJECT_SEARCH';
					oSearch.addField('object.method.title');
					oSearch.addFilter('id', 'EQUAL_TO', ns1blankspace.report.data.resultRows[0]['attachment.object']);
					oSearch.getResults(function(oResponse)
					{
						if (oResponse.status === 'OK')
						{
							ns1blankspace.report.data.attachmentDetailObjectMethod = oResponse.data.rows[0]['object.method.title'];
							oParam.attachmentDetailStep = 2;
							ns1blankspace.report.newPage.attachmentDetail(oParam);
						}
						else
						{
							ns1blankspace.status.error('Error finding object method: ' + oResponse.error.errornotes);
						}
					});
				}
				// If not using an Equal To filter on ObjectText, then we need to remove reference from the report
				else
				{
					ns1blankspace.report.data.resultRows = $.map(ns1blankspace.report.data.resultRows, function(x) 
															{
																var oReturn = x;
																x['attachment.objectreference'] = 'Unavailable';
																return oReturn
															});
					ns1blankspace.report.newPageShow();
					delete(oParam.attachmentDetailStep);
				}
			}

			else if (oParam.attachmentDetailStep == 2)
			{
				var sField = (ns1blankspace.report.data.attachmentDetailObjectMethod == 'ACTION_SEARCH') ? 'actionreference' : 'reference'
				var oSearch = new AdvancedSearch();
				oSearch.method = ns1blankspace.report.data.attachmentDetailObjectMethod;
				oSearch.addField(sField);
				oSearch.addFilter('id', 'IN_LIST', aObjectIDs.join(','));
				oSearch.getResults(function(oResponse)
				{
					if (oResponse.status == 'OK')
					{
						$.each(oResponse.data.rows, function(index, objectRow)
						{
							ns1blankspace.report.data.resultRows = $.map(ns1blankspace.report.data.resultRows, function(x)
																		{
																			var oReturn = x;
																			if (objectRow.id === x['attachment.objectcontext'])
																			{	
																				oReturn['attachment.objectreference'] = objectRow[sField];
																			}
																			return oReturn;
																		});
							ns1blankspace.report.newPageShow();
							delete(oParam.attachmentDetailStep);
						});
					}
					else
					{
						ns1blankspace.status.error('Error finding object reference: ' + oResponse.error.errornotes);
					}
				});
			}

		}
	}
}
