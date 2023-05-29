//G-68KPG6JX25
const testFolder = '../';
const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.question('Digite o ID deste curso: ', id => {
  codigo = `\n
<!-- GOOGLE ANALYTICS -->
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${id}"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());

gtag('config', '${id}');
</script>
<!--/ FIM GOOGLE ANALYTICS -->`

  readline.close();
  fs.readdir(testFolder, (err, files) => {
    files.forEach(file => {
      if ( file == "index.html") {
        console.log(file);
        fs.appendFile(testFolder + file, codigo, 'utf8',
          function (err) {
            if (err) throw err;
            console.log("Script inserido em todos os arquivos.")
          });
      }
    });
  });
});