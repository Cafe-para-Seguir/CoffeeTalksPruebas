
var idRol = "";

function CallInfoUsuario() {

    $.ajax({
        url: '/Admin/varSesionRol',
        type: 'POST',

    }).done(function (response) {
        var rol = response
        if (rol == 1 || rol == 3) {
            idRol = "Usuario";
        } else if (rol == 2) {
            idRol = "Charlista";
        } else {
            location.href = "/Home/Index";
        }

    }).done(function (response) {
        var pIdUsuario = JSON.parse(response);
        $.ajax({
            url: '/Admin/varSesionIdUsuario',
            type: 'POST',

        }).done(function (response) {

            var pIdUsuario = response;

            if (idRol == "Usuario" || idRol == "Charlista") {
                $.ajax({
                    url: '/Admin/Cargar_Usuario_Filtrado',
                    type: 'POST',
                    data: { 'pIdUsuario': pIdUsuario }

                }).done(function (response) {
                    var datos = JSON.parse(response);
                    cargarPerfil(datos, idRol);
                });
            }
        });
    });

}

function cargarPerfil(data, idRol) {
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
    var imagenPerfil = data[0].imagenUsuario;
    

    document.getElementById("imagenPerfil").setAttribute('style', 'display: block; position: relative; overflow: hidden; background-image: url("' + imagenPerfil + '"); background-size: cover; background-position: center center; height: 140px;');
    //document.getElementById("imgUsuario").setAttribute("src", imgUsuario);

    if (idRol == "Usuario") {
        var charlaContexto = "Mis Charlas";

        $.ajax({
            url: '/Admin/Cargar_Cursos_Usuario',
            type: 'POST',
            data: { 'pIdUsuario': pIdUsuario }

        }).done(function (response) {

            var datos = JSON.parse(response);
            cargarPaginacion(datos, 4, "Cursos");
            cargarCursos(1);
        });
    } else {
        var charlaContexto = "Charlas Impartidas";

        $.ajax({
            url: '/Admin/Cargar_Cursos_Charlista',
            type: 'POST',
            data: { 'pIdUsuario': pIdUsuario }

        }).done(function (response) {

            var datos = JSON.parse(response);

            var alternarCharlas = document.createElement('button');
            alternarCharlas.id = 'btn_alternarCharlas';
            alternarCharlas.className = 'btn btn-primary float-right';
            alternarCharlas.setAttribute('onclick', 'alternarCursosCharlista(1, ' + pIdUsuario + ')');
            alternarCharlas.appendChild(document.createTextNode('Mis Charlas'));

            document.getElementById('divBotonAlternar').appendChild(alternarCharlas);

            cargarPaginacion(datos, 4, "CursosCharlista");
            cargarCursosCharlista(1);
        });
    }

    var charlaContextoNode = document.createTextNode(charlaContexto);

    txtCharlaContexto.appendChild(charlaContextoNode);
    txtNombreUsuario.appendChild(nombreUsuarioNode);
    txtDescUsuario.appendChild(descUsuarioNode);
    CallRecetasUsuarioPerfil(pIdUsuario);

}

function cargarPaginacion(data, cantDisplay, tipoDatos) {
    var dataLength = data.length;
    var cantPaginas = dataLength / cantDisplay;
    var ulPaginacion = document.getElementById("ulPaginacion");
    ulPaginacion.parentNode.removeChild(ulPaginacion);

    ulPaginacion = document.createElement('ul');
    ulPaginacion.className = 'pagination pagination-sm';
    ulPaginacion.id = 'ulPaginacion';

    document.getElementById('navPaginacion').appendChild(ulPaginacion);

    ulPaginacion = document.getElementById('ulPaginacion');

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
                liPrimero.setAttribute('onclick', 'cargar' + tipoDatos + '(' + 1 + ')');
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
            liNumero.setAttribute('onclick', 'cargar' + tipoDatos + '(' + x + ')');
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
                liUltimo.setAttribute('onclick', 'cargar' + tipoDatos + '(' + Math.ceil(cantPaginas) + ')');
            }
        }
    }
}

function alternarCursosCharlista(alternacion, idUsuario) {

    if (alternacion == 1) {

        $.ajax({
            url: '/Admin/Cargar_Cursos_Usuario',
            type: 'POST',
            data: { 'pIdUsuario': idUsuario }

        }).done(function (response) {

            var datos = JSON.parse(response);

            $("#txtCharlas").html('');
            $("#btn_alternarCharlas").html('');

            document.getElementById('txtCharlas').appendChild(document.createTextNode('Mis Charlas'));

            document.getElementById('btn_alternarCharlas').setAttribute('onclick', 'alternarCursosCharlista(2, ' + idUsuario + ')');
            document.getElementById('btn_alternarCharlas').appendChild(document.createTextNode('Charlas Impartidas'));

            cargarPaginacion(datos, 4, "Cursos");
            cargarCursos(1);
        });

    } else if (alternacion == 2) {

        $.ajax({
            url: '/Admin/Cargar_Cursos_Charlista',
            type: 'POST',
            data: { 'pIdUsuario': idUsuario }

        }).done(function (response) {

            var datos = JSON.parse(response);

            $("#txtCharlas").html('');
            $("#btn_alternarCharlas").html('');

            document.getElementById('txtCharlas').appendChild(document.createTextNode('Charlas Impartidas'));

            document.getElementById('btn_alternarCharlas').setAttribute('onclick', 'alternarCursosCharlista(1, ' + idUsuario + ')');
            document.getElementById('btn_alternarCharlas').appendChild(document.createTextNode('Mis Charlas'));

            cargarPaginacion(datos, 4, "CursosCharlista");
            cargarCursosCharlista(1);
        });

    }

}

function cargarCursos(pagDisplay) {
    datosXPagina = pagDisplay * 4 - 4;
    $.ajax({
        url: '/Admin/varSesionIdUsuario',
        type: 'POST',

    }).done(function (response) {
        var pIdUsuario = JSON.parse(response);
        $.ajax({
            url: '/Admin/Cargar_Cursos_Usuario',
            type: 'POST',
            data: { 'pIdUsuario': pIdUsuario }

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
                    liUltimo.setAttribute('onclick', 'cargarCursos(' + (pagDisplay + 1) + ')');

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
                    liPrimero.setAttribute('onclick', 'cargarCursos(' + (pagDisplay - 1) + ')');
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

                    $('#txtCurso' + x).html('');
                    var txtCurso = document.getElementById("txtCurso" + x);
                    var imagen = "imagenCharla" + x;
                    var linkImagen = datos[datosXPagina].imagenCharla;
                    txtCurso.appendChild(document.createTextNode(datos[datosXPagina].nombreCharla));
                    document.getElementById("divCurso" + x).style.display = 'block';
                    document.getElementById("divCurso" + x).setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datos[datosXPagina].idCharla) + ')');
                    $("#" + imagen).attr('src', linkImagen);
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

function cargarCursosCharlista(pagDisplay) {
    datosXPagina = pagDisplay * 4 - 4;
    $.ajax({
        url: '/Admin/varSesionIdUsuario',
        type: 'POST',

    }).done(function (response) {
        var pIdUsuario = JSON.parse(response);
        $.ajax({
            url: '/Admin/Cargar_Cursos_Charlista',
            type: 'POST',
            data: { 'pIdUsuario': pIdUsuario }

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
                    liUltimo.setAttribute('onclick', 'cargarCursosCharlista(' + (pagDisplay + 1) + ')');

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
                    liPrimero.setAttribute('onclick', 'cargarCursosCharlista(' + (pagDisplay - 1) + ')');
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

                    $('#txtCurso' + x).html('');
                    var txtCurso = document.getElementById("txtCurso" + x);
                    var imagen = "imagenCharla" + x;
                    var linkImagen = datos[datosXPagina].imagenCharla;
                    txtCurso.appendChild(document.createTextNode(datos[datosXPagina].nombreCharla));
                    document.getElementById("divCurso" + x).style.display = 'block';
                    document.getElementById("divCurso" + x).setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datos[datosXPagina].idCharla) + ')');
                    $("#" + imagen).attr('src', linkImagen);
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

function CallRecetasUsuarioPerfil(pIdUsuario) {

    $.ajax({
        url: '/Receta/Cargar_Receta_Usuario',
        type: 'POST',
        data: { 'pIdUsuario': pIdUsuario }

    }).done(function (response) {
        var datos = JSON.parse(response);

        CargarRecetas(datos)

    });
}

function MostrarRecetasUsuario(data) {
    var dataLength = data.length;
    if (dataLength > 0) {
        $('#modalRecetas').modal('show');
        for (x = 0; x < dataLength; x = x + 1) {
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

function llamaContenido() {
    llenaCharlasRecientes();
    llenaCategoria();
    charlistas();
    charlasMV();
}

function llenaCharlasRecientes() {
    $.ajax({
        url: '/Admin/sp_MostrarCharlaReciente',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);

        var dataLength = datos.length;

        if (dataLength == 3) {

            for (x = 0; x < 3; x++) {
                var nombrecatCN = "categoriaCN" + (x + 1);
                var nombreCharlaN = "nombreCN" + (x + 1);
                var imagenCR = "imagenCN" + (x + 1);
                

                var nombreCateCharlaN = document.getElementById(nombrecatCN);
                var nombreCharlaN = document.getElementById(nombreCharlaN);

                var nombreCatesCN = document.createTextNode(datos[x].nombreCharla);
                var nombreCN = document.createTextNode(datos[x].nombreCategoria);
                var imagen1 = datos[x].imagenCharla;

                nombreCateCharlaN.appendChild(nombreCatesCN);
                nombreCharlaN.appendChild(nombreCN);

                document.getElementById("CharlaReciente" + (x + 1)).setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datos[x].idCharla) + ')');
                $("#" + imagenCR).attr('src', imagen1);

            }
        } else if (dataLength < 3) {
            for (x = 0; x < dataLength; x = x + 1) {
                var nombrecatCN = "categoriaCN" + (x + 1);
                var nombreCharlaN = "nombreCN" + (x + 1);
                var imagenCR = "imagenCN" + (x + 1);

                var nombreCateCharlaN = document.getElementById(nombrecatCN);
                var nombreCharlaN = document.getElementById(nombreCharlaN);

                var nombreCatesCN = document.createTextNode(datos[x].nombreCharla);
                var nombreCN = document.createTextNode(datos[x].nombreCategoria);
                var imagen1 = datos[x].imagenCharla;

                nombreCateCharlaN.appendChild(nombreCatesCN);
                nombreCharlaN.appendChild(nombreCN);

                document.getElementById("CharlaReciente" + (x + 1)).setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datos[x].idCharla) + ')');
                $("#" + imagenCR).attr('src', imagen1);
            }
            for (x = dataLength; x < 3; x++) {
                var id = "CharlaReciente" + (x + 1);
                document.getElementById(id).style.display = "none";
            }
        }
    });
}

function llenaCategoria() {

    $.ajax({
        url: '/Admin/Cargar_Mostar_categorias',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);
        
        var dataLength = datos.length;
        if (dataLength >= 9) {
            for (x = 0; x < 9; x++) {
                var nombrecat = "nombreCat" + (x + 1);
                var nombrecate = "nombreCate" + (x + 1);
                var descripCate = "descripCate" + (x + 1);
                var imagenCate = "imagen" + (x + 1);
                var imagenInterC = "imagenInter" + (x + 1);

                var nombreCate1 = document.getElementById(nombrecat);
                var nombreCateCuadro1 = document.getElementById(nombrecate);
                var descripCate1 = document.getElementById(descripCate);
                
                var nombreCates1 = document.createTextNode(datos[x].nombreCategoria);
                var nombreCateCuadros1 = document.createTextNode(datos[x].nombreCategoria);
                var descripCates1 = document.createTextNode(datos[x].descripcionCategoria);
                var imagen2 = datos[x].imagenCategoria;
                var imagen2Inter = datos[x].imagenCategoria;

                nombreCate1.appendChild(nombreCates1);
                nombreCateCuadro1.appendChild(nombreCateCuadros1);
                descripCate1.appendChild(descripCates1);
                $("#" + imagenCate).attr('src', imagen2);
                $("#" + imagenInterC).attr('src', imagen2Inter);
                /*Fin primera fila*/
            }

        } else if (dataLength < 9) {
            for (x = 0; x < dataLength; x = x + 1) {
                /*primera fila */
                var nombrecat = "nombreCat" + (x + 1);
                var nombrecate = "nombreCate" + (x + 1);
                var descripCate = "descripCate" + (x + 1);
                var imagenCate = "imagen" + (x + 1);
                var imagenInterC = "imagenInterC" + (x + 1);

                var nombreCate1 = document.getElementById(nombrecat);
                var nombreCateCuadro1 = document.getElementById(nombrecate);
                var descripCate1 = document.getElementById(descripCate);

                var nombreCates1 = document.createTextNode(datos[x].nombreCategoria);
                var nombreCateCuadros1 = document.createTextNode(datos[x].nombreCategoria);
                var descripCates1 = document.createTextNode(datos[x].descripcionCategoria);
                var imagen2 = datos[x].imagenCategoria;
                var imagen2Inter = datos[x].imagenCategoria;

                nombreCate1.appendChild(nombreCates1);
                nombreCateCuadro1.appendChild(nombreCateCuadros1);
                descripCate1.appendChild(descripCates1);

                $("#" + imagenCate).attr('src', imagen2);
                $("#" + imagenInterC).attr('src', imagen2Inter);
                /*Fin primera fila*/
            }
            for (x = dataLength; x < 9; x++) {
                var id = "categorias" + (x + 1);

                document.getElementById(id).style.display = "none";
            }
        }
    });
}

function charlasMV() {//charlas mejor valoradas
    $.ajax({
        url: '/Admin/Cargar_Mostar_Charla',
        type: 'POST',

    }).done(function (response) {

        var datos = JSON.parse(response);
        var dataLength = datos.length;
        
        if (dataLength >= 4) {
            for (x = 0; x < 4; x++) {
                
                var nombreCharlaMV = "nombreCharlaMV" + (x + 1);
                var nombreCharlistasMV = "nombreCharlistaMV" + (x + 1);
                var a = "A" + (x + 1);
                
                var fotoCharlaInter = "fotoCharlaMVInter" + (x + 1);
                var nombreCharlInter = "nombreCharlaMVInter" + (x + 1);
                var nombreCharlistaInter = "charlistaMVinter" + (x + 1);
                var descripcionCharlistaMV = "descripCharlaMV" + (x + 1);
                var dificultad = "nivelDifi" + (x + 1);
                var nivel = "nivel" + (x + 1);

                var VT1 = "VTA" + (x + 1);
                var VT2 = "VTB" + (x + 1);
                var VT3 = "VTC" + (x + 1);
                var VT4 = "VTD" + (x + 1);
                var VT5 = "VTE" + (x + 1);

               
                var nombreCharlaMV1 = document.getElementById(nombreCharlaMV);
                var nombreCharlistasMV1 = document.getElementById(nombreCharlistasMV);
                
                var nombreCharlInter1 = document.getElementById(nombreCharlInter);
                var nombreCharlistaInter1 = document.getElementById(nombreCharlistaInter);
                var descripcionCharlistaMV1 = document.getElementById(descripcionCharlistaMV);
                var dificultad1 = document.getElementById(dificultad);
                var nivel1 = document.getElementById(nivel);
                
                var imagen1 = datos[x].imagenCharla;
                var imagen2 = datos[x].imagenCharla;
                document.getElementById(a).setAttribute('style', 'display: block; position: relative; overflow: hidden; background-image: url("' + imagen1+'"); background-size: cover; background-position: center center; height: 140px;');
                /****************************************************************** */

                var nombreCharlaMV2 = document.createTextNode(datos[x].nombreCharla);
                var nombreCharlistasMV2 = document.createTextNode(datos[x].nombreUsuario + " " + datos[x].apellidosUsuario);

                var nombreCharlInter2 = document.createTextNode(datos[x].nombreCharla);
                var nombreCharlistaInter2 = document.createTextNode(datos[x].nombreUsuario + " " + datos[x].apellidosUsuario);
                var descripcionCharlistaMV2 = document.createTextNode(datos[x].descripcionCharla);
                var dificultad2 = document.createTextNode(datos[x].nivelCharla);
                var nivel2 = document.createTextNode(datos[x].nivelCharla);
                var datoValorTotal = datos[x].valoracionCharla;

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
               

                //parte externa 
                nombreCharlaMV1.appendChild(nombreCharlaMV2);
                nombreCharlistasMV1.appendChild(nombreCharlistasMV2);
                nivel1.appendChild(nivel2);

                document.getElementById('CharlaDetalle' + x).setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datos[x].idCharla) + ')');
                

                //parte interna
                nombreCharlInter1.appendChild(nombreCharlInter2);
                nombreCharlistaInter1.appendChild(nombreCharlistaInter2);
                descripcionCharlistaMV1.appendChild(descripcionCharlistaMV2);
                dificultad1.appendChild(dificultad2);
               
                $("#" + fotoCharlaInter).attr('src', imagen2);

            }
        } else if (dataLength < 4) {
            for (x = 0; x < dataLength; x = x + 1) {
                
                var nombreCharlaMV = "nombreCharlaMV" + (x + 1);
                var nombreCharlistasMV = "nombreCharlistaMV" + (x + 1);

                var fotoCharlaInter = "fotoCharlaMVInter" + (x + 1);
                var nombreCharlInter = "nombreCharlaMVInter" + (x + 1);
                var nombreCharlistaInter = "charlistaMVinter" + (x + 1);
                var descripcionCharlistaMV = "descripCharlaMV" + (x + 1);
                var dificultad = "nivelDifi" + (x + 1);
                var nivel = "nivel" + (x + 1);

                var nombreCharlaMV1 = document.getElementById(nombreCharlaMV);
                var nombreCharlistasMV1 = document.getElementById(nombreCharlistasMV);

                var nombreCharlInter1 = document.getElementById(nombreCharlInter);
                var nombreCharlistaInter1 = document.getElementById(nombreCharlistaInter);
                var descripcionCharlistaMV1 = document.getElementById(descripcionCharlistaMV);
                var dificultad1 = document.getElementById(dificultad);
                var nivel1 = document.getElementById(nivel);
                var imagen1 = datos[x].imagenCategoria;
                var imagen2 = datos[x].imagenCategoria;

                /****************************************************************** */

                //var fotoCharla2 = document.createTextNode(datos[x].nombreCategoria);
                var nombreCharlaMV2 = document.createTextNode(datos[x].nombreCharla);
                var nombreCharlistasMV2 = document.createTextNode(datos[x].nombreUsuario + " " + datos[x].apellidosUsuario);

                /*var fotoCharlaInter2 = document.createTextNode(datos[x].descripcionCategoria);*/
                var nombreCharlInter2 = document.createTextNode(datos[x].nombreCharla);
                var nombreCharlistaInter2 = document.createTextNode(datos[x].nombreUsuario + " " + datos[x].apellidosUsuario);
                var descripcionCharlistaMV2 = document.createTextNode(datos[x].descripcionCharla);
                var dificultad2 = document.createTextNode(datos[x].nivelCharla);
                var nivel2 = document.createTextNode(datos[x].nivelCharla);

                //parte externa 
                nombreCharlaMV1.appendChild(nombreCharlaMV2);
                nombreCharlistasMV1.appendChild(nombreCharlistasMV2);
                nivel1.appendChild(nivel2);
                document.getElementById(a).setAttribute('style', 'display: block; position: relative; overflow: hidden; background-image: url("' + imagen1 + '"); background-size: cover; background-position: center center; height: 140px;');
                //document.getElementById('CharlaDetalle' + x).setAttribute('onclick', 'CargarPagCharlaDetalle(' + (datos[x].idCharla) + ')');

                //parte interna
                nombreCharlInter1.appendChild(nombreCharlInter2);
                nombreCharlistaInter1.appendChild(nombreCharlistaInter2);
                descripcionCharlistaMV1.appendChild(descripcionCharlistaMV2);
                dificultad1.appendChild(dificultad2);
                
                $("#" + fotoCharlaInter).attr('src', imagen2);
            }
            for (x = dataLength; x < 4; x++) {
                var id = "CharlasMV" + (x + 1);

                document.getElementById(id).style.display = "none";
            }
        }
    });
}

function charlistas() {
    $.ajax({
        url: '/Admin/Cargar_Mostar_charlistas',
        type: 'POST',

    }).done(function (response) {
        var datos = JSON.parse(response);

        var dataLength = datos.length;
        if (dataLength == 6) {
            for (x = 0; x < 6; x++) {
                var nombreCharlista = "nombreCharlista" + (x + 1);
                var nivel = "iniciales" + (x + 1);
                var descripCharlista = "descripCharlista" + (x + 1);

                var nombreCharlistaC = document.getElementById(nombreCharlista);
                var nivel1 = document.getElementById(nivel);
                var descripCharlistaC = document.getElementById(descripCharlista);
                //var imagenCate1 = document.getElementById("imagen1");

                //imagenCate.setAttribute('src', '~/images/paths/cafe40x40.png');

                var nombreCharlistas = document.createTextNode(datos[x].nombreUsuario + " " + datos[x].apellidosUsuario);

                var descripCharlistas = document.createTextNode(datos[x].descripcionUsuario);
                var nivel2 = document.createTextNode(datos[x].nombreUsuario.substring(0, 1) + " " + datos[x].apellidosUsuario.substring(0, 1));

                nombreCharlistaC.appendChild(nombreCharlistas);
                descripCharlistaC.appendChild(descripCharlistas);
                nivel1.appendChild(nivel2);

                nombreCharlistaC.setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[x].idUsuario + ')');
                nivel1.setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[x].idUsuario + ')');
            }
        } else if (dataLength < 6) {
            for (x = 0; x < dataLength; x++) {
                var nombreCharlista = "nombreCharlista" + (x + 1);
                var nivel = "iniciales" + (x + 1);
                var descripCharlista = "descripCharlista" + (x + 1);

                var nombreCharlistaC = document.getElementById(nombreCharlista);
                var nivel1 = document.getElementById(nivel);
                var descripCharlistaC = document.getElementById(descripCharlista);
                //var imagenCate1 = document.getElementById("imagen1");

                //imagenCate.setAttribute('src', '~/images/paths/cafe40x40.png');

                var nombreCharlistas = document.createTextNode(datos[x].nombreUsuario + " " + datos[x].apellidosUsuario);

                var descripCharlistas = document.createTextNode(datos[x].descripcionUsuario);
                var nivel2 = document.createTextNode(datos[x].nombreUsuario.substring(0, 1) + " " + datos[x].apellidosUsuario.substring(0, 1));

                nombreCharlistaC.appendChild(nombreCharlistas);
                descripCharlistaC.appendChild(descripCharlistas);
                nivel1.appendChild(nivel2);

                nombreCharlistaC.setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[x].idUsuario + ')');
                nivel1.setAttribute('onclick', 'CargarVariablePerfilPublico(' + datos[x].idUsuario + ')');
            }
            for (x = dataLength; x < 6; x++) {
                var id = "Charlas" + (x + 1);
                var flecha = "flechaderecha";
                document.getElementById(id).style.display = "none";
                document.getElementById(flecha).style.display = "none";
            }
        }
    });
}

function CargarRecetas(data) {

    var ulRecetas = document.getElementById("toc-content-2");

    if (data.length == 0) {
        var NombreReceta = document.createTextNode('No tienes recetas registradas, comparte tus ideas!');

        var ElementoLista = document.createElement('li');
        ElementoLista.className = 'accordion__menu-link';

        var ElementoA = document.createElement('a');
        ElementoA.className = 'flex';
        ElementoA.setAttribute("href", "#");
        ElementoA.setAttribute("onclick", "MostrarCampoRecetas()");

        ulRecetas.appendChild(ElementoLista);
        ElementoLista.appendChild(ElementoA);
        ElementoA.appendChild(NombreReceta);

    } else {

        for (x = 0; x < data.length; x++) {

            var NombreReceta = document.createTextNode(data[x].nombreReceta);

            var ElementoLista = document.createElement('li');
            ElementoLista.className = 'accordion__menu-link';

            var ElementoA = document.createElement('a');
            ElementoA.className = 'flex';
            ElementoA.id = data[x].idReceta;
            ElementoA.setAttribute("href", "#");
            ElementoA.setAttribute("onclick", "ModificarModalRecetas(2," + data[x].idReceta + ")");

            var textoClick = document.createTextNode('Click para editar');

            var ElementoSpanC = document.createElement('span');
            ElementoSpanC.className = 'text-muted';
            ElementoSpanC.appendChild(textoClick);

            ulRecetas.appendChild(ElementoLista);
            ElementoLista.appendChild(ElementoA);
            ElementoA.appendChild(NombreReceta);
            ElementoLista.appendChild(ElementoSpanC);
        }

        if (data.length == 1) {

            for (x = 0; x < 2; x++) {
                var NombreReceta = document.createTextNode('Puedes agregar más recetas, comparte tus ideas!');

                var ElementoLista = document.createElement('li');
                ElementoLista.className = 'accordion__menu-link';

                var ElementoA = document.createElement('a');
                ElementoA.className = 'flex';

                ulRecetas.appendChild(ElementoLista);
                ElementoLista.appendChild(ElementoA);
                ElementoA.appendChild(NombreReceta);
                ElementoA.setAttribute("href", "#");
                ElementoA.setAttribute("onclick", "MostrarCampoRecetas()");
            }

        } else if (data.length == 2) {
            var NombreReceta = document.createTextNode('Puedes agregar más recetas, comparte tus ideas!');

            var ElementoLista = document.createElement('li');
            ElementoLista.className = 'accordion__menu-link';

            var ElementoA = document.createElement('a');
            ElementoA.className = 'flex';

            ulRecetas.appendChild(ElementoLista);
            ElementoLista.appendChild(ElementoA);
            ElementoA.appendChild(NombreReceta);
            ElementoA.setAttribute("href", "#");
            ElementoA.setAttribute("onclick", "MostrarCampoRecetas()");
        }
    }
}


///////////////////CALCULADORA//////////////////////////

function calcBotones(maquina) {

    var activeId = document.querySelector('[id$="Active"]').id;

    if (activeId != ('bn' + maquina + 'Active')) {

        var activeElement = document.getElementById(activeId);

        activeElement.setAttribute('class', 'btn btn-outline-primary btnResponsive');
        activeElement.id = activeId.slice(0, activeId.length - 6);

        activeDisplay = document.getElementById(activeId.slice(2, activeId.length - 6));
        activeDisplay.className = 'collapse';

        activeElement = document.getElementById('bn' + maquina);
        activeElement.id = 'bn' + maquina + 'Active';
        activeElement.setAttribute('class', 'btn btn-outline-primary btnResponsive active');

        activeDisplay = document.getElementById(maquina);
        activeDisplay.className = 'collapse show';


    }

}

function calcRadios(maquina) {

    calcularMedida();

    var activeId = document.querySelector('[id$="ActiveRd"]').id;

    if (activeId != ('rd' + maquina + 'ActiveRd')) {

        var activeElement = document.getElementById(activeId);

        activeElement.setAttribute('class', 'btnResponsive btn btn-outline-primary float-right');
        activeElement.id = activeId.slice(0, activeId.length - 8);

        activeElement = document.getElementById('rd' + maquina);
        activeElement.id = 'rd' + maquina + 'ActiveRd';
        activeElement.setAttribute('class', 'btnResponsive btn btn-outline-primary float-right active');

    }



}

function tipoMedida() {

    var medida = document.getElementById("slcMedida").value;

    if (medida == '2') {
        $('#labelMedidaResult').html('Cucharadas a utilizar (7g/Cdu): ');
        calcularMedida();
    } else {
        $('#labelMedidaResult').html('Gramos de café utilizar: ');
        calcularMedida();
    }

}

function calcularMedida() {

    var gramosCafe = 0.0;
    var mlAgua = 0;
    var tiempoExtracion = "";

    var radios = document.getElementsByName('selectMaquina');

    for (var i = 0, length = radios.length; i < length; i++) {
        if (radios[i].checked) {

            var maquina = radios[i].value;

            break;
        }
    }




    var tipoGrano = document.getElementById("slcTipoGrano").value;

    if (tipoGrano == 2) {
        if (maquina == 'Aeropress') {
            tiempoExtracion = "1:00"
        } else if (maquina == 'V60' || maquina == 'Chorreador') {
            tiempoExtracion = "3:00"
        } else if (maquina == 'Vandola' || maquina == 'PrensaFrancesa' || maquina == 'Chemex') {
            tiempoExtracion = "4:00"
        } else if (maquina == 'CoffeeMaker') {
            tiempoExtracion = "5:00"
        } 
    } else {
        if (maquina == 'Aeropress') {
            tiempoExtracion = "2:00"
        } else if (maquina == 'V60') {
            tiempoExtracion = "3:00"
        } else if (maquina == 'Chorreador') {
            tiempoExtracion = "4:00"
        } else if (maquina == 'CoffeeMaker' || maquina == 'Vandola' || maquina == 'Chemex') {
            tiempoExtracion = "5:00"
        } else if (maquina == 'PrensaFrancesa') {
            tiempoExtracion = "6:00"
        } 
    }

    var tipoCafe = document.getElementById("slcTipoCafe").value;

    if (tipoCafe == 1) {
        gramosCafe = 8.3;
    } else if (tipoCafe == 2) {
        gramosCafe = 10.0;
    } else {
        gramosCafe = 11.5;
    }

    var tasasCafe = document.getElementById('tasasCafe').value

    gramosCafe = (gramosCafe * tasasCafe).toFixed(1);
    mlAgua = 150 * tasasCafe;

    var medida = document.getElementById("slcMedida").value;

    if (medida == 2) {
        gramosCafe = (gramosCafe / 7).toFixed(1);
    }

    $('#MedidaResult').html(gramosCafe);
    $('#aguaResult').html(mlAgua);
    $('#tiempoResult').html(tiempoExtracion);


}