using System.Net;
using System.Net.Http.Json;
using NCTDreamCrudApi.Exceptions;
using NCTDreamCrudApi.Models;

namespace NCTDreamCrudApi.Services;

/// <summary>
/// Implementasi ITodoService yang berkomunikasi dengan JSONPlaceholder
/// (https://jsonplaceholder.typicode.com/todos/) memakai HttpClient.
///
/// PENTING: JSONPlaceholder adalah FAKE REST API.
/// Data yang di-CREATE, di-UPDATE, atau di-DELETE hanya "disimulasikan" oleh server
/// dan TIDAK tersimpan permanen. Jika aplikasi di-restart, data kembali ke semula.
///
/// Alur pemanggilan:
/// TodosController  ->  ITodoService / TodoService  ->  HttpClient  ->  JSONPlaceholder
/// </summary>
public class TodoService : ITodoService
{
    // HttpClient di-inject lewat Dependency Injection oleh ASP.NET Core.
    // BaseAddress sudah diisi otomatis oleh Program.cs
    // (https://jsonplaceholder.typicode.com/), jadi di sini cukup pakai URL relatif
    // seperti "todos" atau "todos/1".
    private readonly HttpClient _httpClient;
    private readonly ILogger<TodoService> _logger;

    public TodoService(HttpClient httpClient, ILogger<TodoService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
    }

    /// <summary>
    /// READ semua todo.
    /// Backend memanggil GET https://jsonplaceholder.typicode.com/todos/
    /// lalu mengembalikan hasilnya ke Angular.
    /// </summary>
    public async Task<IReadOnlyList<Todo>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Mengambil daftar todo dari JSONPlaceholder.");

            using var response = await _httpClient.GetAsync("todos", cancellationToken);
            await EnsureSuccessAsync(response, cancellationToken);

            var todos = await response.Content.ReadFromJsonAsync<List<Todo>>(cancellationToken: cancellationToken);
            return todos ?? [];
        }
        catch (HttpRequestException ex)
        {
            // API luar tidak dapat diakses: tidak ada koneksi, timeout, DNS gagal, dll.
            _logger.LogError(ex, "Gagal menghubungi JSONPlaceholder saat mengambil daftar todo.");
            throw new ExternalApiException(
                "Tidak dapat menghubungi JSONPlaceholder. Pastikan koneksi internet tersedia.",
                HttpStatusCode.ServiceUnavailable,
                ex.Message);
        }
    }

    /// <summary>
    /// READ satu todo berdasarkan ID.
    /// Backend memanggil GET https://jsonplaceholder.typicode.com/todos/{id}
    /// Mengembalikan null bila JSONPlaceholder menjawab 404 (todo tidak ada).
    /// </summary>
    public async Task<Todo?> GetByIdAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Mengambil todo dengan ID {TodoId} dari JSONPlaceholder.", id);

            using var response = await _httpClient.GetAsync($"todos/{id}", cancellationToken);

            if (response.StatusCode == HttpStatusCode.NotFound)
            {
                _logger.LogWarning("Todo dengan ID {TodoId} tidak ditemukan.", id);
                return null;
            }

            await EnsureSuccessAsync(response, cancellationToken);

            return await response.Content.ReadFromJsonAsync<Todo>(cancellationToken: cancellationToken);
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Gagal menghubungi JSONPlaceholder saat mengambil todo ID {TodoId}.", id);
            throw new ExternalApiException(
                "Tidak dapat menghubungi JSONPlaceholder. Pastikan koneksi internet tersedia.",
                HttpStatusCode.ServiceUnavailable,
                ex.Message);
        }
    }

    /// <summary>
    /// CREATE todo baru.
    /// Backend meneruskan POST ke https://jsonplaceholder.typicode.com/todos/
    /// dan mengembalikan response apa adanya dari API tersebut.
    ///
    /// Catatan: karena JSONPlaceholder adalah fake API, todo yang dibuat ini
    /// tidak benar-benar tersimpan sebagai data permanen.
    /// </summary>
    public async Task<Todo> CreateAsync(TodoCreateDto request, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Meneruskan POST todo baru ke JSONPlaceholder.");

            using var response = await _httpClient.PostAsJsonAsync("todos", request, cancellationToken);
            await EnsureSuccessAsync(response, cancellationToken);

            var createdTodo = await response.Content
                .ReadFromJsonAsync<Todo>(cancellationToken: cancellationToken);

            return createdTodo ?? new Todo
            {
                UserId = request.UserId,
                Title = request.Title,
                Completed = request.Completed
            };
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Gagal menghubungi JSONPlaceholder saat membuat todo.");
            throw new ExternalApiException(
                "Tidak dapat menghubungi JSONPlaceholder. Pastikan koneksi internet tersedia.",
                HttpStatusCode.ServiceUnavailable,
                ex.Message);
        }
    }

    /// <summary>
    /// UPDATE todo berdasarkan ID.
    ///
    /// Langkah-langkahnya:
    /// 1. Cek dulu apakah todo dengan ID tersebut benar-benar ada (GET todos/{id}).
    /// 2. Jika tidak ada, kembalikan null supaya Controller membalas 404 Not Found.
    /// 3. Jika ada, teruskan PUT ke https://jsonplaceholder.typicode.com/todos/{id}.
    ///
    /// Catatan: perubahan ini hanya simulasi, tidak permanen di JSONPlaceholder.
    /// </summary>
    public async Task<Todo?> UpdateAsync(int id, TodoUpdateDto request, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Meneruskan PUT todo ID {TodoId} ke JSONPlaceholder.", id);

            // Cek keberadaan todo terlebih dahulu (langkah 1 dan 2).
            var existingTodo = await GetByIdAsync(id, cancellationToken);
            if (existingTodo is null)
            {
                return null;
            }

            using var response = await _httpClient.PutAsJsonAsync($"todos/{id}", request, cancellationToken);
            await EnsureSuccessAsync(response, cancellationToken);

            var updatedTodo = await response.Content
                .ReadFromJsonAsync<Todo>(cancellationToken: cancellationToken);

            // JSONPlaceholder selalu mengembalikan object hasil update.
            // Bila body kosong, gunakan data yang sama dengan request Angular.
            return updatedTodo ?? new Todo
            {
                Id = id,
                UserId = request.UserId,
                Title = request.Title,
                Completed = request.Completed
            };
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Gagal menghubungi JSONPlaceholder saat mengubah todo ID {TodoId}.", id);
            throw new ExternalApiException(
                "Tidak dapat menghubungi JSONPlaceholder. Pastikan koneksi internet tersedia.",
                HttpStatusCode.ServiceUnavailable,
                ex.Message);
        }
    }

    /// <summary>
    /// DELETE todo berdasarkan ID.
    ///
    /// Langkah-langkahnya:
    /// 1. Cek dulu apakah todo dengan ID tersebut ada (GET todos/{id}).
    /// 2. Jika tidak ada, kembalikan false supaya Controller membalas 404 Not Found.
    /// 3. Jika ada, teruskan DELETE ke https://jsonplaceholder.typicode.com/todos/{id}.
    ///
    /// Catatan: JSONPlaceholder tetap membalas 200 walau ID tidak ada,
    /// karena ini API palsu. Karena itu pengecekan di langkah 1 wajib dilakukan.
    /// Penghapusan juga hanya simulasi, tidak permanen.
    /// </summary>
    public async Task<bool> DeleteAsync(int id, CancellationToken cancellationToken = default)
    {
        try
        {
            _logger.LogInformation("Meneruskan DELETE todo ID {TodoId} ke JSONPlaceholder.", id);

            var existingTodo = await GetByIdAsync(id, cancellationToken);
            if (existingTodo is null)
            {
                return false;
            }

            using var response = await _httpClient.DeleteAsync($"todos/{id}", cancellationToken);
            await EnsureSuccessAsync(response, cancellationToken);

            return true;
        }
        catch (HttpRequestException ex)
        {
            _logger.LogError(ex, "Gagal menghubungi JSONPlaceholder saat menghapus todo ID {TodoId}.", id);
            throw new ExternalApiException(
                "Tidak dapat menghubungi JSONPlaceholder. Pastikan koneksi internet tersedia.",
                HttpStatusCode.ServiceUnavailable,
                ex.Message);
        }
    }

    /// <summary>
    /// Memastikan response dari JSONPlaceholder sukses (200/201).
    /// Jika tidak sukses, lempar ExternalApiException agar Controller
    /// bisa mengembalikan status HTTP yang sesuai ke Angular.
    /// </summary>
    private static async Task EnsureSuccessAsync(HttpResponseMessage response, CancellationToken cancellationToken)
    {
        if (response.IsSuccessStatusCode)
        {
            return;
        }

        var body = await response.Content.ReadAsStringAsync(cancellationToken);

        throw new ExternalApiException(
            $"JSONPlaceholder membalas dengan status {(int)response.StatusCode} {response.ReasonPhrase}.",
            response.StatusCode,
            body);
    }
}