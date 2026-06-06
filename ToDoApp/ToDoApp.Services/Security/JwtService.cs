using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using ToDoApp.Entities.Entities;

namespace ToDoApp.Services.Security
{
    public class JwtService : IJwtService
    {
        private readonly IConfiguration _configuration;

        public JwtService(IConfiguration configuration)
        {
            _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        }

        public string GenerateToken(User user)
        {
            if (user == null)
                throw new ArgumentNullException(nameof(user));

            // WARNING: The fallback secret key is only intended for local development.
            // Using it in production can compromise application security. Ensure Jwt:Key is set in production settings.
            var keyStr = _configuration["Jwt:Key"] ?? "a_very_long_and_secure_default_secret_key_for_todoapp_project_2026";
            var issuer = _configuration["Jwt:Issuer"] ?? "ToDoApp";
            var audience = _configuration["Jwt:Audience"] ?? "ToDoAppUsers";
            var expireMinutesStr = _configuration["Jwt:ExpireMinutes"] ?? "1440"; // Default to 24 hours

            if (!int.TryParse(expireMinutesStr, out var expireMinutes))
            {
                expireMinutes = 1440;
            }

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyStr));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.Name)
            };

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddMinutes(expireMinutes),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = credentials
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);

            return tokenHandler.WriteToken(token);
        }
    }
}
