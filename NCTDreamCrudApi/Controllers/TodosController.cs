using Microsoft.AspNetCore.Mvc;
using NCTDreamCrudApi.Exceptions;
using NCTDreamCrudApi.Models;
using NCTDreamCrudApi.Services;

namespace NCTDreamCrudApi.Controllers;

/// <summary>
/// Controller yang menangani semua request CRUD dari Angular frontend.
///
/// Pemetaan HTTP verb ke operasi CRUD:
/// GET    /api/todos      -> Read   (ambil semua)
/// GET    /api/todos/{id} -> Read   (ambil satu)
/// POST   /api/todos      -> Create (tambah baru)
/// PUT    /api/todos/{id} -> Update (ubah data)
/// DELETE /api/todos/{id} -> Delete (hapus data)
///
/// Controller ini TIDAK melakukan request ke JSONPlaceholder secara langsung.
/// Controller memanggil ITodoService, dan TodoService yang memakai HttpClient.
/// </summary>
[ApiController]
[Route("api/[controller]")] // [controller] otomatis diganti dengan nama class minus kata "Controller" -> api/todos
[Produces("application/json")]
public class TodosController : ControllerBase
{
    // Dependency Injection: ASP.NET Core otomatis memberikan TodoService di sini.
    private readonly ITodoService _todoService;
    private readonly ILogger<TodosController> _logger;

    public TodosController(ITodoService todoService, ILogger<TodosController> logger)
    {
        _todoService = todoService;
        _logger = logger;
    }

    /// <summary>
    /// GET /api/todos
    /// READ - mengambil seluruh data todo dari JSONPlaceholder.
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IEnumerable<Todo>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status502BadGateway)]
    public async Task<ActionResult<IEnumerable<Todo>>> GetAll()
    {
        try
        {
            var todos = await _todoService.GetAllAsync(HttpContext.RequestAborted);
            return Ok(todos); // 200 OK
        }
        catch (ExternalApiException ex)
        {
            return HandleExternalApiError(ex);
        }
    }

    /// <summary>
    /// GET /api/todos/{id}
    /// READ - mengambil satu data todo berdasarkan ID.
    /// </summary>
    [HttpGet("{id:int}", Name = nameof(GetById))]
    [ProducesResponseType(typeof(Todo), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status502BadGateway)]
    public async Task<ActionResult<Todo>> GetById(int id)
    {
        try
        {
            var todo = await _todoService.GetByIdAsync(id, HttpContext.RequestAborted);

            if (todo is null)
            {
                return NotFound(new ErrorResponse // 404 Not Found
                {
                    Message = $"Todo dengan ID {id} tidak ditemukan.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok(todo); // 200 OK
        }
        catch (ExternalApiException ex)
        {
            return HandleExternalApiError(ex);
        }
    }

    /// <summary>
    /// POST /api/todos
    /// CREATE - membuat todo baru.
    ///
    /// Body JSON yang dikirim Angular:
    /// { "userId": 1, "title": "Belajar Angular CRUD", "completed": false }
    ///
    /// Catatan: JSONPlaceholder adalah fake REST API, jadi todo yang dibuat
    /// tidak benar-benar tersimpan permanen.
    /// </summary>
    [HttpPost]
    [ProducesResponseType(typeof(Todo), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status502BadGateway)]
    public async Task<ActionResult<Todo>> Create([FromBody] TodoCreateDto request)
    {
        try
        {
            var createdTodo = await _todoService.CreateAsync(request, HttpContext.RequestAborted);

            // 201 Created + header Location agar client tahu resource baru berada di mana.
            return CreatedAtAction(nameof(GetById), new { id = createdTodo.Id }, createdTodo);
        }
        catch (ExternalApiException ex)
        {
            return HandleExternalApiError(ex);
        }
    }

    /// <summary>
    /// PUT /api/todos/{id}
    /// UPDATE - mengubah data todo yang sudah ada.
    ///
    /// Body JSON yang dikirim Angular:
    /// { "userId": 1, "title": "Belajar REST API", "completed": true }
    /// </summary>
    [HttpPut("{id:int}")]
    [ProducesResponseType(typeof(Todo), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status502BadGateway)]
    public async Task<ActionResult<Todo>> Update(int id, [FromBody] TodoUpdateDto request)
    {
        try
        {
            var updatedTodo = await _todoService.UpdateAsync(id, request, HttpContext.RequestAborted);

            if (updatedTodo is null)
            {
                return NotFound(new ErrorResponse // 404 Not Found
                {
                    Message = $"Todo dengan ID {id} tidak ditemukan, sehingga tidak bisa diubah.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok(updatedTodo); // 200 OK
        }
        catch (ExternalApiException ex)
        {
            return HandleExternalApiError(ex);
        }
    }

    /// <summary>
    /// DELETE /api/todos/{id}
    /// DELETE - menghapus todo. Tidak ada body pada response (204 No Content).
    /// </summary>
    [HttpDelete("{id:int}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ErrorResponse), StatusCodes.Status502BadGateway)]
    public async Task<IActionResult> Delete(int id)
    {
        try
        {
            var isDeleted = await _todoService.DeleteAsync(id, HttpContext.RequestAborted);

            if (!isDeleted)
            {
                return NotFound(new ErrorResponse // 404 Not Found
                {
                    Message = $"Todo dengan ID {id} tidak ditemukan, sehingga tidak bisa dihapus.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return NoContent(); // 204 No Content
        }
        catch (ExternalApiException ex)
        {
            return HandleExternalApiError(ex);
        }
    }

    /// <summary>
    /// Mengubah error dari JSONPlaceholder menjadi response error yang sederhana.
    ///
    /// Aturan pemetaan:
    /// - 4xx dari JSONPlaceholder  -> 400 Bad Request (request dari Angular tidak valid)
    /// - 404 dari JSONPlaceholder  -> 404 Not Found
    /// - 5xx / tidak bisa diakses -> 502 Bad Gateway (server kita jadi "gateway"
    ///                               yang tidak bisa menjangkau JSONPlaceholder)
    /// - Error lain yang tidak terduga ditangani oleh exception handler di Program.cs (500).
    /// </summary>
    private ActionResult HandleExternalApiError(ExternalApiException ex)
    {
        _logger.LogError(ex, "Terjadi masalah saat menghubungi JSONPlaceholder: {Pesan}", ex.Message);

        // 4xx dari JSONPlaceholder berarti request yang dikirim tidak valid.
        if (ex.StatusCode is System.Net.HttpStatusCode.NotFound)
        {
            return NotFound(new ErrorResponse
            {
                Message = ex.Message,
                Status = StatusCodes.Status404NotFound
            });
        }

        if ((int)ex.StatusCode is >= 400 and < 500)
        {
            return BadRequest(new ErrorResponse
            {
                Message = ex.Message,
                Status = StatusCodes.Status400BadRequest
            });
        }

        return StatusCode(StatusCodes.Status502BadGateway, new ErrorResponse
        {
            Message = ex.Message,
            Status = StatusCodes.Status502BadGateway
        });
    }
}