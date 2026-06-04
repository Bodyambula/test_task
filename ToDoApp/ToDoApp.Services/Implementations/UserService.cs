using System;
using System.Threading;
using System.Threading.Tasks;
using ToDoApp.Entities.Entities;
using ToDoApp.Entities.Interfaces;
using ToDoApp.Models.User;
using ToDoApp.Services.Exceptions;
using ToDoApp.Services.Interfaces;
using ToDoApp.Services.Security;

namespace ToDoApp.Services.Implementations
{
    public class UserService : IUserService
    {
        private readonly IUnitOfWork _unitOfWork;
        private readonly IJwtService _jwtService;

        public UserService(IUnitOfWork unitOfWork, IJwtService jwtService)
        {
            _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
            _jwtService = jwtService ?? throw new ArgumentNullException(nameof(jwtService));
        }

        public async Task<AuthResponseDto> RegisterAsync(RegisterModel model, CancellationToken cancellationToken = default)
        {
            if (model == null)
                throw new BadRequestException("Registration details cannot be null.");

            // Check if user already exists
            var existingUser = await _unitOfWork.Users.GetByEmailAsync(model.Email, cancellationToken);
            if (existingUser != null)
                throw new BadRequestException($"User with email '{model.Email}' already exists.");

            // Hash password
            var passwordHash = PasswordHasher.HashPassword(model.Password);

            // Create user entity
            var user = new User
            {
                Email = model.Email,
                Name = model.Name,
                PasswordHash = passwordHash
            };

            await _unitOfWork.Users.AddAsync(user, cancellationToken);
            await _unitOfWork.SaveChangesAsync(cancellationToken);

            // Generate JWT Token
            var token = _jwtService.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                Name = user.Name
            };
        }

        public async Task<AuthResponseDto> LoginAsync(LoginModel model, CancellationToken cancellationToken = default)
        {
            if (model == null)
                throw new BadRequestException("Login details cannot be null.");

            // Get user by email
            var user = await _unitOfWork.Users.GetByEmailAsync(model.Email, cancellationToken);
            if (user == null || !PasswordHasher.VerifyPassword(model.Password, user.PasswordHash))
                throw new UnauthorizedException("Invalid email or password.");

            // Generate JWT Token
            var token = _jwtService.GenerateToken(user);

            return new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                Name = user.Name
            };
        }
    }
}
