using System;
namespace Application.Activities
{
    public class AttendeeDto
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Image { get; set; }
        public Boolean IsHost { get; set; }
        public Boolean Following { get; set; }
    }
}