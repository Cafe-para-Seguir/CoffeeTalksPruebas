function CargarComentarios(cantAgregados) {

    $.ajax({
        url: '/Admin/varSesionIdUsuario',
        type: 'POST',

    }).done(function (response) {
        idUsuario = response;
    });

    $.ajax({
        url: '/Admin/varSesionRol',
        type: 'POST',

    }).done(function (response) {
        idRol = response;
    });

    $.ajax({
        url: '/Charla/varSesionCharla',
        type: 'POST',

    }).done(function (response) {

        var idCharla = response;

        $.ajax({
            url: '/Charla/Cargar_Comentarios_Foro',
            type: 'POST',
            data: { 'pIdCharla': idCharla }

        }).done(function (response) {

            var datos = JSON.parse(response);

            var dataLength = datos.length;
            var cantComentarios = cantAgregados * 4;

            var divForo = document.getElementById('divForo');
            divForo.parentNode.removeChild(divForo);

            var divForo = document.createElement('div');
            divForo.id = 'divForo';

            document.getElementById('divForoPadre').appendChild(divForo);

            $('#cantComentarios').html('');
            document.getElementById('cantComentarios').appendChild(document.createTextNode(dataLength + ' Comentarios'));

            var bnCargarComentarios = document.getElementById('bnCargarComentarios');

            if (dataLength <= cantComentarios) {

                if (bnCargarComentarios != null) {

                    bnCargarComentarios.parentNode.removeChild(bnCargarComentarios);

                }

            } else if (bnCargarComentarios == null) {

                var bnCargarComentarios = document.createElement('button');
                bnCargarComentarios.className = 'btn btn-outline-secondary w-auto ml-5';
                bnCargarComentarios.id = 'bnCargarComentarios';
                bnCargarComentarios.setAttribute('onclick', 'CargarComentarios(2);');
                bnCargarComentarios.appendChild(document.createTextNode('Cargar mas Comentarios'));

                document.getElementById('botonesComentarios').appendChild(bnCargarComentarios);

            }


            if (cantAgregados == 2) {

                var bnCerrarComentarios = document.createElement('button');
                bnCerrarComentarios.className = 'btn btn-outline-secondary w-auto ml-5';
                bnCerrarComentarios.id = 'bnCerrarComentarios';
                bnCerrarComentarios.setAttribute('onclick', 'CargarComentarios(1);');
                bnCerrarComentarios.appendChild(document.createTextNode('Cerrar Comentarios'));

                document.getElementById('botonesComentarios').appendChild(bnCerrarComentarios);

            } else if (cantAgregados == 1) {

                var bnCerrarComentarios = document.getElementById('bnCerrarComentarios');

                if (bnCerrarComentarios != null) {

                    bnCerrarComentarios.parentNode.removeChild(bnCerrarComentarios);

                }

            }



            for (x = 0; x < cantComentarios; x++) {

                if (dataLength > x) {

                    var divComentario1 = document.createElement('div');
                    divComentario1.className = 'pt-3';
                    divComentario1.id = 'divComentario' + datos[x].idForo;

                    var divComentario2 = document.createElement('div');
                    divComentario2.className = 'd-flex mb-3';

                    var aComentario1 = document.createElement('a');
                    aComentario1.className = 'avatar avatar-sm mr-12pt'


                    var spanComentario1 = document.createElement('span');
                    spanComentario1.className = 'avatar-title rounded-circle'
                    spanComentario1.appendChild(document.createTextNode(datos[x].nombreUsuario.substring(0, 1) + " " + datos[x].apellidosUsuario.substring(0, 1)));

                    var divComentario3 = document.createElement('div');
                    divComentario3.className = 'flex'

                    var aComentario2 = document.createElement('a');
                    aComentario2.className = 'text-body'

                    var strongComentario1 = document.createElement('strong');
                    strongComentario1.appendChild(document.createTextNode(datos[x].nombreUsuario + " " + datos[x].apellidosUsuario));

                    if (datos[x].idRol == 2) {
                        aComentario2.setAttribute('style', 'border-radius: 25px; background-color: #f6b10a; cursor:pointer;');
                        aComentario2.setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[x].idUsuario + ');');
                        strongComentario1.className = 'm-2 mt-2 mb-2';
                    } else {
                        aComentario2.setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[x].idUsuario + ');');
                        aComentario2.setAttribute('style', 'cursor:pointer;');
                    }

                    var pComentario1 = document.createElement('p');
                    pComentario1.className = 'mt-1 text-70'
                    pComentario1.appendChild(document.createTextNode(datos[x].comentarioForo));

                    var divComentario4 = document.createElement('div');
                    divComentario4.className = 'd-flex align-items-center';

                    var aComentario3 = document.createElement('a');
                    aComentario3.className = 'text-50';
                    aComentario3.setAttribute('style', 'cursor:pointer');
                    aComentario3.id = 'botonesComentario' + datos[x].idForo;

                    var smallComentario1 = document.createElement('small');
                    smallComentario1.appendChild(document.createTextNode(' Responder '));
                    smallComentario1.setAttribute('onclick', 'AgregarRespuesta(' + datos[x].idForo + ')');

                    var divRespuestas = document.createElement('div');
                    divRespuestas.id = 'divRespuestas' + datos[x].idForo;



                    divForo.appendChild(divComentario1);

                    divComentario1.appendChild(divComentario2);
                    divComentario1.appendChild(divRespuestas);

                    divComentario2.appendChild(aComentario1);
                    divComentario2.appendChild(divComentario3);

                    aComentario1.appendChild(spanComentario1);

                    divComentario3.appendChild(aComentario2);
                    divComentario3.appendChild(pComentario1);
                    divComentario3.appendChild(divComentario4);

                    aComentario2.appendChild(strongComentario1);

                    divComentario4.appendChild(aComentario3);

                    aComentario3.appendChild(smallComentario1);

                    if (idUsuario == datos[x].idUsuario || idRol == 1) {

                        var smallEliminar = document.createElement('small');
                        smallEliminar.appendChild(document.createTextNode(' | '));

                        var smallComentario2 = document.createElement('small');
                        smallComentario2.appendChild(document.createTextNode(' Eliminar '));
                        smallComentario2.id = 'Eliminar' + datos[x].idForo;
                        smallComentario2.setAttribute('onclick', 'ConfirmarEliminarComentario(' + datos[x].idUsuario + ', ' + datos[x].idForo + ')');

                        aComentario3.appendChild(smallEliminar);
                        aComentario3.appendChild(smallComentario2);


                    }

                    if (datos[x].cantRespuesta != 0) {


                        var smallCargarRespuesta = document.createElement('small');
                        smallCargarRespuesta.appendChild(document.createTextNode(' | '));
                        smallCargarRespuesta.id = 'smallCargarRespuesta' + datos[x].idForo;

                        var smallComentario3 = document.createElement('small');
                        smallComentario3.appendChild(document.createTextNode(' Cargar Respuestas '));
                        smallComentario3.id = 'cargarRespuestas' + datos[x].idForo;
                        smallComentario3.setAttribute('onclick', 'CargarRespuestas(' + 1 + ', ' + datos[x].idForo + ')');
                        smallComentario3.setAttribute('style', 'cursor:pointer');

                        aComentario3.appendChild(smallCargarRespuesta);
                        aComentario3.appendChild(smallComentario3);

                    }

                }

            }

            if (dataLength > x) {
                document.getElementById('bnCargarComentarios').setAttribute('onclick', 'CargarComentarios(' + (cantAgregados + 1) + ');');
            }

        });

    });

}

function CargarRespuestas(cantAgregados, idForo) {

    $.ajax({
        url: '/Admin/varSesionRol',
        type: 'POST',

    }).done(function (response) {
        idRol = response;

        $.ajax({
            url: '/Charla/Cargar_Respuestas_Comentario',
            type: 'POST',
            data: { 'pIdForo': idForo }

        }).done(function (response) {
            var datos = JSON.parse(response);

            var dataLength = datos.length;

            var cantRespuestas = cantAgregados * 4;

            var divRespuestas = document.getElementById('divRespuestas' + idForo);
            divRespuestas.parentNode.removeChild(divRespuestas);

            var divRespuestas = document.createElement('div');
            divRespuestas.id = 'divRespuestas' + idForo;

            document.getElementById('divComentario' + idForo).appendChild(divRespuestas);

            if (cantAgregados == 1) {

                var botonComentario = document.getElementById('botonesComentario' + idForo);

                var smallCerrarRespuesta = document.createElement('small');
                smallCerrarRespuesta.appendChild(document.createTextNode(' | '));
                smallCerrarRespuesta.id = 'smallCerrarRespuesta ' + idForo;

                var cerrarRespuestas = document.createElement('small');
                cerrarRespuestas.appendChild(document.createTextNode('Cerrar Respuestas'));
                cerrarRespuestas.setAttribute('onclick', 'CargarRespuestas(0, ' + idForo + ');');
                cerrarRespuestas.id = 'cerrarRespuestas' + idForo;

                botonComentario.appendChild(smallCerrarRespuesta);
                botonComentario.appendChild(cerrarRespuestas);

            } else if (cantAgregados == 0) {

                var cerrarRespuestas = document.getElementById('cerrarRespuestas' + idForo);
                cerrarRespuestas.parentNode.removeChild(cerrarRespuestas);

                var smallCerrarRespuesta = document.getElementById('smallCerrarRespuesta ' + idForo);
                smallCerrarRespuesta.parentNode.removeChild(smallCerrarRespuesta);

                var existeCargarRespuestas = document.getElementById('cargarRespuestas' + idForo);

                if (existeCargarRespuestas == null) {

                    var smallCargarRespuesta = document.createElement('small');
                    smallCargarRespuesta.appendChild(document.createTextNode(' | '));
                    smallCargarRespuesta.id = 'smallCargarRespuesta' + idForo;

                    var cargarRespuestas = document.createElement('small');
                    cargarRespuestas.appendChild(document.createTextNode(' Cargar Respuestas '));
                    cargarRespuestas.id = 'cargarRespuestas' + idForo;
                    cargarRespuestas.setAttribute('onclick', 'CargarRespuestas(' + 1 + ', ' + idForo + ')');
                    cargarRespuestas.setAttribute('style', 'cursor:pointer');

                    document.getElementById('botonesComentario' + idForo).appendChild(smallCargarRespuesta);
                    document.getElementById('botonesComentario' + idForo).appendChild(cargarRespuestas);

                }
            }

            if (cantRespuestas >= dataLength) {

                var cerrarRespuestas = document.getElementById('cargarRespuestas' + idForo);
                cerrarRespuestas.parentNode.removeChild(cerrarRespuestas);

                var smallCargarRespuesta = document.getElementById('smallCargarRespuesta' + idForo);
                smallCargarRespuesta.parentNode.removeChild(smallCargarRespuesta);

            }



            for (x = 0; x < cantRespuestas; x++) {

                if (dataLength > x) {

                    var divRespuesta1 = document.createElement('div');
                    divRespuesta1.className = 'ml-sm-32pt mt-3 card p-3';
                    divRespuesta1.id = 'divRespuesta' + x;

                    var divRespuesta2 = document.createElement('div');
                    divRespuesta2.className = 'd-flex';

                    var aRespuesta1 = document.createElement('a');
                    aRespuesta1.className = 'avatar avatar-sm mr-12pt'

                    var spanRespuesta1 = document.createElement('span');
                    spanRespuesta1.className = 'avatar-title rounded-circle'
                    spanRespuesta1.appendChild(document.createTextNode(datos[x].nombreUsuario.substring(0, 1) + " " + datos[x].apellidosUsuario.substring(0, 1)));

                    var divRespuesta3 = document.createElement('div');
                    divRespuesta3.className = 'flex'

                    var divRespuesta4 = document.createElement('div');
                    divRespuesta4.className = 'd-flex align-items-center';

                    var aRespuesta2 = document.createElement('a');
                    aRespuesta2.className = 'text-body'

                    var strongRespuesta1 = document.createElement('strong');
                    strongRespuesta1.appendChild(document.createTextNode(datos[x].nombreUsuario + " " + datos[x].apellidosUsuario));

                    if (datos[x].idRol == 2) {

                        aRespuesta2.setAttribute('style', 'border-radius: 25px; background-color: #f6b10a; cursor:pointer;');
                        aRespuesta2.setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[x].idUsuario + ');');
                        strongRespuesta1.className = 'm-2 mt-2 mb-2';
                    } else {
                        aRespuesta2.setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[x].idUsuario + ');');
                        aRespuesta2.setAttribute('style', 'cursor:pointer;');
                    }

                    var pRespuesta1 = document.createElement('p');
                    pRespuesta1.className = 'mt-1 text-70'
                    pRespuesta1.appendChild(document.createTextNode(datos[x].comentarioForo));

                    var aRespuesta3 = document.createElement('a');
                    aRespuesta3.className = 'text-50';
                    aRespuesta3.setAttribute('style', 'cursor:pointer');



                    divRespuestas.appendChild(divRespuesta1);

                    divRespuesta1.appendChild(divRespuesta2);

                    divRespuesta2.appendChild(aRespuesta1);
                    divRespuesta2.appendChild(divRespuesta3)
                    divRespuesta2.appendChild(aRespuesta3);

                    aRespuesta1.appendChild(spanRespuesta1);

                    divRespuesta3.appendChild(divRespuesta4);
                    divRespuesta3.appendChild(pRespuesta1);

                    divRespuesta4.appendChild(aRespuesta2);

                    aRespuesta2.appendChild(strongRespuesta1);


                    if (idUsuario == datos[x].idUsuario || idRol == 1) {

                        var smallRespuesta4 = document.createElement('small');
                        smallRespuesta4.appendChild(document.createTextNode(' Eliminar '));
                        smallRespuesta4.id = 'Eliminar' + datos[x].idForo;
                        smallRespuesta4.setAttribute('onclick', 'ConfirmarEliminarComentario(' + datos[x].idUsuario + ', ' + datos[x].idForo + ')');
                        smallRespuesta4.setAttribute('style', 'cursor:pointer; display: block');

                        aRespuesta3.appendChild(smallRespuesta4);

                    }



                }

            }

            if (dataLength > x) {
                document.getElementById('cargarRespuestas' + idForo).setAttribute('onclick', 'CargarRespuestas(' + (cantAgregados + 1) + ', ' + idForo + ');');
            }

        });
    });

}

function ConfirmarEliminarComentario(idUsuario, idForo) {

    $("#txtIdUsuario").val(idUsuario);
    $("#txtIdForo").val(idForo);
    $('#modalEliminarComentario').modal('show');

}

function AgregarRespuesta(idComentario) {

    document.getElementById('bnAgregarRespuesta').setAttribute('onclick', 'jsAgregarForoRespuesta(' + idComentario + ')');
    $("#txtRespuesta").val("");
    $('#ModalRespuesta').modal('show');

}

function jsMantForo(pModo) {

    var idUsuario = 0;
    var idCharla = 0;
    var idComentario;

    var txtComentario = $("#txtComentario").val();
    var idForo = $("#txtIdForo").val();
    var txtidUsuarioComentario = $("#txtIdUsuario").val();

    if (pModo == "AGREGAR") {
        idForo = 0;
    }

    if (txtComentario.trim() == "" && pModo != "ELIMINAR") {
        $('#txtComentario').focus();
        $('#alertaVacios').click();

    } else {

        $.ajax({
            url: '/Admin/varSesionIdUsuario',
            type: 'POST',

        }).done(function (response) {
            idUsuario = response;

            if (pModo == "AGREGAR") {
                txtidUsuarioComentario = idUsuario;
            }

            $.ajax({
                url: '/Admin/varSesionRol',
                type: 'POST',

            }).done(function (rol) {
                var rolValid = rol;

                if (idUsuario == txtidUsuarioComentario || rolValid == 1) {

                    $.ajax({
                        url: '/Charla/varSesionCharla',
                        type: 'POST',

                    }).done(function (response) {
                        idCharla = response;

                        var consulta = { pModo: pModo, pIdForo: idForo, pIdCharla: idCharla, pIdUsuario: idUsuario, pIdComentario: idComentario, TextoComentario: txtComentario };

                        $.ajax({
                            url: '/Charla/MantForo',
                            type: 'POST',
                            data: consulta,

                        }).done(function (response) {
                            if (response == 1) {
                                $('#comentarioAgregado').click();
                                $('#txtComentario').val("");
                                CargarComentarios(1);
                            } else if (response == 3) {
                                $('#comentarioEliminado').click();
                                $('#modalEliminarComentario').modal('toggle');
                                CargarComentarios(1);
                            } else {
                                $('#errorAgregar').click();
                                $('#txtComentario').val("");
                            }
                        });
                    });
                }
            });
        });
    }
}

function jsAgregarForoRespuesta(idComentario) {

    var idUsuario = 0;
    var idCharla = 0;
    var idForo = 0;
    var txtRespuesta = $("#txtRespuesta").val();

    if (txtRespuesta.trim() == "") {
        $('#txtRespuesta').focus();
        $('#alertaVacios').click();

    } else {

        $.ajax({
            url: '/Admin/varSesionIdUsuario',
            type: 'POST',

        }).done(function (response) {
            idUsuario = response;

            $.ajax({
                url: '/Charla/varSesionCharla',
                type: 'POST',

            }).done(function (response) {
                idCharla = response;

                var consulta = { pModo: "AGREGAR", pIdForo: idForo, pIdCharla: idCharla, pIdUsuario: idUsuario, pIdComentario: idComentario, TextoComentario: txtRespuesta };

                $.ajax({
                    url: '/Charla/MantForo',
                    type: 'POST',
                    data: consulta,

                }).done(function (response) {
                    if (response == 1) {
                        $('#comentarioAgregado').click();
                        $('#ModalRespuesta').modal('toggle');
                        CargarComentarios(1);
                    } else if (response == 3) {
                        $('#comentarioEliminado').click();
                        $('#modalEliminarComentario').modal('toggle');
                        CargarComentarios(1);
                    } else {
                        $('#errorAgregar').click();
                    }

                });

            });

        });

    }

}