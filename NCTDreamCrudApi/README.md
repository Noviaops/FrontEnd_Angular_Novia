# NCT Dream CRUD API

Backend ASP.NET Core Web API untuk tugas lanjutan project **NCT DREAM** Angular 21
(tentang RESTful API dan proses CRUD).

Backend ini berfungsi sebagai **perantara** antara frontend Angular dan
[JSONPlaceholder](https://jsonplaceholder.typicode.com/todos/).

---

## 1. Arsitektur

```
Angular Frontend  (http://localhost:4200)
      │  HTTP request  (JSON)
      ▼
REST API Backend  (http://localhost:7000)
      │
      ▼
TodosController      → menerima request, mengatur status HTTP
      │
      ▼
TodoService          → business logic + HttpClient
      │
      ▼
JSONPlaceholder      → https://jsonplaceholder.typicode.com/todos/
      │  response (JSON)
      ▼
TodoService → TodosController → Angular
```

> **Penting:** Angular **tidak boleh** memanggil JSONPlaceholder secara langsung.
> Semua request harus melewati backend lokal ini.

> **JSONPlaceholder adalah FAKE REST API.** Data yang dibuat, diubah, atau dihapus
> hanya disimulasikan dan **tidak tersimpan permanen**. Setelah aplikasi di-restart,
> data akan kembali ke kondisi semula.

---

## 2. Struktur Folder

```
NCTDreamCrudApi/
│
├── Controllers/
│   └── TodosController.cs          # Titik masuk HTTP request (5 endpoint CRUD)
│
├── Models/
│   ├── Todo.cs                     # Model data utama (userId, id, title, completed)
│   ├── TodoCreateDto.cs            # DTO untuk POST (tanpa id)
│   ├── TodoUpdateDto.cs            # DTO untuk PUT (tanpa id)
│   └── ErrorResponse.cs            # Bentuk response error yang seragam
│
├── Services/
│   ├── ITodoService.cs             # Kontrak (interface) operasi CRUD
│   └── TodoService.cs              # Implementasi: HttpClient ke JSONPlaceholder
│
├── Exceptions/
│   ├── ExternalApiException.cs     # Error dari JSONPlaceholder / tidak terhubung
│   └── GlobalExceptionHandler.cs   # Penangkap error -> 500 Internal Server Error
│
├── Properties/
│   └── launchSettings.json         # Konfigurasi port (7000)
│
├── Program.cs                      # Konfigurasi DI, HttpClient, CORS, Swagger
├── appsettings.json                # Base URL JSONPlaceholder
├── NCTDreamCrudApi.csproj
└── NCTDreamCrudApi.http            # Contoh request siap pakai (Visual Studio)
```

---

## 3. Technology

| Komponen            | Keterangan                                              |
| ------------------- | ------------------------------------------------------- |
| Framework           | ASP.NET Core Web API (.NET 10)                           |
| Bahasa              | C#                                                      |
| Data sumber         | JSONPlaceholder (`https://jsonplaceholder.typicode.com/todos/`) |
| HTTP client         | `HttpClient` (Typed HttpClient + Dependency Injection)  |
| Dokumentasi API     | Swagger UI                                              |
| CORS                | `http://localhost:4200`                                 |
| Database            | **Tidak digunakan** (sesuai requirement tugas)           |

---

## 4. Urutan Pemahaman Kode (disarankan untuk belajar)

1. `Models/Todo.cs` — bentuk data.
2. `Services/ITodoService.cs` — daftar operasi yang harus ada.
3. `Services/TodoService.cs` — implementasi + HttpClient (tempat request ke JSONPlaceholder).
4. `Controllers/TodosController.cs` — pemetaan HTTP verb → operasi CRUD.
5. `Program.cs` — perakitan semuanya (DI, CORS, Swagger).

---

## 5. Hubungan HTTP Verb dengan CRUD

| HTTP Verb | CRUD    |Ttujuan                          | Endpoint         |
| --------- | ------- | -------------------------------- | ---------------- |
| `GET`     | **Read**   | Mengambil/membaca data      | `/api/todos`     |
| `POST`    | **Create** | Menambah data baru           | `/api/todos`     |
| `PUT`     | **Update** | Mengubah data yang sudah ada | `/api/todos/{id}`|
| `DELETE`  | **Delete** | Menghapus data                | `/api/todos/{id}`|

`GET /api/todos/{id}` termasuk **Read** (membaca satu data spesifik).

---

## 6. Daftar Endpoint

| Method   | URL                | Request ke JSONPlaceholder              | Status sukses |
| -------- | ------------------ | --------------------------------------- | ------------- |
| `GET`    | `/api/todos`       | `GET /todos`                            | `200 OK`      |
| `GET`    | `/api/todos/{id}`  | `GET /todos/{id}`                       | `200 OK`      |
| `POST`   | `/api/todos`       | `POST /todos`                           | `201 Created` |
| `PUT`    | `/api/todos/{id}`  | `PUT /todos/{id}`                       | `200 OK`      |
| `DELETE` | `/api/todos/{id}`  | `DELETE /todos/{id}`                    | `204 No Content` |

### Status Error

| Status                 | Kapan terjadi                                                    |
| ---------------------- | ---------------------------------------------------------------- |
| `400 Bad Request`      | Body POST/PUT tidak valid (mis. `title` kosong, `userId` > 10)   |
| `404 Not Found`        | Todo dengan `{id}` tersebut tidak ada                            |
| `500 Internal Server Error` | Error tak terduga di backend                              |
| `502 Bad Gateway`      | Backend tidak dapat menjangkau JSONPlaceholder                    |

---

## 7. Cara Menjalankan Backend

### Visual Studio Community

1. Buka file `NCTDreamCrudApi.csproj` (atau `File > Open > Project/Solution`).
2. Klik kanan project → **Set as Startup Project**.
3. Tekan **Ctrl+F5** (Start Without Debugging) atau **F5**.
4. Browser otomatis terbuka ke halaman Swagger.

### Terminal (dari folder project)

```bash
dotnet restore
dotnet run --launch-profile http
```

Atur environment ke Development agar Swagger aktif:

```bash
$env:ASPNETCORE_ENVIRONMENT = "Development"
dotnet run
```

---

## 8. Port / URL Backend

| Protocol | URL                      | Keterangan                     |
| -------- | ------------------------ | ------------------------------ |
| HTTP     | `http://localhost:7000`  | **Digunakan frontend Angular** |
| HTTPS    | `https://localhost:7001` | Alternatif (opsional)          |

Ditetapkan di `Properties/launchSettings.json`.

Swagger UI: **http://localhost:7000/swagger**

> `UseHttpsRedirection` sengaja tidak dipasang supaya request dari
> `http://localhost:7000` tidak dialihkan dan CORS tetap aman untuk Angular.

---

## 9. Cara Menguji Endpoint (Swagger)

1. Jalankan backend.
2. Buka **http://localhost:7000/swagger**.
3. Pilih endpoint → **Try it out** → **Execute**.

### 9.1 `GET /api/todos`

Response `200 OK` (200 data):

```json
[
  { "userId": 1, "id": 1, "title": "delectus aut autem", "completed": false },
  { "userId": 1, "id": 2, "title": "quis ut nam facilis et officia qui", "completed": false }
]
```

### 9.2 `GET /api/todos/1`

Response `200 OK`:

```json
{
  "userId": 1,
  "id": 1,
  "title": "delectus aut autem",
  "completed": false
}
```

### 9.3 `POST /api/todos` — **Contoh Request (Create)**

Body JSON:

```json
{
  "userId": 1,
  "title": "Belajar Angular CRUD",
  "completed": false
}
```

Response `201 Created`:

```json
{
  "userId": 1,
  "id": 201,
  "title": "Belajar Angular CRUD",
  "completed": false
}
```

Header: `Location: http://localhost:7000/api/todos/201`

> Field `id` **tidak dikirim** dari frontend karena ID dibuat oleh server.

### 9.4 `PUT /api/todos/1` — **Contoh Request (Update)**

Body JSON:

```json
{
  "userId": 1,
  "title": "Belajar REST API",
  "completed": true
}
```

Response `200 OK`:

```json
{
  "userId": 1,
  "id": 1,
  "title": "Belajar REST API",
  "completed": true
}
```

### 9.5 `DELETE /api/todos/1`

Response `204 No Content` (body kosong).

### 9.6 Contoh Response Error

`GET /api/todos/9999` → `404 Not Found`

```json
{
  "message": "Todo dengan ID 9999 tidak ditemukan.",
  "status": 404
}
```

`POST /api/todos` dengan `title` kosong → `400 Bad Request`

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Title": ["title wajib diisi."]
  }
}
```

---

## 10. URL Backend yang Dipakai Angular

```ts
// Base URL backend lokal (JANGAN gunakan URL JSONPlaceholder langsung)
export const API_BASE_URL = 'http://localhost:7000/api';

// Contoh pemanggilan di service Angular:
this.http.get<Todo[]>(`${API_BASE_URL}/todos`);                 // Read all
this.http.get<Todo>(`${API_BASE_URL}/todos/${id}`);             // Read one
this.http.post<Todo>(`${API_BASE_URL}/todos`, data);            // Create
this.http.put<Todo>(`${API_BASE_URL}/todos/${id}`, data);       // Update
this.http.delete(`${API_BASE_URL}/todos/${id}`);                // Delete
```

CORS di backend sudah mengizinkan `http://localhost:4200`, jadi tidak perlu
menambahkan header manual di Angular.

---

## 11. Konfigurasi CORS

Di `Program.cs`:

```csharp
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
```

Sengaja memakai `WithOrigins` (bukan `AllowAnyOrigin`) supaya tidak terlalu longgar.
`UseCors` harus dipasang **sebelum** `MapControllers`.

---

## 12. Konfigurasi Dependency Injection

```csharp
builder.Services.AddHttpClient<TodoService>(client =>
{
    client.BaseAddress = new Uri(jsonPlaceholderBaseUrl); // dari appsettings.json
    client.Timeout = TimeSpan.FromSeconds(30);
});

builder.Services.AddScoped<ITodoService>(p => p.GetRequiredService<TodoService>());
```

`TodosController` cukup menerima `ITodoService` lewat constructor:

```csharp
public TodosController(ITodoService todoService, ILogger<TodosController> logger)
```

---

## 13. Catatan Penting tentang JSONPlaceholder

1. **Bukan database.** Semua perubahan hanya simulasi, data kembali ke awal setelah
   aplikasi di-restart.
2. **`DELETE /todos/999` tetap membalas 200** walaupun ID tidak ada. Karena itu
   `TodoService` selalu melakukan `GET` dulu untuk memastikan todo benar-benar ada
   sebelum menghapus atau mengubah.
3. **ID hasil POST dibuat oleh server palsu** (mis. 201, 202, …) dan bertambah setiap
   kali POST, walaupun isinya tetap sama.
4. Proyek ini sengaja **tidak** memakai database, authentication, JWT, atau
   repository pattern.

---

## 14. Ringkasan Konsep RESTful

| Konsep REST       | Implementasi di project ini                                       |
| ----------------- | ---------------------------------------------------------------- |
| Resource / URL    | `/api/todos`                                                    |
| HTTP verb = aksi  | `GET`/`POST`/`PUT`/`DELETE` → Read/Create/Update/Delete          |
| Stateless         | Tiap request membawa semua data yang dibutuhkan (body JSON)      |
| Status code       | 200 / 201 / 204 / 400 / 404 / 500 / 502                          |
| Content-Type      | `application/json`                                               |
| Location header   | Dikirim pada response `201 Created`                             |