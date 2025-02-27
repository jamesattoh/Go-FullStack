// const http = require('http'); //http est un module utilisé pour la creation d'un serveur http qui ecoute les requetes entrantes et les redirige vers notre app Express 
// const app = require('./app')

// app.set( 'port', process.env.PORT || 3000 ) //preciser le port sur lequel l'application doit tourner

// const server = http.createServer(app);

// server.listen( process.env.PORT || 3000)


const http = require('http');
const app = require('./app');

//prend une valeur (chaine ou numéro) et la convertit en un numéro de port valide
const normalizePort = val => {
  
    const port = parseInt(val, 10); //Convertit la valeur val en un entier en base 10

  if (isNaN(port)) { //Si la conversion échoue (c'est-à-dire que val n'est pas un nombre), elle retourne la valeur d'origine
    return val;
  }
  if (port >= 0) { //Si le port est un nombre positif ou zéro, elle retourne ce numéro de port
    return port;
  }
  return false; //Si aucune des conditions précédentes n'est remplie, elle retourne false
};
const port = normalizePort(process.env.PORT ||'3000');
app.set('port', port);

// recherche les différentes erreurs et les gère de manière appropriée. Elle est ensuite enregistrée dans le serveur
const errorHandler = error => { //Si l'erreur n'est pas liée à l'écoute du serveur, elle est relancée.
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address(); //Récupère l'adresse sur laquelle le serveur écoute.
  
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port: ' + port; //Détermine si l'adresse est une chaîne (pipe) ou un numéro de port
  
  switch (error.code) { //Gère différentes erreurs possibles 
    case 'EACCES':
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;//Pour toutes les autres erreurs, l'erreur est relancée.
  }
};

const server = http.createServer(app);

//Ces lignes de code ajoutent des gestionnaires d'événements au serveur HTTP pour gérer les
// erreurs et consigner les informations lorsque le serveur commence à écouter sur le port spécifié.
server.on('error', errorHandler); //Ajoute un gestionnaire d'événements pour les erreurs. Si une erreur survient, la fonction errorHandler sera appelée pour gérer cette erreur

server.on('listening', () => { //Ajoute un gestionnaire d'événements pour l'événement listening, qui est déclenché lorsque le serveur commence à écouter sur le port spécifié
// La fonction anonyme à l'intérieur de on('listening', ...) sera exécutée à ce moment-là
  
    const address = server.address(); //Récupère l'adresse sur laquelle le serveur écoute.
  
    const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port; //Détermine si l'adresse est une chaîne (pipe) ou un numéro de port et crée une chaîne descriptive appropriée
    
    console.log('Listening on ' + bind); //Affiche un message dans la console indiquant que le serveur écoute sur l'adresse ou le port spécifié 
});

server.listen(port); //Démarre le serveur et le fait écouter sur le port spécifié.