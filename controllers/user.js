const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.signup = (req, res, next) =>{
    // on doit premierement hasher le password car c'est une operation asynchrone qui est un peu chronophage et dans laquelle on recoit le hash généré
    bcrypt.hash(req.body.password, 10) // on crypte le mot de passe
        .then(hash => {
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({ message: 'Utilisateur créé !'}))
                .catch(error => res.status(400).json({ error }))
        })
        .catch( error => res.status(500).json({ error })) //500 pour l'erreur serveur
}

exports.login = (req, res, next) =>{

}