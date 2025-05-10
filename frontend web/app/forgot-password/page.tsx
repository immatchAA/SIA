'use client'

import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { authAPI } from '@/lib/api';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      email: ''
    }
  });
  const { toast } = useToast();

  const onSubmit = async (data: { email: string }) => {
    try {
      // Call the API to request password reset
      const response = await authAPI.forgotPassword(data.email);
      
      if (response.success) {
        toast({
          title: "Success",
          description: "Password reset instructions have been sent to your email",
        });
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to send password reset instructions",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Password reset error:', error);
      toast({
        title: "Error",
        description: "Failed to process password reset request",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Forgot Password</CardTitle>
          <CardDescription>
            Enter your email to receive password reset instructions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
            <Button type="submit" className="w-full">Send Reset Instructions</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
