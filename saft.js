const fs = require("fs");
//const util = require('util')

const xml2js = require("xml2js");
//const xml2json = require('xml2json')

let parser = new xml2js.Parser();

const file = process.argv[process.argv.length - 1];

if (process.argv[2] === "--saft" || process.argv[2] === "-S") {
  fs.readFile(file, "utf-8", (err, data) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }
    parser.parseString(data, (err, result) => {
      // console.dir(result.AuditFile.SourceDocuments[0]
      //     .SalesInvoices[0].Invoice)

      var inVoice =
        result.AuditFile.SourceDocuments[0].SalesInvoices[0].Invoice;

      let txt = "";
      let total = {
        creditos: 0,
        debitos: 0
      };

      inVoice.forEach(function(inV, key) {
        //console.log(inV.InvoiceNo[0], inV.DocumentTotals[0].GrossTotal)
        txt += inV.InvoiceNo[0] + " " + inV.DocumentTotals[0].GrossTotal + "\n";
        if (inV.InvoiceType[0] === "NC") {
          total.debitos += Number.parseFloat(inV.DocumentTotals[0].GrossTotal);
        } else {
          total.creditos += Number.parseFloat(inV.DocumentTotals[0].GrossTotal);
        }
        console.log(inV.InvoiceType);
        console.log(inV.DocumentTotals[0].GrossTotal, total);
      });
      total.creditos = total.creditos.toFixed(2);
      total.debitos = total.debitos.toFixed(2);
      txt += `total= ${JSON.stringify(total)}`;

      const resultFile = `${file.split(".")[0]}.txt`;
      fs.writeFile(resultFile, txt, err => {
        if (err) {
          console.log(err.message);
          throw err;
        }
      });
    });
  });
} else if (process.argv[2] === "--text" || process.argv[2] === "-T") {
  fs.readFile(file, "utf-8", (err, data) => {
    if (err) {
      console.error(err.message);
      process.exit(1);
    }
    const lines = data.split("\n");
    let total = 0;
    lines.map(l => {
      if (l.trim() != "") {
        const aux = l.split(" €")[0].split(" ");
        const value = parseFloat(aux[aux.length - 1].replace(",", "."));
        total += value;
        console.log(aux[0], aux[aux.length - 1], total);
      }
    });
  });
}

//console.log(util.inspect(result, false, null))
