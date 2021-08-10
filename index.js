const fs = require('fs');
const directories = fs.readdirSync('./logs');
directories.forEach(dir => {
  if (!dir.includes('.')) {
    const files = fs.readdirSync(`./logs/${dir}`);
    files.forEach(file => {
      if (file.includes('log')) {
        const array = fs.readFileSync(`./logs/${dir}/${file}`, 'utf8').split('---------------------------');
        const customer = array.filter(item => item.includes('Headers: [Accept:application/json], [Accept-Encoding:gzip, deflate]'))
        const customerObject = customer.map(item => Object.fromEntries(item.split('\n').map(i => i.replace(/\:/, '&').split('&').map(i => i.trim())))).map(iter => {
          if(!iter.Response.includes("<") && iter.Response !== "") {
            iter.Response = JSON.parse(iter.Response);
            iter.Request = JSON.parse(iter.Request);
          }
          return iter;
        });
        const customerSuccess = customerObject.filter(item => (item.Response.code === "200" || item.Response.code === "00"));
        const customerError = customerObject.filter(item => (item.Response.code !== "200" && item.Response.code !== "00" && item.Response.code !== "0") && !item.URL.includes('telecentro'));
        console.table({
          carpeta: `./logs/${dir}/`,
          archivo: file,
          peticiones: array.length,
          peticionesCliente: customer.length,
          peticionesExitosas: customerSuccess.length,
          peticionesConError: customerError.length
        })
      }
    });
  }
});



