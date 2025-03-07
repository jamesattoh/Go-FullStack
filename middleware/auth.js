const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    //de nombreux problèmes peuvent se produire, donc on introduit le bloc try...catch
    try {
        
        /** La ligne de code ci-dessous divise l'entête "Authorization" de la requête HTTP en utilisant l'espace comme séparateur et prend le deuxième élément (index 1)
         * C'est une pratique courante dans les systèmes d'authentification qui utilisent le format "Bearer token" */
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET'); //ensuite on utilise la fonction verify pour décoder notre token. Si celui-ci n'est pas valide, une erreur sera générée.
        const userId = decodedToken.userId; //Nous extrayons l'ID utilisateur de notre token et le rajoutons à l’objet Request afin que nos différentes routes puissent l’exploiter
        req.auth = {
            userId: userId
        };
        next(); //Dans le cas contraire, tout fonctionne et notre utilisateur est authentifié. Nous passons à l'exécution à l'aide de la fonction next()
    } catch (error) {
        res.status(401).json({ error })
    }
}