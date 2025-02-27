const express = require('express');

const app = express();

app.use((req, res, next)=> {
    console.log('Requete recue !');
    next();
})

app.use((req, res, next)=> {
    res.status(201);
    next();
})

//le moyen de reponse de notre app
app.use((req, res, next)=> {
    res.json({ message : 'Hein! Votre requete est bien reçue'});
    next();
})

app.use((req, res)=>{
    console.log('Reponse envoyée avec succès !')
})



module.exports = app;