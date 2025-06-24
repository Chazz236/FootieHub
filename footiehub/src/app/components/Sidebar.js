'use client'

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Sidebar = () => {

  const path = usePathname();
  
  const linkStyles = 'block py-2 px-3 hover:text-primary-accent transition-colors duration-200';
  const activeLinkStyle = 'text-primary-accent font-semibold';

  return (
    <aside className='bg-panel-background text-panel-foreground w-52 p-4 sticky top-0 h-screen'>
      <nav>
        <ul className='space-y-3'>
          <li className='text-xl'>FootieHub</li>
          <li className='pt-4 mt-4 border-t'><Link href='/' className={`${linkStyles} ${path === '/' ? activeLinkStyle : ''}`}>Home</Link></li>
          <li><Link href='/players' className={`${linkStyles} ${path === '/players' ? activeLinkStyle : ''}`}>Players</Link></li>
          <li><Link href='/matches' className={`${linkStyles} ${path === '/matches' ? activeLinkStyle : ''}`}>Matches</Link></li>
          <li><Link href='/teammate' className={`${linkStyles} ${path === '/teammate' ? activeLinkStyle : ''}`}>Teammate Dynamics</Link></li>
          <li><Link href='/compare' className={`${linkStyles} ${path === '/compare' ? activeLinkStyle : ''}`}>Compare Players</Link></li>
          <li><Link href='/transferCompare' className={`${linkStyles} ${path === '/transferCompare' ? activeLinkStyle : ''}`}>Value Trends</Link></li>
          <li className='pt-4 mt-4 border-t'><Link href='/addPlayer' className={`${linkStyles} ${path === '/addPlayer' ? activeLinkStyle : ''}`}>Add Player</Link></li>
          <li><Link href='/addMatch' className={`${linkStyles} ${path === '/addMatch' ? activeLinkStyle : ''}`}>Add Match</Link></li>
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;