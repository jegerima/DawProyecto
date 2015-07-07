using System;
using System.Xml;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Data;
using DawRevenge.Models;

namespace DawRevenge.Controllers
{
    public class IndexController : Controller
    {
        //
        // GET: /Index/
        // POST: /login/

        public ActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Login(String user , String pasw) 
        {
            DawEntities dawDB = new DawEntities();
            List<usuario> list_users = dawDB.usuario.ToList();

            foreach (usuario usr in list_users)
            {
                if(usr.nombUsuario == user && usr.contrasenia == pasw)
                    return Content("success");
            }
            return Content("fail");
        }

        [HttpPost]
        public ActionResult EspolAuth(String user, String pasw)
        {
            EspolWS.wsandroidSoapClient ws = new EspolWS.wsandroidSoapClient();
            bool res = ws.autenticacion(user, pasw);
            
            if(res)
                return Content("success");
            else
                return Content("fail");
        }

        [HttpPost]
        public ActionResult EspolFullName(String user)
        {
            EspolWS.wsandroidSoapClient ws = new EspolWS.wsandroidSoapClient();
            DataSet res = ws.wsConsultaCodigoEstudiante(user);
            DataRow dr = res.Tables[0].Rows[0];//MATRICULA
            String matricula = dr["COD_ESTUDIANTE"].ToString();

            res = ws.wsInfoEstudiante(matricula);
            dr = res.Tables[0].Rows[0];//INFOESTUDIANTE
            String FullName = dr["NOMBRECOMPLETO"].ToString();

            return Content(FullName);
        }

        [HttpPost]
        public ActionResult RegistrarUsuario(String userESPOL, String newPassword, String newNombre, String newApellido, String placa)
        {
            DawEntities dawDB = new DawEntities();
            List<usuario> list_users = dawDB.usuario.ToList();

            foreach(usuario usuario in list_users)
            {
                if (usuario.nombUsuario == userESPOL)
                    return Content("<script>alert('Usuario ya existe!');location='/2014_1T/Grupo11/index/';</script>");
            }

            EspolWS.wsandroidSoapClient ws = new EspolWS.wsandroidSoapClient();
            DataSet res = ws.wsConsultaCodigoEstudiante(userESPOL);
            DataRow dr = res.Tables[0].Rows[0];//MATRICULA
            String matricula = dr["COD_ESTUDIANTE"].ToString();

            usuario usr = new usuario();

            int carro = 0;
            if(placa!=null)
                carro = 1;

            usr.nombres = newNombre;
            usr.apellidos = newApellido;
            usr.nombUsuario = userESPOL;
            usr.contrasenia = newPassword;
            usr.matricula = matricula;
            usr.tieneCarro = carro;
            usr.nSeguidores = 0;
            usr.nSiguiendo = 0;

            dawDB.usuario.Add(usr);
            int cambios = dawDB.SaveChanges();
            return Content("<script>alert('Usuario registrado exitosamente!');location='/2014_1T/Grupo11/index/';</script>");
        }
    }
}
