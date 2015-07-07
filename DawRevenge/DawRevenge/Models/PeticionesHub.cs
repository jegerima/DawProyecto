using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.SignalR;
using DawRevenge.Models;

namespace DawRevenge.Models
{
    public class PeticionesHub : Hub
    {


       public void Send(String user, int ruta, String aceptacion)
        {
            Clients.All.aceptarPeticion(user, ruta, aceptacion);
       }

        public void Send(String user, int ruta, String nombreRuta, String fecha, String inicioRuta,String finRuta, String posicion)
        {
            Clients.All.envioPeticionRuta(user, ruta, nombreRuta, fecha, inicioRuta,finRuta, posicion);
        }


    }
}