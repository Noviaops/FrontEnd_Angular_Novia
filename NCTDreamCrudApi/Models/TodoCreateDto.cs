using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace NCTDreamCrudApi.Models;

/// <summary>
/// DTO (Data Transfer Object) untuk proses CREATE (POST).
///
/// Kenapa memakai DTO dan bukan model Todo langsung?
/// Karena pada proses CREATE, client (Angular) belum tahu ID todo baru.
/// ID dibuat oleh server, jadi field Id sengaja tidak ada di sini.
///
/// Atribut [Required] / [Range] / [StringLength] dipakai agar ASP.NET Core
/// otomatis mengembalikan 400 Bad Request jika body dari Angular tidak valid.
/// </summary>
public class TodoCreateDto
{
    /// <summary>
    /// ID user pemilik todo. Wajib diisi dan hanya boleh 1 sampai 10.
    /// </summary>
    [JsonPropertyName("userId")]
    [Range(1, 10, ErrorMessage = "userId harus bernilai antara 1 sampai 10.")]
    public int UserId { get; set; }

    /// <summary>
    /// Judul todo. Wajib diisi dan maksimal 200 karakter.
    /// </summary>
    [JsonPropertyName("title")]
    [Required(ErrorMessage = "title wajib diisi.")]
    [StringLength(200, MinimumLength = 1, ErrorMessage = "title wajib diisi dan maksimal 200 karakter.")]
    public string Title { get; set; } = string.Empty;

    /// <summary>
    /// Status selesai atau belum. Wajib diisi (tipe bool).
    /// </summary>
    [JsonPropertyName("completed")]
    public bool Completed { get; set; }
}