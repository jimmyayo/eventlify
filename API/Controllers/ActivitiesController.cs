using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
   public class ActivitiesController : BaseController
   {

      [HttpGet]
      public async Task<ActionResult<List<ActivityDto>>> List()
      {
         return await Mediator.Send(new List.Query());
      }

      [Authorize]
      [HttpGet("{id}")]
      public async Task<ActionResult<ActivityDto>> Details(Guid id)
      {
         return await Mediator.Send(new Details.Query { Id = id });
      }

      [HttpPost]
      public async Task<ActionResult<Unit>> Create(Create.Command command)
      {
         return await Mediator.Send(command);
      }

      [HttpPut("{Id}")]
      public async Task<ActionResult<Unit>> Edit(Guid Id, Edit.Command command)
      {
         command.Id = Id;
         return await Mediator.Send(command);
      }

      [HttpDelete("{Id}")]
      public async Task<ActionResult<Unit>> Delete(Guid id)
      {
         return await Mediator.Send(new Delete.Command { Id = id });
      }

      [HttpPost("{Id}/attend")]
      public async Task<ActionResult<Unit>> Attend(Guid id)
      {
         return await Mediator.Send(new Attend.Command { Id = id });
      }

      [HttpDelete("{Id}/attend")]
      public async Task<ActionResult<Unit>> Unattend(Guid id)
      {
         return await Mediator.Send(new Unattend.Command {Id = id});
      }

   }
}