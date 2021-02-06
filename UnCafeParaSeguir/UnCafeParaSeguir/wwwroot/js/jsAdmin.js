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

function ValidarCorreo() {

    var texto = $("#txtCorreoUsuario").val();

    var regex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}.){1,125}[A-Z]{2,63}$/i;

    if (!regex.test(texto)) {
        document.getElementById("resultado").innerHTML = "Correo invalido";
        EsCorreo = "no"
    } else {
        document.getElementById("resultado").innerHTML = "";
        EsCorreo = "si";
    }
}

function CallUsuariosAdministrador() {

    $.ajax({
        url: '/Admin/Cargar_Tabla_Administrador',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);
        CargarTablaUsuarios(datos);

        tableCharlista = "Administrador";

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

function jsMantAdmin(pModo, pIdUsuario) {

    var pIdUsuario;
    if (pModo == "MODIFICAR_ADMIN" || pModo == "ELIMINAR_ADMIN") {
        pIdUsuario = $("#txtIdUsuario").val();
    }

    var txtNombreUsuario = $("#txtNombreUsuario").val();
    var txtApellidosUsuario = $("#txtApellidosUsuario").val();
    var txtDescripcionUsuario = $("#txtDescripcionUsuario").val();
    var txtCorreoUsuario = $("#txtCorreoUsuario").val();
    var txtClaveUsuario = $("#txtClaveUsuario").val();
    var txtConfirmClaveUsuario = $("#txtConfirmClaveUsuario").val();

    var txtImagenUsuario = $("#txtImagenUsuario").val();

    var cbOpcionNotificacion = document.getElementById("cbOpcionNotificacion");
    var txtOpcionNotificacion = cbOpcionNotificacion.options[cbOpcionNotificacion.selectedIndex].value;

    var cbEstadoUsuario = document.getElementById("cbEstadoUsuario");
    var txtEstadoUsuario = cbEstadoUsuario.options[cbEstadoUsuario.selectedIndex].value;

    var txtIdRol = "";

    var pUsuarioCreacion = "";        //$("#pUsuarioCreacion").val();
    var pUsuarioModificacion = "";    //$("#pUsuarioModificacion").val();

    $.ajax({
        url: '/Admin/varSesionCorreo',
        type: 'POST',

    }).done(function (response) {
        pUsuarioCreacion = response;
        pUsuarioModificacion = response;


        if (pModo != "ELIMINAR_ADMIN" && txtNombreUsuario.trim() == "") {
            $('#txtNombreUsuario').focus();
            $('#alertaVacios').click();

        } else if (pModo != "ELIMINAR_ADMIN" && txtApellidosUsuario.trim() == "") {
            $('#txtApellidosUsuario').focus();
            $('#alertaVacios').click();

        } else if (pModo != "ELIMINAR_ADMIN" && txtCorreoUsuario.trim() == "") {
            $('#txtCorreoUsuario').focus();
            $('#alertaVacios').click();

        } else {

            if (EsCorreo != "no" || pModo == "ELIMINAR_ADMIN") {

                if (lvlclave == "baja") {
                    $('#alertaContraCorta').click();
                } else {
                    if (pModo == "AGREGAR_ADMIN" && txtClaveUsuario != txtConfirmClaveUsuario) {
                        $('#alertaContra').click();
                        $('#txtClaveUsuario').focus();
                    }
                    else if (pModo == "AGREGAR_ADMIN" && txtClaveUsuario.trim() == "") {
                        $('#txtClaveUsuario').focus();
                        $('#alertaVacios').click();
                    } else {

                        var consulta = {
                            pModo: pModo, pIdUsuario: pIdUsuario, pNombreUsuario: txtNombreUsuario, pApellidosUsuario: txtApellidosUsuario, pDescripcionUsuario: txtDescripcionUsuario, pCorreoUsuario: txtCorreoUsuario,
                            pClaveUsuario: txtClaveUsuario, pImagenUsuario: txtImagenUsuario, pOpcionNotificacion: txtOpcionNotificacion, pIdRol: txtIdRol, pEstadoUsuario: txtEstadoUsuario, pUsuarioCreacion: pUsuarioCreacion,
                            pUsuarioModificacion: pUsuarioModificacion
                        };

                        $.ajax({
                            url: '/Admin/MantAdministrador',
                            type: 'POST',
                            data: consulta,

                        }).done(function (response) {
                            if (response == -1000) {
                                $('#correoExiste').click();
                            } else if (response == 1) {
                                $('#exampleModal').modal('toggle');
                                $('#confirmarCreacion').click();



                            } else if (response == 3) {

                                $('#confirmarEliminar').click();
                                $('#modalEliminar').modal('toggle');

                                $.ajax({
                                    url: '/Admin/EliminarImagen',
                                    data: { 'pIdUsuario': regis },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
                                    type: 'POST',

                                }).done(function (response) {

                                    CallUsuariosAdministrador();

                                });
                            }
                            else if (response == 1451) {
                                $('#errorEliminarVinculacion').click();
                            } else {
                                $('#errorGeneral').click();
                            }

                            CallUsuariosAdministrador();

                        });
                    }
                }
            } else {
                $('#correoInvalido').click();
            }
        }
    });
}

function ConfirmarEliminar(idUsuario) {

    $('#modalEliminar').modal('show');
    $("#txtIdUsuario").val(idUsuario);

}

function ModificarModal(pModo, idUsuario) {

    $("#resultado").html('');
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
            CallUsuariosAdministrador();
        } else {
            location.href = "/Home/Index";
        }
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

function ModificarAdmin() {

    var pIdUsuario = $("#txtIdUsuario").val();

    var txtNombreUsuario = $("#txtNombreUsuario").val();
    var txtApellidosUsuario = $("#txtApellidosUsuario").val();
    var txtCorreoUsuario = $("#txtCorreoUsuario").val();

    var pUsuarioCreacion = "";
    var pUsuarioModificacion = "";

    $.ajax({
        url: '/Admin/varSesionCorreo',
        type: 'POST',

    }).done(function (response) {
        pUsuarioCreacion = response;
        pUsuarioModificacion = response;

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

                var datos = new FormData($("#form_admin")[0]);
                datos.append("pModo", "MODIFICAR_ADMIN");
                datos.append("pIdUsuario", pIdUsuario);
                datos.append("txtImagenUsuario", txtImagenUsuario);
                datos.append("pUsuarioCreacion", pUsuarioCreacion);
                datos.append("pUsuarioModificacion", pUsuarioModificacion);

                $.ajax({
                    url: '/Admin/ModificarAdministrador',
                    type: 'POST',
                    data: datos,
                    contentType: false,
                    processData: false,

                }).done(function (response) {
                    if (response == -1000) {
                        $('#correoExiste').click();
                    } else if (response == 2) {
                        $('#exampleModal').modal('toggle');
                        $('#confirmarModificar').click();
                    } else {
                        console.log(response);
                        $('#errorGeneral').click();
                    }
                    CallUsuariosAdministrador();
                });
            } else {
                $('#correoInvalido').click();
            }
        }
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

/* Charlas Usuarios */

function validaAdminCharlaUsuario() {
    $.ajax({
        url: '/Admin/varSesionRol',
        type: 'POST',

    }).done(function (response) {
        var rol = response;
        if (rol == 1) {
            CallCharlasUsuarios();
        } else {
            location.href = "/Home/Index";
        }
    });
}

function CallCharlasUsuarios() {

    $.ajax({
        url: '/Admin/MostrarCharlaUsuario',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);
        CargarTablaCharlaUsuarios(datos);
    });
}

function CargarTablaCharlaUsuarios(Data) {

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
            { data: "nombreUsuario" },
            { data: "apellidosUsuario" },
            { data: "correoUsuario" },

            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="CargarVariablePerfilPublico(\'' + row.idUsuario + '\' ) " >Ver Perfil</button>';

                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="CargarCharlasUsuario( \'' + row.idUsuario + '\' ) " >Charlas</button>';

                }
            },
            {
                render: function (data, type, row, meta) {
                    return '<button class ="btn btn-primary" onclick="AsignarCharlas(\'' + row.idUsuario + '\' ) " >Asignar Charlas</button>';

                }
            }
        ]
    });
}

function CargarCharlasUsuario(pIdUsuario) {

    $('#EliminarModal').modal('show');

    $.ajax({
        url: '/Admin/Cargar_Usuario_Filtrado',
        data: { 'pIdUsuario': pIdUsuario },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);         //trae los datos del usuario del id especifico

        $("#txtIdUsuario").val(pIdUsuario);

        $("#txtNombreUsuarioEliminar").html(datos[0].nombreUsuario + " " + datos[0].apellidosUsuario);
        $("#txtCorreoUsuarioEliminar").html(datos[0].correoUsuario);

        var options = '';
        $.ajax({
            url: '/Admin/CargarCharlasUsuario',
            type: 'POST',
            data: { 'pIdUsuario': pIdUsuario }

        }).done(function (responseCharlas) {
            var datos = JSON.parse(responseCharlas);

            for (var i = 0; i < datos.length; i++) {
                options += '<option value="' + datos[i]['idCharla'] + '">' + datos[i]['nombreCharla'] + '</option>';
            }
            $('#cbCharlasUsuario').html(options);
        });
    });
}

function AsignarCharlas(pIdUsuario) {

    $('#AsignarModal').modal('show');

    $.ajax({
        url: '/Admin/Cargar_Usuario_Filtrado',
        data: { 'pIdUsuario': pIdUsuario },      //envia por parametro el ID del usuario para recibir los datos de ese usuario
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);         //trae los datos del usuario del id especifico

        $("#txtIdUsuario").val(pIdUsuario);
        $("#txtNombreUsuario").html(datos[0].nombreUsuario + " " + datos[0].apellidosUsuario);
        $("#txtCorreoUsuario").html(datos[0].correoUsuario);

        var options = '';
        $.ajax({
            url: '/Charla/Cargar_Tabla_Charlas',
            type: 'POST',

        }).done(function (responseCharlas) {
            var datos = JSON.parse(responseCharlas);

            for (var i = 0; i < datos.length; i++) {
                options += '<option value="' + datos[i]['idCharla'] + '">' + datos[i]['nombreCharla'] + '</option>';
            }
            $('#cbTodasCharlas').html(options);
        });
    });


}

function ConfirmarEliminarVinculacion() {

    $('#modalEliminar').modal('show');
    $('#EliminarModal').modal('toggle');

}

function jsEliminarCharlaUsuario() {

    var txtIdUsuario = $("#txtIdUsuario").val();

    var cbCharlasUsuario = document.getElementById("cbCharlasUsuario");
    var txtCharlasUsuario = cbCharlasUsuario.options[cbCharlasUsuario.selectedIndex].value;

    var consulta = {
        pModo: "ELIMINAR", pIdUsuario: txtIdUsuario, pIdCharla: txtCharlasUsuario, pFinalizado: ""
    };

    $.ajax({
        url: '/Admin/MantCharlaUsuario',
        type: 'POST',
        data: consulta,

    }).done(function (response) {

        if (response == 2) {
            $('#confirmarEliminar').click();
            $('#modalEliminar').modal('toggle');
        } else {
            $('#errorEliminar').click();
            $('#modalEliminar').modal('toggle');
        }
    });
}

function jsAgregarCharlaUsuario() {

    var txtIdCharlaUsuario = $("#txtIdCharlaUsuario").val();
    var txtIdUsuario = $("#txtIdUsuario").val();

    var cbTodasCharlas = document.getElementById("cbTodasCharlas");
    var cbTodasCharlas = cbTodasCharlas.options[cbTodasCharlas.selectedIndex].value;


    var consulta = {
        pModo: "AGREGAR", pIdCharlaUsuario: txtIdCharlaUsuario, pIdUsuario: txtIdUsuario, pIdCharla: cbTodasCharlas, pFinalizado: "No"
    };

    $.ajax({
        url: '/Admin/MantCharlaUsuario',
        type: 'POST',
        data: consulta,

    }).done(function (response) {

        if (response == 1) {

            var consultaVincuVideUsu = {
                pIdUsuario: txtIdUsuario, pIdCharla: cbTodasCharlas
            };

            $.ajax({
                url: '/Admin/VinculacionVideoUsuario',
                type: 'POST',
                data: consultaVincuVideUsu,

            }).done(function (response) {
                $('#confirmarVinculacion').click();
                $('#AsignarModal').modal('toggle');

            });

        } else if (response == 300) {
            $('#charlaYaVinculada').click();
            $('#AsignarModal').modal('toggle');
        } else {
            $('#errorVinculacion').click();
            $('#AsignarModal').modal('toggle');
        }
    });
}
