import { Link } from 'react-router-dom';
import SignUpForm from "../../components/auth/SignUpForm";

const SignUpPage = () => {
  return (
    <div className='min-h-screen flex flex-col justify-center items-center py-6 sm:px-6 lg:px-8 '>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <img src="./logo.png" alt="logo" className="mx-auto h-32 w-auto" />
        <h2 className='text-center text-3xl font-bold text-gray-900 mt-1'>
          Elevate Your Career with <span className="text-blue-600">OneConnect</span>
        </h2>
      </div>
      <div className='mt-2 sm:mx-auto sm:w-full sm:max-w-md shadow-md'>
        <div className='bg-white py-6 px-6 shadow-2xl rounded-2xl sm:px-12 transition hover:shadow-blue-300'>
          <SignUpForm />
          <div className='mt-5'>
            <div className='relative'>
              <div className='absolute inset-0 flex items-center'>
                <div className='w-full border-t border-gray-300'></div>
              </div>
              <div className='relative flex justify-center text-sm'>
                <span className='px-3 bg-white text-gray-600 text-sm font-medium'>Already on OneConnect?</span>
              </div>
            </div>
            <div className='mt-6'>
              <Link  
                to='/login'
                className='flex justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-200'
              >
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
