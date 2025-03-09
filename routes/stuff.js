const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); // le middleware d'authentification doit être exécuté avant les gestionnaires des routes
const multer =  require('../middleware/multer-config');

const stuffCtrl = require('../controllers/stuff'); //la gestion de la route

router.get('/' + '', auth, stuffCtrl.getAllThings);
router.post('/', auth, multer, stuffCtrl.createThing);
router.get('/:id', auth, stuffCtrl.getOneThing);
router.put('/:id', auth, multer, stuffCtrl.modifyThing);
router.delete('/:id', auth, multer, stuffCtrl.deleteThing);

module.exports = router;