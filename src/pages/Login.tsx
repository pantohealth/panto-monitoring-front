import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Lock } from 'lucide-react';
import toast from 'react-hot-toast';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>();

  const navigate = useNavigate();

  const onSubmit = async (data: LoginForm) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // In a real app, you would validate credentials here
      if (data.email && data.password) {
        toast.success('Successfully logged in!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Failed to login. Please try again.');
    }
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
            isLoading={isSubmitting}
          >
            Sign in
          </Button>
        </form>
      </div>
    </div>
  );
}