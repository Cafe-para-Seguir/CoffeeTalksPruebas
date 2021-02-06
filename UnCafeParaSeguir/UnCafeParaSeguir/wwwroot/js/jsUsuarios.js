var tableCharlista = null;
var tablaConsulta;
var strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
var mediumRegex = new RegExp("^(((?=.*[a-z])(?=.*[A-Z]))|((?=.*[a-z])(?=.*[0-9]))|((?=.*[A-Z])(?=.*[0-9])))(?=.{6,})");
var lvlclave = "";
var EsCorreo = "";

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
}
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
}

function CallUsuariosTabla() {

    $.ajax({
        url: '/Admin/Cargar_Tabla_Usuario',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);
        CargarTablaUsuarios(datos);
        tableCharlista = "usuario";

    });
}

function CallUsuariosCharlista() {

    tableCharlista = "charlista";

    $.ajax({
        url: '/Admin/Cargar_Tabla_Charlista',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);
        CargarTablaCharlistas(datos);


    });
}

function CallRecetasUsuario(pIdUsuario) {

    $.ajax({
        url: '/Receta/Cargar_Receta_Usuario',
        type: 'POST',
        data: { 'pIdUsuario': pIdUsuario }

    }).done(function (response) {
        var datos = JSON.parse(response);
        MostrarRecetasUsuario(datos);
    });
}

function CargarTablaUsuarios(Data) {

    $('#tbl_Usuarios').dataTable().fnDestroy();
    tablaConsulta = $('#tbl_Usuarios').DataTable({
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
            { data: "idUsuario", visible: false },
            { data: "nombreUsuario" },
            { data: "apellidosUsuario" },
            { data: "estadoUsuario" },
            { data: "fechaCreacion" },
            { data: "usuarioCreacion" },
            { data: "fechaModificacion" },
            { data: "usuarioModificacion" },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="CargarVariablePerfilPublico(\'' + row.idUsuario + '\' ) " >Ver Perfil</button>';

                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="CallRecetasUsuario(\'' + row.idUsuario + '\' ) " >Ver Recetas</button>';
                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ModificarModal(2, \'' + row.idUsuario + '\' )" >Modificar</button>';
                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ModificarClaveModal(3, \'' + row.idUsuario + '\' ) " >Cambiar Contraseña</button>';
                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ConfirmarEliminar(\'' + row.idUsuario + '\' ) " >Eliminar</button>';
                }
            }
        ]
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

function CargarTablaCharlistas(Data) {

    $('#tbl_Usuarios').dataTable().fnDestroy();
    tablaConsulta = $('#tbl_Usuarios').DataTable({
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
            { data: "idUsuario", visible: false },
            { data: "nombreUsuario" },
            { data: "apellidosUsuario" },
            { data: "estadoUsuario" },
            { data: "fechaCreacion" },
            { data: "usuarioCreacion" },
            { data: "fechaModificacion" },
            { data: "usuarioModificacion" },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="CargarVariablePerfilPublico(\'' + row.idUsuario + '\' ) " >Ver Perfil</button>';

                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="CallRecetasUsuario(\'' + row.idUsuario + '\' ) " >Ver Recetas</button>';

                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ModificarModal(2, \'' + row.idUsuario + '\' )" >Modificar</button>';
                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ModificarClaveModal(3, \'' + row.idUsuario + '\' ) " >Cambiar Contraseña</button>';
                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="ConfirmarEliminar(\'' + row.idUsuario + '\' ) " >Eliminar</button>';
                }
            }
        ]
    });
}

function jsMantUsuario(pModo, pIdUsuario) {

    var regis;
    if (pIdUsuario == "x") {
        regis = 0;
    } else if (pModo == "MODIFICAR" || pModo == "ELIMINAR") {
        regis = $("#txtIdUsuario").val();
    } else {
        regis = pIdUsuario
    }

    var txtNombreUsuario = $("#txtNombreUsuario").val();
    var txtApellidosUsuario = $("#txtApellidosUsuario").val();
    var txtDescripcionUsuario = $("#txtDescripcionUsuario").val();
    var txtCorreoUsuario = $("#txtCorreoUsuario").val().toLowerCase();
    var txtClaveUsuario = $("#txtClaveUsuario").val();
    var txtConfirmClaveUsuario = $("#txtConfirmClaveUsuario").val();
    var txtImagenUsuario = $("#txtImagenUsuario").val();

    var cbOpcionNotificacion = "";
    var txtOpcionNotificacion = 0;
    var cbIdRol = "";
    var txtIdRol = 0;
    var cbEstadoUsuario = "";
    var txtEstadoUsuario = 0;

    if (pIdUsuario != "x") {
        cbOpcionNotificacion = document.getElementById("cbOpcionNotificacion");
        txtOpcionNotificacion = cbOpcionNotificacion.options[cbOpcionNotificacion.selectedIndex].value;

        cbIdRol = document.getElementById("cbIdRol");
        txtIdRol = cbIdRol.options[cbIdRol.selectedIndex].value;

        cbEstadoUsuario = document.getElementById("cbEstadoUsuario");
        txtEstadoUsuario = cbEstadoUsuario.options[cbEstadoUsuario.selectedIndex].value;
    }

    var pUsuarioCreacion = "";
    var pUsuarioModificacion = "";

    $.ajax({
        url: '/Admin/varSesionCorreo',
        type: 'POST',

    }).done(function (response) {
        pUsuarioCreacion = response;
        pUsuarioModificacion = response;

        if (pModo != "ELIMINAR" && txtNombreUsuario.trim() == "") {
            $('#txtNombreUsuario').focus();
            $('#alertaVacios').click();

        } else if (pModo != "ELIMINAR" && txtApellidosUsuario.trim() == "") {
            $('#txtApellidosUsuario').focus();
            $('#alertaVacios').click();

        } else if (pModo != "ELIMINAR" && txtCorreoUsuario.trim() == "") {
            $('#txtCorreoUsuario').focus();
            $('#alertaVacios').click();

        } else {

            if (EsCorreo != "no" || pModo == "ELIMINAR") {

                if (lvlclave == "baja") {
                    $('#alertaContraCorta').click();
                } else {

                    if (pModo == "AGREGAR" && txtClaveUsuario != txtConfirmClaveUsuario) {
                        $('#alertaContra').click();
                        $('#txtClaveUsuario').focus();
                    }
                    else if (pModo == "AGREGAR" && txtClaveUsuario.trim() == "") {
                        $('#txtClaveUsuario').focus();
                        $('#alertaVacios').click();
                    }
                    else {

                        var consulta = {
                            pModo: pModo, pIdUsuario: regis, pNombreUsuario: txtNombreUsuario, pApellidosUsuario: txtApellidosUsuario, pDescripcionUsuario: txtDescripcionUsuario, pCorreoUsuario: txtCorreoUsuario,
                            pClaveUsuario: txtClaveUsuario, pImagenUsuario: txtImagenUsuario, pOpcionNotificacion: txtOpcionNotificacion, pIdRol: txtIdRol, pEstadoUsuario: txtEstadoUsuario, pUsuarioCreacion: pUsuarioCreacion,
                            pUsuarioModificacion: pUsuarioModificacion
                        };

                        $.ajax({
                            url: '/Admin/MantUsuario',
                            type: 'POST',
                            data: consulta,

                        }).done(function (response) {
                            if (response == -1000) {
                                $('#correoExiste').click();
                            } else if (response == 1062) {
                                $('#correoExiste').click();
                            } else if (response == 39) {
                                $('#modalEliminar').modal('toggle');
                                $('#errorEliminar').click();
                            } else if (response == 40) {
                                $('#modalEliminar').modal('toggle');
                                $('#tieneCharlas').click();
                            } else if (pModo != "ELIMINAR") {
                                $('#exampleModal').modal('toggle');
                                if (pModo == "AGREGAR") {
                                    if (pIdUsuario == "x") {
                                        location.href = "/Home/Index";
                                    } else {
                                        $('#confirmarCreacion').click();
                                        cargartabla();
                                    }
                                } else {
                                    $('#confirmarModificar').click();
                                    cargartabla();
                                }
                            } else {
                                $('#confirmarEliminar').click();
                                $('#modalEliminar').modal('toggle');

                                $.ajax({
                                    url: '/Admin/EliminarImagen',
                                    data: { 'pIdUsuario': regis },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
                                    type: 'POST',

                                }).done(function (response) {

                                    console.log(response);

                                    cargartabla();


                                });
                            }
                        });
                    }
                }
            } else {

                $('#correoInvalido').click();
            }
        }
    });

}

function jsMantUsuarioModificar(pModo, pIdUsuario) {

    var regis;
    if (pIdUsuario == "x") {
        regis = 0;
    } else if (pModo == "MODIFICAR" || pModo == "ELIMINAR") {
        regis = $("#txtIdUsuario").val();
    } else {
        regis = pIdUsuario
    }

    var txtNombreUsuario = $("#txtNombreUsuario").val();
    var txtApellidosUsuario = $("#txtApellidosUsuario").val();
    var txtDescripcionUsuario = $("#txtDescripcionUsuario").val();
    var txtCorreoUsuario = $("#txtCorreoUsuario").val().toLowerCase();;
    var txtClaveUsuario = $("#txtClaveUsuario").val();
    var txtConfirmClaveUsuario = $("#txtConfirmClaveUsuario").val();
    var txtImagenUsuario = $("#imagenid").val();

    var cbOpcionNotificacion = "";
    var txtOpcionNotificacion = 0;
    var cbIdRol = "";
    var txtIdRol = 0;
    var cbEstadoUsuario = "";
    var txtEstadoUsuario = 0;

    if (pIdUsuario != "x") {
        cbOpcionNotificacion = document.getElementById("cbOpcionNotificacion");
        txtOpcionNotificacion = cbOpcionNotificacion.options[cbOpcionNotificacion.selectedIndex].value;

        cbIdRol = document.getElementById("cbIdRol");
        txtIdRol = cbIdRol.options[cbIdRol.selectedIndex].value;

        cbEstadoUsuario = document.getElementById("cbEstadoUsuario");
        txtEstadoUsuario = cbEstadoUsuario.options[cbEstadoUsuario.selectedIndex].value;
    }

    var pUsuarioCreacion = "";
    var pUsuarioModificacion = "";

    var validaModificacion = false;

    $.ajax({
        url: '/Admin/Cargar_Usuario_Filtrado',
        data: { 'pIdUsuario': regis },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
        type: 'POST',

    }).done(function (response) {
        var datosUsoFDB = JSON.parse(response);
        datosUsoFDB[0].idRol;

        if (datosUsoFDB[0].idRol == 2 && txtIdRol == 3) {

            $.ajax({
                url: '/Admin/Cargar_Cursos_Charlista',
                data: { 'pIdUsuario': regis },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
                type: 'POST',
                async: false,

            }).done(function (JdatosUso) {
                var datosUso = JSON.parse(JdatosUso);

                if (datosUso.length == 0) {

                    validaModificacion = true;

                } else {

                    $('#cambioRolconCharlas').click();
                    validaModificacion = false;
                }
            });
        } else {
            validaModificacion = true;
        }

        if (validaModificacion == true) {

            $.ajax({
                url: '/Admin/varSesionCorreo',
                type: 'POST',

            }).done(function (response) {
                pUsuarioCreacion = response;
                pUsuarioModificacion = response;

                if (pModo != "ELIMINAR" && txtNombreUsuario.trim() == "") {
                    $('#txtNombreUsuario').focus();
                    $('#alertaVacios').click();

                } else if (pModo != "ELIMINAR" && txtApellidosUsuario.trim() == "") {
                    $('#txtApellidosUsuario').focus();
                    $('#alertaVacios').click();

                } else if (pModo != "ELIMINAR" && txtCorreoUsuario.trim() == "") {
                    $('#txtCorreoUsuario').focus();
                    $('#alertaVacios').click();

                } else {

                    if (EsCorreo != "no" || pModo == "ELIMINAR") {

                        if (lvlclave == "baja") {
                            $('#alertaContraCorta').click();
                        } else {

                            if (pModo == "AGREGAR" && txtClaveUsuario != txtConfirmClaveUsuario) {
                                $('#alertaContra').click();
                                $('#txtClaveUsuario').focus();
                            }
                            else if (pModo == "AGREGAR" && txtClaveUsuario.trim() == "") {
                                $('#txtClaveUsuario').focus();
                                $('#alertaVacios').click();
                            }
                            else {

                                var datos = new FormData($("#form_enviar_imagen")[0]);
                                datos.append('pModo', pModo);
                                datos.append('pIdUsuario', regis);
                                datos.append('pUsuarioCreacion', pUsuarioCreacion);
                                datos.append('pUsuarioModificacion', pUsuarioModificacion);

                                $.ajax({
                                    url: '/Admin/MantUsuarioModificar',
                                    type: 'POST',
                                    data: datos,
                                    contentType: false,
                                    processData: false,

                                }).done(function (response) {
                                    if (response == -1000) {
                                        $('#correoExiste').click();
                                    } else if (response == 1062) {
                                        $('#correoExiste').click();
                                    } else if (response == 39) {
                                        $('#modalEliminar').modal('toggle');
                                        $('#errorEliminar').click();
                                    } else if (response == 40) {
                                        $('#modalEliminar').modal('toggle');
                                        $('#tieneCharlas').click();
                                    } else if (pModo != "ELIMINAR") {
                                        $('#exampleModal').modal('toggle');
                                        if (pModo == "AGREGAR") {
                                            if (pIdUsuario == "x") {
                                                location.href = "/Home/Index";
                                            } else {
                                                $('#confirmarCreacion').click();
                                                cargartabla();
                                            }
                                        } else {
                                            $('#confirmarModificar').click();
                                            cargartabla();
                                        }
                                    } else if (response == 3) {
                                        $('#confirmarEliminar').click();
                                        $('#modalEliminar').modal('toggle');

                                        $.ajax({
                                            url: '/Admin/EliminarImagen',
                                            data: { 'pIdUsuario': regis },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
                                            type: 'POST',

                                        }).done(function (response) {

                                            cargartabla();

                                        });
                                        cargartabla();
                                    } else {
                                        $('#errorEliminarUsuario').click();
                                        $('#modalEliminar').modal('toggle');
                                    }
                                });
                            }
                        }
                    } else {

                        $('#correoInvalido').click();
                    }
                }
            });
        }
    });
}

function ConfirmarEliminar(idUsuario) {

    $('#modalEliminar').modal('show');
    $("#txtIdUsuario").val(idUsuario);

}

function ModificarModal(pModo, idUsuario) {
    $("#resultado").html('');
    $("#resultado").html("");
    $(".passReg").html("");
    $(".passRegPass").html("");
    lvlclave = "";

    $("#imagenid").val('');

    $("#NoMostar").css("display", "block");

    $("#btn_agregar").css("display", "none");
    $("#btn_modificar").css("display", "block");

    if (pModo == "2") {
        pModo = "MODIFICAR";
        $("#txtCorreoUsuario").attr("readonly", "true");
    }

    $('#exampleModal').modal('show');
    $("#dClaves").css("display", "none");

    $.ajax({
        url: '/Admin/Cargar_Usuario_Filtrado',
        data: { 'pIdUsuario': idUsuario },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);         //trae los datos del usuario del id especifico

        $("#txtIdUsuario").val(idUsuario);

        $("#txtNombreUsuario").val(datos[0].nombreUsuario);
        $("#txtApellidosUsuario").val(datos[0].apellidosUsuario)
        $("#txtDescripcionUsuario").val(datos[0].descripcionUsuario);
        $("#txtCorreoUsuario").val(datos[0].correoUsuario);
        $("#txtImagenUsuario").val(datos[0].imagenUsuario);

        //if (datos[0].idRol == 2) {
        $("#txtValoracionCharlista").val(datos[0].valoracionCharlista);
        //}

        let element = document.getElementById('cbIdRol');
        element.value = datos[0].idRol;

        let element1 = document.getElementById('cbOpcionNotificacion');
        element1.value = datos[0].opcionNotificacion;

        let element2 = document.getElementById('cbEstadoUsuario');
        element2.value = datos[0].estadoUsuario;

    });
}

function MostrarCampo() {
    $("#NoMostar").css("display", "none");

    $("#btn_agregar").css("display", "block");
    $("#btn_modificar").css("display", "none");
    $("#dClaves").css("display", "block");

    $("#txtNombreUsuario").val("");
    $("#txtApellidosUsuario").val("");
    $("#txtDescripcionUsuario").val("");
    $("#txtCorreoUsuario").val("");
    $("#txtClaveUsuario").val("");
    $("#txtConfirmClaveUsuario").val("");
    $("#txtImagenUsuario").val("");
    $("#txtIdRol").val("");
    $("#txtestadoUsuario").val("");
    $("#txtValoracionCharlista").val("");

    $(".passReg").html('');
    $(".passRegPass").html('');

    $("#resultado").html('');

    $("#txtCorreoUsuario").removeAttr("readonly");
}

function ModificarClaveModal(pModo, idUsuario) {

    $.ajax({
        url: '/Admin/Cargar_Usuario_Filtrado',
        data: { 'pIdUsuario': idUsuario },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);

        $.ajax({
            url: '/Admin/DesEncryptarClave',
            data: { 'pClaveUsuario': datos[0].claveUsuario },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
            type: 'POST',

        }).done(function (claveDesencryptada) {

            $("#txtClaveActualUsuario").val(claveDesencryptada);
            $("#txtNuevaClaveUsuario").val("");
            $("#txtConfirmNuevaClaveUsuario").val("");
            $(".passReg").html('');
            $(".passRegPass").html('');

            if (pModo == "3") {
                pModo = "MODIFICARCLAVE";
            }

            $("#txtIdUsuarioCClave").val(idUsuario);
            $('#ClaveModal').modal('show');
        });
    });
}

function togglePassword() {

    var x = document.getElementById("txtClaveActualUsuario");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function jsMantClave() {

    var txtIdUsuarioCClave = $("#txtIdUsuarioCClave").val();
    var txtClaveActualUsuario = $("#txtClaveActualUsuario").val();
    var txtNuevaClaveUsuario = $("#txtNuevaClaveUsuario").val();
    var txtConfirmNuevaClaveUsuario = $("#txtConfirmNuevaClaveUsuario").val();

    var pUsuarioModificacion = "";
    var pUsuarioCreacion = "";

    $.ajax({
        url: '/Admin/varSesionCorreo',
        type: 'POST',

    }).done(function (response) {
        pUsuarioCreacion = response;
        pUsuarioModificacion = response;

        $.ajax({
            url: '/Admin/Cargar_Usuario_Filtrado',
            data: { 'pIdUsuario': txtIdUsuarioCClave },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
            type: 'POST',

        }).done(function (response) {
            var encrypClaveActual = "";
            var claveFdb;
            var datos = JSON.parse(response);         //trae los datos del usuario del id especifico
            claveFdb = datos[0].claveUsuario;         //toma el dato especifico del .json

            $.ajax({
                url: '/Admin/EncryptarClave',
                data: { 'pClaveUsuario': txtClaveActualUsuario },   //envia por parametro la contraseña digita en el campo de texto
                type: 'POST',

            }).done(function (response) {
                encrypClaveActual = response;        //recibe la contraseña digita encryptada

                if (encrypClaveActual != claveFdb) {  //verifica que la clave de la bd y la contraseña actual digita sean iguales
                    $('#alertaContraIncorrecta').click();
                } else {

                    if (txtNuevaClaveUsuario.trim() == "") {          //verifica que la nueva contraseña no este vacia
                        $('#txtClaveUsuario').focus();
                        $('#alertaVacios').click();
                    } else {

                        if (txtNuevaClaveUsuario != txtConfirmNuevaClaveUsuario) {      //verifica que la nueva contraseña y la confirmacion sean iguales
                            $('#alertaContra').click();
                            $('#txtClaveUsuario').focus();

                        } else if (lvlclave == "baja") {
                            $('#alertaContraCorta').click();
                        } else {
                            var consulta = { pIdUsuario: txtIdUsuarioCClave, pClaveUsuario: txtNuevaClaveUsuario, pUsuarioModificacion: pUsuarioModificacion };
                            $.ajax({
                                url: '/Admin/jsMantClave',  //envia por parametro la nueva contraseña para ser actualizada en la base de datos
                                type: 'POST',
                                data: consulta,

                            }).done(function (response) {
                                $('#ClaveModal').modal('toggle');     //cierra el modal
                                $('#modificarContra').click();

                            });
                        }
                    }
                }
            });
        });
    });
}

function validaAdmin() {

    $.ajax({
        url: '/Admin/varSesionRol',/* aca llamo el metodo que contiene la variable*/
        type: 'POST',

    }).done(function (response) {
        var rol = response;

        if (rol == 1) {
            CallUsuariosTabla();
        } else {
            location.href = "/Home/Index";
        }
    });

}

function validaAdminCharlista() {

    $.ajax({
        url: '/Admin/varSesionRol',/* aca llamo el metodo que contiene la variable*/
        type: 'POST',

    }).done(function (response) {
        var rol = response;

        if (rol == 1) {
            CallUsuariosCharlista();
        } else {
            location.href = "/Home/Index";
        }
    });

}

function cargartabla() {
    if (tableCharlista == "usuario") {
        CallUsuariosTabla();
    }
    else {
        CallUsuariosCharlista();
    }
}

function MostrarRecetasUsuario(data) {
    var dataLength = data.length;
    if (dataLength > 0) {
        $('#modalRecetas').modal('show');
        for (x = 0; x < dataLength; x = x + 1) {

            if (x == 0) {
                var txtTengoRecetas = document.getElementById('exampleModalLabel');
                $("#exampleModalLabel").html('');
                txtTengoRecetas.appendChild(document.createTextNode("Prueba una de mis Recetas!"));
                $("#divRecetas").css("display", "block");
            }

            var numRow = x.toString();
            var nombreReceta = data[x].nombreReceta;
            var descReceta = data[x].descripcionReceta;
            var txtNombreReceta = document.getElementById("nomReceta" + numRow);
            var textDescReceta = document.getElementById("recetasDisplay" + numRow)
            document.getElementById("nomReceta" + numRow).style.display = 'block';
            document.getElementById("recetasDisplay0").style.display = 'block';
            document.getElementById("nomReceta0").style.class = 'active';
            var textoNombre = document.createTextNode(nombreReceta);
            var textoDescripcion = document.createTextNode(descReceta);
            txtNombreReceta.appendChild(textoNombre);
            textDescReceta.appendChild(textoDescripcion);
        }
    } else {
        $('#noHayRecetas').click();
    }
}

function jsManejoRecetas(display) {
    if (display == 0) {
        document.getElementById("recetasDisplay1").style.display = 'none';
        document.getElementById("recetasDisplay2").style.display = 'none';
        document.getElementById("recetasDisplay0").style.display = 'block';
    } else if (display == 1) {
        document.getElementById("recetasDisplay0").style.display = 'none';
        document.getElementById("recetasDisplay2").style.display = 'none';
        document.getElementById("recetasDisplay1").style.display = 'block';
    } else if (display == 2) {
        document.getElementById("recetasDisplay0").style.display = 'none';
        document.getElementById("recetasDisplay1").style.display = 'none';
        document.getElementById("recetasDisplay2").style.display = 'block';
    } else if (display == 3) {
        $('#recetasDisplay0').html('');
        $('#recetasDisplay1').html('');
        $('#recetasDisplay2').html('');
        $('#nomReceta0').html('');
        $('#nomReceta1').html('');
        $('#nomReceta2').html('');
        document.getElementById("nomReceta0").style.display = 'none';
        document.getElementById("nomReceta1").style.display = 'none';
        document.getElementById("nomReceta2").style.display = 'none';
        $('#modalRecetas').modal('toggle');
    }
}

function verifClave() {

    var txtClaveUsuario = $("#txtClaveUsuario").val();

    if (strongRegex.test(txtClaveUsuario)) {
        $(".passReg").css("color", 'green');
        $(".passReg").html('Fuerte');
        lvlclave = "alta";
    } else if (mediumRegex.test(txtClaveUsuario)) {
        $(".passReg").css("color", 'orange');
        $(".passReg").html('Media');
        lvlclave = "alta";
    } else {
        $(".passReg").css("color", 'red');
        $(".passReg").html('Baja');
        lvlclave = "baja";
    }
}

function verifClaveCambio() {

    var txtClaveUsuario = $("#txtNuevaClaveUsuario").val();

    if (strongRegex.test(txtClaveUsuario)) {
        $(".passRegPass").css("color", 'green');
        $(".passRegPass").html('Fuerte');
        lvlclave = "alta";
    } else if (mediumRegex.test(txtClaveUsuario)) {
        $(".passRegPass").css("color", 'orange');
        $(".passRegPass").html('Media');
        lvlclave = "alta";
    } else {
        $(".passRegPass").css("color", 'red');
        $(".passRegPass").html('Baja');
        lvlclave = "baja";
    }
}

function ValidarCorreo(elemento) {

    var texto = document.getElementById(elemento.id).value;
    var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}.){1,125}[A-Z]{2,63}$/i;

    if (!regex.test(texto)) {
        document.getElementById("resultado").innerHTML = "Correo invalido";
        EsCorreo = "no"
    } else {
        document.getElementById("resultado").innerHTML = "";
        EsCorreo = "si";
    }
}

async function jsIniciarSesion() {

    var txtCorreoUsuario = $("#txtCorreoUsuario").val().toLowerCase();
    var txtClaveUsuario = $("#txtClaveUsuario").val();

    var claveFdb;
    var correoFdb;
    var encrypClaveActual;

    if (txtCorreoUsuario.trim() == "") {          //verifica que la nueva contraseña no este vacia
        $('#txtCorreoUsuario').focus();
        $('#alertaVacios').click();
    } else if (txtClaveUsuario.trim() == "") {
        $('#txtClaveUsuario').focus();
        $('#alertaVacios').click();
    } else {

        $.ajax({
            url: '/Admin/EncryptarClave',
            data: {
                'pClaveUsuario': txtClaveUsuario
            },   //envia por parametro la contraseña digita en el campo de texto
            type: 'POST',

        }).done(function (response) {

            encrypClaveActual = response;        //recibe la contraseña digita encryptada

            $.ajax({
                url: '/Admin/Iniciar_Sesion',
                data: { 'pCorreoUsuario': txtCorreoUsuario, 'pClaveUsuario': encrypClaveActual },
                type: 'POST',

            }).done(function (response) {
                var datos = JSON.parse(response);

                if (EsCorreo != "no") {
                    if (response.length) {
                        if (datos[0] != null) {
                            claveFdb = datos[0].claveUsuario;
                            correoFdb = datos[0].correoUsuario;
                            var validado = datos[0].validadoUsuario;
                            var estado = datos[0].estadoUsuario;
                            var activado = "Activado";
                            if (validado == 1) {
                                if (estado == activado) {
                                    if (claveFdb == encrypClaveActual && correoFdb == txtCorreoUsuario) {
                                        location.href = "/Home/Index";
                                    } else {
                                        $('#creedencialesIncorrectos').click();
                                    }
                                } else {
                                    $('#cuentaNoActivada').click();
                                }
                            }
                            else {
                                $('#noValidado').click();
                            }
                        } else {
                            $('#creedencialesIncorrectos').click();
                        }
                    }
                } else {
                    $('#correoInvalido').click();
                }
            });
        });// este finaliza el primer ejax
    }
}

function jsRegistro() {

    var TerminosCheck = document.getElementById("TerminosCheck").checked;

    if (TerminosCheck == false) {
        $('#terminosCondiciones').click();
    } else {

        var regis = 0;
        var txtNombreUsuario = $("#txtNombreUsuario").val();
        var txtApellidosUsuario = $("#txtApellidosUsuario").val();
        var txtCorreoUsuario = $("#txtCorreoUsuario").val().toLowerCase();;
        var txtClaveUsuario = $("#txtClaveUsuario").val();
        var txtConfirmClaveUsuario = $("#txtConfirmClaveUsuario").val();
        var pModo = "AGREGAR";

        if (txtNombreUsuario.trim() == "") {
            $('#txtNombreUsuario').focus();
            $('#alertaVacios').click();

        } else if (txtApellidosUsuario.trim() == "") {
            $('#txtApellidosUsuario').focus();
            $('#alertaVacios').click();

        } else if (txtCorreoUsuario.trim() == "") {
            $('#txtCorreoUsuario').focus();
            $('#alertaVacios').click();

        } else {

            if (EsCorreo != "no") {

                if (lvlclave == "baja") {
                    $('#alertaContraCorta').click();
                } else {

                    if (txtClaveUsuario != txtConfirmClaveUsuario) {
                        $('#alertaContra').click();
                        $('#txtClaveUsuario').focus();
                    }
                    else if (txtClaveUsuario.trim() == "") {
                        $('#txtClaveUsuario').focus();
                        $('#alertaVacios').click();
                    }
                    else {

                        var consulta = {
                            pModo: pModo, pIdUsuario: regis, pNombreUsuario: txtNombreUsuario, pApellidosUsuario: txtApellidosUsuario, pCorreoUsuario: txtCorreoUsuario,
                            pClaveUsuario: txtClaveUsuario, pUsuarioCreacion: txtCorreoUsuario, pUsuarioModificacion: txtCorreoUsuario
                        };

                        $.ajax({
                            url: '/Admin/RegistroNuevoUsuario',
                            type: 'POST',
                            data: consulta,

                        }).done(function (response) {

                            if (response == -1000) {

                                $('#correoExiste').click();

                            } else if (response == 1) {

                                CodigoVerificacion(txtCorreoUsuario, 1, "AGREGAR");
                                $('#modalVerificarCuenta').modal('toggle');

                            } else {

                                $('#errorGeneral').click();
                            }
                        });
                    }
                }
            } else {
                $('#correoInvalido').click();
            }
        }
    }
}

function ModificarModalPerfil() {

    $("#resultado").html('');

    $("#NoMostar").css("display", "block");

    $("#btn_modificar").css("display", "block");

    $('#exampleModalPerfil').modal('show');
    $("#dClaves").css("display", "none");

    $("#imagenid").val('');

    $.ajax({
        url: '/Admin/varSesionIdUsuario',
        type: 'POST',

    }).done(function (response) {

        var idUsuario = response;

        $.ajax({
            url: '/Admin/Cargar_Usuario_Filtrado',
            data: { 'pIdUsuario': idUsuario },//envia por parametro el ID del usuario para recibir los datos de ese usuario
            type: 'POST',

        }).done(function (response) {
            var datos = JSON.parse(response);//trae los datos del usuario del id especifico

            $("#IdUsuario").val(idUsuario);
            $("#NombreUsuario").val(datos[0].nombreUsuario);
            $("#ApellidosUsuario").val(datos[0].apellidosUsuario)
            $("#DescripcionUsuario").val(datos[0].descripcionUsuario);
            $("#CorreoUsuario").val(datos[0].correoUsuario);
            $("#txtImagenUsuario").val(datos[0].imagenUsuario);

            let element1 = document.getElementById('OpcionNotificacion');
            element1.value = datos[0].opcionNotificacion;

        });
    });
}

function jsMantPerfil(opc) {

    var txtIdUsuario = $("#IdUsuario").val();
    var txtNombreUsuario = $("#NombreUsuario").val();
    var txtApellidosUsuario = $("#ApellidosUsuario").val();
    var txtDescripcionUsuario = $("#DescripcionUsuario").val();
    var txtCorreoUsuario = $("#CorreoUsuario").val().toLowerCase();;
    var txtClaveUsuario = $("#ClaveUsuario").val();
    var txtImagenUsuario = $("#ImagenUsuario").val();

    var cbOpcionNotificacion = document.getElementById("OpcionNotificacion");
    var txtOpcionNotificacion = cbOpcionNotificacion.options[cbOpcionNotificacion.selectedIndex].value;

    var txtIdRol = 0;

    $.ajax({
        url: '/Admin/varSesionRol',
        type: 'POST',

    }).done(function (response) {

        txtIdRol = response;


        if (opc == 1) {
            var txtEstadoUsuario = 'Activado';
        } else {
            var txtEstadoUsuario = 'Desactivado';
        }

        var pUsuarioModificacion = txtCorreoUsuario;
        var pUsuarioCreacion = "";

        if (txtNombreUsuario.trim() == "") {
            $('#txtNombreUsuario').focus();
            $('#alertaVacios').click();

        } else if (txtApellidosUsuario.trim() == "") {
            $('#ApellidosUsuario').focus();
            $('#alertaVacios').click();

        } else if (txtCorreoUsuario.trim() == "") {
            $('#CorreoUsuario').focus();
            $('#alertaVacios').click();

        } else {
            if (EsCorreo != "no") {

                if (lvlclave == "baja") {
                    $('#alertaContraCorta').click();
                } else {

                    var datos = new FormData($("#form_enviar_imagen")[0]);
                    datos.append('pModo', 'MODIFICAR');
                    datos.append('pIdUsuario', txtIdUsuario);
                    datos.append('txtClaveUsuario', txtClaveUsuario);
                    datos.append('pUsuarioCreacion', txtClaveUsuario);
                    datos.append('cbIdRol', txtIdRol);
                    datos.append('cbEstadoUsuario', txtEstadoUsuario);
                    datos.append('pUsuarioCreacion', pUsuarioCreacion);
                    datos.append('pUsuarioModificacion', pUsuarioModificacion);

                    $.ajax({
                        url: '/Admin/MantUsuarioModificar',
                        type: 'POST',
                        data: datos,
                        contentType: false,
                        processData: false,

                    }).done(function (response) {

                        if (response == -1000) {
                            $('#correoExiste').click();
                        } else if (response == 1062) {
                            $('#correoExiste').click();
                        } else {
                            if (opc == 1) {
                                $('#confirmarModificar').click();
                                $('#exampleModal').modal('toggle');
                                location.href = "/Home/Perfil";
                            } else {
                                $('#exampleModalLabel').modal('toggle');
                                $('#confirmarEliminar').click();
                                CerrarSesion();
                            }
                        }
                    });
                }
            } else {
                $('#correoInvalido').click();
            }
        }
    });
}

function DesactivarUsuario() {

    $.ajax({
        url: '/Admin/varSesionIdUsuario',
        type: 'POST',

    }).done(function (response) {

        var idUsuario = response;

        $('#modalEliminar').modal('show');
        $("#IdUsuario").val(idUsuario);
    });
}

function ModificarClavePerfil() {
    $("#txtClaveActualUsuario").val("");
    $("#txtNuevaClaveUsuario").val("");
    $("#txtConfirmNuevaClaveUsuario").val("");

    $(".passReg").html('');
    $(".passRegPass").html('');

    $.ajax({
        url: '/Admin/varSesionIdUsuario',
        type: 'POST',

    }).done(function (response) {

        var idUsuario = response;
        $("#txtIdUsuarioCClave").val(idUsuario);
        $('#ClaveModal').modal('show');

    });
}

function AceptarTerminos() {
    document.getElementById("TerminosCheck").checked = true;
    $('#modalTerminos').modal('toggle');     //cierra el modal
}

function CargarPerfilPublico() {
    $.ajax({
        url: '/Admin/varSesionPefilPublico',
        type: 'POST',

    }).done(function (response) {

        $.ajax({
            url: '/Admin/Cargar_Usuario_Filtrado',
            type: 'POST',
            data: { 'pIdUsuario': response }

        }).done(function (response) {
            var data = JSON.parse(response);


            var imgUsuario = data[0].imagenUsuario;
            var pIdUsuario = data[0].idUsuario;
            var nombreUsuario = data[0].nombreUsuario;
            var apellidosUsuario = data[0].apellidosUsuario;
            var descUsuario = data[0].descripcionUsuario;
            var nombreUsuarioNode = document.createTextNode(nombreUsuario + " " + apellidosUsuario);
            var descUsuarioNode = document.createTextNode(descUsuario);
            var txtCharlaContexto = document.getElementById("txtCharlas");
            var txtNombreUsuario = document.getElementById("txtNombreUsuario");
            var txtDescUsuario = document.getElementById("txtDescUsuario");
            var imagen = "imagenPerfil";

            $("#" + imagen).attr('src', imgUsuario);

            //document.getElementById("imgUsuario").setAttribute("src", imgUsuario);

            txtNombreUsuario.appendChild(nombreUsuarioNode);
            txtDescUsuario.appendChild(descUsuarioNode);
            CallRecetasUsuario(pIdUsuario);

            if ((data[0].idRol) == 2) {

                var datoValorTotal = Math.round(data[0].valoracionCharlista * 10) / 10;

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

                $.ajax({
                    url: '/Admin/Cargar_Cursos_Charlista',
                    type: 'POST',
                    data: { 'pIdUsuario': pIdUsuario }

                }).done(function (response) {

                    var datos = JSON.parse(response);

                    CargarPaginacionPerfilPublico(datos, 4, "CursosPerfilPublico");
                    CargarCursosPerfilPublico(1);

                    document.getElementById('txtCharlas').appendChild(document.createTextNode('Cursos Impartidos'));

                    document.getElementById('ulValoracionCharlista').setAttribute('style', 'Display: block');

                });

            }

        });

    });
}

function CargarCursosPerfilPublico(pagDisplay) {
    datosXPagina = pagDisplay * 4 - 4;
    $.ajax({
        url: '/Admin/varSesionPefilPublico',
        type: 'POST',

    }).done(function (response) {

        $.ajax({
            url: '/Admin/Cargar_Cursos_Charlista',
            type: 'POST',
            data: { 'pIdUsuario': response }

        }).done(function (response) {

            var datos = JSON.parse(response);

            var dataLength = datos.length;

            var cantPaginas = dataLength / 4;

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
                    liUltimo.setAttribute('onclick', 'CargarCursosPerfilPublico(' + (pagDisplay + 1) + ')');

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
                    liPrimero.setAttribute('onclick', 'CargarCursosPerfilPublico(' + (pagDisplay - 1) + ')');
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

            for (x = 0; x < 4; x++) {

                document.getElementById("divCurso" + x).style.display = 'none';

                if (dataLength > datosXPagina) {
                    var imagen = "imagenCharla" + x;
                    $('#txtCurso' + x).html('');
                    var txtCurso = document.getElementById("txtCurso" + x);
                    txtCurso.appendChild(document.createTextNode(datos[datosXPagina].nombreCharla));
                    var divCurso = document.getElementById("divCurso" + x);
                    var imagen1 = datos[datosXPagina].imagenCharla;
                    divCurso.style.display = 'block';
                    divCurso.setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datos[datosXPagina].idCharla) + ')');
                    $("#" + imagen).attr('src', imagen1);

                    var datoValorTotal = datos[datosXPagina].valoracionCharla;

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

                    datosXPagina = datosXPagina + 1;
                }
            }
        });
    });
}

function CargarPaginacionPerfilPublico(data, cantDisplay, tipoDatos) {
    var dataLength = data.length;
    var cantPaginas = dataLength / cantDisplay;
    var ulPaginacion = document.getElementById("ulPaginacion");

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
                liPrimero.setAttribute('onclick', 'Cargar' + tipoDatos + '(' + 1 + ')');
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
            liNumero.setAttribute('onclick', 'Cargar' + tipoDatos + '(' + x + ')');
            var aNumero = document.createElement("a");
            aNumero.setAttribute("aria-label", x);
            aNumero.className = 'page-link';
            var spanNumero = document.createElement("span");

            ulPaginacion.appendChild(liNumero);
            liNumero.appendChild(aNumero);
            aNumero.appendChild(spanNumero);
            spanNumero.appendChild(document.createTextNode(x));

            if (x > 3) {
                document.getElementById('liNumero' + x).style.display = 'none';
            }
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
                liUltimo.setAttribute('onclick', 'Cargar' + tipoDatos + '(' + Math.ceil(cantPaginas) + ')');
            }
        }
    }
}

function ConfirmarEliminarPerfil(idUsuario) {

    $('#modalEliminarPerfil').modal('show');
    $("#txtIdUsuario").val(idUsuario);

}

function CerrarSesion() {

    $.ajax({
        url: '/Admin/CerrarSesionPlat',
        type: 'POST',

    }).done(function (response) {
        var datos = response;

        if (datos == "1") {
            location.href = "/Home/Index";
        } else {
            console.log("ha ocurrido un error");
        }
    });
}

function CodigoVerificacion(correo, tipoCodigo, pModo) {

    var sujeto = "Verifica tu correo de Coffee Talks";
    var contenido = "Tu codigo de verificacion para tu cuenta de Coffee Talks es:";
    var cierre = "Si no has creado una cuenta para la plataforma Coffe Talks porfavor ignora este correo"

    var consulta = {
        correo: correo, tipoCodigo: tipoCodigo, pModo: pModo, sujeto: sujeto, contenido: contenido, cierre: cierre
    };

    $.ajax({
        url: '/Correos/CrearCorreo',
        type: 'POST',
        data: consulta

    }).done(function (response) {

    });
}
