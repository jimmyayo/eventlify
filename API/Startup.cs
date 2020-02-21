using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Persistence;
using Microsoft.EntityFrameworkCore;
using MediatR;
using Application.Activities;
using FluentValidation.AspNetCore;
using API.Middleware;
using Domain;
using Microsoft.AspNetCore.Identity;
using Infrastructure.Security;
using Application.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using AutoMapper;
using Infrastructure.Photos;
using API.SignalR;
using Application.Profiles;
using System;

namespace API
{
   public class Startup
   {
      public Startup(IConfiguration configuration)
      {
         Configuration = configuration;
      }

      public IConfiguration Configuration { get; }

      // This method gets called by the runtime. Use this method to add services to the container.
      public void ConfigureServices(IServiceCollection services)
      {
         services.AddControllers(opt =>
         {
            var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
            opt.Filters.Add(new AuthorizeFilter(policy));
         })
        .AddFluentValidation(cfg =>
        {
           cfg.RegisterValidatorsFromAssemblyContaining<Create>();
        });

         services.AddDbContext<DataContext>(opt =>
         {
            opt.UseLazyLoadingProxies();
            opt.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
         });

         // Need to add CorsPolicy so the ReactUI can receive responses from WebAPI, which is 
         // running on different host/port
         services.AddCors(opt =>
         {
            opt.AddPolicy("CorsPolicy", policy =>
            {
               policy.AllowAnyHeader()
                     .WithExposedHeaders("WWW-Authenticate")
                     .AllowAnyMethod()
                     .WithOrigins("http://localhost:3000")
                     .AllowCredentials();
            });
         });
         services.AddMediatR(typeof(List.Handler).Assembly);
         services.AddAutoMapper(typeof(List.Handler).Assembly);
         services.AddSignalR();

         var builder = services.AddIdentityCore<AppUser>();
         var identityBuilder = new IdentityBuilder(builder.UserType, builder.Services);
         identityBuilder.AddEntityFrameworkStores<DataContext>();
         identityBuilder.AddSignInManager<SignInManager<AppUser>>();

         services.AddAuthorization(opt =>
         {
            opt.AddPolicy("IsActivityHost", policy =>
            {
               policy.Requirements.Add(new IsHostRequirement());
            });
         });
         services.AddTransient<IAuthorizationHandler, IsHostRequirementHandler>();

         var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenKey"]));

         services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
             .AddJwtBearer(opt =>
             {
                opt.TokenValidationParameters = new TokenValidationParameters
                {
                   ValidateIssuerSigningKey = true,
                   IssuerSigningKey = key,
                   ValidateAudience = false,
                   ValidateIssuer = false,
                   ValidateLifetime = true,
                   ClockSkew = TimeSpan.Zero
                };
                opt.Events = new JwtBearerEvents
                {
                   OnMessageReceived = context =>
                   {
                      var accessToken = context.Request.Query["access_token"];
                      var path = context.HttpContext.Request.Path;
                      if (!string.IsNullOrEmpty(accessToken) && path.StartsWithSegments("/chat"))
                      {
                         context.Token = accessToken;
                      }
                      return Task.CompletedTask;
                   }
                };
             });
         //services.TryAddSingleton<ISystemClock, SystemClock>();
         services.AddScoped<IJwtGenerator, JwtGenerator>();
         services.AddScoped<IUserAccessor, UserAccessor>();
         services.AddScoped<IPhotoAccessor, PhotoAccessor>();
         services.AddScoped<IProfileReader, ProfileReader>();
         services.Configure<CloudinarySettings>(Configuration.GetSection("Cloudinary"));
      }

      // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
      public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
      {
         app.UseMiddleware<ErrorHandlingMiddleware>();
         if (env.IsDevelopment())
         {
            //app.UseDeveloperExceptionPage();
         }

         // app.UseHttpsRedirection();

         app.UseDefaultFiles();
         app.UseStaticFiles();

         app.UseRouting();

         app.UseCors("CorsPolicy");

         app.UseAuthentication();

         app.UseAuthorization();


         app.UseEndpoints(endpoints =>
         {
            endpoints.MapControllers();
            endpoints.MapHub<ChatHub>("/chat");
            endpoints.MapFallbackToController("Index", "Fallback");
         });
      }
   }
}
