var cypherfunk = require('node-pandacoin') ()
var moment = require('moment')
var http = require('http');
const fs = require('fs')

cypherfunk.set({port:20000})
cypherfunk.auth('', '')
cypherfunk.exec('listtransactions', 'votepage', 10000000,  function(err, trans) {
let totalYes = 0, totalNo = 0, totalAll = 0
let yesVotes = 0, noVotes = 0, totalVotes = 0
trans.forEach((ob, i, arr) => {
    if (/tJ$/.test(ob.address)) {
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
      <body text="#000">
	  <title>Cypherfunk Voting System</title>
      <center><img src="https://chainz.cryptoid.info/logo/funk.png"></center>
<b><br><center>Experimenting with Cypherfunk voting, for our first vote we would like to know your vote on using Cypherfunk to vote for our community decisions. <br>
        Count updated every 15m<br>
	Last Update: ${moment().format('MMMM Do YYYY, h:mm a')}<br>
      Please cast your Vote by simply sending some Cypherfunk to either the Yes or No Cypherfunk address provided</center>
      
      <br><center>Does Voting with your Cypherfunk seem like a good idea?
      <br>Vote Yes: <a href="https://chainz.cryptoid.info/funk/address.dws?CNqrYogXhkzeNUPYVHSBC9DGYxXiMxH4tJ.htm">CNqrYogXhkzeNUPYVHSBC9DGYxXiMxH4tJ</a>
      <br>Vote No: <a href="https://chainz.cryptoid.info/funk/address.dws?CULBk98uprkEKyEJNKwg9TQbdsQqah7jDH.htm">CULBk98uprkEKyEJNKwg9TQbdsQqah7jDH</a></font>
      </b></center>
      <table class="tg">
        <tr>
          <th>Received Address </th>
          <th>Transaction HASH</th>
          <th>Amount Sent</th>
	  <th>Time Received</th>
        </tr>
        ${
                        trans.map(
                               cv => `
                <tr>
                  <td class="tg-yw4l">${cv.address}</td>
                  <td class="tg-6k2t"><a href="https://chainz.cryptoid.info/funk/tx.dws?${cv.txid}">${cv.txid}</a></td>
                  <td class="tg-yw4l">${cv.amount} FUNK</td>
		  <td clasd="tg-yw41">${moment(cv.timereceived * 1000).format('MMMM Do YYYY, h:mm a')}</td>
                </tr>
                `
                        ).join('\n')
                }

        <tr>
              <th><a href="https://chainz.cryptoid.info/funk/address.dws?CNqrYogXhkzeNUPYVHSBC9DGYxXiMxH4tJ.htm">CNqrYogXhkzeNUPYVHSBC9DGYxXiMxH4tJ</a> <br> Votes Yes: ${yesVotes} <br>
      <center>Total FUNK ${totalYes}</center></th>

          <th><b><center>Total Votes: ${totalVotes}</b></center></th>
          <th><a href="https://chainz.cryptoid.info/funk/address.dws?CULBk98uprkEKyEJNKwg9TQbdsQqah7jDH.htm">CULBk98uprkEKyEJNKwg9TQbdsQqah7jDH</a> <br> Votes No: ${noVotes} <br>
      <center>Total FUNK ${totalNo} </center></th>
	  <th> </th>
        </tr>

      </table>

      <b><center>All Cypherfunk used to vote are added as donations to our <a href="http://cryptodepot.org/faucet/cypherfunk">Cypherfunk Faucet</a>.<br>
	</center></b>
        `
    fs.writeFile("/var/www/html/vpagetest/funk.html", html, function(err) {
      if(err) {
          return console.log(err);
      }
        console.log("File saved successfully!");
        });
});


