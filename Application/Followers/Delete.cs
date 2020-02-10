using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
   public class Delete
   {
      public class Command : IRequest
      {
         public string UserName { get; set; }
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
            var observer = await _context.Users.SingleOrDefaultAsync(
                u => u.UserName == _userAccessor.GetCurrentUsername());

            var target = await _context.Users.SingleOrDefaultAsync(
                x => x.UserName == request.UserName);

            if (target == null)
               throw new RestException(HttpStatusCode.NotFound, new { User = "Not Found" });

            var following = await _context.Followings.SingleOrDefaultAsync(
                f => f.ObserverId == observer.Id && f.TargetId == target.Id);

            if (following == null)
               throw new RestException(HttpStatusCode.BadRequest,
                   new { User = $"You are not following {target.DisplayName}." });


            _context.Followings.Remove(following);
            // handler logic goes here
            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving data");
         }
      }
   }
}