const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


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
                                token: jwt.sign( //sign() est une methode pour creer un token
                                    { userId: user._id }, //les données (payload) qu"on veut encoder dans le token
                                    'RANDOM_TOKEN_SECRET', //la clé secrète pour signer le token (l'encodage)
                                    { expiresIn: '24h'} //argument de configuration; ici, l'expiration du token
                                )
                                /**
                                 * Utilisation du token :
                                 * Le client (navigateur ou app mobile) stocke le token (généralement dans le stockage local ou les cookies) et l'envoie avec chaque requête suivante au serveur pour prouver son identité.
                                 * Le serveur vérifie le token en utilisant la clé secrète 
                                 * En bref, le token JWT permet de sécuriser les communications entre le client et le serveur en prouvant l'identité de l'utilisateur de manière sécurisée et en limitant la durée de validité du token.
                                 */
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