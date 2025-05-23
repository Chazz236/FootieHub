export async function getTransfers(id) {
  const res = await fetch(`http://localhost:3000/api/transferValues/${id}`);
  const data = await res.json();
  return data;
}

export async function getPlayerStats() {
  const res = await fetch('http://localhost:3000/api/playerStats');
  const data = await res.json();
  return data;
}