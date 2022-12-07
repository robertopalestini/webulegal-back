
const {google} = require('googleapis');
const path = require('path');

const jwt = usage('google/samples/jwt.js')

async function runSample() {
    // Create a new JWT client using the key file downloaded from the Google Developer Console
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, 'jwt.keys.json'),
      scopes: 'https://www.googleapis.com/auth/drive.readonly',
    });
    const client = await auth.getClient();
  
    // Obtain a new drive client, making sure you pass along the auth client
    const drive = google.drive({
      version: 'v2',
      auth: client,
    });
  
    // Make an authorized request to list Drive files.
    const res = await drive.files.list();
    console.log(res.data);
  
    return res.data;
  }
  
  if (module === require.main) {
    runSample().catch(console.error);
  }
  
  // Exports for unit testing purposes
  module.exports = {runSample};





// Each API may support multiple versions. With this sample, we're getting
// v3 of the blogger API, and using an API key to authenticate.
const blogger = google.blogger({
  version: 'v3',
  auth: 'YOUR API KEY'
});

const params = {
  blogId: '3213900'
};

// // get the blog details
// blogger.blogs.get(params, (err, res) => {
//   if (err) {
//     console.error(err);
//     throw err;
//   }
//   console.log(`The blog url is ${res.data.url}`);
// });

// // callbacks
// blogger.blogs.get(params)
//   .then(res => {
//     console.log(`The blog url is ${res.data.url}`);
//   })
//   .catch(error => {
//     console.error(error);
//   });


// //   async away
// async function runSample() {
//     const res = await blogger.blogs.get(params);
//     console.log(`The blog url is ${res.data.url}`);
//   }
//   runSample().catch(console.error);


