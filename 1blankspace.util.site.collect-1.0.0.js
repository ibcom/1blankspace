/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 * v
 *
 * http://www.larryullman.com/2012/12/05/writing-the-javascript-code-for-handling-stripe-payments/
 * https://bootsnipp.com/snippets/featured/responsive-stripe-payment-form
 *
 * Example /paynow;

    <script src="/jscripts/jquery-1.8.3.min.js"></script>
    <script src="https://js.stripe.com/v2/"></script>
    <script src="/site/312/1blankspace.util.site.collect-1.0.0.js"></script>
    <p>Pay Now</p>
    <div id="ns1blankspaceUtilFinancialStripeContainer"></div>
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}
if (ns1blankspace.util.site === undefined) {ns1blankspace.util.site = {}}
if (ns1blankspace.util.site.collect === undefined) {ns1blankspace.util.site.collect = {}}

$(document).ready(function()
{  
    var aContext = [];
    var oContext = {};

    if (mydigitalstructureContextId != undefined && mydigitalstructureContextId != '')
    {
        aContext = mydigitalstructureContextId.split('|'); 
    }
    else if (window.location.hash != '')
    {
        aContext = window.location.hash.replace('#', '').split('|');
    }

    $.each(aContext, function (c, context)
    {
        oContext[context.split('=')[0]] = context.split('=')[1]
    })

    ns1blankspace.util.site.collect.init(oContext)
});


ns1blankspace.util.site.collect =
{
    data: {_publicKey: '1234'},

    init: function (oParam)
    {    
        if (window.location.protocol == 'http:')
        {
            window.location.href = window.location.href.replace('http', 'https')
        }
        else
        {
            ns1blankspace.util.site.collect.data.xhtmlContainer = 
                $('#ns1blankspaceUtilFinancialStripeContainer');

            ns1blankspace.util.site.collect.data.stripe =
                (ns1blankspace.util.site.collect.data.xhtmlContainer != undefined)

            if (ns1blankspace.util.site.collect.data.stripe)
            {
                ns1blankspace.util.site.collect.stripe.init(oParam);
            }    
        }    
    },

    error: function (sError)
    {
        ns1blankspace.util.site.collect.data.xhtmlContainer.html(sError)
    },

    stripe:
    {
        init: function (oParam, oResponse)
        {
            if (oResponse == undefined)
            {
                if (ns1blankspace.util.site.collect.data._publicKey != undefined)
                {
                    ns1blankspace.util.site.collect.stripe.init(oParam,
                    {
                        apikey: ns1blankspace.util.site.collect.data._publicKey,
                        status: 'OK'
                    }); 
                }
                else
                {
                    $.ajax(
                    {
                        type: 'POST',
                        url: '/rpc/site/?method=SITE_COLLECT_PAYMENT',
                        data: 'getapikey=1',
                        dataType: 'json',
                        success: function (data)
                        {
                            ns1blankspace.util.site.collect.stripe.init(oParam, data);
                        }
                    });
                }    
            }
            else
            {
                if (oResponse.status == 'OK')
                {
                    ns1blankspace.util.site.collect.data.publicKey = oResponse.apikey;
                    Stripe.setPublishableKey(ns1blankspace.util.site.collect.data.publicKey);
                    ns1blankspace.util.site.collect.stripe.render(oParam)
                }
                else
                {
                    ns1blankspace.util.site.collect.error('Error')
                }
            }    
        },

        render: function (oParam)
        { 
            if (ns1blankspace.util.site.collect.data.xhtmlContainer.html() == '')
            {
                $.ajax(
                {
                    type: 'GET',
                    url: window.location.protocol + '//' + window.location.host + '/site/' + mydigitalstructureSiteId + '/1blankspace.site.collect-1.0.0.html',
                    dataType: 'text',
                    global: false,
                    success: function(data)
                    {
                        ns1blankspace.util.site.collect.data.xhtml = data;
                        //ns1blankspace.util.site.collect.data.xhtmlContainer.hide();
                        //ns1blankspace.util.site.collect.data.xhtmlContainer.html(data);
                        ns1blankspace.util.site.collect.stripe.bind(oParam);
                    },
                    error: function(data)
                    {
                        ns1blankspace.util.site.collect.error('No payment collection template');
                    }
                });
            }
            else
            {
                ns1blankspace.util.site.collect.data.xhtml = ns1blankspace.util.site.collect.data.xhtmlContainer.html();
                ns1blankspace.util.site.collect.stripe.bind(oParam);
            }    
        },

        bind: function (oParam)
        {
            ns1blankspace.util.site.collect.data.xhtml =
                ns1blankspace.util.site.collect.data.xhtml.replace(/\[\[Amount\]\]/g, oParam.amount);
            ns1blankspace.util.site.collect.data.xhtmlContainer.html(ns1blankspace.util.site.collect.data.xhtml)
            ns1blankspace.util.site.collect.data.xhtmlContainer.show();

            $("#payment-form").submit(function(event)
            {
                $('#submitBtn').attr('disabled', 'disabled');
                return false;
            });
        },

        validate: function (oParam)
        {
            var error = false;
     
            // Get the values:
            var ccNum = $('.card-number').val(),
                cvcNum = $('.card-cvc').val(),
                expMonth = $('.card-expiry-month').val(),
                expYear = $('.card-expiry-year').val();
             
            // Validate the number:
            if (!Stripe.card.validateCardNumber(ccNum))
            {
                error = true;
                reportError('The credit card number appears to be invalid.');
            }
             
            // Validate the CVC:
            if (!Stripe.card.validateCVC(cvcNum)) {
                error = true;
                reportError('The CVC number appears to be invalid.');
            }
             
            // Validate the expiration:
            if (!Stripe.card.validateExpiry(expMonth, expYear)) {
                error = true;
                reportError('The expiration date appears to be invalid.');
            }

            if (!error)
            {
                ns1blankspace.util.site.stripe.getToken()
            }
        },  

        getToken: function (oParam)
        {
            // Get the Stripe token:
            Stripe.card.createToken({
                number: ccNum,
                cvc: cvcNum,
                exp_month: expMonth,
                exp_year: expYear
            }, ns1blankspace.util.site.stripe.processToken);
        },

        processToken: function (oStatus, oResponse)
        {
            if (response.error)
            {
                reportError(response.error.message);
            }
            else
            {
                // Get a reference to the form:
                var f = $("#payment-form");
                 
                // Get the token from the response:
                var token = response.id;
                 
                // Add the token to the form:
                f.append('<input type="hidden" name="stripeToken" value="' + token + '" />');
                 
                // Submit the form:
                f.get(0).submit();

                //use ajax form submit
            }
        },

        error: function (oParam)
        {
            $('#payment-errors').text(msg).addClass('error');
     
            // Re-enable the submit button:
            $('#submitBtn').prop('disabled', false);
         
            return false;
        }
    }    
}

/*

Notes for SITE_COLLECT_PAYMENT_STRIPE....

Stripe.com is the easier version of PayPal.

Currently there we have;

1. SITE_COLLECT_PAYMENT - which is integrated with processing an order.
2. SITE_PAYPAL_PDT_METHOD - which is integrated with PayPal,  It is most similar to what we need to do with Stripe.

So propose doing a copy of SITE_PAYPAL_PDT_METHOD and calling it SITE_COLLECT_PAYMENT_STRIPE.

Most of the work is done in view-controller, including the sourcing of a Stripe-token, but still need to do a final call to Stripe in context of a Stripe account with secret password help in financial funds manage the account.

See; http://docs.mydigitalstructure.com/community_stripe

1. SETUP_FINANCIAL_FUNDS_TRANSFER_ACCOUNT_MANAGE

Add Provider = "Stripe"

2. SITE_COLLECT_PAYMENT_STRIPE

## View-controller call to: 

/rpc/site/?method=SITE_COLLECT_PAYMENT_STRIPE
&account= [from SETUP_FINANCIAL_FUNDS_TRANSFER_ACCOUNT_MANAGE - used to get apipassword]
&token= [token from Stripe]
&invoiceGUID= [from myds, optional]
&amount=
&currency= [AUD default]
&description=

## Then method does https call to Stripe and returns to view-controller what stripe returns.

https://api.stripe.com/v1/charges

SetHeader("Authorization: Bearer", [apipassword from SETUP_FINANCIAL_FUNDS_TRANSFER_ACCOUNT_MANAGE account]"

data:
&source= [token passed]
&amount= [as passed]
&currency= [as passed or AUD as default]
&description= [as passed]

--- If the call to SITE_COLLECT_PAYMENT_STRIPE has getapikey=1 and account Provider = Stripe then just return the account apikey - it is needed by view-controller to get the token client side.

--- Also if invoiceGUID is set and in the same space as the funds transfer account, and Stripe return is successful then need to do an "AUTO_PAYMENT" for the amount of the payment.
*/






