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

// vérifions si un utilisateur qui tente de se connecter dispose d'identifiants valides
exports.login = (req, res, next) =>{
    User.findOne( {email: req.body.email })
        .then(user => {
            if (user === null){ //si l'utilisateur n'existe pas
                res.status(401).json({ message: 'Paire email/mot de passe incorrecte !'}) //on ne veut pas permettre a tout utilisateur de savoir si un autrer n'est pas inscrit chez nous
            } else {
                bcrypt.compare(req.body.password, user.password) //on fait la comparaison des password hashés
                    .then(valid => {
                        if ( !valid ){
                            res.status(401).json({message: 'Paire email/mot de passe incorrecte !'})
                        } else {
                            res.status(200).json({ //si tout est bon on renvoit une reponse cotenant l'ID utilisateur et un token
                                userId: user._id,
                                token: 'TOKEN'
                            })
                        }
                    })
                    .catch(error => {res.status(500).json({ error })}) //erreur de traitement, il ne s'agit pas de dire que le mot de passe n'est pas valide
            }
        })
        .catch(error => {
            res.status(500).json({ error }) //erreur de traitement
        })
}