using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DawRevenge.Models;

namespace DawRevenge.Controllers
{
    public class SiguiendoController : Controller
    {
        //
        // GET: /Siguiendo/

        public ActionResult Siguiendo(String user, String token)
        {
            DawEntities database = new DawEntities();
            usuario userEntity = database.usuario.First(i => i.nombUsuario == user);
            List<usuario> ListaSiguiendo = new List<usuario>();

            if (userEntity != null)
            {
                List<seguidorusuario> followingList = database.seguidorusuario.Where(i => i.sigue == userEntity.id_usuario).ToList();
                foreach (seguidorusuario followingRelation in followingList)
                {
                    usuario followingUser = database.usuario.Find(followingRelation.seguido);
                    ListaSiguiendo.Add(followingUser);
                }
            }

            ViewBag.usuario = userEntity;
            ViewBag.token = token;
            ViewBag.siguiendo = ListaSiguiendo.ToArray();
            return View();
        }

    }
}
