using System.Net;
using System.Collections;
using System;
using Domain;
using MediatR;
using System.Threading.Tasks;
using System.Threading;
using Persistence;
using Application.Errors;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace Application.Activities
{
   public class Details
   {
      public class Query : IRequest<ActivityDto>
      {
         public Guid Id { get; set; }
      }

      public class Handler : IRequestHandler<Query, ActivityDto>
      {
         private DataContext _context { get; set; }
         private readonly IMapper _mapper;
         public Handler(DataContext context, IMapper mapper)
         {
            _mapper = mapper;
            _context = context;
         }

         public async Task<ActivityDto> Handle(Query request, CancellationToken cancellationToken)
         {
            var activity = await _context.Activities
               .FindAsync(request.Id);

            if (activity == null)
               throw new RestException(HttpStatusCode.NotFound, new { activity = "Not found" });

            var activityDto = _mapper.Map<Activity, ActivityDto>(activity);
            return activityDto;
         }
      }
   }
}