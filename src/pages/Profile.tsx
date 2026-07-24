export default function Profile() {
  return (
    <div className="p-6 space-y-6 text-zinc-100">
      <h1 className="text-2xl font-bold">Profile</h1>
      <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
        <p>Full Name: Username</p>
        <p>Email: email@example.com</p>
        <p>Phone: +1 555 555 5555</p>
        <p>Shop Name: Podsy Store</p>
        <p>Membership Status: Premium</p>
      </div>
    </div>
  );
}