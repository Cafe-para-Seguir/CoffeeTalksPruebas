using System.Collections.Generic;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using UnCafeParaSeguir.Models;

namespace UnCafeParaSeguir.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        ConexionBD conDB = new ConexionBD();

        public HomeController(ILogger<HomeController> logger)
        {
            _logger = logger;
        }

        public IActionResult Registro()
        {
            return View();
        }
        public IActionResult InicioSesion()
        {
            return View();
        }
        public IActionResult Index()
        {
            return View();
        }
        public IActionResult Privacy()
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
        public IActionResult Perfil()
        {
            return View();
        }
        public IActionResult CalculadoraMedidas()
        {
            return View();
        }
        public IActionResult Faq()
        {
            return View();
        }
        
        public IActionResult Contacto()
        {
            return View();
        }

        public IActionResult VerificarCorreo()
        {
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpPost("Home")]
        public async Task<ContentResult> CargarImagenAsync(IFormFile files)
        {

            var filePath = "C:/img";//ruta donde se almacenaran las imagenes
            string imgName = "temp.jpeg"; //nombre de la imagen

            var filePaths = new List<string>();

            if (files.Length > 0)
            {

                if (!Directory.Exists(filePath))//crea la carpeta en caso de no existir
                {
                    DirectoryInfo di = Directory.CreateDirectory(filePath);
                }

                filePath = filePath + "/" + imgName;

                filePaths.Add(filePath);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await files.CopyToAsync(stream);
                }
            }
            return Content(filePath);
        }

    }
}