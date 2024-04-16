// app.js or index.js (or any other name)
const app = require('./server'); // Importing the app object from your server file
const port = 3000;

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});