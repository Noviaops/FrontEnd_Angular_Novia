using System.Text.Json.Serialization;

namespace NCTDreamCrudApi.Models;

/// <summary>
/// Model Todo yang mengikuti struktur data pada JSONPlaceholder:
/// https://jsonplaceholder.typicode.com/todos/
///
/// Contoh JSON dari JSONPlaceholder:
/// {
///   "userId": 1,
///   "id": 1,
///   "title": "delectus aut autem",
///   "completed": false
/// }
/// </summary>
public class Todo
{
    /// <summary>
    /// ID user pemilik todo (dari JSONPlaceholder, nilainya 1 sampai 10).
    /// Di backend ini tipe datanya integer (int).
    /// </summary>
    [JsonPropertyName("userId")]
    public int UserId { get; set; }

    /// <summary>
    /// ID unik todo. Di backend ini tipe datanya integer (int).
    /// </summary>
    [JsonPropertyName("id")]
    public int Id { get; set; }

    /// <summary>
    /// Judul todo. Di backend ini tipe datanya string.
    /// </summary>
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Status todo sudah selesai atau belum.
    /// Di backend ini tipe datanya boolean (bool): true atau false.
    /// </summary>
    [JsonPropertyName("completed")]
    public bool Completed { get; set; }
}