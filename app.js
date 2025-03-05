const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // charge les variables d'environnement

const stuffRoutes = require('./routes/stuff');

// on construit l'URL de connexion à partir des variables d'environnement
const mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?${process.env.MONGODB_OPTIONS}`

mongoose.connect(mongoURI)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();


//configuration des en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //Permet les requêtes provenant de n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Permet certains en-têtes spécifiques dans les requêtes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Permet certaines méthodes HTTP spécifiques
  next();
});

app.use(express.json()); // permet d'avoir accès au corps de la requête

app.use('/api/stuff', stuffRoutes); // gère l'ensembles des routes pour toutes les requetes commençant par /api/stuff


module.exports = app;