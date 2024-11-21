import HashLoader from 'react-spinners/HashLoader';

const Loading = () => {
    return (
        <div className='flex items-center justify-center w-full h-full'>
            <HashLoader color='#d4af37' size={50} />
        </div>
    );
};

export default Loading;