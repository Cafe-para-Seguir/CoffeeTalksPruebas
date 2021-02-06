using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using UnCafeParaSeguir.Models;

namespace UnCafeParaSeguir.Controllers
{
    public class RecetaController : Controller
    {
        private readonly ILogger<RecetaController> _logger;
        ConexionBD conDB = new ConexionBD();
        public RecetaController(ILogger<RecetaController> logger)
        {
            _logger = logger;
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult AdministrarRecetas()
        {
            return View();
        }
        public IActionResult VerRecetas()
        {
            return View();
        }

        public ContentResult Cargar_Tabla_Recetas()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarReceta();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Tabla_Receta_Filtrada(int pIdReceta)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarRecetaFiltrada(" + pIdReceta + ");");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Receta_Usuario(int pIdUsuario)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarRecetaUsuarioFiltrado(" + pIdUsuario + ");");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public async Task<int> RelacionUsuarioReceta(int pIdUsuario)
        {
            int query = await conDB.SP_EXECUTE("sp_RelacionUsuarioReceta",
                new Dictionary<string, object>()
                {
                    { "@pIdUsuario", pIdUsuario },
                }
            );
            return query;
        }

        public ContentResult Cargar_CorreoUsuario_X_Receta(int pIdReceta)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarUsuarioXReceta(" + pIdReceta + ");");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public ContentResult CargarRecetaUsuario()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarRecetaUsuario();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);
        }

        public async Task<int> Modificar_CorreoUsuario_X_Receta(int pIdReceta, int pIdUsuario)
        {
            int query = await conDB.SP_EXECUTE("sp_ModificarRelacionUsuarioReceta",
                new Dictionary<string, object>()
                {
                    { "@pIdReceta", pIdReceta },
                    { "@pIdUsuario", pIdUsuario },
                }
            );
            return query;
        }

        /* Mantenimiento de Recetas */
        public async Task<int> MantReceta(string pModo, int pIdReceta, string pNombreReceta, string pDescripcionReceta, int pIdUsuario, string pUsuarioCreacion, string pUsuarioModificacion)
        {
            int query = await conDB.SP_EXECUTE("sp_MantReceta",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdReceta", pIdReceta },
                    { "@pNombreReceta", pNombreReceta },
                    { "@pDescripcionReceta", pDescripcionReceta },
                    { "@pIdUsuario", pIdUsuario },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }
    }
}