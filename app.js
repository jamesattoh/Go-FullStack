const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // charge les variables d'environnement

const Thing = require('./models/Thing');



// on construit l'URL de connexion à partir des variables d'environnement
const mongoURI = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_CLUSTER}/?${process.env.MONGODB_OPTIONS}`

mongoose.connect(mongoURI)
.then(() => console.log('Connexion à MongoDB réussie !'))
.catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use(express.json()); // permet d'avoir accès au corps de la requête


//configuration des en-têtes CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); //Permet les requêtes provenant de n'importe quelle origine
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'); //Permet certains en-têtes spécifiques dans les requêtes
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS'); //Permet certaines méthodes HTTP spécifiques
  next();
});


app.post('/api/stuff', (req, res, next) => {
  delete req.body._id; //on supprime en amont le faux_id envoyé par le front-end

  const thing = new Thing({
    ...req.body //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
  });
  
  thing.save() // save() qui enregistre simplement le Thing dans la base de données.
    .then(() => res.status(201).json({ message: 'Objet enregistré !' })) // save() renvoie une Promise. Ainsi, dans le bloc then() , on renvoit une réponse de réussite avec un code 201
    .catch(error => res.status(400).json({ error })) // Dans le catch(),on renvoit une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400
});

// recuperer un seul objet dans l'ensemble des elements de la base de données
app.get('/api/stuff/:id', (req, res, next) => { // avec ':' en face du segment dynamique de la route, c'est pour la rendre accessible en tant que paramètre
  Thing.findOne({ _id: req.params.id }) // Utilisation de la méthode findOne() de Mongoose pour trouver un objet par son id
    .then(thingo => res.status(200).json(thingo))
    .catch(error => res.status(404).json({ error }))
})

// rendre disponible une liste de certains objets à travers l'api
app.get('/api/stuff', (req, res, next) => {
  Thing.find() // la méthode find() dans notre modèle Mongoose renvoit un tableau contenant tous les Things de notre base de données
    .then(thingos => res.status(200).json(thingos))
    .catch(error => res.status(400).json({ error }))

});

module.exports = app;