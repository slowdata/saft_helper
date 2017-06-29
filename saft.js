const fs = require('fs')
//const util = require('util')

const xml2js = require('xml2js')
//const xml2json = require('xml2json')

let parser = new xml2js.Parser()

const file = process.argv[2];

fs.readFile(file, 'utf-8', function(err, data){

    parser.parseString(data, function (err, result) {

        // console.dir(result.AuditFile.SourceDocuments[0]
        //     .SalesInvoices[0].Invoice)
        
        var inVoice = result.AuditFile.SourceDocuments[0]
            .SalesInvoices[0].Invoice

        let txt = ''
        let total = 0

        inVoice.forEach(function(inV, key){
            //console.log(inV.InvoiceNo[0], inV.DocumentTotals[0].GrossTotal)
            
            txt += inV.InvoiceNo[0] + ' ' + inV.DocumentTotals[0].GrossTotal + '\n'
            total += parseFloat(inV.DocumentTotals[0].GrossTotal)
            console.log(inV.DocumentTotals[0].GrossTotal, total)
        })
        txt += `

total= ${total}`

        const resultFile = `${file.split('.')[0]}.txt`
        fs.writeFile(resultFile,txt)
    
    })
    
})


//console.log(util.inspect(result, false, null))