/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.attachment =
{
	s3:
	{
		data: {},

		copy: function (oParam, oResponse)
		{
			oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.util.attachment.s3.check);
			ns1blankspace.util.attachment.s3.buckets(oParam)
		},

		buckets: function (oParam, oResponse)
		{
			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'SETUP_AWS_S3_BUCKET_SEARCH';		
				oSearch.addField('account,accounttext,notes,title');
				oSearch.addFilter('accounttext', 'TEXT_IS_NOT_EMPTY')
				oSearch.rows = 9999;				
				oSearch.getResults(function(data) {ns1blankspace.util.attachment.s3.buckets(oParam, data)});
			}
			else
			{
				ns1blankspace.util.attachment.s3.data.buckets = oResponse.data.rows;
				ns1blankspace.util.onComplete(oParam);
			}
		},

		check: function (oParam, oResponse)
		{
			var iAWSS3BucketID = ns1blankspace.util.getParam(oParam, 'awsS3BucketID').value;

			if (iAWSS3BucketID == undefined)
			{
				if (ns1blankspace.util.attachment.s3.data.buckets.length == 0)
				{
					ns1blankspace.status.error('You need to set up an S3 bucket.')
				}
				else if (ns1blankspace.util.attachment.s3.data.buckets.length == 1)
				{
					iAWSS3BucketID = ns1blankspace.util.attachment.s3.data.buckets[0].id;
					oParam = ns1blankspace.util.setParam(oParam, 'awsS3BucketID', iAWSS3BucketID);
				}
				else
				{
					ns1blankspace.status.error('You need to specify which S3 bucket.')
				}
			}

			if (iAWSS3BucketID != undefined)
			{
				oParam = ns1blankspace.util.setParam(oParam, 'onComplete', ns1blankspace.util.attachment.s3.process);
				ns1blankspace.util.attachment.s3.attachments(oParam);
			}
		},

		attachments: function (oParam, oResponse)
		{
			var iAttachmentLinkID = ns1blankspace.util.getParam(oParam, 'attachmentLinkID').value;
			var bRefresh = ns1blankspace.util.getParam(oParam, 'refresh', {"default": false}).value;

			if (oResponse == undefined)
			{
				var oSearch = new AdvancedSearch();
				oSearch.method = 'CORE_ATTACHMENT_SEARCH';		
				oSearch.addField('bucket,bucketfilename,buckettext,filename,object,createddate,attachment');

				if (!bRefresh)
				{
					oSearch.addFilter('bucket', 'EQUAL_TO', 0)  //Is it this bucket - if more than one available??
				}

				if (iAttachmentLinkID != undefined)
				{
					oSearch.addFilter('id', 'EQUAL_TO', iAttachmentLinkID)
				}
				oSearch.rows = 99999;				
				oSearch.getResults(function(data) {ns1blankspace.util.attachment.s3.attachments(oParam, data)});
			}
			else
			{
				ns1blankspace.util.attachment.s3.data.attachments = oResponse.data.rows;
				ns1blankspace.util.onComplete(oParam);
			}
		},

		process: function (oParam, oResponse)
		{
			var iAWSS3BucketID = ns1blankspace.util.getParam(oParam, 'awsS3BucketID').value;
			var iAttachmentMoveIndex = ns1blankspace.util.getParam(oParam, 'attachmentMoveIndex', {"default": 0}).value;
			var sXHTMLElementID = ns1blankspace.util.getParam(oParam, 'xhtmlElementID').value;

			if (iAttachmentMoveIndex < ns1blankspace.util.attachment.s3.data.attachments.length)
			{
				ns1blankspace.status.working((iAttachmentMoveIndex + 1) + ' of ' + ns1blankspace.util.attachment.s3.data.attachments.length);
				if (sXHTMLElementID != undefined)
				{
					$('#' + sXHTMLElementID).html('Copying ' + (iAttachmentMoveIndex + 1) + ' of ' + ns1blankspace.util.attachment.s3.data.attachments.length)
				}
				
				var oData =
				{
					direction: 1,
					id: ns1blankspace.util.attachment.s3.data.attachments[iAttachmentMoveIndex].id,
					tobucket: iAWSS3BucketID,
					copy: 1
				}

				$.ajax(
				{
					type: 'POST',
					url: ns1blankspace.util.endpointURI('CORE_ATTACHMENT_MOVE'),
					data: oData,
					global: false,
					dataType: 'json',
					success: function(data)
					{
						iAttachmentMoveIndex = iAttachmentMoveIndex + 1;
						oParam = ns1blankspace.util.setParam(oParam, 'attachmentMoveIndex', iAttachmentMoveIndex);
						ns1blankspace.util.attachment.s3.process(oParam, data)
					}
				});
			}
			else
			{
				ns1blankspace.status.message(ns1blankspace.util.attachment.s3.data.attachments.length + ' attachment(s) moved');
				if (sXHTMLElementID != undefined)
				{
					$('#' + sXHTMLElementID).html(ns1blankspace.util.attachment.s3.data.attachments.length + ' attachment(s) moved')
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