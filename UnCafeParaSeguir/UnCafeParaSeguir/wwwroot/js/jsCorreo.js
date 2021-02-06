/*
function EnviarCorreo() {

    var cod = makeid(5);

    $.ajax({
        url: '/Correos/EnviarCorreoUsuarios',
        type: 'POST',
        data: { 'cod': cod },

    }).done(function (response) {

    });
}
*/

String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
}
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, "");
}
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, "");
}

function GenerarCorreo(opc, correo, charla) {

    var CorreoDestino = "";
    var AsuntoCorreo = "";
    var CuerpoCorreo = "";

    if (opc == 1) { //correo de asignación de charla
        CorreoDestino = correo;
        AsuntoCorreo = "Charla asignada";
        CuerpoCorreo = "Se le ha asignado la charla: " + charla;

        var data = {
            CorreoDestino: CorreoDestino, AsuntoCorreo: AsuntoCorreo, CuerpoCorreo: CuerpoCorreo
        };

        $.ajax({
            url: '/Correos/EnviarCorreoUsuarios',
            type: 'POST',
            data: data,

        }).done(function (response) {

        });
    }
    else if (opc == 2) { //correo de confirmación de compra

        AsuntoCorreo = "Compra realizada";
        CuerpoCorreo = "Compra de la charla: '" + charla + "' realizada correctamente";

        $.ajax({
            url: '/Admin/varSesionCorreo',
            type: 'POST',

        }).done(function (response) {

            CorreoDestino = response;

            var data = {
                CorreoDestino: CorreoDestino, AsuntoCorreo: AsuntoCorreo, CuerpoCorreo: CuerpoCorreo
            };

            $.ajax({
                url: '/Correos/EnviarCorreoUsuarios',
                type: 'POST',
                data: data,

            }).done(function (response) {
               
            });
        });
    }
}

function CorreoContacto() {

    var datos = new FormData($("#Form_Contacto")[0]);

    var NomUsuario = datos.get("NomUsuario");
    var CorreoUsuario = datos.get("CorreoUsuario");
    var AsuntoCorreo = datos.get("AsuntoCorreo");
    var MensajeCorreo = datos.get("MensajeCorreo");

    if (NomUsuario == "" || CorreoUsuario == "" || AsuntoCorreo == "" || MensajeCorreo == "") {

        $('#alertaVacios').click();

    } else {

        $.ajax({

            url: '/Correos/CorreoContacto',
            type: 'POST',
            data: datos,
            contentType: false,
            processData: false,

        }).done(function (response) {

            if (response == 1) {
                //notificación correo enviado
                $('#alertaCorreoEnviado').click();
                $("#NomUsuario").val("");
                $("#CorreoUsuario").val("");
                $("#AsuntoCorreo").val("");
                $("#MensajeCorreo").val("");

            } else {
                //notificación correo NO enviado
                $('#ErrorCorreoEnviado').click();
            }
        });
    }
}

function crearCodigo(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function verificaCodigoCorreo() {

    var txtCorreoVerificacion = $("#correoVerificacion").val();
    var txtCodigoVerificacion = $("#codigoVerificacion").val();

    var consulta = {
        correoVerificacion: txtCorreoVerificacion, codigoVerificacion: txtCodigoVerificacion, tipoCodigo: 1
    }

    $.ajax({
        url: '/Correos/VerificaCorreo_CodigoUsuario',
        type: 'POST',
        data: { 'correoVerificacion': txtCorreoVerificacion }

    }).done(function (response) {

        if (response == 1) {

            $.ajax({
                url: '/Correos/VerificaCodigoCorreo',
                type: 'POST',
                data: consulta

            }).done(function (response) {

                if (response == 1) {

                    var consulta = {
                        correo: txtCorreoVerificacion, codigo: txtCodigoVerificacion, tipoCodigo: 1, pModo: 'ELIMINAR'
                    };

                    $.ajax({
                        url: '/Correos/MantCodigoUsuario',
                        type: 'POST',
                        data: consulta
                    }).done(function (response) {

                        $('#modalCuentaVerificada').modal('toggle');
                    });

                } else {

                    $('#datosIncorrectos').click();
                }
            });
        } else {

            $('#datosIncorrectos').click();

        }
    });
}

function reenviarCodigoCorreo() {

    var sujeto = "Cambio de Contraseña Coffee Talks";
    var contenido = "Tu nuevo codigo de verificacion de usuario es:";
    var cierre = "Si no has solicitado un cambio de contraseña porfavor ignora este correo"

    var txtCorreoVerificacion = $("#correoVerificacion").val();

    var consulta = {
        correoVerificacion: txtCorreoVerificacion, tipoCodigo: 1
    };

    $.ajax({
        url: '/Correos/VerificaCorreo_CodigoUsuario',
        type: 'POST',
        data: consulta

    }).done(function (response) {

        if (response == 1) {

            var consulta = {
                correo: txtCorreoVerificacion, tipoCodigo: 1, pModo: 'MODIFICAR', sujeto: sujeto, contenido: contenido, cierre: cierre
            };

            $.ajax({
                url: '/Correos/CrearCorreo',
                type: 'POST',
                data: consulta

            }).done(function (response) {

                if (response == 1) {

                    $('#correoReenviado').click();

                }
            });
        } else {

            $('#datosIncorrectos').click();
        }
    });

}

function enviarCodigoContra() {

    var txtCorreoVerificacion = $("#correoVerificacion").val();

    var consulta = {
        correoVerificacion: txtCorreoVerificacion, tipoCodigo: 2
    };

    $.ajax({
        url: '/Correos/VerificaCorreo_Usuario',
        type: 'POST',
        data: { 'correoVerificacion': txtCorreoVerificacion }

    }).done(function (response) {

        if (response == 1) {

            $.ajax({
                url: '/Correos/VerificaCorreo_CodigoUsuario',
                type: 'POST',
                data: consulta

            }).done(function (response) {

                if (response == 1) {

                    var sujeto = "Cambio de Contraseña Coffee Talks";
                    var contenido = "Tu nuevo codigo de cambio de contraseña es :";
                    var cierre = "Este codigo es valido por un periodo de una hora desde la creeacion del codigo original, \n si no haz solicitado un cambio y posees probelmas al Iniciar Sesion puedes comunicarte con Administracion"

                    var consulta = {
                        correo: txtCorreoVerificacion, tipoCodigo: 2, pModo: 'MODIFICAR', sujeto: sujeto, contenido: contenido, cierre: cierre
                    };

                    $.ajax({
                        url: '/Correos/CrearCorreo',
                        type: 'POST',
                        data: consulta

                    }).done(function (response) {

                        $('#correoReenviado').click();

                        document.getElementById("correoVerificacion").readOnly = true;

                        document.getElementById('divCodigo').setAttribute('style', 'display: inline');

                        document.getElementById('olvidoContraBn2').setAttribute('style', 'display: inline');
                        document.getElementById('olvidoContraBn3').setAttribute('style', 'display: none');
                        document.getElementById('olvidoContraBn4').setAttribute('style', 'display: inline');

                    });

                } else {

                    var sujeto = "Cambio de Contraseña Coffee Talks";
                    var contenido = "Tu codigo de cambio de contraseña es:";
                    var cierre = "Este codigo es valido por un periodo de una hora, \n si no haz solicitado un cambio y posees probelmas al Iniciar Sesion puedes comunicarte con Administracion"

                    var consulta = {
                        correo: txtCorreoVerificacion, tipoCodigo: 2, pModo: 'AGREGAR', sujeto: sujeto, contenido: contenido, cierre: cierre
                    };

                    $.ajax({
                        url: '/Correos/CrearCorreo',
                        type: 'POST',
                        data: consulta

                    }).done(function (response) {

                        $('#correoEnviado').click();

                        document.getElementById("correoVerificacion").readOnly = true;

                        document.getElementById('divCodigo').setAttribute('style', 'display: inline');

                        document.getElementById('olvidoContraBn2').setAttribute('style', 'display: inline');
                        document.getElementById('olvidoContraBn3').setAttribute('style', 'display: none');
                        document.getElementById('olvidoContraBn4').setAttribute('style', 'display: inline');

                    });
                }
            });
        } else {

            $('#correoIncorrecto').click();

        }
    });
}

function verificaCodigoContra() {

    var txtCorreoVerificacion = $("#correoVerificacion").val();
    var txtCodigoVerificacion = $("#codigoVerificacion").val();

    var consulta = {
        correoVerificacion: txtCorreoVerificacion, codigoVerificacion: txtCodigoVerificacion, tipoCodigo: 2
    }

    $.ajax({
        url: '/Correos/VerificaCodigoContra',
        type: 'POST',
        data: consulta

    }).done(function (response) {

        if (response == 1) {

            $('#introContraNueva').click();

            document.getElementById("codigoVerificacion").readOnly = true;

            document.getElementById('divContra1').setAttribute('style', 'display: inline');
            document.getElementById('divContra2').setAttribute('style', 'display: inline');

            document.getElementById('olvidoContraBn1').setAttribute('style', 'display: inline');
            document.getElementById('olvidoContraBn2').setAttribute('style', 'display: none');
            document.getElementById('olvidoContraBn3').setAttribute('style', 'display: none');
            document.getElementById('olvidoContraBn4').setAttribute('style', 'display: none');

        } else {

            $('#codigoIncorrecto').click();
        }

    });


}

function cambiarContra() {

    var txtCorreoVerificacion = $("#correoVerificacion").val();
    var txtCodigoVerificacion = $("#codigoVerificacion").val();
    var txtClaveUsuario = $("#txtClaveUsuario").val();
    var txtConfirmClaveUsuario = $("#txtConfirmClaveUsuario").val();

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
                correoVerificacion: txtCorreoVerificacion, codigoVerificacion: txtCodigoVerificacion, tipoCodigo: 2
            }

            $.ajax({
                url: '/Correos/VerificaCodigoContra',
                type: 'POST',
                data: consulta

            }).done(function (response) {

                if (response == 1) {

                    var consulta = {
                        pCorreoUsuario: txtCorreoVerificacion
                    };

                    $.ajax({
                        url: '/Admin/Verifica_Correo',  //trae el id del correo ingresado
                        type: 'POST',
                        data: consulta,

                    }).done(function (response) {

                        var datos = JSON.parse(response);
                        var idUsuario = datos[0].idUsuario;

                        var consulta = { pIdUsuario: idUsuario, pClaveUsuario: txtClaveUsuario, pUsuarioModificacion: txtCorreoVerificacion };
                        $.ajax({
                            url: '/Admin/jsMantClave',  //envia por parametro la nueva contraseña para ser actualizada en la base de datos
                            type: 'POST',
                            data: consulta,

                        }).done(function (response) {

                            var consulta = {
                                correo: txtCorreoVerificacion, codigo: txtCodigoVerificacion, tipoCodigo: 2, pModo: 'ELIMINAR'
                            };

                            $.ajax({
                                url: '/Correos/MantCodigoUsuario',
                                type: 'POST',
                                data: consulta
                            }).done(function (response) {

                                $('#modalContraModificada').modal('toggle');

                                document.getElementById("correoVerificacion").readOnly = false;
                                document.getElementById("codigoVerificacion").readOnly = false;

                                document.getElementById('divContra1').setAttribute('style', 'display: none');
                                document.getElementById('divContra2').setAttribute('style', 'display: none');
                                document.getElementById('divCodigo').setAttribute('style', 'display: none');

                                document.getElementById('correoVerificacion').value = "";
                                document.getElementById('codigoVerificacion').value = "";
                                document.getElementById('txtClaveUsuario').value = "";
                                document.getElementById('txtConfirmClaveUsuario').value = "";

                                document.getElementById('olvidoContraBn1').setAttribute('style', 'display: none');
                                document.getElementById('olvidoContraBn2').setAttribute('style', 'display: none');
                                document.getElementById('olvidoContraBn3').setAttribute('style', 'display: inline');
                                document.getElementById('olvidoContraBn4').setAttribute('style', 'display: none');

                            });
                        });
                    });

                } else {

                    $('#codigoIncorrecto').click();
                }

            });
        }
    }
}
