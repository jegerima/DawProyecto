using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DawRevenge.Models;

namespace DawRevenge.Controllers
{
    public class CuentaController : Controller
    {
        //
        // GET: /Cuenta/

        public ActionResult Cuenta(String user, String token)
        {
            DawEntities database = new DawEntities();
            usuario userEntity = database.usuario.First(i => i.nombUsuario == user);

            ViewBag.usuario = userEntity;
            ViewBag.token = token;
            ViewBag.comentarios = userEntity.comentario.ToArray();

            return View();
        }

    }
}
