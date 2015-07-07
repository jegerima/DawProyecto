using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using Microsoft.Owin;
using Owin;
using DawRevenge;

[assembly: OwinStartup(typeof(DawRevenge.Models.Startup1))]
namespace DawRevenge.Models
{
    public class Startup1
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}