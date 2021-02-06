using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using UnCafeParaSeguir.Models;
using System.IO;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Http;
using System.Globalization;
using Microsoft.AspNetCore.Hosting;


namespace UnCafeParaSeguir.Controllers
{
    public class AdminController : Controller
    {
        ConexionBD conDB = new ConexionBD();
        private readonly ILogger<AdminController> _logger;
        private static string idUsuarioUser;
        private static string CorreoUser;
        private static string idUsuarioPerfil;
        private static string IdRolUser;
        private static string key = "b14ca5898a4e4133bbce2ea2315a1916";
        private IHostingEnvironment _enviroment;

        public AdminController(ILogger<AdminController> logger, IHostingEnvironment hostingEnvironment)
        {
            _logger = logger;
            _enviroment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult AdministrarCharlaUsuario()
        {
            return View();
        }  

        public IActionResult AdministrarUsuarios()
        {
            return View();
        }

        public IActionResult AdministrarVideos()
        {
            return View();
        }

        public IActionResult AdministrarCharlista()
        {
            return View();
        }

        public IActionResult AdministrarAdministracion()
        {
            return View();
        }

        public IActionResult VerPerfilPublico()
        {
            return View();
        }

        public IActionResult OlvidoContraseña()
        {
            return View();
        }

        public IActionResult facebook()
        {
            return View();
        }

        public ContentResult Cargar_Tabla_Usuario()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarUsuario();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Tabla_Charlista()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharlista();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public ContentResult Cargar_Charlistas_Calificados()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharlistaPorValoracion()");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public ContentResult Cargar_Cursos_Usuario(int pIdUsuario)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharlaUsuarioFiltrado(" + pIdUsuario + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Cursos_Charlista(int pIdUsuario)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharlaCharlistaFiltrado(" + pIdUsuario + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Iniciar_Sesion(string pCorreoUsuario, string pClaveUsuario)
        {
            int idRol = 0;
            int idUsuario = 0;
            string responsable = "";
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_InicioSesion('" + pCorreoUsuario + "', '" + pClaveUsuario + "' );");
            if (ds.Rows.Count > 0)
            {
                for (int i = 0; i < ds.Rows.Count; i++)
                {
                    DataRow info_Usuarios = ds.Rows[i];
                    idRol = Convert.ToInt32(info_Usuarios["idRol"]);
                    responsable = Convert.ToString(info_Usuarios["correoUsuario"]);
                    idUsuario = Convert.ToInt32(info_Usuarios["idUsuario"]);
                }
            }
            string JsonResult = JsonConvert.SerializeObject(ds);

            HttpContext.Session.SetString("IdRolUser", idRol.ToString());
            HttpContext.Session.SetString("CorreoUser", responsable.ToString());
            HttpContext.Session.SetString("idUsuarioUser", idUsuario.ToString());
            return Content(JsonResult);

        }

        public ContentResult varSesionLlenarPerfilPublico(int idLlenarPerfil)
        {
            try
            {
                HttpContext.Session.SetString("idUsuarioPerfil", idLlenarPerfil.ToString());
                string sirvio = "1";
                return Content(sirvio);
            }
            catch
            {
                string sirvio = "2";
                return Content(sirvio);
            }
        }

        public ContentResult varSesionPefilPublico()
        {
            idUsuarioPerfil = HttpContext.Session.GetString("idUsuarioPerfil");
            return Content(idUsuarioPerfil);
        }

        public ContentResult varSesionRol()
        {
            IdRolUser = HttpContext.Session.GetString("IdRolUser");

            return Content(IdRolUser);
        }

        public ContentResult varSesionCorreo()
        {
            CorreoUser = HttpContext.Session.GetString("CorreoUser");

            return Content(CorreoUser);
        }

        public ContentResult varSesionIdUsuario()
        {
            idUsuarioUser = HttpContext.Session.GetString("idUsuarioUser");

            return Content(idUsuarioUser);
        }

        public ContentResult CerrarSesionPlat()
        {
            string _sessionCerrada = "0";
            try
            {
                string vacio = "";

                HttpContext.Session.SetString("IdRolUser", vacio.ToString());
                HttpContext.Session.SetString("CorreoUser", vacio.ToString());
                HttpContext.Session.SetString("idUsuarioUser", vacio.ToString());
                HttpContext.Session.SetString("idCharlista", vacio.ToString());
                _sessionCerrada = "1";
            }
            catch (Exception e)
            {
                _sessionCerrada = "2";
            }

            return Content(_sessionCerrada);
        }

        public ContentResult Verifica_Correo(string pCorreoUsuario)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_VerificarCorreo('" + pCorreoUsuario + "');");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public ContentResult Cargar_Tabla_Administrador()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarAdministrador();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public ContentResult EncryptarClave(string pClaveUsuario)
        {
            var encryptedPassword = AesOperation.EncryptString(key, pClaveUsuario);
            return Content(encryptedPassword);
        }

        public ContentResult DesEncryptarClave(string pClaveUsuario)
        {
            var decryptedString = AesOperation.DecryptString(key, pClaveUsuario);
            return Content(decryptedString);
        }

        public ContentResult Cargar_Usuario_Filtrado(int pIdUsuario)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarUsuarioFiltrado(" + pIdUsuario + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Mostar_Charla()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharlaMV();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult sp_MostrarCharlaReciente()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharlaReciente();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Mostar_charlistas()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharlistasRandom();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Mostar_categorias()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCategoria();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        /* Mantenimiento de Usuarios */
        public async Task<int> MantUsuario(string pModo, int pIdUsuario, string pNombreUsuario, string pApellidosUsuario, string pDescripcionUsuario, string pCorreoUsuario, string pClaveUsuario,
            string pImagenUsuario, string pOpcionNotificacion, int pIdRol, string pEstadoUsuario, string pUsuarioCreacion, string pUsuarioModificacion)
        {

            var encryptedPassword = AesOperation.EncryptString(key, pClaveUsuario);
            //var decryptedString = AesOperation.DecryptString(key, pClaveUsuario);

            int query = await conDB.SP_EXECUTE("sp_MantUsuario",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdUsuario", pIdUsuario },
                    { "@pNombreUsuario", pNombreUsuario },
                    { "@pApellidosUsuario", pApellidosUsuario },
                    { "@pDescripcionUsuario", pDescripcionUsuario },
                    { "@pCorreoUsuario", pCorreoUsuario },
                    { "@pClaveUsuario", encryptedPassword },
                    { "@pImagenUsuario", pImagenUsuario },
                    { "@pOpcionNotificacion", pOpcionNotificacion },
                    { "@pIdRol", pIdRol },
                    { "@pEstadoUsuario", pEstadoUsuario },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }

        public ContentResult CargarCharlasUsuario(int pIdUsuario)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_CargarCharlasUsuario(" + pIdUsuario + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }  

        public ContentResult MostrarCharlaUsuario(int pIdUsuario)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharlaUsuario();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }  

        public async Task<int> MantCharlaUsuario(string pModo, int pIdUsuario, int pIdCharla, string pFinalizado)
        {
            int query = await conDB.SP_EXECUTE("sp_MantCharlaUsuario",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdUsuario", pIdUsuario },
                    { "@pIdCharla", pIdCharla },
                    { "@pFinalizado", pFinalizado },
                }
            );
            return query;
        }

        public async Task<int> RegistroNuevoUsuario(string pModo, int pIdUsuario, string pNombreUsuario, string pApellidosUsuario, string pCorreoUsuario, string pClaveUsuario,
     string pUsuarioCreacion, string pUsuarioModificacion)
        {

            var encryptedPassword = AesOperation.EncryptString(key, pClaveUsuario);

            int query = await conDB.SP_EXECUTE("sp_RegistroNuevoUsuario",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdUsuario", pIdUsuario },
                    { "@pNombreUsuario", pNombreUsuario },
                    { "@pApellidosUsuario", pApellidosUsuario },
                    { "@pCorreoUsuario", pCorreoUsuario },
                    { "@pClaveUsuario", encryptedPassword },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }

        public async Task<int> MantUsuarioModificar(string pModo, int pIdUsuario, string txtNombreUsuario, string txtApellidosUsuario, string txtDescripcionUsuario, string txtCorreoUsuario, string txtClaveUsuario,
            IFormFile files, string txtImagenUsuario, string cbOpcionNotificacion, int cbIdRol, string cbEstadoUsuario, string pUsuarioCreacion, string pUsuarioModificacion)
        {
            var path = "";

            if (files != null)
            {
                string carpetaGuardar = Path.Combine(_enviroment.WebRootPath, "images/usuarios");
                string fileName = pIdUsuario.ToString() + ".jpg"; // Path.GetFileName(files.FileName);
                using (FileStream fs = new FileStream(Path.Combine(carpetaGuardar, fileName), FileMode.Create))
                {
                    files.CopyTo(fs);
                }
                path = Path.Combine("images/usuarios", fileName);
                path = "/" + path.Replace("\\", "/");
            }
            else
            {
                path = txtImagenUsuario;
            }
            var encryptedPassword = AesOperation.EncryptString(key, txtClaveUsuario);
            //var decryptedString = AesOperation.DecryptString(key, pClaveUsuario);

            int query = await conDB.SP_EXECUTE("sp_MantUsuario",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdUsuario", pIdUsuario },
                    { "@pNombreUsuario", txtNombreUsuario },
                    { "@pApellidosUsuario", txtApellidosUsuario },
                    { "@pDescripcionUsuario", txtDescripcionUsuario },
                    { "@pCorreoUsuario", txtCorreoUsuario },
                    { "@pClaveUsuario", encryptedPassword },
                    { "@pImagenUsuario", path },
                    { "@pOpcionNotificacion", cbOpcionNotificacion },
                    { "@pIdRol", cbIdRol },
                    { "@pEstadoUsuario", cbEstadoUsuario },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }

        public async Task<int> ModificarAdministrador(string pModo, int pIdUsuario, string txtNombreUsuario, string txtApellidosUsuario,
    string txtDescripcionUsuario, string txtCorreoUsuario, string pClaveUsuario, IFormFile files, string txtImagenUsuario,
    string cbOpcionNotificacion, int pIdRol, string cbEstadoUsuario, string pUsuarioCreacion, string pUsuarioModificacion)
        {

            var encryptedPassword = AesOperation.EncryptString(key, pClaveUsuario);

            var path = "";

            if (files != null)
            {
                string carpetaGuardar = Path.Combine(_enviroment.WebRootPath, "images/usuarios");
                string fileName = pIdUsuario.ToString() + ".jpg";
                using (FileStream fs = new FileStream(Path.Combine(carpetaGuardar, fileName), FileMode.Create))
                {
                    files.CopyTo(fs);
                }
                path = Path.Combine("images/usuarios", fileName);
                path = "/" + path.Replace("\\", "/");
            }
            else
            {
                path = txtImagenUsuario;
            }

            int query = await conDB.SP_EXECUTE("sp_MantAdmin",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdUsuario", pIdUsuario },
                    { "@pNombreUsuario", txtNombreUsuario },
                    { "@pApellidosUsuario", txtApellidosUsuario },
                    { "@pDescripcionUsuario", txtDescripcionUsuario },
                    { "@pCorreoUsuario", txtCorreoUsuario },
                    { "@pClaveUsuario", encryptedPassword },
                    { "@pImagenUsuario", path },
                    { "@pOpcionNotificacion", cbOpcionNotificacion },
                    { "@pIdRol", pIdRol },
                    { "@pEstadoUsuario", cbEstadoUsuario },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }

        public async Task<int> MantAdministrador(string pModo, int pIdUsuario, string pNombreUsuario, string pApellidosUsuario, string pDescripcionUsuario, string pCorreoUsuario, string pClaveUsuario,
            string pImagenUsuario, string pOpcionNotificacion, int pIdRol, string pEstadoUsuario, string pUsuarioCreacion, string pUsuarioModificacion)
        {

            var encryptedPassword = AesOperation.EncryptString(key, pClaveUsuario);

            int query = await conDB.SP_EXECUTE("sp_MantAdmin",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdUsuario", pIdUsuario },
                    { "@pNombreUsuario", pNombreUsuario },
                    { "@pApellidosUsuario", pApellidosUsuario },
                    { "@pDescripcionUsuario", pDescripcionUsuario },
                    { "@pCorreoUsuario", pCorreoUsuario },
                    { "@pClaveUsuario", encryptedPassword },
                    { "@pImagenUsuario", pImagenUsuario },
                    { "@pOpcionNotificacion", pOpcionNotificacion },
                    { "@pIdRol", pIdRol },
                    { "@pEstadoUsuario", pEstadoUsuario },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }

        public async Task<int> jsMantClave(int pIdUsuario, string pClaveUsuario, string pUsuarioModificacion)
        {

            var encryptedPassword = AesOperation.EncryptString(key, pClaveUsuario);

            int query = await conDB.SP_EXECUTE("sp_CambioClaveUsuario",
                new Dictionary<string, object>()
                {
                    { "@pIdUsuario", pIdUsuario },
                    { "@pClaveUsuario", encryptedPassword },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }

        /* Mantenimiento de Charlas */
        public async Task<int> MantCharla(string pModo, int pIdCharla, string pNombreCharla, string pDescripcionCharla, string pValoracionCharla, string pPrecioCharla,
            string pUsuarioCreacion, string pUsuarioModificacion)
        {
            int query = await conDB.SP_EXECUTE("sp_MantCharla",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdCharla", pIdCharla },
                    { "@pNombreCharla", pNombreCharla },
                    { "@pDescripcionCharla", pDescripcionCharla },
                    { "@pValoracionCharla", pValoracionCharla },
                    { "@pPrecioCharla", pPrecioCharla },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }

        /* Mantenimiento de Videos */
        public async Task<int> MantVideo(string pModo, int pIdVideo, string pLinkVideo, string pDuracionVideo,
            string pUsuarioCreacion, string pUsuarioModificacion)
        {
            int query = await conDB.SP_EXECUTE("sp_MantVideo",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdVideo", pIdVideo },
                    { "@pLinkVideo", pLinkVideo },
                    { "@pDuracionVideo", pDuracionVideo },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }


        public async Task<int> VinculacionVideoUsuario(int pIdUsuario, int pIdCharla)
        {
            int query = await conDB.SP_EXECUTE("sp_VinculacionVideoUsuario",
                new Dictionary<string, object>()
                {
                    { "@pIdUsuario", pIdUsuario },
                    { "@pIdCharla", pIdCharla },
                }
            );
            return query;
        }

        public int EliminarImagen(int pIdUsuario)
        {
            try
            {
                string carpeta = Path.Combine(_enviroment.WebRootPath, "images/usuarios");
                string ruta = Path.Combine(carpeta, pIdUsuario.ToString() + ".jpg");
                System.IO.File.Delete(ruta);
                return 1;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex);
                return 0;
            }
        }
    }


    public class AesOperation
    {
        public static string EncryptString(string key, string plainText)
        {
            byte[] iv = new byte[16];
            byte[] array;

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;

                ICryptoTransform encryptor = aes.CreateEncryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream())
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, encryptor, CryptoStreamMode.Write))
                    {
                        using (StreamWriter streamWriter = new StreamWriter((Stream)cryptoStream))
                        {
                            streamWriter.Write(plainText);
                        }

                        array = memoryStream.ToArray();
                    }
                }
            }
            return Convert.ToBase64String(array);
        }

        public static string DecryptString(string key, string cipherText)
        {
            byte[] iv = new byte[16];
            byte[] buffer = Convert.FromBase64String(cipherText);

            using (Aes aes = Aes.Create())
            {
                aes.Key = Encoding.UTF8.GetBytes(key);
                aes.IV = iv;
                ICryptoTransform decryptor = aes.CreateDecryptor(aes.Key, aes.IV);

                using (MemoryStream memoryStream = new MemoryStream(buffer))
                {
                    using (CryptoStream cryptoStream = new CryptoStream((Stream)memoryStream, decryptor, CryptoStreamMode.Read))
                    {
                        using (StreamReader streamReader = new StreamReader((Stream)cryptoStream))
                        {
                            return streamReader.ReadToEnd();
                        }
                    }
                }
            }
        }

    }
}