namespace NCTDreamCrudApi.Models;

/// <summary>
/// Bentuk response error yang seragam agar frontend (Angular) mudah membacanya.
/// Bentuknya sengaja dibuat sederhana, tidak rumit.
/// </summary>
public class ErrorResponse
{
    /// <summary>
    /// Pesan error yang bisa dibaca manusia.
    /// </summary>
    public string Message { get; set; } = string.Empty;

    /// <summary>
    /// Status HTTP error, misalnya 404 atau 500.
    /// </summary>
    public int Status { get; set; }
}