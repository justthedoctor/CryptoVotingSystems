var pandacoin = require('node-pandacoin') ()
var moment = require('moment')
var http = require('http');
const fs = require('fs')

pandacoin.set({port:10000})
pandacoin.auth('', '')
pandacoin.exec('listtransactions', 'votepage', 500000000, function(err, trans) {

let totalYes = 0, totalNo = 0, totalAll = 0
let yesVotes = 0, noVotes = 0, totalVotes = 0
trans.forEach((ob, i, arr) => {
    if (/7W$/.test(ob.address)) {
    	totalYes += +ob.amount
	yesVotes++
    } else {
    	totalNo += +ob.amount
	noVotes++
    }
    totalAll += +ob.amount
    totalVotes++
})

	let html = `
       <style type="text/css">
        .tg  {border-collapse:collapse;border-spacing:0;border-color:#999;margin:0px auto;}
        .tg td{font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#999;color:#444;background-color:#F7FDFA;border-top-width:1px;border-bottom-width:1px;}
        .tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:0px;overflow:hidden;word-break:normal;border-color:#999;color:#000;background-color:#FFBF00;border-top-width:1px;border-bottom-width:1px;}
        .tg .tg-0ord{text-align:right}
        .tg .tg-yw4l{vertical-align:top}
        .tg .tg-6k2t{background-color:#F3F781;vertical-align:top}
      </style>
      <title>Pandacoin Voting</title>
      <center><img src="http://i61.tinypic.com/161gq6g.jpg"></center>

      <b><br><center>Experimenting with Pandacoin voting, for our first vote we would like to know your vote on using Pandacoin to vote for our community decisions. <br>
	Count updated every 15m<br>
Last Update: ${moment().format('MMMM Do YYYY, h:mm a')} UTC<br>
      Please cast your Vote by simply sending some Pandacoin to either the Yes or No Pandacoin address provided</center>
      <!-- <body background="http://1.bp.blogspot.com/-9kxoNbnHLtM/UtJse9ERdUI/AAAAAAAAGdA/bfZmuiS7IR8/s1600/Green-bamboo-pattern-design-texture-template-HD-download.jpg" text="#fff"> -->
      <body background="http://data.whicdn.com/images/62101990/large.png" text="#000">
      <br><center>Does Voting with your Pandacoin seem like a good idea?
      <br>Vote Yes: <a href="https://chainz.cryptoid.info/pnd/address.dws?PQ8ks5DbC1pF9RpZpKwW9B3j9kizx1mi7W.htm">PQ8ks5DbC1pF9RpZpKwW9B3j9kizx1mi7W</a>
      <br>Vote No: <a href="https://chainz.cryptoid.info/pnd/address.dws?PM25vrPjAVj9bnoYFHBADQKBvAAUcmwCSm.htm">PM25vrPjAVj9bnoYFHBADQKBvAAUcmwCSm</a></font>
      </b></center>
      <table class="tg">
        <tr>
          <th>Received Address </th>
          <th>Transaction HASH</th>
          <th>Amount Sent</th>
	  <th>Date & Time</th>
        </tr>
        ${
			trans.map(
			 	cv => `
                <tr>
                  <td class="tg-yw4l">${cv.address}</td>
                  <td class="tg-6k2t"><a href="https://chainz.cryptoid.info/pnd/tx.dws?${cv.txid}">${cv.txid}</a></td>
                  <td class="tg-yw4l">${cv.amount} PND</td>
                  <td clasd="tg-yw41">${moment(cv.timereceived * 1000).format('MMMM Do YYYY, h:mm a')}</td>
                </tr>
                `
			).join('\n')
		}

        <tr>
              <th><a href="https://chainz.cryptoid.info/pnd/address.dws?PQ8ks5DbC1pF9RpZpKwW9B3j9kizx1mi7W.htm">PQ8ks5DbC1pF9RpZpKwW9B3j9kizx1mi7W</a> Votes Yes: ${yesVotes} <br>
      <center>Total PND ${totalYes}</center></th>

          <th><b><center>Total Votes: ${totalVotes}</b></center></th>
          <th><a href="https://chainz.cryptoid.info/pnd/address.dws?PM25vrPjAVj9bnoYFHBADQKBvAAUcmwCSm.htm">PM25vrPjAVj9bnoYFHBADQKBvAAUcmwCSm</a> Votes No: ${noVotes} <br>
      <center>Total PND ${totalNo} </center></th>
	<th> </th>
        </tr>

      </table>
      <b><center>All Digital Pandacoin used to vote are added as donations to our <a href="http://cryptodepot.org/faucet/pandacoin">Pandacoin Faucet</a>.<br.
	  <a href="https://github.com/justthedoctor/CryptoVotingSystems">Github</a> Link.
	  </center></b>
	`
    fs.writeFile("/var/www/html/vpagetest/index.html", html, function(err) {
      if(err) {
          return console.log(err);
      }
    	console.log("File saved successfully!");
	});	
});
