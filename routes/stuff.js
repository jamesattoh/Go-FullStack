const express = require('express')
const auth = require('../middleware/auth'); // le middleware d'authentification doit être exécuté avant les gestionnaires des routes
const router = express.Router();

const StuffCtrl = require('../controllers/stuff');

router.post('/', auth, StuffCtrl.createThing);
router.get('/:id', auth, StuffCtrl.getOneThing);
router.put('/:id', auth, StuffCtrl.modifyThing);
router.delete('/:id', auth, StuffCtrl.deleteThing);
router.get('/' + '', auth, StuffCtrl.getAllThings);

module.exports = router;