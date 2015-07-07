using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using Microsoft.AspNet.SignalR;
using DawRevenge.Models;

namespace DawRevenge.Models
{
    public class RutasHub : Hub
    {


        public void Send(String user, int ruta, String fecha, String nombreRuta, String origen, String destino)
        {
            Clients.All.dataAgregarRuta(user, ruta, fecha, nombreRuta, origen, destino);
       }

       

    }
}