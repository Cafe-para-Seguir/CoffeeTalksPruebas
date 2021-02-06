var tablaConsulta;

var idCharlaGlobal;

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
}
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
}

function validaInicioSesion() {

    $.ajax({
        url: '/Charla/varSesionCharla',
        type: 'POST',

    }).done(function (SesionCharla) {

        $.ajax({
            url: '/Admin/varSesionCorreo',
            type: 'POST',

        }).done(function (SesionCorreo) {

            if (SesionCorreo != "" && SesionCharla != "") {

                CargarCharlaDetalles();
                CargarTotalValoracion();
                CargarUsuarioValoracion();
                CargarComentarios(1);

            } else {
                location.href = "/Home/Index";
            }
        });
    });
}

function validaInicioSesionCharlaGratis() {

    $.ajax({
        url: '/Charla/varSesionCharla',
        type: 'POST',

    }).done(function (SesionCharla) {

        if (SesionCharla != "") {

            CargarCharlaDetallesGratis();
            CargarTotalValoracion();
            CargarUsuarioValoracion();

        } else {
            location.href = "/Home/Index";
        }
    });
}

function validaInicioSesionVideo() {

    $.ajax({
        url: '/Charla/varSesionCharla',
        type: 'POST',

    }).done(function (SesionCharla) {

        $.ajax({
            url: '/Admin/varSesionCorreo',
            type: 'POST',

        }).done(function (SesionCorreo) {

            if (SesionCorreo != "" && SesionCharla != "") {

                cargarVideo();

            } else {
                location.href = "/Home/Index";
            }
        });
    });
}

function CallCharlas() {

    $.ajax({
        url: '/Charla/Cargar_Tabla_Charlas_Admin',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);

        CargarTablaCharla(datos);
    });
}

function CargarTablaCharla(Data) {

    $('#tbl_Charlas').dataTable().fnDestroy();
    tablaConsulta = $('#tbl_Charlas').DataTable({
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
            { data: "idCharla", visible: false },
            { data: "nombreCharla" },
            { data: "nombreUsuario" },
            { data: "nombreCategoria" },
            { data: "fechaCreacion" },
            { data: "usuarioCreacion" },
            { data: "fechaModificacion" },
            { data: "usuarioModificacion" },

            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="VerCharla(\'' + row.idCharla + '\')" >Ver Charla</button>';
                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ModificarModalCharlas(2, \'' + row.idCharla + '\')" >Modificar</button>';
                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ConfirmarEliminarCharlas(\'' + row.idCharla + '\' ) " >Eliminar</button>';
                }
            }
        ]
    });
}

function MostrarCampoCharla() {

    $("#btn_agregar").css("display", "block");
    $("#btn_modificar").css("display", "none");

    $("#NoMostar").css("display", "none");

    $('#ModalCharla').modal('show');

    $("#txtNombreCharla").val("");
    $("#txtDescripcionCharla").val("");
    $("#txtValoracionCharla").val("");
    $("#txtImagenCharla").val("");
    $("#txtPrecioCharla").val("");

    $("#nombreCharlista").html("");


    $("#txtCorreoUsuario").val("");

    var options = '';
    $.ajax({
        url: '/Categoria/Cargar_Tabla_Categoria',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);         //trae los datos del usuario del id especifico

        for (var i = 0; i < datos.length; i++) {
            options += '<option value="' + datos[i]['idCategoria'] + '">' + datos[i]['nombreCategoria'] + '</option>';
        }
        $('#cbCategoria').html(options);
    });
}

function ModificarModalCharlas(pModo, idCharla) {

    $("#btn_agregar").css("display", "none");
    $("#btn_modificar").css("display", "block");
    $("#NoMostar").css("display", "block");

    $("#imagenid").val('');

    if (pModo == "2") {
        pModo = "MODIFICAR";
    }

    $('#ModalCharla').modal('show');

    $.ajax({
        url: '/Charla/Cargar_Charla_Filtrada',
        data: { 'pIdCharla': idCharla },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
        type: 'POST',

    }).done(function (response) {
        var dataChart = JSON.parse(response);
        var options = '';
        $.ajax({
            url: '/Categoria/Cargar_Tabla_Categoria',
            type: 'POST',

        }).done(function (response2) {
            var datos = JSON.parse(response2);         //trae los datos del usuario del id especifico

            for (var i = 0; i < datos.length; i++) {
                options += '<option value="' + datos[i]['idCategoria'] + '">' + datos[i]['nombreCategoria'] + '</option>';
            }
            $('#cbCategoria').html(options);


            $("#txtIdCharla").val(idCharla);
            $("#txtNombreCharla").val(dataChart[0].nombreCharla);
            $("#txtDescripcionCharla").val(dataChart[0].descripcionCharla);

            $("#txtValoracionCharla").val(dataChart[0].valoracionCharla);
            $("#txtImagenCharla").val(dataChart[0].imagenCharla);
            $("#txtPrecioCharla").val(dataChart[0].precioCharla);

            $("#txtCorreoUsuario").val(dataChart[0].correoUsuario);

            let element = document.getElementById('cbCategoria');
            element.value = dataChart[0].idCategoria;

            let element2 = document.getElementById('cbNivelCharla');
            element2.value = dataChart[0].nivelCharla;

            CargarNombreCharlista();
        });
    });
}

function ConfirmarEliminarCharlas(idCharla) {
    $('#modalEliminar').modal('show');
    $("#txtIdCharla").val(idCharla);
}

function jsMantCharla(pModo, pIdCharla) {

    if (pModo != "AGREGAR") {
        pIdCharla = $("#txtIdCharla").val();
    }

    var txtNombreCharla = $("#txtNombreCharla").val();
    var txtDescripcionCharla = $("#txtDescripcionCharla").val();
    var txtImagenCharla = "/images/recursos/SinImagen.jpg";
    var txtPrecioCharla = $("#txtPrecioCharla").val();
    var txtCorreoUsuario = $("#txtCorreoUsuario").val();

    if (pModo != "ELIMINAR") {
        var cbCategoria = document.getElementById("cbCategoria");
        var txtcbCategoria = cbCategoria.options[cbCategoria.selectedIndex].value;

        var cbNivelCharla = document.getElementById("cbNivelCharla");
        var txtNivelCharla = cbNivelCharla.options[cbNivelCharla.selectedIndex].value;
    }

    if (pModo != "ELIMINAR" && txtNombreCharla.trim() == "") {
        $('#txtNombreCharla').focus();
        $('#alertaVacios').click();

    } else if (pModo != "ELIMINAR" && txtDescripcionCharla.trim() == "") {
        $('#txtDescripcionCharla').focus();
        $('#alertaVacios').click();

    } else if (pModo != "ELIMINAR" && txtImagenCharla.trim() == "") {
        $('#txtImagenCharla').focus();
        $('#alertaVacios').click();

    } else {

        var pUsuarioModificacion = "";
        var pUsuarioCreacion = "";

        $.ajax({
            url: '/Admin/varSesionCorreo',
            type: 'POST',

        }).done(function (response) {
            pUsuarioCreacion = response;
            pUsuarioModificacion = response;

            var idUsuarioFdb = 0;
            var verifIdRolFdb = 0;

            $.ajax({
                url: '/Admin/Verifica_Correo',
                data: { 'pCorreoUsuario': txtCorreoUsuario },
                type: 'POST',

            }).done(function (response) {
                var datos = JSON.parse(response);
                verifIdRolFdb
                if (pModo != "ELIMINAR" && datos[0] == null) {
                    $('#usuarioInexistente').click();
                } else {
                    if (pModo != "ELIMINAR") {
                        idUsuarioFdb = datos[0].idUsuario;
                        verifIdRolFdb = datos[0].idRol;
                    }

                    if (pModo != "ELIMINAR" && verifIdRolFdb != 2) {
                        $('#noCharlista').click();
                    }
                    else {

                        var consulta = {
                            pModo: pModo, pIdCharla: pIdCharla, pNombreCharla: txtNombreCharla, pDescripcionCharla: txtDescripcionCharla, pNivelCharla: txtNivelCharla, pImagenCharla: txtImagenCharla,
                            pPrecioCharla: txtPrecioCharla, pCorreoUsuario: txtCorreoUsuario, pUsuarioCreacion: pUsuarioCreacion, pUsuarioModificacion: pUsuarioModificacion
                        };

                        $.ajax({
                            url: '/Charla/MantCharla',
                            type: 'POST',
                            data: consulta,

                        }).done(function (response) {
                            if (response != 1) {
                                if (pModo != "ELIMINAR") {
                                    $('#errorAgregarCharla').click();
                                } else {
                                    $('#errorEliminarCharla').click();
                                    $('#modalEliminar').modal('toggle');
                                }
                            }
                            else {

                                var consultaRelacionCatC = { pModo: pModo, pIdCharla: pIdCharla, pIdCategoria: txtcbCategoria };
                                $.ajax({
                                    url: '/Charla/MantCharlaCategoria',
                                    type: 'POST',
                                    data: consultaRelacionCatC,

                                }).done(function (response) {

                                    if (response != 1) {
                                        $('#errorCharlaCategoria').click();
                                    } else {

                                        var consultaRelacionCC = { pModo: pModo, pIdCharla: pIdCharla, pIdUsuario: idUsuarioFdb };
                                        $.ajax({
                                            url: '/Charla/MantCharlaCharlista',
                                            type: 'POST',
                                            data: consultaRelacionCC,

                                        }).done(function (response) {
                                            if (response != 1) {
                                                $('#errorCharlaCharlista').click();
                                            } else {
                                                if (pModo == "AGREGAR") {
                                                    $('#ModalCharla').modal('toggle');
                                                    $('#confirmarCreacion').click();
                                                    CallCharlas();
                                                    GenerarCorreo(1, txtCorreoUsuario, txtNombreCharla);

                                                    $.ajax({
                                                        url: '/Correos/NotifCharlasNuevas',
                                                        type: 'POST',

                                                    }).done(function (response) {

                                                    });
                                                } else {
                                                    $('#modalEliminar').modal('toggle');
                                                    $('#confirmarEliminar').click();
                                                    CallCharlas();
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                }
            });
        });
    }
}

function ModificarCharla() {
    $.ajax({
        url: '/Admin/varSesionCorreo',
        type: 'POST',

    }).done(function (response) {
        pUsuarioCreacion = response;
        pUsuarioModificacion = response;

        var txtCorreoUsuario = $("#txtCorreoUsuario").val();

        var idUsuarioFdb = 0;
        var verifIdRolFdb = 0;

        $.ajax({
            url: '/Admin/Verifica_Correo',
            data: { 'pCorreoUsuario': txtCorreoUsuario },
            type: 'POST',

        }).done(function (response) {

            var datos = JSON.parse(response);

            if (datos[0] == null) {
                $('#usuarioInexistente').click();
            } else {

                idUsuarioFdb = datos[0].idUsuario;
                verifIdRolFdb = datos[0].idRol;


                if (verifIdRolFdb != 2) {
                    $('#noCharlista').click();
                } else {

                    var pIdCharla = $("#txtIdCharla").val();

                    var datos = new FormData($("#form_charla")[0]);

                    datos.append("pModo", "MODIFICAR");
                    datos.append("pIdCharla", pIdCharla);
                    datos.append("pUsuarioCreacion", pUsuarioCreacion);
                    datos.append("pUsuarioModificacion", pUsuarioModificacion);

                    $.ajax({
                        url: '/Charla/ModificarCharla',
                        type: 'POST',
                        data: datos,
                        contentType: false,
                        processData: false,

                    }).done(function (response) {

                        var cbCategoria = document.getElementById("cbCategoria");
                        var txtcbCategoria = cbCategoria.options[cbCategoria.selectedIndex].value;

                        datos.append('pIdCategoria', txtcbCategoria);

                        $.ajax({
                            url: '/Charla/MantCharlaCategoria',
                            type: 'POST',
                            data: datos,
                            contentType: false,
                            processData: false,

                        }).done(function (response) {

                            if (response != 1) {
                                $('#errorCharlaCategoria').click();
                            } else {

                                datos.append('pIdUsuario', idUsuarioFdb);

                                $.ajax({
                                    url: '/Charla/MantCharlaCharlista',
                                    type: 'POST',
                                    data: datos,
                                    contentType: false,
                                    processData: false,

                                }).done(function (response) {

                                    if (response != 1) {
                                        $('#errorCharlaCharlista').click();
                                    } else {

                                        $('#ModalCharla').modal('toggle');
                                        $('#confirmarModificar').click();
                                        GenerarCorreo(1, txtCorreoUsuario, $("#txtNombreCharla").val());
                                        CallCharlas();
                                    }
                                });
                            }
                        });
                    });
                }
            }
        });
    });
}

function VerCharla(pIdCharla) {
    CargarPagCharlaDetalle(pIdCharla);
}

function llenarCharlas() {
    var options = '';
    $.ajax({
        url: '/Charla/Cargar_Tabla_Charlas_Admin',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);         //trae los datos del usuario del id especifico

        for (var i = 0; i < datos.length; i++) {
            options += '<option value="' + datos[i]['idCharla'] + '">' + datos[i]['nombreCharla'] + '</option>';
        }
        $('#cbCharla').html(options);
        MostrarCharlistaCharla();
    });
}

function CargarCharlas() {

    var activeId = document.querySelector('[id$="Active"]').id;
    var activeElement = document.getElementById(activeId);

    activeElement.setAttribute('class', 'sidebar-menu-item');
    activeElement.id = activeId.slice(0, activeId.length - 6);

    activeElement = document.getElementById('liFiltro0');
    activeElement.id = 'liFiltro0Active';
    activeElement.setAttribute('class', 'sidebar-menu-item active');

    $.ajax({
        url: '/Charla/Cargar_Tabla_Charlas',
        type: 'POST',

    }).done(function (response) {

        var datos = JSON.parse(response);
        CargarPaginacion(datos, 12, "CharlasDisplay (");
        CargarCharlasDisplay(1);
    });
}

function CargarCharlasFiltradas(idCategoria) {

    var activeId = document.querySelector('[id$="Active"]').id;
    var activeElement = document.getElementById(activeId);

    activeElement.setAttribute('class', 'sidebar-menu-item');
    activeElement.id = activeId.slice(0, activeId.length - 6);

    activeElement = document.getElementById('liFiltro' + idCategoria);
    activeElement.setAttribute('class', 'sidebar-menu-item active');
    activeElement.id = 'liFiltro' + idCategoria + 'Active';


    $.ajax({
        url: '/Charla/MostrarCharlaFiltradaPorCategoria',
        data: { 'pIdCategoria': idCategoria },      //envia por parametro el ID de la categoria para recibir los datos de las charlas asociadas
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);         //trae los datos del usuario del id especifico
        CargarPaginacion(datos, 12, "CharlasFiltradasDisplay(" + idCategoria + ", ");
        CargarCharlasFiltradasDisplay(idCategoria, 1);
    });
}

function CargarCharlasDisplay(pagDisplay) {
    datosXPagina = pagDisplay * 12 - 12;
    datosRestantes = datosXPagina;

    document.getElementById('divInfoCategoria').style.display = 'none';

    $.ajax({
        url: '/Charla/Cargar_Tabla_Charlas',
        type: 'POST',

    }).done(function (response) {

        var datos = JSON.parse(response);
        var dataLength = datos.length;

        var cantPaginas = dataLength / 12;
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
                liUltimo.setAttribute('onclick', 'CargarCharlasDisplay(' + (pagDisplay + 1) + ')');

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
                liPrimero.setAttribute('onclick', 'CargarCharlasDisplay(' + (pagDisplay - 1) + ')');
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

        for (x = 0; x < 12; x++) {

            $('#aNombreCharla' + x).html('');
            $('#pDescCharla' + x).html('');
            $('#divNombreCharla' + x).html('');
            $('#smNombreBarista' + x).html('');
            $('#spanCharlista' + x).html('');
            $('#smVideos' + x).html('');
            $('#smVideosPeq' + x).html('');
            $('#smNivel' + x).html('');
            $('#smNivelPeq' + x).html('');

            document.getElementById("divVerCursos" + x).style.display = 'none';

            if (dataLength > datosRestantes) {

                var txtNombreCharla = document.getElementById("aNombreCharla" + x);
                var txtNombreCharlaPeq = document.getElementById("divNombreCharla" + x);
                var txtDescCharla = document.getElementById("pDescCharla" + x);
                var txtNombreCharlista = document.getElementById("smNombreBarista" + x);
                var txtNombreCharlistaPeq = document.getElementById("spanCharlista" + x);
                var txtCantVideos = document.getElementById("smVideos" + x);
                var txtCantVideosPeq = document.getElementById("smVideosPeq" + x);
                var txtDificultad = document.getElementById("smNivel" + x);
                var txtDificultadPeq = document.getElementById("smNivelPeq" + x);
                var txtCharlaDetalle = document.getElementById("CharlaDetalle" + x);
                var imagenCharla = "imagenCharla" + x;
                var imagenMini = "imagenCharlaMini" + x;

                var VT1 = "VTA" + (x + 1);
                var VT2 = "VTB" + (x + 1);
                var VT3 = "VTC" + (x + 1);
                var VT4 = "VTD" + (x + 1);
                var VT5 = "VTE" + (x + 1);

                var datoValorTotal = datos[datosXPagina].valoracionCharla;

                if (datoValorTotal >= 0 && datoValorTotal <= 1.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star_border');
                    $("#" + VT3).html('star_border');
                    $("#" + VT4).html('star_border');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 1.5 && datoValorTotal <= 2.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star_border');
                    $("#" + VT4).html('star_border');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 2.5 && datoValorTotal <= 3.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star');
                    $("#" + VT4).html('star_border');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 3.5 && datoValorTotal <= 4.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star');
                    $("#" + VT4).html('star');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 4.5 && datoValorTotal <= 5.5) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star');
                    $("#" + VT4).html('star');
                    $("#" + VT5).html('star');

                } else {
                }

                txtNombreCharla.appendChild(document.createTextNode(datos[datosXPagina].nombreCharla));
                txtDescCharla.appendChild(document.createTextNode(datos[datosXPagina].descripcionCharla));
                txtNombreCharlaPeq.appendChild(document.createTextNode(datos[datosXPagina].nombreCharla));
                txtNombreCharlista.appendChild(document.createTextNode(datos[datosXPagina].nombreUsuario));
                txtNombreCharlistaPeq.appendChild(document.createTextNode(datos[datosXPagina].nombreUsuario));
                txtCantVideosPeq.appendChild(document.createTextNode(datos[datosXPagina].cantVideos + " Videos"));
                txtCantVideos.appendChild(document.createTextNode(datos[datosXPagina].cantVideos + " Videos"));
                txtDificultad.appendChild(document.createTextNode(datos[datosXPagina].nivelCharla));
                txtDificultadPeq.appendChild(document.createTextNode(datos[datosXPagina].nivelCharla));
                txtCharlaDetalle.setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datos[datosXPagina].idCharla) + ')');
                var imagenGrande = datos[datosXPagina].imagenCharla;
                var imagenMini1 = datos[datosXPagina].imagenCharla;

                document.getElementById("divVerCursos" + x).style.display = 'block';
                document.getElementById(imagenCharla).setAttribute('style', 'display: block; position: relative; overflow: hidden; background-image: url("' + imagenGrande + '"); background-size: cover; background-position: center center; height: 140px;');
                $("#" + imagenMini).attr('src', imagenMini1);

                datosXPagina = datosXPagina + 1;
                dataLength = dataLength - 1;
            }
        }
    });
}

function CargarCharlasFiltradasDisplay(idCategoria, pagDisplay) {
    datosXPagina = pagDisplay * 12 - 12;
    datosRestantes = datosXPagina;

    $.ajax({
        url: '/Categoria/Cargar_Tabla_Categoria_Filtrada',
        data: { 'pIdCategoria': idCategoria },
        type: 'POST',

    }).done(function (response) {

        var datos = JSON.parse(response);

        $('#hNombreCategoria').html('');
        $('#pDescCategoria').html('');

        document.getElementById('hNombreCategoria').appendChild(document.createTextNode(datos[0].nombreCategoria));
        document.getElementById('pDescCategoria').appendChild(document.createTextNode(datos[0].descripcionCategoria));
        document.getElementById('divInfoCategoria').style.display = 'block';
    });

    $.ajax({
        url: '/Charla/MostrarCharlaFiltradaPorCategoria',
        data: { 'pIdCategoria': idCategoria },
        type: 'POST',

    }).done(function (response) {

        var datos = JSON.parse(response);
        var dataLength = datos.length;

        var cantPaginas = dataLength / 12;

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
                liUltimo.setAttribute('onclick', 'CargarCharlasFiltradasDisplay(' + idCategoria + ', ' + (pagDisplay + 1) + ')');

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
                liPrimero.setAttribute('onclick', 'CargarCharlasFiltradasDisplay(' + idCategoria + ', ' + (pagDisplay - 1) + ')');
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
        for (x = 0; x < 12; x++) {

            $('#aNombreCharla' + x).html('');
            $('#pDescCharla' + x).html('');
            $('#divNombreCharla' + x).html('');
            $('#smNombreBarista' + x).html('');
            $('#spanCharlista' + x).html('');
            $('#smVideos' + x).html('');
            $('#smVideosPeq' + x).html('');
            $('#smNivel' + x).html('');
            $('#smNivelPeq' + x).html('');
            document.getElementById("divVerCursos" + x).style.display = 'none';

            if (dataLength > datosRestantes) {

                var txtNombreCharla = document.getElementById("aNombreCharla" + x);
                var txtNombreCharlaPeq = document.getElementById("divNombreCharla" + x);
                var txtDescCharla = document.getElementById("pDescCharla" + x);
                var txtNombreCharlista = document.getElementById("smNombreBarista" + x);
                var txtNombreCharlistaPeq = document.getElementById("spanCharlista" + x);
                var txtCantVideos = document.getElementById("smVideos" + x);
                var txtCantVideosPeq = document.getElementById("smVideosPeq" + x);
                var txtDificultad = document.getElementById("smNivel" + x);
                var txtDificultadPeq = document.getElementById("smNivelPeq" + x);
                var txtCharlaDetalle = document.getElementById("CharlaDetalle" + x);

                var VT1 = "VTA" + (x + 1);
                var VT2 = "VTB" + (x + 1);
                var VT3 = "VTC" + (x + 1);
                var VT4 = "VTD" + (x + 1);
                var VT5 = "VTE" + (x + 1);

                var datoValorTotal = datos[datosXPagina].valoracionCharla;

                if (datoValorTotal >= 0 && datoValorTotal <= 1.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star_border');
                    $("#" + VT3).html('star_border');
                    $("#" + VT4).html('star_border');
                    $("#" + VT5).html('star_border');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 1.5 && datoValorTotal <= 2.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star_border');
                    $("#" + VT4).html('star_border');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 2.5 && datoValorTotal <= 3.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star');
                    $("#" + VT4).html('star_border');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 3.5 && datoValorTotal <= 4.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star');
                    $("#" + VT4).html('star');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 4.5 && datoValorTotal <= 5.5) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star');
                    $("#" + VT4).html('star');
                    $("#" + VT5).html('star');

                } else {
                }

                txtNombreCharla.appendChild(document.createTextNode(datos[datosXPagina].nombreCharla));
                txtDescCharla.appendChild(document.createTextNode(datos[datosXPagina].descripcionCharla));
                txtNombreCharlaPeq.appendChild(document.createTextNode(datos[datosXPagina].nombreCharla));
                txtNombreCharlista.appendChild(document.createTextNode(datos[datosXPagina].nombreUsuario));
                txtNombreCharlistaPeq.appendChild(document.createTextNode(datos[datosXPagina].nombreUsuario));
                txtCantVideosPeq.appendChild(document.createTextNode(datos[datosXPagina].cantVideos + " Videos"));
                txtCantVideos.appendChild(document.createTextNode(datos[datosXPagina].cantVideos + " Videos"));
                txtDificultad.appendChild(document.createTextNode(datos[datosXPagina].nivelCharla));
                txtDificultadPeq.appendChild(document.createTextNode(datos[datosXPagina].nivelCharla));
                txtCharlaDetalle.setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datos[datosXPagina].idCharla) + ')');

                document.getElementById("divVerCursos" + x).style.display = 'block';

                datosXPagina = datosXPagina + 1;
                dataLength = dataLength - 1;
            }
        }
    });
}

function CargarPagCharlaDetalle(idCharla) {

    $.ajax({
        url: '/Charla/varSesionLlenarCharla',
        type: 'POST',
        data: { 'idLlenarCharla': idCharla }

    }).done(function (response) {

        $.ajax({
            url: '/Admin/varSesionRol',
            type: 'POST',

        }).done(function (response) {
            if (response == 1) {
                location.href = "/Charla/verCharlaDetalle";
            } else if (response != 1) {
                $.ajax({
                    url: '/Admin/varSesionIdUsuario',
                    type: 'POST',

                }).done(function (response) {
                    var idSession = response;

                    if (idSession == "") {
                        location.href = "/Charla/verCharlaDetalleGratis";
                    } else if (idSession != "") {
                        validaCompraBuscarCharla(idCharla);
                    }
                });
            }
        });
    });
}

function validaCompraBuscarCharla(idCharla) {//esto valida que la charla este comprada
    $.ajax({
        url: '/Admin/varSesionIdUsuario',
        type: 'POST',

    }).done(function (response) {
        var idusuario = response;

        $.ajax({
            url: '/Charla/validaCharlaComprada',
            data: { 'idCharla': idCharla, 'idUsuario': idusuario },
            type: 'POST',
        }).done(function (response) {

            if (response == 1) {
                location.href = "/Charla/verCharlaDetalle";
            } else if (response == 2) {
                $.ajax({
                    url: '/Admin/varSesionIdUsuario',
                    type: 'POST',

                }).done(function (response) {
                    var idusuarioS = response;
                    $.ajax({
                        url: '/Charla/validaDueno',
                        data: { 'idCharla': idCharla, 'idUsuario': idusuarioS },
                        type: 'POST',
                    }).done(function (response) {
                        if (response == 1) {
                            location.href = "/Charla/verCharlaDetalle";
                        } else if (response == 2) {
                            location.href = "/Charla/verCharlaDetalleGratis";
                        }
                    });
                });

            }

        });
    });
}

function validaCompraCharlaDetalle(idCharla) {//esto valida que la charla este comprada
    $.ajax({
        url: '/Admin/varSesionIdUsuario',
        type: 'POST',

    }).done(function (response) {

        var idusuario = response;

        if (idusuario != 1) {

            $.ajax({
                url: '/Charla/validaCharlaComprada',
                data: { 'idCharla': idCharla, 'idUsuario': idusuario },
                type: 'POST',
            }).done(function (response) {

                if (response == 1) {

                } else if (response == 2) {
                    $.ajax({
                        url: '/Admin/varSesionIdUsuario',
                        type: 'POST',

                    }).done(function (response) {
                        var idusuarioS = response;
                        $.ajax({
                            url: '/Charla/validaDueno',
                            data: { 'idCharla': idCharla, 'idUsuario': idusuarioS },
                            type: 'POST',
                        }).done(function (response) {
                            if (response == 1) {

                            } else if (response == 2) {
                                location.href = "/Charla/verCharlaDetalleGratis";
                            }
                        });
                    });

                }

            });
        }

    });
}

function validaCompraCharlaDetalleGratis(idCharla) {//esto valida que la charla este comprada
    $.ajax({
        url: '/Admin/varSesionIdUsuario',
        type: 'POST',

    }).done(function (response) {
        var idusuario = response;

        $.ajax({
            url: '/Charla/validaCharlaComprada',
            data: { 'idCharla': idCharla, 'idUsuario': idusuario },
            type: 'POST',
        }).done(function (response) {

            if (response == 1) {
                location.href = "/Charla/verCharlaDetalle";
            } else if (response == 2) {
                $.ajax({
                    url: '/Admin/varSesionIdUsuario',
                    type: 'POST',

                }).done(function (response) {
                    var idusuarioS = response;
                    $.ajax({
                        url: '/Charla/validaDueno',
                        data: { 'idCharla': idCharla, 'idUsuario': idusuarioS },
                        type: 'POST',
                    }).done(function (response) {
                        if (response == 1) {
                            location.href = "/Charla/verCharlaDetalle";
                        } else if (response == 2) {

                        }
                    });
                });

            }

        });
    });
}

function CargarVariablePerfilPublico(idUsuario) {

    $.ajax({
        url: '/Admin/varSesionLlenarPerfilPublico',
        type: 'POST',
        data: { 'idLlenarPerfil': idUsuario }

    }).done(function (response) {

        location.href = "/Admin/VerPerfilPublico";

    });
}

function CargarCharlaDetalles() {

    $.ajax({
        url: '/Charla/varSesionCharla',
        type: 'POST',

    }).done(function (response) {

        var idCharla = response;

        validaCompraCharlaDetalle(idCharla);

        $.ajax({
            url: '/Charla/Cargar_Charla_Filtrada',
            type: 'POST',
            data: { 'pIdCharla': idCharla }

        }).done(function (response) {

            var datos = JSON.parse(response);

            var txtNombreCharla = document.getElementById("hNombreCharla");
            var txtDificultad = document.getElementById("liNivel");

            var txtDescCharla = document.getElementById("pDescCharla");
            var txtDescCharlista = document.getElementById("pDescCharlista");
            var txtNombreCharlistaS = document.getElementById("hNombreCharlista");
            var bnVerPerfil = document.getElementById("bnVerPerfil");
            //var fotoCharlista = "perfilCharlista";

            txtNombreCharla.appendChild(document.createTextNode(datos[0].nombreCharla));
            txtDescCharla.appendChild(document.createTextNode(datos[0].descripcionCharla));
            txtDificultad.appendChild(document.createTextNode(datos[0].nivelCharla));
            txtDescCharlista.appendChild(document.createTextNode(datos[0].descripcionUsuario));
            imagenCharlista = datos[0].imagenUsuario;

            txtNombreCharlistaS.appendChild(document.createTextNode(datos[0].nombreUsuario));
            bnVerPerfil.setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[0].idUsuario + ')');
            $("#perfilCharlista").attr('src', imagenCharlista);
            CargarTotalValoracionCharlista(datos[0].idUsuario);

            $.ajax({
                url: '/Admin/varSesionLlenarPerfilPublico',
                type: 'POST',
                data: { 'idLlenarPerfil': datos[0].idUsuario }

            }).done(function (response) {

                $.ajax({
                    url: '/Charla/Cargar_Charla_Random',
                    type: 'POST',
                    data: { 'pLimite': 3, 'pIdUsuario': datos[0].idUsuario },

                }).done(function (response) {
                    var datos = JSON.parse(response);

                    dataLength = datos.length;

                    for (x = 0; x < dataLength; x++) {

                        if (x < 3) {
                            var imagen = "imagenCharla" + x;
                            var txtNombreCharla = document.getElementById("aNombreCharla" + x);
                            txtNombreCharla.appendChild(document.createTextNode(datos[x].nombreCharla));
                            var imagen1 = datos[x].imagenCharla;
                            var divCurso = document.getElementById('divNombreCharla' + x);
                            divCurso.setAttribute('style', 'Display: block');
                            divCurso.setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datos[x].idCharla) + ')');
                            $("#" + imagen).attr('src', imagen1);

                            var datoValorTotal = datos[x].valoracionCharla;

                            var VT1 = "VTA" + (x);
                            var VT2 = "VTB" + (x);
                            var VT3 = "VTC" + (x);
                            var VT4 = "VTD" + (x);
                            var VT5 = "VTE" + (x);

                            if (datoValorTotal >= 0 && datoValorTotal <= 1.4) {
                                $("#" + VT1).html('star');
                                $("#" + VT2).html('star_border');
                                $("#" + VT3).html('star_border');
                                $("#" + VT4).html('star_border');
                                $("#" + VT5).html('star_border');

                            } else if (datoValorTotal >= 1.5 && datoValorTotal <= 2.4) {
                                $("#" + VT1).html('star');
                                $("#" + VT2).html('star');
                                $("#" + VT3).html('star_border');
                                $("#" + VT4).html('star_border');
                                $("#" + VT5).html('star_border');

                            } else if (datoValorTotal >= 2.5 && datoValorTotal <= 3.4) {
                                $("#" + VT1).html('star');
                                $("#" + VT2).html('star');
                                $("#" + VT3).html('star');
                                $("#" + VT4).html('star_border');
                                $("#" + VT5).html('star_border');

                            } else if (datoValorTotal >= 3.5 && datoValorTotal <= 4.4) {
                                $("#" + VT1).html('star');
                                $("#" + VT2).html('star');
                                $("#" + VT3).html('star');
                                $("#" + VT4).html('star');
                                $("#" + VT5).html('star_border');

                            } else if (datoValorTotal >= 4.5 && datoValorTotal <= 5.5) {
                                $("#" + VT1).html('star');
                                $("#" + VT2).html('star');
                                $("#" + VT3).html('star');
                                $("#" + VT4).html('star');
                                $("#" + VT5).html('star');

                            } else {
                            }
                        }
                    }

                    $.ajax({
                        url: '/Admin/varSesionRol',
                        type: 'POST',

                    }).done(function (vsr) {

                        var idusu = "";

                        $.ajax({
                            url: '/Admin/varSesionIdUsuario',
                            type: 'POST',

                        }).done(function (vsu) {

                            idusu = vsu;

                            $.ajax({
                                url: '/Charla/validaCharlaComprada',
                                type: 'POST',
                                data: { 'idCharla': idCharla, 'idUsuario': idusu }

                            }).done(function (response) {

                                if (response == 1) {
                                    vsr = 3
                                } else {
                                    vsr = 0;
                                }

                                if (vsr == 3) {

                                    $.ajax({
                                        url: '/Charla/Cargar_Video_Charla_Visualizado_FiltradoId',
                                        type: 'POST',
                                        data: { 'pIdCharla': idCharla, 'pIdUsuario': idusu }

                                    }).done(function (response) {
                                        var datos = JSON.parse(response);

                                        var idEmpezar = datos[0].idVideo;
                                        var bEmpezar = document.getElementById("bEmpezar");
                                        bEmpezar.setAttribute('onclick', "enviaID('" + idEmpezar + "', '" + idCharla + "') ");

                                        dataLength = datos.length;

                                        for (x = 0; x < dataLength; x++) {
                                            var liVideo = document.createElement("li");
                                            liVideo.className = 'accordion__menu-link';
                                            var idVideo = datos[x].idVideo;

                                            var aVideo = document.createElement("a");
                                            aVideo.className = 'flex';
                                            aVideo.appendChild(document.createTextNode(datos[x].nombreVideo));
                                            aVideo.setAttribute('onclick', 'enviaID(' + idVideo + ', ' + idCharla + ')');
                                            aVideo.setAttribute('style', 'cursor:pointer;');

                                            var spanVideoP = document.createElement("span");
                                            spanVideoP.className = 'text-muted';
                                            spanVideoP.appendChild(document.createTextNode(datos[x].duracionVideo));

                                            var spanVideoS = document.createElement("span");

                                            if (datos[x].visualizado == 1) {
                                                spanVideoS.setAttribute('style', 'Display: inline; color: #f6b10a;');
                                                spanVideoS.className = 'material-icons fas fa-check-square icon-16pt icon--left ml-3';
                                            } else {
                                                spanVideoS.setAttribute('style', 'Display: inline;');
                                                spanVideoS.className = 'material-icons fas fa-check-square icon-16pt icon--left text-50 ml-3';
                                            }

                                            var ulVideo = document.getElementById('toc-content-1');
                                            ulVideo.appendChild(liVideo);
                                            liVideo.appendChild(aVideo);
                                            liVideo.appendChild(spanVideoP);
                                            liVideo.appendChild(spanVideoS);
                                        }
                                    });

                                } else {

                                    var divValoracion = document.getElementById('divValoracion');
                                    divValoracion.setAttribute('style', 'display:none');

                                    $.ajax({
                                        url: '/Charla/Cargar_Video_Charla_FiltradoId',
                                        type: 'POST',
                                        data: { 'pIdCharla': idCharla }

                                    }).done(function (response) {
                                        var datos = JSON.parse(response);

                                        var idEmpezar = datos[0].idVideo;
                                        var bEmpezar = document.getElementById("bEmpezar");
                                        bEmpezar.setAttribute('onclick', "enviaID('" + idEmpezar + "', '" + idCharla + "') ");

                                        dataLength = datos.length;

                                        for (x = 0; x < dataLength; x++) {
                                            var liVideo = document.createElement("li");
                                            liVideo.className = 'accordion__menu-link';
                                            var idVideo = datos[x].idVideo;

                                            var aVideo = document.createElement("a");
                                            aVideo.className = 'flex';
                                            aVideo.appendChild(document.createTextNode(datos[x].nombreVideo));
                                            aVideo.setAttribute('onclick', 'enviaID(' + idVideo + ', ' + idCharla + ')');
                                            aVideo.setAttribute('style', 'cursor:pointer;');

                                            var spanVideoP = document.createElement("span");
                                            spanVideoP.className = 'text-muted';
                                            spanVideoP.appendChild(document.createTextNode(datos[x].duracionVideo));

                                            var spanVideoS = document.createElement("span");
                                            spanVideoS.className = 'material-icons icon-16pt icon--left text-50 ml-3';
                                            spanVideoS.appendChild(document.createTextNode("check_circle"));
                                            spanVideoS.setAttribute('style', 'Display: none;');

                                            var ulVideo = document.getElementById('toc-content-1');
                                            ulVideo.appendChild(liVideo);
                                            liVideo.appendChild(aVideo);
                                            liVideo.appendChild(spanVideoP);
                                            liVideo.appendChild(spanVideoS);
                                        }
                                    });
                                }




                            });
                        });
                    });
                });
            });
        });
    });
}

function CargarCharlaDetallesGratis() {
    $.ajax({
        url: '/Charla/varSesionCharla',
        type: 'POST',

    }).done(function (response) {

        var idCharla = response;

        validaCompraCharlaDetalleGratis(idCharla);

        $.ajax({
            url: '/Charla/Cargar_Charla_Filtrada',
            type: 'POST',
            data: { 'pIdCharla': idCharla }

        }).done(function (response) {

            var datos = JSON.parse(response);

            var txtNombreCharla = document.getElementById("hNombreCharla");
            var txtDificultad = document.getElementById("liNivel");
            var txtNombreCharlista = document.getElementById("hNombreCharlista");
            var txtDescCharla = document.getElementById("pDescCharla");
            var txtDescCharlista = document.getElementById("pDescCharlista");

            var bnVerPerfil = document.getElementById("bnVerPerfil");
            var fotoCharlista = "perfilCharlista";

            txtNombreCharla.appendChild(document.createTextNode(datos[0].nombreCharla));
            txtDescCharla.appendChild(document.createTextNode(datos[0].descripcionCharla));
            txtDificultad.appendChild(document.createTextNode(datos[0].nivelCharla));
            txtDescCharlista.appendChild(document.createTextNode(datos[0].descripcionUsuario));
            txtNombreCharlista.appendChild(document.createTextNode(datos[0].nombreUsuario));

            bnVerPerfil.setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[0].idUsuario + ')');
            imagenCharlista = datos[0].imagenUsuario;
            $("#" + fotoCharlista).attr('src', imagenCharlista);
            CargarTotalValoracionCharlista(datos[0].idUsuario);

            $.ajax({
                url: '/Charla/Cargar_Charla_Random',
                type: 'POST',
                data: { 'pLimite': 3, 'pIdUsuario': datos[0].idUsuario },

            }).done(function (response) {
                var datos = JSON.parse(response);

                dataLength = datos.length;

                for (x = 0; x < dataLength; x++) {
                    if (x < 3) {
                        var imagen = "imagenCharla" + x;
                        var txtNombreCharla = document.getElementById("aNombreCharla" + x);
                        txtNombreCharla.appendChild(document.createTextNode(datos[x].nombreCharla));
                        var divCurso = document.getElementById('divNombreCharla' + x);
                        var imagen1 = datos[x].imagenCharla;
                        divCurso.setAttribute('style', 'Display: block');
                        divCurso.setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datos[x].idCharla) + ')');
                        $("#" + imagen).attr('src', imagen1);

                        var datoValorTotal = datos[x].valoracionCharla;

                        var VT1 = "VTA" + (x);
                        var VT2 = "VTB" + (x);
                        var VT3 = "VTC" + (x);
                        var VT4 = "VTD" + (x);
                        var VT5 = "VTE" + (x);

                        if (datoValorTotal >= 0 && datoValorTotal <= 1.4) {
                            $("#" + VT1).html('star');
                            $("#" + VT2).html('star_border');
                            $("#" + VT3).html('star_border');
                            $("#" + VT4).html('star_border');
                            $("#" + VT5).html('star_border');

                        } else if (datoValorTotal >= 1.5 && datoValorTotal <= 2.4) {
                            $("#" + VT1).html('star');
                            $("#" + VT2).html('star');
                            $("#" + VT3).html('star_border');
                            $("#" + VT4).html('star_border');
                            $("#" + VT5).html('star_border');

                        } else if (datoValorTotal >= 2.5 && datoValorTotal <= 3.4) {
                            $("#" + VT1).html('star');
                            $("#" + VT2).html('star');
                            $("#" + VT3).html('star');
                            $("#" + VT4).html('star_border');
                            $("#" + VT5).html('star_border');

                        } else if (datoValorTotal >= 3.5 && datoValorTotal <= 4.4) {
                            $("#" + VT1).html('star');
                            $("#" + VT2).html('star');
                            $("#" + VT3).html('star');
                            $("#" + VT4).html('star');
                            $("#" + VT5).html('star_border');

                        } else if (datoValorTotal >= 4.5 && datoValorTotal <= 5.5) {
                            $("#" + VT1).html('star');
                            $("#" + VT2).html('star');
                            $("#" + VT3).html('star');
                            $("#" + VT4).html('star');
                            $("#" + VT5).html('star');

                        } else {
                        }

                    }
                }

                $.ajax({
                    url: '/Charla/Cargar_Video_Charla_FiltradoId',
                    type: 'POST',
                    data: { 'pIdCharla': idCharla }

                }).done(function (response) {
                    var datos = JSON.parse(response);

                    dataLength = datos.length;

                    for (x = 0; x < dataLength; x++) {
                        var liVideo = document.createElement("li");
                        liVideo.className = 'accordion__menu-link';
                        var idVideo = datos[x].idVideo;

                        var aVideo = document.createElement("a");
                        aVideo.className = 'flex';
                        aVideo.appendChild(document.createTextNode(datos[x].nombreVideo));

                        var spanVideoP = document.createElement("span");
                        spanVideoP.className = 'text-muted';
                        spanVideoP.appendChild(document.createTextNode(datos[x].duracionVideo));

                        var spanVideoS = document.createElement("span");
                        spanVideoS.className = 'material-icons icon-16pt icon--left text-50 ml-3';
                        spanVideoS.appendChild(document.createTextNode("check_circle"));
                        spanVideoS.setAttribute('style', 'Display: none');

                        var ulVideo = document.getElementById('toc-content-1');
                        ulVideo.appendChild(liVideo);
                        liVideo.appendChild(aVideo);
                        liVideo.appendChild(spanVideoP);
                        liVideo.appendChild(spanVideoS);
                    }
                });
            });
        });
    });
}

function CargarNombreCharlista() {

    $.ajax({
        url: '/Admin/Verifica_Correo',
        type: 'POST',
        data: { 'pCorreoUsuario': $("#txtCorreoUsuario").val() }

    }).done(function (response) {
        var datos = JSON.parse(response);

        if (datos.length == 0) {
            $("#nombreCharlista").html("");
        } else {
            $("#nombreCharlista").html(datos[0].nombreUsuario + " " + datos[0].apellidosUsuario);

        }
    });
}

/************** VIDEOS **************/

function CallVideos() {

    $.ajax({
        url: '/Charla/Cargar_Tabla_Videos',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);
        CargarTablaVideo(datos);
    });
}

function CargarTablaVideo(Data) {

    $('#tbl_Videos').dataTable().fnDestroy();
    tablaConsulta = $('#tbl_Videos').DataTable({
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
            { data: "idVideo", visible: false },
            { data: "linkVideo" },
            { data: "fechaCreacion" },
            { data: "usuarioCreacion" },
            { data: "fechaModificacion" },
            { data: "usuarioModificacion" },

            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ModificarModalVideos(2, \'' + row.idVideo + '\')" >Modificar</button>';
                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ConfirmarEliminarVideos(\'' + row.idVideo + '\' ) " >Eliminar</button>';
                }
            }
        ]
    });
}

function jsMantVideo(pModo, pIdVideo) {

    if (pModo != "AGREGAR") {
        pIdVideo = $("#txtIdVideo").val();
    }

    if ($("#txtSegundosVideo").val() > 60) {
        $('#errorSegundosOrden').click();
    } else {

        var txtLinkVideo = $("#txtLinkVideo").val();
        var txtNombreVideo = $("#txtNombreVideo").val();

        var txtDuracionVideo = $("#txtMinutosVideo").val() + ":" + $("#txtSegundosVideo").val();

        var txtOrdenVideo = $("#txtOrdenVideo").val();

        if (pModo != "ELIMINAR") {
            var cbCharla = document.getElementById("cbCharla");
            var txtcbCharla = cbCharla.options[cbCharla.selectedIndex].value;
        }

        if (pModo != "ELIMINAR" && txtLinkVideo.trim() == "") {
            $('#txtLinkVideo').focus();
            $('#alertaVacios').click();

        } else if (pModo != "ELIMINAR" && txtNombreVideo.trim() == "") {
            $('#txtNombreVideo').focus();
            $('#alertaVacios').click();

        } else if (pModo != "ELIMINAR" && txtDuracionVideo.trim() == "") {
            $('#txtDuracionVideo').focus();
            $('#alertaVacios').click();

        } else if (pModo != "ELIMINAR" && txtOrdenVideo.trim() == "") {
            $('#txtOrdenVideo').focus();
            $('#alertaVacios').click();

        } else {

            var pUsuarioModificacion = "";
            var pUsuarioCreacion = "";

            $.ajax({
                url: '/Admin/varSesionCorreo',
                type: 'POST',
                async: false,

            }).done(function (response) {
                pUsuarioCreacion = response;
                pUsuarioModificacion = response;

                var entrar;
                var validamodifica;

                if (pModo == "AGREGAR" || pModo == "ELIMINAR") {
                    entrar = 0;
                } else {
                    entrar = 1;
                }

                //1 = mismo orden original
                //0 = esta modificando el orden

                if (entrar == 1) { //modificar

                    var consultaValidaOrdenModi = { pIdVideo: pIdVideo, pOrdenVideo: txtOrdenVideo };
                    $.ajax({
                        url: '/Charla/validaOrdenVideoModificar',
                        type: 'POST',
                        data: consultaValidaOrdenModi,
                        async: false,

                    }).done(function (rModi) {
                        if (rModi == 1) {
                            validamodifica = 1;
                        } else {
                            validamodifica = 0;
                        }

                    });

                } else { //agregar,eliminar
                    validamodifica = 0;
                }


                var consultaValidaOrden = { pIdCharla: txtcbCharla, pOrdenVideo: txtOrdenVideo };

                $.ajax({
                    url: '/Charla/ValidaOrdenVideo',
                    type: 'POST',
                    data: consultaValidaOrden,
                    async: false,

                }).done(function (response) {
                    if (response != 1 && validamodifica == 0) {
                        $('#errorVideoOrden').click();
                    } else {

                        var consulta = {
                            pModo: pModo, pIdVideo: pIdVideo, pLinkVideo: txtLinkVideo, pNombreVideo: txtNombreVideo, pDuracionVideo: txtDuracionVideo, pOrdenVideo: txtOrdenVideo,
                            pUsuarioCreacion: pUsuarioCreacion, pUsuarioModificacion: pUsuarioModificacion
                        };

                        $.ajax({
                            url: '/Charla/MantVideo',
                            type: 'POST',
                            data: consulta,
                            async: false,

                        }).done(function (response) {

                            if (response != 1) {
                                if (pModo != "ELIMINAR") {
                                    $('#errorAgregarVideo').click();
                                } else {
                                    $('#errorEliminarVideo').click();
                                    $('#modalEliminar').modal('toggle');
                                }
                            }
                            else {

                                var consultaRelacionCC = { pModo: pModo, pIdVideo: pIdVideo, pIdCharla: txtcbCharla };
                                $.ajax({
                                    url: '/Charla/MantVideoCharla',
                                    type: 'POST',
                                    data: consultaRelacionCC,
                                    async: false,

                                }).done(function (response) {

                                    if (response != 1) {
                                        $('#errorVideoCharla').click();
                                    } else {
                                        if (pModo == "AGREGAR") {
                                            $('#ModalVideo').modal('toggle');
                                            $('#confirmarCreacion').click();
                                            CallVideos();
                                        } else if (pModo == "MODIFICAR") {
                                            $('#ModalVideo').modal('toggle');
                                            $('#confirmarModificar').click();
                                            CallVideos();
                                        } else {
                                            $('#modalEliminar').modal('toggle');
                                            $('#confirmarEliminar').click();
                                            CallVideos();
                                        }
                                    }
                                });
                            }
                        });
                    }
                });
            });
        }
    }
}

function MostrarCampoVideo() {

    $("#btn_agregar").css("display", "block");
    $("#btn_modificar").css("display", "none");
    $('#ModalVideo').modal('show');

    $("#txtLinkVideo").val("");
    $("#txtNombreVideo").val("");
    $("#txtMinutosVideo").val("");
    $("#txtSegundosVideo").val("");
    $("#txtOrdenVideo").val("");


    llenarCharlas();

}

function ModificarModalVideos(pModo, pIdVideo) {
    llenarCharlas();
    $("#btn_agregar").css("display", "none");
    $("#btn_modificar").css("display", "block");

    if (pModo == "2") {
        pModo = "MODIFICAR";
    }

    $('#ModalVideo').modal('show');

    $.ajax({
        url: '/Charla/Cargar_Video_Filtrado',
        data: { 'pIdVideo': pIdVideo },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
        type: 'POST',

    }).done(function (response) {
        var dataChart = JSON.parse(response);

        $("#txtIdVideo").val(pIdVideo);
        $("#txtLinkVideo").val(dataChart[0].linkVideo);
        $("#txtNombreVideo").val(dataChart[0].nombreVideo);

        $("#txtDuracionVideo").val();

        var str = dataChart[0].duracionVideo;
        var res = str.split(":");

        $("#txtMinutosVideo").val(res[0]);
        $("#txtSegundosVideo").val(res[1]);

        $("#txtOrdenVideo").val(dataChart[0].ordenVideo);

        let element = document.getElementById('cbCharla');
        element.value = dataChart[0].idCharla;
        MostrarCharlistaCharla();

    });

}

function ConfirmarEliminarVideos(idVideo) {

    $('#modalEliminar').modal('show');
    $("#txtIdVideo").val(idVideo);

}

function MostrarCharlistaCharla() {

    var cbCharla = document.getElementById("cbCharla");
    var txtcbCharla = cbCharla.options[cbCharla.selectedIndex].value;

    var consultaCharla = { pIdCharla: txtcbCharla };
    $.ajax({
        url: '/Charla/Cargar_Charla_Filtrada',
        type: 'POST',
        data: consultaCharla,

    }).done(function (response) {
        var datos = JSON.parse(response);         //trae los datos del usuario del id especifico
        $(".charlista").html(datos[0].correoUsuario);
    });
}

function cargarVideo() {

    $.ajax({
        url: '/Charla/varSesionIdVideo',
        type: 'POST',

    }).done(function (response) {

        var idVideo = response;
        $.ajax({
            url: '/Charla/Cargar_Video_FiltradoId',
            data: { 'pIdVideo': idVideo },
            type: 'POST',

        }).done(function (response) {

            var datos = JSON.parse(response);

            var nombre = "nombreVideo";
            var duracion = "duracionVideo";
            var linkVideo = "linkVideo";
            var link = datos[0].linkVideo;

            var nombreV = document.getElementById(nombre);
            var duracionV = document.getElementById(duracion);
            var linkV = document.getElementById(linkVideo);

            var nombreVideo = document.createTextNode(datos[0].nombreVideo);
            var duracionVideo = document.createTextNode(datos[0].duracionVideo);

            nombreV.appendChild(nombreVideo);
            duracionV.appendChild(duracionVideo);
            linkV.setAttribute("src", link);

            $.ajax({
                url: '/Charla/varSesionIdCharlaVideo',
                type: 'POST',

            }).done(function (response) {

                var idCharla = response;

                $.ajax({
                    url: '/Charla/Cargar_Charla_Filtrada',
                    type: 'POST',
                    data: { 'pIdCharla': idCharla }

                }).done(function (response) {

                    $.ajax({
                        url: '/Admin/varSesionRol',
                        type: 'POST',

                    }).done(function (response) {


                        var idusu = "";

                        $.ajax({
                            url: '/Admin/varSesionIdUsuario',
                            type: 'POST',

                        }).done(function (vsu) {

                            idusu = vsu;

                            $.ajax({
                                url: '/Charla/validaCharlaComprada',
                                type: 'POST',
                                data: { 'idCharla': idCharla, 'idUsuario': idusu }

                            }).done(function (response) {

                                if (response == 1) {
                                    vsr = 3
                                } else {
                                    vsr = 0;
                                }

                                if (vsr == 3) {

                                    $.ajax({
                                        url: '/Charla/Cargar_Video_Charla_Visualizado_FiltradoId',
                                        type: 'POST',
                                        data: { 'pIdCharla': idCharla, 'pIdUsuario': idusu }

                                    }).done(function (response) {
                                        var datos = JSON.parse(response);

                                        dataLength = datos.length;

                                        var tituloCharla = document.getElementById("tituloCharlaVideo");

                                        var nombreCharla = datos[0].nombreCharla;

                                        tituloCharla.setAttribute('onclick', 'CargarPagCharlaDetalle(' + idCharla + ')');
                                        tituloCharla.innerHTML = nombreCharla

                                        for (x = 0; x < dataLength; x++) {
                                            var liVideo = document.createElement("li");
                                            liVideo.className = 'accordion__menu-link';
                                            var idVideo = datos[x].idVideo;

                                            var aVideo = document.createElement("a");
                                            aVideo.className = 'flex';
                                            aVideo.appendChild(document.createTextNode(datos[x].nombreVideo));
                                            aVideo.setAttribute('onclick', "enviaID('" + idVideo + "', '" + idCharla + "') ");
                                            aVideo.setAttribute('style', 'cursor:pointer;');

                                            var spanVideoP = document.createElement("span");
                                            spanVideoP.className = 'text-muted';
                                            spanVideoP.appendChild(document.createTextNode(datos[x].duracionVideo));

                                            var spanVideoS = document.createElement("span");

                                            if (datos[x].visualizado == 1) {
                                                spanVideoS.setAttribute('style', 'Display: inline; color: #f6b10a; cursor:pointer;');
                                                spanVideoS.className = 'material-icons fas fa-check-square icon-16pt icon--left ml-3';
                                            } else {
                                                spanVideoS.setAttribute('style', 'Display: inline; cursor:pointer;');
                                                spanVideoS.className = 'material-icons fas fa-check-square icon-16pt icon--left text-50 ml-3';
                                            }


                                            var ulVideo = document.getElementById('toc-content-1');
                                            ulVideo.appendChild(liVideo);
                                            liVideo.appendChild(aVideo);
                                            liVideo.appendChild(spanVideoP);
                                            liVideo.appendChild(spanVideoS);
                                        }

                                    });

                                } else {

                                    $.ajax({
                                        url: '/Charla/Cargar_Video_Charla_FiltradoId',
                                        type: 'POST',
                                        data: { 'pIdCharla': idCharla }

                                    }).done(function (response) {
                                        var datos = JSON.parse(response);

                                        dataLength = datos.length;

                                        var tituloCharla = document.getElementById("tituloCharlaVideo");

                                        var nombreCharla = datos.nombreCharla;

                                        tituloCharla.setAttribute('onclick', 'CargarPagCharlaDetalle(' + idCharla + ')');
                                        tituloCharla.innerHTML = nombreCharla

                                        for (x = 0; x < dataLength; x++) {

                                            var liVideo = document.createElement("li");
                                            liVideo.className = 'accordion__menu-link';
                                            var idVideo = datos[x].idVideo;

                                            var aVideo = document.createElement("a");
                                            aVideo.className = 'flex';
                                            aVideo.appendChild(document.createTextNode(datos[x].nombreVideo));
                                            aVideo.setAttribute('onclick', "enviaID('" + idVideo + "', '" + idCharla + "') ");
                                            aVideo.setAttribute('style', 'cursor:pointer;');

                                            var spanVideoP = document.createElement("span");
                                            spanVideoP.className = 'text-muted';
                                            spanVideoP.appendChild(document.createTextNode(datos[x].duracionVideo));

                                            var spanVideoS = document.createElement("span");
                                            spanVideoS.className = 'material-icons icon-16pt icon--left text-50 ml-3';
                                            spanVideoS.appendChild(document.createTextNode("check_circle"));
                                            spanVideoS.setAttribute('style', 'Display: none; cursor:pointer;');

                                            var ulVideo = document.getElementById('toc-content-1');
                                            ulVideo.appendChild(liVideo);
                                            liVideo.appendChild(aVideo);
                                            liVideo.appendChild(spanVideoP);
                                            liVideo.appendChild(spanVideoS);
                                        }
                                    });

                                }
                            });
                        });
                    });
                });
            });
        });
    });
}

function enviaID(idVideo, idCharla) {

    var consulta = { IdVideo: idVideo, idCharla: idCharla };

    $.ajax({
        url: '/Charla/LLenarIdVideo',
        type: 'POST',
        data: consulta

    }).done(function (response) {
        location.href = "/Charla/VerVideo";
    });

}

function verifSegundosDuracion() {

    if ($("#txtSegundosVideo").val() > 60) {
        $("#txtSegundosVideo").val("60")
    }

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

/************** VALORACION **************/

function ValorarCharla(cant) {

    var valoracionCharla = 0;
    var idUsuarioFdb = 0;

    $.ajax({
        url: '/Charla/varSesionCharla',
        type: 'POST',

    }).done(function (response) {

        var pIdCharla = response;

        if (cant == 1) {
            $("#Valor1").html('star');
            $("#Valor2").html('star_border');
            $("#Valor3").html('star_border');
            $("#Valor4").html('star_border');
            $("#Valor5").html('star_border');
            valoracionCharla = cant;

        } else if (cant == 2) {
            $("#Valor1").html('star');
            $("#Valor2").html('star');
            $("#Valor3").html('star_border');
            $("#Valor4").html('star_border');
            $("#Valor5").html('star_border');
            valoracionCharla = cant;

        } else if (cant == 3) {
            $("#Valor1").html('star');
            $("#Valor2").html('star');
            $("#Valor3").html('star');
            $("#Valor4").html('star_border');
            $("#Valor5").html('star_border');
            valoracionCharla = cant;

        } else if (cant == 4) {
            $("#Valor1").html('star');
            $("#Valor2").html('star');
            $("#Valor3").html('star');
            $("#Valor4").html('star');
            $("#Valor5").html('star_border');
            valoracionCharla = cant;

        } else if (cant == 5) {
            $("#Valor1").html('star');
            $("#Valor2").html('star');
            $("#Valor3").html('star');
            $("#Valor4").html('star');
            $("#Valor5").html('star');
            valoracionCharla = cant;

        } else {
        }

        $.ajax({
            url: '/Admin/varSesionIdUsuario',
            type: 'POST',

        }).done(function (response) {
            idUsuarioFdb = response;

            var consultaValoracion = { pIdUsuario: idUsuarioFdb, pIdCharla: pIdCharla, pValoracionCharla: valoracionCharla };
            $.ajax({
                url: '/Charla/ValorarCharla',
                type: 'POST',
                data: consultaValoracion,

            }).done(function (response) {

                if (response != 1) {

                } else {
                    CargarTotalValoracion();
                }
            });
        });
    });
}

function CargarTotalValoracion() {

    $.ajax({
        url: '/Charla/varSesionCharla',
        type: 'POST',

    }).done(function (response) {

        var pIdCharla = response;

        var consultaValoracionTotal = { pIdCharla: pIdCharla };
        $.ajax({
            url: '/Charla/ValoracionTotal',
            type: 'POST',
            data: consultaValoracionTotal,

        }).done(function (response) {
            var datos = JSON.parse(response);
            var datoValorTotal = Math.round(datos[0].totalValor * 10) / 10;

            var actualizarValoracionCharla = { pIdCharla: pIdCharla, sValoracionCharla: datoValorTotal };

            $.ajax({
                url: '/Charla/ActualizarValoracionCharla',
                type: 'POST',
                data: actualizarValoracionCharla,

            }).done(function (response) {

                if (response != 1) {

                } else {

                    if (datoValorTotal >= 0 && datoValorTotal <= 1.4) {
                        $("#ValorTotal1").html('star');
                        $("#ValorTotal2").html('star_border');
                        $("#ValorTotal3").html('star_border');
                        $("#ValorTotal4").html('star_border');
                        $("#ValorTotal5").html('star_border');
                        $("#totalValorNum").html("" + datoValorTotal);

                    } else if (datoValorTotal >= 1.5 && datoValorTotal <= 2.4) {
                        $("#ValorTotal1").html('star');
                        $("#ValorTotal2").html('star');
                        $("#ValorTotal3").html('star_border');
                        $("#ValorTotal4").html('star_border');
                        $("#ValorTotal5").html('star_border');
                        $("#totalValorNum").html("" + datoValorTotal);

                    } else if (datoValorTotal >= 2.5 && datoValorTotal <= 3.4) {
                        $("#ValorTotal1").html('star');
                        $("#ValorTotal2").html('star');
                        $("#ValorTotal3").html('star');
                        $("#ValorTotal4").html('star_border');
                        $("#ValorTotal5").html('star_border');
                        $("#totalValorNum").html("" + datoValorTotal);

                    } else if (datoValorTotal >= 3.5 && datoValorTotal <= 4.4) {
                        $("#ValorTotal1").html('star');
                        $("#ValorTotal2").html('star');
                        $("#ValorTotal3").html('star');
                        $("#ValorTotal4").html('star');
                        $("#ValorTotal5").html('star_border');
                        $("#totalValorNum").html("" + datoValorTotal);

                    } else if (datoValorTotal >= 4.5 && datoValorTotal <= 5.5) {
                        $("#ValorTotal1").html('star');
                        $("#ValorTotal2").html('star');
                        $("#ValorTotal3").html('star');
                        $("#ValorTotal4").html('star');
                        $("#ValorTotal5").html('star');
                        $("#totalValorNum").html("" + datoValorTotal);

                    } else {
                    }
                }
                ActualizarValoracionCharlista();
            });
        });
    });
}

function CargarUsuarioValoracion() {

    var idUsuarioFdb = 0;
    $.ajax({
        url: '/Admin/varSesionIdUsuario',
        type: 'POST',

    }).done(function (response) {
        idUsuarioFdb = response;

        $.ajax({
            url: '/Charla/varSesionCharla',
            type: 'POST',

        }).done(function (response) {

            var pIdCharla = response;

            if (idUsuarioFdb != 0) {

                var consultaValoracionUsuario = { pIdUsuario: idUsuarioFdb, pIdCharla: pIdCharla };
                $.ajax({
                    url: '/Charla/ValoracionUsuario',
                    type: 'POST',
                    data: consultaValoracionUsuario,

                }).done(function (response) {

                    var data = JSON.parse(response);

                    if (data.length != 0) {

                        var cant = data[0].valoracionCharla;

                        if (cant == 1) {
                            $("#Valor1").html('star');
                            $("#Valor2").html('star_border');
                            $("#Valor3").html('star_border');
                            $("#Valor4").html('star_border');
                            $("#Valor5").html('star_border');

                        } else if (cant == 2) {
                            $("#Valor1").html('star');
                            $("#Valor2").html('star');
                            $("#Valor3").html('star_border');
                            $("#Valor4").html('star_border');
                            $("#Valor5").html('star_border');

                        } else if (cant == 3) {
                            $("#Valor1").html('star');
                            $("#Valor2").html('star');
                            $("#Valor3").html('star');
                            $("#Valor4").html('star_border');
                            $("#Valor5").html('star_border');

                        } else if (cant == 4) {
                            $("#Valor1").html('star');
                            $("#Valor2").html('star');
                            $("#Valor3").html('star');
                            $("#Valor4").html('star');
                            $("#Valor5").html('star_border');

                        } else if (cant == 5) {
                            $("#Valor1").html('star');
                            $("#Valor2").html('star');
                            $("#Valor3").html('star');
                            $("#Valor4").html('star');
                            $("#Valor5").html('star');

                        } else {
                        }
                    }
                });
            }
        });
    });
}

function ActualizarValoracionCharlista() {

    $.ajax({
        url: '/Admin/varSesionPefilPublico',
        type: 'POST',

    }).done(function (response) {
        var idCharlista = response;

        var actualizarValoracionCharla = { pIdUsuario: idCharlista };
        $.ajax({
            url: '/Charla/ActualizarValoracionCharlista',
            data: actualizarValoracionCharla,
            type: 'POST',

        }).done(function (response) {

            CargarTotalValoracionCharlista(idCharlista);
        });
    });
}

function CargarTotalValoracionCharlista(pIdcharlista) {

    var actualizarValoracionCharla = { pIdcharlista: pIdcharlista };
    $.ajax({
        url: '/Charla/ValoracionCharlista',
        type: 'POST',
        data: actualizarValoracionCharla,

    }).done(function (response) {
        var datos = JSON.parse(response);

        if (datos.length != 0) {

            var datoValorTotal = Math.round(datos[0].valoracionCharlista * 10) / 10;

            if (datoValorTotal >= 0 && datoValorTotal <= 1.4) {
                $("#ValorTotalCharlista1").html('star');
                $("#ValorTotalCharlista2").html('star_border');
                $("#ValorTotalCharlista3").html('star_border');
                $("#ValorTotalCharlista4").html('star_border');
                $("#ValorTotalCharlista5").html('star_border');
                $("#totalValorNumCharlista").html("" + datoValorTotal);

            } else if (datoValorTotal >= 1.5 && datoValorTotal <= 2.4) {
                $("#ValorTotalCharlista1").html('star');
                $("#ValorTotalCharlista2").html('star');
                $("#ValorTotalCharlista3").html('star_border');
                $("#ValorTotalCharlista4").html('star_border');
                $("#ValorTotalCharlista5").html('star_border');
                $("#totalValorNumCharlista").html("" + datoValorTotal);

            } else if (datoValorTotal >= 2.5 && datoValorTotal <= 3.4) {
                $("#ValorTotalCharlista1").html('star');
                $("#ValorTotalCharlista2").html('star');
                $("#ValorTotalCharlista3").html('star');
                $("#ValorTotalCharlista4").html('star_border');
                $("#ValorTotalCharlista5").html('star_border');
                $("#totalValorNumCharlista").html("" + datoValorTotal);

            } else if (datoValorTotal >= 3.5 && datoValorTotal <= 4.4) {
                $("#ValorTotalCharlista1").html('star');
                $("#ValorTotalCharlista2").html('star');
                $("#ValorTotalCharlista3").html('star');
                $("#ValorTotalCharlista4").html('star');
                $("#ValorTotalCharlista5").html('star_border');
                $("#totalValorNumCharlista").html("" + datoValorTotal);

            } else if (datoValorTotal >= 4.5 && datoValorTotal <= 5.5) {
                $("#ValorTotalCharlista1").html('star');
                $("#ValorTotalCharlista2").html('star');
                $("#ValorTotalCharlista3").html('star');
                $("#ValorTotalCharlista4").html('star');
                $("#ValorTotalCharlista5").html('star');
                $("#totalValorNumCharlista").html("" + datoValorTotal);

            } else {
            }
        }
    });
}

/**************Valida Admin**************/

function validaAdminCharlas() {

    $.ajax({
        url: '/Admin/varSesionRol',/* aca llamo el metodo que contiene la variable*/
        type: 'POST',

    }).done(function (response) {
        var rol = response;

        if (rol == 1) {
            CallCharlas();
        } else {
            location.href = "/Home/Index";
        }
    });
}

function validaAdminVideo() {

    $.ajax({
        url: '/Admin/varSesionRol',/* aca llamo el metodo que contiene la variable*/
        type: 'POST',

    }).done(function (response) {
        var rol = response;

        if (rol == 1) {
            CallVideos();
        } else {
            location.href = "/Home/Index";
        }
    });
}

/**************Charlistas**************/

function CargarVerCharlistas(tipoDatos) {

    if (tipoDatos == "Charlistas(") {

        document.getElementById('liFiltro1').className = "sidebar-menu-item active";
        document.getElementById('liFiltro2').className = "sidebar-menu-item";

        document.getElementById('filtro1').setAttribute('onclick', '');
        document.getElementById('filtro2').setAttribute('onclick', 'CargarVerCharlistas("CharlistasCalificados(")');

        $.ajax({
            url: '/Admin/Cargar_Tabla_Charlista',
            type: 'POST',

        }).done(function (response) {
            var datos = JSON.parse(response);

            CargarPaginacionCharlistas(datos, 6, tipoDatos);
            CargarCharlistas(1);

        });

    } else if (tipoDatos == "CharlistasCalificados(") {

        document.getElementById('liFiltro1').className = "sidebar-menu-item";
        document.getElementById('liFiltro2').className = "sidebar-menu-item active";

        document.getElementById('filtro1').setAttribute('onclick', 'CargarVerCharlistas("Charlistas(")');
        document.getElementById('filtro2').setAttribute('onclick', '');

        $.ajax({
            url: '/Admin/Cargar_Charlistas_Calificados',
            type: 'POST',

        }).done(function (response) {
            var datos = JSON.parse(response);

            CargarPaginacionCharlistas(datos, 6, tipoDatos);
            CargarCharlistasCalificados(1);

        });
    }

}

function CargarCharlistas(pagDisplay) {

    datosXPagina = pagDisplay * 6 - 6;
    datosRestantes = datosXPagina;

    $.ajax({
        url: '/Admin/Cargar_Tabla_Charlista',
        type: 'POST',

    }).done(function (response) {

        var datos = JSON.parse(response);
        var dataLength = datos.length;

        var cantPaginas = dataLength / 6;
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
                liUltimo.setAttribute('onclick', 'CargarCharlistas(' + (pagDisplay + 1) + ')');

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
                liPrimero.setAttribute('onclick', 'CargarCharlistas(' + (pagDisplay - 1) + ')');
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

        for (x = 0; x < 6; x++) {

            $('#aNombreCharlista' + x).html('');
            $('#pDescCharlista' + x).html('');
            $('#aNombreCharla' + x).html('');

            document.getElementById("divCharlistas" + x).style.display = 'none';

            if (dataLength > datosRestantes) {

                var txtNombreCharlista = document.getElementById("aNombreCharlista" + x);
                var txtDescCharlista = document.getElementById("pDescCharlista" + x);
                var imagenCharlista = "imagenCharlista" + x;

                var VT1 = "VTA" + (x + 1);
                var VT2 = "VTB" + (x + 1);
                var VT3 = "VTC" + (x + 1);
                var VT4 = "VTD" + (x + 1);
                var VT5 = "VTE" + (x + 1);

                var datoValorTotal = Math.round(datos[datosXPagina].valoracionCharlista * 10) / 10;

                if (datoValorTotal >= 0 && datoValorTotal <= 1.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star_border');
                    $("#" + VT3).html('star_border');
                    $("#" + VT4).html('star_border');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 1.5 && datoValorTotal <= 2.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star_border');
                    $("#" + VT4).html('star_border');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 2.5 && datoValorTotal <= 3.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star');
                    $("#" + VT4).html('star_border');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 3.5 && datoValorTotal <= 4.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star');
                    $("#" + VT4).html('star');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 4.5 && datoValorTotal <= 5.5) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star');
                    $("#" + VT4).html('star');
                    $("#" + VT5).html('star');

                } else {
                }
                var nombreCompleto = datos[datosXPagina].nombreUsuario + " " + datos[datosXPagina].apellidosUsuario;
                var imagenCharlista1 = datos[datosXPagina].imagenUsuario;
                $("#" + imagenCharlista).attr('src', imagenCharlista1);


                txtNombreCharlista.appendChild(document.createTextNode(nombreCompleto));
                txtDescCharlista.appendChild(document.createTextNode(datos[datosXPagina].descripcionUsuario));

                txtNombreCharlista.setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[datosXPagina].idUsuario + ')');
                txtNombreCharlista.setAttribute('style', 'cursor:pointer;');

                document.getElementById('aCharlistaIMG' + x).setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[datosXPagina].idUsuario + ')');

                document.getElementById("divCharlistas" + x).style.display = 'block';

                var pIdUsuario = datos[datosXPagina].idUsuario;

                $.ajax({
                    url: '/Charla/Cargar_Charla_Random',
                    type: 'POST',
                    async: false,
                    data: { 'pLimite': 1, 'pIdUsuario': pIdUsuario },

                }).done(function (response) {

                    var datosCharla = JSON.parse(response);
                    var dataLengthCharla = datosCharla.length;

                    var imagenCharla = "imagenCharla" + x;

                    if (dataLengthCharla > 0) {
                        var txtNombreCharla = document.getElementById("aNombreCharla" + x);
                        txtNombreCharla.appendChild(document.createTextNode(datosCharla[0].nombreCharla));

                        var imagenCharla1 = datosCharla[0].imagenCharla;
                        $("#" + imagenCharla).attr('src', imagenCharla1);

                        $("#" + imagenCharla).attr('style', 'Display:inline');

                        document.getElementById('aNombreCharla' + x).setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datosCharla[0].idCharla) + ')');
                    } else {

                        $("#" + imagenCharla).attr('style', 'Display:none');
                    }
                });
                datosXPagina = datosXPagina + 1;
                dataLength = dataLength - 1;
            }
        }
    });
}

function CargarCharlistasCalificados(pagDisplay) {

    datosXPagina = pagDisplay * 6 - 6;
    datosRestantes = datosXPagina;

    $.ajax({
        url: '/Admin/Cargar_Charlistas_Calificados',
        type: 'POST',

    }).done(function (response) {

        var datos = JSON.parse(response);
        var dataLength = datos.length;

        var cantPaginas = dataLength / 6;
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
                liUltimo.setAttribute('onclick', 'CargarCharlistas(' + (pagDisplay + 1) + ')');

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
                liPrimero.setAttribute('onclick', 'CargarCharlistas(' + (pagDisplay - 1) + ')');
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

        for (x = 0; x < 6; x++) {

            $('#aNombreCharlista' + x).html('');
            $('#pDescCharlista' + x).html('');
            $('#aNombreCharla' + x).html('');

            document.getElementById("divCharlistas" + x).style.display = 'none';

            if (dataLength > datosRestantes) {

                var txtNombreCharlista = document.getElementById("aNombreCharlista" + x);
                var txtDescCharlista = document.getElementById("pDescCharlista" + x);
                var imagenCharlista = "imagenCharlista" + x;

                var VT1 = "VTA" + (x + 1);
                var VT2 = "VTB" + (x + 1);
                var VT3 = "VTC" + (x + 1);
                var VT4 = "VTD" + (x + 1);
                var VT5 = "VTE" + (x + 1);

                var datoValorTotal = Math.round(datos[datosXPagina].valoracionCharlista * 10) / 10;

                if (datoValorTotal >= 0 && datoValorTotal <= 1.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star_border');
                    $("#" + VT3).html('star_border');
                    $("#" + VT4).html('star_border');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 1.5 && datoValorTotal <= 2.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star_border');
                    $("#" + VT4).html('star_border');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 2.5 && datoValorTotal <= 3.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star');
                    $("#" + VT4).html('star_border');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 3.5 && datoValorTotal <= 4.4) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star');
                    $("#" + VT4).html('star');
                    $("#" + VT5).html('star_border');

                } else if (datoValorTotal >= 4.5 && datoValorTotal <= 5.5) {
                    $("#" + VT1).html('star');
                    $("#" + VT2).html('star');
                    $("#" + VT3).html('star');
                    $("#" + VT4).html('star');
                    $("#" + VT5).html('star');

                } else {
                }
                var nombreCompleto = datos[datosXPagina].nombreUsuario + " " + datos[datosXPagina].apellidosUsuario;
                var imagenCharlista1 = datos[datosXPagina].imagenUsuario;
                $("#" + imagenCharlista).attr('src', imagenCharlista1);


                txtNombreCharlista.appendChild(document.createTextNode(nombreCompleto));
                txtDescCharlista.appendChild(document.createTextNode(datos[datosXPagina].descripcionUsuario));

                txtNombreCharlista.setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[datosXPagina].idUsuario + ')');
                txtNombreCharlista.setAttribute('style', 'cursor:pointer;');

                document.getElementById('aCharlistaIMG' + x).setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[datosXPagina].idUsuario + ')');

                document.getElementById("divCharlistas" + x).style.display = 'block';

                var pIdUsuario = datos[datosXPagina].idUsuario;

                $.ajax({
                    url: '/Charla/Cargar_Charla_Random',
                    type: 'POST',
                    async: false,
                    data: { 'pLimite': 1, 'pIdUsuario': pIdUsuario },

                }).done(function (response) {

                    var datosCharla = JSON.parse(response);
                    var dataLengthCharla = datosCharla.length;

                    var imagenCharla = "imagenCharla" + x;

                    if (dataLengthCharla > 0) {
                        var txtNombreCharla = document.getElementById("aNombreCharla" + x);
                        txtNombreCharla.appendChild(document.createTextNode(datosCharla[0].nombreCharla));

                        var imagenCharla1 = datosCharla[0].imagenCharla;
                        $("#" + imagenCharla).attr('src', imagenCharla1);
                        $("#" + imagenCharla).attr('style', 'Display:inline');

                        document.getElementById('aNombreCharla' + x).setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datosCharla[0].idCharla) + ')');
                    } else {

                        $("#" + imagenCharla).attr('style', 'Display:none');
                    }
                });
                datosXPagina = datosXPagina + 1;
                dataLength = dataLength - 1;
            }
        }
    });
}

function CargarPaginacionCharlistas(data, cantDisplay, tipoDatos) {

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


/************Ver Video****************/

//<script src="https://player.vimeo.com/api/player.js"></script>

async function vimeo() {
    var iframe = document.querySelector('iframe');
    var player = new Vimeo.Player(iframe);
    var i = 0;
    var sec = 0;
    var durat = 0;
    var delay = (function () {
        var timer = 0;
        return function (callback, ms) {
            clearTimeout(timer);
            timer = setTimeout(callback, ms);
        };
    })();

    player.getDuration().then(function (duration) {

        durat = duration;

        player.getCurrentTime().then(function (seconds) {
            sec = seconds;

            if (sec != durat) {
                delay(function () {
                    vimeo();
                }, 2000);

            } else {
                videoVisto();
            }
        }).catch(function (seconds) {

        });
    }).catch(function (error) {

    });
}

function videoVisto() {

    var idVideo;
    var idUsuario;
    $.ajax({
        url: '/Charla/varSesionIdVideo',
        type: 'POST',

    }).done(function (isv) {
        idVideo = isv;
        $.ajax({
            url: '/Admin/varSesionIdUsuario',
            type: 'POST',

        }).done(function (vsi) {
            idUsuario = vsi;
            var consulta = {
                pIdUsuario: idUsuario, pIdVideo: idVideo
            };

            $.ajax({
                url: '/Charla/videoVisto',
                type: 'POST',
                data: consulta

            }).done(function (response) {
                var respuesta = response;
                if (respuesta == 1) {

                    console.log("see it");

                } else if (respuesta == 2) {

                    $.ajax({
                        url: '/Charla/VerificaCharlaCompletada',
                        type: 'POST',
                        data: consulta

                    }).done(function (vcComplete) {

                        if (vcComplete == 1) {

                            location.href = "/Admin/facebook";
                        }
                    });

                    $('#VideoCompletado').click();
                }
            });
        });
    });
}

function validaLogComp() {//valida que el usuario este logeado y tenga la charla comprada
    $.ajax({
        url: '/Admin/varSesionCorreo',
        type: 'POST',

    }).done(function (SesionCorreo) {

        if (SesionCorreo != "") {
            $.ajax({
                url: '/Admin/varSesionIdUsuario',
                type: 'POST',

            }).done(function (idUsuario) {
                var idUser = idUsuario;
                $.ajax({
                    url: '/Charla/varSesionCharla',
                    type: 'POST',

                }).done(function (idCharla) {
                    var idChar = idCharla;
                    var consulta = {
                        pIdUsuario: idUser, pIdCharla: idChar
                    };

                    $.ajax({
                        url: '/Charla/validaCharlasVC',
                        type: 'POST',
                        data: consulta

                    }).done(function (response) {
                        var respuesta = response;

                        if (respuesta == 1) {

                            var consulta = {
                                pIdUsuario: idUsuario, pIdCharla: idChar
                            };

                            $.ajax({
                                url: '/Charla/CargarCharlaCompletada',
                                type: 'POST',
                                data: consulta

                            }).done(function (ccC) {
                                var datwea = JSON.parse(ccC);

                                if (datwea != null) {
                                    var fechaFinalizacion = datwea[0].fechaFinalizacion;

                                    var res = fechaFinalizacion.split("T");
                                    $("#fechaFinal").html(res[0]);
                                }
                            });

                        } else if (respuesta == 2) {
                            location.href = "/Home/Index";
                        }
                    });
                });
            });
        } else {
            location.href = "/Home/Index";
        }
    });
}

function validaBoton() {

    $.ajax({
        url: '/Admin/varSesionIdUsuario',
        type: 'POST',

    }).done(function (idUsuario) {
        var idUser = idUsuario;
        $.ajax({
            url: '/Charla/varSesionCharla',
            type: 'POST',

        }).done(function (idCharla) {
            var idChar = idCharla;
            var consulta = {
                pIdUsuario: idUser, pIdCharla: idChar   //cambiar por el nuevo metodo 
            };

            $.ajax({
                url: '/Charla/validaCharlasVC',
                type: 'POST',
                data: consulta

            }).done(function (response) {
                var respuesta = response;
                //console.log(respuesta);
                if (respuesta == 1) {
                    console.log("entro en 1 ");
                } else if (respuesta == 2) {
                    document.getElementById('bCompartir').style.display = 'none';
                }
            });
        });
    });

}

