const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth'); // le middleware d'authentification doit être exécuté avant les gestionnaires des routes
const multer =  require('../middleware/multer-config');

const StuffCtrl = require('../controllers/stuff'); //la gestion de la route

router.get('/' + '', auth, StuffCtrl.getAllThings);
router.post('/', auth, multer, StuffCtrl.createThing);
router.get('/:id', auth, StuffCtrl.getOneThing);
router.put('/:id', auth, multer, StuffCtrl.modifyThing);
router.delete('/:id', auth, StuffCtrl.deleteThing);

module.exports = router;