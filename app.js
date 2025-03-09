const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // charge les variables d'environnement


const stuffRoutes = require('./routes/stuff');
const userRoutes = require('./routes/user');

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

app.use('/api/stuff', stuffRoutes); // gère l'ensembles des routes pour toutes les requetes commençant par /api/stuff
app.use('/api/auth', userRoutes);


const path = require('path'); //Il nous faudra accéder au path de notre serveur :
app.use('/images', express.static(path.join(__dirname, 'images'))); //un route qui sert des fichiers statiques

/** * En fait, nous effectuons une demande GET vers  http://localhost:3000/images/<image-name>.jpg. Vu que notre app s'exécute sur localhost:3000 et que nous ne lui avons pas indiqué comment 
 * répondre aux requêtes transmises à cette route : elle renvoie donc une erreur 404. Pour remédier à cela, nous devons indiquer à notre app.js comment traiter les requêtes vers la route /image,
 * en rendant notre dossier images statique.  */

module.exports = app;