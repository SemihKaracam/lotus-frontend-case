Employee Management App Proje Dokümantasyonu

Bu dokümantasyon, "Employee Management App" adlı projenin teknik yapısını ve işleyişini detaylı olarak açıklamaktadır. Proje, çalışan verilerini yönetmek için modern web teknolojilerini kullanarak tasarlanmış bir SPA (Single Page Application)'dır.

1. Proje Tanıtımı
Bu uygulama, bir şirketin çalışanlarını listeleme, ekleme, düzenleme ve silme gibi temel işlemleri gerçekleştirmeyi amaçlar. Proje, hem yerel durum yönetimi hem de bir API servisi simülasyonu ile veri akışını yöneterek gerçek dünya senaryolarına uygun bir yapıya sahiptir.

2. Kullanılan Teknolojiler
Projenin geliştirilmesinde aşağıdaki ana teknolojiler kullanılmıştır:

React & TypeScript: Uygulamanın temelini oluşturan, güçlü ve tip güvenli bir frontend kütüphanesi.

Redux Toolkit: Merkezi durum yönetimi için tercih edilen, thunk ve slice yapılarını kullanarak veri akışını kolaylaştıran bir kütüphane.

Zod: Gelen verilerin ve formların validasyonunu (doğrulamasını) sağlayan, tip-güvenli bir şema tanımlama kütüphanesi.

Tailwind CSS: Hızlı ve esnek bir şekilde responsive arayüzler oluşturmak için kullanılan yardımcı sınıf tabanlı bir CSS framework'üdür.

Local Storage: Bir veri tabanı veya API olmaksızın, çalışan verilerini tarayıcının yerel depolama alanında saklamak için kullanılan bir yöntemdir.

3. Proje Yapısı
Proje, okunabilirliği ve bakımı kolaylaştırmak için modüler bir klasör yapısına sahiptir:

src/pages: Uygulamanın ana sayfalarını (örneğin, EmployeePage.tsx) barındırır. Her sayfa, birden fazla bileşeni bir araya getirerek bir bütün oluşturur.

src/components: Uygulamada tekrar kullanılabilir olan küçük UI (Kullanıcı Arayüzü) bileşenlerini (örneğin, EmployeeTable, EmployeeModal) içerir.

src/store: Redux Toolkit ile oluşturulan durum yönetimi dosyalarını barındırır. employeesSlice.ts gibi slice'lar ve index.ts gibi store yapılandırma dosyaları burada bulunur.

src/services: Veri çekme (fetching), ekleme, güncelleme ve silme gibi asenkron işlemleri yöneten API katmanını simüle eder. employee.ts dosyası, localStorage'dan veri alıp-yazma işlemlerini gerçekleştirir.

src/types: TypeScript için veri tiplerini ve Zod şemalarını (örneğin, schemas.ts) tanımlar.

4. Redux Toolkit ile Durum Yönetimi
Redux Toolkit, uygulamanın durumunu yönetmek için ana araç olarak kullanılmıştır.

createSlice: Çalışanlar için merkezi bir durum (state), reducer'lar (durum değiştiriciler) ve action'lar (eylemler) oluşturmak için kullanılır.

createAsyncThunk: Asenkron veri işlemlerini (örneğin, getEmployees) basitleştirir. Bu sayede, API çağrılarının pending (beklemede), fulfilled (başarılı) ve rejected (reddedildi) gibi farklı durumları kolayca yönetilir.

5. Mock Veri Entegrasyonu
Uygulama, bir backend API'si yerine src/services/data/mockEmployees.ts dosyasında bulunan sahte (mock) verileri kullanır. initialEmployees adlı bu veri dizisi, uygulama ilk kez yüklendiğinde localStorage'a kaydedilir.

6. API ve Veri Akışı
src/services/employee.ts dosyası, uygulamanın "API" katmanı olarak görev yapar.

Veri Çekme: getEmployees fonksiyonu, localStorage'da veri olup olmadığını kontrol eder. Eğer yoksa, initialEmployees verisini yükler. Varsa, mevcut veriyi çeker.

Veri Senkronizasyonu: Redux thunk'ları bu servis fonksiyonlarını çağırır ve gelen veriyi Redux store'a kaydeder.

UI Güncellemesi: Bileşenler, useSelector hook'u ile store'daki verilere abone olur ve verilerdeki herhangi bir değişiklik anında UI'a yansıtılır.