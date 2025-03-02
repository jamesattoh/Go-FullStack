const express = require('express');

const mongoose = require('mongoose');

require('dotenv').config(); // charge les variables d'environnement
 
const app = express();

// on construit l'URL de connexion à partir des variables d'environnement
const mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?${process.env.MONGODB_OPTIONS}`

mongoose.connect(mongoURI)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

app.use(express.json()); // permet d'avoir accès au corps de la requête


//configuration des en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //Permet les requêtes provenant de n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Permet certains en-têtes spécifiques dans les requêtes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Permet certaines méthodes HTTP spécifiques
  next();
});


app.post('/api/stuff', (req, res, next) => {
  console.log(req.body); // Affiche les données JSON (le corps) envoyées dans la requête
  res.status(201).json({ //sans ça la requete va planter côté utilisateur
    message : 'Objet créé !' 
  });
});


// rendre disponible une liste de certains objets à travers l'api
app.get('/api/stuff', (req, res, next) => {
const stuff = [
  {
    _id: 'oeihfzeoi',
    title: 'Mon premier objet',
    description: 'Les infos de mon premier objet',
    imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
    price: 4900,
    userId: 'qsomihvqios',
  },
  {
    _id: 'oeihfzeomoihi',
    title: 'Mon deuxième objet',
    description: 'Les infos de mon deuxième objet',
    imageUrl: 'https://cdn.pixabay.com/photo/2019/06/11/18/56/camera-4267692_1280.jpg',
    price: 2900,
    userId: 'qsomihvqios',
  },
];

res.status(200).json(stuff);

});

module.exports = app;