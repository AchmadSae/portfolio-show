const https = require('https');
const icons = ['laravel', 'springboot', 'nuxtdotjs', 'docker', 'datadog', 'postgresql', 'amazonwebservices'];
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
   res.forEach(r => {
      const match = r.data.match(/<path d="([^"]+)"/);
      console.log(r.name, match ? match[1] : 'NOT FOUND');
   });
});
