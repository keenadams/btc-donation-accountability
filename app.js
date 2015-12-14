var API_KEY = "16999b866ebc3ebb579f33e9c820a34a"

Handlebars.registerHelper('toBTC', function(context, options) {
	return context / 100000000;
});

function loadTransactionData(txHash) {
	var blockCypherMetaAPI = 'https://api.blockcypher.com/v1/btc/main/txs/' + txHash + '/meta/';
	var blockCypherAPI = 'https://api.blockcypher.com/v1/btc/main/txs/' + txHash;

	function setTransactionsTemplate() {
		var transactionData = JSON.parse(sessionStorage.getItem('transactionData'));
		// 	metaData = JSON.parse(sessionStorage.getItem('metaData'));
		// transactionData['meta'] = metaData;
		var	getTemplate = $('#txinfo-template').html(),
			template = Handlebars.compile(getTemplate),
			result = template(transactionData);

		$('#transaction-info').html(result);
	};

	if (sessionStorage.getItem('transactionData') && sessionStorage.getItem('metaData') && sessionStorage.getItem('transactionData')['hash'] === txHash) {
		setTransactionsTemplate();
	} else {
		$.get(blockCypherAPI, {'token': API_KEY}, function(txinfo) {
			// $.get(blockCypherMetaAPI, {'token': API_KEY}, function(metainfo) {
				var txdata = JSON.stringify(txinfo);
				// var metadata = JSON.stringify(metainfo);
				// sessionStorage.setItem('metaData', metadata);
				sessionStorage.setItem('transactionData', txdata);
				setTransactionsTemplate();
			// });
			
		});
	}
}

function putTransactionMetadata(txHash, metadata) {
	var blockCypherMetaAPI = 'https://api.blockcypher.com/v1/btc/main/txs/' + txHash + '/meta/';

	$.ajax({ 
		url: blockCypherMetaAPI,
		method: 'PUT',
		token: API_KEY,
		data: JSON.stringify(metadata),
		dataType: 'json',
		xhrFields: {
			withCredentials: true
		}
	}).done(function() {
		alert("Metadata has been added!");
	});

}

var ready;

ready = function() {
	
	$('#buttonTransactions').on('click', function (e) {
		var txHash = $('#transactionHash').val();
		if (txHash != "") {
			$('#transactionHash').val("");
			loadTransactionData(txHash);
		}
	});

	$('#buttonMetadata').on('click', function (e) {
		var txHash = $('#mtTransactionHash').val();
		var metadata = $('#transactionMetadata').val();
		if (txHash != "" && metadata != "") {
			$('#mtTransactionHash').val("");
			$('#transactionMetadata').val("");
			putTransactionMetadata(txHash, metadata);
			$('metaAlert').removeClass("hidden");
		}
	});
}

$(document).ready(ready);

$(document).on('page:load', ready);
