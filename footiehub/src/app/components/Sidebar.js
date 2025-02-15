import Link from 'next/link'

const Sidebar = () => {
  return (
    <aside className="bg-gray-800 text-white w-64 p-4">
      <ul>
        <li><Link href="/">Home</Link></li>
        <li><Link href="/players">Players</Link></li>
        <li><Link href="/addPlayer">Add Player</Link></li>
        <li>boop</li>
      </ul>
    </aside>
  );
}

export default Sidebar;