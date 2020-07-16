var elasticsearch=require('elasticsearch');

var client = new elasticsearch.Client( {  
  hosts: [
    'http://elastic_user:'+ escape("Le?BdSz^Ae89")+'@13.93.7.149:600/',
  ]
});

module.exports = client;