using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Projet.Entities;

public class JwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(int userId, Role role)
    {
        if (role == null)
            throw new ArgumentNullException(nameof(role), "Le rôle ne peut pas être null");

        // 1️⃣ Clé secrète
        var key = Encoding.ASCII.GetBytes(_config["Jwt:Key"]);

        // 2️⃣ Claims : on met l'Id utilisateur et le nom du rôle
        var claims = new[]
        {
            new Claim("Id", userId.ToString()),
            new Claim(ClaimTypes.Role, role.NomRole)
        };

        // 3️⃣ Création du token
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpireMinutes"])),
            Issuer = _config["Jwt:Issuer"],
            Audience = _config["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(
                new SymmetricSecurityKey(key),
                SecurityAlgorithms.HmacSha256Signature)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(token);
    }
}
