using System.Net;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Errors;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.User
{
   public class Register
   {
      public class Command : IRequest<User>
      {
         public string DisplayName { get; set; }
         public string UserName { get; set; }
         public string Email { get; set; }
         public string Password { get; set; }
      }

      public class CommandValidator : AbstractValidator<Command>
      {
         public CommandValidator()
         {
            RuleFor(x => x.DisplayName).NotEmpty();
            RuleFor(x => x.UserName).NotEmpty();
            RuleFor(x => x.Email).NotEmpty();
            RuleFor(x => x.Password).NotEmpty();
         }
      }

      public class Handler : IRequestHandler<Command, User>
      {
         private readonly DataContext _context;
         private readonly UserManager<AppUser> _userManager;
         private readonly IJwtGenerator _jwtGenerator;
         public Handler(DataContext context, UserManager<AppUser> userManager, IJwtGenerator jwtGenerator)
         {
            _jwtGenerator = jwtGenerator;
            _userManager = userManager;
            _context = context;
         }
         public async Task<User> Handle(Command request, CancellationToken cancellationToken)
         {
            if (await _context.Users.Where(u => u.Email == request.Email).AnyAsync())
               throw new RestException(HttpStatusCode.BadRequest, new { Email = "Email already exists" });

            if (await _context.Users.Where(u => u.UserName == request.UserName).AnyAsync())
               throw new RestException(HttpStatusCode.BadRequest, new { UserName = "UserName already exists" });

            var user = new AppUser 
            {
                DisplayName = request.DisplayName,
                Email = request.Email,
                UserName = request.UserName
            };


            // handler logic goes here
            var result = await _userManager.CreateAsync(user, request.Password);
            if (result.Succeeded)
            {
                return new User
                {
                    DisplayName = user.DisplayName,
                    Token = _jwtGenerator.CreateToken(user),
                    UserName = user.UserName,
                    Image = null
                };
            }
            //var success = await _context.SaveChangesAsync() > 0;

            throw new Exception("Problem creating user");
         }
      }
   }
}