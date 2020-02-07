using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
   public class Edit
   {
      public class Command : IRequest
      {
         public string DisplayName { get; set; }
         public string Bio { get; set; }

      }

      public class CommandValidator : AbstractValidator<Command>
      {
         public CommandValidator()
         {
            RuleFor(x => x.DisplayName).NotEmpty();
         }
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
            var userName = _userAccessor.GetCurrentUsername();
            var user = await _context.Users.SingleOrDefaultAsync(u =>
                u.UserName == userName);

            if (user == null)
               throw new RestException(HttpStatusCode.NotFound, new { Profile = "Not Found" } );

            user.Bio = request.Bio;
            user.DisplayName = request.DisplayName;

            // handler logic goes here
            var success = await _context.SaveChangesAsync() > 0;

            if (success) return Unit.Value;

            throw new Exception("Problem saving data");
         }
      }
   }
}