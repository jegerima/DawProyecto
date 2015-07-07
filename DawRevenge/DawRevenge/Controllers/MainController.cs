using DawRevenge.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.SignalR;

namespace DawRevenge.Controllers
{
    public class MainController : Controller
    {
        //
        // GET: /Main/

        [HttpPost]
        public ActionResult Main(String user, String token)
        {
            List<Object> routes = new List<Object>();
            List<comentario> commentList = new List<comentario>();
            List<usuario> usuariosSeguidos = new List<usuario>();

            DawEntities database = new DawEntities();
            usuario userEntity = database.usuario.First(i => i.nombUsuario == user);
            if (userEntity != null)
            {
                List<seguidorusuario> followingList = database.seguidorusuario.Where(i => i.sigue == userEntity.id_usuario).ToList();
                foreach(seguidorusuario followingRelation in followingList)
                {
                    usuario followingUser = database.usuario.Find(followingRelation.seguido);
                    usuariosSeguidos.Add(followingUser);
                    List<ruta> routeList = database.ruta.Where(i => i.usuario.id_usuario == followingUser.id_usuario).ToList();
                    foreach (comentario comment in followingUser.comentario.ToList()) {
                        commentList.Add(comment);
                    }
                    foreach (ruta route in routeList)
                    {
                        List<peticion> petitionList = database.peticion.Where(i => i.ruta.id_ruta == route.id_ruta).Where(i => i.usuario.id_usuario == userEntity.id_usuario).ToList();
                        String petitionState = "NO";
                        foreach (peticion petition in petitionList)
                        {
                            if (petition.usuario != null)
                            {
                                if (petition.estado == "ESPERA" || petition.estado == "ACEPTADA")
                                {
                                    petitionState = petition.estado;
                                    break;
                                }
                            }
                        }
                        Object[] routeData = new Object[7] { route.id_ruta, route.inicioLatLon, route.finLatLon, route.nombre, route.fecha, route.usuario.nombUsuario, petitionState};
                        routes.Add(routeData);
                    }
                }
                ViewBag.usuario = userEntity;
                ViewBag.seguidores = usuariosSeguidos;
                ViewBag.token = token;
                ViewBag.misRutas = userEntity.ruta.ToArray();
                ViewBag.rutasSiguiendo = routes.ToArray();
                ViewBag.comentariosSiguiendo = commentList.ToArray();
                ViewBag.siguiendo = usuariosSeguidos.ToArray();
                return View();
            }
            return View();
        }

        [HttpPost]
        public ActionResult agregarComentario(String user, String comentario, String fecha)
        {
            DawEntities database = new DawEntities();
            usuario userEntity = database.usuario.First(i => i.nombUsuario == user);
            
            
            String[] lt = fecha.Split(' ');
            String[] dias = lt[0].Split('-');
            String[] horas = lt[1].Split(':');
            DateTime tm = new DateTime(int.Parse(dias[0]), int.Parse(dias[1]), int.Parse(dias[2]), int.Parse(horas[0]), int.Parse(horas[1]), int.Parse(horas[2]));
            /*
            tm.AddSeconds(double.Parse(horas[2]));
            tm.AddMinutes(double.Parse(horas[1]));
            tm.AddHours(double.Parse(horas[0]));
            tm.AddDays(double.Parse(dias[0]));
            tm.AddMonths(int.Parse(dias[1]));
            tm.AddYears(int.Parse(dias[2]));
            */
            comentario cm = new comentario();
            cm.contenidoText = comentario;
            cm.id_usuario = userEntity.id_usuario;
            cm.fecha = tm;

            database.comentario.Add(cm);
            database.SaveChanges();

            var context = GlobalHost.ConnectionManager.GetHubContext<ComentariosHub>();
            context.Clients.All.agregarComentario(user, comentario, fecha);

            return Content("success");
        }


        [HttpPost]
        public ActionResult agregarRuta(String user, String origen, String destino,String nombre,String fecha)
        {
            DawEntities database = new DawEntities();
            usuario userEntity = database.usuario.First(i => i.nombUsuario == user);


            String[] lt = fecha.Split(' ');
            String[] dias = lt[0].Split('-');
            String[] horas = lt[1].Split(':');
            DateTime tm = new DateTime(int.Parse(dias[0]), int.Parse(dias[1]), int.Parse(dias[2]), int.Parse(horas[0]), int.Parse(horas[1]),0);
           
            ruta r = new ruta();
            r.id_usuario = userEntity.id_usuario;
            r.fecha = tm;
            r.estado="ACTIVO";
            r.inicioLatLon = origen;
            r.finLatLon = destino;
            r.nombre = nombre;
            database.ruta.Add(r);
            database.SaveChanges();
            //(r.id_ruta);

            return dataAgregarRuta(user,r.id_ruta,fecha,nombre,origen,destino);
        }


        public ActionResult dataAgregarRuta(String  user , int ruta,String fecha,String nombreRuta, String origen ,String destino)
        {
            var context = GlobalHost.ConnectionManager.GetHubContext<RutasHub>();
            context.Clients.All.dataAgregarRuta(user, ruta, fecha, nombreRuta, origen, destino);
            return Content("success");
     
        }
        
        [HttpPost]
        public ActionResult envioPeticionRuta(String user, int ruta, String nombreRuta, String fecha, String inicioRuta, String finRuta, String posicion)
        {
            DawEntities database = new DawEntities();
            ruta rutaUsuario = database.ruta.First(i => i.id_ruta == ruta);
            usuario usuarioE = database.usuario.First(i => i.nombUsuario == user);

            String[] dias = fecha.Split('-');
          
            DateTime tm = new DateTime(int.Parse(dias[0]), int.Parse(dias[1]), int.Parse(dias[2]),0, 0, 0);
            
            /*
            tm.AddSeconds(double.Parse(horas[2]));
            tm.AddMinutes(double.Parse(horas[1]));
            tm.AddHours(double.Parse(horas[0]));
            tm.AddDays(double.Parse(dias[0]));
            tm.AddMonths(int.Parse(dias[1]));
            tm.AddYears(int.Parse(dias[2]));
            */
            peticion p = new peticion();
            p.id_usuario = usuarioE.id_usuario;
            p.id_ruta = rutaUsuario.id_ruta;
            p.fecha = tm;
            p.estado = "ESPERA";
            p.posicionLatLon = posicion;
            database.peticion.Add(p);
            database.SaveChanges();

         

            var context = GlobalHost.ConnectionManager.GetHubContext<PeticionesHub>();
            context.Clients.All.envioPeticionRuta(user, ruta,nombreRuta, fecha, inicioRuta,finRuta,posicion);
            return Content("success");
        }

        [HttpPost]
        public ActionResult aceptarPeticion(String user, int ruta, String aceptacion)
        {
            DawEntities database = new DawEntities();
            usuario usuarioE = database.usuario.First(i => i.nombUsuario == user);
            peticion p = database.peticion.First(i => i.id_ruta == ruta &&  i.id_usuario == usuarioE.id_usuario); ;
         

            if(aceptacion=="aceptar"){
                p.estado="ACEPTADA";
            }else if(aceptacion=="rechazar"){
                p.estado="RECHAZADA";
            }
           
            database.SaveChanges();
           

                var context = GlobalHost.ConnectionManager.GetHubContext<PeticionesHub>();
                context.Clients.All.aceptarPeticion(user, ruta, aceptacion);
            return Content("success");
        }



        [HttpPost]
        public ActionResult seguirUsuario(String sig, String seg, String estado)
        {
            DawEntities database = new DawEntities();
            usuario sigE = database.usuario.First(i => i.nombUsuario == sig);
            usuario segE = database.usuario.First(i => i.nombUsuario == seg);

            
            if (estado == "dejar")
            {
                 seguidorusuario segui = database.seguidorusuario.First(i => i.sigue == sigE.id_usuario && i.seguido==segE.id_usuario);
                 database.seguidorusuario.Remove(segui);
               
            }
            else if (estado == "seguir")
            {
              seguidorusuario segui = new seguidorusuario();
                segui.sigue = sigE.id_usuario;
                segui.seguido = segE.id_usuario;
                database.seguidorusuario.Add(segui);
            }

            database.SaveChanges();

            return Content("success");
        }
    }
}
