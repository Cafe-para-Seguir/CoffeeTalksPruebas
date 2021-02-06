using System;
using System.Collections.Generic;
using System.Data;
using System.Diagnostics;
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
    public class CategoriaController : Controller
    {
        private IHostingEnvironment _enviroment;
        private readonly ILogger<CategoriaController> _logger;
        ConexionBD conDB = new ConexionBD();
        public CategoriaController(ILogger<CategoriaController> logger, IHostingEnvironment hostingEnvironment)
        {
            _logger = logger;
            _enviroment = hostingEnvironment;
        }
        public IActionResult AdministrarCategorias()
        {
            return View();
        }

        public ContentResult Cargar_Tabla_Categoria()
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCategoria();");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public ContentResult Cargar_Tabla_Categoria_Filtrada(int pIdCategoria)
        {
            DataTable ds = new DataTable();

            ds = conDB.SP_SELECTS(ds, "Call sp_MostrarCategoriaFiltrada(" + pIdCategoria + ");");

            string JsonResult = JsonConvert.SerializeObject(ds);

            return Content(JsonResult);

        }

        public async Task<int> ModificarCategoria(string pModo, int pIdCategoria, string pNombreCategoria, string pDescripcionCategoria,
             IFormFile files, string txtImagenCategoria, string pUsuarioCreacion, string pUsuarioModificacion)
        {

            var path = "";

            if (files != null)
            {
                string carpetaGuardar = Path.Combine(_enviroment.WebRootPath, "images/categorias");
                string fileName = pIdCategoria.ToString() + ".jpg";
                using (FileStream fs = new FileStream(Path.Combine(carpetaGuardar, fileName), FileMode.Create))
                {
                    files.CopyTo(fs);
                }
                path = Path.Combine("images/categorias", fileName);
                path = "/" + path.Replace("\\", "/");
            }
            else
            {
                path = txtImagenCategoria;
            }

            int query = await conDB.SP_EXECUTE("sp_MantCategoria",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdCategoria", pIdCategoria },
                    { "@pNombreCategoria", pNombreCategoria },
                    { "@pDescripcionCategoria", pDescripcionCategoria },
                    { "@pImagenCategoria", path },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }
       

        /* Mantenimiento de Categorias */
        public async Task<int> MantCategoria(string pModo, int pIdCategoria, string pNombreCategoria, string pDescripcionCategoria, string pImagenCategoria, string pUsuarioCreacion, string pUsuarioModificacion)
        {
            int query = await conDB.SP_EXECUTE("sp_MantCategoria",
                new Dictionary<string, object>()
                {
                    { "@pModo", pModo },
                    { "@pIdCategoria", pIdCategoria },
                    { "@pNombreCategoria", pNombreCategoria },
                    { "@pDescripcionCategoria", pDescripcionCategoria },
                    { "@pImagenCategoria", pImagenCategoria },
                    { "@pUsuarioCreacion", pUsuarioCreacion },
                    { "@pUsuarioModificacion", pUsuarioModificacion },
                }
            );
            return query;
        }
    }
}