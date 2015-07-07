using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using DawRevenge.Models;

namespace DawRevenge.Models
{
    public class ComentariosHub : Hub
    {
        public void Send(String user, String coment, String fecha)
        {
            Clients.All.agregarComentario(user, coment, fecha);
        }
    }
}