/*!
 * ibCom Pty Ltd ATF ibCom Unit Trust & contributors
 * Licensed as Attribution-ShareAlike 4.0 International
 * http://creativecommons.org/licenses/by-sa/4.0/
 *
 * https://github.com/jch/saml
 * btoa('<?xml version="1.0"?><samlp:AuthnRequest ID="_abc123" IssueInstant="2014-09-17T20:53:21" Version="2.0"></samlp:AuthnRequest>')
 *
 */

"use strict";

if (ns1blankspace === undefined) {var ns1blankspace = {}}
if (ns1blankspace.util === undefined) {ns1blankspace.util = {}}

ns1blankspace.util.saml =
{
	exists: 	function (oParam)
				{
					return ('btoa' in window);
				},

	test: 	function ()
				{
					var sSAMLRequest = '<?xml version="1.0"?>' + 
							'<samlp:AuthnRequest ID="_abc123" IssueInstant="2014-09-17T20:53:21" Version="2.0">' +
								'</samlp:AuthnRequest>';

					var sSAMLRequest = '<samlp:AuthnRequest xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"' +
						' xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion" ID="ONELOGIN_809707f0030a5d00620c9d9df97f627afe9dcc24"' +
						' Version="2.0" ProviderName="SP test" IssueInstant="2014-07-16T23:52:45Z" Destination="http://idp.example.com/SSOService.php"' +
						' ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST" AssertionConsumerServiceURL="http://sp.example.com/demo1/index.php?acs">' +
					  '<saml:Issuer>http://sp.example.com/demo1/metadata.php</saml:Issuer>' +
					  '<samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" AllowCreate="true"/>' +
					  '<samlp:RequestedAuthnContext Comparison="exact">' +
					  '<saml:AuthnContextClassRef>urn:oasis:names:tc:SAML:2.0:ac:classes:PasswordProtectedTransport</saml:AuthnContextClassRef>' +
					  '</samlp:RequestedAuthnContext>' +
						'</samlp:AuthnRequest>'

					var sURISAMLRequest = btoa(sSAMLRequest);
					console.log(sURISAMLRequest)

					sURISAMLRequest = encodeURIComponent(sURISAMLRequest);
					console.log(sURISAMLRequest)		

					var sURL = 'https://accounts.google.com/o/saml2/idp?idpid=C00mem5jv&SAMLRequest=' + sURISAMLRequest
					console.log(sURL)

					//var d = decodeURIComponent('PD94bWwgdmVyc2lvbj0iMS4wIj8%2BPHNhbWxwOkF1dGhuUmVxdWVzdCBJRD0iX2FiYzEyMyIgSXNzdWVJbnN0YW50PSIyMDE0LTA5LTE3VDIwOjUzOjIxIiBWZXJzaW9uPSIyLjAiPjwvc2FtbHA6QXV0aG5SZXF1ZXN0Pg%3D%3D');
					//console.log(d)
					//console.log(base64.decode(d))
				}
}	

