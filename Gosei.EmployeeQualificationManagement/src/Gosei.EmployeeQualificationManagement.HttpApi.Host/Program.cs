using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;

namespace Gosei.EmployeeQualificationManagement;

public class Program
{
    public async static Task<int> Main(string[] args)
    {
        Log.Logger = new LoggerConfiguration()
            .WriteTo.Async(c => c.File("Logs/logs.txt"))
            .WriteTo.Async(c => c.Console())
            .CreateBootstrapLogger();

        try
        {
            Log.Information("Starting Gosei.EmployeeQualificationManagement.HttpApi.Host.");
            var builder = WebApplication.CreateBuilder(args);
            builder.Host
                .AddAppSettingsSecretsJson()
                .UseAutofac()
                .UseSerilog((context, services, loggerConfiguration) =>
                {
                    loggerConfiguration
                        // 1. ĐẶT MỨC TỔNG THỂ LÀ INFORMATION
                        .MinimumLevel.Information()
                        // 2. TẮT TẤT CẢ LOG NHIỄU CHUNG
                        .MinimumLevel.Override("Microsoft", LogEventLevel.Fatal)
                        .MinimumLevel.Override("System", LogEventLevel.Fatal)
                        .MinimumLevel.Override("Volo.Abp", LogEventLevel.Fatal)
                        .MinimumLevel.Override("Microsoft.EntityFrameworkCore", LogEventLevel.Error)

                        // 3. MỞ LẠI LOG SQL COMMAND
                        .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command", LogEventLevel.Information)
                        // 4. THÊM FILTER ĐỂ LOẠI TRỪ LOG SQL CỦA WORKER
                        .Filter.ByExcluding(logEvent =>
                        {
                            // Chỉ áp dụng filter cho Log SQL
                            if (logEvent.Properties.TryGetValue("SourceContext", out var sourceContext) &&
                                sourceContext.ToString().Contains("Microsoft.EntityFrameworkCore.Database.Command"))
                            {
                                // Lấy nội dung message (lệnh SQL)
                                var message = logEvent.RenderMessage();

                                // Loại trừ các truy vấn định kỳ (Chứa các tên bảng của Worker)
                                if (message.Contains("AbpBackgroundJobs") ||
                                    message.Contains("AbpSettings") ||
                                    message.Contains("AbpFeature") ||
                                    message.Contains("AbpPermission") || 
                                    message.Contains("AbpRoles"))
                                {
                                    return true; // Loại trừ (Exclude) log này
                                }
                            }
                            return false; // Giữ lại (Include) log này
                        })

                        .Enrich.FromLogContext()
                        .WriteTo.Async(c => c.File("Logs/logs.txt", restrictedToMinimumLevel: LogEventLevel.Fatal))
                        .WriteTo.Async(c => c.Console())
                        .WriteTo.Async(c => c.AbpStudio(services));
                });
            await builder.AddApplicationAsync<EmployeeQualificationManagementHttpApiHostModule>();
            var app = builder.Build();
            await app.InitializeApplicationAsync();
            await app.RunAsync();
            return 0;
        }
        catch (Exception ex)
        {
            if (ex is HostAbortedException)
            {
                throw;
            }

            Log.Fatal(ex, "Host terminated unexpectedly!");
            return 1;
        }
        finally
        {
            Log.CloseAndFlush();
        }
    }
}
