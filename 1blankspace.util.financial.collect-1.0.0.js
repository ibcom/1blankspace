/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 * http://docs.mydigitalstructure.com/community_stripe
 *
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}
if (ns1blankspace.util.financial === undefined) {ns1blankspace.util.financial = {}}

ns1blankspace.util.financial.paynow = function (oObjectData)
{
    var sHTML = '';
    var sHRef = '';

    if (ns1blankspace.option.stripe != undefined)
    {
        sHRef = ns1blankspace.option.stripe.url + '/#';
        sHRef = sHRef + 'invoiceGUID=' + oObjectData['guid'];
        sHRef = sHRef + '|amount=' + oObjectData['amount'];
        sHRef = sHRef + '|description=' + oObjectData['reference'];

        var sText = ns1blankspace.option.stripe.text;
        if (sText == undefined) {sText = 'Pay Now'}
        sHTML = '<a href="' + sHRef + '" target="_blank">' + sText + '</a>';
    }

    return sHTML;
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






