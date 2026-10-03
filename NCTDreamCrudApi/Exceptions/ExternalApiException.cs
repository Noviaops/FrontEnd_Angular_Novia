namespace NCTDreamCrudApi.Exceptions;

/// <summary>
/// Exception khusus yang dilempar TodoService ketika JSONPlaceholder
/// mengembalikan HTTP error (misalnya 404 atau 500) atau tidak dapat diakses.
///
/// Controller menangkap exception ini lalu mengubahnya menjadi response error
/// yang mudah dipahami (400 / 502), bukan 500 yang membingungkan.
/// </summary>
public class ExternalApiException : Exception
{
    public ExternalApiException(string message, System.Net.HttpStatusCode statusCode, string? responseBody = null)
        : base(message)
    {
        StatusCode = statusCode;
        ResponseBody = responseBody;
    }

    /// <summary>
    /// Status HTTP yang dikembalikan oleh JSONPlaceholder.
    /// </summary>
    public System.Net.HttpStatusCode StatusCode { get; }

    /// <summary>
    /// Body response asli dari JSONPlaceholder (jika ada). Dipakai untuk logging.
    /// </summary>
    public string? ResponseBody { get; }
}