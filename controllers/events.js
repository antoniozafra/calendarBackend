const {repsonse,} = require('express');
const Evento = require('../models/Evento');

const getEventos = async (req , res = response) => {

    const eventos = await Evento.find().populate('user', 'name');


    return res.json(  {
        ok: true,
        eventos
    });

}

const crearEvento = async (req, res = repsonse) =>  {

    //Verificar que tengamos el evento
    const evento = new Evento(req.body);

    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save();
        res.status(200).json({
            ok:true, 
            evento: eventoGuardado
        })
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Hable con el admin'
        });
    }
};

const actualizarEvento = async ( req, res = repsonse) => {

    const eventoId = req.params.id;
    
    try {

        const evento = await Evento.findById(eventoId);
        const uid = req.uid;

        if(!evento){
            return res.status(404).json({
                ok: false,
                msg: 'El id del evento no existe'
            });
        }

        if(evento.user.toString() !== uid){
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para editar este evento'
            })
        }
        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, {new: true});

        return res.json({
            ok: true,
            evento: eventoActualizado
        })

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok:false,
            msg: 'Hable con el administrador'
        });
    }



};

// const eliminarEvento = async (req, res = response) => {

//     const eventId = req.params.id;
//     const uid = req.uid;

//     try {
//         const evento = Evento.findById(eventId);

//         if(!evento){
//             return res.status(404).json({
//                 ok:false,
//                 msg: 'El evento que desea eliminar no existe en la base de datos'
//             })
//         }

//         if(evento.user.toString() !== uid){
//             return res.status(401).json({
//                 ok: false,
//                 msg: 'No tiene privilegio para eliminar este evento'
//             })
//         }

//          await Evento.findByIdAndDelete(eventId);

//         return res.json({
//             ok: true,
//             msg: 'Evento eliminado'
//         });


        
//     } catch (error) {

//         console.log(error)
//         return res.status(500).json({
//             ok: false,
//             msg: 'Hable con el administrador'
//         });
        
//     }


//     return res.json({
//         ok: true,
//         msg:'eliminarEvento'
//     })
// }
const eliminarEvento = async( req, res = response ) => {

    const eventoId = req.params.id;
    const uid = req.uid;

    try {

        const evento = await Evento.findById( eventoId );

        if ( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese id'
            });
        }

        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de eliminar este evento'
            });
        }


        await Evento.findByIdAndDelete( eventoId );

        res.json({ ok: true, msg: 'Evento eliminado correctamente'});

        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }

}


module.exports = {
    getEventos,
    crearEvento,
    actualizarEvento,
    eliminarEvento
}