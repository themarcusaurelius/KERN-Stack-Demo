const express = require('express');
const formData = require('express-form-data');
const path = require('path');
  
//Import Routes Here
const data = require('./routes/api/data')
const crimeBulk = require('./routes/api/crimeBulk');
const fireBulk = require('./routes/api/911Bulk');
const trafficBulk = require('./routes/api/trafficBulk');
   
//const test = require('./routes/api/crimeBulk');

const app = express();

// Init Middleware
app.use(express.json({ extended: false }))
app.use(express.urlencoded({ extended: true }));
app.use(formData.parse())

  
//Define Routes
app.use('/api/data', data);
app.use('/api/data', crimeBulk);
app.use('/api/data', fireBulk);
app.use('/api/data', trafficBulk);
 
//Serve Static assets in production
//Configuration for Express to behave correctly in production environment
if (process.env.NODE_ENV === 'production') {
    //First - Making sure express will serve production assets - main.js, main.css, etc
    app.use(express.static('client/build'));
    //Second -Express will serve up the index.html file if it doesn't recognize the route
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'))
    });
};
 
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.group(`Motha Fuckin Serva Started On ${PORT}`));