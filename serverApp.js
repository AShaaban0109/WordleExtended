const app = require('./server'); // Importing the app object from server file

// to make it work with online hosting
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});