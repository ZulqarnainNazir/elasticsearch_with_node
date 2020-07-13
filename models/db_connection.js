var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {  
  hosts: [
    'https://elastic:8W1VWnXIEalsdabzufCDlrXD@8ce5d776b5784d6e9b0b226aecc153a1.eastus2.azure.elastic-cloud.com:9243/',
  ]
});

module.exports = client;