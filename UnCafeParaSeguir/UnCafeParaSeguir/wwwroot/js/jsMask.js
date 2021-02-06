
function DinamicMenu() {   //pasar a andres

    $.ajax({
        url: '/Admin/varSesionRol',
        type: 'POST',

    }).done(function (response) {
        var rolValid = response;

        if (rolValid == "") {

            $("#btnIS").addClass("btn btn-outline-white");
            $("#btnIS").attr("href", "/Home/InicioSesion");
            $("#btnIS").html("Iniciar Sesión");

            $("#btnRG").addClass("btn btn-outline-white");
            $("#btnRG").attr("href", "/Home/Registro");
            $("#btnRG").html("Registrarse");

        } else {

            var aPerfil = document.getElementById("btnIS");
            var spanPerfilup = document.createElement("span");
            var spanPerfil = document.createElement("span");
            var iPerfil = document.createElement("i");
            var iconBox = document.createTextNode("account_box");

            spanPerfilup.className = "avatar avatar-sm mr-8pt2";
            spanPerfil.className = 'avatar-title rounded-circle';
            spanPerfil.setAttribute('style', 'background-color: rgba(0, 0, 0, 0.0);');
            iPerfil.className = 'material-icons';

            aPerfil.setAttribute("href", "/Home/Perfil");

            aPerfil.appendChild(spanPerfilup);
            spanPerfilup.appendChild(spanPerfil);
            spanPerfil.appendChild(iPerfil);
            iPerfil.appendChild(iconBox);

            $("#btnRG").addClass("btn btn-outline-white");
            $("#btnRG").attr("href", "#");
            $("#btnRG").attr("onclick", "CerrarSesion()");
            $("#btnRG").html("Cerrar Sesión");

            $("#perfilTop").removeAttr("hidden");
            $("#perfilTop").html("Mi Perfil");
            $("#perfilTop").attr("href", "/Home/Perfil");

            /* Perfil */
            $("#divMenuPerfil").removeAttr("hidden");
            $("#divMenuPerfil").html("Perfil");
            $("#ulMenuPerfil").removeAttr("hidden");

            $("#aMenuPerfilPerfil").attr("href", "/Home/Perfil");
            $("#spanAMenuPerfilPerfil").addClass("material-icons sidebar-menu-icon sidebar-menu-icon--left fas fa-user fa-xs");
            $("#spanBMenuPerfilPerfil").addClass("sidebar-menu-text");
            $("#spanBMenuPerfilPerfil").html("Mi Perfil");

        }

        if (rolValid == "1") {

            /******************************* MENU ADMINISTRACION **********************************/

            $("#divMenuAdmin").removeAttr("hidden");
            $("#divMenuAdmin").html("Administración");
            $("#ulMenuAdmin").removeAttr("hidden");

            $("#aMenuAdminAdmin").attr("href", "/Admin/AdministrarAdministracion");
            $("#spanAMenuAdminAdmin").addClass("material-icons sidebar-menu-icon sidebar-menu-icon--left");
            $("#spanAMenuAdminAdmin").html("people_outline");
            $("#spanBMenuAdminAdmin").addClass("sidebar-menu-text");
            $("#spanBMenuAdminAdmin").html("Administradores");

            $("#aMenuAdminChar").attr("href", "/Admin/AdministrarCharlista");
            $("#spanAMenuAdminChar").addClass("material-icons sidebar-menu-icon sidebar-menu-icon--left");
            $("#spanAMenuAdminChar").html("people_outline");
            $("#spanBMenuAdminChar").addClass("sidebar-menu-text");
            $("#spanBMenuAdminChar").html("Charlistas");

            $("#aMenuAdminUser").attr("href", "/Admin/AdministrarUsuarios");
            $("#spanAMenuAdminUser").addClass("material-icons sidebar-menu-icon sidebar-menu-icon--left");
            $("#spanAMenuAdminUser").html("people_outline");
            $("#spanBMenuAdminUser").addClass("sidebar-menu-text");
            $("#spanBMenuAdminUser").html("Clientes");

            $("#aMenuAdminUserChar").attr("href", "/Admin/AdministrarCharlaUsuario");
            $("#spanAMenuUserChar").addClass("material-icons sidebar-menu-icon sidebar-menu-icon--left");
            $("#spanAMenuUserChar").html("people_outline");
            $("#spanBMenuUserChar").addClass("sidebar-menu-text");
            $("#spanBMenuUserChar").html("Charla Usuarios");

            $("#aMenuAdminRec").attr("href", "/Receta/AdministrarRecetas");
            $("#spanAMenuAdminRec").addClass("material-icons sidebar-menu-icon sidebar-menu-icon--left");
            $("#spanAMenuAdminRec").html("import_contacts");
            $("#spanBMenuAdminRec").addClass("sidebar-menu-text");
            $("#spanBMenuAdminRec").html("Recetas");

            $("#aMenuAdminCate").attr("href", "/Categoria/AdministrarCategorias");
            $("#spanAMenuAdminCate").addClass("material-icons sidebar-menu-icon sidebar-menu-icon--left");
            $("#spanAMenuAdminCate").html("style");
            $("#spanBMenuAdminCate").addClass("sidebar-menu-text");
            $("#spanBMenuAdminCate").html("Categorias");

            $("#aMenuAdminCharcur").attr("href", "/Charla/AdministrarCharla");
            $("#spanAMenuAdminCharcur").addClass("material-icons sidebar-menu-icon sidebar-menu-icon--left");
            $("#spanAMenuAdminCharcur").html("import_contacts");
            $("#spanBMenuAdminCharcur").addClass("sidebar-menu-text");
            $("#spanBMenuAdminCharcur").html("Charlas");

            $("#aMenuAdminVid").attr("href", "/Charla/AdministrarVideo");
            $("#spanAMenuAdminVid").addClass("material-icons sidebar-menu-icon sidebar-menu-icon--left");
            $("#spanAMenuAdminVid").html("dvr");
            $("#spanBMenuAdminVid").addClass("sidebar-menu-text");
            $("#spanBMenuAdminVid").html("Videos");

            /******************************* MENU REPORTES **********************************/

            $("#divReportes").removeAttr("hidden");
            $("#divReportes").html("Reportes");
            $("#ulReportes").removeAttr("hidden");

            $("#aRepoUsu").attr("href", "/Reportes/UsuariosRegistrados");
            $("#spanARepoUsu").addClass("sidebar-menu-text");
            $("#spanARepoUsu").html("Usuarios");

            $("#aRepoCharla").attr("href", "/Reportes/CharlasRegistradas");
            $("#spanARepoCharla").addClass("sidebar-menu-text");
            $("#spanARepoCharla").html("Charlas");

            $("#aRepoTopCharla").attr("href", "/Reportes/TopCharlas");
            $("#spanARepoTopCharla").addClass("sidebar-menu-text");
            $("#spanARepoTopCharla").html("Top Charlas");

            $("#aRepTopCharlistas").attr("href", "/Reportes/TopCharlistas");
            $("#spanARepoTopCharlistas").addClass("sidebar-menu-text");
            $("#spanARepoTopCharlistas").html("Top Charlistas");

            $("#aRepTopCharlasVendidas").attr("href", "/Reportes/TopCharlasVendidas");
            $("#spanARepTopCharlasVendidas").addClass("sidebar-menu-text");
            $("#spanARepTopCharlasVendidas").html("Top Charlas Vendidas");

            $("#aRepVentas").attr("href", "/Reportes/ReporteVentas");
            $("#spanARepVentas").addClass("sidebar-menu-text");
            $("#spanARepVentas").html("Ventas");

            $("#aRepGanChr").attr("href", "/Reportes/GananciaCharlista");
            $("#spanARepGanChr").addClass("sidebar-menu-text");
            $("#spanARepGanChr").html("Ganancia Por Charlista");







            /***/
            $("#divGeeks").removeAttr("hidden");
            $("#divGeeks").html("4Geeks Payments");
            $("#divGeeks").attr("href", "https://4geeks.io/payments/");


            $("#divServCorreo").removeAttr("hidden");
            $("#divServCorreo").html("Servidor Correos");
            $("#divServCorreo").attr("href", "https://uncafeparaseguir.com:2096/");
          


        }
    });
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
