using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NCTDreamCrudApi.Models;

/// <summary>
/// DTO (Data Transfer Object) untuk proses UPDATE (PUT).
///
/// Pada proses UPDATE, ID todo sudah diketahui karena dikirim lewat URL
/// (/api/todos/{id}), jadi field Id tidak perlu ada di body.
/// </summary>
public class TodoUpdateDto
{
    /// <summary>
    /// ID user pemilik todo. Wajib diisi dan hanya boleh 1 sampai 10.
    /// </summary>
    [JsonPropertyName("userId")]
    [Range(1, 10, ErrorMessage = "userId harus bernilai antara 1 sampai 10.")]
    public int UserId { get; set; }

    /// <summary>
    /// Judul todo baru. Wajib diisi dan maksimal 200 karakter.
    /// </summary>
    [JsonPropertyName("title")]
    [Required(ErrorMessage = "title wajib diisi.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "title wajib diisi dan maksimal 200 karakter.")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Status baru: sudah selesai (true) atau belum (false).
    /// </summary>
    [JsonPropertyName("completed")]
    public bool Completed { get; set; }
}