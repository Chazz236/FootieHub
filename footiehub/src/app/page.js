import Header from '../app/components/Header';
import Sidebar from '../app/components/Sidebar';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className ="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6">
          <h2>Stuff here?</h2>
          <p>some more stuff?</p>
        </main>
      </div>
    </div>
  )
}

export default Home;