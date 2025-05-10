
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';
import Logo from '@/components/Logo';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      await login(values.email);
      navigate('/verify-otp');
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminLogin = () => {
    navigate('/admin-login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-faircut-dark via-faircut-bg to-faircut-accent flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <Logo size="large" className="animate-pulse-glow" />
        </div>
        
        <Card className="cyberpunk-card bg-opacity-80 backdrop-blur-sm border-faircut/30">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center text-faircut-light neon-text">
              Welcome to Fair-Cut
            </CardTitle>
            <CardDescription className="text-center text-faircut-text/80">
              Enter your email to continue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-faircut-text">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="you@example.com"
                          {...field}
                          className="border-faircut/30 bg-black/30 text-faircut-text"
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-faircut hover:bg-faircut-light"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending OTP...' : 'Continue with Email'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button 
              variant="link" 
              onClick={handleAdminLogin}
              className="w-full text-faircut-light hover:text-faircut"
            >
              Admin Login
            </Button>
          </CardFooter>
        </Card>
      </div>
      
      <p className="mt-8 text-sm text-center text-faircut-text/60">
        Fair-Cut - No Convenience Fee, Just Movies
      </p>
    </div>
  );
};

export default LoginPage;
