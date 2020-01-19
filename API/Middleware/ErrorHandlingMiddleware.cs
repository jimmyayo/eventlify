using System.Net.Http.Headers;
using System.Net;
using System;
using System.Threading.Tasks;
using Application.Errors;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System.Text.Json;

namespace API.Middleware
{
   public class ErrorHandlingMiddleware
   {
      public RequestDelegate _next { get; }
      public ILogger<ErrorHandlingMiddleware> _logger { get; }
      public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
      {
         this._logger = logger;
         this._next = next;
      }

      public async Task Invoke(HttpContext context)
      {
         try
         {
            await _next(context);
         }
         catch (Exception ex)
         {
            await HandleExceptionAsync(context, ex, _logger);
         }
      }

      private async Task HandleExceptionAsync(
         HttpContext context, 
         Exception ex, 
         ILogger<ErrorHandlingMiddleware> logger)
      {
         object errors = null;

         switch (ex)
         {
            case RestException re:
               logger.LogError(ex, "REST ERROR");
               errors = re.Errors;
               context.Response.StatusCode = (int)re.Code;
               break;
            case Exception e:
               logger.LogError(ex, "SERVER ERROR");
               errors = string.IsNullOrWhiteSpace(e.Message) ? "Error" : e.Message;
               context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
               break;
         }

         context.Response.ContentType = "application/json";
         if (errors != null)
         {
            var result = JsonSerializer.Serialize(new { errors });
            await context.Response.WriteAsync(result);
         }
      }
   }
}