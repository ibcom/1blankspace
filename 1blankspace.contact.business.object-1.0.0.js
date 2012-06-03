var objectModel = [
	{
		object: 12,
		objectName: 'Contact Business',
		objectCode: 'ContactBusiness',
		objectLabel: 'Businesses',
		showHome: true,
		modelMethods: 
		{
			base: 'CONTACT_BUSINESS'
		},
		viewShowActions: true,
		viewShowAttachments: true,
		viewDefault: 'Summary',
		viewHome:
		{
			fields:
			[
				{name: 'tradename'}
			]		
		},
		controller:
		{
			save: interfaceContactBusinessSave(),
			new: interfaceContactBusinessNew(),
			search: interfaceContactBusinessSearch()
		}
		viewSummary:
		{
			column1:
			{
				fields:
				[
					name: 'phone'
				]	
			},
			column2:
			{
				actions:
				[
					{
						caption:	
						function:
					}
				]
			}
		},
		viewSearch:
		{
			name: 'tradename'
		},
		viewContext:
		{
			name: 'tradename'
		},
		viewGroups:
		[
			{
				id: 1,
				name: 'Summary',
				primary: true
			},
			{
				id: 2,
				name: 'Details',
				primary: true
			},
			{
				id: 3,
				name: 'Address',
				primary: true
			},
			{
				id: 4,
				name: 'Groups'
			},
			{
				id: 5,
				name: 'People'
			}
		],
		viewModelGroups:
		[
			{
				group: 4,
				model:
				{	
					search: 
					{
						method: 'CONTACT_BUSINESS_GROUP_SEARCH',
						name: 'grouptext'
					},		
					add: 
					{
						method: 'SETUP_CONTACT_BUSINESS_GROUP_SEARCH',
						name: 'title'
					}			
				}
			}
	
		]
		viewModel:
		[
			{
				name: 'reference'
				caption: 'Reference',
				viewGroup: 2,
				modelDataType: 'Text',
				modelDataLength: 50
			},
			{
				name: 'tradename'
				caption: 'Tradename',
				viewGroup: 2,
				modelDataType: 'Text'
			},
			{
				name: 'legalname'
				caption: 'Legal Name',
				viewGroup: 2,
				modelDataType: 'Text'
			},
			{
				name: 'phonenumber'
				caption: 'Phone',
				viewGroup: 2,
				modelDataType: 'Text'
			},
			{
				name: 'faxnumber'
				caption: 'Fax',
				viewGroup: 2,
				modelDataType: 'Text'
			},	
			{
				name: 'industry'
				caption: 'Industry',
				viewGroup: 2,
				modelDataType: 'Select'
				modelMethod: 'SETUP_CONTACT_INDUSTRY_SEARCH'
			},
			{
				name: 'abn'
				caption: 'ABN',
				viewGroup: 2,
				modelDataType: 'Text'
			},
			{
				name: 'customerstatus'
				caption: 'Industry',
				viewGroup: 2,
				modelDataType: 'Select'
				modelMethod: 'SETUP_CONTACT_INDUSTRY_SEARCH'
			},
			{
				name: 'webaddress'
				caption: 'Web Address',
				viewGroup: 2,
				modelDataType: 'Text'
			},
			{
				name: 'area'
				caption: 'Area',
				viewGroup: 2,
				modelDataType: 'Select'
				modelMethod: 'SETUP_AREA_SEARCH'
			},				 
			{
				name: 'webaddress'
				caption: 'Web Address',
				viewGroup: 2,
				modelDataType: 'Text'
			},
			{
				name: 'streetaddress1'
				caption: 'Street Address 1',
				viewGroup: 3,
				modelDataType: 'Text'
			},			
			{
				name: 'streetaddress2'
				caption: 'Street Address 2',
				viewGroup: 3,
				modelDataType: 'Text'
			},
			{
				name: 'streetsuburb'
				caption: 'Street Suburb',
				viewGroup: 3,
				modelDataType: 'Text'
			},		
			{
				name: 'streetpostcode'
				caption: 'Street Post Code',
				viewGroup: 3,
				modelDataType: 'Text'
			},
			{
				name: 'streetstate'
				caption: 'Street State',
				viewGroup: 3,
				modelDataType: 'Text'
			},
			{
				name: 'streetcountry'
				caption: 'Street Country',
				viewGroup: 3,
				modelDataType: 'Text'
			},
			{
				name: 'mailingaddress1'
				caption: 'Mailing Address 1',
				viewGroup: 3,
				modelDataType: 'Text',
				viewColumn: 2
			},			
			{
				name: 'mailingaddress2'
				caption: 'Mailing Address 2',
				viewGroup: 3,
				modelDataType: 'Text',
				viewColumn: 2
			},
			{
				name: 'mailingsuburb'
				caption: 'Mailing Suburb',
				viewGroup: 3,
				modelDataType: 'Text',
				viewColumn: 2
			},		
			{
				name: 'mailingpostcode'
				caption: 'Mailing Post Code',
				viewGroup: 3,
				modelDataType: 'Text',
				viewColumn: 2
			},
			{
				name: 'mailingstate'
				caption: 'Mailing State',
				viewGroup: 3,
				modelDataType: 'Text',
				viewColumn: 2
			},
			{
				name: 'mailingcountry'
				caption: 'Mailing Country',
				viewGroup: 3,
				modelDataType: 'Text',
				viewColumn: 2
			},
			{
				name: 'notes'
				caption: 'Notes',
				viewGroup: 2,
				modelDataType: 'Text',
				viewColumn: 2
			}
		]
	}
]	