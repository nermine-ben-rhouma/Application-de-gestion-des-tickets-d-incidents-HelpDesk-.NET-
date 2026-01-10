using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.FileProviders;
using System;

public class FakeWebHostEnvironment : IWebHostEnvironment
{
    public string ApplicationName { get; set; } = "TestApp";
    public IFileProvider ContentRootFileProvider { get; set; }
    public string ContentRootPath { get; set; } = AppContext.BaseDirectory;
    public string EnvironmentName { get; set; } = "Development";
    public string WebRootPath { get; set; } = AppContext.BaseDirectory;
    public IFileProvider WebRootFileProvider { get; set; }
}
