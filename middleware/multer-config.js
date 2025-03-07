const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
}
const storage = multer.diskStorage({ //Nous créons une constante storage , à passer à multer comme configuration (lors de l'exportation), qui contient la logique nécessaire pour indiquer à multer où enregistrer les fichiers entrants 
    destination: (req, file, callback) => { //la fonction destination indique à multer d'enregistrer les fichiers dans le dossier images
        callback(null, 'images') //null pour dire qu'il n'y a pas d'erreurs
    },

    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
    /**
     * la fonction filename indique à multer d'utiliser le nom d'origine, de remplacer les espaces par des underscores et d'ajouter un timestamp Date.now() comme nom de fichier. 
     * Elle utilise ensuite la constante dictionnaire de type MIME pour résoudre l'extension de fichier appropriée
     */
});


module.exports = multer({ storage }).single('image');
//Nous exportons ensuite l'élément multer entièrement configuré, lui passons notre constante storage et lui indiquons que nous gérerons uniquement les téléchargements de fichiers image


/**
 * En gros, ceci est un middleware de gestion des fichiers
 * Nous voulons que les utilisateurs puissent télécharger des images d'articles à vendre. 
 * On implémente donc des téléchargements de fichiers et pour ce faire, on utiliser multer, un package qui nous permet de gérer les fichiers entrants dans les requêtes HTTP. 
 */