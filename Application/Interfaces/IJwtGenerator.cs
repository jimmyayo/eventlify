using Domain;

namespace Application.Interfaces
{
    public interface IJwtGenerator
    {
        string CreateToke(AppUser user);
    }
}