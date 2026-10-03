using System.Reflection;
using System.Text.Json;
using NCTDreamCrudApi.Exceptions;
using NCTDreamCrudApi.Services;

// =====================================================================
// NCT Dream CRUD API
// Backend perantara antara Angular frontend dan JSONPlaceholder.
//
// Alur request:
// Angular (localhost:4200)
//      -> HTTP request ke backend ini
//      -> Controller memanggil Service
//      -> Service memakai HttpClient
//      -> JSONPlaceholder (https://jsonplaceholder.typicode.com/todos/)
//      -> response dikembalikan ke Angular
// =====================================================================

var builder = WebApplication.CreateBuilder(args);

// ---------------------------------------------------------------------
// 1. KONFIGURASI: Controller + JSON
// ---------------------------------------------------------------------
builder.Services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        // Pastikan JSON yang dikirim ke Angular memakai camelCase:
        // { "userId": 1, "id": 1, "title": "...", "completed": false }
        options.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    });

// Membuat URL yang di-generate otomatis (misalnya header Location pada
// response 201 Created) menjadi huruf kecil semua: /api/todos/201
builder.Services.Configure<RouteOptions>(options => options.LowercaseUrls = true);

// Menangkap error tak terduga -> 500 Internal Server Error (JSON).
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

// ---------------------------------------------------------------------
// 2. KONFIGURASI: Swagger UI untuk menguji endpoint dari browser
// ---------------------------------------------------------------------
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new()
    {
        Title = "NCT Dream CRUD API",
        Version = "v1",
        Description = "RESTful API perantara antara Angular dan JSONPlaceholder (fake REST API)."
    });

    // Menampilkan keterangan pada setiap endpoint di Swagger.
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

// ---------------------------------------------------------------------
// 3. KONFIGURASI: Dependency Injection untuk TodoService + HttpClient
// ---------------------------------------------------------------------
// BaseAddress JSONPlaceholder diambil dari appsettings.json supaya mudah diganti.
var jsonPlaceholderBaseUrl = builder.Configuration["JsonPlaceholder:BaseUrl"]
                             ?? "https://jsonplaceholder.typicode.com/";

// AddHttpClient<TodoService> membuat TodoService memakai HttpClient yang sudah
// dikonfigurasi BaseAddress dan Timeout. Ini disebut Typed HttpClient.
builder.Services.AddHttpClient<TodoService>(client =>
{
    client.BaseAddress = new Uri(jsonPlaceholderBaseUrl);
    client.Timeout = TimeSpan.FromSeconds(30);
});

// Daftarkan juga sebagai ITodoService supaya Controller bisa memakainya
// lewat interface (pola Dependency Injection yang baik untuk testing).
builder.Services.AddScoped<ITodoService>(provider => provider.GetRequiredService<TodoService>());

// ---------------------------------------------------------------------
// 4. KONFIGURASI: CORS
// ---------------------------------------------------------------------
// Frontend Angular berjalan di http://localhost:4200, jadi hanya origin tersebut
// yang diizinkan. Sengaja tidak memakai AllowAnyOrigin supaya tidak terlalu longgar.
const string corsPolicyName = "AngularFrontend";

builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy
            .WithOrigins("http://localhost:4200", "https://localhost:4200")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

// ---------------------------------------------------------------------
// 5. MIDDLEWARE
// ---------------------------------------------------------------------
// 5a. Tangkap error yang tidak terduga dan balas 500 Internal Server Error
//     dengan JSON yang sederhana, bukan halaman error HTML.
//     Detail implementasinya ada di Exceptions/GlobalExceptionHandler.cs.
app.UseExceptionHandler();

// 5b. Swagger UI hanya aktif di mode Development.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "NCT Dream CRUD API v1");
        options.DocumentTitle = "NCT Dream CRUD API";
    });
}

// 5c. CORS harus dipasang sebelum MapControllers.
app.UseCors(corsPolicyName);

// Catatan: UseHttpsRedirection sengaja tidak dipasang agar request dari
// http://localhost:7000 tidak dialihkan dan CORS tetap aman untuk Angular.

// ---------------------------------------------------------------------
// 6. ROUTING
// ---------------------------------------------------------------------
// Semua request diarahkan ke Controller (/api/todos, /api/todos/{id}).
app.MapControllers();

app.Run();