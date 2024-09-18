console.log('nnnnnnnnnnnnnnnnnnnnnnnnn');
const cron = require('cron');
console.log('yyyyyyyyyyyyyyyyyyyyyyyyyy');
const https = require('https');
console.log('mmmmmmmmmmmmmmmmmmmmmmmmmmm');

const backendUrl = 'https://natourspanel.onrender.com/api/v1/example';
const job = new cron.CronJob('*/1 * * * *', function () {
  console.log('Restarting server');

  https
    .get(backendUrl, (res) => {
      if (res.statusCode === 200) {
        console.log('Server restarted');
      } else {
        console.error(
          `failed to restart server with status code: ${res.statusCode}`,
        );
      }
    })
    .on('error', (err) => {
      console.error('Error during Restart:', err.message);
    });
});

// Start the job immediately if desired
job.start();

// Export the cron job instance
module.exports = job;
