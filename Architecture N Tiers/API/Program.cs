using Projet.BLL.Contract;
using Projet.BLL;
using Projet.Context;
using Projet.DAL;
using Projet.DAL.Contracts;
using Projet.Entities;
using Projet.Services.Interfaces;
using Projet.DAL.Repos;
using Projet.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ===========================
// 1️⃣ Connection à la base
// ===========================
var Cnx = builder.Configuration.GetConnectionString("ConnectionString");
builder.Services.AddDbContext<DataContext>(options =>
    options.UseSqlServer(Cnx, b => b.MigrationsAssembly("API")));

// ===========================
// 2️⃣ Services et repositories
// ===========================
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddSingleton<JwtService>();
builder.Services.AddScoped<DataContext>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IGenericBLL<User>, GenericBLL<User>>();
builder.Services.AddScoped<IRepository<User>, UserRepository>();

// ===========================
// 3️⃣ JWT Authentication
// ===========================
var jwtSettings = builder.Configuration.GetSection("Jwt");
var key = Encoding.ASCII.GetBytes(jwtSettings["Key"]);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtSettings["Issuer"],
        ValidAudience = jwtSettings["Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(key),
        ClockSkew = TimeSpan.Zero
    };
});

// ===========================
// 4️⃣ Controllers & Swagger
// ===========================
builder.Services.AddControllers();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo { Title = "Projet DOTNET", Version = "v1" });
});
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact",
        policy =>
        {
            policy
                .WithOrigins("http://localhost:3000", "http://localhost:3001")
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});




var app = builder.Build();

// ===========================
// 5️⃣ Middleware pipeline
// ===========================
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Projet DOTNET v1");
});

app.UseHttpsRedirection();

app.UseAuthentication(); 
app.UseAuthorization();
app.UseCors("AllowReact");

app.MapControllers();

app.Run();
