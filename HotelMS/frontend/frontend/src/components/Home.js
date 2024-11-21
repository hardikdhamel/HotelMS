import banner from '../Images/Banner.jpeg';

function Home() {
  return (
    <>
    <div className="home-container">
        <img className="home-image" height="600px" width="1385px" src={banner} alt="A big banner" />
    </div>
    </>
  );
}
export default Home;