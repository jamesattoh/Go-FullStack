const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator') // améliore les messages d'erreur lors de l'enregistrement de données uniques

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
})

userSchema.plugin(uniqueValidator); //on pourra ne pas avoir plusieurs users avec le meme email

module.exports = mongoose.model('User', userSchema);