const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const plansRoutes = require('./routes/plans-routes');
const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
   res.setHeader('Access-Control-Allow-Origin', '*');
   res.setHeader(
      'Access-Control-Allow-Headers', 
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
   );
   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

   next();
});

app.use('/api/places', placesRoutes); 
app.use('/api/plans', plansRoutes); 
app.use('/api/users', usersRoutes); 

app.use((req, res, next) => {
   const error = new HttpError('Could not find this routes.', 404);
   throw error;
});

app.use((error, req, res, next) => {
   if (req.file) {
      fs.unlink(req.file.path, (err) => {
         console.log(err);
      });
   }

   if (res.headersSent) {
      return next(error);
   }
   res.status(error.code || 500);
   res.json({message: error.message || 'An unknow error occurred!'});
});

mongoose
   .connect('mongodb+srv://gap:bajumyVZCFRj8bzg@cluster0.k4tkr.mongodb.net/mern?retryWrites=true&w=majority')
   .then(() => {
      app.listen(5000);
      console.log('Connected Database!');
   })
   .catch(err => {
      console.log(err);
   });

   //bajumyVZCFRj8bzg<password>
   