using NCTDreamCrudApi.Models;

namespace NCTDreamCrudApi.Services;

/// <summary>
/// Kontrak (interface) untuk semua operasi CRUD pada data Todo.
///
/// Tujuannya: TodosController TIDAK boleh menyentuh HttpClient secara langsung.
/// Controller hanya memanggil method di bawah ini, sedangkan detail cara
/// berkomunikasi dengan JSONPlaceholder disembunyikan di dalam TodoService.
///
/// Manfaatnya: kalau nanti sumber data diganti (misalnya menjadi database),
/// hanya TodoService yang perlu diubah, Controller tetap sama.
/// </summary>
public interface ITodoService
{
    /// <summary>
    /// READ - mengambil semua todo dari JSONPlaceholder.
    /// </summary>
    Task<IReadOnlyList<Todo>> GetAllAsync(CancellationToken cancellationToken = default);

    /// <summary>
    /// READ - mengambil satu todo berdasarkan ID.
    /// Mengembalikan null jika todo dengan ID tersebut tidak ditemukan.
    /// </summary>
    Task<Todo?> GetByIdAsync(int id, CancellationToken cancellationToken = default);

    /// <summary>
    /// CREATE - membuat todo baru di JSONPlaceholder dan mengembalikan hasil dari API.
    /// </summary>
    Task<Todo> CreateAsync(TodoCreateDto request, CancellationToken cancellationToken = default);

    /// <summary>
    /// UPDATE - mengubah todo berdasarkan ID.
    /// Mengembalikan null jika todo dengan ID tersebut tidak ditemukan.
    /// </summary>
    Task<Todo?> UpdateAsync(int id, TodoUpdateDto request, CancellationToken cancellationToken = default);

    /// <summary>
    /// DELETE - menghapus todo berdasarkan ID.
    /// Mengembalikan true jika berhasil, false jika todo tidak ditemukan.
    /// </summary>
    Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default);
}