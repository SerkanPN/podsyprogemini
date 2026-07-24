export default function Profile() {
  return (
    <div className="p-6 space-y-6 text-zinc-100">
      <h1 className="text-2xl font-bold">Profil</h1>
      <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
        <p>Ad Soyad: Kullanıcı Adı</p>
        <p>E-posta: email@example.com</p>
        <p>Telefon: +90 555 555 5555</p>
        <p>Mağaza Adı: Podsy Store</p>
        <p>Üyelik Durumu: Premium</p>
      </div>
    </div>
  );
}