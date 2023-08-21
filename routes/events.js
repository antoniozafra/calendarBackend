/*
    Event Routes
    /api/events
*/

const { Router } = require('express');
const { getEventos, crearEvento, actualizarEvento, eliminarEvento } = require('../controllers/events');
const { validatJWT } = require('../middlewares/validar-jwt');
const router = Router();
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validarCampos');
const { isDate } = require('../helpers/isDate');

//Todas deben de pasar por la validacion del jwt
router.use(validatJWT);

//obtener eventos
router.get('/',getEventos);

// crear nuevo evento
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom(isDate),
        check('end', 'Fecha de finalizacion  es obligatoria').custom(isDate),
        validarCampos
    ], 
    crearEvento);

//Actualizar evento
router.put('/:id', [
    check('title', 'El titulo es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalizacion  es obligatoria').custom(isDate),
    validarCampos
],  actualizarEvento);

//Borrar evento
router.delete('/:id', eliminarEvento);

module.exports = router;
