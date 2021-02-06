using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Globalization;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using UnCafeParaSeguir.Models;

namespace UnCafeParaSeguir.Controllers
{
    public class CharlaController : Controller
    {
        private IHostingEnvironment _enviroment;
        private readonly ILogger<CharlaController> _logger;
        ConexionBD conDB = new ConexionBD();

        private static string idCharla;
        private static string IdVideo;
        private static string idCharlaVideo;

        public CharlaController(ILogger<CharlaController> logger, IHostingEnvironment hostingEnvironment)
        {
            _logger = logger;
            _enviroment = hostingEnvironment;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult AdministrarCharla()
        {
            return View();
        }

        public IActionResult AdministrarVideo()
        {
            return View();
        }

        public IActionResult VerCharla()
        {
            return View();
        }

        public IActionResult VerCharlaDetalle()
        {
            return View();
        }

        public IActionResult VerVideo()
        {
            return View();
        }

        public IActionResult verCharlaDetalleGratis()
        {
            return View();
        }

        public IActionResult VerCharlistas()
        {
            return View();
        }

        /*********************Charla*********************/

        public async Task<int> validaCharlaComprada(int idCharla, int idUsuario)
        {
            int query = await conDB.SP_EXECUTE(" sp_validaCharlaComprada",
                new Dictionary<string, object>()
                {
                    { "@pIdCharla", idCharla },
                    { "@pIdUsuario", idUsuario },
                }
            );
            return query;
        }

        public ContentResult LLenarIdVideo(int idVideo, int idCharla)
        {
            try
            {
                HttpContext.Session.SetString("idVideo", idVideo.ToString());
                HttpContext.Session.SetString("idCharlaVideo", idCharla.ToString());
                string sirvio = "1";
                return Content(sirvio);
            }
            catch
            {
                string sirvio = "2";
                return Content(sirvio);
            }
        }

        public ContentResult varSesionIdVideo()
        {
            IdVideo = HttpContext.Session.GetString("idVideo");

            return Content(IdVideo);
        }

        public ContentResult varSesionIdCharlaVideo()
        {
            idCharlaVideo = HttpContext.Session.GetString("idCharlaVideo");

            return Content(idCharlaVideo);
        }

        public ContentResult varSesionLlenarCharla(int idLlenarCharla)
        {
            try
            {
                HttpContext.Session.SetString("idLlenarCharla", idLlenarCharla.ToString());
                string sirvio = "1";
                return Content (sirvio);
            }
            catch
            {
                string sirvio = "2";
                return Content(sirvio);
            }
        }

        public ContentResult varSesionCharla()
        {
            idCharla = HttpContext.Session.GetString("idLlenarCharla");

            return Content(idCharla);
        }

        public ContentResult Cargar_Tabla_Charlas()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharla();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Tabla_Charlas_Admin()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharlaAdmin();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Charla_Filtrada(int pIdCharla)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharlaFiltrada( " + pIdCharla + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult MostrarCharlaFiltradaPorCategoria(int pIdCategoria)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharlaFiltradaPorCategoria( " + pIdCategoria + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Charla_Random(int pLimite, int pIdUsuario)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCharlasRandom( " + pLimite + ", " + pIdUsuario + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public async Task<int> MantCharla(string pModo, int pIdCharla, string pNombreCharla, string pDescripcionCharla, string pNivelCharla, string pImagenCharla, float pPrecioCharla,
           string pCorreoUsuario, string pUsuarioCreacion, string pUsuarioModificacion)
        {

            int query = await conDB.SP_EXECUTE("sp_MantCharla",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdCharla", pIdCharla },
                    { "@pNombreCharla", pNombreCharla },
                    { "@pDescripcionCharla", pDescripcionCharla },
                    { "@pNivelCharla", pNivelCharla },
                    { "@pImagenCharla", pImagenCharla },
                    { "@pPrecioCharla", pPrecioCharla },
                    { "@pCorreoUsuario", pCorreoUsuario },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }

        public async Task<int> ModificarCharla(string pModo, int pIdCharla, string txtNombreCharla, string txtDescripcionCharla, string cbNivelCharla,
            IFormFile files, string txtImagenCharla, float txtPrecioCharla, string txtCorreoUsuario, string pUsuarioCreacion, string pUsuarioModificacion)
        {

            var path = "";

            if (files != null)
            {
                string carpetaGuardar = Path.Combine(_enviroment.WebRootPath, "images/charlas");
                string fileName = pIdCharla.ToString() + ".jpg";
                using (FileStream fs = new FileStream(Path.Combine(carpetaGuardar, fileName), FileMode.Create))
                {
                    files.CopyTo(fs);
                }
                path = Path.Combine("images/charlas", fileName);
                path = "/" + path.Replace("\\", "/");
            }
            else
            {
                path = txtImagenCharla;
            }

            int query = await conDB.SP_EXECUTE("sp_MantCharla",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdCharla", pIdCharla },
                    { "@pNombreCharla", txtNombreCharla },
                    { "@pDescripcionCharla", txtDescripcionCharla },
                    { "@pNivelCharla", cbNivelCharla },
                    { "@pImagenCharla", path },
                    { "@pPrecioCharla", txtPrecioCharla },
                    { "@pCorreoUsuario", txtCorreoUsuario },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }

        public async Task<int> MantCharlaCategoria(string pModo, int pIdCharla, int pIdCategoria)
        {
            int query = await conDB.SP_EXECUTE("sp_MantCharlaCategoria",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdCharla", pIdCharla },
                    { "@pIdCategoria", pIdCategoria },
                }
            );
            return query;
        }

        public async Task<int> MantCharlaCharlista(string pModo, int pIdCharla, int pIdUsuario)
        {
            int query = await conDB.SP_EXECUTE("sp_MantCharlaCharlista",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdCharla", pIdCharla },
                    { "@pIdUsuario", pIdUsuario },
                }
            );
            return query;
        }

        public async Task<int> ValorarCharla(int pIdUsuario, int pIdCharla, int pValoracionCharla)
        {
            int query = await conDB.SP_EXECUTE("sp_ValorarCharla",
                new Dictionary<string, object>()
                {
                    { "@pIdUsuario", pIdUsuario },
                    { "@pIdCharla", pIdCharla },
                    { "@pValoracionCharla", pValoracionCharla },
                }
            );
            return query;
        }

        public ContentResult ValoracionCharlista(int pIdcharlista)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_ValoracionCharlista(" + pIdcharlista + ");");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public async Task<int> ActualizarValoracionCharlista(int pIdUsuario)
        {
            int query = await conDB.SP_EXECUTE("sp_ActualizarValoracionCharlista",
                new Dictionary<string, object>()
                {
                    { "@pIdUsuario", pIdUsuario },
                }
            );
            return query;
        }

        public ContentResult ValoracionTotal(int pIdCharla)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_ValoracionTotal( " + pIdCharla + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult ValoracionUsuario(int pIdUsuario, int pIdCharla)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_ValoracionUsuario( " + pIdUsuario + " , " + pIdCharla + ");");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public async Task<int> ActualizarValoracionCharla(int pIdCharla, string sValoracionCharla)
        {
           float pValoracionCharla = float.Parse(sValoracionCharla, CultureInfo.InvariantCulture.NumberFormat);

            int query = await conDB.SP_EXECUTE("sp_ActualizarValoracionCharla",
                new Dictionary<string, object>()
                {
                    { "@pIdCharla", pIdCharla },
                    { "@pValoracionCharla", pValoracionCharla },
                }
            );
            return query;
        }

        public async Task<int> validaDueno(int idCharla, int idUsuario)
        {
            int query = await conDB.SP_EXECUTE("sp_validaDuenoCharla",
                new Dictionary<string, object>()
                {
                    { "@pIdCharla", idCharla },
                    { "@pIdUsuario", idUsuario },
                }
            );
            return query;
        }

        /*********************Video*********************/

        public ContentResult Cargar_Video_FiltradoId(int pIdVideo)/**********************/
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarVideoID(" + pIdVideo + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Video_Charla_FiltradoId(int pIdCharla)/********/
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarVideoCharlaFiltrado(" + pIdCharla + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Video_Charla_Visualizado_FiltradoId(int pIdCharla, int pIdUsuario)/**/
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarVideoCharlaFiltradoVisualizado(" + pIdCharla + ", " + pIdUsuario + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Tabla_Videos()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarVideo();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Video_Filtrado(int pIdVideo)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarVideoFiltrado( " + pIdVideo + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public async Task<int> MantVideo(string pModo, int pIdVideo, string pNombreVideo, string pLinkVideo, string pDuracionVideo, string pOrdenVideo, string pUsuarioCreacion, string pUsuarioModificacion)
        {
            int query = await conDB.SP_EXECUTE("sp_MantVideo",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdVideo", pIdVideo },
                    { "@pNombreVideo", pNombreVideo },
                    { "@pLinkVideo", pLinkVideo },
                    { "@pDuracionVideo", pDuracionVideo },
                    { "@pOrdenVideo", pOrdenVideo },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }

        public async Task<int> ValidaOrdenVideo(int pIdCharla, string pOrdenVideo)
        {
            int query = await conDB.SP_EXECUTE("sp_validaOrdenVideo",
                new Dictionary<string, object>()
                {
                    { "@pIdCharla", pIdCharla },
                    { "@pOrdenVideo", pOrdenVideo },
                }
            );
            return query;
        }

        public async Task<int> validaOrdenVideoModificar(int pIdVideo, string pOrdenVideo)
        {
            int query = await conDB.SP_EXECUTE("sp_validaOrdenVideoModificar",
                new Dictionary<string, object>()
                {
                    { "@pIdVideo", pIdVideo },
                    { "@pOrdenVideo", pOrdenVideo },
                }
            );
            return query;
        }

        public async Task<int> MantVideoCharla(string pModo, int pIdVideo, int pIdCharla)
        {
            int query = await conDB.SP_EXECUTE("sp_MantVideoCharla",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdVideo", pIdVideo },
                    { "@pIdCharla", pIdCharla },
                }
            );
            return query;
        }

        public async Task<int> videoVisto(int pIdUsuario, int pIdVideo)
        {
            int query = await conDB.SP_EXECUTE("sp_videoVisto",
                new Dictionary<string, object>()
                {
                    { "@pIdUsuario", pIdUsuario },
                    { "@pIdVideo", pIdVideo },
                }
            );
            return query;
        }

        /**Foro**/

        public ContentResult Cargar_Comentarios_Foro(int pIdCharla)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarForoComentarios(" + pIdCharla + ");");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Respuestas_Comentario(int pIdForo)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarForoComentariosRespuestas(" + pIdForo + ");");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public async Task<int> MantForo(string pModo, int pIdForo, int pIdCharla, int pIdUsuario, int pIdComentario, string TextoComentario)
        {

            int query = await conDB.SP_EXECUTE("sp_MantForo",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdForo", pIdForo },
                    { "@pIdCharla", pIdCharla },
                    { "@pIdUsuario", pIdUsuario },
                    { "@pIdComentario", pIdComentario },
                    { "@pComentarioForo", TextoComentario },
                }
            );
            return query;
        }

        public async Task<int> VerificaCharlaCompletada(int pIdUsuario, int pIdVideo)
        {
            int query = await conDB.SP_EXECUTE("sp_VerificaCharlaCompletada",
                new Dictionary<string, object>()
                {
                    { "@pIdUsuario", pIdUsuario },
                    { "@pIdVideo", pIdVideo },
                }
            );
            return query;
        }


        public ContentResult CargarCharlaCompletada(int pIdUsuario, int pIdCharla)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_CargarCharlaCompletada( " + pIdUsuario + ", " + pIdCharla + " );");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public async Task<int> validaCharlasVC(int pIdUsuario, string pIdCharla)
        {
            int query = await conDB.SP_EXECUTE("sp_validaCharlaVC",
                new Dictionary<string, object>()
                {
                    { "@pIdUsuario", pIdUsuario },
                    { "@pIdCharla", pIdCharla },
                }
            );
            return query;
        }
    }
}