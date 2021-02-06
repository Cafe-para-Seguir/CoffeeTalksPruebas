var tablaConsulta;

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
}
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
}

function CallRecetas() {

    $.ajax({
        url: '/Receta/Cargar_Tabla_Recetas',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);
        CargarTablaRecetas(datos);
    });
}

function CargarTablaRecetas(Data) {

    $('#tbl_Recetas').dataTable().fnDestroy();
    tablaConsulta = $('#tbl_Recetas').DataTable({
        autofill: false,
        data: Data,

        language: {
            "decimal": "",
            "emptyTable": "No hay información",
            "info": "Mostrando _END_ de _TOTAL_ datos ",
            "infoEmpty": "Mostrando 0 to 0 of 0 Entradas",
            "infoFiltered": "(Filtrado de MAX total entradas)",
            "infoPostFix": "",
            "thousands": ",",
            "lengthMenu": "Mostrar _MENU_ datos",
            "loadingRecords": "Cargando...",
            "processing": "Procesando...",
            "search": "Buscar:",
            "zeroRecords": "Sin resultados encontrados",
            "paginate": {
                "first": "Primero",
                "last": "Ultimo",
                "next": "Siguiente",
                "previous": "Anterior"
            }
        },

        pageLength: 10,
        lengthMenu: [[5, 10, 25, 50, 100, -1], [5, 10, 25, 50, 100, 'Todos']],
        "columns": [
            { data: "idReceta", visible: false },
            { data: "nombreReceta" },
            { data: "fechaCreacion" },
            { data: "usuarioCreacion" },
            { data: "fechaModificacion" },
            { data: "usuarioModificacion" },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ModificarModalRecetas(2, \'' + row.idReceta + '\')" >Modificar</button>';
                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ConfirmarEliminarRecetas(\'' + row.idReceta + '\' ) " >Eliminar</button>';
                }
            }
        ]
    });
}

function ConfirmarEliminarRecetas(idReceta) {
    $('#modalEliminar').modal('show');
    $("#txtIdReceta").val(idReceta);
}

function jsMantRecetas(pModo, pidReceta) {

    if (pModo == "MODIFICAR" || pModo == "ELIMINAR") {
        var pidReceta = $("#txtIdReceta").val();
    }

    var txtNombreReceta = $("#txtNombreReceta").val();
    var txtDescripcionReceta = $("#txtDescripcionReceta").val();
    var txtCorreoUsuario = $("#txtCorreoUsuario").val();


    var pUsuarioModificacion = "";    //$("#pUsuarioModificacion").val();

    $.ajax({
        url: '/Admin/varSesionCorreo',
        type: 'POST',

    }).done(function (response) {
        pUsuarioCreacion = response;
        pUsuarioModificacion = response;

        if (pModo != "ELIMINAR" && txtNombreReceta.trim() == "") {
            $('#alertaVacios').click();
            $('#txtNombreReceta').focus();
        } else if (pModo != "ELIMINAR" && txtDescripcionReceta.trim() == "") {
            $('#alertaVacios').click();
            $('#txtDescripcionReceta').focus();
        } else if (pModo != "ELIMINAR" && txtCorreoUsuario.trim() == "") {
            $('#alertaVacios').click();
            $('#txtDescripcionReceta').focus();
        } else {
            var idUsuarioFdb = 0;

            $.ajax({
                url: '/Admin/Verifica_Correo',
                data: { 'pCorreoUsuario': txtCorreoUsuario },
                type: 'POST',

            }).done(function (response) {
                var datos = JSON.parse(response);

                if (pModo != "ELIMINAR" && datos[0] == null) {
                    $('#usuarioInexistente').click();
                } else {
                    if (pModo != "ELIMINAR") {
                        idUsuarioFdb = datos[0].idUsuario;
                    }

                    var consulta = { pModo: pModo, pidReceta: pidReceta, pNombreReceta: txtNombreReceta, pDescripcionReceta: txtDescripcionReceta, pIdUsuario: idUsuarioFdb, pUsuarioCreacion: pUsuarioCreacion, pUsuarioModificacion: pUsuarioModificacion };
                    $.ajax({
                        url: '/Receta/MantReceta',
                        type: 'POST',
                        data: consulta,

                    }).done(function (response) {

                        if (response == -1) {
                            $('#errorRecetaExiste').click();
                        } else if (response == 49) {

                            $('#errorRecetaLimite').click();

                        } else if (response == 1) {
                            //se agrega
                            var consultaRelacion = { pIdUsuario: idUsuarioFdb };
                            $.ajax({
                                url: '/Receta/RelacionUsuarioReceta',
                                type: 'POST',
                                data: consultaRelacion,

                            }).done(function (response) {
                                CallRecetas();
                                $('#confirmarCreacion').click();
                                $('#ModalReceta').modal('toggle');
                            });

                        } else if (response == 2) {

                            var ModificarRelacion = { pIdReceta: pidReceta, pIdUsuario: idUsuarioFdb };
                            $.ajax({
                                url: '/Receta/Modificar_CorreoUsuario_X_Receta',
                                type: 'POST',
                                data: ModificarRelacion,

                            }).done(function (response) {

                                if (response == 49) {
                                    $('#errorRecetaLimite').click();
                                } else {
                                    CallRecetas();
                                    $('#confirmarModificarReceta').click();
                                    $('#ModalReceta').modal('toggle');
                                }
                            });

                        } else if (response == 3) {
                            $('#confirmarEliminar').click();
                            $('#modalEliminar').modal('toggle');

                            CallRecetas();

                        } else {
                            $('#errorEliminar').click();
                        }
                    });
                }
            });
        }
    });
}

function ModificarModalRecetas(pModo, idReceta) {

    $("#btn_agregar").css("display", "none");
    $("#btn_modificar").css("display", "block");

    if (pModo == "2") {
        pModo = "MODIFICAR";
    }

    $('#ModalReceta').modal('show');

    $.ajax({
        url: '/Receta/Cargar_Tabla_Receta_Filtrada',
        data: { 'pIdReceta': idReceta },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);         //trae los datos del usuario del id especifico
        var idRecetaFdb = datos[0].idReceta;

        $.ajax({
            url: '/Receta/Cargar_CorreoUsuario_X_Receta',
            data: { 'pIdReceta': idRecetaFdb },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
            type: 'POST',

        }).done(function (response) {
            var datos2 = JSON.parse(response);         //trae los datos del usuario del id especifico

            $("#txtIdReceta").val(idReceta);
            $("#txtNombreReceta").val(datos[0].nombreReceta);
            $("#txtDescripcionReceta").val(datos[0].descripcionReceta);
            $("#txtCorreoUsuario").val(datos2[0].correoUsuario);

        });
    });
}

function MostrarCampoRecetas() {

    $("#btn_agregar").css("display", "block");
    $("#btn_modificar").css("display", "none");
    $("#btn_eliminar").css("display", "none");

    $('#ModalReceta').modal('show');

    $("#txtNombreReceta").val("");
    $("#txtDescripcionReceta").val("");
    $("#txtCorreoUsuario").val("");
}

function jsMantRectasPerfil(pModo, pidReceta) {

    $.ajax({
        url: '/Admin/varSesionCorreo',
        type: 'POST',

    }).done(function (response) {

        if (pModo == "MODIFICAR" || pModo == "ELIMINAR") {
            var btn_agregar = document.getElementById("btn_agregar");
            var pidReceta = $("#txtIdReceta").val();
            var txtCorreoUsuario = $("#txtCorreoUsuario").val();

            btn_agregar.setAttribute("style", "display: none;");

        } else {
            var btn_modificar = document.getElementById("btn_modificar");
            var btn_eliminar = document.getElementById("btn_eliminar");

            btn_modificar.setAttribute("style", "display: none;");
            btn_eliminar.setAttribute("style", "display: none;");

            var txtCorreoUsuario = response;

        }

        var txtNombreReceta = $("#txtNombreReceta").val();
        var txtDescripcionReceta = $("#txtDescripcionReceta").val();

        var pUsuarioModificacion = "";

        $.ajax({
            url: '/Admin/varSesionCorreo',
            type: 'POST',

        }).done(function (response) {
            pUsuarioCreacion = response;
            pUsuarioModificacion = response;

            if (pModo != "ELIMINAR" && txtNombreReceta.trim() == "") {
                $('#alertaVacios').click();
                $('#txtNombreReceta').focus();
            } else if (pModo != "ELIMINAR" && txtDescripcionReceta.trim() == "") {
                $('#alertaVacios').click();
                $('#txtDescripcionReceta').focus();
            } else if (pModo != "ELIMINAR" && txtCorreoUsuario.trim() == "") {
                $('#alertaVacios').click();
                $('#txtDescripcionReceta').focus();
            } else {
                var idUsuarioFdb = 0;

                $.ajax({
                    url: '/Admin/Verifica_Correo',
                    data: { 'pCorreoUsuario': txtCorreoUsuario },
                    type: 'POST',

                }).done(function (response) {
                    var datos = JSON.parse(response);

                    if (pModo != "ELIMINAR" && datos[0] == null) {
                        $('#usuarioInexistente').click();
                    } else {
                        if (pModo != "ELIMINAR") {
                            idUsuarioFdb = datos[0].idUsuario;
                        }

                        var consulta = { pModo: pModo, pidReceta: pidReceta, pNombreReceta: txtNombreReceta, pDescripcionReceta: txtDescripcionReceta, pIdUsuario: idUsuarioFdb, pUsuarioCreacion: pUsuarioCreacion, pUsuarioModificacion: pUsuarioModificacion };
                        $.ajax({
                            url: '/Receta/MantReceta',
                            type: 'POST',
                            data: consulta,

                        }).done(function (response) {

                            if (response == -1) {
                                $('#errorRecetaExiste').click();
                            } else if (response == 49) {
                                $('#errorRecetaLimite').click();
                            } else if (response == 1) {
                                var consultaRelacion = { pIdUsuario: idUsuarioFdb };
                                $.ajax({
                                    url: '/Receta/RelacionUsuarioReceta',
                                    type: 'POST',
                                    data: consultaRelacion,

                                }).done(function (response) {

                                    $('#ModalReceta').modal('toggle');
                                    location.href = "/Home/Perfil";
                                    $('#confirmarCreacion').click();
                                });

                            } else if (response == 2) {
                                $('#ModalReceta').modal('toggle');
                                location.href = "/Home/Perfil";
                                $('#confirmarModificarReceta').click();

                            } else if (response == 3) {
                                $('#modalEliminar').modal('toggle');
                                location.href = "/Home/Perfil";
                                $('#errorEliminarReceta').click();

                            } else {
                            }
                        });
                    }
                });
            }
        });
    });
}

function EliminarRecetasPerfil() {
    $('#modalEliminar').modal('show');
    var idReceta = $("#txtIdReceta").val();
    $("#txtIdReceta").val(idReceta);
}

function CargarRecetasTodo() {

    $.ajax({
        url: '/Receta/CargarRecetaUsuario',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);

        CargarPaginacion(datos, 18, "DatosReceta(")
        CargarDatosReceta(1)
    });
}

function CargarDatosReceta(pagDisplay) {

    var datosXPagina = pagDisplay * 18 - 18;
    var datosRestantes = datosXPagina;

    $.ajax({
        url: '/Receta/CargarRecetaUsuario',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);

        var datos = JSON.parse(response);
        var dataLength = datos.length;

        var cantPaginas = dataLength / 18;
        var dataLength = datos.length;

        if (Math.ceil(cantPaginas) > 1) {

            for (x = 1; x <= Math.ceil(cantPaginas); x++) {
                var liNumero = document.getElementById('liNumero' + x);
                liNumero.className = 'page-item disabled';
            }

            if (pagDisplay != Math.ceil(cantPaginas)) {
                var liUltimo = document.getElementById('liUltimo' + 2);
                liUltimo.setAttribute('style', 'cursor:pointer;');
                liUltimo.className = 'page-item';
                var liUltimo = document.getElementById('liUltimo' + 1);
                liUltimo.setAttribute('style', 'cursor:pointer;');
                liUltimo.className = 'page-item';
                liUltimo.setAttribute('onclick', 'CargarDatosReceta(' + (pagDisplay + 1) + ')');

                document.getElementById('liNumero' + (pagDisplay + 1)).style.display = 'block';

                if (pagDisplay != (Math.ceil(cantPaginas)) - 1 && pagDisplay != 1) {
                    document.getElementById('liNumero' + (pagDisplay + 2)).style.display = 'none';
                }

            } else {
                var liUltimo = document.getElementById('liUltimo' + 2);
                liUltimo.setAttribute('style', 'cursor:auto;');
                liUltimo.className = 'page-item disabled';
                var liUltimo = document.getElementById('liUltimo' + 1);
                liUltimo.setAttribute('style', 'cursor:auto;');
                liUltimo.className = 'page-item disabled';
                liUltimo.setAttribute('onclick', '');

                for (x = 1; x < (Math.ceil(cantPaginas)) - 2; x++) {
                    document.getElementById('liNumero' + x).style.display = 'none';
                }
                document.getElementById('liNumero' + Math.ceil(cantPaginas)).style.display = 'block';
            }

            if (pagDisplay != 1) {
                var liPrimero = document.getElementById('liPrimero' + 2);
                liPrimero.setAttribute('style', 'cursor:pointer;');
                liPrimero.className = 'page-item';
                liPrimero.setAttribute('onclick', 'CargarDatosReceta(' + (pagDisplay - 1) + ')');
                var liPrimero = document.getElementById('liPrimero' + 1);
                liPrimero.setAttribute('style', 'cursor:pointer;');
                liPrimero.className = 'page-item';

                document.getElementById('liNumero' + (pagDisplay - 1)).style.display = 'block';

                if (pagDisplay != 2 && pagDisplay != Math.ceil(cantPaginas)) {
                    document.getElementById('liNumero' + (pagDisplay - 2)).style.display = 'none';
                }

            } else {
                var liPrimero = document.getElementById('liPrimero' + 2);
                liPrimero.setAttribute('style', 'cursor:auto;');
                liPrimero.className = 'page-item disabled';
                liPrimero.setAttribute('onclick', '');
                var liPrimero = document.getElementById('liPrimero' + 1);
                liPrimero.setAttribute('style', 'cursor:auto;');
                liPrimero.className = 'page-item disabled';

                for (x = Math.ceil(cantPaginas); x > 3; x--) {
                    document.getElementById('liNumero' + x).style.display = 'none';
                }
                document.getElementById('liNumero1').style.display = 'block';
            }


            var liNumero = document.getElementById('liNumero' + pagDisplay);
            liNumero.className = 'page-item active';
        }
        for (x = 0; x < 18; x++) {
            $('#NombreReceta' + x).html('');
            $('#NombreUsuario' + x).html('');

            var Card = document.getElementById('Card' + x);
            Card.setAttribute("onclick", "");

            document.getElementById("Card" + x).style.display = 'none';

            if (dataLength > datosRestantes) {

                var NombreReceta = document.getElementById('NombreReceta' + x);
                var NombreUsuario = document.getElementById('NombreUsuario' + x);

                var NomUsuario = datos[datosXPagina].nombreUsuario + ' ' + datos[datosXPagina].apellidosUsuario;

                Card.setAttribute("onclick", "ModalVerReceta(" + datos[datosXPagina].idReceta + ")");


                NombreReceta.appendChild(document.createTextNode(datos[datosXPagina].nombreReceta));
                NombreUsuario.appendChild(document.createTextNode(NomUsuario));

                datosXPagina = datosXPagina + 1;
                dataLength = dataLength - 1;

                document.getElementById("Card" + x).style.display = 'block';
            }

        }
        //}
    });
}

function ModalVerReceta(IdReceta) {

    $('#ModalVerReceta').modal('show');

    $.ajax({
        url: '/Receta/Cargar_Tabla_Receta_Filtrada',
        data: { 'pIdReceta': IdReceta },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
        type: 'POST',

    }).done(function (response) {

        var datos = JSON.parse(response);         //trae los datos del usuario del id especifico
        var NomRecera = datos[0].nombreReceta;
        var DescRecta = datos[0].descripcionReceta;

        $("#NombreReceta").html("" + NomRecera);
        $("#DescReceta").html("" + DescRecta);

    });
}

/************** PAGINACION **************/

function CargarPaginacion(data, cantDisplay, tipoDatos) {
    var dataLength = data.length;
    var cantPaginas = dataLength / cantDisplay;
    var ulPaginacion = document.getElementById("ulPaginacion");
    var navPaginacion = document.getElementById("navPaginacion");
    ulPaginacion.parentNode.removeChild(ulPaginacion);
    ulPaginacion = document.createElement("ul");
    ulPaginacion.id = 'ulPaginacion';
    ulPaginacion.className = 'pagination pagination-sm';
    navPaginacion.appendChild(ulPaginacion);

    if (Math.ceil(cantPaginas) > 1) {
        for (x = 1; x < 3; x++) {
            var liPrimero = document.createElement("li");
            liPrimero.className = 'page-item disabled';
            liPrimero.id = 'liPrimero' + x;

            var aPrimero = document.createElement("a");
            aPrimero.setAttribute("aria-label", "Previous");
            aPrimero.className = 'page-link';

            var spanPrimero1 = document.createElement("span");
            spanPrimero1.className = 'material-icons';
            spanPrimero1.setAttribute("aria-hidden", "true");

            var spanPrimero2 = document.createElement("span");
            spanPrimero2.className = 'sr-only';

            ulPaginacion.appendChild(liPrimero);
            liPrimero.appendChild(aPrimero);
            aPrimero.appendChild(spanPrimero1);
            aPrimero.appendChild(spanPrimero2);

            if (x == 1) {
                spanPrimero1.appendChild(document.createTextNode("first_page"));
                spanPrimero2.appendChild(document.createTextNode("First"));
                liPrimero.setAttribute('onclick', 'Cargar' + tipoDatos + 1 + ')');

            } else {
                spanPrimero1.appendChild(document.createTextNode("chevron_left"));
                spanPrimero2.appendChild(document.createTextNode("Prev"));

            }
        }
        for (x = 1; x <= Math.ceil(cantPaginas); x++) {
            var liNumero = document.createElement("li");
            liNumero.className = 'page-item disabled';
            liNumero.id = 'liNumero' + x;
            liNumero.setAttribute('style', 'cursor:pointer;');
            liNumero.setAttribute('onclick', 'Cargar' + tipoDatos + ' ' + x + ')');
            var aNumero = document.createElement("a");
            aNumero.setAttribute("aria-label", x);
            aNumero.className = 'page-link';
            var spanNumero = document.createElement("span");

            ulPaginacion.appendChild(liNumero);
            liNumero.appendChild(aNumero);
            aNumero.appendChild(spanNumero);
            spanNumero.appendChild(document.createTextNode(x));
        }

        for (x = 1; x < 3; x++) {
            var liUltimo = document.createElement("li");
            liUltimo.className = 'page-item disabled';
            liUltimo.id = 'liUltimo' + x;

            var aUltimo = document.createElement("a");
            aUltimo.setAttribute("aria-label", "Next");
            aUltimo.className = 'page-link';

            var spanUltimo1 = document.createElement("span");
            spanUltimo1.className = 'sr-only';

            var spanUltimo2 = document.createElement("span");
            spanUltimo2.setAttribute("aria-hidden", "true");
            spanUltimo2.className = 'material-icons';

            ulPaginacion.appendChild(liUltimo);
            liUltimo.appendChild(aUltimo);
            aUltimo.appendChild(spanUltimo1);
            aUltimo.appendChild(spanUltimo2);

            if (x == 1) {
                spanUltimo1.appendChild(document.createTextNode("Next"));
                spanUltimo2.appendChild(document.createTextNode("chevron_right"));

            } else {
                spanUltimo1.appendChild(document.createTextNode("Last"));
                spanUltimo2.appendChild(document.createTextNode("last_page"));
                liUltimo.setAttribute('onclick', 'Cargar' + tipoDatos + Math.ceil(cantPaginas) + ')');
            }
        }
    }
}

/************ Valida Admin *************/

function validaAdminRecetas() {

    $.ajax({
        url: '/Admin/varSesionRol',/* aca llamo el metodo que contiene la variable*/
        type: 'POST',

    }).done(function (response) {
        var rol = response;

        if (rol == 1) {
            CallRecetas();
        } else {
            location.href = "/Home/Index";
        }
    });
}