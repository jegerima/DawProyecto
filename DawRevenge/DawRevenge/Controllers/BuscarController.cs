using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DawRevenge.Models;
using System.Web.Script.Serialization;

namespace DawRevenge.Controllers
{
    public class BuscarController : Controller
    {
        //
        // GET: /Buscar/

        public ActionResult Buscar(String user, String token)
        {
            DawEntities database = new DawEntities();
            usuario userEntity = database.usuario.First(i => i.nombUsuario == user);
            if (userEntity != null)
            {
                ViewBag.usuario = userEntity;
                ViewBag.token = token;
                return View();
            }
            return View();
        }

        [HttpPost]
        public ActionResult BuscarAmigos(String user)
        {
            DawEntities database = new DawEntities();
            List<usuario> userList = database.usuario.Where(i => i.nombUsuario.Contains(user)).ToList();
            List<Object> usuarios = new List<Object>();
            foreach (usuario userEntity in userList)
            {
                Dictionary<String, Object> userDictionary = new Dictionary<String, Object>();
                userDictionary["nombUsuario"] = userEntity.nombUsuario;
                usuarios.Add(userDictionary);
            }
            var jsonSerialiser = new JavaScriptSerializer();
            var json = jsonSerialiser.Serialize(usuarios);
            return Content(json);
        }

        [HttpPost]
        public ActionResult InfoPerfilUsuario(String userSel, String userActual) 
        {
            DawEntities database = new DawEntities();
            usuario userSelE = database.usuario.First(i => i.nombUsuario==userSel);
            usuario usuarioActual = database.usuario.First(i => i.nombUsuario==userActual);
            List<Object> datos = new List<Object>();
           
                Dictionary<String, Object> userDictionary = new Dictionary<String, Object>();
                userDictionary["nombres"] = userSelE.nombres;
                userDictionary["apellidos"] = userSelE.apellidos;
                userDictionary["cedula"] = userSelE.cedula;
                userDictionary["matricula"] = userSelE.matricula;
                userDictionary["nseguidores"] = userSelE.nSeguidores;
                userDictionary["nsiguiendo"] = userSelE.nSiguiendo;
                userDictionary["tienecarro"] = userSelE.tieneCarro;
                userDictionary["userfb"] = userSelE.userFB;
                userDictionary["usertw"] = userSelE.userTW;
                userDictionary["nombusuario"] = userSelE.nombUsuario;
                datos.Add(userDictionary);
                List<seguidorusuario> followingList = database.seguidorusuario.Where(i => i.sigue == usuarioActual.id_usuario).ToList();
                Boolean sigueoNo = false;
                foreach (seguidorusuario followingRelation in followingList)
                {
                    usuario followingUser = database.usuario.Find(followingRelation.seguido);
                    if (followingUser.nombUsuario == userSel)
                    {
                        sigueoNo = true;
                        break;
                    }
                }
                if (sigueoNo)
                {
                    datos.Add("si");
                }
                else {
                    datos.Add("no");
                }
                
            
          
            var jsonSerialiser = new JavaScriptSerializer();
            var json = jsonSerialiser.Serialize(datos);
            return Content(json);
        }
    


    
        [HttpPost]
        public ActionResult Comentarios(String user, String token) 
        {
            DawEntities database = new DawEntities();
            List<usuario> userList = database.usuario.Where(i => i.nombUsuario.Contains(user)).ToList();
            
            List<Object> datos = new List<Object>();
            foreach (usuario userEntity in userList)
            {
                List<comentario> comentarios = userEntity.comentario.ToList();
                Dictionary<String, Object> userDictionary = new Dictionary<String, Object>();
                foreach(comentario coment in comentarios){

                    userDictionary["contenidotext"] = coment.contenidoText;
                    userDictionary["fecha"] = coment.fecha.ToString();
                  
                    datos.Add(userDictionary);
                }
              
             
                
            }
          
            var jsonSerialiser = new JavaScriptSerializer();
            var json = jsonSerialiser.Serialize(datos);
            return Content(json);
        }
    }
}

