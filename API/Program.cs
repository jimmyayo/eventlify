using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;
using Persistence;
using Microsoft.EntityFrameworkCore;
using Domain;
using Microsoft.AspNetCore.Identity;

namespace API
{
   public class Program
   {
      public static void Main(string[] args)
      {
         var host = CreateWebHostBuilder(args).Build();

         using (var scope = host.Services.CreateScope())
         {
            var services = scope.ServiceProvider;
            var logger = services.GetRequiredService<ILogger<Program>>();
            try
            {
               var context = services.GetRequiredService<DataContext>();
               var userManager = services.GetRequiredService<UserManager<AppUser>>();
               context.Database.Migrate();
               Seed.SeedData(context, userManager).Wait();
            }
            catch (Exception ex)
            {
               logger.LogError(ex, "Error occurred during startup DBmigration");
            }
         }

         host.Run();
      }

      public static IWebHostBuilder CreateWebHostBuilder(string[] args) =>
          WebHost.CreateDefaultBuilder(args).UseStartup<Startup>();
   }
}
