const Thing = require('../models/Thing');

exports.createThing = (req, res, next) => {
  delete req.body._id; //on supprime en amont le faux_id envoyé par le front-end

  const thing = new Thing({
    ...req.body //L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de req.body
  });
  
  thing.save() // save() qui enregistre simplement le Thing dans la base de données.
    .then(() => res.status(201).json({ message: 'Objet enregistré !' })) // save() renvoie une Promise. Ainsi, dans le bloc then() , on renvoit une réponse de réussite avec un code 201
    .catch(error => res.status(400).json({ error })) // Dans le catch(),on renvoit une réponse avec l'erreur générée par Mongoose ainsi qu'un code d'erreur 400
};

exports.modifyThing = (req, res, next) => { 
  Thing.updateOne(  //updateOne() permet de mettre à jour le Thing qui correspond à l'objet que nous passons comme premier argument
    { _id: req.params.id}, // le premier argument
    { ...req.body, _id: req.params.id} //on utilise le paramètre id passé dans la demande, et on le remplace par le Thing passé comme second argument.
  )
    .then(()=> res.status(200).json({ message: 'Objet modifié !'}))
    .catch(error => res.status(400).json(error))
};

exports.deleteThing = (req, res, next) => {
    Thing.deleteOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(400).json({ error }))
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
