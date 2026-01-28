import { useNavigate } from 'react-router-dom';
import { MOVIES_MOCK } from '../../mocks/movies.js';
import NavBar from '../../components/NavBar.jsx';

const Home = () => {
    const navigate = useNavigate();
    const HandleLogin = () => {
        navigate('/login');
    };
    return (
        <>
            <div className='max-w-7xl m-auto p-6'>
                <NavBar />
                <h1 className="text-4xl font-bold mb-8 text-gray-800">Premieres</h1>
                <div className="grid grid-cols-1 gap-4 p-4" >
                    {MOVIES_MOCK.map((movie) => (
                        <div key={movie.id} className="flex flex-col md:flex-row gap-4 md:gap-0 md:justify-center items-start md:items-center max-w-[850px] m-auto " onClick={HandleLogin}>
                            <figure className='w-full' >
                                <img
                                    src={movie.image}
                                    alt={movie.title}
                                    className="w-full sm:w-[500px] h-auto object-cover cursor-pointer"

                                />
                            </figure>
                            <div className=''>
                                <h2 className="text-2xl font-bold">{movie.title} ({movie.year})</h2>
                                <p className="text-gray-800">{movie.description}</p>
                                <p className="text-yellow-500">Rating: {movie.rating}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

export default Home;