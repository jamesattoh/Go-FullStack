const Thing = require('../models/Thing');
const fs = require('fs'); //fs « file system » donne accès aux fonctions qui permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers


exports.createThing = (req, res, next) => {


  // delete req.body._id;
  // const thing = new Thing({
  //   ...req.body 
  // });
  // thing.save()
  //   .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
  //   .catch(error => res.status(400).json({ error }))

  
  const thingObject = JSON.parse(req.body.thing); //Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data et non sous forme de JSON. Le corps de la requête contient une chaîne thing, qui est simplement un objetThing converti en chaîne. Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable
  delete thingObject._id; // l'id de l'objet sera automatiquement généré par notre base de données, donc on supprime l'ID envoyé par le client
  delete thingObject._userId; //ne pas faire confiance aux utilisateurs. Nous le remplaçerons en base de données par le _userId extrait du token par le middleware d’authentification.
  const thing = new Thing({
    ...thingObject, //Copie des propriétés de thingObject (ce qui a ete parsé moins les deux champs supprimés)
    userId: req.auth.userId, // Ajoute le userId extrait du token d'authentification
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` //generer l'url par nous meme car req.file.filename ne contient que le segment filename
  });

  thing.save()
    .then(()=> res.status(201).json({ message: 'Objet enrégistré !'}))
    .catch(error => res.status(400).json({ error }))
};


//prendre en compte deux possibilités : l'utilisateur a mis à jour l'image ou pas. Dans le premier cas, nous recevrons l'élément form-data et le fichier. Dans le second cas, nous recevrons uniquement les données JSON
exports.modifyThing = (req, res, next) => { 


  // Thing.updateOne({ _id: req.params.id},{ ...req.body, _id: req.params.id})
  //   .then(()=> res.status(200).json({ message: 'Objet modifié !'}))
  //   .catch(error => res.status(400).json(error))


  const thingObject = req.file ? {
    ...JSON.parse(req.body.thing), //JSON.parse() transforme un objet stringifié en Object JavaScript exploitable
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  } : { ...req.body};

  delete thingObject._userId;

  Thing.findOne( { _id: req.params.id}) //  _id: req.params.id et non  _id: req.params._id
    .then(thing => {
      if (thing.userId != req.auth.userId) {
        res.status(401).json({ message: 'Not authorized'})
      } else {
        Thing.updateOne( //updateOne() permet de mettre à jour le Thing qui correspond à l'objet que nous passons comme premier argument
          { _id: req.params.id}, // le premier argument
          { ...thingObject, _id: req.params.id} //on utilise le paramètre id passé dans la demande, et on le remplace par le Thing passé comme second argument.
        )
          .then(() => res.status(200).json({ message: 'Objet modifié !'}))
          .catch(error => res.status(401).json({ error }))
      }
    })
    .catch(error => res.status(400).json({ error }))
};


exports.deleteThing = (req, res, next) => {


  // Thing.deleteOne({ _id: req.params.id })
  // .then(thing => res.status(200).json(thing))
  // .catch(error => res.status(400).json({ error }))


  Thing.findOne({ _id: req.params.id }) //utilisons l'ID que nous recevons comme paramètre pour accéder au Thing correspondant dans la base de données.
    .then(thing => {
      if (thing.userId != req.auth.userId) { //vérifions si l’utilisateur qui a fait la requête de suppression est bien celui qui a créé le Thing
        res.status(401).json({ message: 'Not authorized'});
      } else {
        const filename = thing.imageUrl.split('/images/')[1]; //utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier
        fs.unlink(`images/${filename}`, () => { //utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé
          Thing.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !' }))
            .catch(error => res.status(401).json({ error }));
        })
      }
    })
    .catch(error => { res.status(500).json({ error })})
};


exports.getOneThing = (req, res, next) => { // avec ':' en face du segment dynamique de la route, c'est pour la rendre accessible en tant que paramètre
    Thing.findOne({ _id: req.params.id }) // Utilisation de la méthode findOne() de Mongoose pour trouver un objet par son id
    .then(thingo => res.status(200).json(thingo))
    .catch(error => res.status(404).json({ error }))
};


exports.getAllThings = (req, res, next) => {
    Thing.find() // la méthode find() dans notre modèle Mongoose renvoit un tableau contenant tous les Things de notre base de données
    .then(thingos => res.status(200).json(thingos))
    .catch(error => res.status(400).json({ error }))
};
