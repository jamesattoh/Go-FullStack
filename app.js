const express = require('express');

const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb+srv://dolgen:OPCmongo%2325@cluster0.ljg4u.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', //# → %23 (encodage URL de #)
  { useNewUrlParser: true,
    useUnifiedTopology: true })
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