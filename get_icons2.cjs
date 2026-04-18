const https = require('https');
const fs = require('fs');
const icons = ['laravel', 'springboot', 'nuxtdotjs', 'docker', 'datadog', 'postgresql'];
const fetchIcon = (name) => {
  return new Promise((resolve) => {
    https.get('https://raw.githubusercontent.com/simple-icons/simple-icons/develop/icons/' + name + '.svg', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({name, data: data.toString()}));
    });
  });
};
Promise.all(icons.map(fetchIcon)).then(res => {
   const output = {};
   res.forEach(r => {
      const match = r.data.match(/<path d="([^"]+)"/);
      output[r.name] = match ? match[1] : 'NOT FOUND';
   });
   fs.writeFileSync('icons.json', JSON.stringify(output, null, 2));
});
