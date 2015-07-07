using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DawRevenge.Models;

namespace DawRevenge.Controllers
{
    public class SeguidoresController : Controller
    {
        //
        // GET: /Seguidores/

        public ActionResult Seguidores(String user, String token)
        {
            DawEntities database = new DawEntities();
            usuario userEntity = database.usuario.First(i => i.nombUsuario == user);
            List<usuario> ListaSeguidores = new List<usuario>();

            if (userEntity != null)
            {
                List<seguidorusuario> followersList = database.seguidorusuario.Where(i => i.seguido == userEntity.id_usuario).ToList();
                foreach (seguidorusuario followerRelation in followersList)
                {
                    usuario followerUser = database.usuario.Find(followerRelation.sigue);
                    ListaSeguidores.Add(followerUser);
                }
            }

            ViewBag.usuario = userEntity;
            ViewBag.token = token;
            ViewBag.seguidores = ListaSeguidores.ToArray();
            return View();
        }

    }
}
