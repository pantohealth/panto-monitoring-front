import { NavLink, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuthStore } from '../store/auth';
import { loginApi } from '../api/Login';
import { useUrlSwitch } from '../store/url';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<LoginForm>();

  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const { baseUrl, setBaseUrl } = useUrlSwitch();

  const handleUrlChange = (urlType:string) => {
    setBaseUrl(urlType);
    setValue("email","")
    setValue("password","")
    toast.success('URL Successfully Changed')
  };

  const loginMutation = useMutation({
    mutationFn: loginApi.login,
    onSuccess: (data) => {
      const token = data.token;
      setAuth({ token, isAuthenticated: true });
      toast.success('Successfully logged in!');
      navigate('/dashboard',{replace:true});
      
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to login. Please try again.');
    },
  });

  const onSubmit = (data: LoginForm) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
            <Lock className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Panto Admin
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label="Email address"
              type="email"
              autoComplete="email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              {...register('password', {
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters',
                },
              })}
              error={errors.password?.message}
            />
          </div>
          <Button
            type="submit"
            className="w-full"
            isLoading={loginMutation.isPending}
          >
            Sign in
          </Button>
        </form>
        <div className='hover:bg-blue-600 hover:text-white w-fit py-1 px-2 text-lg font-semibold rounded-md transition-all duration-300'>
        
        {baseUrl && (
            <NavLink to="#" onClick={() => handleUrlChange(baseUrl.includes(':5000') ? 'dash' : 'dev')}>
              Switch to {baseUrl.includes(':5000') ? 'Dash' : 'Dev'}
            </NavLink>
          )}
      </div>
      </div>
    </div>
  );
}