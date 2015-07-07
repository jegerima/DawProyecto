using Microsoft.Owin;
using Owin;
using System;
using System.Threading.Tasks;
using DawRevenge;

[assembly: OwinStartup(typeof(DawRevenge.Models.Startup))]

namespace DawRevenge.Models
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
