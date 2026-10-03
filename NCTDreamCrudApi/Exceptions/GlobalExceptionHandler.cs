using Microsoft.AspNetCore.Diagnostics;
using NCTDreamCrudApi.Models;

namespace NCTDreamCrudApi.Exceptions;

/// <summary>
/// Penangkap error global.
/// Tugasnya satu saja: mengubah error yang tidak terduga menjadi response JSON
/// sederhana dengan status 500 Internal Server Error, sehingga frontend Angular
/// selalu menerima response berbentuk JSON (bukan halaman HTML error).
///
/// Daftarkan di Program.cs dengan:
/// builder.Services.AddExceptionHandler lalu app.UseExceptionHandler();
/// </summary>
public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(
        HttpContext httpContext,
        Exception exception,
        CancellationToken cancellationToken)
    {
        _logger.LogError(exception, "Terjadi kesalahan tak terduga saat memproses request.");

        httpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
        httpContext.Response.ContentType = "application/json";

        var errorResponse = new ErrorResponse
        {
            Message = "Terjadi kesalahan pada server. Silakan coba lagi.",
            Status = StatusCodes.Status500InternalServerError
        };

        await httpContext.Response.WriteAsJsonAsync(errorResponse, cancellationToken);

        // Mengembalikan true berarti error sudah ditangani dan tidak perlu
        // diteruskan ke middleware lain.
        return true;
    }
}