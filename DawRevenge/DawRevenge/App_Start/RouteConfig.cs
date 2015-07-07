using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using DawRevenge.Controllers;

namespace DawRevenge
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");


            //------------------------ Mapeo de Cuenta ----------------------*/

            routes.MapRoute(
                name: "CuentaPage",
                url: "perfil",
                defaults: new { controller = "Cuenta", action = "Cuenta", id = UrlParameter.Optional }
            );

            //------------------------ Mapeo de Buscar ----------------------*/

            routes.MapRoute(
                name: "infoPerfilUsuario",
                url: "infoPerfilUsuario",
                defaults: new { controller = "Buscar", action = "InfoPerfilUsuario", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "BuscarAmigos",
                url: "busquedaAmigos",
                defaults: new { controller = "Buscar", action = "BuscarAmigos", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "BuscarPage",
                url: "amigos",
                defaults: new { controller = "Buscar", action = "Buscar", id = UrlParameter.Optional }
            );
             routes.MapRoute(
                name: "ComentariosUsuario",
                url: "comentariosUsuario",
                defaults: new { controller = "Buscar", action = "Comentarios", id = UrlParameter.Optional }
            );
            
            //------------------------ Mapeo de Seguidores ----------------------*/

            routes.MapRoute(
                name: "SeguidoresPage",
                url: "seguidores",
                defaults: new { controller = "Seguidores", action = "Seguidores", id = UrlParameter.Optional }
            );

            //------------------------ Mapeo de Siguiendo ----------------------*/

            routes.MapRoute(
                name: "SiguiendoPage",
                url: "siguiendo",
                defaults: new { controller = "Siguiendo", action = "Siguiendo", id = UrlParameter.Optional }
            );

            //------------------------ Mapeo del Main ----------------------*/

            routes.MapRoute(
                name: "agregarComentario",
                url: "agregarComentario",
                defaults: new { controller = "Main", action = "agregarComentario", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "agregarRuta",
                url: "agregarRuta",
                defaults: new { controller = "Main", action = "agregarRuta", id = UrlParameter.Optional }
            );


            routes.MapRoute(
                name: "envioPeticionRuta",
                url: "envioPeticionRuta",
                defaults: new { controller = "Main", action = "envioPeticionRuta", id = UrlParameter.Optional }
            );
            
                routes.MapRoute(
                name: "aceptarPeticion",
                url: "aceptarPeticion",
                defaults: new { controller = "Main", action = "aceptarPeticion", id = UrlParameter.Optional }
            );

              routes.MapRoute(
                name: "seguirUsuario",
                url: "seguirUsuario",
                defaults: new { controller = "Main", action = "seguirUsuario", id = UrlParameter.Optional }
            );
            routes.MapRoute(
                name: "MainPage",
                url: "main",
                defaults: new { controller = "Main", action = "Main", id = UrlParameter.Optional }
            );

            
            //------------------------ Mapeo del Index ----------------------*/

            routes.MapRoute(
                name: "RegistrarUsuario",
                url: "registro",
                defaults: new { controller = "Index", action = "RegistrarUsuario", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "EspolNombresUsuario",
                url: "datosuser",
                defaults: new { controller = "Index", action = "EspolFullName", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "EspolAuth",
                url: "usuario",
                defaults: new { controller = "Index", action = "EspolAuth", id = UrlParameter.Optional }
            );
            
            routes.MapRoute(
                name: "Login",
                url: "login",
                defaults: new { controller = "Index", action = "Login", id = UrlParameter.Optional }
            );

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Index", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}