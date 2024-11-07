import { useForm } from 'react-hook-form';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import toast from 'react-hot-toast';

interface AddUserForm {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
}

export function AddUserPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset
  } = useForm<AddUserForm>();

  const password = watch('password');

  const onSubmit = async (data: AddUserForm) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('New user data:', data);
      toast.success('User added successfully!');
      reset();
    } catch (error) {
      toast.error('Failed to add user. Please try again.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Add New User</h1>
      
      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Input
            label="Username"
            {...register('username', {
              required: 'Username is required',
              minLength: {
                value: 3,
                message: 'Username must be at least 3 characters'
              }
            })}
            error={errors.username?.message}
          />

          <Input
            label="Email"
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address'
              }
            })}
            error={errors.email?.message}
          />

          <Input
            label="Password"
            type="password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            })}
            error={errors.password?.message}
          />

          <Input
            label="Confirm Password"
            type="password"
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: value =>
                value === password || 'The passwords do not match'
            })}
            error={errors.confirmPassword?.message}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              {...register('role', {
                required: 'Please select a role'
              })}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="viewer">Viewer</option>
            </select>
            {errors.role && (
              <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
            )}
          </div>

          <div className="flex justify-end">
            <Button type="submit">
              Add User
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}