using System.Linq;
using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;
using Application.Errors;
using System.Net;

namespace Application.Photos
{
   public class SetMain
   {
      public class Command : IRequest
      {
         public string Id { get; set; }
      }

      public class Handler : IRequestHandler<Command>
      {
         private readonly DataContext _context;
         private readonly IUserAccessor _userAccessor;
         public Handler(DataContext context, IUserAccessor userAccessor)
         {
            _userAccessor = userAccessor;
            _context = context;
         }

         public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
         {
            var user = await _context.Users.SingleOrDefaultAsync(u =>
                u.UserName == _userAccessor.GetCurrentUsername());

            var photo = user.Photos.FirstOrDefault(x => x.Id == request.Id);

            if (photo == null)
               throw new RestException(HttpStatusCode.NotFound, new { Photos = "not found" });

            var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);
            currentMain.IsMain = false;
            photo.IsMain = true;

            // handler logic goes here
            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving data");
         }
      }
   }
}